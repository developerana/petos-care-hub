import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Consulta {
  id: string;
  data_consulta: string;
  hora_consulta: string;
  id_pet: string;
  id_veterinario: string;
  status: "Agendada" | "Realizada" | "Cancelada";
  anamnese?: string;
  diagnostico?: string;
  tratamento?: string;
  data_cadastro: string;
  pet?: {
    nome: string;
    especie: string;
    tutor: {
      nome: string;
      telefone: string;
    };
  };
  veterinario?: {
    nome: string;
    especialidade: string;
  };
}

export const useConsultas = () => {
  return useQuery({
    queryKey: ["consultas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consultas")
        .select(`
          *,
          pet:pets(
            nome,
            especie,
            tutor:tutores(nome, telefone)
          ),
          veterinario:veterinarios(nome, especialidade)
        `)
        .order("data_consulta", { ascending: true });
      
      if (error) throw error;
      return data as Consulta[];
    },
  });
};

export const useConsultasByPet = (petId: string) => {
  return useQuery({
    queryKey: ["consultas", "pet", petId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consultas")
        .select(`
          *,
          veterinario:veterinarios(nome, especialidade)
        `)
        .eq("id_pet", petId)
        .order("data_consulta", { ascending: false });
      
      if (error) throw error;
      return data as Consulta[];
    },
    enabled: !!petId,
  });
};

export const useProximasConsultas = () => {
  const hoje = new Date().toISOString().split('T')[0];
  const seteDias = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return useQuery({
    queryKey: ["consultas", "proximas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consultas")
        .select(`
          *,
          pet:pets(
            nome,
            especie,
            tutor:tutores(nome, telefone)
          ),
          veterinario:veterinarios(nome, especialidade)
        `)
        .eq("status", "Agendada")
        .gte("data_consulta", hoje)
        .lte("data_consulta", seteDias)
        .order("data_consulta", { ascending: true });
      
      if (error) throw error;
      return data as Consulta[];
    },
  });
};

export const useConsultasHoje = () => {
  const hoje = new Date().toISOString().split('T')[0];

  return useQuery({
    queryKey: ["consultas", "hoje"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consultas")
        .select("*")
        .eq("data_consulta", hoje)
        .neq("status", "Cancelada");
      
      if (error) throw error;
      return data.length;
    },
  });
};

export const useCreateConsulta = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (consulta: Omit<Consulta, "id" | "data_cadastro" | "pet" | "veterinario">) => {
      const { data, error } = await supabase
        .from("consultas")
        .insert([consulta])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultas"] });
      toast({
        title: "Sucesso",
        description: "Consulta agendada com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao agendar consulta: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateConsulta = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...consulta }: Partial<Consulta> & { id: string }) => {
      const { data, error } = await supabase
        .from("consultas")
        .update(consulta)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultas"] });
      toast({
        title: "Sucesso",
        description: "Consulta atualizada com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar consulta: " + error.message,
        variant: "destructive",
      });
    },
  });
};