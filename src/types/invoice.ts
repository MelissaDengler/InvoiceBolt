import type { Database } from '@/lib/database.types'

// Add supported currencies
export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD';

export type DbInvoice = Database['public']['Tables']['invoices']['Row'] & {
  customers: Database['public']['Tables']['customers']['Row'] | null;
  items?: DbInvoiceItem[];
}

export type DbInvoiceItem = Database['public']['Tables']['invoice_items']['Row']

export interface Invoice {
  id: string;
  client: string;
  customer_id: string;
  amount: number;
  currency: Currency;
  date: string;
  dueDate: string;
  status: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';
  notes?: string;
  items?: InvoiceItem[];
  logo_url?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export type CreateInvoiceInput = Omit<
  Database['public']['Tables']['invoices']['Insert'], 
  'id' | 'created_at' | 'updated_at' | 'invoice_number'
> & {
  items?: Omit<InvoiceItem, 'id'>[];
  logo_url?: string;
}