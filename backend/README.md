# Backend (Node.js API + Email Service)

# Deploy to Railway

This folder contains the Node.js backend with email service.

## 🚀 What's Inside

- Express server (API)
- Email sender service
- Supabase integration
- SMTP configuration

## 📦 Setup

```bash
npm install
npm start     # Dev server with emails
npm run start:prod  # Production build
npm run email:send  # Send emails manually
```

## 🌐 Deploy to Railway

```bash
# Option 1: Railway CLI
npm install -g @railway/cli
railway login
railway link
railway up

# Option 2: GitHub
# 1. Push to GitHub
# 2. Connect repo to Railway dashboard
# 3. Auto-deploys on push
```

## 🔐 Configure Environment Variables

In Railway dashboard, set:

```
SMTP_HOST=mail.abctravels.site
SMTP_PORT=587
SMTP_USER=test@abctravels.site
SMTP_PASSWORD=your_password
SUPABASE_SERVICE_ROLE_KEY=your_key
VITE_SUPABASE_URL=https://your-project.supabase.co
PORT=3000
```

## 📁 Folder Structure

```
backend/
├── email-sender.js
├── server.js
├── start-dev-with-emails.js
├── railway.json
├── package.json
└── .env.example
```

## 🔗 API Endpoints

```
GET  /api/health          - Server health check
GET  /api/email-status    - Email service status
POST /api/bookings        - Create booking (from website)
```

---

**Website URL:** https://your-site.vercel.app  
**Backend URL:** https://your-backend.up.railway.app
