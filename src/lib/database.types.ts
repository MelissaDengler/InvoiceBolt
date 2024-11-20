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
          invoice_number: string
          customer_id: string
          status: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled'
          issue_date: string
          due_date: string
          total_amount: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invoice_number: string
          customer_id: string
          status?: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled'
          issue_date: string
          due_date: string
          total_amount: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invoice_number?: string
          customer_id?: string
          status?: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled'
          issue_date?: string
          due_date?: string
          total_amount?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
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