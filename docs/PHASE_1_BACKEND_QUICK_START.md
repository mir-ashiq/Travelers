---
title: Phase 1 Backend - Quick Start Guide
date: 2024-10-26
---

# ⚡ Phase 1 Backend - Quick Start & Setup

## 🎯 Overview

The Phase 1 backend is **100% complete** and ready to deploy. This guide walks you through:

1. Applying database migrations
2. Installing dependencies
3. Configuring environment
4. Testing the API
5. Deploying to production

**Total Setup Time**: ~30-45 minutes

---

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] Supabase project created
- [ ] Supabase Service Role key available
- [ ] Stripe account (for payment testing)
- [ ] Email provider configured (Gmail/SendGrid/etc)
- [ ] Node.js 18+ installed locally

---

## 🔧 Step-by-Step Setup

### Step 1️⃣: Apply Database Migrations (5-10 min)

**Option A: Using Supabase Dashboard**

1. Go to Supabase: https://app.supabase.com
2. Open your project
3. Navigate to **SQL Editor**
4. Click **+ New Query**
5. Copy entire contents of `/supabase/migrations/20251026_001_add_transactions_table.sql`
6. Paste into editor
7. Click **Run** (green button)
8. Wait for success message ✅
9. Repeat steps 4-8 for `/supabase/migrations/20251026_002_add_customers_table.sql`

**Expected Tables Created**:

- `transactions`
- `transaction_audit_logs`
- `customers`
- `customer_sessions`
- `password_reset_tokens`
- `email_verification_tokens`
- `customer_addresses`
- `customer_preferences`

✅ **Verify**: Check Supabase Dashboard → Table Editor - you should see all 8 new tables

---

### Step 2️⃣: Install Dependencies (5-10 min)

```bash
# Navigate to backend
cd backend

# Install npm packages
npm install

# Should install stripe package among others
```

✅ **Verify**: `node_modules/stripe` folder exists

---

### Step 3️⃣: Configure Environment Variables (10 min)

**Edit**: `backend/.env`

```bash
# ============================================
# Core Configuration
# ============================================
PORT=3000
NODE_ENV=development

# ============================================
# Supabase (Already configured, verify these)
# ============================================
VITE_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...your_key...

# ============================================
# JWT (Generate new secure key)
# ============================================
# Run this in terminal to generate:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_generated_32_char_hex_key_here

# ============================================
# Email Configuration
# ============================================
# For Gmail: use App Password (not your regular password)
# Recommended: Use SendGrid or Mailgun for reliability
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=noreply@yourdomain.com
SMTP_FROM_NAME=JKLG Travel

# ============================================
# Frontend URL (for email links)
# ============================================
FRONTEND_URL=http://localhost:5173

# ============================================
# Stripe Configuration
# ============================================
# Get keys from: https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_public_key_here

# Get webhook secret after setting up webhook in Stripe dashboard
# https://dashboard.stripe.com/webhooks
STRIPE_WEBHOOK_SECRET=whsec_test_webhook_secret_here
```

✅ **Verify**: `cat backend/.env` shows all variables set

---

### Step 4️⃣: Start Backend Server (5 min)

```bash
# From backend directory
npm start

# Expected output:
# ╔════════════════════════════════════════════════════════╗
# ║         🚀 JKLG Travel Agency Production Server       ║
# ║                                                        ║
# ║  Website: http://localhost:3000                       ║
# ║  Email Service: Running automatically                ║
# ╚════════════════════════════════════════════════════════╝
# ✅ Email service initialized
```

✅ **Verify**: Navigate to http://localhost:3000/api/health
Expected response:

```json
{
  "status": "ok",
  "timestamp": "2024-10-26T...",
  "uptime": 2.5
}
```

---

## 🧪 Testing the API

### Test 1: Register a New Customer

**Tool**: Postman, curl, or VS Code REST Client

```bash
curl -X POST http://localhost:3000/api/customers/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "SecurePassword123",
    "name": "Test User",
    "phone": "+1-555-0123"
  }'
```

**Expected Response** (201):

```json
{
  "customerId": "550e8400-e29b-41d4-a716-446655440000",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Account created successfully. Please verify your email.",
  "requiresVerification": true
}
```

✅ **Success Indicators**:

- ✅ HTTP 201 status
- ✅ Token is JWT format
- ✅ `requiresVerification: true`
- ✅ Customer record in Supabase

❌ **Troubleshooting**:

- **400**: Check email/password requirements (8+ char password)
- **409**: Email already registered
- **500**: Database connection issue - verify Supabase keys

---

### Test 2: Login as Customer

```bash
curl -X POST http://localhost:3000/api/customers/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "SecurePassword123"
  }'
```

**Expected Response**:

```json
{
  "customerId": "550e8400-e29b-41d4-a716-446655440000",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "customer": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "testuser@example.com",
    "name": "Test User",
    "phone": "+1-555-0123",
    "verified_at": null,
    "status": "pending"
  }
}
```

❌ **Expected Error** (403):

```json
{
  "error": "Email not verified",
  "customerId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Please verify your email before logging in"
}
```

✅ **This is correct** - email verification is required before login

---

### Test 3: Get Customer Profile (Authenticated)

```bash
# Replace TOKEN with the JWT from login/register response
curl -X GET http://localhost:3000/api/customers/me \
  -H "Authorization: Bearer TOKEN_HERE"
```

**Expected Response**:

