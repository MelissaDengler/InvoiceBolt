-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create policies for invoices
CREATE POLICY "Invoices are viewable by everyone" ON invoices
  FOR SELECT USING (true);

CREATE POLICY "Invoices can be created by anyone" ON invoices
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Invoices can be updated by anyone" ON invoices
  FOR UPDATE USING (true);

CREATE POLICY "Invoices can be deleted by anyone" ON invoices
  FOR DELETE USING (true);

-- Create policies for customers
CREATE POLICY "Customers are viewable by everyone" ON customers
  FOR SELECT USING (true);

CREATE POLICY "Customers can be created by anyone" ON customers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Customers can be updated by anyone" ON customers
  FOR UPDATE USING (true);

CREATE POLICY "Customers can be deleted by anyone" ON customers
  FOR DELETE USING (true); 