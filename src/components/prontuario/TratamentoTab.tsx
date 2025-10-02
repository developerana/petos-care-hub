import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Printer, Mail } from "lucide-react";
import { useTratamentosByPet, useCreateTratamento } from "@/hooks/useTratamentos";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TratamentoTabProps {
  petId: string;
}

export default function TratamentoTab({ petId }: TratamentoTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    diagnostico_atual: "",
    tratamento_prescrito: "",
    data_inicio: "",
    recomendacoes: "",
  });

  const { data: tratamentos = [] } = useTratamentosByPet(petId);
  const createTratamento = useCreateTratamento();

  const tratamentoAtual = tratamentos.find(t => t.status === "Em andamento");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTratamento.mutateAsync({
      id_pet: petId,
      id_consulta: null,
      status: "Em andamento",
      data_fim: null,
      medicacoes: [],
      id_veterinario: null,
      ...formData,
    });
    setIsDialogOpen(false);
    setFormData({
      diagnostico_atual: "",
      tratamento_prescrito: "",
      data_inicio: "",
      recomendacoes: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Tratamento
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo Tratamento</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="diagnostico_atual">Diagnóstico *</Label>
              <Input
                id="diagnostico_atual"
                value={formData.diagnostico_atual}
                onChange={(e) => setFormData({ ...formData, diagnostico_atual: e.target.value })}
                placeholder="Ex: Gastroenterite"
                required
              />
            </div>
            <div>
              <Label htmlFor="data_inicio">Data de Início *</Label>
              <Input
                id="data_inicio"
                type="date"
                value={formData.data_inicio}
                onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="tratamento_prescrito">Tratamento Prescrito *</Label>
              <Textarea
                id="tratamento_prescrito"
                value={formData.tratamento_prescrito}
                onChange={(e) => setFormData({ ...formData, tratamento_prescrito: e.target.value })}
                placeholder="Descreva o tratamento..."
                rows={4}
                required
              />
            </div>
            <div>
              <Label htmlFor="recomendacoes">Recomendações ao Tutor</Label>
              <Textarea
                id="recomendacoes"
                value={formData.recomendacoes}
                onChange={(e) => setFormData({ ...formData, recomendacoes: e.target.value })}
                placeholder="Orientações e cuidados..."
                rows={4}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={createTratamento.isPending}>
                Cadastrar
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {tratamentoAtual ? (
        <div className="space-y-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-2">Diagnóstico Atual</h3>
              <p className="font-medium">{tratamentoAtual.diagnostico_atual}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Diagnóstico realizado em {format(new Date(tratamentoAtual.data_inicio), "dd/MM/yyyy", { locale: ptBR })}
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Tratamento Prescrito</h3>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Medicação:</h4>
                    <div className="whitespace-pre-wrap text-sm text-muted-foreground">
                      {tratamentoAtual.tratamento_prescrito}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {tratamentoAtual.recomendacoes && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Recomendações ao Tutor</h3>
                <Card>
                  <CardContent className="pt-6">
                    <div className="whitespace-pre-wrap text-sm text-muted-foreground">
                      {tratamentoAtual.recomendacoes}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Enviar por E-mail
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Nenhum tratamento em andamento
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
