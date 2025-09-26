import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Calendar, 
  Syringe, 
  MessageCircle,
  Bell,
  LogOut,
  Search
} from "lucide-react";
import { useAuthContext } from "@/components/AuthProvider";
import { usePets } from "@/hooks/usePets";
import { useConsultas } from "@/hooks/useConsultas";
import { useVacinas } from "@/hooks/useVacinas";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function PortalTutor() {
  const [searchTerm, setSearchTerm] = useState("");
  const { acessoTutor, signOut } = useAuthContext();
  const { data: pets = [] } = usePets();
  const { data: consultas = [] } = useConsultas();
  const { data: vacinas = [] } = useVacinas();

  // Filtrar dados do tutor
  const meusPets = pets.filter(pet => pet.id_tutor === acessoTutor?.id_tutor);
  const minhasConsultas = consultas.filter(consulta => 
    meusPets.some(pet => pet.id === consulta.id_pet)
  );
  const minhasVacinas = vacinas.filter(vacina => 
    meusPets.some(pet => pet.id === vacina.id_pet)
  );

  // Próximas consultas
  const proximasConsultas = minhasConsultas
    .filter(consulta => 
      consulta.status === "Agendada" && 
      new Date(consulta.data_consulta) >= new Date()
    )
    .slice(0, 3);

  // Vacinas pendentes
  const vacinasPendentes = minhasVacinas
    .filter(vacina => 
      vacina.proxima_dose && 
      new Date(vacina.proxima_dose) <= new Date()
    )
    .slice(0, 3);

  const calcularIdade = (dataNascimento: string) => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    const diffTime = Math.abs(hoje.getTime() - nascimento.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} dias`;
    } else if (diffDays < 365) {
      return `${Math.floor(diffDays / 30)} meses`;
    } else {
      return `${Math.floor(diffDays / 365)} anos`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-red-500" />
              <div>
                <h1 className="text-2xl font-bold">Portal do Tutor</h1>
                <p className="text-sm text-muted-foreground">
                  Bem-vindo, {acessoTutor?.tutor?.nome}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meus Pets</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{meusPets.length}</div>
              <p className="text-xs text-muted-foreground">
                Pets cadastrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximas Consultas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{proximasConsultas.length}</div>
              <p className="text-xs text-muted-foreground">
                Agendadas
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
        </div>

        {/* Tabs de Conteúdo */}
        <Tabs defaultValue="pets" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pets">Meus Pets</TabsTrigger>
            <TabsTrigger value="consultas">Consultas</TabsTrigger>
            <TabsTrigger value="vacinas">Vacinas</TabsTrigger>
            <TabsTrigger value="mensagens">Mensagens</TabsTrigger>
          </TabsList>

          {/* Tab Pets */}
          <TabsContent value="pets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Meus Pets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {meusPets.length > 0 ? (
                    meusPets.map((pet) => (
                      <div
                        key={pet.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-card"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Heart className="h-5 w-5 text-red-500" />
                            <h3 className="font-semibold">{pet.nome}</h3>
                          </div>
                          <div className="flex gap-2 text-sm text-muted-foreground">
                            <Badge variant="secondary">{pet.especie}</Badge>
                            {pet.raca && <Badge variant="outline">{pet.raca}</Badge>}
                            <span>{calcularIdade(pet.data_nascimento)}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Ver Histórico
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhum pet cadastrado
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Consultas */}
          <TabsContent value="consultas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Minhas Consultas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {proximasConsultas.length > 0 ? (
                    proximasConsultas.map((consulta) => (
                      <div
                        key={consulta.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-card"
                      >
                        <div className="space-y-1">
                          <h3 className="font-semibold">{consulta.pet?.nome}</h3>
                          <p className="text-sm text-muted-foreground">
                            Dr(a). {consulta.veterinario?.nome}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {format(new Date(consulta.data_consulta), "dd/MM/yyyy", { locale: ptBR })}
                            </div>
                            <span>{consulta.hora_consulta}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Remarcar
                          </Button>
                          <Button variant="outline" size="sm">
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhuma consulta agendada
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Vacinas */}
          <TabsContent value="vacinas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Vacinas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {minhasVacinas.length > 0 ? (
                    minhasVacinas.slice(0, 5).map((vacina) => (
                      <div
                        key={vacina.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-card"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Syringe className="h-5 w-5 text-blue-500" />
                            <h3 className="font-semibold">{vacina.nome_vacina}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Pet: {vacina.pet?.nome}
                          </p>
                          <p className="text-sm">
                            Aplicada: {format(new Date(vacina.data_aplicacao), "dd/MM/yyyy", { locale: ptBR })}
                          </p>
                        </div>
                        {vacina.proxima_dose && new Date(vacina.proxima_dose) <= new Date() && (
                          <Badge variant="destructive">
                            Atrasada
                          </Badge>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhuma vacina registrada
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Mensagens */}
          <TabsContent value="mensagens" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Mensagens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Sistema de mensagens em desenvolvimento
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}