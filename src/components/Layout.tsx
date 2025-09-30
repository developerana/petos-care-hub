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
  X
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

  const NavContent = () => (
    <nav className="space-y-1 p-4">
      <div className="pb-6 mb-6 border-b border-white/20">
        <h2 className="text-xl font-bold text-foreground">PetOS</h2>
        <p className="text-sm text-muted-foreground">Administrador</p>
      </div>
      {navItems.map(({ path, label, icon: Icon }) => (
        <Link key={path} to={path}>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-foreground hover:bg-white/10",
              location.pathname === path && "bg-white/20 text-foreground font-medium"
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Button>
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-background relative">
      {/* Desktop Sidebar com glassmorphism */}
      <aside
        className={cn(
          "hidden md:block fixed left-0 top-0 h-full z-30 transition-all duration-300",
          "bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border-r border-white/20",
          "shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]",
          sidebarOpen ? "w-64" : "w-0 -translate-x-full"
        )}
      >
        <NavContent />
      </aside>

      {/* Toggle Button para Desktop */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={cn(
          "hidden md:flex fixed top-4 z-40 transition-all duration-300 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 hover:bg-white/60",
          sidebarOpen ? "left-[260px]" : "left-4"
        )}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

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
        <div className="container mx-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}