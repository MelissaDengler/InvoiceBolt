import type { Database } from '@/lib/database.types'

// Add supported currencies
export type Currency = 'USD' | 'ZAR' | 'EUR' | 'GBP';

export type DbInvoice = Database['public']['Tables']['invoices']['Row'] & {
  customers?: Database['public']['Tables']['customers']['Row'];
  items?: Database['public']['Tables']['invoice_items']['Row'][];
}

export type DbInvoiceItem = Database['public']['Tables']['invoice_items']['Row']

export interface Invoice {
  id: string;
  client: string;
  customer_id: string;
  amount: number;
  currency: string;
  date: string;
  dueDate: string;
  status: 'draft' | 'pending' | 'paid' | 'overdue';
  notes?: string;
  items?: InvoiceItem[];
  logo_url?: string;
  payment_terms?: number;
  tax_rate?: number;
  discount?: number;
  recurring?: boolean;
  recurring_interval?: string;
}

export interface InvoiceItem {
  id?: string;
  invoice_id?: string;
  description: string;
  quantity: number;
  rate: number;
  unit_price?: number;
  amount?: number;
}

export interface CreateInvoiceInput {
  customer_id: string;
  total_amount: number;
  issue_date: string;
  due_date: string;
  status?: 'draft' | 'pending' | 'paid' | 'overdue';
  currency?: string;
  notes?: string | null;
  items?: Omit<InvoiceItem, 'id' | 'invoice_id' | 'unit_price' | 'amount'>[];
  logo_url?: string;
  payment_terms?: number;
  tax_rate?: number;
  discount?: number;
  recurring?: boolean;
  recurring_interval?: string;
}