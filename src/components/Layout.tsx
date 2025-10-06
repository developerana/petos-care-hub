import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Users, 
  Heart, 
  Stethoscope, 
  Calendar, 
  LogOut,
  Menu
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: Home },
  { path: "/tutores", label: "Tutores", icon: Users },
  { path: "/pets", label: "Pets", icon: Heart },
  { path: "/veterinarios", label: "Veterinários", icon: Stethoscope },
  { path: "/agendamentos", label: "Agendamentos", icon: Calendar },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles" as any)
          .select("nome, tipo_perfil")
          .eq("id", user.id)
          .single() as { data: any };

        if (profile) {
          setUserName(profile.nome || "");
          setUserType(profile.tipo_perfil || "");
        }
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado com sucesso!");
    navigate("/login");
  };

  const NavContent = () => (
    <nav className="space-y-1 p-4">
      <div className="pb-6 mb-6 border-b border-sidebar-border">
        <h2 className="text-xl font-bold text-sidebar-foreground">PetOS</h2>
        <p className="text-sm text-sidebar-foreground/70">{userName}</p>
        <p className="text-xs text-sidebar-foreground/50 capitalize">{userType}</p>
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
      <aside className="hidden md:block w-64 bg-sidebar">
        <NavContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-40">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <NavContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}