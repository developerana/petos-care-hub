import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Veterinario {
  id: string;
  nome: string;
  especialidade: string;
  email: string;
  ativo: boolean;
  data_cadastro: string;
}

export const useVeterinarios = () => {
  return useQuery({
    queryKey: ["veterinarios"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("veterinarios")
        .select("*")
        .order("nome");
      
      if (error) throw error;
      return data as Veterinario[];
    },
  });
};

export const useVeterinariosAtivos = () => {
  return useQuery({
    queryKey: ["veterinarios", "ativos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("veterinarios")
        .select("*")
        .eq("ativo", true)
        .order("nome");
      
      if (error) throw error;
      return data as Veterinario[];
    },
  });
};

export const useCreateVeterinario = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (veterinario: Omit<Veterinario, "id" | "data_cadastro">) => {
      const { data, error } = await supabase
        .from("veterinarios")
        .insert([veterinario])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["veterinarios"] });
      toast({
        title: "Sucesso",
        description: "Veterinário cadastrado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao cadastrar veterinário: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateVeterinario = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...veterinario }: Partial<Veterinario> & { id: string }) => {
      const { data, error } = await supabase
        .from("veterinarios")
        .update(veterinario)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["veterinarios"] });
      toast({
        title: "Sucesso",
        description: "Veterinário atualizado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar veterinário: " + error.message,
        variant: "destructive",
      });
    },
  });
};