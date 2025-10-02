import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { useConsultasByPet } from "@/hooks/useConsultas";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AgendarConsultaDialog } from "@/components/consultas/AgendarConsultaDialog";

interface HistoricoClinicoTabProps {
  petId: string;
}

export default function HistoricoClinicoTab({ petId }: HistoricoClinicoTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: consultas = [] } = useConsultasByPet(petId);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar nova consulta
        </Button>
      </div>

      <AgendarConsultaDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />

      <div className="space-y-4">
        {consultas.length > 0 ? (
          consultas.map((consulta) => (
            <Card key={consulta.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      📅 {format(new Date(consulta.data_consulta), "dd/MM/yyyy", { locale: ptBR })}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      👨‍⚕️ {consulta.veterinario?.nome} • {consulta.hora_consulta}
                    </p>
                  </div>
                  <Badge variant={consulta.status === "Realizada" ? "default" : "secondary"}>
                    {consulta.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {consulta.anamnese && (
                  <div>
                    <p className="font-medium text-sm">Sintomas:</p>
                    <p className="text-sm text-muted-foreground">{consulta.anamnese}</p>
                  </div>
                )}
                {consulta.diagnostico && (
                  <div>
                    <p className="font-medium text-sm">Diagnóstico:</p>
                    <p className="text-sm text-muted-foreground">{consulta.diagnostico}</p>
                  </div>
                )}
                {consulta.tratamento && (
                  <div>
                    <p className="font-medium text-sm">Prescrição:</p>
                    <p className="text-sm text-muted-foreground">{consulta.tratamento}</p>
                  </div>
                )}
                {!consulta.anamnese && !consulta.diagnostico && !consulta.tratamento && (
                  <p className="text-sm text-muted-foreground italic">
                    Consulta ainda não realizada
                  </p>
                )}
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
