import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useVacinasByPet, useCreateVacina } from "@/hooks/useVacinas";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface VacinacaoTabProps {
  petId: string;
}

export default function VacinacaoTab({ petId }: VacinacaoTabProps) {
  const { data: vacinas = [], isLoading } = useVacinasByPet(petId);
  const createVacina = useCreateVacina();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome_vacina: "",
    data_aplicacao: "",
    proxima_dose: "",
    observacoes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createVacina.mutateAsync({
      ...formData,
      id_pet: petId,
    });
    setIsDialogOpen(false);
    setFormData({
      nome_vacina: "",
      data_aplicacao: "",
      proxima_dose: "",
      observacoes: "",
    });
  };

  if (isLoading) {
    return <p>Carregando vacinas...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Carteira de Vacinação</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Registrar Vacina
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Nova Vacina</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Nome da Vacina *</Label>
                <Input
                  value={formData.nome_vacina}
                  onChange={(e) => setFormData({ ...formData, nome_vacina: e.target.value })}
                  required
                  placeholder="Ex: V8, Antirrábica..."
                />
              </div>
              <div>
                <Label>Data de Aplicação *</Label>
                <Input
                  type="date"
                  value={formData.data_aplicacao}
                  onChange={(e) => setFormData({ ...formData, data_aplicacao: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Próxima Dose</Label>
                <Input
                  type="date"
                  value={formData.proxima_dose}
                  onChange={(e) => setFormData({ ...formData, proxima_dose: e.target.value })}
                />
              </div>
              <div>
                <Label>Observações</Label>
                <Textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Lote, reações, etc..."
                />
              </div>
              <Button type="submit" disabled={createVacina.isPending}>
                Registrar Vacina
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vacina</TableHead>
                <TableHead>Data Aplicação</TableHead>
                <TableHead>Próxima Dose</TableHead>
                <TableHead>Observações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vacinas.length > 0 ? (
                vacinas.map((vacina) => {
                  const isAtrasada = vacina.proxima_dose && new Date(vacina.proxima_dose) < new Date();
                  return (
                    <TableRow key={vacina.id}>
                      <TableCell className="font-medium">{vacina.nome_vacina}</TableCell>
                      <TableCell>{format(new Date(vacina.data_aplicacao), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                      <TableCell>
                        {vacina.proxima_dose ? (
                          <div className="flex items-center gap-2">
                            {format(new Date(vacina.proxima_dose), "dd/MM/yyyy", { locale: ptBR })}
                            {isAtrasada && <Badge variant="destructive">Atrasada</Badge>}
                          </div>
                        ) : (
                          "–"
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{vacina.observacoes || "–"}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Nenhuma vacina registrada ainda
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}