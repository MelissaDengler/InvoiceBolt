import { Customer } from '@/types/customer';

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@techcorp.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Solutions',
    address: '123 Innovation Drive, Silicon Valley, CA',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    total_spent: 15750.00,
    invoice_count: 12,
    status: 'active',
    payment_method: {
      type: 'credit_card',
      last4: '4242'
    },
    created_at: '2023-06-15T10:00:00Z',
    last_invoice_date: '2024-02-28T14:30:00Z',
    tags: ['enterprise', 'tech', 'priority'],
    notes: 'Key enterprise client, prefers quarterly billing'
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@designstudio.com',
    phone: '+1 (555) 234-5678',
    company: 'Creative Design Studio',
    address: '456 Art Avenue, Portland, OR',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    total_spent: 8920.00,
    invoice_count: 8,
    status: 'active',
    payment_method: {
      type: 'paypal'
    },
    created_at: '2023-08-22T15:30:00Z',
    last_invoice_date: '2024-03-01T09:15:00Z',
    tags: ['design', 'monthly'],
    notes: 'Prefers monthly billing cycles'
  },
  // Add more mock customers...
];

export const getCustomerStats = () => {
  const totalCustomers = mockCustomers.length;
  const activeCustomers = mockCustomers.filter(c => c.status === 'active').length;
  const totalRevenue = mockCustomers.reduce((sum, c) => sum + c.total_spent, 0);
  const averageSpent = totalRevenue / totalCustomers;

  return {
    totalCustomers,
    activeCustomers,
    totalRevenue,
    averageSpent,
    retentionRate: (activeCustomers / totalCustomers) * 100
  };
}; 