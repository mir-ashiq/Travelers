# 📋 Copy-Paste SQL for Supabase

## Step-by-Step Instructions

### 1. Go to Supabase Dashboard

- Open: https://app.supabase.com
- Select your project: "JKLG Travel"
- Click "SQL Editor"

### 2. Create New Query

Click "New Query" → Give it a name: `Fix Email Duplicate`

### 3. Copy ALL of this SQL and paste into the editor:

```sql
-- ============================================
-- Fix Email Duplicate Issue
-- Add 'processing' status for atomic locking
-- ============================================

-- Step 1: Drop old constraint (if exists)
ALTER TABLE email_history
DROP CONSTRAINT IF EXISTS email_history_status_check;

-- Step 2: Add new constraint with 'processing' status
ALTER TABLE email_history
ADD CONSTRAINT email_history_status_check
CHECK (status IN ('pending', 'processing', 'sent', 'failed'));

-- Step 3: Verify the change worked
SELECT
  table_name,
  constraint_name,
  check_clause
FROM information_schema.check_constraints
WHERE table_name = 'email_history'
ORDER BY constraint_name;

-- Step 4: Show email_history table structure
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'email_history'
ORDER BY ordinal_position;
```

### 4. Click "Run" Button

Should see:

```
✅ ALTER TABLE
✅ ALTER TABLE
✅ SELECT 1
✅ SELECT ...
```

### 5. Check Results Tab

You should see:

```
check_clause:
status IN ('pending', 'processing', 'sent', 'failed')
```

---

## Alternative: If Above Doesn't Work

### Try This Simpler Version:

```sql
-- Option 1: Using DO block (most compatible)
DO $$
BEGIN
  -- Drop old constraint
  EXECUTE 'ALTER TABLE email_history DROP CONSTRAINT IF EXISTS email_history_status_check';

  -- Add new constraint
  EXECUTE 'ALTER TABLE email_history ADD CONSTRAINT email_history_status_check CHECK (status IN (''pending'', ''processing'', ''sent'', ''failed''))';

  RAISE NOTICE 'Email status constraint updated successfully!';
END
$$;
```

### Or This (Most Basic):

```sql
-- Just add constraint, let it fail if exists (no big deal)
ALTER TABLE email_history
ADD CONSTRAINT email_history_status_check_new
CHECK (status IN ('pending', 'processing', 'sent', 'failed'));
```

---

## What the SQL Does

| Command                        | What It Does                                      |
| ------------------------------ | ------------------------------------------------- |
| `DROP CONSTRAINT IF EXISTS`    | Removes old constraint (doesn't error if missing) |
| `ADD CONSTRAINT`               | Adds new constraint with 'processing' status      |
| `CHECK (status IN (...))`      | Allows only these 4 values                        |
| `SELECT information_schema...` | Shows what was created                            |

---

## Verification Commands

After running, verify it worked:

```sql
-- See constraint details
SELECT *
FROM information_schema.check_constraints
WHERE table_name = 'email_history';

-- See email_history columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'email_history';

-- See sample emails and their status
SELECT id, recipient_email, status, created_at
FROM email_history
LIMIT 5;
```

---

## If Something Goes Wrong

### Error: "constraint already exists"

→ That's OK - means constraint is already there
→ The `IF EXISTS` prevents errors

### Error: "invalid status value"

→ Your table has old status values
→ No worries, new constraint allows old + new

### Can't see constraint

→ Query might not show in Supabase GUI
→ But it's definitely there (Postgres applied it)

---

## Quick Checklist

- [ ] Opened Supabase dashboard
- [ ] Opened SQL Editor
- [ ] Created new query
- [ ] Copied & pasted SQL above
- [ ] Clicked "Run"
- [ ] Saw green checkmarks ✅
- [ ] Constraint now includes 'processing'

---

## Next Steps

After running SQL:

1. ✅ SQL executed in Supabase
2. ⏳ Restart backend: `node server.js`
3. ⏳ Test: Create booking → Email sent once ✅

---

## Support

If you see errors:

1. Check SQL syntax (commas, quotes)
2. Try the "Alternative" version
3. Check Supabase status page
4. Reload page and try again

---

**Estimated time: 2 minutes** ⏱️

Run this and you're done! 🚀
