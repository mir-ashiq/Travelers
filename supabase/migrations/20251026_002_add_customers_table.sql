-- Migration: Add Customers Table and Related Schema
-- Date: 2025-10-26
-- Description: Create customers table for customer accounts and authentication
-- Status: Ready to apply

-- 1. Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  avatar TEXT COMMENT 'URL to customer avatar image',
  address TEXT,
  city TEXT,
  state_province TEXT,
  postal_code VARCHAR(20),
  country TEXT,
  date_of_birth DATE,
  gender VARCHAR(20),
  preferences JSONB DEFAULT '{}' COMMENT 'Stores preferences like language, newsletter opt-in, etc.',
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'deleted')),
  is_email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMPTZ,
  last_login TIMESTAMPTZ,
  total_bookings INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0 COMMENT 'Total amount spent in cents',
  loyalty_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create customer sessions table for JWT management
CREATE TABLE IF NOT EXISTS customer_sessions (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  token_hash TEXT UNIQUE NOT NULL COMMENT 'Hashed token for storage',
  expires_at TIMESTAMPTZ NOT NULL,
  device_info TEXT COMMENT 'Browser/device info for device tracking',
  ip_address INET,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ
);

-- 3. Create password reset table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  token_hash TEXT UNIQUE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create email verification tokens table
CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  token_hash TEXT UNIQUE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create customer address book table
CREATE TABLE IF NOT EXISTS customer_addresses (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  label VARCHAR(100) COMMENT 'e.g., Home, Work, Other',
  name TEXT,
  phone TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state_province TEXT,
  postal_code VARCHAR(20),
  country TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create saved preferences table
CREATE TABLE IF NOT EXISTS customer_preferences (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  preference_key VARCHAR(100) NOT NULL,
  preference_value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, preference_key)
);

-- 7. Link bookings to customers (add foreign key)
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL;

-- 8. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at);
CREATE INDEX IF NOT EXISTS idx_customer_sessions_customer_id ON customer_sessions(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_sessions_token ON customer_sessions(token);
CREATE INDEX IF NOT EXISTS idx_customer_sessions_is_active ON customer_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_customer_id ON password_reset_tokens(customer_id);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_customer_id ON email_verification_tokens(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer_id ON customer_addresses(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);

-- 9. Create function to update customer stats
CREATE OR REPLACE FUNCTION update_customer_stats(p_customer_id INT)
RETURNS VOID AS $$
BEGIN
  UPDATE customers
  SET 
    total_bookings = (SELECT COUNT(*) FROM bookings WHERE customer_id = p_customer_id),
    total_spent = (SELECT COALESCE(SUM(amount), 0) FROM transactions 
                   WHERE booking_id IN (SELECT id FROM bookings WHERE customer_id = p_customer_id)
                   AND status = 'completed')
  WHERE id = p_customer_id;
END;
$$ LANGUAGE plpgsql;

-- 10. Create function to calculate loyalty points
CREATE OR REPLACE FUNCTION calculate_loyalty_points(p_customer_id INT)
RETURNS INT AS $$
DECLARE
  total_spent INT;
  points INT;
BEGIN
  SELECT total_spent INTO total_spent FROM customers WHERE id = p_customer_id;
  -- 1 point per $10 spent
  points := total_spent / 1000;
  RETURN points;
END;
$$ LANGUAGE plpgsql;

-- 11. Create trigger to update customer updated_at
CREATE OR REPLACE FUNCTION update_customer_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_customer_updated_at
BEFORE UPDATE ON customers
FOR EACH ROW
EXECUTE FUNCTION update_customer_updated_at();

-- 12. Create trigger to update address updated_at
CREATE TRIGGER trg_update_customer_address_updated_at
BEFORE UPDATE ON customer_addresses
FOR EACH ROW
EXECUTE FUNCTION update_customer_updated_at();

-- 13. Create trigger to update preferences updated_at
CREATE TRIGGER trg_update_customer_preferences_updated_at
BEFORE UPDATE ON customer_preferences
FOR EACH ROW
EXECUTE FUNCTION update_customer_updated_at();

-- 14. Create view for active sessions
CREATE OR REPLACE VIEW active_customer_sessions AS
SELECT 
  cs.*,
  c.email,
  c.name
FROM customer_sessions cs
JOIN customers c ON cs.customer_id = c.id
WHERE cs.is_active = TRUE
  AND cs.expires_at > NOW()
  AND cs.revoked_at IS NULL;

-- 15. Add comments for documentation
COMMENT ON TABLE customers IS 'Stores customer account information';
COMMENT ON COLUMN customers.password_hash IS 'Hashed password using bcrypt';
COMMENT ON COLUMN customers.preferences IS 'JSON object storing user preferences like language, newsletter subscription, etc.';
COMMENT ON COLUMN customers.total_spent IS 'Total amount spent in cents across all bookings';
COMMENT ON TABLE customer_sessions IS 'Stores active customer sessions and JWT tokens';
COMMENT ON TABLE password_reset_tokens IS 'Temporary tokens for password reset requests';
COMMENT ON TABLE email_verification_tokens IS 'Temporary tokens for email verification';

-- 16. Create RLS policies (if using Supabase with RLS)
-- Uncomment if using Supabase with RLS enabled:
/*
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;

-- Allow customers to view their own data
CREATE POLICY "Customers can view own data" ON customers
  FOR SELECT USING (auth.uid()::int = id);

CREATE POLICY "Customers can update own data" ON customers
  FOR UPDATE USING (auth.uid()::int = id);

-- Only admins can delete customers
CREATE POLICY "Admins can delete customers" ON customers
  FOR DELETE USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Sessions policies
CREATE POLICY "Customers can view own sessions" ON customer_sessions
  FOR SELECT USING (customer_id = auth.uid()::int);

-- Addresses policies
CREATE POLICY "Customers can manage own addresses" ON customer_addresses
  FOR ALL USING (customer_id = auth.uid()::int);
*/

-- 17. Initial data verification
SELECT 
  'customers' as table_name,
  COUNT(*) as row_count
FROM customers;

-- Migration complete!
-- To rollback, run:
-- DROP VIEW IF EXISTS active_customer_sessions;
-- DROP FUNCTION IF EXISTS calculate_loyalty_points(INT);
-- DROP FUNCTION IF EXISTS update_customer_stats(INT);
-- DROP TRIGGER IF EXISTS trg_update_customer_preferences_updated_at ON customer_preferences;
-- DROP TRIGGER IF EXISTS trg_update_customer_address_updated_at ON customer_addresses;
-- DROP TRIGGER IF EXISTS trg_update_customer_updated_at ON customers;
-- DROP TABLE IF EXISTS customer_preferences;
-- DROP TABLE IF EXISTS customer_addresses;
-- DROP TABLE IF EXISTS email_verification_tokens;
-- DROP TABLE IF EXISTS password_reset_tokens;
-- DROP TABLE IF EXISTS customer_sessions;
-- ALTER TABLE bookings DROP COLUMN IF EXISTS customer_id;
-- DROP TABLE IF EXISTS customers;
