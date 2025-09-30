import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Dashboard from "./pages/Dashboard";
import Tutores from "./pages/Tutores";
import Pets from "./pages/Pets";
import Veterinarios from "./pages/Veterinarios";
import Agendamentos from "./pages/Agendamentos";
import Prontuario from "./pages/Prontuario";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import CriarClinica from "./pages/CriarClinica";
import EsqueciSenha from "./pages/EsqueciSenha";
import DashboardTutor from "./pages/DashboardTutor";
import DashboardAdmin from "./pages/DashboardAdmin";
import GerenciarUsuarios from "./pages/GerenciarUsuarios";
import NovoUsuario from "./pages/NovoUsuario";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const AppRoutes = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/criar-clinica" element={<CriarClinica />} />
      <Route path="/esqueci-senha" element={<EsqueciSenha />} />

      {/* Rota raiz - redireciona baseado no perfil */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            {profile?.tipo_perfil === 'tutor' ? (
              <DashboardTutor />
            ) : profile?.tipo_perfil === 'administrador' ? (
              <DashboardAdmin />
            ) : (
              <Dashboard />
            )}
          </ProtectedRoute>
        }
      />

      {/* Rotas do sistema (veterinários e recepcionistas) */}
      <Route
        path="/tutores"
        element={
          <ProtectedRoute allowedRoles={['administrador', 'veterinario', 'recepcionista']}>
            <Tutores />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pets"
        element={
          <ProtectedRoute allowedRoles={['administrador', 'veterinario', 'recepcionista']}>
            <Pets />
          </ProtectedRoute>
        }
      />
      <Route
        path="/veterinarios"
        element={
          <ProtectedRoute allowedRoles={['administrador', 'recepcionista']}>
            <Veterinarios />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agendamentos"
        element={
          <ProtectedRoute>
            <Agendamentos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/prontuario/:petId"
        element={
          <ProtectedRoute>
            <Prontuario />
          </ProtectedRoute>
        }
      />

      {/* Rotas administrativas */}
      <Route
        path="/admin/usuarios"
        element={
          <ProtectedRoute allowedRoles={['administrador']}>
            <GerenciarUsuarios />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/usuarios/novo"
        element={
          <ProtectedRoute allowedRoles={['administrador']}>
            <NovoUsuario />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
