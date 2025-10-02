import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, FileText, Download, Printer } from "lucide-react";
import { useExamesByPet, useCreateExame } from "@/hooks/useExames";
import { usePrescricoesByPet, useCreatePrescricao } from "@/hooks/usePrescricoes";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AgendarConsultaDialog } from "@/components/consultas/AgendarConsultaDialog";

interface ConsultasExamesTabProps {
  petId: string;
}

export default function ConsultasExamesTab({ petId }: ConsultasExamesTabProps) {
  const [isConsultaDialogOpen, setIsConsultaDialogOpen] = useState(false);
  const [isExameDialogOpen, setIsExameDialogOpen] = useState(false);
  const [isPrescricaoDialogOpen, setIsPrescricaoDialogOpen] = useState(false);
  
  const [exameForm, setExameForm] = useState({
    tipo_exame: "",
    data_realizacao: "",
    resultado: "",
    observacoes: "",
  });

  const [prescricaoForm, setPrescricaoForm] = useState({
    medicamento: "",
    posologia: "",
    data_prescricao: "",
    observacoes: "",
  });

  const { data: exames = [] } = useExamesByPet(petId);
  const { data: prescricoes = [] } = usePrescricoesByPet(petId);
  const createExame = useCreateExame();
  const createPrescricao = useCreatePrescricao();

  const handleExameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createExame.mutateAsync({
      id_pet: petId,
      ...exameForm,
    });
    setIsExameDialogOpen(false);
    setExameForm({
      tipo_exame: "",
      data_realizacao: "",
      resultado: "",
      observacoes: "",
    });
  };

  const handlePrescricaoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPrescricao.mutateAsync({
      id_pet: petId,
      id_consulta: null,
      id_veterinario: null,
      ...prescricaoForm,
    });
    setIsPrescricaoDialogOpen(false);
    setPrescricaoForm({
      medicamento: "",
      posologia: "",
      data_prescricao: "",
      observacoes: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        <Button onClick={() => setIsConsultaDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Consulta
        </Button>
        <Button onClick={() => setIsExameDialogOpen(true)} variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Upload de Exame
        </Button>
        <Button onClick={() => setIsPrescricaoDialogOpen(true)} variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Nova Prescrição
        </Button>
      </div>

      <AgendarConsultaDialog 
        open={isConsultaDialogOpen}
        onOpenChange={setIsConsultaDialogOpen}
      />

      <Dialog open={isExameDialogOpen} onOpenChange={setIsExameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Exame</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleExameSubmit} className="space-y-4">
            <div>
              <Label htmlFor="tipo_exame">Tipo de Exame *</Label>
              <Input
                id="tipo_exame"
                value={exameForm.tipo_exame}
                onChange={(e) => setExameForm({ ...exameForm, tipo_exame: e.target.value })}
                placeholder="Ex: Exame de sangue, Raio-X"
                required
              />
            </div>
            <div>
              <Label htmlFor="data_realizacao">Data de Realização *</Label>
              <Input
                id="data_realizacao"
                type="date"
                value={exameForm.data_realizacao}
                onChange={(e) => setExameForm({ ...exameForm, data_realizacao: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="resultado">Resultado</Label>
              <Textarea
                id="resultado"
                value={exameForm.resultado}
                onChange={(e) => setExameForm({ ...exameForm, resultado: e.target.value })}
                placeholder="Descreva o resultado do exame..."
              />
            </div>
            <div>
              <Label htmlFor="observacoes_exame">Observações</Label>
              <Textarea
                id="observacoes_exame"
                value={exameForm.observacoes}
                onChange={(e) => setExameForm({ ...exameForm, observacoes: e.target.value })}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={createExame.isPending}>
                Registrar
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsExameDialogOpen(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isPrescricaoDialogOpen} onOpenChange={setIsPrescricaoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Prescrição</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePrescricaoSubmit} className="space-y-4">
            <div>
              <Label htmlFor="medicamento">Medicamento *</Label>
              <Input
                id="medicamento"
                value={prescricaoForm.medicamento}
                onChange={(e) => setPrescricaoForm({ ...prescricaoForm, medicamento: e.target.value })}
                placeholder="Nome do medicamento"
                required
              />
            </div>
            <div>
              <Label htmlFor="posologia">Posologia *</Label>
              <Textarea
                id="posologia"
                value={prescricaoForm.posologia}
                onChange={(e) => setPrescricaoForm({ ...prescricaoForm, posologia: e.target.value })}
                placeholder="Ex: 1 comprimido a cada 12h por 7 dias"
                required
              />
            </div>
            <div>
              <Label htmlFor="data_prescricao">Data da Prescrição *</Label>
              <Input
                id="data_prescricao"
                type="date"
                value={prescricaoForm.data_prescricao}
                onChange={(e) => setPrescricaoForm({ ...prescricaoForm, data_prescricao: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="observacoes_prescricao">Observações</Label>
              <Textarea
                id="observacoes_prescricao"
                value={prescricaoForm.observacoes}
                onChange={(e) => setPrescricaoForm({ ...prescricaoForm, observacoes: e.target.value })}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={createPrescricao.isPending}>
                Registrar
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsPrescricaoDialogOpen(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Exames Realizados</h3>
          <div className="space-y-3">
            {exames.length > 0 ? (
              exames.map((exame) => (
                <Card key={exame.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-500" />
                          <h4 className="font-semibold">{exame.tipo_exame}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(exame.data_realizacao), "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                        {exame.resultado && (
                          <p className="text-sm">{exame.resultado}</p>
                        )}
                      </div>
                      {exame.arquivo_url && (
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    Nenhum exame registrado ainda
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Prescrições Médicas</h3>
          <div className="space-y-3">
            {prescricoes.length > 0 ? (
              prescricoes.map((prescricao) => (
                <Card key={prescricao.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">💊 {prescricao.medicamento}</h4>
                          <Button variant="ghost" size="sm">
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(prescricao.data_prescricao), "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                        <div className="space-y-1">
                          <p className="font-medium text-sm">Posologia:</p>
                          <p className="text-sm text-muted-foreground">{prescricao.posologia}</p>
                        </div>
                        {prescricao.veterinario && (
                          <p className="text-sm text-muted-foreground">
                            Prescrito por: {prescricao.veterinario.nome}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    Nenhuma prescrição registrada ainda
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
