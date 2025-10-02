export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      acessos_tutores: {
        Row: {
          ativo: boolean
          data_criacao: string
          email: string
          id: string
          id_tutor: string
          user_id: string | null
        }
        Insert: {
          ativo?: boolean
          data_criacao?: string
          email: string
          id?: string
          id_tutor: string
          user_id?: string | null
        }
        Update: {
          ativo?: boolean
          data_criacao?: string
          email?: string
          id?: string
          id_tutor?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "acessos_tutores_id_tutor_fkey"
            columns: ["id_tutor"]
            isOneToOne: false
            referencedRelation: "tutores"
            referencedColumns: ["id"]
          },
        ]
      }
      clinicas: {
        Row: {
          ativo: boolean
          cnpj: string
          data_criacao: string
          email: string
          endereco: string
          id: string
          nome: string
          telefone: string
        }
        Insert: {
          ativo?: boolean
          cnpj: string
          data_criacao?: string
          email: string
          endereco: string
          id?: string
          nome: string
          telefone: string
        }
        Update: {
          ativo?: boolean
          cnpj?: string
          data_criacao?: string
          email?: string
          endereco?: string
          id?: string
          nome?: string
          telefone?: string
        }
        Relationships: []
      }
      consultas: {
        Row: {
          anamnese: string | null
          data_cadastro: string
          data_consulta: string
          diagnostico: string | null
          hora_consulta: string
          id: string
          id_pet: string
          id_veterinario: string
          status: string
          tratamento: string | null
        }
        Insert: {
          anamnese?: string | null
          data_cadastro?: string
          data_consulta: string
          diagnostico?: string | null
          hora_consulta: string
          id?: string
          id_pet: string
          id_veterinario: string
          status?: string
          tratamento?: string | null
        }
        Update: {
          anamnese?: string | null
          data_cadastro?: string
          data_consulta?: string
          diagnostico?: string | null
          hora_consulta?: string
          id?: string
          id_pet?: string
          id_veterinario?: string
          status?: string
          tratamento?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultas_id_pet_fkey"
            columns: ["id_pet"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultas_id_veterinario_fkey"
            columns: ["id_veterinario"]
            isOneToOne: false
            referencedRelation: "veterinarios"
            referencedColumns: ["id"]
          },
        ]
      }
      exames: {
        Row: {
          arquivo_url: string | null
          data_cadastro: string
          data_realizacao: string
          id: string
          id_consulta: string | null
          id_pet: string
          observacoes: string | null
          resultado: string | null
          tipo_exame: string
        }
        Insert: {
          arquivo_url?: string | null
          data_cadastro?: string
          data_realizacao: string
          id?: string
          id_consulta?: string | null
          id_pet: string
          observacoes?: string | null
          resultado?: string | null
          tipo_exame: string
        }
        Update: {
          arquivo_url?: string | null
          data_cadastro?: string
          data_realizacao?: string
          id?: string
          id_consulta?: string | null
          id_pet?: string
          observacoes?: string | null
          resultado?: string | null
          tipo_exame?: string
        }
        Relationships: []
      }
      financeiro: {
        Row: {
          data_cadastro: string
          data_pagamento: string | null
          data_vencimento: string
          descricao: string
          id: string
          id_consulta: string | null
          id_pet: string
          status: string
          tipo: string
          valor: number
        }
        Insert: {
          data_cadastro?: string
          data_pagamento?: string | null
          data_vencimento: string
          descricao: string
          id?: string
          id_consulta?: string | null
          id_pet: string
          status?: string
          tipo: string
          valor: number
        }
        Update: {
          data_cadastro?: string
          data_pagamento?: string | null
          data_vencimento?: string
          descricao?: string
          id?: string
          id_consulta?: string | null
          id_pet?: string
          status?: string
          tipo?: string
          valor?: number
        }
        Relationships: []
      }
      fotos_pets: {
        Row: {
          data_cadastro: string
          id: string
          id_pet: string
          principal: boolean
          url_foto: string
        }
        Insert: {
          data_cadastro?: string
          id?: string
          id_pet: string
          principal?: boolean
          url_foto: string
        }
        Update: {
          data_cadastro?: string
          id?: string
          id_pet?: string
          principal?: boolean
          url_foto?: string
        }
        Relationships: []
      }
      horarios_disponiveis: {
        Row: {
          data: string
          data_criacao: string
          disponivel: boolean
          hora_fim: string
          hora_inicio: string
          id: string
          id_veterinario: string
          observacoes: string | null
        }
        Insert: {
          data: string
          data_criacao?: string
          disponivel?: boolean
          hora_fim: string
          hora_inicio: string
          id?: string
          id_veterinario: string
          observacoes?: string | null
        }
        Update: {
          data?: string
          data_criacao?: string
          disponivel?: boolean
          hora_fim?: string
          hora_inicio?: string
          id?: string
          id_veterinario?: string
          observacoes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "horarios_disponiveis_id_veterinario_fkey"
            columns: ["id_veterinario"]
            isOneToOne: false
            referencedRelation: "veterinarios"
            referencedColumns: ["id"]
          },
        ]
      }
      mensagens: {
        Row: {
          data_envio: string
          id: string
          id_tutor: string
          id_usuario: string | null
          lida: boolean
          mensagem: string
          remetente: string
        }
        Insert: {
          data_envio?: string
          id?: string
          id_tutor: string
          id_usuario?: string | null
          lida?: boolean
          mensagem: string
          remetente: string
        }
        Update: {
          data_envio?: string
          id?: string
          id_tutor?: string
          id_usuario?: string | null
          lida?: boolean
          mensagem?: string
          remetente?: string
        }
        Relationships: [
          {
            foreignKeyName: "mensagens_id_tutor_fkey"
            columns: ["id_tutor"]
            isOneToOne: false
            referencedRelation: "tutores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mensagens_id_usuario_fkey"
            columns: ["id_usuario"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      notificacoes: {
        Row: {
          data_envio: string
          data_leitura: string | null
          id: string
          id_tutor: string | null
          id_usuario: string | null
          lida: boolean
          mensagem: string
          tipo: string
          titulo: string
        }
        Insert: {
          data_envio?: string
          data_leitura?: string | null
          id?: string
          id_tutor?: string | null
          id_usuario?: string | null
          lida?: boolean
          mensagem: string
          tipo: string
          titulo: string
        }
        Update: {
          data_envio?: string
          data_leitura?: string | null
          id?: string
          id_tutor?: string | null
          id_usuario?: string | null
          lida?: boolean
          mensagem?: string
          tipo?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "notificacoes_id_tutor_fkey"
            columns: ["id_tutor"]
            isOneToOne: false
            referencedRelation: "tutores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notificacoes_id_usuario_fkey"
            columns: ["id_usuario"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          cor: string | null
          data_cadastro: string
          data_nascimento: string
          especie: string
          id: string
          id_tutor: string
          microchip: string | null
          nome: string
          peso: number | null
          raca: string | null
          sexo: string | null
        }
        Insert: {
          cor?: string | null
          data_cadastro?: string
          data_nascimento: string
          especie: string
          id?: string
          id_tutor: string
          microchip?: string | null
          nome: string
          peso?: number | null
          raca?: string | null
          sexo?: string | null
        }
        Update: {
          cor?: string | null
          data_cadastro?: string
          data_nascimento?: string
          especie?: string
          id?: string
          id_tutor?: string
          microchip?: string | null
          nome?: string
          peso?: number | null
          raca?: string | null
          sexo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pets_id_tutor_fkey"
            columns: ["id_tutor"]
            isOneToOne: false
            referencedRelation: "tutores"
            referencedColumns: ["id"]
          },
        ]
      }
      prescricoes: {
        Row: {
          data_cadastro: string
          data_prescricao: string
          id: string
          id_consulta: string | null
          id_pet: string
          id_veterinario: string | null
          medicamento: string
          observacoes: string | null
          posologia: string
        }
        Insert: {
          data_cadastro?: string
          data_prescricao: string
          id?: string
          id_consulta?: string | null
          id_pet: string
          id_veterinario?: string | null
          medicamento: string
          observacoes?: string | null
          posologia: string
        }
        Update: {
          data_cadastro?: string
          data_prescricao?: string
          id?: string
          id_consulta?: string | null
          id_pet?: string
          id_veterinario?: string | null
          medicamento?: string
          observacoes?: string | null
          posologia?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ativo: boolean
          data_criacao: string
          email: string
          id: string
          id_clinica: string | null
          id_referencia: string | null
          nome: string
          tipo_perfil: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          data_criacao?: string
          email: string
          id: string
          id_clinica?: string | null
          id_referencia?: string | null
          nome: string
          tipo_perfil: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          data_criacao?: string
          email?: string
          id?: string
          id_clinica?: string | null
          id_referencia?: string | null
          nome?: string
          tipo_perfil?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_clinica_fkey"
            columns: ["id_clinica"]
            isOneToOne: false
            referencedRelation: "clinicas"
            referencedColumns: ["id"]
          },
        ]
      }
      tratamentos: {
        Row: {
          data_cadastro: string
          data_fim: string | null
          data_inicio: string
          diagnostico_atual: string
          id: string
          id_consulta: string | null
          id_pet: string
          id_veterinario: string | null
          medicacoes: Json | null
          recomendacoes: string | null
          status: string
          tratamento_prescrito: string
        }
        Insert: {
          data_cadastro?: string
          data_fim?: string | null
          data_inicio: string
          diagnostico_atual: string
          id?: string
          id_consulta?: string | null
          id_pet: string
          id_veterinario?: string | null
          medicacoes?: Json | null
          recomendacoes?: string | null
          status?: string
          tratamento_prescrito: string
        }
        Update: {
          data_cadastro?: string
          data_fim?: string | null
          data_inicio?: string
          diagnostico_atual?: string
          id?: string
          id_consulta?: string | null
          id_pet?: string
          id_veterinario?: string | null
          medicacoes?: Json | null
          recomendacoes?: string | null
          status?: string
          tratamento_prescrito?: string
        }
        Relationships: []
      }
      tutores: {
        Row: {
          cpf: string | null
          data_cadastro: string
          email: string
          endereco: string | null
          id: string
          id_clinica: string | null
          nome: string
          rg: string | null
          telefone: string
        }
        Insert: {
          cpf?: string | null
          data_cadastro?: string
          email: string
          endereco?: string | null
          id?: string
          id_clinica?: string | null
          nome: string
          rg?: string | null
          telefone: string
        }
        Update: {
          cpf?: string | null
          data_cadastro?: string
          email?: string
          endereco?: string | null
          id?: string
          id_clinica?: string | null
          nome?: string
          rg?: string | null
          telefone?: string
        }
        Relationships: [
          {
            foreignKeyName: "tutores_id_clinica_fkey"
            columns: ["id_clinica"]
            isOneToOne: false
            referencedRelation: "clinicas"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          ativo: boolean
          data_criacao: string
          email: string
          id: string
          id_clinica: string | null
          id_veterinario: string | null
          nome: string
          tipo_perfil: string
          user_id: string | null
        }
        Insert: {
          ativo?: boolean
          data_criacao?: string
          email: string
          id?: string
          id_clinica?: string | null
          id_veterinario?: string | null
          nome: string
          tipo_perfil: string
          user_id?: string | null
        }
        Update: {
          ativo?: boolean
          data_criacao?: string
          email?: string
          id?: string
          id_clinica?: string | null
          id_veterinario?: string | null
          nome?: string
          tipo_perfil?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_id_clinica_fkey"
            columns: ["id_clinica"]
            isOneToOne: false
            referencedRelation: "clinicas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuarios_id_veterinario_fkey"
            columns: ["id_veterinario"]
            isOneToOne: false
            referencedRelation: "veterinarios"
            referencedColumns: ["id"]
          },
        ]
      }
      vacinas: {
        Row: {
          data_aplicacao: string
          data_cadastro: string
          id: string
          id_pet: string
          id_veterinario: string | null
          nome_vacina: string
          observacoes: string | null
          proxima_dose: string | null
        }
        Insert: {
          data_aplicacao: string
          data_cadastro?: string
          id?: string
          id_pet: string
          id_veterinario?: string | null
          nome_vacina: string
          observacoes?: string | null
          proxima_dose?: string | null
        }
        Update: {
          data_aplicacao?: string
          data_cadastro?: string
          id?: string
          id_pet?: string
          id_veterinario?: string | null
          nome_vacina?: string
          observacoes?: string | null
          proxima_dose?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vacinas_id_pet_fkey"
            columns: ["id_pet"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      veterinarios: {
        Row: {
          ativo: boolean
          data_cadastro: string
          email: string
          especialidade: string
          id: string
          id_clinica: string | null
          nome: string
        }
        Insert: {
          ativo?: boolean
          data_cadastro?: string
          email: string
          especialidade: string
          id?: string
          id_clinica?: string | null
          nome: string
        }
        Update: {
          ativo?: boolean
          data_cadastro?: string
          email?: string
          especialidade?: string
          id?: string
          id_clinica?: string | null
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "veterinarios_id_clinica_fkey"
            columns: ["id_clinica"]
            isOneToOne: false
            referencedRelation: "clinicas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
