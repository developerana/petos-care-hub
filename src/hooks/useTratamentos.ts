import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Tratamento {
  id: string;
  id_pet: string;
  id_consulta?: string;
  diagnostico_atual: string;
  tratamento_prescrito: string;
  recomendacoes?: string;
  data_inicio: string;
  data_fim?: string;
  status: string;
  data_cadastro: string;
}

export function useTratamentosByPet(petId: string) {
  return useQuery({
    queryKey: ["tratamentos", petId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tratamentos")
        .select("*")
        .eq("id_pet", petId)
        .order("data_inicio", { ascending: false });

      if (error) throw error;
      return data as Tratamento[];
    },
    enabled: !!petId,
  });
}

export function useCreateTratamento() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (tratamento: Omit<Tratamento, "id" | "data_cadastro">) => {
      const { data, error } = await supabase
        .from("tratamentos")
        .insert([tratamento])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tratamentos"] });
      toast({
        title: "Tratamento registrado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao registrar tratamento",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateTratamento() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...tratamento }: Partial<Tratamento> & { id: string }) => {
      const { data, error } = await supabase
        .from("tratamentos")
        .update(tratamento)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tratamentos"] });
      toast({
        title: "Tratamento atualizado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar tratamento",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}