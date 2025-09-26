import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Mensagem {
  id: string;
  id_tutor: string;
  id_usuario?: string;
  mensagem: string;
  remetente: "tutor" | "clinica";
  lida: boolean;
  data_envio: string;
  tutor?: {
    nome: string;
    telefone: string;
  };
  usuario?: {
    nome: string;
  };
}

export const useMensagens = () => {
  return useQuery({
    queryKey: ["mensagens"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mensagens")
        .select(`
          *,
          tutor:tutores(nome, telefone),
          usuario:usuarios(nome)
        `)
        .order("data_envio", { ascending: false });
      
      if (error) throw error;
      return data as Mensagem[];
    },
  });
};

export const useMensagensByTutor = (tutorId: string) => {
  return useQuery({
    queryKey: ["mensagens", "tutor", tutorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mensagens")
        .select(`
          *,
          usuario:usuarios(nome)
        `)
        .eq("id_tutor", tutorId)
        .order("data_envio", { ascending: true });
      
      if (error) throw error;
      return data as Mensagem[];
    },
    enabled: !!tutorId,
  });
};

export const useMensagensNaoLidas = () => {
  return useQuery({
    queryKey: ["mensagens", "nao-lidas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mensagens")
        .select("*")
        .eq("lida", false)
        .eq("remetente", "tutor"); // Mensagens de tutores não lidas pela clínica
      
      if (error) throw error;
      return data.length;
    },
  });
};

export const useCreateMensagem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (mensagem: Omit<Mensagem, "id" | "data_envio" | "lida" | "tutor" | "usuario">) => {
      const { data, error } = await supabase
        .from("mensagens")
        .insert([mensagem])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mensagens"] });
      toast({
        title: "Sucesso",
        description: "Mensagem enviada com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: "Erro ao enviar mensagem: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useMarcarMensagemLida = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("mensagens")
        .update({ lida: true })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mensagens"] });
    },
  });
};