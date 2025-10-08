import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Recepcionista {
  id: string;
  nome: string;
  email: string;
  tipo_perfil: string;
  user_id?: string;
  ativo: boolean;
  data_criacao: string;
  id_clinica?: string;
}

export const useRecepcionistas = () => {
  return useQuery({
    queryKey: ["recepcionistas"],
    queryFn: async () => {
      const { data: profile } = await supabase
        .from("profiles" as any)
        .select("id_clinica")
        .eq("id", (await supabase.auth.getUser()).data.user?.id)
        .single() as { data: any };

      const { data, error } = await supabase
        .from("usuarios" as any)
        .select("*")
        .eq("tipo_perfil", "recepcionista")
        .eq("id_clinica", profile?.id_clinica)
        .order("nome") as { data: any; error: any };

      if (error) throw error;
      return data as Recepcionista[];
    },
  });
};

export const useCreateRecepcionista = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recepcionista: Omit<Recepcionista, "id" | "data_criacao" | "user_id" | "id_clinica" | "tipo_perfil">) => {
      const { data: profile } = await supabase
        .from("profiles" as any)
        .select("id_clinica")
        .eq("id", (await supabase.auth.getUser()).data.user?.id)
        .single() as { data: any };

      const { data, error } = await supabase
        .from("usuarios" as any)
        .insert({
          ...recepcionista,
          tipo_perfil: "recepcionista",
          id_clinica: profile?.id_clinica,
        })
        .select()
        .single() as { data: any; error: any };

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recepcionistas"] });
      toast.success("Recepcionista cadastrado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao cadastrar recepcionista");
    },
  });
};

export const useUpdateRecepcionista = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Recepcionista> & { id: string }) => {
      const { data, error } = await supabase
        .from("usuarios" as any)
        .update(updates)
        .eq("id", id)
        .select()
        .single() as { data: any; error: any };

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recepcionistas"] });
      toast.success("Recepcionista atualizado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar recepcionista");
    },
  });
};
