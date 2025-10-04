import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import TutorDashboard from "./pages/TutorDashboard";
import Login from "./pages/Login";
import Registrar from "./pages/Resgistrar";
import Tutores from "./pages/Tutores";
import Pets from "./pages/Pets";
import Veterinarios from "./pages/Veterinarios";
import Agendamentos from "./pages/Agendamentos";
import Prontuario from "./pages/ProntuarioEletronico";
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
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registrar" element={<Registrar />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tutordashboard" element={<TutorDashboard />} />
          <Route path="/tutores" element={<Tutores />} />
          <Route path="/pets" element={<Pets />} />
          <Route path="/veterinarios" element={<Veterinarios />} />
          <Route path="/agendamentos" element={<Agendamentos />} />
          <Route path="/prontuario/:petId" element={<Prontuario />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
