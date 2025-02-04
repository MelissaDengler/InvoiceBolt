export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
  avatar_url?: string;
  total_spent: number;
  invoice_count: number;
  status: 'active' | 'inactive';
  payment_method?: {
    type: 'credit_card' | 'bank_transfer' | 'paypal';
    last4?: string;
  };
  created_at: string;
  last_invoice_date?: string;
  notes?: string;
  tags?: string[];
} 