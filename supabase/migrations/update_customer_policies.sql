-- Drop existing policies if any
DROP POLICY IF EXISTS "Customers are viewable by everyone" ON customers;
DROP POLICY IF EXISTS "Customers can be created by anyone" ON customers;
DROP POLICY IF EXISTS "Customers can be updated by anyone" ON customers;
DROP POLICY IF EXISTS "Customers can be deleted by anyone" ON customers;

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Customers are viewable by everyone"
ON customers FOR SELECT
USING (true);

CREATE POLICY "Customers can be created by anyone"
ON customers FOR INSERT
WITH CHECK (true);

CREATE POLICY "Customers can be updated by anyone"
ON customers FOR UPDATE
USING (true);

CREATE POLICY "Customers can be deleted by anyone"
ON customers FOR DELETE
USING (true);

-- Grant necessary permissions
GRANT ALL ON customers TO anon;
GRANT ALL ON customers TO authenticated;

-- Verify the sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Enable realtime for customers
ALTER PUBLICATION supabase_realtime ADD TABLE customers; 