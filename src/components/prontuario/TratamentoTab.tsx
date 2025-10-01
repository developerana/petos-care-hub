import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useTratamentosByPet, useCreateTratamento, useUpdateTratamento } from "@/hooks/useTratamentos";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface TratamentoTabProps {
  petId: string;
}

export default function TratamentoTab({ petId }: TratamentoTabProps) {
  const { data: tratamentos = [], isLoading } = useTratamentosByPet(petId);
  const createTratamento = useCreateTratamento();
  const updateTratamento = useUpdateTratamento();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    diagnostico_atual: "",
    tratamento_prescrito: "",
    recomendacoes: "",
    data_inicio: "",
    data_fim: "",
    status: "Em andamento",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTratamento.mutateAsync({
      ...formData,
      id_pet: petId,
    });
    setIsDialogOpen(false);
    setFormData({
      diagnostico_atual: "",
      tratamento_prescrito: "",
      recomendacoes: "",
      data_inicio: "",
      data_fim: "",
      status: "Em andamento",
    });
  };

  const handleFinalizarTratamento = async (id: string) => {
    await updateTratamento.mutateAsync({
      id,
      status: "Concluído",
      data_fim: new Date().toISOString().split('T')[0],
    });
  };

  if (isLoading) {
    return <p>Carregando tratamentos...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Planos de Tratamento</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Novo Tratamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Novo Plano de Tratamento</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Diagnóstico Atual *</Label>
                <Textarea
                  value={formData.diagnostico_atual}
                  onChange={(e) => setFormData({ ...formData, diagnostico_atual: e.target.value })}
                  required
                  placeholder="Descreva o diagnóstico..."
                />
              </div>
              <div>
                <Label>Tratamento Prescrito *</Label>
                <Textarea
                  value={formData.tratamento_prescrito}
                  onChange={(e) => setFormData({ ...formData, tratamento_prescrito: e.target.value })}
                  required
                  placeholder="Medicações, procedimentos, dosagens..."
                  rows={4}
                />
              </div>
              <div>
                <Label>Recomendações ao Tutor</Label>
                <Textarea
                  value={formData.recomendacoes}
                  onChange={(e) => setFormData({ ...formData, recomendacoes: e.target.value })}
                  placeholder="Cuidados em casa, restrições, alimentação..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Data de Início *</Label>
                  <Input
                    type="date"
                    value={formData.data_inicio}
                    onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Previsão de Término</Label>
                  <Input
                    type="date"
                    value={formData.data_fim}
                    onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
                  />
                </div>
              </div>
              <Button type="submit" disabled={createTratamento.isPending}>
                Iniciar Tratamento
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {tratamentos.length > 0 ? (
          tratamentos.map((tratamento) => (
            <Card key={tratamento.id}>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant={tratamento.status === "Em andamento" ? "default" : "secondary"}>
                        {tratamento.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        Início: {format(new Date(tratamento.data_inicio), "dd/MM/yyyy", { locale: ptBR })}
                        {tratamento.data_fim && ` • Término: ${format(new Date(tratamento.data_fim), "dd/MM/yyyy", { locale: ptBR })}`}
                      </p>
                    </div>
                    {tratamento.status === "Em andamento" && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleFinalizarTratamento(tratamento.id)}
                      >
                        Finalizar Tratamento
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-2 border-t pt-3">
                    <div>
                      <strong className="text-sm">Diagnóstico:</strong>
                      <p className="text-sm text-muted-foreground">{tratamento.diagnostico_atual}</p>
                    </div>
                    <div>
                      <strong className="text-sm">Tratamento:</strong>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{tratamento.tratamento_prescrito}</p>
                    </div>
                    {tratamento.recomendacoes && (
                      <div>
                        <strong className="text-sm">Recomendações:</strong>
                        <p className="text-sm text-muted-foreground">{tratamento.recomendacoes}</p>
                      </div>
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
                Nenhum tratamento em andamento
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}