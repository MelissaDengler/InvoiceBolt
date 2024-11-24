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
          total_amount: number
          currency: Currency
          issue_date: string
          due_date: string
          status: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled'
          notes: string | null
          created_at: string
          updated_at: string
          invoice_number: string
          logo_url: string | null
          payment_terms: number | null
          tax_rate: number | null
          discount: number | null
          recurring: boolean | null
          recurring_interval: 'monthly' | 'quarterly' | 'yearly' | null
        }
        Insert: {
          id?: string
          customer_id: string
          total_amount: number
          currency?: Currency
          issue_date: string
          due_date: string
          status?: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
          invoice_number?: string
          logo_url?: string | null
          payment_terms?: number | null
          tax_rate?: number | null
          discount?: number | null
          recurring?: boolean | null
          recurring_interval?: 'monthly' | 'quarterly' | 'yearly' | null
        }
        Update: {
          id?: string
          customer_id?: string
          total_amount?: number
          currency?: Currency
          issue_date?: string
          due_date?: string
          status?: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
          invoice_number?: string
          logo_url?: string | null
          payment_terms?: number | null
          tax_rate?: number | null
          discount?: number | null
          recurring?: boolean | null
          recurring_interval?: 'monthly' | 'quarterly' | 'yearly' | null
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
  }
} 