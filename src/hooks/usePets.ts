import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Pet {
  id: string;
  nome: string;
  especie: string;
  raca: string | null;
  data_nascimento: string;
  id_tutor: string;
  data_cadastro: string;
  tutor?: {
    nome: string;
    telefone: string;
    email: string;
  };
}

export const usePets = () => {
  return useQuery({
    queryKey: ["pets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pets")
        .select(`
          *,
          tutor:tutores(nome, telefone, email)
        `)
        .order("data_cadastro", { ascending: false });
      
      if (error) throw error;
      return data as Pet[];
    },
  });
};

export const usePetsByTutor = (tutorId: string) => {
  return useQuery({
    queryKey: ["pets", "tutor", tutorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("id_tutor", tutorId)
        .order("data_cadastro", { ascending: false });
      
      if (error) throw error;
      return data as Pet[];
    },
    enabled: !!tutorId,
  });
};

export const usePet = (id: string) => {
  return useQuery({
    queryKey: ["pets", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pets")
        .select(`
          *,
          tutor:tutores(nome, telefone, email)
        `)
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data as Pet;
    },
    enabled: !!id,
  });
};

export const useCreatePet = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (pet: Omit<Pet, "id" | "data_cadastro" | "tutor">) => {
      const { data, error } = await supabase
        .from("pets")
        .insert([pet])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      toast({
        title: "Sucesso",
        description: "Pet cadastrado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao cadastrar pet: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdatePet = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...pet }: Partial<Pet> & { id: string }) => {
      const { data, error } = await supabase
        .from("pets")
        .update(pet)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      toast({
        title: "Sucesso",
        description: "Pet atualizado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar pet: " + error.message,
        variant: "destructive",
      });
    },
  });
};