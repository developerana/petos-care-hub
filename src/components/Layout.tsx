import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Users, 
  Heart, 
  Stethoscope, 
  Calendar, 
  Menu,
  LogOut,
  Settings
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuthContext } from "@/components/AuthProvider";

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: "/", label: "Dashboard", icon: Home },
  { path: "/tutores", label: "Tutores", icon: Users },
  { path: "/pets", label: "Pets", icon: Heart },
  { path: "/veterinarios", label: "Veterinários", icon: Stethoscope },
  { path: "/agendamentos", label: "Agendamentos", icon: Calendar },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { usuario, signOut } = useAuthContext();

  const NavContent = () => (
    <div className="flex flex-col h-full bg-sidebar">
      {/* Logo e Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Heart className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-sidebar-foreground">PetOS</h2>
            <p className="text-xs text-sidebar-foreground/70">Sistema Veterinário</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link key={path} to={path} className="block">
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-11 text-left font-medium transition-all",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            </Link>
          );
        })}
      </nav>
      
      {/* User Info e Logout */}
      <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/50">
        <div className="flex items-center gap-3 p-3 rounded-lg mb-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
              {usuario?.nome?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {usuario?.nome}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant={usuario?.tipo_perfil === 'administrador' ? 'default' : 'secondary'} 
                className="text-xs"
              >
                {usuario?.tipo_perfil}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Settings className="h-4 w-4" />
            Configurações
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 border-r border-sidebar-border">
        <NavContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="md:hidden fixed top-4 left-4 z-40 bg-background/80 backdrop-blur-sm border shadow-lg"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0 bg-sidebar">
          <NavContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-muted/30">
        <div className="container mx-auto p-6 md:p-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}