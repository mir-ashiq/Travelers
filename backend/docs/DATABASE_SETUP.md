# 🗄️ DATABASE SETUP - Complete Instructions

## 📌 Quick Summary

Your JKLG Travel database needs to be set up before the app can fully work. Follow these **3 simple steps**:

1. **Create tables** (5 minutes) - Run SQL in Supabase
2. **Seed data** (1 minute) - Run `npm run seed`
3. **Test** (2 minutes) - Verify everything works

**Total time: ~10 minutes**

---

## ✨ Step 1: Create Database Tables

### Option A: Easiest - Copy & Paste (Recommended)

**Time: 5 minutes**

1. Open: https://app.supabase.com
2. Select your project
3. Go to: **SQL Editor** → Click "New query"
4. Open this file: `QUICK_DATABASE_SETUP.md`
5. Copy the BIG SQL block (everything in the code box)
6. Paste into Supabase SQL Editor
7. Click **"Run"** button
8. Done! ✅

### Option B: Run All Migrations in Order

If you prefer to run the migration files one by one:

1. Go to Supabase SQL Editor
2. Open each file from `supabase/migrations/` in order:
   - `20250605130810_shy_thunder.sql`
   - `20250605130830_floating_coral.sql`
   - `20250605140850_autumn_poetry.sql`
   - `20250605145359_empty_pine.sql`
   - `20250605150446_steep_feather.sql`
   - `20250605190434_blue_dream.sql`
   - `20250605191115_tiny_portal.sql`
3. Copy-paste each into SQL Editor and run
4. Done! ✅

### ✅ Verify Tables Were Created

1. In Supabase, go to **Table Editor**
2. You should see 11 tables:
   - ✓ destinations
   - ✓ packages
   - ✓ itineraries
   - ✓ gallery
   - ✓ testimonials
   - ✓ faqs
   - ✓ admin_users
   - ✓ bookings
   - ✓ support_tickets
   - ✓ ticket_messages
   - ✓ blog_posts

If you see all 11 tables → **Step 1 is complete!** ✅

---

## 🌱 Step 2: Seed Sample Data

Now populate the tables with sample data.

### Run This Command

Open your terminal and run:

```bash
cd "c:\Users\spike\OneDrive\Documents\Travelers"
npm install
npm run seed
```

### What You Should See

```
🌍 JKLG Travel Agency - Database Seeding Script
📦 Database: https://ynqceffvnagwrbchnyls.supabase.co
📍 Seeding Destinations...
✓ Seeded 8 destinations
🎫 Seeding Packages...
✓ Seeded 4 packages
⭐ Seeding Testimonials...
✓ Seeded 6 testimonials
❓ Seeding FAQs...
✓ Seeded 6 FAQs
👤 Seeding Admin Users...
✓ Seeded 4 admin users
📅 Seeding Bookings...
✓ Seeded 5 bookings
🖼️ Seeding Gallery...
✓ Seeded 12 gallery items
🗺️ Seeding Itineraries...
✓ Seeded 23 itineraries
🎫 Seeding Support Tickets...
✓ Seeded 4 support tickets

✅ Database seeding completed successfully!
Test credentials:
  Email: admin@jklgtravel.com
  Password: admin123
```

### ✅ Verify Data Was Seeded

1. In Supabase **Table Editor**
2. Click on `destinations` table
3. You should see 8 destinations (Dal Lake, Gulmarg, etc.)
4. Click on `packages` table
5. You should see 4 packages (Kashmir Bliss, Ladakh Adventure, etc.)

If you see data in tables → **Step 2 is complete!** ✅

---

## 🧪 Step 3: Test Everything Works

### Start Your Application

```bash
npm run dev
```

You should see:

```
✓ VITE v5.4.8 ready in 796 ms
  ➜ Local:   http://localhost:5173/
```

### 🏠 Test Homepage

Open: **http://localhost:5173/**

You should see:

- ✓ Homepage loads
- ✓ Destinations displayed (Dal Lake, Gulmarg, etc.)
- ✓ Featured packages shown
- ✓ Navigation works

### 🔐 Test Admin Panel

Go to: **http://localhost:5173/admin**

Login with:

```
Email:    admin@jklgtravel.com
Password: admin123
```

You should see:

- ✓ Admin dashboard loads
- ✓ Can see destinations in admin
- ✓ Can see packages in admin
- ✓ Can see bookings in admin
- ✓ Can navigate around admin panel

### ✅ Everything Working?

If yes → **Congratulations!** Your database is fully set up! 🎉

---

## 📊 Data Summary

After seeding, you'll have:

| What                | How Many | Details                          |
| ------------------- | -------- | -------------------------------- |
| **Destinations**    | 8        | Kashmir, Ladakh, Jammu locations |
| **Packages**        | 4        | Tour packages with prices        |
| **Itineraries**     | 23       | Day-by-day schedules             |
| **Gallery**         | 12       | Travel photos                    |
| **Testimonials**    | 6        | Customer reviews                 |
| **FAQs**            | 6        | Frequently asked questions       |
| **Blog Posts**      | 4        | Travel guides                    |
| **Admin Users**     | 4        | Test accounts for admin panel    |
| **Bookings**        | 5        | Sample reservations              |
| **Support Tickets** | 4        | Sample support requests          |

