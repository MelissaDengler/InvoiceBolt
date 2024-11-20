-- Check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE schemaname = 'public';

-- Ensure RLS is enabled
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Invoices are viewable by everyone" ON invoices;
DROP POLICY IF EXISTS "Customers are viewable by everyone" ON customers;

-- Create new policies with explicit permissions
CREATE POLICY "Invoices are viewable by everyone" 
ON invoices FOR SELECT 
TO anon
USING (true);

CREATE POLICY "Customers are viewable by everyone" 
ON customers FOR SELECT 
TO anon
USING (true);

-- Verify the tables are accessible
GRANT SELECT ON invoices TO anon;
GRANT SELECT ON customers TO anon; 