import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Heart, ArrowLeft } from 'lucide-react';

export default function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await resetPassword(email);

      if (error) {
        toast({
          title: 'Erro',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        setEmailSent(true);
        toast({
          title: 'E-mail enviado!',
          description: 'Verifique sua caixa de entrada para redefinir sua senha.',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro inesperado',
        description: 'Ocorreu um erro ao enviar o e-mail. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Heart className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Recuperar Senha</CardTitle>
          <CardDescription>
            {emailSent
              ? 'Instruções enviadas para seu e-mail'
              : 'Digite seu e-mail para receber instruções'}
          </CardDescription>
        </CardHeader>
        {!emailSent ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Instruções'}
              </Button>
              <Link to="/login" className="flex items-center justify-center text-sm text-primary hover:underline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para o login
              </Link>
            </CardFooter>
          </form>
        ) : (
          <CardFooter className="flex flex-col space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Se o e-mail estiver cadastrado em nosso sistema, você receberá as instruções para
              redefinir sua senha.
            </p>
            <Link to="/login">
              <Button className="w-full">
                Voltar para o Login
              </Button>
            </Link>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}