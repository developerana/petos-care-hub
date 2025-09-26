import { useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Usuario {
  id: string;
  email: string;
  nome: string;
  tipo_perfil: "admin" | "veterinario" | "recepcionista";
  id_veterinario?: string;
  ativo: boolean;
  user_id: string;
}

export interface AcessoTutor {
  id: string;
  id_tutor: string;
  email: string;
  user_id: string;
  ativo: boolean;
  tutor?: {
    nome: string;
    telefone: string;
  };
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [acessoTutor, setAcessoTutor] = useState<AcessoTutor | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Configurar listener de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Buscar dados do usuário funcionário
          const { data: userData } = await supabase
            .from("usuarios")
            .select("*")
            .eq("user_id", session.user.id)
            .single();
          
          if (userData) {
            setUsuario(userData as Usuario);
            setAcessoTutor(null);
          } else {
            // Buscar dados do tutor
            const { data: tutorData } = await supabase
              .from("acessos_tutores")
              .select(`
                *,
                tutor:tutores(nome, telefone)
              `)
              .eq("user_id", session.user.id)
              .single();
            
            if (tutorData) {
              setAcessoTutor(tutorData as AcessoTutor);
              setUsuario(null);
            }
          }
        } else {
          setUsuario(null);
          setAcessoTutor(null);
        }
        
        setLoading(false);
      }
    );

    // Verificar sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Login realizado com sucesso!",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: userData,
        },
      });
      
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Conta criada com sucesso! Verifique seu email.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Logout realizado com sucesso!",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const isStaff = () => !!usuario;
  const isTutor = () => !!acessoTutor;
  const isAdmin = () => usuario?.tipo_perfil === "admin";
  const isVeterinario = () => usuario?.tipo_perfil === "veterinario";
  const isRecepcionista = () => usuario?.tipo_perfil === "recepcionista";

  return {
    user,
    session,
    usuario,
    acessoTutor,
    loading,
    signIn,
    signUp,
    signOut,
    isStaff,
    isTutor,
    isAdmin,
    isVeterinario,
    isRecepcionista,
  };
};