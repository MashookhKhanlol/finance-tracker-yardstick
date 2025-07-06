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
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      accounts: {
        Row: {
          balance: number
          createdAt: string
          id: string
          isDefault: boolean
          name: string
          type: Database["public"]["Enums"]["AccountType"]
          updatedAt: string
          userId: string
        }
        Insert: {
          balance?: number
          createdAt?: string
          id: string
          isDefault?: boolean
          name: string
          type: Database["public"]["Enums"]["AccountType"]
          updatedAt: string
          userId: string
        }
        Update: {
          balance?: number
          createdAt?: string
          id?: string
          isDefault?: boolean
          name?: string
          type?: Database["public"]["Enums"]["AccountType"]
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          amount: number
          createdAt: string
          id: string
          lastAlertSent: string | null
          updatedAt: string
          userId: string
        }
        Insert: {
          amount: number
          createdAt?: string
          id: string
          lastAlertSent?: string | null
          updatedAt: string
          userId: string
        }
        Update: {
          amount?: number
          createdAt?: string
          id?: string
          lastAlertSent?: string | null
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "budgets_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          accountId: string
          amount: number
          category: string
          createdAt: string
          date: string
          description: string | null
          id: string
          isRecurring: boolean
          lastProcessed: string | null
          nextRecurringDate: string | null
          receiptUrl: string | null
          recurringInterval:
            | Database["public"]["Enums"]["RecurringInterval"]
            | null
          status: Database["public"]["Enums"]["TransactionStatus"]
          type: Database["public"]["Enums"]["TransactionType"]
          updatedAt: string
          userId: string
        }
        Insert: {
          accountId: string
          amount: number
          category: string
          createdAt?: string
          date: string
          description?: string | null
          id: string
          isRecurring?: boolean
          lastProcessed?: string | null
          nextRecurringDate?: string | null
          receiptUrl?: string | null
          recurringInterval?:
            | Database["public"]["Enums"]["RecurringInterval"]
            | null
          status?: Database["public"]["Enums"]["TransactionStatus"]
          type: Database["public"]["Enums"]["TransactionType"]
          updatedAt: string
          userId: string
        }
        Update: {
          accountId?: string
          amount?: number
          category?: string
          createdAt?: string
          date?: string
          description?: string | null
          id?: string
          isRecurring?: boolean
          lastProcessed?: string | null
          nextRecurringDate?: string | null
          receiptUrl?: string | null
          recurringInterval?:
            | Database["public"]["Enums"]["RecurringInterval"]
            | null
          status?: Database["public"]["Enums"]["TransactionStatus"]
          type?: Database["public"]["Enums"]["TransactionType"]
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          clerkUserId: string
          createdAt: string
          email: string
          id: string
          imageUrl: string | null
          name: string | null
          updatedAt: string
        }
        Insert: {
          clerkUserId: string
          createdAt?: string
          email: string
          id: string
          imageUrl?: string | null
          name?: string | null
          updatedAt: string
        }
        Update: {
          clerkUserId?: string
          createdAt?: string
          email?: string
          id?: string
          imageUrl?: string | null
          name?: string | null
          updatedAt?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      AccountType: "CURRENT" | "SAVINGS"
      RecurringInterval: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY"
      TransactionStatus: "PENDING" | "COMPLETED" | "FAILED"
      TransactionType: "INCOME" | "EXPENSE"
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
      AccountType: ["CURRENT", "SAVINGS"],
      RecurringInterval: ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"],
      TransactionStatus: ["PENDING", "COMPLETED", "FAILED"],
      TransactionType: ["INCOME", "EXPENSE"],
    },
  },
} as const
