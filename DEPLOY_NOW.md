# ⚡ DEPLOY WITH AUTO-EMAILS - QUICK START

## 🎯 What Happens When You Upload

```
You upload code
   ↓
Server runs: npm start
   ↓
React app builds
   ↓
Express server starts
   ↓
Email service starts (auto)
   ↓
Website + Emails running 24/7 ✅
```

---

## 🚀 BEFORE YOU UPLOAD

### Step 1: Build & Test Locally

```bash
npm run build
npm start
```

Should see:

```
🌐 Website server running on http://localhost:3000
📧 Starting email service...
✅ Email service started
```

### Step 2: Test Booking + Email

1. Visit http://localhost:3000
2. Create test booking
3. Check email arrives in 1-5 minutes

### Step 3: Commit Code

```bash
git add .
git commit -m "Add auto-email deployment"
git push origin main
```

---

## 🌐 DEPLOYMENT (Choose One)

### HEROKU (Easiest)

```bash
# Install Heroku CLI, then:
heroku login
heroku create your-app-name

# Set environment variables
heroku config:set VITE_SUPABASE_URL=your_url
heroku config:set SUPABASE_SERVICE_ROLE_KEY=your_key
heroku config:set SMTP_HOST=mail.abctravels.site
heroku config:set SMTP_PORT=587
heroku config:set SMTP_USER=your_email@abctravels.site
heroku config:set SMTP_PASSWORD=your_password
heroku config:set SMTP_FROM=noreply@abctravels.site

# Deploy
git push heroku main
```

**That's it!** Website + emails running automatically.

---

### RAILWAY.APP (Modern)

1. Go to railway.app
2. Connect GitHub repo
3. Add environment variables
4. Deploy (automatic)

---

### VPS / YOUR OWN SERVER

```bash
# SSH to server
ssh user@your-server.com

# Clone repo
git clone your-repo-url && cd your-repo

# Install dependencies
npm install

# Create .env with credentials
nano .env

# Start
npm start

# Or with PM2 (24/7):
pm2 start server.js
pm2 startup
pm2 save
```

---

## ✅ VERIFY IT WORKS

After uploading:

1. **Website loads**

   ```
   https://your-domain.com
   ```

2. **Email service running**

   ```
   https://your-domain.com/api/email-status
   Should show: {"status":"running"}
   ```

3. **Create test booking**

   - Email should arrive in 1-5 minutes

4. **Check server logs**
   - Heroku: `heroku logs -t`
   - Server: `pm2 logs`

---

## 📁 Files Created

| File           | Purpose                   |
| -------------- | ------------------------- |
| `server.js`    | Main production server    |
| `Procfile`     | Deployment configuration  |
| `package.json` | Updated with start script |

---

## 🎯 Three Key Commands

```bash
npm run build          # Build React app
npm start              # Start website + emails (local)
npm run start:prod     # Start only server (production)
```

---

## 💻 Environment Variables

Set these on your hosting platform:

```
VITE_SUPABASE_URL=your_url
SUPABASE_SERVICE_ROLE_KEY=your_key
SMTP_HOST=mail.abctravels.site
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASSWORD=your_password
SMTP_FROM=noreply@abctravels.site
```

---

## ✨ AUTOMATIC = NO MORE MANUAL STEPS

**Before:** Upload → SSH → `npm run email:start` → Keep terminal open  
**Now:** Upload → Everything automatic 24/7 ✅

---

**Status:** ✅ READY TO DEPLOY  
**Next:** Deploy using one of the methods above  
**Result:** Website + Auto-emails running forever 🚀
