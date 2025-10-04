import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Printer } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const TratamentoTab = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="p-6 shadow-card border-l-4 border-l-warning">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Diagnóstico Atual</h3>
        <div className="space-y-2">
          <p className="text-foreground">
            <span className="font-medium">Condição:</span> Gastroenterite
          </p>
          <p className="text-muted-foreground text-sm">
            Diagnóstico realizado em 12/09/2025 por Dr. João Pereira
          </p>
        </div>
      </Card>

      <Card className="p-6 shadow-card">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Tratamento Prescrito</h3>
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="font-medium text-foreground mb-2">Medicação</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Antibiótico XYZ - 1 comprimido a cada 12h por 7 dias</li>
              <li>• Probiótico - 1 sachê ao dia por 14 dias</li>
              <li>• Dieta leve (ração intestinal) por 10 dias</li>
            </ul>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <p className="font-medium text-foreground mb-2">Observações</p>
            <p className="text-sm text-muted-foreground">
              Retorno em 7 dias para reavaliação. Manter animal hidratado. 
              Se apresentar vômitos persistentes ou sangue nas fezes, retornar imediatamente.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 shadow-card">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Recomendações ao Tutor</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recomendacoes">Orientações</Label>
            <Textarea 
              id="recomendacoes"
              rows={6}
              defaultValue="1. Administrar a medicação conforme prescrito&#10;2. Oferecer água fresca constantemente&#10;3. Evitar alimentos gordurosos ou condimentados&#10;4. Observar o comportamento do animal&#10;5. Manter repouso e ambiente tranquilo&#10;6. Retornar em 7 dias para reavaliação"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => {
                window.print();
                toast({
                  title: "Imprimindo",
                  description: "Preparando documento para impressão...",
                });
              }}
            >
              <Printer className="w-4 h-4" />
              Imprimir
            </Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => toast({
                title: "E-mail enviado",
                description: "As recomendações foram enviadas ao tutor.",
              })}
            >
              <Mail className="w-4 h-4" />
              Enviar por E-mail
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
