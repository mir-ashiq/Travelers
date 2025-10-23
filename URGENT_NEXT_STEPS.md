# 🚨 URGENT: CREATE DATABASE TABLES FIRST!

## Status Report

✅ **Seed script**: Ready to run  
✅ **Seed data**: 77 records prepared  
❌ **Database tables**: NOT YET CREATED

## What Happened

You ran `npm run seed` but the database tables don't exist yet. The seed script got errors like:

```
Error: Could not find the table 'public.destinations' in the schema cache
Error: Could not find the table 'public.packages' in the schema cache
```

This is **normal and expected** - we need to create the tables FIRST.

---

## ⚡ 2-STEP FIX (5 MINUTES)

### Step 1: Create Tables in Supabase (2 min)

1. Go to: **https://supabase.com/dashboard**
2. Select your project: **jklg-travel-agency** (or your project name)
3. Click: **SQL Editor** (left sidebar)
4. Click: **New Query**
5. **Copy** the entire content from: `SETUP_DATABASE.sql`
6. **Paste** into the SQL Editor
7. Click: **Run** (top right button)
8. Wait for ✅ Success message
9. Close the SQL Editor

### Step 2: Seed the Data (1 min)

```bash
npm run seed
```

**Result**: You should see ✅ checkmarks for all 11 tables!

---

## 🎯 Quick Copy-Paste

### SQL Command

Run this SQL in Supabase SQL Editor:

```sql
-- JKLG Travel Agency - Database Schema Setup
-- Paste this into Supabase SQL Editor and click Run

CREATE TABLE IF NOT EXISTS faqs (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS support_tickets (
  id SERIAL PRIMARY KEY,
  subject TEXT NOT NULL,
  customer TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Open', 'In Progress', 'Closed')),
  priority TEXT NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')),
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_to TEXT,
  last_update TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ticket_messages (
  id SERIAL PRIMARY KEY,
  ticket_id INTEGER NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  from_type TEXT NOT NULL CHECK (from_type IN ('customer', 'agent')),
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS destinations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  description TEXT,
  image TEXT,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS packages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  duration_days INTEGER NOT NULL,
  difficulty_level TEXT,
  season TEXT,
  image TEXT,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS itineraries (
  id SERIAL PRIMARY KEY,
  package_id INTEGER NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  activities TEXT,
  meals TEXT,
  accommodation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  message TEXT NOT NULL,
  trip_date DATE,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  package_id INTEGER NOT NULL REFERENCES packages(id),
  travel_date DATE NOT NULL,
  travelers INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  total_price DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  author TEXT,
  featured_image TEXT,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies - Allow public read access
CREATE POLICY "Allow public read access to destinations"
  ON destinations FOR SELECT USING (true);

CREATE POLICY "Allow public read access to packages"
  ON packages FOR SELECT USING (true);

CREATE POLICY "Allow public read access to itineraries"
  ON itineraries FOR SELECT USING (true);

CREATE POLICY "Allow public read access to gallery"
  ON gallery FOR SELECT USING (true);

CREATE POLICY "Allow public read access to testimonials"
  ON testimonials FOR SELECT USING (true);

CREATE POLICY "Allow public read access to faqs"
  ON faqs FOR SELECT USING (true);

CREATE POLICY "Allow public read access to blog_posts"
  ON blog_posts FOR SELECT USING (true);

-- Create performance indexes
CREATE INDEX idx_destinations_region ON destinations(region);
CREATE INDEX idx_packages_difficulty ON packages(difficulty_level);
CREATE INDEX idx_itineraries_package_id ON itineraries(package_id);
CREATE INDEX idx_gallery_category ON gallery(category);
CREATE INDEX idx_testimonials_verified ON testimonials(verified);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
```

---

## 📝 Full Instructions

### Option A: Full SQL (Complete)

1. Open file: `SETUP_DATABASE.sql`
2. Copy all content
3. Paste in Supabase SQL Editor
4. Click Run
5. ✅ Done!

### Option B: Quick SQL (Above)

1. Copy the SQL above
2. Paste in Supabase SQL Editor
3. Click Run
4. ✅ Done!

---

## ✅ Verification

After running SQL in Supabase:

1. Go to: **Supabase Table Editor**
2. You should see these 11 tables:
   - ✅ faqs
   - ✅ support_tickets
   - ✅ ticket_messages
   - ✅ destinations
   - ✅ packages
   - ✅ itineraries
   - ✅ gallery
   - ✅ testimonials
   - ✅ admin_users
   - ✅ bookings
   - ✅ blog_posts

If you see all 11, you're ready for Step 2!

---

## 🚀 Then Run Seed

```bash
npm run seed
```

Expected output:

```
✓ Seeding Destinations...
✓ Seeded 8 destinations
✓ Seeding Packages...
✓ Seeded 4 packages
✓ Seeding Itineraries...
✓ Seeded 23 itineraries
...
✓ Database seeding completed successfully!

Test credentials:
  Email: admin@jklgtravel.com
  Password: admin123
```

---

## 🎯 Timeline

- **Now**: Create tables (2 min in Supabase)
- **+2 min**: Run `npm run seed` (1 min)
- **+3 min**: Your database is seeded! ✅

**Total: 5 minutes**

---

## 💡 Need Help?

| Problem               | Solution                                                               |
| --------------------- | ---------------------------------------------------------------------- |
| Can't find SQL Editor | Go to Supabase dashboard → Select project → Click "SQL Editor" on left |
| SQL won't run         | Copy entire content from SETUP_DATABASE.sql file (all 332 lines)       |
| Still getting errors  | Make sure you're using SERVICE_ROLE_KEY, not anon key                  |
| Want detailed guide   | Read: DATABASE_SETUP.md                                                |

---

## 📞 Quick Links

- Supabase Dashboard: https://supabase.com/dashboard
- Full SQL file: `SETUP_DATABASE.sql`
- Seed script: `seed.js`
- Full guide: `DATABASE_SETUP.md`

---

**Status**: ✅ Everything ready, just need to create tables  
**Time to complete**: 5 minutes  
**Next action**: Create tables in Supabase, then run `npm run seed`

🚀 **Let's finish this!**
