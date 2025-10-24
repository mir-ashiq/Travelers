# 🗄️ Database Seeding Guide - JKLG Travel Agency

## Overview

Your JKLG Travel application requires database tables to be created before seeding. Here's how to set everything up.

## 📋 Prerequisites

- ✅ Supabase account created
- ✅ Project initialized
- ✅ Environment variables configured in `.env`
- ✅ Node.js and npm installed

## 🔧 Step 1: Create Database Tables

You have two options to create the tables:

### Option A: Using Supabase SQL Editor (Recommended for First-Time Setup)

1. **Go to Supabase Dashboard**

   - Visit: https://app.supabase.com
   - Select your project: `jklg-travel-agency`

2. **Navigate to SQL Editor**

   - Click on `SQL Editor` in the left sidebar
   - Click `New query`

3. **Run the Schema Creation Scripts**

   - Copy and paste the SQL from each migration file in `supabase/migrations/`
   - Run them in order:
     1. `20250605130810_shy_thunder.sql` (first)
     2. `20250605130830_floating_coral.sql`
     3. `20250605140850_autumn_poetry.sql`
     4. `20250605145359_empty_pine.sql`
     5. `20250605150446_steep_feather.sql`
     6. `20250605190434_blue_dream.sql`
     7. `20250605191115_tiny_portal.sql` (creates tables + seeds data)

4. **Verify Tables Are Created**
   - Go to `Table Editor`
   - You should see these tables:
     - `destinations`
     - `packages`
     - `itineraries`
     - `gallery`
     - `testimonials`
     - `admin_users`
     - `bookings`
     - `support_tickets`
     - `ticket_messages`
     - `faqs`
     - `blog_posts`

### Option B: Using Supabase CLI (Advanced)

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Link your project
supabase link --project-ref <your-project-ref>

# Push migrations
supabase db push

# Seed data (optional, if migrations include seed data)
npm run seed
```

## 🌱 Step 2: Seed the Database with Sample Data

Once tables are created, seed the database:

```bash
# Install dependencies (if not already done)
npm install

# Run the seed script
npm run seed

# Or use one of these alternatives:
npm run seed:reset      # Clear existing data and reseed
npm run seed:fresh      # Fresh install (recommended first time)
```

### What Gets Seeded

The seeding script populates:

| Table             | Records | Purpose                                               |
| ----------------- | ------- | ----------------------------------------------------- |
| `destinations`    | 8       | Travel destinations (Dal Lake, Gulmarg, etc.)         |
| `packages`        | 4       | Tour packages (Kashmir Bliss, Ladakh Adventure, etc.) |
| `itineraries`     | 23      | Day-by-day itineraries for each package               |
| `gallery`         | 12      | Beautiful travel photos                               |
| `testimonials`    | 6       | Customer reviews and feedback                         |
| `faqs`            | 6       | Frequently asked questions                            |
| `admin_users`     | 4       | Admin panel users (test credentials)                  |
| `bookings`        | 5       | Sample customer bookings                              |
| `support_tickets` | 4       | Sample support tickets                                |

## 🧪 Step 3: Verify Seeding

Check if data was seeded successfully:

### In Supabase Dashboard

1. Go to `Table Editor`
2. Click on any table (e.g., `destinations`)
3. You should see the seeded records

### Using Terminal

```bash
# Check if seed was successful
npm run seed

# You should see output like:
# ✓ Seeded 8 destinations
# ✓ Seeded 4 packages
# ✓ Seeded 6 testimonials
# ... etc
```

## 🔑 Test Credentials

After seeding, use these credentials to log in to the admin panel:

```
Email:    admin@jklgtravel.com
Password: admin123
```

Other admin users:

- `priya@jklgtravel.com` - Manager
- `raj@jklgtravel.com` - Guide
- `zara@jklgtravel.com` - Support

## 🚀 Step 4: Start Your Application

```bash
# Start the development server
npm run dev

# Visit the application
# http://localhost:5173/ (or http://localhost:5174/)

