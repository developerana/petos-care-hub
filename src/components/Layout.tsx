import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Users, 
  Heart, 
  Stethoscope, 
  Calendar, 
  FileText,
  Menu,
  LogOut
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    // TODO: Implementar logout quando houver autenticação
    console.log("Logout");
  };

  const NavContent = ({ showToggle = false }: { showToggle?: boolean }) => (
    <nav className="flex flex-col h-full p-4">
      {showToggle && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="self-end mb-2"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
      
      <div className="pb-6 mb-6 border-b border-white/20">
        <h2 className="text-xl font-bold text-foreground">PetOS</h2>
        <p className="text-sm text-muted-foreground">Administrador</p>
      </div>
      
      <div className="flex-1 space-y-1">
        {navItems.map(({ path, label, icon: Icon }) => (
          <Link key={path} to={path}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-foreground hover:bg-white/10 dark:hover:bg-white/5",
                location.pathname === path && "bg-white/20 dark:bg-white/10 font-medium"
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Button>
          </Link>
        ))}
      </div>

      <Button
        variant="ghost"
        onClick={handleLogout}
        className="w-full justify-start gap-3 text-foreground hover:bg-destructive/10 hover:text-destructive mt-auto"
      >
        <LogOut className="h-5 w-5" />
        Sair
      </Button>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "hidden md:flex flex-col fixed left-0 top-0 h-full transition-all duration-300 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border-r border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]",
          sidebarOpen ? "w-64" : "w-0 overflow-hidden"
        )}
      >
        <NavContent showToggle={true} />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-40">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border-r border-white/20">
          <NavContent />
        </SheetContent>
      </Sheet>


      {/* Main Content */}
      <main 
        className={cn(
          "flex-1 overflow-auto transition-all duration-300",
          sidebarOpen ? "md:ml-64" : "md:ml-0"
        )}
      >
        <div className="container mx-auto p-6 md:p-8 mt-16 md:mt-0">
          {children}
        </div>
      </main>
    </div>
  );
}