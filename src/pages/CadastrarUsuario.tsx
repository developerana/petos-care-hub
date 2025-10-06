import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserPlus, ArrowLeft } from "lucide-react";
import { z } from "zod";

const userSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  tipo_perfil: z.enum(["veterinario", "recepcionista", "tutor"], {
    errorMap: () => ({ message: "Selecione um tipo de perfil" }),
  }),
});

const CadastrarUsuario = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    tipo_perfil: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validated = userSchema.parse(formData);
      setLoading(true);

      // Senha padrão: PetOS@2024
      const senhasPadrao = "PetOS@2024";
      const redirectUrl = `${window.location.origin}/login`;

      // Criar usuário no Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: validated.email,
        password: senhasPadrao,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            nome: validated.nome,
            tipo_perfil: validated.tipo_perfil,
          },
        },
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          toast.error("Este e-mail já está cadastrado");
        } else {
          toast.error(authError.message);
        }
        return;
      }

      // Buscar perfil do admin logado para pegar id_clinica
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Erro ao identificar usuário logado");
        return;
      }

      const { data: adminProfile } = await supabase
        .from("profiles" as any)
        .select("id_clinica")
        .eq("id", user.id)
        .single() as { data: any };

      if (!adminProfile?.id_clinica) {
        toast.error("Erro: Clínica não identificada");
        return;
      }

      // Criar perfil do usuário
      if (authData.user) {
        const { error: profileError } = await supabase
          .from("profiles" as any)
          .insert({
            id: authData.user.id,
            nome: validated.nome,
            email: validated.email,
            tipo_perfil: validated.tipo_perfil,
            id_clinica: adminProfile.id_clinica,
          }) as { error: any };

        if (profileError) {
          toast.error("Erro ao criar perfil: " + profileError.message);
          return;
        }
      }

      toast.success(
        `Usuário ${validated.nome} cadastrado com sucesso! Senha padrão: ${senhasPadrao}`
      );
      
      // Limpar formulário
      setFormData({
        nome: "",
        email: "",
        tipo_perfil: "",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Erro ao cadastrar usuário");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-6 w-6" />
              Cadastrar Novo Usuário
            </CardTitle>
            <CardDescription>
              Cadastre veterinários e recepcionistas da clínica. A senha padrão
              será: <strong>PetOS@2024</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    placeholder="Digite o nome completo"
                    value={formData.nome}
                    onChange={(e) => handleChange("nome", e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@exemplo.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="tipo_perfil">Tipo de Perfil *</Label>
                  <Select
                    value={formData.tipo_perfil}
                    onValueChange={(value) => handleChange("tipo_perfil", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione o tipo de perfil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="veterinario">Veterinário</SelectItem>
                      <SelectItem value="recepcionista">Recepcionista</SelectItem>
                      <SelectItem value="tutor">Tutor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Informações importantes:</strong>
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside mt-2 space-y-1">
                    <li>A senha padrão será: <strong className="text-foreground">PetOS@2024</strong></li>
                    <li>O usuário deverá alterar a senha no primeiro acesso</li>
                    <li>Um e-mail de confirmação será enviado</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? "Cadastrando..." : "Cadastrar Usuário"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CadastrarUsuario;
