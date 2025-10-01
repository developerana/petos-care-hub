import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Tutor {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  data_cadastro: string;
}

export const useTutores = () => {
  return useQuery({
    queryKey: ["tutores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tutores")
        .select("*")
        .order("data_cadastro", { ascending: false });
      
      if (error) throw error;
      return data as Tutor[];
    },
  });
};

export const useTutor = (id: string) => {
  return useQuery({
    queryKey: ["tutor", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tutores")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data as Tutor;
    },
    enabled: !!id,
  });
};

export const useCreateTutor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (tutor: Omit<Tutor, "id" | "data_cadastro">) => {
      const { data, error } = await supabase
        .from("tutores")
        .insert([tutor])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutores"] });
      toast({
        title: "Sucesso",
        description: "Tutor cadastrado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao cadastrar tutor: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateTutor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...tutor }: Partial<Tutor> & { id: string }) => {
      const { data, error } = await supabase
        .from("tutores")
        .update(tutor)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutores"] });
      toast({
        title: "Sucesso",
        description: "Tutor atualizado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar tutor: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteTutor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("tutores")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutores"] });
      toast({
        title: "Sucesso",
        description: "Tutor excluído com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao excluir tutor: " + error.message,
        variant: "destructive",
      });
    },
  });
};