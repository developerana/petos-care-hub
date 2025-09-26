import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Notificacao {
  id: string;
  id_usuario?: string;
  id_tutor?: string;
  tipo: "lembrete_consulta" | "lembrete_vacina" | "confirmacao" | "cancelamento" | "geral";
  titulo: string;
  mensagem: string;
  lida: boolean;
  data_envio: string;
  data_leitura?: string;
}

export const useNotificacoes = () => {
  return useQuery({
    queryKey: ["notificacoes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notificacoes")
        .select("*")
        .order("data_envio", { ascending: false });
      
      if (error) throw error;
      return data as Notificacao[];
    },
  });
};

export const useNotificacoesNaoLidas = () => {
  return useQuery({
    queryKey: ["notificacoes", "nao-lidas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notificacoes")
        .select("*")
        .eq("lida", false)
        .order("data_envio", { ascending: false });
      
      if (error) throw error;
      return data as Notificacao[];
    },
  });
};

export const useMarcarNotificacaoLida = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("notificacoes")
        .update({ 
          lida: true, 
          data_leitura: new Date().toISOString() 
        })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificacoes"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: "Erro ao marcar notificação como lida: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useCreateNotificacao = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (notificacao: Omit<Notificacao, "id" | "data_envio" | "lida" | "data_leitura">) => {
      const { data, error } = await supabase
        .from("notificacoes")
        .insert([notificacao])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificacoes"] });
      toast({
        title: "Sucesso",
        description: "Notificação criada com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: "Erro ao criar notificação: " + error.message,
        variant: "destructive",
      });
    },
  });
};