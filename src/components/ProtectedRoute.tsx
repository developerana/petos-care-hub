import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/components/AuthProvider";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "admin" | "veterinario" | "recepcionista" | "staff" | "tutor";
  redirectTo?: string;
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  redirectTo = "/login" 
}: ProtectedRouteProps) => {
  const { user, usuario, acessoTutor, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Verificar permissões
  if (requiredRole) {
    switch (requiredRole) {
      case "admin":
        if (usuario?.tipo_perfil !== "admin") {
          return <Navigate to="/unauthorized" replace />;
        }
        break;
      case "veterinario":
        if (usuario?.tipo_perfil !== "veterinario") {
          return <Navigate to="/unauthorized" replace />;
        }
        break;
      case "recepcionista":
        if (usuario?.tipo_perfil !== "recepcionista") {
          return <Navigate to="/unauthorized" replace />;
        }
        break;
      case "staff":
        if (!usuario) {
          return <Navigate to="/unauthorized" replace />;
        }
        break;
      case "tutor":
        if (!acessoTutor) {
          return <Navigate to="/unauthorized" replace />;
        }
        break;
    }
  }

  return <>{children}</>;
};