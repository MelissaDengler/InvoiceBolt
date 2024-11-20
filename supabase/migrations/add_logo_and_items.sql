-- Add logo column to invoices table
ALTER TABLE invoices 
ADD COLUMN logo_url text;

-- Create invoice_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    rate DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for invoice_items
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Create policies for invoice_items
CREATE POLICY "Invoice items are viewable by everyone"
    ON invoice_items FOR SELECT
    USING (true);

CREATE POLICY "Invoice items can be created by anyone"
    ON invoice_items FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Invoice items can be updated by anyone"
    ON invoice_items FOR UPDATE
    USING (true);

CREATE POLICY "Invoice items can be deleted by anyone"
    ON invoice_items FOR DELETE
    USING (true); 