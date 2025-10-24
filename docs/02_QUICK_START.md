# 🚀 Quick Start Guide - After Installation

## ✨ Your Project is Ready!

npm install completed successfully. Both website and backend are ready to run!

---

## 🎯 5-Minute Quick Start

### Step 1: Configure Environment (2 min)

**Website Configuration:**

```bash
cd website
# Edit .env with your Supabase keys
nano .env
```

Add these variables:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_BASE_URL=http://localhost:3000
```

**Backend Configuration:**

```bash
cd backend
# Edit .env with your SMTP and Supabase keys
nano .env
```

Add these variables:

```env
SMTP_HOST=mail.abctravels.site
SMTP_PORT=587
SMTP_USER=your-email@abctravels.site
SMTP_PASSWORD=your-password
SUPABASE_SERVICE_ROLE_KEY=your_service_key
SUPABASE_URL=https://your-project.supabase.co
PORT=3000
NODE_ENV=production
```

### Step 2: Start Development Servers (1 min)

**Terminal 1 - Website:**

```bash
cd website
npm run dev
# Opens on http://localhost:5173
```

**Terminal 2 - Backend:**

```bash
cd backend
npm start
# Opens on http://localhost:3000
```

### Step 3: Test in Browser (1 min)

1. Open: http://localhost:5173
2. Navigate to booking
3. Create test booking
4. Check email arrives in 30 seconds

### Step 4: Done! 🎉

- Website: http://localhost:5173 ✅
- Backend: http://localhost:3000 ✅
- Email: Working ✅

---

## 📋 Complete Commands Cheat Sheet

### Install

```bash
cd website && npm install
cd backend && npm install
```

### Development

```bash
# Website (Terminal 1)
cd website && npm run dev

# Backend (Terminal 2)
cd backend && npm start
```

### Build for Production

```bash
cd website && npm run build
# Creates website/dist/ folder
```

### Deploy to Vercel

```bash
cd website
npm run build
vercel deploy
```

### Deploy to Railway

```bash
cd backend
railway up
# Or: git push origin main
```

### Check for Issues

```bash
# TypeScript errors
cd website && npm run type-check

# Lint code
cd website && npm run lint

# Test email service
cd backend && npm run email:send
```

---

## 🔍 Verify Installation

### Website Ready?

```bash
cd website
ls -la node_modules/.bin/vite
ls -la dist/
# Both should exist
```

### Backend Ready?

```bash
cd backend
ls -la node_modules/.bin
# Should show: express, nodemailer, etc.
```

### Environment Files?

```bash
cd website
cat .env        # Should have VITE_SUPABASE_URL, etc.

cd backend
cat .env        # Should have SMTP_HOST, etc.
```

---

## 🎯 Common Tasks

### Add a React Component

```bash
# Create in website/src/components/
nano website/src/components/MyComponent.tsx
```

### Modify Express Server

```bash
# Edit backend server
nano backend/server.js
# Changes auto-reload with npm start
```

### Update Database Connection

```bash
# Edit backend environment
nano backend/.env
# Restart: npm start
```

### Deploy Website Update

```bash
cd website
npm run build
vercel deploy
# Automatically deploys from dist/
```

### Deploy Backend Update

```bash
cd backend
# If GitHub connected:
git push origin main
# Auto-deploys on Railway
```

---

## 🚨 Troubleshooting

### "Port 5173 already in use"

```bash
# Kill the process
netstat -ano | findstr :5173
taskkill /PID <PID> /F
# Or change port in vite.config.ts
```

### "Port 3000 already in use"

```bash
# Kill the process
netstat -ano | findstr :3000
taskkill /PID <PID> /F
# Or change PORT in .env
```

### "Module not found"

```bash
# Reinstall
rm -rf node_modules package-lock.json
npm install
```

### "Build fails"

```bash
# Check TypeScript
npm run type-check

# Clear cache
rm -rf dist
npm run build
```

### "Email not sending"

```bash
# Check .env variables
cat .env

# Verify SMTP credentials
# Restart backend
npm start

# Check logs in terminal
```

---

## 📚 Documentation

### Getting Started

- `docs/START_HERE.md` - Full guide
- `docs/INDEX.md` - Master index
- `docs/01_INSTALLATION_TEST_REPORT.md` - Installation details

### Feature Documentation

- `website/docs/SETTINGS_COMPLETE.md` - Settings features
- `backend/docs/EMAIL_SYSTEM_COMPLETE.md` - Email system
- `backend/docs/DATABASE_COMPLETE_STRUCTURE.md` - Database schema

### Deployment

- `backend/docs/DEPLOYMENT_GUIDE_SEPARATED.md` - Full deployment guide
- `website/README.md` - Website deployment
- `backend/README.md` - Backend deployment

---

## ✅ What's Installed

### Website Packages

- React 18.3.1
- TypeScript 5.5.3
- Vite 5.4.8
- Tailwind CSS 3.4.1
- Framer Motion 11.18.2
- Lucide React 0.344.0
- Supabase Client 2.39.8

### Backend Packages

- Express 4.18.2
- Nodemailer 6.9.7
- Dotenv 16.4.5
- Supabase Client 2.39.8

---

## 🎉 You're All Set!

Everything is installed and ready. Start with:

```bash
# Terminal 1
cd website && npm run dev

# Terminal 2
cd backend && npm start
```

Then visit: http://localhost:5173

**Happy coding! 🚀**
