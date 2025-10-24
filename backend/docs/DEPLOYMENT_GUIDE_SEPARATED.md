# 🚀 Separated Deployment Guide

## 📂 Folder Structure

```
Travelers/
├── website/              ← Deploy to Vercel (React Frontend)
│   ├── src/
│   ├── vercel.json
│   ├── package.json
│   └── README.md
│
├── backend/              ← Deploy to Railway (Node.js API + Emails)
│   ├── email-sender.js
│   ├── server.js
│   ├── railway.json
│   ├── package.json
│   └── README.md
│
└── DEPLOYMENT_GUIDE.md   ← This file
```

---

## 🎯 Deployment Plan

```
┌─────────────────────────────────────────────────────────────┐
│                    Your Domain                              │
│                  yourdomain.com                             │
└──────────────────┬──────────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
   ┌────▼──────┐         ┌────▼───────────┐
   │  Vercel   │         │    Railway     │
   ├───────────┤         ├────────────────┤
   │ Website   │         │ Backend        │
   │ React App │         │ Node.js Server │
   │ $0/mo     │         │ Emails         │
   │           │         │ $5+/mo         │
   └───────────┘         └────────────────┘
```

---

## 📋 Step-by-Step Deployment

### Phase 1: Deploy Backend to Railway (First)

#### 1. Create Railway Account

- Go to https://railway.app
- Sign up with GitHub

#### 2. Create New Project

- Click "Create"
- Select "Deploy from GitHub"
- Connect your repo (Travelers)

#### 3. Configure Variables

In Railway Dashboard > Variables:

```
SMTP_HOST=mail.abctravels.site
SMTP_PORT=587
SMTP_USER=test@abctravels.site
SMTP_PASSWORD=your_password
SUPABASE_SERVICE_ROLE_KEY=your_key
VITE_SUPABASE_URL=https://ynqceffvnagwrbchnyls.supabase.co
PORT=3000
```

#### 4. Set Root Directory

- Settings > Root Directory
- Set to: `backend/`

#### 5. Deploy

- Railway auto-deploys
- Get your URL: `your-backend.up.railway.app`
- Test: Visit `https://your-backend.up.railway.app/api/health`

---

### Phase 2: Deploy Website to Vercel (Second)

#### 1. Create Vercel Account

- Go to https://vercel.com
- Sign up with GitHub

#### 2. Import Project

- Click "Import Project"
- Select your Travelers repo
- Choose "Other"

#### 3. Configure Build

- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Root Directory: `website/`

#### 4. Set Environment Variables

In Vercel Project Settings > Environment Variables:

```
VITE_SUPABASE_URL=https://ynqceffvnagwrbchnyls.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_BASE_URL=https://your-backend.up.railway.app
```

#### 5. Deploy

- Click "Deploy"
- Get your URL: `your-project.vercel.app`
- Test the website

---

## ✅ Verify Everything Works

### Test Backend

```bash
# Health check
curl https://your-backend.up.railway.app/api/health

# Should return:
# {"status":"ok","timestamp":"2024-10-24T...","uptime":123.45}
```

### Test Website

- Visit: https://your-project.vercel.app
- Create a booking
- Check email inbox (should arrive in 30 seconds)

### Test Email Service

- Go to your Supabase dashboard
- Check `email_history` table
- Status should be "sent"

---

## 🔄 Continuous Deployment

Now everything auto-deploys!

```
You push to GitHub
    ↓
Railway detects change
    ↓
Backend rebuilds & deploys
    ↓
Vercel detects change
    ↓
Website rebuilds & deploys
    ↓
Done! 🎉
```

No manual deployment needed anymore!

---

## 🐛 Troubleshooting

### Website Can't Connect to Backend

- Check `VITE_API_BASE_URL` in Vercel
- Should be: `https://your-backend.up.railway.app`
- Verify backend is running: test `/api/health` endpoint

### Emails Not Sending

- Check Railway logs: `railway logs`
- Verify SMTP credentials
- Check `email_history` table status
- Test SMTP connection

### 404 Errors on Website Pages

- Vercel needs `vercel.json` with SPA redirect
- Should rewrite all routes to `index.html`

---

## 📱 Folder Separation Benefits

✅ **Independent Deployment**

- Update website without touching backend
- Update backend without redeploying website

✅ **Easy Maintenance**

- Clear separation of concerns
- Each folder is its own project

✅ **Scalability**

- Website can scale on Vercel
- Backend can scale on Railway independently

✅ **Cost Control**

- Vercel: Free tier available
- Railway: $5/month starting

✅ **Easy Switching**

- Want to move website? Just redeploy
- Want different email provider? Update backend

---

## 🎯 Final URLs

After deployment:

| Service       | URL                                   | Status          |
| ------------- | ------------------------------------- | --------------- |
| Website       | `https://your-project.vercel.app`     | ✅ Live         |
| Backend API   | `https://your-backend.up.railway.app` | ✅ Live         |
| Email Service | `https://your-backend.up.railway.app` | ✅ Auto-running |
| Supabase DB   | `https://supabase.co`                 | ✅ Connected    |

---

## 📝 Git Workflow

```bash
# Work locally
npm start

# Push to GitHub
git add .
git commit -m "Update website"
git push origin main

# Auto-deploys to:
# - Vercel (website folder)
# - Railway (backend folder)
```

---

## 🚨 Important Notes

1. **Don't commit `.env`** - Already in `.gitignore` ✓
2. **Use environment variables** - For production credentials
3. **Keep both folders in same repo** - Easy to manage
4. **Test locally first** - Before pushing to main

---

## ✨ You're Done!

Your app now has:

- ✅ Professional separation of concerns
- ✅ Independent scaling
- ✅ Easy deployment
- ✅ Zero-downtime updates
- ✅ Production-ready architecture

**Congratulations! 🎉**
