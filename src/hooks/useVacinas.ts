import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Vacina {
  id: string;
  id_pet: string;
  nome_vacina: string;
  data_aplicacao: string;
  proxima_dose?: string;
  observacoes?: string;
  data_cadastro: string;
  pet?: {
    nome: string;
    tutor: {
      nome: string;
    };
  };
}

export const useVacinas = () => {
  return useQuery({
    queryKey: ["vacinas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vacinas")
        .select(`
          *,
          pet:pets(
            nome,
            tutor:tutores(nome)
          )
        `)
        .order("data_aplicacao", { ascending: false });
      
      if (error) throw error;
      return data as Vacina[];
    },
  });
};

export const useVacinasByPet = (petId: string) => {
  return useQuery({
    queryKey: ["vacinas", "pet", petId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vacinas")
        .select("*")
        .eq("id_pet", petId)
        .order("data_aplicacao", { ascending: false });
      
      if (error) throw error;
      return data as Vacina[];
    },
    enabled: !!petId,
  });
};

export const useVacinasPendentes = () => {
  const hoje = new Date().toISOString().split('T')[0];

  return useQuery({
    queryKey: ["vacinas", "pendentes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vacinas")
        .select(`
          *,
          pet:pets(
            nome,
            tutor:tutores(nome)
          )
        `)
        .not("proxima_dose", "is", null)
        .lte("proxima_dose", hoje);
      
      if (error) throw error;
      return data as Vacina[];
    },
  });
};

export const useCreateVacina = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (vacina: Omit<Vacina, "id" | "data_cadastro" | "pet">) => {
      const { data, error } = await supabase
        .from("vacinas")
        .insert([vacina])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vacinas"] });
      toast({
        title: "Sucesso",
        description: "Vacina registrada com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao registrar vacina: " + error.message,
        variant: "destructive",
      });
    },
  });
};