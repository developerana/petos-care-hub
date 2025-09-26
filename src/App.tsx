import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Tutores from "./pages/Tutores";
import Pets from "./pages/Pets";
import Veterinarios from "./pages/Veterinarios";
import Agendamentos from "./pages/Agendamentos";
import Prontuario from "./pages/Prontuario";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PortalTutor from "./pages/PortalTutor";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Rotas protegidas para funcionários */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute requiredRole="staff">
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tutores" 
              element={
                <ProtectedRoute requiredRole="staff">
                  <Tutores />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pets" 
              element={
                <ProtectedRoute requiredRole="staff">
                  <Pets />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/veterinarios" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <Veterinarios />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agendamentos" 
              element={
                <ProtectedRoute requiredRole="staff">
                  <Agendamentos />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/prontuario/:petId" 
              element={
                <ProtectedRoute requiredRole="staff">
                  <Prontuario />
                </ProtectedRoute>
              } 
            />
            
            {/* Portal do Tutor */}
            <Route 
              path="/portal" 
              element={
                <ProtectedRoute requiredRole="tutor">
                  <PortalTutor />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
