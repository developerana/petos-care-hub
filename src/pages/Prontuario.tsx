import { useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Syringe, Calendar, FileText, Heart, User, Phone, Mail } from "lucide-react";
import { usePet } from "@/hooks/usePets";
import { useConsultasByPet, useUpdateConsulta } from "@/hooks/useConsultas";
import { useVacinasByPet, useCreateVacina } from "@/hooks/useVacinas";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Prontuario() {
  const { petId } = useParams<{ petId: string }>();
  const [isVacinaDialogOpen, setIsVacinaDialogOpen] = useState(false);
  const [editingConsulta, setEditingConsulta] = useState<string | null>(null);
  const [vacinaForm, setVacinaForm] = useState({
    nome_vacina: "",
    data_aplicacao: "",
    proxima_dose: "",
    observacoes: "",
  });
  const [consultaForm, setConsultaForm] = useState({
    anamnese: "",
    diagnostico: "",
    tratamento: "",
  });

  const { data: pet, isLoading } = usePet(petId!);
  const { data: consultas = [] } = useConsultasByPet(petId!);
  const { data: vacinas = [] } = useVacinasByPet(petId!);
  const createVacina = useCreateVacina();
  const updateConsulta = useUpdateConsulta();

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

  const handleVacinaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createVacina.mutateAsync({
      id_pet: petId!,
      ...vacinaForm,
    });
    setIsVacinaDialogOpen(false);
    setVacinaForm({
      nome_vacina: "",
      data_aplicacao: "",
      proxima_dose: "",
      observacoes: "",
    });
  };

  const handleConsultaUpdate = async (consultaId: string) => {
    await updateConsulta.mutateAsync({
      id: consultaId,
      ...consultaForm,
      status: "Realizada" as const,
    });
    setEditingConsulta(null);
    setConsultaForm({
      anamnese: "",
      diagnostico: "",
      tratamento: "",
    });
  };

  const startEditingConsulta = (consulta: any) => {
    setEditingConsulta(consulta.id);
    setConsultaForm({
      anamnese: consulta.anamnese || "",
      diagnostico: consulta.diagnostico || "",
      tratamento: consulta.tratamento || "",
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p>Carregando...</p>
        </div>
      </Layout>
    );
  }

  if (!pet) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p>Pet não encontrado</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header - Informações do Pet */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-red-500" />
              <div>
                <CardTitle className="text-2xl">{pet.nome}</CardTitle>
                <p className="text-muted-foreground">
                  {pet.especie} {pet.raca && `• ${pet.raca}`} • {calcularIdade(pet.data_nascimento)}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{pet.tutor?.nome}</p>
                  <p className="text-sm text-muted-foreground">Tutor</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{pet.tutor?.telefone}</p>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{pet.tutor?.email}</p>
                  <p className="text-sm text-muted-foreground">E-mail</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs - Prontuário e Vacinas */}
        <Tabs defaultValue="prontuario" className="space-y-4">
          <TabsList>
            <TabsTrigger value="prontuario">Prontuário</TabsTrigger>
            <TabsTrigger value="vacinas">Vacinas</TabsTrigger>
          </TabsList>

          {/* Tab Prontuário */}
          <TabsContent value="prontuario" className="space-y-4">
            <div className="grid gap-4">
              {consultas.length > 0 ? (
                consultas.map((consulta) => (
                  <Card key={consulta.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            Consulta - {format(new Date(consulta.data_consulta), "dd/MM/yyyy", { locale: ptBR })}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Dr(a). {consulta.veterinario?.nome} • {consulta.hora_consulta}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={consulta.status === "Realizada" ? "default" : "secondary"}>
                            {consulta.status}
                          </Badge>
                          {consulta.status === "Agendada" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startEditingConsulta(consulta)}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Realizar Consulta
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {editingConsulta === consulta.id ? (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="anamnese">Anamnese</Label>
                            <Textarea
                              id="anamnese"
                              value={consultaForm.anamnese}
                              onChange={(e) => setConsultaForm({...consultaForm, anamnese: e.target.value})}
                              placeholder="Histórico e sintomas relatados..."
                            />
                          </div>
                          <div>
                            <Label htmlFor="diagnostico">Diagnóstico</Label>
                            <Textarea
                              id="diagnostico"
                              value={consultaForm.diagnostico}
                              onChange={(e) => setConsultaForm({...consultaForm, diagnostico: e.target.value})}
                              placeholder="Diagnóstico médico..."
                            />
                          </div>
                          <div>
                            <Label htmlFor="tratamento">Tratamento</Label>
                            <Textarea
                              id="tratamento"
                              value={consultaForm.tratamento}
                              onChange={(e) => setConsultaForm({...consultaForm, tratamento: e.target.value})}
                              placeholder="Medicações e recomendações..."
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={() => handleConsultaUpdate(consulta.id)}>
                              Finalizar Consulta
                            </Button>
                            <Button variant="outline" onClick={() => setEditingConsulta(null)}>
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {consulta.anamnese && (
                            <div>
                              <h4 className="font-medium text-sm">Anamnese:</h4>
                              <p className="text-sm text-muted-foreground">{consulta.anamnese}</p>
                            </div>
                          )}
                          {consulta.diagnostico && (
                            <div>
                              <h4 className="font-medium text-sm">Diagnóstico:</h4>
                              <p className="text-sm text-muted-foreground">{consulta.diagnostico}</p>
                            </div>
                          )}
                          {consulta.tratamento && (
                            <div>
                              <h4 className="font-medium text-sm">Tratamento:</h4>
                              <p className="text-sm text-muted-foreground">{consulta.tratamento}</p>
                            </div>
                          )}
                          {!consulta.anamnese && !consulta.diagnostico && !consulta.tratamento && (
                            <p className="text-sm text-muted-foreground italic">
                              Consulta ainda não realizada
                            </p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                      Nenhuma consulta registrada ainda
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Tab Vacinas */}
          <TabsContent value="vacinas" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Histórico de Vacinas</h3>
              <Dialog open={isVacinaDialogOpen} onOpenChange={setIsVacinaDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Vacina
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Registrar Vacina</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleVacinaSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="nome_vacina">Nome da Vacina *</Label>
                      <Input
                        id="nome_vacina"
                        value={vacinaForm.nome_vacina}
                        onChange={(e) => setVacinaForm({...vacinaForm, nome_vacina: e.target.value})}
                        placeholder="Ex: V10, Antirrábica, etc."
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="data_aplicacao">Data de Aplicação *</Label>
                      <Input
                        id="data_aplicacao"
                        type="date"
                        value={vacinaForm.data_aplicacao}
                        onChange={(e) => setVacinaForm({...vacinaForm, data_aplicacao: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="proxima_dose">Próxima Dose</Label>
                      <Input
                        id="proxima_dose"
                        type="date"
                        value={vacinaForm.proxima_dose}
                        onChange={(e) => setVacinaForm({...vacinaForm, proxima_dose: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="observacoes">Observações</Label>
                      <Textarea
                        id="observacoes"
                        value={vacinaForm.observacoes}
                        onChange={(e) => setVacinaForm({...vacinaForm, observacoes: e.target.value})}
                        placeholder="Observações sobre a vacina..."
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button type="submit" disabled={createVacina.isPending}>
                        Registrar
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsVacinaDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {vacinas.length > 0 ? (
                vacinas.map((vacina) => (
                  <Card key={vacina.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Syringe className="h-5 w-5 text-blue-500" />
                            <h4 className="font-semibold">{vacina.nome_vacina}</h4>
                          </div>
                          <div className="flex flex-col md:flex-row gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Aplicada: {format(new Date(vacina.data_aplicacao), "dd/MM/yyyy", { locale: ptBR })}
                            </div>
                            {vacina.proxima_dose && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Próxima: {format(new Date(vacina.proxima_dose), "dd/MM/yyyy", { locale: ptBR })}
                              </div>
                            )}
                          </div>
                          {vacina.observacoes && (
                            <p className="text-sm text-muted-foreground">
                              <strong>Obs:</strong> {vacina.observacoes}
                            </p>
                          )}
                        </div>
                        {vacina.proxima_dose && new Date(vacina.proxima_dose) <= new Date() && (
                          <Badge variant="destructive">
                            Atrasada
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                      Nenhuma vacina registrada ainda
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}