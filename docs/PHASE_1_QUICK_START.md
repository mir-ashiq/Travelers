---
title: Phase 1 Quick Start Guide - Testing & Deployment
date: 2025-10-26
status: Ready to Execute
---

# 🚀 Phase 1 Quick Start - Testing & Deployment Guide

## ⚡ 5-Minute Setup to Start Testing

### Prerequisites

- Node.js 16+ installed
- npm or yarn
- Supabase project created
- Stripe test account (optional, for payment testing)

### Step 1: Install Dependencies (Already Done ✅)

```bash
cd backend
npm install  # ✅ Stripe package already installed

cd ../website
npm install  # Stripe packages already installed
```

### Step 2: Configure Environment Variables

**Backend** - Create `/backend/.env`:

```env
# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
DATABASE_URL=postgresql://user:password@host/db

# Auth
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRY=24h

# Stripe (Test Keys)
STRIPE_SECRET_KEY=sk_test_51234567890
STRIPE_WEBHOOK_SECRET=whsec_test_1234567890

# Email (Optional - for testing without email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@travelers.app

# Server
PORT=3000
NODE_ENV=development
```

**Frontend** - Create `/website/.env.local`:

```env
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLIC_KEY=pk_test_51234567890
```

### Step 3: Apply Database Migrations

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor**
4. Click **New Query**
5. Copy content from `/supabase/migrations/20251026_001_add_transactions_table.sql`
6. Click **RUN** ✅
7. Create another query with `/supabase/migrations/20251026_002_add_customers_table.sql`
8. Click **RUN** ✅
9. Go to **Table Editor** and verify 8 new tables appeared

### Step 4: Start the Backend

```bash
cd backend
npm start
```

**Expected Output**:

```
Server running on port 3000
Connected to database
Ready to accept requests
```

### Step 5: Start the Frontend

In a new terminal:

```bash
cd website
npm run dev
```

**Expected Output**:

```
Local:        http://localhost:5173/
Ready in XXXms
```

### Step 6: Test the Flow

1. Open http://localhost:5173/signup
2. Fill in the form:
   - Name: John Doe
   - Email: john@example.com
   - Password: SecurePass123
   - Confirm: SecurePass123
   - Phone: +1 (555) 123-4567
   - Check Terms checkbox
3. Click "Create Account"
4. ✅ Should see: "Redirecting to email verification"
5. If SMTP configured: Check email for verification link
6. If not: Go to http://localhost:5173/verify-email (you'll need token from logs)

---

## 🧪 Testing Scenarios

### Scenario 1: Complete Registration Flow

**Steps**:

1. Visit `/signup`
2. Fill form with valid data
3. Click "Create Account"
4. Check email for verification link (or use `/verify-email`)
5. Verify email
6. Go to `/login`
7. Enter email and password
8. Click "Login"
9. ✅ Should redirect to `/customer-dashboard`

**Success Indicators**:

- ✅ Registration successful message
- ✅ Email received (or verification page loads)
- ✅ Dashboard displays customer name
- ✅ Token saved in localStorage
- ✅ Bookings list displays (empty initially)

### Scenario 2: Login with Unverified Email

**Steps**:

1. Create account but don't verify
2. Try to login
3. Should see error: "Please verify your email"
4. Click "Resend verification"
5. Check email
6. Verify email
7. Login again
8. ✅ Should succeed

### Scenario 3: Password Reset Flow

**Steps**:

1. Visit `/login`
2. Click "Forgot password?"
3. Enter email
4. Check email for reset link
5. Click reset link (or go to `/reset-password?token=xxx&customerId=yyy`)
6. Enter new password
7. Confirm password
8. Click "Reset Password"
9. ✅ Should see success message
10. Redirect to login
11. Login with new password
12. ✅ Should succeed

### Scenario 4: Protected Route Access

**Steps**:

1. Without being logged in, visit `/customer-dashboard`
2. ✅ Should redirect to `/login`
3. Login successfully
4. Visit `/customer-dashboard`
5. ✅ Should display dashboard
6. Visit `/payment/booking-123`
7. ✅ Should display payment form

### Scenario 5: Payment Test (with Stripe Test Card)

**Steps**:

1. Login successfully
2. Create a test booking (manual insert into database)
3. Visit `/payment/{bookingId}`
4. Fill billing details:
   - Full Name: John Doe
   - Email: john@example.com
   - Phone: +1 (555) 123-4567
   - Address: 123 Main St
   - City: New York
   - State: NY
   - ZIP: 10001
   - Country: US
5. Enter Stripe test card: `4242 4242 4242 4242`
6. Expiry: `12/25`
7. CVC: `123`
8. Click "Pay $XXX.XX"
9. ✅ Should show success confirmation
10. ✅ Redirect to dashboard

**Stripe Test Cards**:

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires Auth**: 4000 0025 0000 3155

---

## 🐛 Troubleshooting

### "Cannot find module" errors

**Solution**:

```bash
cd backend
npm install  # or npm ci

cd ../website
npm install  # or npm ci
```

### "Connection refused" on API calls

**Solution**:

- Make sure backend is running: `npm start` in backend folder
- Check PORT is 3000
- Check VITE_API_URL is http://localhost:3000

### "Database connection failed"

**Solution**:

