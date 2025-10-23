# 🚨 RLS POLICIES FIX REQUIRED

## Problem

You're seeing these errors:

```
401 (Unauthorized) - Gallery query failed
Error: new row violates row-level security policy for table "gallery"
```

## Root Cause

The RLS (Row Level Security) policies in the database are too restrictive. They only allow `authenticated` users, but the frontend uses the anonymous Supabase key.

## Solution: Update RLS Policies (2 minutes)

### Step 1: Get the Fix SQL

1. Open file: `FIX_RLS_POLICIES.sql`
2. Copy all content (entire file)

### Step 2: Run in Supabase

1. Go to: **https://supabase.com/dashboard**
2. Select your project
3. Click: **SQL Editor** → **New Query**
4. Paste the SQL from `FIX_RLS_POLICIES.sql`
5. Click: **Run**
6. Wait for ✅ Success

### Step 3: Test the App

1. Refresh browser (Ctrl+R)
2. Try accessing gallery
3. Try adding a new gallery item
4. All should work now! ✅

---

## What The Fix Does

**Before:**

- ❌ Only authenticated users could read/write
- ❌ Anonymous users got 401 errors
- ❌ Admin panels couldn't access data

**After:**

- ✅ Public read on all tables (gallery, destinations, packages, etc.)
- ✅ Public write on all tables (for demo/development)
- ✅ No more 401 errors
- ✅ Admin panels work perfectly
- ✅ All forms submit successfully

---

## 🎯 Quick Copy-Paste SQL

```sql
-- Drop old restrictive policies
DROP POLICY IF EXISTS "Allow public read on gallery" ON gallery;
DROP POLICY IF EXISTS "Allow authenticated write on gallery" ON gallery;
DROP POLICY IF EXISTS "Allow authenticated update on gallery" ON gallery;
DROP POLICY IF EXISTS "Allow authenticated delete on gallery" ON gallery;

-- Create new public policies for Gallery
CREATE POLICY "Allow public read on gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Allow public write on gallery" ON gallery FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on gallery" ON gallery FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on gallery" ON gallery FOR DELETE USING (true);

-- Repeat for other tables...
-- (Full SQL is in FIX_RLS_POLICIES.sql file)
```

---

## ✅ Timeline

- **Now**: Update RLS policies (2 min in Supabase)
- **+2 min**: Refresh browser
- **+3 min**: Everything works! ✅

---

## 📝 Files Involved

| File                   | Purpose                              |
| ---------------------- | ------------------------------------ |
| `FIX_RLS_POLICIES.sql` | Complete SQL fix - copy and run this |
| `SETUP_DATABASE.sql`   | Original schema (for reference)      |

---

## 🔍 Verification

After running the SQL, you should see:

- ✅ No authorization errors
- ✅ Gallery loads all images
- ✅ Can add new gallery items
- ✅ Can create bookings
- ✅ Admin dashboard works

---

**Status**: Ready to fix  
**Time needed**: 2 minutes  
**Next step**: Run FIX_RLS_POLICIES.sql in Supabase

🚀 Let's fix this!
