ALTER TABLE invoices
ADD COLUMN currency text NOT NULL DEFAULT 'USD',
ADD COLUMN logo_url text,
ADD COLUMN payment_terms integer,
ADD COLUMN tax_rate decimal(5,2),
ADD COLUMN discount decimal(5,2),
ADD COLUMN recurring boolean DEFAULT false,
ADD COLUMN recurring_interval text CHECK (recurring_interval IN ('monthly', 'quarterly', 'yearly'));

-- Add constraints
ALTER TABLE invoices
ADD CONSTRAINT valid_currency CHECK (currency IN ('USD', 'ZAR', 'EUR', 'GBP')),
ADD CONSTRAINT valid_tax_rate CHECK (tax_rate >= 0 AND tax_rate <= 100),
ADD CONSTRAINT valid_discount CHECK (discount >= 0 AND discount <= 100); 