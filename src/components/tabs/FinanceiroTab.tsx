import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle2, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

export const FinanceiroTab = () => {
  const atendimentos = [
    {
      data: "12/09/2025",
      descricao: "Consulta + Medicação",
      valor: "R$ 380,00",
      status: "pago",
      recibo: "REC-2025-0245",
    },
    {
      data: "04/08/2025",
      descricao: "Vacinação V8",
      valor: "R$ 120,00",
      status: "pago",
      recibo: "REC-2025-0198",
    },
    {
      data: "15/06/2025",
      descricao: "Consulta Dermatológica",
      valor: "R$ 250,00",
      status: "pago",
      recibo: "REC-2025-0156",
    },
    {
      data: "05/06/2025",
      descricao: "Ultrassom Abdominal",
      valor: "R$ 450,00",
      status: "pendente",
      recibo: "–",
    },
  ];

  const totalPago = atendimentos
    .filter(a => a.status === "pago")
    .reduce((sum, a) => sum + parseFloat(a.valor.replace("R$ ", "").replace(",", ".")), 0);
  
  const totalPendente = atendimentos
    .filter(a => a.status === "pendente")
    .reduce((sum, a) => sum + parseFloat(a.valor.replace("R$ ", "").replace(",", ".")), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 shadow-card border-t-4 border-t-primary">
          <p className="text-sm text-muted-foreground mb-1">Total de Atendimentos</p>
          <p className="text-2xl font-bold text-foreground">{atendimentos.length}</p>
        </Card>
        
        <Card className="p-4 shadow-card border-t-4 border-t-secondary">
          <p className="text-sm text-muted-foreground mb-1">Total Pago</p>
          <p className="text-2xl font-bold text-foreground">
            R$ {totalPago.toFixed(2).replace(".", ",")}
          </p>
        </Card>
        
        <Card className="p-4 shadow-card border-t-4 border-t-warning">
          <p className="text-sm text-muted-foreground mb-1">Pendências</p>
          <p className="text-2xl font-bold text-foreground">
            R$ {totalPendente.toFixed(2).replace(".", ",")}
          </p>
        </Card>
      </div>

      <Card className="shadow-card">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Histórico de Atendimentos</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Recibo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {atendimentos.map((atendimento, index) => (
              <TableRow key={index}>
                <TableCell>{atendimento.data}</TableCell>
                <TableCell className="font-medium">{atendimento.descricao}</TableCell>
                <TableCell className="font-semibold">{atendimento.valor}</TableCell>
                <TableCell>
                  {atendimento.status === "pago" ? (
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/20 text-secondary">
                      <CheckCircle2 className="w-3 h-3" />
                      <span className="text-xs font-medium">Pago</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-warning/20 text-warning">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs font-medium">Pendente</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {atendimento.recibo}
                </TableCell>
                <TableCell className="text-right">
                  {atendimento.status === "pago" ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => toast({
                        title: "Recibo",
                        description: `Abrindo recibo ${atendimento.recibo}...`,
                      })}
                    >
                      <FileText className="w-3 h-3" />
                      Ver Recibo
                    </Button>
                  ) : (
                  <Button 
                    size="sm"
                    onClick={() => toast({
                      title: "Pagamento registrado",
                      description: "O pagamento foi confirmado com sucesso.",
                    })}
                  >
                    Registrar Pagamento
                  </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
