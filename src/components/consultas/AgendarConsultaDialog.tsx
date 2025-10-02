import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { usePets } from "@/hooks/usePets";
import { useVeterinariosAtivos } from "@/hooks/useVeterinarios";
import { useCreateConsulta } from "@/hooks/useConsultas";

const consultaSchema = z.object({
  id_pet: z.string().nonempty({ message: "Selecione um pet" }),
  id_veterinario: z.string().nonempty({ message: "Selecione um veterinário" }),
  data_consulta: z.date({ required_error: "Selecione uma data" }),
  hora_consulta: z
    .string()
    .nonempty({ message: "Informe o horário" })
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Formato inválido. Use HH:MM (ex: 14:30)",
    }),
  anamnese: z
    .string()
    .max(1000, { message: "Observações deve ter no máximo 1000 caracteres" })
    .optional(),
  status: z.enum(["Agendada", "Realizada", "Cancelada"]).default("Agendada"),
});

type ConsultaFormValues = z.infer<typeof consultaSchema>;

interface AgendarConsultaDialogProps {
  children: React.ReactNode;
}

export function AgendarConsultaDialog({ children }: AgendarConsultaDialogProps) {
  const [open, setOpen] = useState(false);
  const { data: pets = [], isLoading: loadingPets } = usePets();
  const { data: veterinarios = [], isLoading: loadingVets } = useVeterinariosAtivos();
  const createConsulta = useCreateConsulta();

  const form = useForm<ConsultaFormValues>({
    resolver: zodResolver(consultaSchema),
    defaultValues: {
      status: "Agendada",
    },
  });

  const onSubmit = async (values: ConsultaFormValues) => {
    const dataFormatada = format(values.data_consulta, "yyyy-MM-dd");
    
    await createConsulta.mutateAsync({
      id_pet: values.id_pet,
      id_veterinario: values.id_veterinario,
      data_consulta: dataFormatada,
      hora_consulta: values.hora_consulta,
      status: values.status,
      anamnese: values.anamnese || null,
      diagnostico: null,
      tratamento: null,
    });

    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agendar Consulta</DialogTitle>
          <DialogDescription>
            Preencha os dados para agendar uma nova consulta veterinária
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Seleção de Pet */}
            <FormField
              control={form.control}
              name="id_pet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pet *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={loadingPets}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o pet" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pets.map((pet) => (
                        <SelectItem key={pet.id} value={pet.id}>
                          {pet.nome} - {pet.especie} ({pet.tutor?.nome})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Seleção de Veterinário */}
            <FormField
              control={form.control}
              name="id_veterinario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Veterinário *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={loadingVets}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o veterinário" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {veterinarios.map((vet) => (
                        <SelectItem key={vet.id} value={vet.id}>
                          {vet.nome} - {vet.especialidade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Data da Consulta */}
            <FormField
              control={form.control}
              name="data_consulta"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data da Consulta *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy")
                          ) : (
                            <span>Selecione a data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hora da Consulta */}
            <FormField
              control={form.control}
              name="hora_consulta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horário *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="14:30"
                      {...field}
                      maxLength={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Observações */}
            <FormField
              control={form.control}
              name="anamnese"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Motivo da consulta, sintomas, observações..."
                      className="resize-none"
                      rows={3}
                      maxLength={1000}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createConsulta.isPending}
                className="bg-success hover:bg-success/90"
              >
                {createConsulta.isPending ? "Agendando..." : "Agendar Consulta"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
