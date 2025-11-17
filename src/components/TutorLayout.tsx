import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Home, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TutorLayoutProps {
  children: ReactNode;
}

const TutorLayout = ({ children }: TutorLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const navItems = [
    { path: "/tutordashboard", label: "Dashboard", icon: Home },
    { path: "/agendamentos", label: "Agendamentos", icon: Calendar },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    });
    navigate("/login");
  };

  const NavContent = () => (
    <nav className="space-y-1 p-4">
      <div className="pb-6 mb-6 border-b border-sidebar-border">
        <h2 className="text-xl font-bold text-sidebar-foreground">Área do Tutor</h2>
        <p className="text-sm text-sidebar-foreground/70 mt-1">Portal do Pet</p>
      </div>
      {navItems.map(({ path, label, icon: Icon }) => (
        <Link key={path} to={path}>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent",
              location.pathname === path && "bg-sidebar-accent text-sidebar-foreground font-medium"
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Button>
        </Link>
      ))}
      
      <div className="pt-6 mt-6 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Sair
        </Button>
      </div>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-sidebar border-r border-sidebar-border">
        <NavContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:pl-64">
        {children}
      </div>
    </div>
  );
};

export default TutorLayout;
