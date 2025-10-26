-- Migration: Add Transactions Table for Payment Processing
-- Date: 2025-10-26
-- Description: Create transactions table to track all payment records
-- Status: Ready to apply

-- 1. Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL COMMENT 'Amount in cents (e.g., 5000 = $50.00)',
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  gateway VARCHAR(50) NOT NULL DEFAULT 'stripe' CHECK (gateway IN ('stripe', 'paypal', 'razorpay')),
  transaction_id VARCHAR(255) UNIQUE NOT NULL COMMENT 'External gateway transaction ID',
  payment_method VARCHAR(100) COMMENT 'e.g., card, bank_transfer, wallet',
  description TEXT,
  receipt_url TEXT COMMENT 'URL to payment receipt/invoice',
  refund_amount INTEGER COMMENT 'Amount refunded in cents',
  refund_reason VARCHAR(255),
  refund_status VARCHAR(50) CHECK (refund_status IN ('pending', 'completed', 'failed')),
  metadata JSONB DEFAULT '{}' COMMENT 'Store additional data like customer info, error details',
  error_message TEXT,
  attempted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_booking_id ON transactions(booking_id);
CREATE INDEX IF NOT EXISTS idx_transactions_transaction_id ON transactions(transaction_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_gateway ON transactions(gateway);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);

-- 3. Update bookings table to add payment-related fields
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_id INTEGER REFERENCES transactions(id) ON DELETE SET NULL;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_method VARCHAR(100);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_date TIMESTAMPTZ;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS invoice_id VARCHAR(255) UNIQUE;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS invoice_url TEXT;

-- 4. Create transaction audit log table
CREATE TABLE IF NOT EXISTS transaction_audit_logs (
  id SERIAL PRIMARY KEY,
  transaction_id INTEGER NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL COMMENT 'e.g., created, status_changed, refunded',
  old_status VARCHAR(50),
  new_status VARCHAR(50),
  changed_by VARCHAR(255) COMMENT 'Admin user who made the change',
  change_reason TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create index for audit logs
CREATE INDEX IF NOT EXISTS idx_transaction_audit_logs_transaction_id ON transaction_audit_logs(transaction_id);

-- 6. Add trigger to update bookings.payment_status
CREATE OR REPLACE FUNCTION update_booking_payment_status()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE bookings
  SET payment_status = CASE 
    WHEN NEW.status = 'completed' THEN 'Paid'
    WHEN NEW.status = 'failed' THEN 'Failed'
    WHEN NEW.status = 'refunded' THEN 'Refunded'
    ELSE 'Pending'
  END,
  payment_date = CASE 
    WHEN NEW.status = 'completed' THEN NOW()
    ELSE payment_date
  END
  WHERE id = NEW.booking_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_booking_payment_status
AFTER INSERT OR UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_booking_payment_status();

-- 7. Add comments for documentation
COMMENT ON TABLE transactions IS 'Stores payment transaction records from various payment gateways';
COMMENT ON COLUMN transactions.amount IS 'Amount in cents (e.g., 5000 = $50.00)';
COMMENT ON COLUMN transactions.status IS 'Current status of the transaction: pending, processing, completed, failed, refunded';
COMMENT ON COLUMN transactions.gateway IS 'Payment gateway used: stripe, paypal, razorpay';
COMMENT ON COLUMN transactions.transaction_id IS 'Unique transaction ID from the payment gateway';
COMMENT ON COLUMN transactions.metadata IS 'JSON object storing additional data like customer info, error codes, etc.';

-- 8. Create RLS policies for transactions (if using Supabase RLS)
-- Uncomment if using Supabase with RLS enabled:
/*
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view their own transactions
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (
    booking_id IN (
      SELECT id FROM bookings 
      WHERE email = (
        SELECT email FROM customers 
        WHERE id = auth.uid()::int
      )
    )
  );

-- Only admins can modify transactions
CREATE POLICY "Admins can modify transactions" ON transactions
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin'
  );
*/

-- 9. Initial data verification
SELECT 
  'transactions' as table_name,
  COUNT(*) as row_count
FROM transactions;

-- Migration complete!
-- To rollback, run:
-- DROP TRIGGER IF EXISTS trg_update_booking_payment_status ON transactions;
-- DROP FUNCTION IF EXISTS update_booking_payment_status();
-- DROP TABLE IF EXISTS transaction_audit_logs;
-- DROP TABLE IF EXISTS transactions;
-- ALTER TABLE bookings DROP COLUMN IF EXISTS payment_id, payment_method, payment_date, invoice_id, invoice_url;
