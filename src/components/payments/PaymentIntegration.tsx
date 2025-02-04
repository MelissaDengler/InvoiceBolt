interface PaymentMethod {
  id: string;
  type: 'stripe' | 'paypal' | 'bank_transfer';
  status: 'active' | 'inactive';
  details: {
    account_name?: string;
    last4?: string;
    expiry?: string;
  };
} 