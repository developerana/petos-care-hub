import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Syringe, Calendar } from "lucide-react";
import { useVacinasByPet, useCreateVacina } from "@/hooks/useVacinas";
import { format, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";

interface VacinacaoTabProps {
  petId: string;
}

export default function VacinacaoTab({ petId }: VacinacaoTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome_vacina: "",
    data_aplicacao: "",
    proxima_dose: "",
    observacoes: "",
  });

  const { data: vacinas = [] } = useVacinasByPet(petId);
  const createVacina = useCreateVacina();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createVacina.mutateAsync({
      id_pet: petId,
      ...formData,
    });
    setIsDialogOpen(false);
    setFormData({
      nome_vacina: "",
      data_aplicacao: "",
      proxima_dose: "",
      observacoes: "",
    });
  };

  const getStatusVacina = (proximaDose: string | null) => {
    if (!proximaDose) return null;
    const hoje = new Date();
    const dataProxima = new Date(proximaDose);
    
    if (isBefore(dataProxima, hoje)) {
      return { label: "Atrasada", variant: "destructive" as const };
    }
    
    const diasAteProxima = Math.floor((dataProxima.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    if (diasAteProxima <= 30) {
      return { label: "Próxima", variant: "secondary" as const };
    }
    
    return { label: "Em dia", variant: "default" as const };
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Registrar nova vacina
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Vacina</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nome_vacina">Nome da Vacina *</Label>
              <Input
                id="nome_vacina"
                value={formData.nome_vacina}
                onChange={(e) => setFormData({ ...formData, nome_vacina: e.target.value })}
                placeholder="Ex: V10, Antirrábica"
                required
              />
            </div>
            <div>
              <Label htmlFor="data_aplicacao">Data de Aplicação *</Label>
              <Input
                id="data_aplicacao"
                type="date"
                value={formData.data_aplicacao}
                onChange={(e) => setFormData({ ...formData, data_aplicacao: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="proxima_dose">Próxima Dose</Label>
              <Input
                id="proxima_dose"
                type="date"
                value={formData.proxima_dose}
                onChange={(e) => setFormData({ ...formData, proxima_dose: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                placeholder="Observações sobre a vacina..."
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={createVacina.isPending}>
                Registrar
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {vacinas.length > 0 ? (
          vacinas.map((vacina) => {
            const status = getStatusVacina(vacina.proxima_dose);
            return (
              <Card key={vacina.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1">
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
                    {status && (
                      <Badge variant={status.variant}>
                        {status.label}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
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
    </div>
  );
}
