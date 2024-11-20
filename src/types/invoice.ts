export interface Invoice {
  id: string;
  client: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}