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
      blood_banks: {
        Row: {
          contact_number: string
          created_at: string | null
          email: string | null
          id: string
          location: string
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          contact_number: string
          created_at?: string | null
          email?: string | null
          id?: string
          location: string
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          contact_number?: string
          created_at?: string | null
          email?: string | null
          id?: string
          location?: string
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      blood_inventory: {
        Row: {
          blood_bank_id: string
          blood_type: Database["public"]["Enums"]["blood_type"]
          id: string
          last_updated: string | null
          units_available: number
        }
        Insert: {
          blood_bank_id: string
          blood_type: Database["public"]["Enums"]["blood_type"]
          id?: string
          last_updated?: string | null
          units_available?: number
        }
        Update: {
          blood_bank_id?: string
          blood_type?: Database["public"]["Enums"]["blood_type"]
          id?: string
          last_updated?: string | null
          units_available?: number
        }
        Relationships: [
          {
            foreignKeyName: "blood_inventory_blood_bank_id_fkey"
            columns: ["blood_bank_id"]
            isOneToOne: false
            referencedRelation: "blood_banks"
            referencedColumns: ["id"]
          },
        ]
      }
      blood_requests: {
        Row: {
          blood_type: Database["public"]["Enums"]["blood_type"]
          contact_number: string
          created_at: string | null
          hospital_name: string
          id: string
          location: string
          patient_name: string
          status: string | null
          units_required: number
          updated_at: string | null
          urgency: Database["public"]["Enums"]["urgency_level"]
          user_id: string
        }
        Insert: {
          blood_type: Database["public"]["Enums"]["blood_type"]
          contact_number: string
          created_at?: string | null
          hospital_name: string
          id?: string
          location: string
          patient_name: string
          status?: string | null
          units_required: number
          updated_at?: string | null
          urgency: Database["public"]["Enums"]["urgency_level"]
          user_id: string
        }
        Update: {
          blood_type?: Database["public"]["Enums"]["blood_type"]
          contact_number?: string
          created_at?: string | null
          hospital_name?: string
          id?: string
          location?: string
          patient_name?: string
          status?: string | null
          units_required?: number
          updated_at?: string | null
          urgency?: Database["public"]["Enums"]["urgency_level"]
          user_id?: string
        }
        Relationships: []
      }
      donation_records: {
        Row: {
          blood_bank_id: string | null
          blood_type: Database["public"]["Enums"]["blood_type"]
          created_at: string | null
          donation_date: string
          donor_id: string
          id: string
          location: string
          notes: string | null
          units_donated: number
          updated_at: string | null
        }
        Insert: {
          blood_bank_id?: string | null
          blood_type: Database["public"]["Enums"]["blood_type"]
          created_at?: string | null
          donation_date: string
          donor_id: string
          id?: string
          location: string
          notes?: string | null
          units_donated?: number
          updated_at?: string | null
        }
        Update: {
          blood_bank_id?: string | null
          blood_type?: Database["public"]["Enums"]["blood_type"]
          created_at?: string | null
          donation_date?: string
          donor_id?: string
          id?: string
          location?: string
          notes?: string | null
          units_donated?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donation_records_blood_bank_id_fkey"
            columns: ["blood_bank_id"]
            isOneToOne: false
            referencedRelation: "blood_banks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donation_records_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
        ]
      }
      donor_notifications: {
        Row: {
          blood_request_id: string
          created_at: string
          donor_id: string
          id: string
          is_read: boolean
          message: string
          priority: string
          updated_at: string
        }
        Insert: {
          blood_request_id: string
          created_at?: string
          donor_id: string
          id?: string
          is_read?: boolean
          message: string
          priority: string
          updated_at?: string
        }
        Update: {
          blood_request_id?: string
          created_at?: string
          donor_id?: string
          id?: string
          is_read?: boolean
          message?: string
          priority?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "donor_notifications_blood_request_id_fkey"
            columns: ["blood_request_id"]
            isOneToOne: false
            referencedRelation: "blood_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donor_notifications_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
        ]
      }
      donors: {
        Row: {
          age: number
          blood_type: Database["public"]["Enums"]["blood_type"]
          contact_number: string
          created_at: string | null
          email: string
          full_name: string
          id: string
          is_available: boolean | null
          last_donation_date: string | null
          location: string
          updated_at: string | null
          user_id: string
          weight: number
        }
        Insert: {
          age: number
          blood_type: Database["public"]["Enums"]["blood_type"]
          contact_number: string
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          is_available?: boolean | null
          last_donation_date?: string | null
          location: string
          updated_at?: string | null
          user_id: string
          weight: number
        }
        Update: {
          age?: number
          blood_type?: Database["public"]["Enums"]["blood_type"]
          contact_number?: string
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          is_available?: boolean | null
          last_donation_date?: string | null
          location?: string
          updated_at?: string | null
          user_id?: string
          weight?: number
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          email_notifications: boolean | null
          id: string
          sms_notifications: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          sms_notifications?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          sms_notifications?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          created_at: string | null
          full_name: string
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          age?: number | null
          created_at?: string | null
          full_name: string
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          age?: number | null
          created_at?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "patient" | "donor" | "blood_bank"
      blood_type: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
      urgency_level: "critical" | "urgent" | "normal"
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
    Enums: {
      app_role: ["admin", "patient", "donor", "blood_bank"],
      blood_type: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      urgency_level: ["critical", "urgent", "normal"],
    },
  },
} as const
