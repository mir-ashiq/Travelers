# 📖 Database Setup - Quick Reference Card

## 🎯 What You Need to Do

Your JKLG Travel database requires 2 steps:

1. **Create tables** (5 min) → Run SQL in Supabase
2. **Seed data** (2 min) → Run `npm run seed`

---

## 🚀 Quick Setup (Copy-Paste Steps)

### Step 1️⃣: Create Tables (5 minutes)

```bash
# Navigate to your project
cd "c:\Users\spike\OneDrive\Documents\Travelers"

# Open Supabase Dashboard
https://app.supabase.com

# Select your project and go to SQL Editor
# Click "New query"

# Open this file and copy ALL the SQL:
SETUP_DATABASE.sql

# Paste into Supabase SQL Editor
# Click "Run"

# Wait for: ✅ "All tables created successfully!"
```

### Step 2️⃣: Seed Data (2 minutes)

```bash
# Install dependencies
npm install

# Run the seed script
npm run seed

# Wait for: ✅ "Database seeding completed successfully!"
```

### Step 3️⃣: Start Your App

```bash
npm run dev

# Open browser to:
http://localhost:5173/

# Admin panel:
http://localhost:5173/admin
Email: admin@jklgtravel.com
Password: admin123
```

---

## 📋 Checklist

- [ ] Copy SQL from `SETUP_DATABASE.sql`
- [ ] Paste into Supabase SQL Editor
- [ ] Click "Run" in Supabase
- [ ] Verify 11 tables created (check Table Editor)
- [ ] Run `npm install`
- [ ] Run `npm run seed`
- [ ] See success message in terminal
- [ ] Run `npm run dev`
- [ ] Visit http://localhost:5173/
- [ ] Homepage loads with destinations ✅
- [ ] Admin login works ✅

---

## 🔑 Test Credentials

```
Admin Email:    admin@jklgtravel.com
Password:       admin123
```

Other test users:

```
priya@jklgtravel.com        (Manager)
raj@jklgtravel.com          (Guide)
zara@jklgtravel.com         (Support)
```

All use password: `admin123`

---

## 📁 Files You'll Use

| File                      | Purpose                            |
| ------------------------- | ---------------------------------- |
| `SETUP_DATABASE.sql`      | Complete SQL to copy into Supabase |
| `DATABASE_SETUP.md`       | Detailed setup guide               |
| `DATABASE_SEEDING.md`     | Advanced seeding info              |
| `QUICK_DATABASE_SETUP.md` | Quick reference with SQL           |
| `seed.js`                 | Node.js script that seeds data     |
| `supabase/migrations/`    | Original migration files           |

---

## 💾 What Gets Created

**Tables (11 total)**

```
destinations       - 8 records (Kashmir, Ladakh, etc.)
packages          - 4 records (Tour packages)
itineraries       - 23 records (Day-by-day schedules)
gallery           - 12 records (Travel photos)
testimonials      - 6 records (Customer reviews)
faqs              - 6 records (Questions & answers)
blog_posts        - 4 records (Travel guides)
admin_users       - 4 records (Admin accounts)
bookings          - 5 records (Sample reservations)
support_tickets   - 4 records (Support requests)
ticket_messages   - (Messages within tickets)
```

---

## 🆘 If Something Goes Wrong

### Tables show "not found" error

**Fix:**

1. Go to Supabase SQL Editor
2. Copy `SETUP_DATABASE.sql`
3. Run in SQL Editor
4. Check Table Editor for 11 tables

### Seed script shows connection error

**Fix:**

1. Check `.env` has correct Supabase credentials
2. Verify using SERVICE ROLE key (not ANON key)
3. Run: `npm run seed` again

### "Permission denied" when seeding

**Fix:**

1. Get your SERVICE ROLE SECRET KEY from Supabase
2. Update `.env` file
3. Run: `npm run seed`

### Stuck? Need help?

Check these in order:

1. `DATABASE_SETUP.md` - Detailed guide
2. `DATABASE_SEEDING.md` - Troubleshooting section
3. `QUICK_DATABASE_SETUP.md` - Copy-paste SQL
4. Supabase Docs - https://supabase.com/docs

---

## 🎓 Learning Resources

- **Supabase**: https://supabase.com/docs
- **PostgreSQL**: https://www.postgresql.org/docs/
- **React**: https://react.dev
- **Vite**: https://vitejs.dev

---

## 📞 Command Reference

```bash
# Setup
npm install                    # Install dependencies
npm run seed                   # Seed database
npm run seed:reset            # Clear and reseed

# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run preview               # Preview production build
npm run lint                  # Check code quality
npm run type-check            # Check TypeScript types

# Database
npm run seed                  # Populate database with sample data
npm run seed:fresh            # Fresh install (recommended first time)
```

---

## 📱 URLs Reference

```
Development:     http://localhost:5173/
Admin Panel:     http://localhost:5173/admin
Packages:        http://localhost:5173/packages
Gallery:         http://localhost:5173/gallery
Contact:         http://localhost:5173/contact
About:           http://localhost:5173/about

Backend:
Supabase:        https://app.supabase.com
```

---

## ✅ Success Indicators

✅ You'll know it's working when:

- Database tables appear in Supabase Table Editor
- `npm run seed` completes without errors
- Homepage shows destinations and packages
- Can log in to admin panel
- Admin panel shows all data
- Console has no errors (F12)

---

## 🚀 Next Steps After Setup

1. ✅ **Setup database** (you are here)
2. 📝 **Read documentation**
   - README.md - Overview
   - SECURITY.md - Best practices
   - DEPLOYMENT.md - Going live
3. 🧪 **Test features**
   - Navigate pages
   - Try bookings
   - Use admin panel
4. 🎨 **Customize**
   - Change colors/branding
   - Add your destinations
   - Customize packages
5. 🚀 **Deploy**
   - See DEPLOYMENT.md
   - Choose platform (Vercel, Netlify, etc.)
   - Go live!

---

## 💡 Pro Tips

1. **Save your credentials**

   - Keep `.env` file safe
   - Never commit to git
   - Use `.env.example` for template

2. **Regular backups**

   - Export Supabase data regularly
   - Keep migration files versioned

3. **Test before production**

   - Always test in staging first
   - Verify all features work
   - Check mobile responsiveness

4. **Monitor performance**
   - Check database slow queries
   - Monitor API response times
   - Track error rates

---

**Total Time: ~10 minutes**  
**Difficulty: Easy** ⭐  
**Status: Ready** ✅

## 🎉 You're All Set!

Your JKLG Travel database will be ready to use after these steps.

Start with Step 1️⃣ above and let me know if you hit any issues!

---

**Last Updated**: October 23, 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅
