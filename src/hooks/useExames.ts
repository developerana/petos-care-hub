import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Exame {
  id: string;
  id_pet: string;
  id_consulta?: string;
  tipo_exame: string;
  data_realizacao: string;
  resultado?: string;
  arquivo_url?: string;
  observacoes?: string;
  data_cadastro: string;
}

export function useExamesByPet(petId: string) {
  return useQuery({
    queryKey: ["exames", petId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exames")
        .select("*")
        .eq("id_pet", petId)
        .order("data_realizacao", { ascending: false });

      if (error) throw error;
      return data as Exame[];
    },
    enabled: !!petId,
  });
}

export function useCreateExame() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (exame: Omit<Exame, "id" | "data_cadastro">) => {
      const { data, error } = await supabase
        .from("exames")
        .insert([exame])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exames"] });
      toast({
        title: "Exame registrado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao registrar exame",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}