import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, DollarSign } from "lucide-react";
import { useFinanceiroByPet, useCreateFinanceiro, useUpdateFinanceiro } from "@/hooks/useFinanceiro";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface FinanceiroTabProps {
  petId: string;
}

export default function FinanceiroTab({ petId }: FinanceiroTabProps) {
  const { data: financeiros = [], isLoading } = useFinanceiroByPet(petId);
  const createFinanceiro = useCreateFinanceiro();
  const updateFinanceiro = useUpdateFinanceiro();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    descricao: "",
    valor: "",
    data_vencimento: "",
    tipo: "Consulta",
    status: "Pendente",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createFinanceiro.mutateAsync({
      ...formData,
      valor: parseFloat(formData.valor),
      id_pet: petId,
    });
    setIsDialogOpen(false);
    setFormData({
      descricao: "",
      valor: "",
      data_vencimento: "",
      tipo: "Consulta",
      status: "Pendente",
    });
  };

  const handleMarcarComoPago = async (id: string) => {
    await updateFinanceiro.mutateAsync({
      id,
      status: "Pago",
      data_pagamento: new Date().toISOString().split('T')[0],
    });
  };

  const totalPendente = financeiros
    .filter((f) => f.status === "Pendente")
    .reduce((sum, f) => sum + Number(f.valor), 0);

  const totalPago = financeiros
    .filter((f) => f.status === "Pago")
    .reduce((sum, f) => sum + Number(f.valor), 0);

  if (isLoading) {
    return <p>Carregando dados financeiros...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Pendente</p>
              <p className="text-2xl font-bold text-destructive">
                R$ {totalPendente.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Pago</p>
              <p className="text-2xl font-bold text-green-600">
                R$ {totalPago.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Geral</p>
              <p className="text-2xl font-bold">
                R$ {(totalPendente + totalPago).toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Histórico Financeiro</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Novo Lançamento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Lançamento Financeiro</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Descrição *</Label>
                <Input
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  required
                  placeholder="Ex: Consulta de rotina..."
                />
              </div>
              <div>
                <Label>Tipo *</Label>
                <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Consulta">Consulta</SelectItem>
                    <SelectItem value="Exame">Exame</SelectItem>
                    <SelectItem value="Cirurgia">Cirurgia</SelectItem>
                    <SelectItem value="Medicamento">Medicamento</SelectItem>
                    <SelectItem value="Vacina">Vacina</SelectItem>
                    <SelectItem value="Internação">Internação</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Valor (R$) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  required
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>Data de Vencimento *</Label>
                <Input
                  type="date"
                  value={formData.data_vencimento}
                  onChange={(e) => setFormData({ ...formData, data_vencimento: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" disabled={createFinanceiro.isPending}>
                Registrar
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
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financeiros.length > 0 ? (
                financeiros.map((financeiro) => (
                  <TableRow key={financeiro.id}>
                    <TableCell className="font-medium">{financeiro.descricao}</TableCell>
                    <TableCell>{financeiro.tipo}</TableCell>
                    <TableCell>R$ {Number(financeiro.valor).toFixed(2)}</TableCell>
                    <TableCell>{format(new Date(financeiro.data_vencimento), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                    <TableCell>
                      <Badge variant={financeiro.status === "Pago" ? "secondary" : "destructive"}>
                        {financeiro.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {financeiro.status === "Pendente" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarcarComoPago(financeiro.id)}
                        >
                          <DollarSign className="h-4 w-4 mr-1" />
                          Marcar como Pago
                        </Button>
                      )}
                      {financeiro.status === "Pago" && financeiro.data_pagamento && (
                        <span className="text-xs text-muted-foreground">
                          Pago em {format(new Date(financeiro.data_pagamento), "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Nenhum lançamento financeiro registrado
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