import { Card } from "@/components/ui/card";
import { FileSignature, Clock } from "lucide-react";

export const ProntuarioFooter = () => {
  const currentDate = new Date().toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className="p-4 shadow-card bg-muted/50 border-t-2 border-t-primary">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <FileSignature className="w-4 h-4" />
          <span>
            <span className="font-medium text-foreground">Assinatura Digital:</span> Dr. João Pereira
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>
            <span className="font-medium text-foreground">Última atualização:</span> {currentDate}
          </span>
        </div>
      </div>
    </Card>
  );
};
