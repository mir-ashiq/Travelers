# 🚀 PHASE 1 - QUICK COMMAND REFERENCE

## Get Started in 3 Commands

```bash
# 1. Start Backend
cd backend && npm start

# 2. Start Frontend (in new terminal)
cd website && npm run dev

# 3. Open in browser
http://localhost:5173/signup
```

## Common Commands

### Frontend

```bash
cd website

# Development
npm run dev              # Start dev server on port 5173

# Building
npm run build           # Build for production
npm run preview         # Preview production build

# Quality
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking
```

### Backend

```bash
cd backend

# Development
npm start               # Start server on port 3000
npm run dev            # Start with nodemon (auto-reload)

# Dependencies
npm install            # Install packages
npm list               # List installed packages
npm audit              # Check security vulnerabilities
npm audit fix          # Fix vulnerabilities
```

### Database

```
# Apply migrations in Supabase SQL Editor:
1. Go to: https://app.supabase.com
2. Select your project
3. Go to: SQL Editor → New Query
4. Copy /supabase/migrations/20251026_001_add_transactions_table.sql
5. Click RUN
6. Repeat for: 20251026_002_add_customers_table.sql
```

## Environment Variables

### Backend (.env)

```env
# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-key
DATABASE_URL=postgresql://...

# Auth
JWT_SECRET=your-secret
JWT_EXPIRY=24h

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-password
EMAIL_FROM=noreply@travelers.app

# Server
PORT=3000
NODE_ENV=development
```

### Frontend (.env.local)

```env
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

## Important Files

### Frontend

```
website/src/
├── contexts/
│   └── CustomerContext.tsx    ← Main auth logic
├── pages/
│   ├── CustomerSignup.tsx     ← Registration
│   ├── CustomerLogin.tsx      ← Login
│   ├── VerifyEmail.tsx        ← Email verification
│   ├── ForgotPassword.tsx     ← Password reset request
│   ├── ResetPassword.tsx      ← Password reset form
│   ├── CustomerDashboard.tsx  ← Dashboard
│   └── PaymentPage.tsx        ← Stripe payment
├── AppRoutes.tsx              ← Route configuration
└── App.tsx                    ← Provider wrapping
```

### Backend

```
backend/
├── routes/
│   ├── payments.js            ← Payment endpoints
│   └── customers.js           ← Auth endpoints
├── services/
│   └── emailService.js        ← Email templates
└── server.js                  ← Express setup
```

### Database

```
supabase/migrations/
├── 20251026_001_add_transactions_table.sql
└── 20251026_002_add_customers_table.sql
```

## Testing Routes

```
Public Routes:
  http://localhost:5173/signup              ← Registration
  http://localhost:5173/login               ← Login
  http://localhost:5173/verify-email        ← Email verification
  http://localhost:5173/forgot-password     ← Password reset request
  http://localhost:5173/reset-password      ← Password reset form

Protected Routes:
  http://localhost:5173/customer-dashboard  ← Dashboard
  http://localhost:5173/payment/123         ← Payment form
```

## API Base URL

```
Local Development:      http://localhost:3000
Production Backend:     (set in VITE_API_URL)
```

## Stripe Test Cards

```
Success:        4242 4242 4242 4242
Decline:        4000 0000 0000 0002
Auth Required:  4000 0025 0000 3155

All expiry dates work: 12/25
All CVCs work: 123
```

## Debugging

### Frontend Console

```bash
# Check these in browser console (F12 → Console)
localStorage.getItem('token')        # See JWT token
localStorage.getItem('customer')     # See customer data
```

### Backend Console

```bash
# Look for these log messages
"Server running on port 3000"
"Connected to database"
"Email sent successfully"
"Payment intent created"
```

### Network Requests

```bash
# In browser DevTools (F12 → Network)
- Look for POST requests to /api/customers/*
- Look for POST requests to /api/payments/*
- Check response status codes (200, 201, 400, 401, 500)
- Check response body for errors
```

## Troubleshooting Quick Fixes

```bash
# Port already in use?
# Find process: lsof -i :3000 or lsof -i :5173
# Kill process: kill -9 <PID>

# Dependencies not installed?
npm install

# TypeScript errors?
npm run type-check

# Linting errors?
npm run lint

# Build failing?
npm cache clean --force
npm install
npm run build

# Database connection failed?
1. Check SUPABASE_URL and SUPABASE_KEY
2. Verify database is online
3. Run migrations first
```

## Deployment Commands

### Backend to Railway

```bash
# Push to GitHub
git add .
git commit -m "Phase 1 complete"
git push origin main

# Then in Railway dashboard:
# 1. Create project
# 2. Select GitHub repo
# 3. Select backend folder
# 4. Add environment variables
# 5. Deploy
```

### Frontend to Vercel

```bash
# Push to GitHub (same as above)

# Then in Vercel dashboard:
# 1. Import GitHub repo
# 2. Select website folder
# 3. Add environment variables
# 4. Deploy
```

## Documentation Files

```
Read in this order:

1. PHASE_1_DOCUMENTATION_INDEX.md    ← Start here (navigation)
2. PHASE_1_COMPLETION_REPORT.md      ← Overview (15 min)
3. PHASE_1_QUICK_START.md            ← Setup & testing (10 min)
4. PHASE_1_VERIFICATION.md           ← Checklist (10 min)
5. PHASE_1_COMPLETE.md               ← Deep dive (30 min)
```

## Quick Reference

| Task            | Command                                          |
| --------------- | ------------------------------------------------ |
| Start dev       | `npm start` (backend) + `npm run dev` (frontend) |
| Build           | `npm run build` (frontend)                       |
| Test            | Open http://localhost:5173/signup                |
| Check types     | `npm run type-check`                             |
| Lint code       | `npm run lint`                                   |
| Deploy backend  | Push to GitHub → Railway                         |
| Deploy frontend | Push to GitHub → Vercel                          |

## Support

| Issue                     | Solution                           |
| ------------------------- | ---------------------------------- |
| Can't connect to backend  | Check port 3000 is not in use      |
| Can't connect to database | Check SUPABASE_URL and key in .env |
| Payment test failing      | Use Stripe test cards from above   |
| Email not sending         | Check SMTP credentials in .env     |
| Pages not loading         | Check routes in AppRoutes.tsx      |

## Next Steps

1. **Setup** (5 min)

   ```bash
   # Create .env files
   # Apply migrations
   ```

2. **Develop** (20 min)

   ```bash
   npm start          # Backend
   npm run dev        # Frontend
   ```

3. **Test** (30 min)

   ```
   http://localhost:5173/signup
   ```

4. **Deploy** (30 min)
   ```
   Follow PHASE_1_QUICK_START.md
   ```

---

**Everything is ready! Pick a command above and get started.** 🚀
