import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft } from 'lucide-react';

export default function NovoUsuario() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    tipo_perfil: 'recepcionista',
  });
  const [loading, setLoading] = useState(false);
  const { signUp, profile } = useAuth();
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
    setLoading(true);

    try {
      const { error } = await signUp({
        email: formData.email,
        password: formData.senha,
        nome: formData.nome,
        tipo_perfil: formData.tipo_perfil,
        id_clinica: profile?.id_clinica || undefined,
      });

      if (error) throw error;

      toast({
        title: 'Usuário criado com sucesso!',
        description: 'Um e-mail de confirmação foi enviado.',
      });

      navigate('/admin/usuarios');
    } catch (error: any) {
      toast({
        title: 'Erro ao criar usuário',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin/usuarios')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Novo Usuário</h1>
            <p className="text-muted-foreground">Criar um novo usuário da clínica</p>
          </div>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Dados do Usuário</CardTitle>
            <CardDescription>
              Preencha as informações do novo usuário
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
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

              <div className="space-y-2">
                <Label htmlFor="tipo_perfil">Tipo de Perfil *</Label>
                <Select
                  value={formData.tipo_perfil}
                  onValueChange={(value) => setFormData({ ...formData, tipo_perfil: value })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recepcionista">Recepcionista</SelectItem>
                    <SelectItem value="veterinario">Veterinário</SelectItem>
                    <SelectItem value="administrador">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">Senha Temporária *</Label>
                <Input
                  id="senha"
                  name="senha"
                  type="password"
                  value={formData.senha}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="O usuário deverá alterar no primeiro acesso"
                />
              </div>

              <div className="flex space-x-2 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Criando...' : 'Criar Usuário'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/usuarios')}
                  disabled={loading}
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
}