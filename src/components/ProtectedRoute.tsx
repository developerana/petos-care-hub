import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedProfiles?: string[];
}

export default function ProtectedRoute({ children, allowedProfiles }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          loadProfile(session.user.id);
        } else {
          setAuthenticated(false);
          setUserProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      // Tentar buscar no profiles
      const { data: profile } = await supabase
        .from("profiles")
        .select("tipo_perfil")
        .eq("id", userId)
        .maybeSingle();

      if (profile) {
        setUserProfile(profile.tipo_perfil);
        setAuthenticated(true);
        return;
      }

      // Se não encontrou no profiles, verificar se é tutor
      const { data: acessoTutor } = await supabase
        .from("acessos_tutores")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (acessoTutor) {
        setUserProfile("tutor");
        setAuthenticated(true);
        return;
      }

      setAuthenticated(false);
      setUserProfile(null);
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      setAuthenticated(false);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await loadProfile(session.user.id);
      } else {
        setAuthenticated(false);
        setLoading(false);
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      setAuthenticated(false);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Redirecionar tutores para o dashboard específico
  if (userProfile === "tutor" && location.pathname === "/") {
    return <Navigate to="/dashboard-tutor" replace />;
  }

  // Redirecionar staff para o dashboard principal se tentarem acessar dashboard tutor
  if (userProfile !== "tutor" && location.pathname === "/dashboard-tutor") {
    return <Navigate to="/" replace />;
  }

  // Verificar permissões por perfil
  if (allowedProfiles && userProfile && !allowedProfiles.includes(userProfile)) {
    if (userProfile === "tutor") {
      return <Navigate to="/dashboard-tutor" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
