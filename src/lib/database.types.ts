export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          customer_id: string
          invoice_number: string
          status: 'draft' | 'pending' | 'paid' | 'overdue'
          issue_date: string
          due_date: string
          total_amount: number
          currency: string
          notes: string | null
          created_at: string
          updated_at: string
          logo_url: string | null
          payment_terms: number | null
          tax_rate: number | null
          discount: number | null
          recurring: boolean | null
          recurring_interval: string | null
        }
        Insert: {
          id?: string
          customer_id: string
          invoice_number?: string
          status?: 'draft' | 'pending' | 'paid' | 'overdue'
          issue_date: string
          due_date: string
          total_amount: number
          currency?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
          logo_url?: string | null
          payment_terms?: number | null
          tax_rate?: number | null
          discount?: number | null
          recurring?: boolean | null
          recurring_interval?: string | null
        }
        Update: {
          id?: string
          customer_id?: string
          invoice_number?: string
          status?: 'draft' | 'pending' | 'paid' | 'overdue'
          issue_date?: string
          due_date?: string
          total_amount?: number
          currency?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
          logo_url?: string | null
          payment_terms?: number | null
          tax_rate?: number | null
          discount?: number | null
          recurring?: boolean | null
          recurring_interval?: string | null
        }
      }
      invoice_items: {
        Row: {
          id: string
          invoice_id: string
          description: string
          quantity: number
          rate: number
          unit_price: number
          amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invoice_id: string
          description: string
          quantity: number
          rate: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invoice_id?: string
          description?: string
          quantity?: number
          rate?: number
          created_at?: string
          updated_at?: string
        }
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
  }
} 