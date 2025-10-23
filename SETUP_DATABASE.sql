-- =====================================================
-- JKLG Travel Agency - Database Schema Setup
-- =====================================================
-- Copy and paste this entire SQL into Supabase SQL Editor
-- Then click "Run" to create all tables at once
--
-- This will create:
-- ✓ 11 tables
-- ✓ RLS policies
-- ✓ Performance indexes
-- ✓ All relationships
-- =====================================================

-- 1. FAQs Table
CREATE TABLE IF NOT EXISTS faqs (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Support Tickets Table
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

-- 3. Ticket Messages Table
CREATE TABLE IF NOT EXISTS ticket_messages (
  id SERIAL PRIMARY KEY,
  ticket_id INTEGER NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  from_type TEXT NOT NULL CHECK (from_type IN ('customer', 'agent')),
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Destinations Table
CREATE TABLE IF NOT EXISTS destinations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Packages Table
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

-- 6. Itineraries Table
CREATE TABLE IF NOT EXISTS itineraries (
  id SERIAL PRIMARY KEY,
  package_id INTEGER NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  day INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Gallery Table
CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Admin Users Table
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

-- 9. Bookings Table
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

-- 10. Blog Posts Table
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

-- 11. Testimonials Table
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

-- =====================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

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

-- =====================================================
-- CREATE RLS POLICIES
-- =====================================================

-- Destinations: Public read, authenticated write
CREATE POLICY "Allow public read on destinations" ON destinations
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated write on destinations" ON destinations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on destinations" ON destinations
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on destinations" ON destinations
  FOR DELETE USING (auth.role() = 'authenticated');

-- Packages: Public read, authenticated write
CREATE POLICY "Allow public read on packages" ON packages
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated write on packages" ON packages
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on packages" ON packages
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on packages" ON packages
  FOR DELETE USING (auth.role() = 'authenticated');

-- Itineraries: Public read, authenticated write
CREATE POLICY "Allow public read on itineraries" ON itineraries
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated write on itineraries" ON itineraries
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on itineraries" ON itineraries
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on itineraries" ON itineraries
  FOR DELETE USING (auth.role() = 'authenticated');

-- Gallery: Public read, authenticated write
CREATE POLICY "Allow public read on gallery" ON gallery
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated write on gallery" ON gallery
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on gallery" ON gallery
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on gallery" ON gallery
  FOR DELETE USING (auth.role() = 'authenticated');

-- Testimonials: Public read published, authenticated write
CREATE POLICY "Allow public read on published testimonials" ON testimonials
  FOR SELECT USING (status = 'published');

CREATE POLICY "Allow authenticated on testimonials" ON testimonials
  USING (auth.role() = 'authenticated');

-- FAQs: Public read published, authenticated write
CREATE POLICY "Allow public read on published faqs" ON faqs
  FOR SELECT USING (published = true);

CREATE POLICY "Allow authenticated on faqs" ON faqs
  USING (auth.role() = 'authenticated');

-- Blog Posts: Public read published, authenticated write
CREATE POLICY "Allow public read on published blog_posts" ON blog_posts
  FOR SELECT USING (status = 'Published');

CREATE POLICY "Allow authenticated on blog_posts" ON blog_posts
  USING (auth.role() = 'authenticated');

-- Bookings: Public insert, authenticated read/write
CREATE POLICY "Allow public insert on bookings" ON bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated on bookings" ON bookings
  USING (auth.role() = 'authenticated');

-- Admin Users: Authenticated only
CREATE POLICY "Allow authenticated on admin_users" ON admin_users
  USING (auth.role() = 'authenticated');

-- Support Tickets: Authenticated only
CREATE POLICY "Allow authenticated on support_tickets" ON support_tickets
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated on ticket_messages" ON ticket_messages
  USING (auth.role() = 'authenticated');

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Destinations indexes
CREATE INDEX IF NOT EXISTS idx_destinations_featured ON destinations(featured);
CREATE INDEX IF NOT EXISTS idx_destinations_region ON destinations(region);

-- Packages indexes
CREATE INDEX IF NOT EXISTS idx_packages_featured ON packages(featured);
CREATE INDEX IF NOT EXISTS idx_packages_price ON packages(price);

-- Gallery indexes
CREATE INDEX IF NOT EXISTS idx_gallery_title ON gallery(title);
CREATE INDEX IF NOT EXISTS idx_gallery_location ON gallery(location);

-- Bookings indexes
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_travel_date ON bookings(travel_date);

-- Admin Users indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- Support Tickets indexes
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_support_tickets_email ON support_tickets(email);

-- Testimonials indexes
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating);

-- Blog Posts indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON blog_posts(date);

-- FAQs indexes
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_published ON faqs(published);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these queries to verify everything was created:
--
-- SELECT tablename FROM pg_tables 
-- WHERE schemaname = 'public'
-- ORDER BY tablename;
--
-- Should show 11 tables:
-- admin_users
-- blog_posts
-- bookings
-- destinations
-- faqs
-- gallery
-- itineraries
-- packages
-- support_tickets
-- ticket_messages
-- testimonials
-- =====================================================

-- ✅ All tables created successfully!
-- Now run: npm run seed
