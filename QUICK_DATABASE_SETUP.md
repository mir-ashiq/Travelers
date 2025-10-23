# 🚀 Quick Database Setup Guide

## ⚡ Fastest Way to Set Up Your Database

### Option 1: Copy-Paste SQL Into Supabase Editor (2 minutes)

1. **Go to Supabase Dashboard**

   - URL: https://app.supabase.com/
   - Log in and select your project

2. **Open SQL Editor**

   - Left sidebar → SQL Editor
   - Click "New query"

3. **Copy all the SQL from migration files**

   - Go to folder: `supabase/migrations/`
   - Open each `.sql` file in order
   - Copy and paste ALL SQL into the query editor
   - Click "Run"

4. **Verify Tables Created**

   - Go to Table Editor
   - You should see all 11 tables

5. **Run Seed Script**
   ```bash
   npm install
   npm run seed
   ```

### Option 2: Create Tables Manually (5 minutes)

Run this SQL in Supabase SQL Editor to create all tables at once:

```sql
-- FAQs Table
CREATE TABLE IF NOT EXISTS faqs (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Support Tickets Table
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

-- Ticket Messages Table
CREATE TABLE IF NOT EXISTS ticket_messages (
  id SERIAL PRIMARY KEY,
  ticket_id INTEGER NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  from_type TEXT NOT NULL CHECK (from_type IN ('customer', 'agent')),
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Destinations Table
CREATE TABLE IF NOT EXISTS destinations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Packages Table
CREATE TABLE IF NOT EXISTS packages (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  duration INTEGER NOT NULL,
  image TEXT NOT NULL,
  destinations TEXT[] NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  rating NUMERIC(3,1) DEFAULT 0.0,
  accommodations TEXT,
  included TEXT[] DEFAULT ARRAY[]::TEXT[],
  excluded TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Itineraries Table
CREATE TABLE IF NOT EXISTS itineraries (
  id SERIAL PRIMARY KEY,
  package_id INTEGER NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  day INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery Table
CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Admin', 'Manager', 'Guide', 'Support')),
  avatar TEXT,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  package TEXT NOT NULL,
  travel_date DATE NOT NULL,
  booking_date DATE DEFAULT CURRENT_DATE,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Confirmed', 'Pending', 'Cancelled')),
  message TEXT,
  payment_status TEXT NOT NULL CHECK (payment_status IN ('Paid', 'Pending', 'Failed')),
  source TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT NOT NULL,
  author TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  status TEXT NOT NULL CHECK (status IN ('Published', 'Draft', 'Archived')),
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT NOT NULL,
  location TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  message TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('published', 'pending', 'rejected')),
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies (allow public read access, authenticated for write)
CREATE POLICY "Allow public read on destinations" ON destinations
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on packages" ON packages
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on itineraries" ON itineraries
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on gallery" ON gallery
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on testimonials" ON testimonials
  FOR SELECT USING (status = 'published');

CREATE POLICY "Allow public read on faqs" ON faqs
  FOR SELECT USING (published = true);

CREATE POLICY "Allow public read on blog_posts" ON blog_posts
  FOR SELECT USING (status = 'Published');

CREATE POLICY "Allow public insert on bookings" ON bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated on support_tickets" ON support_tickets
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated on admin_users" ON admin_users
  USING (auth.role() = 'authenticated');

-- Create indexes for performance
CREATE INDEX idx_destinations_featured ON destinations(featured);
CREATE INDEX idx_packages_featured ON packages(featured);
CREATE INDEX idx_gallery_title ON gallery(title);
CREATE INDEX idx_bookings_email ON bookings(email);
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_testimonials_status ON testimonials(status);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
```

**Then run the seed script:**

```bash
npm install
npm run seed
```

## 📍 Step-by-Step Instructions

### Step 1: Copy SQL Above

- Select all the SQL code from the box above
- Copy it (Ctrl+C / Cmd+C)

### Step 2: Go to Supabase

- Open: https://app.supabase.com
- Log in with your Supabase account
- Select your project

### Step 3: Open SQL Editor

- Left sidebar → Click "SQL Editor"
- Click "New query" button
- Paste the SQL code
- Click "Run" button

### Step 4: Wait for Completion

- Should complete in a few seconds
- You'll see: ✅ "Query executed successfully"

### Step 5: Verify Tables

- Left sidebar → Click "Table Editor"
- You should see 11 tables listed

### Step 6: Seed Data

Run this in your terminal:

```bash
cd "c:\Users\spike\OneDrive\Documents\Travelers"
npm install
npm run seed
```

### Step 7: Test

Open your browser:

```
http://localhost:5174/
```

Admin panel:

```
http://localhost:5174/admin
Email: admin@jklgtravel.com
Password: admin123
```

## ✅ Verification Checklist

- [ ] SQL executed successfully in Supabase
- [ ] 11 tables visible in Table Editor
- [ ] `npm run seed` completed without errors
- [ ] Data visible in each table
- [ ] Application runs: `npm run dev`
- [ ] Can log in to admin panel
- [ ] Homepage shows destinations and packages

## 🎯 What Gets Created

| Table           | Records | Contains                         |
| --------------- | ------- | -------------------------------- |
| destinations    | 8       | Kashmir, Ladakh, Jammu locations |
| packages        | 4       | Tour packages with pricing       |
| itineraries     | 23      | Day-by-day tour schedules        |
| gallery         | 12      | Beautiful travel photos          |
| testimonials    | 6       | Customer reviews                 |
| faqs            | 6       | Frequently asked questions       |
| admin_users     | 4       | Admin panel access               |
| bookings        | 5       | Sample reservations              |
| support_tickets | 4       | Support requests                 |
| blog_posts      | 4       | Travel guides & articles         |

## 🔐 Test Credentials

```
Admin Email:    admin@jklgtravel.com
Password:       admin123

Other admins:
- priya@jklgtravel.com (Manager)
- raj@jklgtravel.com (Guide)
- zara@jklgtravel.com (Support)
```

## 🚨 If Something Goes Wrong

### Errors After Running SQL

**Error**: "Table already exists"

- ✅ This is fine! It means SQL ran before
- Continue to Step 6: Seed Data

**Error**: "Permission denied"

- Check you're logged into correct Supabase project
- Use correct project credentials in `.env`

**Error**: "Seed shows 'Could not find table'"

- This means tables weren't created
- Run the SQL in Supabase SQL Editor first
- Then run: `npm run seed`

### Reset Everything

```bash
# In Supabase SQL Editor, run:
DROP TABLE IF EXISTS ticket_messages CASCADE;
DROP TABLE IF EXISTS itineraries CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS support_tickets CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS packages CASCADE;
DROP TABLE IF EXISTS gallery CASCADE;
DROP TABLE IF EXISTS destinations CASCADE;
DROP TABLE IF EXISTS faqs CASCADE;

# Then repeat the SQL setup above
# Then run: npm run seed
```

## 🎯 Next Steps After Setup

1. ✅ Create tables (SQL in Supabase)
2. ✅ Seed data (`npm run seed`)
3. 🚀 Start app (`npm run dev`)
4. 📝 Check DEPLOYMENT.md for production setup
5. 🔒 Review SECURITY.md for best practices

## 📚 Related Files

- `DATABASE_SEEDING.md` - Detailed seeding guide
- `DEPLOYMENT.md` - Production deployment
- `SECURITY.md` - Security best practices
- `supabase/migrations/` - SQL migration files

---

**Time Required**: 5-10 minutes  
**Difficulty**: Easy ⭐  
**Status**: Ready to Use ✅
