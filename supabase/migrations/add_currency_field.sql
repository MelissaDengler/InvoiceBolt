-- Add currency column to invoices table with USD as default
ALTER TABLE invoices 
ADD COLUMN currency text NOT NULL DEFAULT 'USD'
CHECK (currency IN ('USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD')); 