import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido").trim(),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = loginSchema.parse({ email, password });
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: validated.email,
        password: validated.password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("E-mail ou senha incorretos");
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (data.user) {
        // Buscar perfil do usuário
        const { data: profile, error: profileError } = await supabase
          .from("profiles" as any)
          .select("tipo_perfil")
          .eq("id", data.user.id)
          .single() as { data: any; error: any };

        if (profileError) {
          toast.error("Erro ao buscar perfil do usuário");
          return;
        }

        toast.success("Login realizado com sucesso!");

        // Redirecionar baseado no tipo de perfil
        switch (profile?.tipo_perfil) {
          case "tutor":
            navigate("/tutordashboard");
            break;
          case "administrador":
          case "veterinario":
          case "recepcionista":
            navigate("/dashboard");
            break;
          default:
            navigate("/");
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Erro ao fazer login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Gradient */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E4145] via-[#2CA677] to-[#8ED49A]" />
        <div className="relative z-10 flex items-center justify-center w-full">
          <div className="text-center text-white p-8">
            <Heart className="w-20 h-20 mx-auto mb-4 opacity-80" />
            <h1 className="text-4xl font-bold mb-2">PetOS</h1>
            <p className="text-lg opacity-90">Sistema de Gestão Veterinária</p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center lg:hidden mb-8">
            <Heart className="w-16 h-16 mx-auto mb-4 text-primary" />
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-foreground">Acesse sua conta</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Selecione gratuitamente onde atender o seu dia a dia
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  className="text-primary hover:text-primary/80 transition-colors"
                  onClick={() => toast.info("Funcionalidade em desenvolvimento")}
                >
                  Esqueceu sua senha?
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Entrando..." : "ENTRAR"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Não tem uma conta? </span>
              <button
                type="button"
                onClick={() => navigate("/registrar")}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Crie uma!
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