---

## 🔑 Test Credentials

### Admin Account

```
Email:    admin@jklgtravel.com
Password: admin123
Role:     Admin (Full Access)
```

### Other Test Accounts

```
Email:    priya@jklgtravel.com
Password: admin123
Role:     Manager

Email:    raj@jklgtravel.com
Password: admin123
Role:     Guide

Email:    zara@jklgtravel.com
Password: admin123
Role:     Support Staff
```

---

## 🆘 Troubleshooting

### Problem: "Table not found" error when running seed

**Solution:**

1. Check that tables were created in Supabase
2. Go to Supabase → Table Editor
3. If no tables appear, run the SQL setup again
4. After creating tables, run: `npm run seed`

### Problem: Seed script says "Error connecting to Supabase"

**Solution:**

1. Check `.env` file has correct credentials:
   ```
   VITE_SUPABASE_URL=https://...
   VITE_SUPABASE_SERVICE_ROLE_KEY=...
   ```
2. Make sure you're using the SERVICE ROLE key (not the ANON key)
3. Copy-paste your actual keys from Supabase

### Problem: "Permission denied" when seeding

**Solution:**

- You're using the ANON key instead of SERVICE ROLE key
- Go to Supabase Settings → API
- Copy the SERVICE ROLE SECRET KEY
- Update `.env` with this key
- Run seed again

### Problem: Tables created but no data appears

**Solution:**

1. Delete the tables and start over:

   ```sql
   -- In Supabase SQL Editor, run these commands:
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
   ```

2. Then copy and run the SQL from `QUICK_DATABASE_SETUP.md` again
3. Run: `npm run seed`

### Problem: "npx: command not found"

**Solution:**

- Make sure Node.js is installed: `node --version`
- If not installed, download from: https://nodejs.org/
- After installing, restart your terminal
- Try again: `npm run seed`

---

## 📚 Additional Resources

| File                      | Purpose                              |
| ------------------------- | ------------------------------------ |
| `QUICK_DATABASE_SETUP.md` | Copy-paste SQL for setup (this file) |
| `DATABASE_SEEDING.md`     | Detailed seeding guide               |
| `seed.js`                 | Node.js script that seeds the data   |
| `package.json`            | Contains seed commands               |
| `supabase/migrations/`    | SQL migration files                  |

---

## 🎯 Next Steps After Setup

✅ **Just Completed:**

1. Created database tables
2. Seeded sample data
3. Tested that everything works

🚀 **Next Steps:**

1. **Customize Data** (Optional)

   - Edit sample destinations, packages, etc.
   - See `seed.js` for the data structure

2. **Explore Admin Panel**

   - Log in with admin@jklgtravel.com / admin123
   - Try adding new destinations, packages, etc.

3. **Develop Features**

   - Start building additional features
   - See `README.md` for architecture overview

4. **Deploy to Production**

   - See `DEPLOYMENT.md` for deployment guides
   - Options: Vercel, Netlify, Docker, etc.

5. **Security Hardening**
   - See `SECURITY.md` for best practices
   - Configure Supabase RLS policies
   - Set up environment variables correctly

---

## ⏱️ Timeline

```
├─ SQL Setup (5 mins)
│  └─ ✅ Copy-paste SQL → Run in Supabase
├─ Verify Tables (2 mins)
│  └─ ✅ Check Table Editor → See 11 tables
├─ Seed Data (2 mins)
│  └─ ✅ npm run seed → See success message
├─ Verify Data (2 mins)
│  └─ ✅ Check tables in Supabase → See data
└─ Test App (2 mins)
   └─ ✅ npm run dev → Visit http://localhost:5173

TOTAL: ~10-15 minutes
```

---

## 💡 Tips & Best Practices

### For Development

- Run `npm run seed:reset` to clear and reseed data during development
- Use test data that's easy to identify (e.g., "Test Package 1")
- Keep admin credentials in a secure location

### For Staging

- Use realistic data that mirrors production
- Test with actual customer data patterns
- Verify all features work with staging database

### For Production

- Create a separate production seed script
- Use real business data only
- Set up automated backups
- Monitor database performance
- Use strong passwords for admin accounts

### Security Checklist

- [ ] SERVICE ROLE key is in `.env` (never commit!)
- [ ] Public RLS policies are configured correctly
- [ ] Admin endpoints require authentication
- [ ] File uploads are validated
- [ ] User input is sanitized
- [ ] Error messages don't leak sensitive info

---

## 📞 Support

**If you're stuck:**

1. **Check the error message** - It usually tells you what's wrong
2. **Google the error** - Most errors are common
3. **Review the Troubleshooting section** above
4. **Check Supabase docs** - https://supabase.com/docs
5. **Review our docs** - Check README.md, SECURITY.md, etc.

---

**Status**: ✅ Ready to Use  
**Version**: 1.0.0  
**Last Updated**: October 23, 2025

**Happy Building! 🚀**
