import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCurrentTutor = () => {
  return useQuery({
    queryKey: ["current-tutor"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      const { data, error } = await supabase
        .from("acessos_tutores" as any)
        .select(`
          id_tutor,
          tutor:tutores(*)
        `)
        .eq("user_id", user.id)
        .eq("ativo", true)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });
};
