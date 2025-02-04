export type ExpenseCategory = 
  | 'office_supplies'
  | 'travel'
  | 'utilities'
  | 'rent'
  | 'software'
  | 'hardware'
  | 'marketing'
  | 'salary'
  | 'other';

export interface Expense {
  id: string;
  date: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  description: string;
  receipt_url?: string;
  tax_deductible: boolean;
  payment_method: string;
  vendor?: string;
  tags?: string[];
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: string;
  category: ExpenseCategory;
  amount: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date: string;
  actual_spend: number;
  alerts_enabled: boolean;
  alert_threshold: number; // percentage
} 