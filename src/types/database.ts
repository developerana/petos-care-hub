// Tipos manuais para tabelas que existem no banco mas não estão nos types gerados

export interface Profile {
  id: string;
  nome: string;
  email: string;
  tipo_perfil: string;
  id_clinica: string | null;
  id_referencia: string | null;
  ativo: boolean;
  data_criacao: string;
  updated_at: string;
}

export interface ProfileInsert {
  id: string;
  nome: string;
  email: string;
  tipo_perfil: string;
  id_clinica?: string | null;
  id_referencia?: string | null;
  ativo?: boolean;
}
