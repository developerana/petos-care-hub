import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Cadastro state
  const [signupNome, setSignupNome] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupTipoPerfil, setSignupTipoPerfil] = useState("recepcionista");
  const [clinicaNome, setClinicaNome] = useState("");
  const [clinicaCnpj, setClinicaCnpj] = useState("");
  const [clinicaEndereco, setClinicaEndereco] = useState("");
  const [clinicaTelefone, setClinicaTelefone] = useState("");
  const [clinicaEmail, setClinicaEmail] = useState("");

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    } catch (error) {
      console.error("Erro ao verificar usuário:", error);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) throw error;

      if (data.session) {
        // Verificar tipo de perfil e redirecionar
        const { data: profile } = await supabase
          .from("profiles")
          .select("tipo_perfil")
          .eq("id", data.session.user.id)
          .single();

        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando...",
        });

        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Primeiro, criar a clínica
      const { data: clinica, error: clinicaError } = await supabase
        .from("clinicas")
        .insert({
          nome: clinicaNome,
          cnpj: clinicaCnpj,
          endereco: clinicaEndereco,
          telefone: clinicaTelefone,
          email: clinicaEmail,
        })
        .select()
        .single();

      if (clinicaError) throw clinicaError;

      // Criar o usuário
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            nome: signupNome,
            tipo_perfil: signupTipoPerfil,
            id_clinica: clinica.id,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Verifique seu e-mail para confirmar o cadastro.",
      });

      // Limpar formulário
      setSignupNome("");
      setSignupEmail("");
      setSignupPassword("");
      setClinicaNome("");
      setClinicaCnpj("");
      setClinicaEndereco("");
      setClinicaTelefone("");
      setClinicaEmail("");
    } catch (error: any) {
      toast({
        title: "Erro ao criar cadastro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sistema Veterinário</CardTitle>
          <CardDescription className="text-center">
            Faça login ou cadastre sua clínica
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Cadastrar Clínica</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">E-mail</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-4 border-b pb-4">
                  <h3 className="font-semibold text-sm">Dados da Clínica</h3>
                  <div className="space-y-2">
                    <Label htmlFor="clinica-nome">Nome da Clínica</Label>
                    <Input
                      id="clinica-nome"
                      placeholder="Clínica Veterinária Exemplo"
                      value={clinicaNome}
                      onChange={(e) => setClinicaNome(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clinica-cnpj">CNPJ</Label>
                    <Input
                      id="clinica-cnpj"
                      placeholder="00.000.000/0000-00"
                      value={clinicaCnpj}
                      onChange={(e) => setClinicaCnpj(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clinica-endereco">Endereço</Label>
                    <Input
                      id="clinica-endereco"
                      placeholder="Rua Exemplo, 123"
                      value={clinicaEndereco}
                      onChange={(e) => setClinicaEndereco(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clinica-telefone">Telefone</Label>
                    <Input
                      id="clinica-telefone"
                      placeholder="(00) 00000-0000"
                      value={clinicaTelefone}
                      onChange={(e) => setClinicaTelefone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clinica-email">E-mail da Clínica</Label>
                    <Input
                      id="clinica-email"
                      type="email"
                      placeholder="contato@clinica.com"
                      value={clinicaEmail}
                      onChange={(e) => setClinicaEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Seus Dados</h3>
                  <div className="space-y-2">
                    <Label htmlFor="signup-nome">Nome Completo</Label>
                    <Input
                      id="signup-nome"
                      placeholder="Seu nome"
                      value={signupNome}
                      onChange={(e) => setSignupNome(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">E-mail</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Senha</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipo-perfil">Seu Perfil</Label>
                    <Select value={signupTipoPerfil} onValueChange={setSignupTipoPerfil}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="administrador">Administrador</SelectItem>
                        <SelectItem value="veterinario">Veterinário</SelectItem>
                        <SelectItem value="recepcionista">Recepcionista</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cadastrando...
                    </>
                  ) : (
                    "Cadastrar"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
