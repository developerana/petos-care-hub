import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Home, Shield } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-destructive/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Heart className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">PetOS</h1>
        </div>

        <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-sm border-l-4 border-l-destructive">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto p-3 bg-destructive/10 rounded-full">
              <Shield className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl text-destructive">Acesso Negado</CardTitle>
            <p className="text-muted-foreground">
              Você não tem permissão para acessar esta página. Entre em contato com o administrador se acredita que isso é um erro.
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <Link to="/" className="block">
              <Button className="w-full h-12 text-base font-medium">
                <Home className="h-4 w-4 mr-2" />
                Voltar ao Dashboard
              </Button>
            </Link>
            
            <Link to="/login" className="block">
              <Button variant="outline" className="w-full h-12 text-base">
                Fazer Login
              </Button>
            </Link>
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