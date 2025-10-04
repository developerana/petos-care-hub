import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Calendar, 
  Syringe, 
  Bell,
  Plus,
  CalendarCheck,
  Search,
  Settings,
  Stethoscope,
  UserCog,
  Users,
  PawPrint
} from "lucide-react";
import { usePets } from "@/hooks/usePets";
import { useConsultasHoje } from "@/hooks/useConsultas";
import { useVacinasPendentes } from "@/hooks/useVacinas";
import { Input } from "@/components/ui/input";
import { AgendarConsultaDialog } from "@/components/consultas/AgendarConsultaDialog";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { data: pets = [], isLoading } = usePets();
  const { data: consultasHoje = 0 } = useConsultasHoje();
  const { data: vacinasPendentes = [] } = useVacinasPendentes();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p>Carregando...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header com busca */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Bem-vindo ao painel administrativo do PetOS
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar pets, tutores, agendamentos..."
                className="pl-10"
              />
            </div>
            <Button size="icon" variant="ghost">
              <Bell className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="ghost">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Pets</CardTitle>
              <div className="p-3 rounded-full bg-success/10">
                <Heart className="h-5 w-5 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{pets.length}</div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Consultas Hoje</CardTitle>
              <div className="p-3 rounded-full bg-info/10">
                <Calendar className="h-5 w-5 text-info" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{consultasHoje}</div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Vacinas Pendentes</CardTitle>
              <div className="p-3 rounded-full bg-warning/10">
                <Syringe className="h-5 w-5 text-warning" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{vacinasPendentes.length}</div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Próximos Agendamentos</CardTitle>
              <div className="p-3 rounded-full bg-destructive/10">
                <Bell className="h-5 w-5 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">24</div>
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <AgendarConsultaDialog>
              <Button className="bg-success hover:bg-success/90">
                <Plus className="h-4 w-4 mr-2" />
                Agendar Consulta
              </Button>
            </AgendarConsultaDialog>
            <Button className="bg-info hover:bg-info/90">
              <CalendarCheck className="h-4 w-4 mr-2" />
              Ver Agenda
            </Button>
            <Button className="bg-warning hover:bg-warning/90 text-warning-foreground">
              <Bell className="h-4 w-4 mr-2" />
              Notificações
            </Button>
          </CardContent>
        </Card>

        {/* Gerenciamento de Usuários */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Gerenciamento de Usuários</CardTitle>
            <p className="text-sm text-muted-foreground">Cadastre e gerencie os profissionais da clínica</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Equipe da Clínica */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Equipe da Clínica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Link to="/veterinarios">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col gap-2 hover:border-success hover:bg-success/5"
                  >
                    <Stethoscope className="h-5 w-5 text-success" />
                    <span className="font-medium">Cadastrar Veterinários</span>
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full h-20 flex flex-col gap-2 hover:border-info hover:bg-info/5"
                >
                  <UserCog className="h-5 w-5 text-info" />
                  <span className="font-medium">Cadastrar Recepcionistas</span>
                </Button>
              </div>
            </div>

            {/* Clientes */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Clientes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Link to="/tutores">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col gap-2 hover:border-success hover:bg-success/5"
                  >
                    <Users className="h-5 w-5 text-success" />
                    <span className="font-medium">Cadastrar Tutores</span>
                  </Button>
                </Link>
                <Link to="/pets">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col gap-2 hover:border-success hover:bg-success/5"
                  >
                    <PawPrint className="h-5 w-5 text-success" />
                    <span className="font-medium">Cadastrar Pets</span>
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Pets Recentes</CardTitle>
            <p className="text-sm text-muted-foreground">Últimos pets cadastrados no sistema</p>
          </CardHeader>
          <CardContent>
            {pets.length > 0 ? (
              <div className="space-y-3">
                {pets.slice(0, 5).map((pet, index) => (
                  <div key={pet.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-success/10">
                        <Heart className="h-5 w-5 text-success" />
                      </div>
                      <div>
                        <p className="font-semibold">{pet.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          {pet.especie} - Tutor: {pet.tutor?.nome}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={index % 2 === 0 ? "bg-success hover:bg-success" : "bg-destructive hover:bg-destructive"}>
                        {index % 2 === 0 ? "Vacinas OK" : "Vacinas Atrasadas"}
                      </Badge>
                      <Button variant="outline" size="sm">Ver Detalhes</Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Nenhum pet cadastrado ainda
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}