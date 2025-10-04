import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, User, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const consultaSchema = z.object({
  data: z.string().min(1, "Data é obrigatória"),
  veterinario: z.string().trim().min(1, "Veterinário é obrigatório").max(100, "Nome muito longo"),
  sintomas: z.string().trim().min(1, "Sintomas são obrigatórios").max(500, "Texto muito longo"),
  diagnostico: z.string().trim().min(1, "Diagnóstico é obrigatório").max(500, "Texto muito longo"),
  prescricao: z.string().trim().min(1, "Prescrição é obrigatória").max(500, "Texto muito longo"),
});

type Consulta = {
  data: string;
  veterinario: string;
  sintomas: string;
  diagnostico: string;
  prescricao: string;
};

export const HistoricoTab = () => {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [consultas, setConsultas] = useState<Consulta[]>([
    {
      data: "12/09/2025",
      veterinario: "Dr. João Pereira",
      sintomas: "febre, apatia",
      diagnostico: "gastroenterite",
      prescricao: "antibiótico XYZ – 7 dias",
    },
    {
      data: "04/08/2025",
      veterinario: "Dra. Ana Souza",
      sintomas: "check-up de rotina",
      diagnostico: "Vacinação",
      prescricao: "Vacina V8 aplicada (lote: 112233)",
    },
    {
      data: "15/06/2025",
      veterinario: "Dr. João Pereira",
      sintomas: "coceira excessiva",
      diagnostico: "dermatite alérgica",
      prescricao: "anti-histamínico + shampoo medicinal",
    },
  ]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    
    const formData = new FormData(e.currentTarget);
    const data = {
      data: formData.get("data") as string,
      veterinario: formData.get("veterinario") as string,
      sintomas: formData.get("sintomas") as string,
      diagnostico: formData.get("diagnostico") as string,
      prescricao: formData.get("prescricao") as string,
    };

    try {
      const validatedData = consultaSchema.parse(data);
      
      // Formatar a data para DD/MM/YYYY
      const [ano, mes, dia] = validatedData.data.split("-");
      const dataFormatada = `${dia}/${mes}/${ano}`;
      
      const novaConsulta: Consulta = {
        data: dataFormatada,
        veterinario: validatedData.veterinario,
        sintomas: validatedData.sintomas,
        diagnostico: validatedData.diagnostico,
        prescricao: validatedData.prescricao,
      };
      
      setConsultas([novaConsulta, ...consultas]);
      
      toast({
        title: "Consulta registrada",
        description: "A consulta foi adicionada ao histórico com sucesso.",
      });
      
      setOpen(false);
      e.currentTarget.reset();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast({
          title: "Erro de validação",
          description: "Por favor, corrija os campos destacados.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDelete = (index: number) => {
    const consultaRemovida = consultas[index];
    setConsultas(consultas.filter((_, i) => i !== index));
    toast({
      title: "Consulta removida",
      description: `Consulta de ${consultaRemovida.data} foi removida do histórico.`,
    });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-foreground">Histórico Clínico</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Adicionar nova consulta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nova Consulta</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data">Data *</Label>
                  <Input 
                    id="data" 
                    name="data"
                    type="date" 
                    max={new Date().toISOString().split('T')[0]}
                    required 
                  />
                  {errors.data && <p className="text-sm text-destructive">{errors.data}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="veterinario">Veterinário *</Label>
                  <Input 
                    id="veterinario" 
                    name="veterinario"
                    placeholder="Dr(a)..." 
                    maxLength={100}
                    required 
                  />
                  {errors.veterinario && <p className="text-sm text-destructive">{errors.veterinario}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sintomas">Sintomas *</Label>
                <Textarea 
                  id="sintomas" 
                  name="sintomas"
                  placeholder="Descreva os sintomas observados..."
                  maxLength={500}
                  rows={3}
                  required 
                />
                {errors.sintomas && <p className="text-sm text-destructive">{errors.sintomas}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="diagnostico">Diagnóstico *</Label>
                <Textarea 
                  id="diagnostico" 
                  name="diagnostico"
                  placeholder="Diagnóstico e observações clínicas..."
                  maxLength={500}
                  rows={3}
                  required 
                />
                {errors.diagnostico && <p className="text-sm text-destructive">{errors.diagnostico}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="prescricao">Prescrição *</Label>
                <Textarea 
                  id="prescricao" 
                  name="prescricao"
                  placeholder="Medicamentos, dosagens e orientações..."
                  maxLength={500}
                  rows={3}
                  required 
                />
                {errors.prescricao && <p className="text-sm text-destructive">{errors.prescricao}</p>}
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar Consulta</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-4">
        {consultas.map((consulta, index) => (
          <Card key={index} className="p-5 shadow-card border-l-4 border-l-primary hover:shadow-medical transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-lg text-foreground">{consulta.data}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {consulta.veterinario}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(index)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium text-foreground">Sintomas:</span>{" "}
                    <span className="text-muted-foreground">{consulta.sintomas}</span>
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Diagnóstico:</span>{" "}
                    <span className="text-muted-foreground">{consulta.diagnostico}</span>
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Prescrição:</span>{" "}
                    <span className="text-muted-foreground">{consulta.prescricao}</span>
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
