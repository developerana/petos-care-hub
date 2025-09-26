import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Heart, 
  Calendar, 
  Syringe, 
  Clock
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
          <p>Carregando...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo, {usuario?.nome} ({usuario?.tipo_perfil})
          </p>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Pets</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pets.length}</div>
              <p className="text-xs text-muted-foreground">
                Pets cadastrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Consultas Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{consultasHoje}</div>
              <p className="text-xs text-muted-foreground">
                Agendadas para hoje
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vacinas Pendentes</CardTitle>
              <Syringe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vacinasPendentes.length}</div>
              <p className="text-xs text-muted-foreground">
                Requerem atenção
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sistema Ativo</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">OK</div>
              <p className="text-xs text-muted-foreground">
                Funcionando
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Pets Simples */}
        <Card>
          <CardHeader>
            <CardTitle>Pets Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            {pets.length > 0 ? (
              <div className="space-y-2">
                {pets.slice(0, 5).map((pet) => (
                  <div key={pet.id} className="p-2 border rounded">
                    <p className="font-medium">{pet.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      {pet.especie} - Tutor: {pet.tutor?.nome}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                Nenhum pet cadastrado ainda
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}