- Verify SUPABASE_URL and SUPABASE_KEY in .env
- Run migrations in SQL Editor first
- Check database is in Online state

### Email not received

**Solution**:

- Check SMTP_HOST, SMTP_USER, SMTP_PASSWORD
- Try with app password instead of regular password (Gmail)
- Check spam folder
- Use `/verify-email` page if email not needed for testing

### Stripe errors in payment

**Solution**:

- Use test cards from Stripe docs
- Check VITE*STRIPE_PUBLIC_KEY starts with `pk_test*`
- Check backend STRIPE*SECRET_KEY starts with `sk_test*`
- Verify public/secret keys match

### Can't login after signup

**Solution**:

- Verify email first
- Check password matches (8+ chars)
- Check email is correct
- Look at backend console for error details

---

## 📊 Testing Checklist

### Frontend Tests

- [ ] Signup page renders
- [ ] Form validation works
- [ ] Signup successful
- [ ] Email verification page shows
- [ ] Login page works
- [ ] Dashboard displays
- [ ] Logout works
- [ ] Protected routes redirect to login
- [ ] Payment page renders
- [ ] Payment form validates
- [ ] Responsive design works on mobile

### Backend Tests

- [ ] API endpoints respond
- [ ] Database queries work
- [ ] JWT tokens valid
- [ ] Email sending works
- [ ] Stripe integration works
- [ ] Error handling works
- [ ] Validation works

### Database Tests

- [ ] Migrations ran successfully
- [ ] All 8 tables created
- [ ] RLS policies enabled
- [ ] Indexes created
- [ ] Data can be inserted
- [ ] Data can be queried

### Integration Tests

- [ ] Signup → Verify → Login → Dashboard
- [ ] Dashboard → Payment → Success
- [ ] Forgot Password → Reset → Login
- [ ] Logout → Redirect to login

---

## 🚀 Deployment Steps

### Deploy Backend to Railway

1. Create account at [Railway.app](https://railway.app)
2. Connect GitHub repository
3. Create new project
4. Select backend folder
5. Add environment variables:
   - SUPABASE_URL
   - SUPABASE_KEY
   - JWT_SECRET (new value for production)
   - STRIPE_SECRET_KEY (production key)
   - STRIPE_WEBHOOK_SECRET
   - All SMTP variables
   - NODE_ENV=production
6. Click Deploy
7. ✅ Get production backend URL

### Deploy Frontend to Vercel

1. Create account at [Vercel.com](https://vercel.com)
2. Import GitHub repository
3. Select website folder as root
4. Add environment variables:
   - VITE_API_URL=https://your-railway-app.railway.app
   - VITE_STRIPE_PUBLIC_KEY (production key)
5. Click Deploy
6. ✅ Get production frontend URL

### Configure Production

1. Go to Stripe dashboard
2. Switch to live mode
3. Get production API keys
4. Update backend environment variable
5. Update frontend environment variable
6. Redeploy both

### Verify Production

1. Visit production frontend URL
2. Test signup flow
3. Test login
4. Test payment with production Stripe account
5. ✅ All working!

---

## 📝 Important Notes

### Security

- Change JWT_SECRET to random value
- Use production Stripe keys in production
- Never commit .env files
- Use environment variables in deployment
- Enable HTTPS everywhere

### Performance

- Monitor API response times
- Check database query performance
- Use CDN for static assets
- Enable caching where possible
- Monitor Stripe API usage

### Monitoring

- Set up error tracking (Sentry)
- Monitor API logs
- Track payment processing
- Monitor email delivery
- Database backup strategy

---

## 🎯 Next Steps After Testing

1. **Code Review**

   - Review code for style consistency
   - Check security practices
   - Verify error handling
   - Test edge cases

2. **Performance Testing**

   - Load testing
   - Payment processing speed
   - Database optimization
   - Frontend bundle size

3. **Security Testing**

   - XSS attack prevention
   - CSRF protection
   - SQL injection prevention
   - Rate limiting

4. **Deployment**
   - Deploy backend to production
   - Deploy frontend to production
   - Configure custom domain
   - Set up SSL certificate
   - Monitor production metrics

---

## 📞 Support

### Common Issues

**Q: How do I create a test booking for payment testing?**
A: Connect to Supabase SQL Editor and insert:

```sql
INSERT INTO bookings (package_id, customer_id, start_date, end_date, total_price, status)
VALUES (1, 'customer-uuid', '2025-06-01', '2025-06-08', 2500.00, 'pending');
```

**Q: How do I check if email is working?**
A: Look at backend console logs. If "Email sent" appears, SMTP is working.

**Q: Can I test without Stripe?**
A: Yes! Frontend will work. Skip payment page testing or use test keys.

**Q: How do I reset the database?**
A: Drop all tables in Supabase and re-run migrations.

---

## ✅ Ready to Go!

You now have everything needed to:

- ✅ Test locally
- ✅ Deploy to production
- ✅ Monitor performance
- ✅ Handle errors
- ✅ Process payments

**Start testing now**:

```bash
# Terminal 1
cd backend && npm start

# Terminal 2
cd website && npm run dev

# Browser
http://localhost:5173/signup
```

**Happy testing! 🚀**

---

**Created By**: AI Assistant  
**Date**: 2025-10-26  
**Version**: Phase 1 Complete  
**Status**: Ready to Execute
