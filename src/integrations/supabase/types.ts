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
      problem_topic_mapping: {
        Row: {
          problem_id: string
          topic_id: string
        }
        Insert: {
          problem_id: string
          topic_id: string
        }
        Update: {
          problem_id?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "problem_topic_mapping_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "problem_topic_mapping_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "problem_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      problem_topics: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      problems: {
        Row: {
          constraints: string | null
          created_at: string
          created_by: string | null
          description: string
          difficulty: Database["public"]["Enums"]["problem_difficulty"]
          id: string
          input_format: string | null
          is_active: boolean
          memory_limit: number
          output_format: string | null
          time_limit: number
          title: string
        }
        Insert: {
          constraints?: string | null
          created_at?: string
          created_by?: string | null
          description: string
          difficulty?: Database["public"]["Enums"]["problem_difficulty"]
          id?: string
          input_format?: string | null
          is_active?: boolean
          memory_limit?: number
          output_format?: string | null
          time_limit?: number
          title: string
        }
        Update: {
          constraints?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          difficulty?: Database["public"]["Enums"]["problem_difficulty"]
          id?: string
          input_format?: string | null
          is_active?: boolean
          memory_limit?: number
          output_format?: string | null
          time_limit?: number
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          name: string | null
          role: string
        }
        Insert: {
          created_at?: string
          id: string
          name?: string | null
          role?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          role?: string
        }
        Relationships: []
      }
      submissions: {
        Row: {
          code: string
          created_at: string
          execution_time: number | null
          id: string
          language: string
          memory_used: number | null
          problem_id: string
          status: Database["public"]["Enums"]["submission_status"] | null
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          execution_time?: number | null
          id?: string
          language: string
          memory_used?: number | null
          problem_id: string
          status?: Database["public"]["Enums"]["submission_status"] | null
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          execution_time?: number | null
          id?: string
          language?: string
          memory_used?: number | null
          problem_id?: string
          status?: Database["public"]["Enums"]["submission_status"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
        ]
      }
      test_cases: {
        Row: {
          created_at: string
          id: string
          input: string
          is_sample: boolean
          output: string
          problem_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          input: string
          is_sample?: boolean
          output: string
          problem_id: string
        }
        Update: {
          created_at?: string
          id?: string
          input?: string
          is_sample?: boolean
          output?: string
          problem_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_cases_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      problem_difficulty: "easy" | "medium" | "hard"
      submission_status:
        | "accepted"
        | "wrong_answer"
        | "time_limit_exceeded"
        | "runtime_error"
        | "compile_error"
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
    Enums: {
      problem_difficulty: ["easy", "medium", "hard"],
      submission_status: [
        "accepted",
        "wrong_answer",
        "time_limit_exceeded",
        "runtime_error",
        "compile_error",
      ],
    },
  },
} as const
