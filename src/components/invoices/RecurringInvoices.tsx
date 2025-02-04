interface RecurringSchedule {
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date?: string;
  next_invoice_date: string;
  last_sent_date?: string;
} 