```json
{
  "customer": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "testuser@example.com",
    "name": "Test User",
    "phone": "+1-555-0123",
    "verified_at": null,
    "status": "pending",
    "loyalty_points": 0
  }
}
```

---

### Test 4: Create Payment Intent (Stripe)

⚠️ **Requires**: Valid Stripe test keys in .env

```bash
curl -X POST http://localhost:3000/api/payments/create-payment-intent \
  -H "Authorization: Bearer TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 29999,
    "currency": "usd"
  }'
```

**Expected Response**:

```json
{
  "paymentIntentId": "pi_3OB5eXEJJSKz6F3s0Gz1n9i9",
  "clientSecret": "pi_3OB5eXEJJSKz6F3s0Gz1n9i9_secret_xyz",
  "amount": 29999,
  "currency": "usd",
  "status": "requires_payment_method"
}
```

✅ **Success**: Payment intent created in Stripe

---

## 📧 Testing Email Service

### Verify Email Configuration

```bash
# Add this to test-email.js
import { testEmailConnection } from './services/emailService.js';

try {
  const result = await testEmailConnection();
  console.log('Email test:', result);
} catch (error) {
  console.error('Email test failed:', error);
}
```

Run:

```bash
node test-email.js
```

✅ **Expected**: `✅ Email service verified and ready to send`

❌ **If fails**: Check SMTP credentials in .env

---

## 🚀 Deployment to Production

### Pre-Deployment Checklist

- [ ] All database migrations applied successfully
- [ ] All API tests passing locally
- [ ] JWT_SECRET changed to production value
- [ ] Stripe webhook configured
- [ ] Email service configured with production credentials
- [ ] Environment variables updated for production domain

### Deploy to Railway (Existing Setup)

```bash
# From project root
git add -A
git commit -m "feat: Phase 1 backend - payment system and customer auth"
git push origin main

# Railway will auto-deploy
# Monitor: https://railway.app
```

### Deploy to Other Platforms

Similar process - ensure environment variables are set in deployment platform.

---

## 📊 API Summary - All Available Endpoints

### Customer Endpoints

```
POST   /api/customers/register              - Create account
POST   /api/customers/login                 - Login
POST   /api/customers/verify-email          - Verify email
POST   /api/customers/resend-verification   - Resend verification
POST   /api/customers/forgot-password       - Request password reset
POST   /api/customers/reset-password        - Reset password
GET    /api/customers/me                    - Get my profile (auth required)
PUT    /api/customers/:id                   - Update profile (auth required)
DELETE /api/customers/:id                   - Delete account (auth required)
GET    /api/customers/:id/bookings          - Get my bookings (auth required)
GET    /api/customers/:id/addresses         - Get my addresses (auth required)
POST   /api/customers/:id/addresses         - Add address (auth required)
DELETE /api/customers/:id/addresses/:id     - Delete address (auth required)
POST   /api/customers/change-password       - Change password (auth required)
```

### Payment Endpoints

```
POST   /api/payments/create-payment-intent  - Create payment (auth required)
GET    /api/payments/booking/:bookingId     - Get payment status
GET    /api/payments/transactions           - List transactions (admin only)
GET    /api/payments/transactions/:id       - Get transaction (admin only)
POST   /api/payments/process-webhook        - Stripe webhook (no auth)
POST   /api/payments/refund                 - Refund payment (admin only)
```

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: "VITE_SUPABASE_URL is not defined"

- **Solution**: Copy exact variable name from Supabase dashboard Settings > API

**Issue**: "Invalid token"

- **Solution**: Ensure JWT_SECRET is set and same across restarts

**Issue**: "SMTP credentials are wrong"

- **Solution**: For Gmail, use App Password (not your Gmail password)

**Issue**: "Stripe key is invalid"

- **Solution**: Get keys from Stripe dashboard, use test keys for development

**Issue**: "Payment webhook not received"

- **Solution**:
  1. Verify webhook endpoint is publicly accessible
  2. Confirm webhook secret matches in .env
  3. Check Stripe dashboard for webhook logs

---

## ✅ Verification Checklist

Use this checklist to verify everything is working:

- [ ] Database migrations applied
- [ ] Dependencies installed
- [ ] Server starts without errors
- [ ] `/api/health` returns 200
- [ ] Customer registration works
- [ ] Customer can't login before email verified
- [ ] Customer profile retrieval works with JWT
- [ ] Payment intent creation works
- [ ] Email service test passes

---

## 📚 Next Steps

After backend is deployed:

1. **Frontend Development** (Start here after backend is live)

   - Create customer signup/login pages
   - Create payment form with Stripe Elements
   - Create booking history dashboard
   - Create customer profile page

2. **Testing**

   - End-to-end booking → payment flow
   - Email verification workflow
   - Password reset workflow
   - Stripe test mode testing

3. **Production Launch**
   - Enable Stripe live mode
   - Configure production email
   - Enable RLS policies
   - Enable CORS for production domain

---

## 📞 Quick Reference

**Backend URL**: http://localhost:3000  
**API Base**: http://localhost:3000/api  
**Database**: Supabase PostgreSQL  
**Auth**: JWT (Bearer tokens)  
**Payment**: Stripe API  
**Email**: Nodemailer SMTP

---

**Status**: ✅ Backend Ready for Testing  
**Last Updated**: 2024-10-26  
**Next Phase**: Frontend Implementation
