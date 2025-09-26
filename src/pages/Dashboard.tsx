import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Calendar, 
  Syringe, 
  Clock,
  Plus,
  CalendarDays,
  Bell,
  Activity,
  Users,
  Stethoscope
} from "lucide-react";
import { usePets } from "@/hooks/usePets";
import { useConsultasHoje } from "@/hooks/useConsultas";
import { useVacinasPendentes } from "@/hooks/useVacinas";
import { useAuthContext } from "@/components/AuthProvider";

export default function Dashboard() {
  const { data: pets = [], isLoading } = usePets();
  const { data: consultasHoje = 0 } = useConsultasHoje();
  const { data: vacinasPendentes = [] } = useVacinasPendentes();
  const { usuario } = useAuthContext();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 animate-pulse text-primary" />
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header com boas-vindas */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Bem-vindo ao painel administrativo do PetOS, {usuario?.nome}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success" className="hidden sm:flex">
              <Clock className="h-3 w-3 mr-1" />
              Sistema Ativo
            </Badge>
          </div>
        </div>

        {/* Cards de Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/30 hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Pets</CardTitle>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Heart className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{pets.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Pets cadastrados no sistema
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-info/5 hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Consultas Hoje</CardTitle>
              <div className="p-2 bg-info/10 rounded-lg">
                <Calendar className="h-5 w-5 text-info" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{consultasHoje}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Agendamentos para hoje
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-warning/5 hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Vacinas Pendentes</CardTitle>
              <div className="p-2 bg-warning/10 rounded-lg">
                <Syringe className="h-5 w-5 text-warning" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{vacinasPendentes.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Requerem atenção urgente
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-destructive/5 hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Próximos Agendamentos</CardTitle>
              <div className="p-2 bg-destructive/10 rounded-lg">
                <Bell className="h-5 w-5 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">24</div>
              <p className="text-xs text-muted-foreground mt-1">
                Nos próximos 7 dias
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Seção de Ações Rápidas */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Plus className="h-5 w-5 text-primary" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-auto p-4 flex flex-col items-center gap-3 bg-primary hover:bg-primary/90">
                <Plus className="h-6 w-6" />
                <span className="text-sm font-medium">Agendar Consulta</span>
              </Button>
              <Button variant="info" className="h-auto p-4 flex flex-col items-center gap-3">
                <CalendarDays className="h-6 w-6" />
                <span className="text-sm font-medium">Ver Agenda</span>
              </Button>
              <Button variant="warning" className="h-auto p-4 flex flex-col items-center gap-3">
                <Bell className="h-6 w-6" />
                <span className="text-sm font-medium">Notificações</span>
              </Button>
              <Button variant="secondary" className="h-auto p-4 flex flex-col items-center gap-3">
                <Activity className="h-6 w-6" />
                <span className="text-sm font-medium">Relatórios</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Seções Inferiores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gerenciamento de Usuários */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Gerenciamento de Usuários</CardTitle>
              <p className="text-sm text-muted-foreground">
                Cadastre e gerencie os profissionais da clínica
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
                  <div className="flex items-center justify-center mb-2">
                    <Stethoscope className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium text-sm">Cadastrar Veterinários</h4>
                </div>
                <div className="text-center p-4 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-6 w-6 text-info" />
                  </div>
                  <h4 className="font-medium text-sm">Cadastrar Recepcionistas</h4>
                </div>
                <div className="text-center p-4 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium text-sm">Cadastrar Tutores</h4>
                </div>
                <div className="text-center p-4 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
                  <div className="flex items-center justify-center mb-2">
                    <Heart className="h-6 w-6 text-success" />
                  </div>
                  <h4 className="font-medium text-sm">Cadastrar Pets</h4>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pets Recentes */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Pets Recentes</CardTitle>
              <p className="text-sm text-muted-foreground">
                Últimos pets cadastrados no sistema
              </p>
            </CardHeader>
            <CardContent>
              {pets.length > 0 ? (
                <div className="space-y-4">
                  {pets.slice(0, 3).map((pet) => (
                    <div 
                      key={pet.id} 
                      className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <Heart className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{pet.nome}</p>
                          <p className="text-xs text-muted-foreground">
                            {pet.especie} - Tutor: {pet.tutor?.nome}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="success" className="text-xs">
                          Vacinas OK
                        </Badge>
                        <Button variant="outline" size="sm" className="text-xs px-2 py-1">
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Nenhum pet cadastrado ainda
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Cadastrar Primeiro Pet
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}