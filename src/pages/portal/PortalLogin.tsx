import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Heart, User, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

const signupSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  telefone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
});

export default function PortalLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
    nome: "",
    telefone: "",
  });
  
  const { toast } = useToast();

  // Verificar se o usuário já está logado
  useState(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Verificar se é um tutor
        supabase
          .from('acessos_tutores')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle()
          .then(({ data }) => {
            if (data) {
              setUser(session.user);
            }
          });
      }
    });
  });

  if (user) {
    return <Navigate to="/portal/dashboard" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      loginSchema.parse(loginForm);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Erro de validação",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });
      
      if (error) {
        toast({
          title: "Erro no login",
          description: error.message === "Invalid login credentials" 
            ? "Email ou senha incorretos" 
            : error.message,
          variant: "destructive",
        });
        return;
      }

      // Verificar se é um tutor
      const { data: acesso } = await supabase
        .from('acessos_tutores')
        .select('*')
        .eq('user_id', data.user?.id)
        .maybeSingle();

      if (!acesso) {
        await supabase.auth.signOut();
        toast({
          title: "Acesso negado",
          description: "Este usuário não tem acesso ao portal do tutor.",
          variant: "destructive",
        });
        return;
      }

      if (!acesso.ativo) {
        await supabase.auth.signOut();
        toast({
          title: "Conta inativa",
          description: "Sua conta foi desativada. Entre em contato com a clínica.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Login realizado",
        description: "Bem-vindo ao Portal do Tutor!",
      });
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      signupSchema.parse(signupForm);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Erro de validação",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);
    try {
      // Primeiro criar o tutor
      const { data: tutorData, error: tutorError } = await supabase
        .from('tutores')
        .insert({
          nome: signupForm.nome,
          email: signupForm.email,
          telefone: signupForm.telefone,
        })
        .select()
        .single();

      if (tutorError) {
        toast({
          title: "Erro no cadastro",
          description: "Erro ao criar perfil do tutor.",
          variant: "destructive",
        });
        return;
      }

      // Criar usuário de autenticação
      const redirectUrl = `${window.location.origin}/portal/dashboard`;
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: signupForm.email,
        password: signupForm.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            nome: signupForm.nome,
            user_type: 'tutor'
          }
        }
      });

      if (authError) {
        // Reverter criação do tutor
        await supabase.from('tutores').delete().eq('id', tutorData.id);
        
        toast({
          title: "Erro no cadastro",
          description: authError.message === "User already registered" 
            ? "Este email já está cadastrado" 
            : authError.message,
          variant: "destructive",
        });
        return;
      }

      // Criar acesso do tutor
      if (authData.user) {
        const { error: acessoError } = await supabase
          .from('acessos_tutores')
          .insert({
            id_tutor: tutorData.id,
            email: signupForm.email,
            user_id: authData.user.id,
            ativo: true,
          });

        if (acessoError) {
          console.error('Erro ao criar acesso do tutor:', acessoError);
        }
      }

      toast({
        title: "Cadastro realizado",
        description: "Conta criada com sucesso! Verifique seu email para confirmar.",
      });
      
      setSignupForm({
        email: "",
        password: "",
        nome: "",
        telefone: "",
      });
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header com botão voltar */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao site
          </Link>
        </div>

        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <User className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">Portal do Tutor</h1>
          <p className="text-muted-foreground">Acompanhe a saúde dos seus pets</p>
        </div>

        <Card className="shadow-green">
          <CardHeader>
            <CardTitle className="text-center">Acesso ao Portal</CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais ou crie uma nova conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Cadastro</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Sua senha"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-nome">Nome Completo</Label>
                    <Input
                      id="signup-nome"
                      type="text"
                      placeholder="Seu nome completo"
                      value={signupForm.nome}
                      onChange={(e) => setSignupForm({ ...signupForm, nome: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-telefone">Telefone</Label>
                    <Input
                      id="signup-telefone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={signupForm.telefone}
                      onChange={(e) => setSignupForm({ ...signupForm, telefone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Senha</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Criando conta..." : "Criar Conta"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-muted-foreground text-sm">
            É funcionário da clínica? <Link to="/auth" className="text-primary font-medium hover:underline">Acesse o sistema interno</Link>
          </p>
        </div>
      </div>
    </div>
  );
}