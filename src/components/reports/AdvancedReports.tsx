interface ReportTypes {
  revenue_analysis: {
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
    comparison_enabled: boolean;
    include_tax: boolean;
  };
  customer_insights: {
    payment_behavior: boolean;
    lifetime_value: boolean;
    industry_segmentation: boolean;
  };
  cash_flow: {
    forecasting: boolean;
    accounts_receivable_aging: boolean;
  };
} 