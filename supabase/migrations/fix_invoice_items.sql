-- Drop the existing invoice_items table if it exists
DROP TABLE IF EXISTS invoice_items;

-- Create the invoice_items table with the correct schema
CREATE TABLE invoice_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    rate DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) GENERATED ALWAYS AS (rate) STORED,
    amount DECIMAL(10,2) GENERATED ALWAYS AS (quantity * rate) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Create policies
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

-- Grant permissions
GRANT ALL ON invoice_items TO anon;
GRANT ALL ON invoice_items TO authenticated;

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE invoice_items; 

-- Add indexes for better performance
CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_invoice_items_updated_at
    BEFORE UPDATE ON invoice_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();