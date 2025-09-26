import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Calendar, 
  Syringe, 
  Clock, 
  Search,
  Plus,
  CalendarPlus 
} from "lucide-react";
import { usePets } from "@/hooks/usePets";
import { useConsultasHoje, useProximasConsultas } from "@/hooks/useConsultas";
import { useVacinasPendentes } from "@/hooks/useVacinas";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: pets = [] } = usePets();
  const { data: consultasHoje = 0 } = useConsultasHoje();
  const { data: proximasConsultas = [] } = useProximasConsultas();
  const { data: vacinasPendentes = [] } = useVacinasPendentes();

  // Filtrar pets para busca
  const filteredPets = pets.filter(pet => 
    pet.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.tutor?.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pets mais recentes (últimos 5)
  const petsRecentes = pets.slice(0, 5);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Visão geral da clínica veterinária
            </p>
          </div>
          
          <div className="flex gap-2">
            <Link to="/agendamentos">
              <Button>
                <CalendarPlus className="h-4 w-4 mr-2" />
                Agendar Consulta
              </Button>
            </Link>
            <Link to="/agendamentos">
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Ver Agenda
              </Button>
            </Link>
          </div>
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
              <CardTitle className="text-sm font-medium">Próximos Agendamentos</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{proximasConsultas.length}</div>
              <p className="text-xs text-muted-foreground">
                Próximos 7 dias
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Barra de Pesquisa e Resultados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Buscar Pets e Tutores
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Digite o nome do pet ou tutor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {searchTerm && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredPets.length > 0 ? (
                    filteredPets.slice(0, 5).map((pet) => (
                      <div
                        key={pet.id}
                        className="flex items-center justify-between p-2 rounded-lg border bg-card hover:bg-accent cursor-pointer"
                      >
                        <div>
                          <p className="font-medium">{pet.nome}</p>
                          <p className="text-sm text-muted-foreground">
                            Tutor: {pet.tutor?.nome} | {pet.especie}
                          </p>
                        </div>
                        <Link to={`/prontuario/${pet.id}`}>
                          <Button size="sm" variant="outline">
                            Ver Prontuário
                          </Button>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhum resultado encontrado
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pets Recentes */}
          <Card>
            <CardHeader>
              <CardTitle>Pets Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {petsRecentes.length > 0 ? (
                  petsRecentes.map((pet) => (
                    <div
                      key={pet.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card"
                    >
                      <div>
                        <p className="font-medium">{pet.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          {pet.especie} | Tutor: {pet.tutor?.nome}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {format(new Date(pet.data_cadastro), "dd/MM", { locale: ptBR })}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum pet cadastrado ainda
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Próximas Consultas */}
        {proximasConsultas.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Próximas Consultas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {proximasConsultas.slice(0, 5).map((consulta) => (
                  <div
                    key={consulta.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div>
                      <p className="font-medium">
                        {consulta.pet?.nome} - {consulta.pet?.tutor?.nome}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Dr(a). {consulta.veterinario?.nome} | {consulta.veterinario?.especialidade}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {format(new Date(consulta.data_consulta), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {consulta.hora_consulta}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}