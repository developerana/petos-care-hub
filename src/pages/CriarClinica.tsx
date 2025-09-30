import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Heart } from 'lucide-react';

export default function CriarClinica() {
  const [formData, setFormData] = useState({
    nomeClinica: '',
    cnpj: '',
    endereco: '',
    telefone: '',
    email: '',
    nomeAdmin: '',
    senha: '',
    confirmarSenha: '',
  });
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.senha !== formData.confirmarSenha) {
      toast({
        title: 'Erro',
        description: 'As senhas não coincidem',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Criar clínica
      const { data: clinica, error: clinicaError } = await supabase
        .from('clinicas')
        .insert([
          {
            nome: formData.nomeClinica,
            cnpj: formData.cnpj,
            endereco: formData.endereco,
            telefone: formData.telefone,
            email: formData.email,
          },
        ])
        .select()
        .single();

      if (clinicaError) throw clinicaError;

      // Criar conta do administrador
      const { error: signUpError } = await signUp({
        email: formData.email,
        password: formData.senha,
        nome: formData.nomeAdmin,
        tipo_perfil: 'administrador',
        id_clinica: clinica.id,
      });

      if (signUpError) throw signUpError;

      toast({
        title: 'Clínica criada com sucesso!',
        description: 'Verifique seu e-mail para confirmar o cadastro.',
      });

      navigate('/login');
    } catch (error: any) {
      toast({
        title: 'Erro ao criar clínica',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Heart className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Criar Conta da Clínica</CardTitle>
          <CardDescription>
            Preencha os dados para cadastrar sua clínica veterinária
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Dados da Clínica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomeClinica">Nome da Clínica *</Label>
                  <Input
                    id="nomeClinica"
                    name="nomeClinica"
                    value={formData.nomeClinica}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ *</Label>
                  <Input
                    id="cnpj"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço *</Label>
                <Input
                  id="endereco"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    name="telefone"
                    type="tel"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail Principal *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Dados do Administrador</h3>
              <div className="space-y-2">
                <Label htmlFor="nomeAdmin">Nome Completo *</Label>
                <Input
                  id="nomeAdmin"
                  name="nomeAdmin"
                  value={formData.nomeAdmin}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha *</Label>
                  <Input
                    id="senha"
                    name="senha"
                    type="password"
                    value={formData.senha}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
                  <Input
                    id="confirmarSenha"
                    name="confirmarSenha"
                    type="password"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Criando...' : 'Criar Clínica'}
            </Button>
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Já tem uma conta? </span>
              <Link 
                to="/login" 
                className="text-primary hover:underline font-medium"
              >
                Fazer Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}