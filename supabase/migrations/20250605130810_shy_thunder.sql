/*
  # Initial schema setup for JKLG Travel Agency

  1. New Tables
    - `faqs` - For storing frequently asked questions
    - `support_tickets` - For support ticket management
    - `ticket_messages` - For messages within support tickets
    - `destinations` - For travel destinations
    - `packages` - For tour packages
    - `itineraries` - For tour package itineraries
    - `gallery` - For image gallery
    - `admin_users` - For admin panel users
    - `bookings` - For customer bookings
    - `blog_posts` - For blog content
    - `testimonials` - For customer testimonials

  2. Security
    - Enable RLS on all tables
    - Add policies for CRUD operations based on authentication
*/

-- Create FAQs table
CREATE TABLE IF NOT EXISTS faqs (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can perform all operations on faqs"
  ON faqs
  USING (auth.role() = 'authenticated');

-- Create support tickets table
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

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can perform all operations on support_tickets"
  ON support_tickets
  USING (auth.role() = 'authenticated');

-- Create ticket messages table
CREATE TABLE IF NOT EXISTS ticket_messages (
  id SERIAL PRIMARY KEY,
  ticket_id INTEGER NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  from_type TEXT NOT NULL CHECK (from_type IN ('customer', 'agent')),
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can perform all operations on ticket_messages"
  ON ticket_messages
  USING (auth.role() = 'authenticated');

-- Create destinations table
CREATE TABLE IF NOT EXISTS destinations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can perform all operations on destinations"
  ON destinations
  USING (auth.role() = 'authenticated');

-- Create packages table
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
  accommodations TEXT NOT NULL,
  included TEXT[] NOT NULL,
  excluded TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can perform all operations on packages"
  ON packages
  USING (auth.role() = 'authenticated');

-- Create itineraries table
CREATE TABLE IF NOT EXISTS itineraries (
  id SERIAL PRIMARY KEY,
  package_id INTEGER NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  day INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL
);

ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can perform all operations on itineraries"
  ON itineraries
  USING (auth.role() = 'authenticated');

-- Create gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can perform all operations on gallery"
  ON gallery
  USING (auth.role() = 'authenticated');

-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Admin', 'Manager', 'Guide', 'Support')),
  avatar TEXT,
  status TEXT NOT NULL CHECK (status IN ('Active', 'Inactive')),
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can perform all operations on admin_users"
  ON admin_users
  USING (auth.role() = 'authenticated');

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  package TEXT NOT NULL,
  travel_date DATE NOT NULL,
  booking_date DATE NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Pending', 'Confirmed', 'Cancelled')),
  message TEXT,
  payment_status TEXT NOT NULL CHECK (payment_status IN ('Paid', 'Pending', 'Refunded')),
  source TEXT NOT NULL,
  assigned_to TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can perform all operations on bookings"
  ON bookings
  USING (auth.role() = 'authenticated');

-- Create blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT NOT NULL,
  author TEXT NOT NULL,
  date DATE NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Published', 'Draft')),
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can perform all operations on blog_posts"
  ON blog_posts
  USING (auth.role() = 'authenticated');

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT NOT NULL,
  location TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  message TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('published', 'pending', 'rejected')),
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can perform all operations on testimonials"
  ON testimonials
  USING (auth.role() = 'authenticated');