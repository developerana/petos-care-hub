import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Heart className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">PetOS</h1>
        </div>

        <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto text-6xl font-bold text-primary">404</div>
            <CardTitle className="text-2xl">Página não encontrada</CardTitle>
            <p className="text-muted-foreground">
              A página que você está procurando não existe ou foi movida.
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <Link to="/" className="block">
              <Button className="w-full h-12 text-base font-medium">
                <Home className="h-4 w-4 mr-2" />
                Voltar ao Dashboard
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              onClick={() => window.history.back()} 
              className="w-full h-12 text-base"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar à página anterior
            </Button>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            © 2024 PetOS - Sistema de Gestão Veterinária
          </p>
        </div>
      </div>
    </div>
  );
}
