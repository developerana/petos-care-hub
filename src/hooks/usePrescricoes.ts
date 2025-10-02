import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Prescricao {
  id: string;
  id_pet: string;
  id_consulta: string | null;
  medicamento: string;
  posologia: string;
  data_prescricao: string;
  id_veterinario: string | null;
  observacoes: string | null;
  data_cadastro: string;
  veterinario?: {
    nome: string;
  };
}

export const usePrescricoesByPet = (petId: string) => {
  return useQuery({
    queryKey: ["prescricoes", "pet", petId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prescricoes")
        .select("*")
        .eq("id_pet", petId)
        .order("data_prescricao", { ascending: false });
      
      if (error) throw error;
      return data as Prescricao[];
    },
    enabled: !!petId,
  });
};

export const useCreatePrescricao = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (prescricao: Omit<Prescricao, "id" | "data_cadastro" | "veterinario">) => {
      const { data, error } = await supabase
        .from("prescricoes")
        .insert([prescricao])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescricoes"] });
      toast({
        title: "Sucesso",
        description: "Prescrição registrada com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao registrar prescrição: " + error.message,
        variant: "destructive",
      });
    },
  });
};
