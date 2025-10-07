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
      consultations: {
        Row: {
          adresse: string | null
          apparition_soudaine: string | null
          autres_symptomes: string | null
          code_postal: string | null
          conditions_acceptees: boolean | null
          confirmation_sent: boolean | null
          created_at: string | null
          date_debut: string | null
          date_fin: string | null
          date_fin_lettres: string | null
          date_naissance: string
          diagnostic_anterieur: string | null
          email: string
          facteurs_risque: boolean | null
          id: string
          localisation_medecin: string | null
          maladie_presumee: string | null
          medicaments_reguliers: string | null
          nom_prenom: string
          numero_dossier: string | null
          numero_securite_sociale: string | null
          payment_id: string | null
          payment_status: string | null
          pays: string | null
          profession: string | null
          situation_pro: string | null
          symptomes: string[] | null
          type_arret: string | null
          ville: string | null
          zones_douleur: string[] | null
        }
        Insert: {
          adresse?: string | null
          apparition_soudaine?: string | null
          autres_symptomes?: string | null
          code_postal?: string | null
          conditions_acceptees?: boolean | null
          confirmation_sent?: boolean | null
          created_at?: string | null
          date_debut?: string | null
          date_fin?: string | null
          date_fin_lettres?: string | null
          date_naissance: string
          diagnostic_anterieur?: string | null
          email: string
          facteurs_risque?: boolean | null
          id?: string
          localisation_medecin?: string | null
          maladie_presumee?: string | null
          medicaments_reguliers?: string | null
          nom_prenom: string
          numero_dossier?: string | null
          numero_securite_sociale?: string | null
          payment_id?: string | null
          payment_status?: string | null
          pays?: string | null
          profession?: string | null
          situation_pro?: string | null
          symptomes?: string[] | null
          type_arret?: string | null
          ville?: string | null
          zones_douleur?: string[] | null
        }
        Update: {
          adresse?: string | null
          apparition_soudaine?: string | null
          autres_symptomes?: string | null
          code_postal?: string | null
          conditions_acceptees?: boolean | null
          confirmation_sent?: boolean | null
          created_at?: string | null
          date_debut?: string | null
          date_fin?: string | null
          date_fin_lettres?: string | null
          date_naissance?: string
          diagnostic_anterieur?: string | null
          email?: string
          facteurs_risque?: boolean | null
          id?: string
          localisation_medecin?: string | null
          maladie_presumee?: string | null
          medicaments_reguliers?: string | null
          nom_prenom?: string
          numero_dossier?: string | null
          numero_securite_sociale?: string | null
          payment_id?: string | null
          payment_status?: string | null
          pays?: string | null
          profession?: string | null
          situation_pro?: string | null
          symptomes?: string[] | null
          type_arret?: string | null
          ville?: string | null
          zones_douleur?: string[] | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          consent: boolean | null
          created_at: string | null
          email: string
          id: string
          message: string | null
          name: string | null
        }
        Insert: {
          consent?: boolean | null
          created_at?: string | null
          email: string
          id?: string
          message?: string | null
          name?: string | null
        }
        Update: {
          consent?: boolean | null
          created_at?: string | null
          email?: string
          id?: string
          message?: string | null
          name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_numero_dossier: {
        Args: Record<PropertyKey, never>
        Returns: string
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
