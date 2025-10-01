import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Calendar } from "lucide-react";
import { useConsultasByPet, useUpdateConsulta } from "@/hooks/useConsultas";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AgendarConsultaDialog } from "@/components/consultas/AgendarConsultaDialog";

interface HistoricoClinicoTabProps {
  petId: string;
}

export default function HistoricoClinicoTab({ petId }: HistoricoClinicoTabProps) {
  const { data: consultas = [], isLoading } = useConsultasByPet(petId);
  const updateConsulta = useUpdateConsulta();
  const [editingConsulta, setEditingConsulta] = useState<any>(null);
  const [formData, setFormData] = useState({
    anamnese: "",
    diagnostico: "",
    tratamento: "",
  });

  const startEditingConsulta = (consulta: any) => {
    setEditingConsulta(consulta);
    setFormData({
      anamnese: consulta.anamnese || "",
      diagnostico: consulta.diagnostico || "",
      tratamento: consulta.tratamento || "",
    });
  };

  const handleConsultaUpdate = async () => {
    if (!editingConsulta) return;

    await updateConsulta.mutateAsync({
      id: editingConsulta.id,
      ...formData,
      status: "Realizada",
    });

    setEditingConsulta(null);
    setFormData({ anamnese: "", diagnostico: "", tratamento: "" });
  };

  if (isLoading) {
    return <p>Carregando histórico...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Histórico de Consultas</h2>
        <AgendarConsultaDialog>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nova Consulta
          </Button>
        </AgendarConsultaDialog>
      </div>

      <div className="space-y-3">
        {consultas.length > 0 ? (
          consultas.map((consulta) => (
            <Card key={consulta.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <strong>{format(new Date(consulta.data_consulta), "dd/MM/yyyy", { locale: ptBR })}</strong>
                      <span className="text-muted-foreground">às {consulta.hora_consulta.substring(0, 5)}</span>
                      <Badge variant={consulta.status === "Realizada" ? "secondary" : "outline"}>
                        {consulta.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Veterinário:</strong> {consulta.veterinario?.nome || "Não atribuído"}
                    </p>
                    {consulta.anamnese && (
                      <div className="mt-2 p-3 bg-muted rounded-md">
                        <p className="text-sm"><strong>Sintomas:</strong> {consulta.anamnese}</p>
                        {consulta.diagnostico && <p className="text-sm mt-1"><strong>Diagnóstico:</strong> {consulta.diagnostico}</p>}
                        {consulta.tratamento && <p className="text-sm mt-1"><strong>Prescrição:</strong> {consulta.tratamento}</p>}
                      </div>
                    )}
                  </div>
                  {consulta.status === "Agendada" && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => startEditingConsulta(consulta)}>
                          Registrar Atendimento
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Registrar Atendimento</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Anamnese / Sintomas</Label>
                            <Textarea
                              value={formData.anamnese}
                              onChange={(e) => setFormData({ ...formData, anamnese: e.target.value })}
                              placeholder="Descreva os sintomas relatados..."
                            />
                          </div>
                          <div>
                            <Label>Diagnóstico</Label>
                            <Textarea
                              value={formData.diagnostico}
                              onChange={(e) => setFormData({ ...formData, diagnostico: e.target.value })}
                              placeholder="Diagnóstico do veterinário..."
                            />
                          </div>
                          <div>
                            <Label>Tratamento / Prescrição</Label>
                            <Textarea
                              value={formData.tratamento}
                              onChange={(e) => setFormData({ ...formData, tratamento: e.target.value })}
                              placeholder="Tratamento prescrito..."
                            />
                          </div>
                          <Button onClick={handleConsultaUpdate} disabled={updateConsulta.isPending}>
                            Salvar e Marcar como Realizada
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
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
    </div>
  );
}