import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useCreateConsulta } from "@/hooks/useConsultas";
import { useVeterinariosAtivos } from "@/hooks/useVeterinarios";
import { z } from "zod";

const consultaSchema = z.object({
  data_consulta: z.string().min(1, "Data é obrigatória"),
  hora_consulta: z.string().min(1, "Hora é obrigatória"),
  id_veterinario: z.string().min(1, "Veterinário é obrigatório"),
});

interface AgendarConsultaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  petId: string;
  petName: string;
}

export function AgendarConsultaDialog({ 
  open, 
  onOpenChange, 
  petId, 
  petName 
}: AgendarConsultaDialogProps) {
  const [date, setDate] = useState<Date>();
  const [hora, setHora] = useState("");
  const [veterinarioId, setVeterinarioId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createConsulta = useCreateConsulta();
  const { data: veterinarios = [] } = useVeterinariosAtivos();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = {
      data_consulta: date ? format(date, "yyyy-MM-dd") : "",
      hora_consulta: hora,
      id_veterinario: veterinarioId,
    };

    try {
      consultaSchema.parse(formData);
      setErrors({});

      await createConsulta.mutateAsync({
        ...formData,
        id_pet: petId,
        status: "Agendada",
      });

      // Reset form
      setDate(undefined);
      setHora("");
      setVeterinarioId("");
      onOpenChange(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  const horariosDisponiveis = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", 
    "11:00", "11:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agendar Consulta para {petName}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="data">Data da Consulta *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            {errors.data_consulta && (
              <p className="text-sm text-destructive">{errors.data_consulta}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="hora">Horário *</Label>
            <Select value={hora} onValueChange={setHora}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o horário" />
              </SelectTrigger>
              <SelectContent>
                {horariosDisponiveis.map((horario) => (
                  <SelectItem key={horario} value={horario}>
                    {horario}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.hora_consulta && (
              <p className="text-sm text-destructive">{errors.hora_consulta}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="veterinario">Veterinário *</Label>
            <Select value={veterinarioId} onValueChange={setVeterinarioId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o veterinário" />
              </SelectTrigger>
              <SelectContent>
                {veterinarios.map((vet) => (
                  <SelectItem key={vet.id} value={vet.id}>
                    Dr(a). {vet.nome} - {vet.especialidade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.id_veterinario && (
              <p className="text-sm text-destructive">{errors.id_veterinario}</p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={createConsulta.isPending}
            >
              {createConsulta.isPending ? "Agendando..." : "Agendar Consulta"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
