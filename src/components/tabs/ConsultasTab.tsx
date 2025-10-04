import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Upload, FileText, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const ConsultasTab = () => {
  const exames = [
    {
      tipo: "Exame de sangue",
      data: "12/09/2025",
      resultado: "Resultado normal",
      arquivo: "hemograma-12-09-2025.pdf",
    },
    {
      tipo: "Raio-X",
      data: "10/07/2025",
      resultado: "Laudo anexado",
      arquivo: "raio-x-torax-10-07-2025.pdf",
    },
    {
      tipo: "Ultrassom Abdominal",
      data: "05/06/2025",
      resultado: "Sem alterações",
      arquivo: "ultrassom-05-06-2025.pdf",
    },
  ];

  const prescricoes = [
    {
      data: "12/09/2025",
      medicamento: "Antibiótico XYZ",
      posologia: "1 comprimido a cada 12h por 7 dias",
      veterinario: "Dr. João Pereira",
    },
    {
      data: "15/06/2025",
      medicamento: "Anti-histamínico ABC",
      posologia: "1 comprimido ao dia por 10 dias",
      veterinario: "Dr. João Pereira",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex gap-3">
        <Button 
          className="gap-2"
          onClick={() => toast({
            title: "Nova consulta",
            description: "Funcionalidade de registro em desenvolvimento.",
          })}
        >
          <Plus className="w-4 h-4" />
          Nova Consulta
        </Button>
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.pdf,.jpg,.jpeg,.png';
            input.onchange = () => {
              toast({
                title: "Exame carregado",
                description: "O arquivo foi anexado com sucesso.",
              });
            };
            input.click();
          }}
        >
          <Upload className="w-4 h-4" />
          Upload de Exame
        </Button>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground">Exames Realizados</h3>
        <div className="space-y-3">
          {exames.map((exame, index) => (
            <Card key={index} className="p-4 shadow-card">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-info" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{exame.tipo}</p>
                    <p className="text-sm text-muted-foreground">{exame.data}</p>
                    <p className="text-sm text-muted-foreground mt-1">{exame.resultado}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => toast({
                    title: "Download iniciado",
                    description: `Baixando ${exame.arquivo}...`,
                  })}
                >
                  <Download className="w-4 h-4" />
                  {exame.arquivo}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground">Prescrições Médicas</h3>
        <div className="space-y-3">
          {prescricoes.map((prescricao, index) => (
            <Card key={index} className="p-4 shadow-card border-l-4 border-l-secondary">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-foreground">{prescricao.medicamento}</p>
                    <p className="text-sm text-muted-foreground">{prescricao.data}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      window.print();
                      toast({
                        title: "Imprimindo prescrição",
                        description: "Preparando documento...",
                      });
                    }}
                  >
                    Imprimir
                  </Button>
                </div>
                <p className="text-sm">
                  <span className="font-medium text-foreground">Posologia:</span>{" "}
                  <span className="text-muted-foreground">{prescricao.posologia}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Prescrito por: {prescricao.veterinario}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
