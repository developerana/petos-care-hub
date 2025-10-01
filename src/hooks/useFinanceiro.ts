import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Financeiro {
  id: string;
  id_pet: string;
  id_consulta?: string;
  descricao: string;
  valor: number;
  data_vencimento: string;
  data_pagamento?: string;
  status: string;
  tipo: string;
  data_cadastro: string;
}

export function useFinanceiroByPet(petId: string) {
  return useQuery({
    queryKey: ["financeiro", petId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financeiro")
        .select("*")
        .eq("id_pet", petId)
        .order("data_vencimento", { ascending: false });

      if (error) throw error;
      return data as Financeiro[];
    },
    enabled: !!petId,
  });
}

export function useCreateFinanceiro() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (financeiro: Omit<Financeiro, "id" | "data_cadastro">) => {
      const { data, error } = await supabase
        .from("financeiro")
        .insert([financeiro])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financeiro"] });
      toast({
        title: "Registro financeiro criado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar registro financeiro",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateFinanceiro() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...financeiro }: Partial<Financeiro> & { id: string }) => {
      const { data, error } = await supabase
        .from("financeiro")
        .update(financeiro)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financeiro"] });
      toast({
        title: "Registro financeiro atualizado!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar registro",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}