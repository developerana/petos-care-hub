import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { z } from "zod";

const registerSchema = z.object({
  clinicName: z.string().min(3, "Nome da clínica deve ter no mínimo 3 caracteres").max(100),
  cnpj: z.string().min(14, "CNPJ inválido").max(18),
  address: z.string().min(5, "Endereço inválido").max(200),
  phone: z.string().min(10, "Telefone inválido").max(20),
  email: z.string().email("E-mail inválido").trim(),
  adminName: z.string().min(3, "Nome completo deve ter no mínimo 3 caracteres").max(100),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clinicName: "",
    cnpj: "",
    address: "",
    phone: "",
    email: "",
    adminName: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validated = registerSchema.parse(formData);
      setLoading(true);

      const redirectUrl = `${window.location.origin}/`;

      const { error } = await supabase.auth.signUp({
        email: validated.email,
        password: validated.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            clinic_name: validated.clinicName,
            cnpj: validated.cnpj,
            address: validated.address,
            phone: validated.phone,
            admin_name: validated.adminName,
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("Este e-mail já está cadastrado");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success("Conta criada com sucesso!");
        navigate("/auth");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Erro ao criar conta");
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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-md space-y-6 py-8 animate-fade-in">
          <div className="text-center">
            <Heart className="w-12 h-12 mx-auto mb-4 text-primary lg:hidden" />
            <h2 className="text-2xl font-bold text-foreground">Crie sua conta no PetOS</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Faça o primeiro passo para digitalizar o seu dia a dia
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Dados da Clínica</h3>
              
              <div>
                <Label htmlFor="clinicName">Nome da Clínica *</Label>
                <Input
                  id="clinicName"
                  name="clinicName"
                  placeholder="Digite o nome completo"
                  value={formData.clinicName}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  name="cnpj"
                  placeholder="00.000.000/0000-00"
                  value={formData.cnpj}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="address">Endereço *</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Rua, número, bairro, cidade"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="(00) 00000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Dados do Administrador</h3>
              
              <div>
                <Label htmlFor="adminName">Nome Completo *</Label>
                <Input
                  id="adminName"
                  name="adminName"
                  placeholder="Digite seu nome completo"
                  value={formData.adminName}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Senha *</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Digite a senha novamente"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Criando..." : "Criar Clínica"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Já tem uma conta? </span>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Fazer Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
