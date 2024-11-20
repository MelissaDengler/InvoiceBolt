-- Insert sample customers
INSERT INTO customers (name, email, phone, address)
VALUES 
  ('John Doe', 'john@example.com', '+1234567890', '123 Main St'),
  ('Jane Smith', 'jane@example.com', '+0987654321', '456 Oak Ave');

-- Insert sample invoices
INSERT INTO invoices (invoice_number, customer_id, status, issue_date, due_date, total_amount, notes)
SELECT 
  'INV-' || generate_series(1, 5),
  id,
  'pending',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '30 days',
  1000.00,
  'Sample invoice'
FROM customers
WHERE email = 'john@example.com'; 