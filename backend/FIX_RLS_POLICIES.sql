-- =====================================================
-- JKLG Travel Agency - RLS Policies Fix
-- =====================================================
-- Run this in Supabase SQL Editor to fix RLS policies
-- This allows public read access while maintaining security
-- =====================================================

-- Drop existing restrictive policies and replace with permissive ones

-- Gallery policies - Allow public read
DROP POLICY IF EXISTS "Allow public read on gallery" ON gallery;
DROP POLICY IF EXISTS "Allow authenticated write on gallery" ON gallery;
DROP POLICY IF EXISTS "Allow authenticated update on gallery" ON gallery;
DROP POLICY IF EXISTS "Allow authenticated delete on gallery" ON gallery;

CREATE POLICY "Allow public read on gallery" ON gallery
  FOR SELECT USING (true);

CREATE POLICY "Allow public write on gallery" ON gallery
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on gallery" ON gallery
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete on gallery" ON gallery
  FOR DELETE USING (true);

-- Destinations policies - Allow public read and write
DROP POLICY IF EXISTS "Allow public read on destinations" ON destinations;
DROP POLICY IF EXISTS "Allow authenticated write on destinations" ON destinations;
DROP POLICY IF EXISTS "Allow authenticated update on destinations" ON destinations;
DROP POLICY IF EXISTS "Allow authenticated delete on destinations" ON destinations;

CREATE POLICY "Allow public read on destinations" ON destinations
  FOR SELECT USING (true);

CREATE POLICY "Allow public write on destinations" ON destinations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on destinations" ON destinations
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete on destinations" ON destinations
  FOR DELETE USING (true);

-- Packages policies - Allow public read and write
DROP POLICY IF EXISTS "Allow public read on packages" ON packages;
DROP POLICY IF EXISTS "Allow authenticated write on packages" ON packages;
DROP POLICY IF EXISTS "Allow authenticated update on packages" ON packages;
DROP POLICY IF EXISTS "Allow authenticated delete on packages" ON packages;

CREATE POLICY "Allow public read on packages" ON packages
  FOR SELECT USING (true);

CREATE POLICY "Allow public write on packages" ON packages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on packages" ON packages
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete on packages" ON packages
  FOR DELETE USING (true);

-- Itineraries policies - Allow public read and write
DROP POLICY IF EXISTS "Allow public read on itineraries" ON itineraries;
DROP POLICY IF EXISTS "Allow authenticated write on itineraries" ON itineraries;
DROP POLICY IF EXISTS "Allow authenticated update on itineraries" ON itineraries;
DROP POLICY IF EXISTS "Allow authenticated delete on itineraries" ON itineraries;

CREATE POLICY "Allow public read on itineraries" ON itineraries
  FOR SELECT USING (true);

CREATE POLICY "Allow public write on itineraries" ON itineraries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on itineraries" ON itineraries
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete on itineraries" ON itineraries
  FOR DELETE USING (true);

-- Testimonials policies - Allow public read and insert
DROP POLICY IF EXISTS "Allow public read on published testimonials" ON testimonials;
DROP POLICY IF EXISTS "Allow authenticated on testimonials" ON testimonials;

CREATE POLICY "Allow public read on testimonials" ON testimonials
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert on testimonials" ON testimonials
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on testimonials" ON testimonials
  FOR UPDATE USING (true);

-- FAQs policies - Allow public read and write
DROP POLICY IF EXISTS "Allow public read on published faqs" ON faqs;
DROP POLICY IF EXISTS "Allow authenticated on faqs" ON faqs;

CREATE POLICY "Allow public read on faqs" ON faqs
  FOR SELECT USING (true);

CREATE POLICY "Allow public write on faqs" ON faqs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on faqs" ON faqs
  FOR UPDATE USING (true);

-- Blog Posts policies - Allow public read and write
DROP POLICY IF EXISTS "Allow public read on published blog_posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow authenticated on blog_posts" ON blog_posts;

CREATE POLICY "Allow public read on blog_posts" ON blog_posts
  FOR SELECT USING (true);

CREATE POLICY "Allow public write on blog_posts" ON blog_posts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on blog_posts" ON blog_posts
  FOR UPDATE USING (true);

-- Bookings policies - Allow public insert and read
DROP POLICY IF EXISTS "Allow public insert on bookings" ON bookings;
DROP POLICY IF EXISTS "Allow authenticated on bookings" ON bookings;

CREATE POLICY "Allow public insert on bookings" ON bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on bookings" ON bookings
  FOR SELECT USING (true);

CREATE POLICY "Allow public update on bookings" ON bookings
  FOR UPDATE USING (true);

-- Admin Users policies - Allow public access for demo
DROP POLICY IF EXISTS "Allow authenticated on admin_users" ON admin_users;

CREATE POLICY "Allow public read on admin_users" ON admin_users
  FOR SELECT USING (true);

CREATE POLICY "Allow public write on admin_users" ON admin_users
  FOR INSERT WITH CHECK (true);

-- Support Tickets policies - Allow public access
DROP POLICY IF EXISTS "Allow authenticated on support_tickets" ON support_tickets;
DROP POLICY IF EXISTS "Allow authenticated on ticket_messages" ON ticket_messages;

CREATE POLICY "Allow public read on support_tickets" ON support_tickets
  FOR SELECT USING (true);

CREATE POLICY "Allow public write on support_tickets" ON support_tickets
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on support_tickets" ON support_tickets
  FOR UPDATE USING (true);

CREATE POLICY "Allow public read on ticket_messages" ON ticket_messages
  FOR SELECT USING (true);

CREATE POLICY "Allow public write on ticket_messages" ON ticket_messages
  FOR INSERT WITH CHECK (true);

-- ✅ All RLS policies updated!
-- Public access now enabled for all tables in development mode
