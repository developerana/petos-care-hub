import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

export const VacinacaoTab = () => {
  const [open, setOpen] = useState(false);
  const vacinas = [
    {
      nome: "V8",
      dataAplicacao: "04/08/2025",
      proximaDose: "04/08/2026",
      veterinario: "Dra. Ana Souza",
      observacao: "OK",
      status: "em-dia",
    },
    {
      nome: "Antirrábica",
      dataAplicacao: "10/09/2025",
      proximaDose: "10/09/2026",
      veterinario: "Dr. João Pereira",
      observacao: "–",
      status: "em-dia",
    },
    {
      nome: "Leishmaniose",
      dataAplicacao: "15/07/2025",
      proximaDose: "15/07/2026",
      veterinario: "Dra. Ana Souza",
      observacao: "Dose anual",
      status: "em-dia",
    },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-foreground">Controle de Vacinação</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Registrar nova vacina
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Vacina</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              toast({
                title: "Vacina registrada",
                description: "A vacina foi adicionada ao registro.",
              });
              setOpen(false);
            }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vacina">Nome da Vacina</Label>
                <Input id="vacina" placeholder="Ex: V8, Antirrábica..." required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataAplicacao">Data de Aplicação</Label>
                  <Input id="dataAplicacao" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proximaDose">Próxima Dose</Label>
                  <Input id="proximaDose" type="date" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="veterinarioVacina">Veterinário</Label>
                <Input id="veterinarioVacina" placeholder="Dr(a)..." required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="observacao">Observação</Label>
                <Textarea id="observacao" placeholder="Lote, reações, etc..." />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar Vacina</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card className="shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vacina</TableHead>
              <TableHead>Data Aplicação</TableHead>
              <TableHead>Próxima Dose</TableHead>
              <TableHead>Veterinário</TableHead>
              <TableHead>Observação</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vacinas.map((vacina, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{vacina.nome}</TableCell>
                <TableCell>{vacina.dataAplicacao}</TableCell>
                <TableCell>{vacina.proximaDose}</TableCell>
                <TableCell>{vacina.veterinario}</TableCell>
                <TableCell>{vacina.observacao}</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/20 text-secondary">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-xs font-medium">Em dia</span>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