# Try logging in to admin panel
# http://localhost:5173/admin
# Use admin@jklgtravel.com / admin123
```

## 📊 Database Schema Summary

### Core Tables

**destinations**

- `id` (UUID, Primary Key)
- `name` (Text)
- `region` (Text)
- `description` (Text)
- `image` (URL)
- `featured` (Boolean)

**packages**

- `id` (UUID, Primary Key)
- `title` (Text)
- `description` (Text)
- `price` (Integer)
- `duration` (Integer)
- `image` (URL)
- `destinations` (Array)
- `featured` (Boolean)
- `rating` (Decimal)
- `accommodations` (Text)
- `included` (Array)
- `excluded` (Array)

**itineraries**

- `id` (UUID, Primary Key)
- `package_id` (UUID, Foreign Key)
- `day` (Integer)
- `title` (Text)
- `description` (Text)

**bookings**

- `id` (UUID, Primary Key)
- `name` (Text)
- `email` (Email)
- `phone` (Text)
- `package` (Text)
- `travel_date` (Date)
- `booking_date` (Date)
- `amount` (Integer)
- `status` (Text)
- `message` (Text)
- `payment_status` (Text)
- `source` (Text)

**admin_users**

- `id` (UUID, Primary Key)
- `name` (Text)
- `email` (Email)
- `phone` (Text)
- `role` (Text: Admin, Manager, Guide, Support)
- `avatar` (URL)
- `status` (Text)

**support_tickets**

- `id` (UUID, Primary Key)
- `subject` (Text)
- `customer` (Text)
- `email` (Email)
- `status` (Text)
- `priority` (Text)
- `category` (Text)
- `assigned_to` (Text)
- `last_update` (Timestamp)

## 🐛 Troubleshooting

### Error: "Could not find the table 'public.destinations'"

**Solution:** Tables haven't been created yet. Follow "Step 1: Create Database Tables" above.

### Error: "SUPABASE_URL is missing"

**Solution:** Check your `.env` file has:

```bash
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_SERVICE_ROLE_KEY=...
```

### Error: "Permission denied"

**Solution:** Make sure you're using the SERVICE ROLE key (not the ANON key) in the seed script.

### Seed runs but shows "Error seeding..."

**Possible causes:**

1. Tables don't exist - Run migrations first (Step 1)
2. Wrong permissions - Use SERVICE ROLE key
3. Duplicate data - Run `npm run seed:reset` to clear first

### How to Reset and Start Over

```bash
# Option 1: Clear and reseed
npm run seed:reset

# Option 2: Manual - In Supabase SQL Editor
-- Delete all data from tables
DELETE FROM public.testimonials;
DELETE FROM public.gallery;
DELETE FROM public.itineraries;
DELETE FROM public.packages;
DELETE FROM public.destinations;
DELETE FROM public.faqs;
DELETE FROM public.admin_users;
DELETE FROM public.bookings;
DELETE FROM public.support_tickets;

-- Then run: npm run seed
```

## 📚 Related Documentation

- **DEPLOYMENT.md** - How to deploy to production
- **SECURITY.md** - Security best practices
- **README.md** - Project setup overview
- **PRODUCTION_CHECKLIST.md** - Pre-launch checklist

## 🎯 Next Steps

1. ✅ Create database tables (Step 1)
2. ✅ Seed sample data (Step 2)
3. ✅ Verify data (Step 3)
4. 🚀 Start development (Step 4)
5. 📝 Check DEPLOYMENT.md for production setup

## 💡 Tips

- **Development**: Keep the seed data simple for testing
- **Staging**: Use realistic data that matches your actual use case
- **Production**: Create a separate prod seed script with real data
- **Testing**: Use `npm run seed:reset` before each test run

## 📞 Support

If you encounter issues:

1. Check the error message carefully
2. Verify Supabase credentials in `.env`
3. Ensure all tables exist in Supabase
4. Check Supabase dashboard for any warnings
5. Review the migration files for schema details

---

**Version**: 1.0.0  
**Last Updated**: October 23, 2025  
**Status**: ✅ Ready to Use
