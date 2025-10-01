import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, FileText } from "lucide-react";
import { useExamesByPet, useCreateExame } from "@/hooks/useExames";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { AgendarConsultaDialog } from "@/components/consultas/AgendarConsultaDialog";

interface ConsultasExamesTabProps {
  petId: string;
}

export default function ConsultasExamesTab({ petId }: ConsultasExamesTabProps) {
  const { data: exames = [], isLoading } = useExamesByPet(petId);
  const createExame = useCreateExame();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    tipo_exame: "",
    data_realizacao: "",
    resultado: "",
    observacoes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createExame.mutateAsync({
      ...formData,
      id_pet: petId,
    });
    setIsDialogOpen(false);
    setFormData({
      tipo_exame: "",
      data_realizacao: "",
      resultado: "",
      observacoes: "",
    });
  };

  if (isLoading) {
    return <p>Carregando exames...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <AgendarConsultaDialog>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nova Consulta
          </Button>
        </AgendarConsultaDialog>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Upload de Exame
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Exame</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Tipo de Exame *</Label>
                <Input
                  value={formData.tipo_exame}
                  onChange={(e) => setFormData({ ...formData, tipo_exame: e.target.value })}
                  required
                  placeholder="Ex: Hemograma, Raio-X..."
                />
              </div>
              <div>
                <Label>Data de Realização *</Label>
                <Input
                  type="date"
                  value={formData.data_realizacao}
                  onChange={(e) => setFormData({ ...formData, data_realizacao: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Resultado</Label>
                <Textarea
                  value={formData.resultado}
                  onChange={(e) => setFormData({ ...formData, resultado: e.target.value })}
                  placeholder="Descrição do resultado..."
                />
              </div>
              <div>
                <Label>Observações</Label>
                <Textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Observações adicionais..."
                />
              </div>
              <Button type="submit" disabled={createExame.isPending}>
                Registrar Exame
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold">Exames Realizados</h3>
        {exames.length > 0 ? (
          exames.map((exame) => (
            <Card key={exame.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <strong>{exame.tipo_exame}</strong>
                      <Badge variant="outline">
                        {format(new Date(exame.data_realizacao), "dd/MM/yyyy", { locale: ptBR })}
                      </Badge>
                    </div>
                    {exame.resultado && (
                      <p className="text-sm text-muted-foreground">
                        <strong>Resultado:</strong> {exame.resultado}
                      </p>
                    )}
                    {exame.observacoes && (
                      <p className="text-sm text-muted-foreground">{exame.observacoes}</p>
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
                Nenhum exame registrado ainda
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}