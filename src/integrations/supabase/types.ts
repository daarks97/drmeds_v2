export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          achievement_type: string
          description: string
          icon: string
          id: string
          title: string
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          achievement_type: string
          description: string
          icon: string
          id?: string
          title: string
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          achievement_type?: string
          description?: string
          icon?: string
          id?: string
          title?: string
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      conquistas_usuario: {
        Row: {
          data_conquista: string | null
          id: string
          tema: string | null
          tipo: string
          user_id: string | null
        }
        Insert: {
          data_conquista?: string | null
          id?: string
          tema?: string | null
          tipo: string
          user_id?: string | null
        }
        Update: {
          data_conquista?: string | null
          id?: string
          tema?: string | null
          tipo?: string
          user_id?: string | null
        }
        Relationships: []
      }
      flashcards_publicos: {
        Row: {
          conteudo: string | null
          criado_em: string | null
          data: string
          id: string
          tema: string | null
        }
        Insert: {
          conteudo?: string | null
          criado_em?: string | null
          data: string
          id?: string
          tema?: string | null
        }
        Update: {
          conteudo?: string | null
          criado_em?: string | null
          data?: string
          id?: string
          tema?: string | null
        }
        Relationships: []
      }
      questoes: {
        Row: {
          alternativas: Json
          ano: number
          correta: string
          created_at: string | null
          dificuldade: string | null
          enunciado: string
          id: string
          prova: string
          tema: string
        }
        Insert: {
          alternativas: Json
          ano: number
          correta: string
          created_at?: string | null
          dificuldade?: string | null
          enunciado: string
          id?: string
          prova: string
          tema: string
        }
        Update: {
          alternativas?: Json
          ano?: number
          correta?: string
          created_at?: string | null
          dificuldade?: string | null
          enunciado?: string
          id?: string
          prova?: string
          tema?: string
        }
        Relationships: []
      }
      questoes_respostas: {
        Row: {
          acertou: boolean | null
          id: string
          questao_id: string | null
          respondido_em: string | null
          tema: string | null
          user_id: string | null
        }
        Insert: {
          acertou?: boolean | null
          id?: string
          questao_id?: string | null
          respondido_em?: string | null
          tema?: string | null
          user_id?: string | null
        }
        Update: {
          acertou?: boolean | null
          id?: string
          questao_id?: string | null
          respondido_em?: string | null
          tema?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      respostas_questoes: {
        Row: {
          acertou: boolean | null
          alternativa_marcada: string
          correta: string
          data_resposta: string | null
          id: string
          questao_id: string
          tema: string | null
          user_id: string
        }
        Insert: {
          acertou?: boolean | null
          alternativa_marcada: string
          correta: string
          data_resposta?: string | null
          id?: string
          questao_id: string
          tema?: string | null
          user_id: string
        }
        Update: {
          acertou?: boolean | null
          alternativa_marcada?: string
          correta?: string
          data_resposta?: string | null
          id?: string
          questao_id?: string
          tema?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "respostas_questoes_questao_id_fkey"
            columns: ["questao_id"]
            isOneToOne: false
            referencedRelation: "questoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "respostas_questoes_questao_id_fkey"
            columns: ["questao_id"]
            isOneToOne: false
            referencedRelation: "questoes_erradas_por_prova"
            referencedColumns: ["questao_id"]
          },
        ]
      }
      resumos: {
        Row: {
          atualizado_em: string | null
          conteudo: string | null
          id: string
          tema: string
          user_id: string | null
        }
        Insert: {
          atualizado_em?: string | null
          conteudo?: string | null
          id?: string
          tema: string
          user_id?: string | null
        }
        Update: {
          atualizado_em?: string | null
          conteudo?: string | null
          id?: string
          tema?: string
          user_id?: string | null
        }
        Relationships: []
      }
      revisions: {
        Row: {
          created_at: string
          id: string
          is_completed: boolean
          is_refused: boolean
          revision_date: string
          revision_stage: string
          study_plan_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_completed?: boolean
          is_refused?: boolean
          revision_date: string
          revision_stage?: string
          study_plan_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_completed?: boolean
          is_refused?: boolean
          revision_date?: string
          revision_stage?: string
          study_plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "revisions_study_plan_id_fkey"
            columns: ["study_plan_id"]
            isOneToOne: false
            referencedRelation: "study_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      revisoes: {
        Row: {
          concluida: boolean | null
          created_at: string | null
          data_conclusao: string | null
          data_revisao: string
          id: string
          status: string | null
          tema: string
          tipo: string | null
          user_id: string | null
        }
        Insert: {
          concluida?: boolean | null
          created_at?: string | null
          data_conclusao?: string | null
          data_revisao: string
          id?: string
          status?: string | null
          tema: string
          tipo?: string | null
          user_id?: string | null
        }
        Update: {
          concluida?: boolean | null
          created_at?: string | null
          data_conclusao?: string | null
          data_revisao?: string
          id?: string
          status?: string | null
          tema?: string
          tipo?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      study_plans: {
        Row: {
          completed_at: string | null
          created_at: string
          difficulty: string | null
          discipline: string
          id: string
          is_completed: boolean
          is_difficult: boolean | null
          planned_date: string
          resumo: string | null
          study_time_minutes: number | null
          theme: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          difficulty?: string | null
          discipline: string
          id?: string
          is_completed?: boolean
          is_difficult?: boolean | null
          planned_date: string
          resumo?: string | null
          study_time_minutes?: number | null
          theme: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          difficulty?: string | null
          discipline?: string
          id?: string
          is_completed?: boolean
          is_difficult?: boolean | null
          planned_date?: string
          resumo?: string | null
          study_time_minutes?: number | null
          theme?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_xp: {
        Row: {
          level: number | null
          updated_at: string | null
          user_id: string
          xp: number | null
        }
        Insert: {
          level?: number | null
          updated_at?: string | null
          user_id: string
          xp?: number | null
        }
        Update: {
          level?: number | null
          updated_at?: string | null
          user_id?: string
          xp?: number | null
        }
        Relationships: []
      }
      users: {
        Row: {
          course: string | null
          created_at: string
          id: string
          last_level: number | null
          level: string | null
          name: string
          specialty: string | null
          updated_at: string
        }
        Insert: {
          course?: string | null
          created_at?: string
          id?: string
          last_level?: number | null
          level?: string | null
          name: string
          specialty?: string | null
          updated_at?: string
        }
        Update: {
          course?: string | null
          created_at?: string
          id?: string
          last_level?: number | null
          level?: string | null
          name?: string
          specialty?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      desempenho_por_prova: {
        Row: {
          acertos: number | null
          ano: number | null
          data_tentativa: string | null
          percentual: number | null
          prova: string | null
          total: number | null
          user_id: string | null
        }
        Relationships: []
      }
      desempenho_por_tema: {
        Row: {
          percentual_acerto: number | null
          tema: string | null
          total_acertos: number | null
          total_respostas: number | null
          ultimo_acesso: string | null
          user_id: string | null
        }
        Relationships: []
      }
      questoes_erradas_por_prova: {
        Row: {
          alternativas: Json | null
          ano: number | null
          correta: string | null
          data_resposta: string | null
          enunciado: string | null
          prova: string | null
          questao_id: string | null
          tema: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_user_xp: {
        Args: { user_uuid: string; xp_amount: number }
        Returns: undefined
      }
      calculate_level: {
        Args: { xp: number }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
