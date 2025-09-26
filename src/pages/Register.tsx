import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart } from "lucide-react";
import { useAuthContext } from "@/components/AuthProvider";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nome: "",
    tipo_perfil: "",
  });
  const [loading, setLoading] = useState(false);
  const { signUp, user } = useAuthContext();

  // Redirecionar se já estiver logado
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    setLoading(true);
    
    try {
      await signUp(formData.email, formData.password, {
        nome: formData.nome,
        tipo_perfil: formData.tipo_perfil,
        user_type: "staff",
      });
    } catch (error) {
      // Error já tratado no hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-primary/10 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
            <Heart className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">PetOS</h1>
            <p className="text-muted-foreground mt-2">Cadastro de Funcionário</p>
          </div>
        </div>

        <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-4 pb-6">
            <CardTitle className="text-2xl font-bold text-center">Criar Conta - Funcionário</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm font-medium">Nome Completo</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  className="h-12 border-0 bg-muted/50 focus:bg-background transition-colors"
                  placeholder="Digite seu nome completo"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="h-12 border-0 bg-muted/50 focus:bg-background transition-colors"
                  placeholder="admin@clinic.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo_perfil" className="text-sm font-medium">Tipo de Perfil</Label>
                <Select value={formData.tipo_perfil} onValueChange={(value) => setFormData({...formData, tipo_perfil: value})}>
                  <SelectTrigger className="h-12 border-0 bg-muted/50 focus:bg-background">
                    <SelectValue placeholder="Selecione o perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="administrador">Administrador</SelectItem>
                    <SelectItem value="veterinario">Veterinário</SelectItem>
                    <SelectItem value="recepcionista">Recepcionista</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="h-12 border-0 bg-muted/50 focus:bg-background transition-colors"
                  placeholder="Crie uma senha segura"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="h-12 border-0 bg-muted/50 focus:bg-background transition-colors"
                  placeholder="Repita sua senha"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold shadow-lg"
                disabled={loading}
              >
                {loading ? "Criando conta..." : "Criar Conta"}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Faça login aqui
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            © 2024 PetOS - Sistema de Gestão Veterinária
          </p>
        </div>
      </div>
    </div>
  );
}