interface CustomerPortalSettings {
  allow_payment_methods: boolean;
  allow_invoice_history: boolean;
  allow_download_invoices: boolean;
  custom_branding?: {
    logo_url: string;
    primary_color: string;
  };
} 