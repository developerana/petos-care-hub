import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'ADM' | 'VETERINARIO' | 'RECEPCIONISTA' | 'TUTOR';
  allowedRoles?: ('ADM' | 'VETERINARIO' | 'RECEPCIONISTA' | 'TUTOR')[];
}

interface UserProfile {
  tipo_perfil: string;
  nome: string;
  ativo: boolean;
}

export default function AuthGuard({ children, requiredRole, allowedRoles }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setLoading(false);
          return;
        }

        setUser(session.user);

        // Buscar perfil do usuário
        const { data: profile, error } = await supabase
          .from('usuarios')
          .select('tipo_perfil, nome, ativo')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error('Erro ao buscar perfil:', error);
          toast({
            title: "Erro de autenticação",
            description: "Não foi possível carregar o perfil do usuário.",
            variant: "destructive",
          });
        } else {
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Erro na verificação de autenticação:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
          setUserProfile(null);
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setUser(session.user);
          
          // Buscar perfil atualizado
          const { data: profile } = await supabase
            .from('usuarios')
            .select('tipo_perfil, nome, ativo')
            .eq('user_id', session.user.id)
            .maybeSingle();

          setUserProfile(profile);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Acesso Negado</h2>
          <p className="text-muted-foreground">Usuário não encontrado no sistema.</p>
        </div>
      </div>
    );
  }

  if (!userProfile.ativo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Conta Inativa</h2>
          <p className="text-muted-foreground">Sua conta foi desativada. Entre em contato com o administrador.</p>
        </div>
      </div>
    );
  }

  // Verificar permissões
  if (requiredRole && userProfile.tipo_perfil !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Acesso Restrito</h2>
          <p className="text-muted-foreground">Você não tem permissão para acessar esta área.</p>
        </div>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(userProfile.tipo_perfil as any)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Acesso Restrito</h2>
          <p className="text-muted-foreground">Você não tem permissão para acessar esta área.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}