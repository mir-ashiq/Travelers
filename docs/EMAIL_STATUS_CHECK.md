# Email Status Check - Required for Duplicate Fix

## ⚠️ IMPORTANT: Check Your Database

The email duplicate fix requires the `email_history` table to support a `processing` status.

### Option 1: Check Current Constraint (Recommended)

Go to Supabase Dashboard → SQL Editor and run:

```sql
-- Check current constraint for email_history table
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'email_history';

-- Or check the exact constraint definition
SELECT check_clause
FROM information_schema.check_constraints
WHERE constraint_name LIKE '%email_history%status%';
```

### Option 2: Add 'processing' Status if Missing

If the current constraint is:

```sql
CHECK (status IN ('pending', 'sent', 'failed'))
```

You need to UPDATE it to:

```sql
CHECK (status IN ('pending', 'processing', 'sent', 'failed'))
```

**Run this SQL in Supabase:**

```sql
-- Drop the old constraint (adjust constraint name if different)
ALTER TABLE email_history
DROP CONSTRAINT IF EXISTS email_history_status_check;

-- Add new constraint with 'processing' status
ALTER TABLE email_history
ADD CONSTRAINT email_history_status_check
CHECK (status IN ('pending', 'processing', 'sent', 'failed'));

-- Verify the change
SELECT check_clause
FROM information_schema.check_constraints
WHERE table_name = 'email_history';
```

### Option 3: View Current Table Structure

```sql
-- See full structure of email_history table
\d email_history

-- Or in Supabase:
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'email_history'
ORDER BY ordinal_position;
```

---

## Expected Result After Fix

```sql
-- The status column should allow:
-- ✅ 'pending'     - Waiting to send
-- ✅ 'processing'  - Currently being sent
-- ✅ 'sent'        - Successfully sent
-- ✅ 'failed'      - Failed to send
```

---

## 📋 Checklist Before Restarting Server

- [ ] Database constraint includes 'processing' status
- [ ] Column exists: `updated_at` (for abandoned cleanup)
- [ ] Backend code updated with new email-sender.js
- [ ] Ready to restart backend server

---

## If You See an Error

If email service shows error like:

```
ERROR: update or delete violates foreign key constraint
ERROR: invalid enum value "processing"
```

→ The database constraint needs to be updated (see Option 2 above)

---

## Test After Update

```bash
# Restart server
node server.js

# Check logs show:
# ✅ Email service started
# ✅ Processing emails
# ✅ Status changes: pending → processing → sent
```

If emails show status `processing` for > 5 seconds, cleanup will handle it ✅

---

_Last updated: October 26, 2025_
