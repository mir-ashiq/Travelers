# 🚀 AUTOMATIC EMAIL SENDING ON DEPLOYMENT

## What This Does

When you upload your website to production, **emails will automatically send** without any additional setup:

```
Upload Website
   ↓
npm start (automatic)
   ↓
Build React app
   ↓
Start Express server (website)
   ↓
Start email service (background)
   ↓
Website + Emails running 24/7 ✅
```

---

## 📋 Requirements

Before deployment, make sure you have:

1. ✅ `.env` file with SMTP credentials
2. ✅ `email-sender.js` in project root
3. ✅ `server.js` in project root
4. ✅ All dependencies installed: `npm install`

---

## 🚀 Local Testing (Before Uploading)

### Test it works locally:

```powershell
# Build the app
npm run build

# Start the app (like production)
npm start
```

**Expected output:**

```
🌐 Website server running on http://localhost:3000
📂 Serving files from: dist
📧 Starting email service...
✅ Email service started (background process)
```

Then:

1. Visit http://localhost:3000
2. Create a test booking
3. Email should arrive in 1-5 minutes

---

## 🌐 Deployment Options

### Option 1: Heroku (Recommended - Free Tier Available)

**Setup:**

```bash
# Install Heroku CLI
# Then:
heroku login
heroku create your-app-name
heroku config:set VITE_SUPABASE_URL=https://...
heroku config:set SUPABASE_SERVICE_ROLE_KEY=your_key
heroku config:set SMTP_HOST=mail.abctravels.site
heroku config:set SMTP_PORT=587
heroku config:set SMTP_USER=your_email@abctravels.site
heroku config:set SMTP_PASSWORD=your_password
heroku config:set SMTP_FROM=noreply@abctravels.site

# Deploy
git push heroku main
```

**Note:** Procfile already configured - no changes needed

---

### Option 2: Railway.app (Modern Alternative)

**Setup:**

1. Connect GitHub repo at railway.app
2. Set environment variables in Railway dashboard:

   - VITE_SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY
   - SMTP_HOST
   - SMTP_PORT
   - SMTP_USER
   - SMTP_PASSWORD
   - SMTP_FROM

3. Railway auto-detects and runs Procfile

---

### Option 3: Your Own Server (VPS/Dedicated)

**Setup:**

```bash
# SSH into server
ssh user@your-server.com

# Clone repo
git clone your-repo-url
cd your-repo

# Install dependencies
npm install

# Create .env with credentials
nano .env

# Start production server
npm start
# Or with PM2:
pm2 start server.js --name "travel-agency"
pm2 startup
pm2 save
```

---

### Option 4: Docker (Cloud-Ready)

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Deploy to:

- Docker Hub
- AWS ECS
- Google Cloud Run
- Azure Container Instances

---

## ⚙️ Environment Variables (Production)

Must set these on your hosting platform:

```env
# Supabase
VITE_SUPABASE_URL=https://ynqceffvnagwrbchnyls.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# SMTP (Email Sending)
SMTP_HOST=mail.abctravels.site
SMTP_PORT=587
SMTP_USER=your_email@abctravels.site
SMTP_PASSWORD=your_email_password
SMTP_FROM=noreply@abctravels.site

# Server
NODE_ENV=production
PORT=3000
```

---

## 📊 System Architecture (Production)

```
┌─────────────────────────────────────┐
│     npm start (or server startup)   │
└──────────────┬──────────────────────┘
               │
       ┌───────┴───────┐
       │               │
       ↓               ↓
   ┌─────────┐   ┌──────────────┐
   │ Express │   │ Email Sender │
   │ Server  │   │   Service    │
   │ Port    │   │ (Background) │
   │ 3000    │   │ Every 30s    │
   └────┬────┘   └──────┬───────┘
        │               │
        ↓               ↓
   Website UP    Checks DB for
   at port 3000  pending emails
                       │
                       ↓
                  Sends via SMTP
                       │
                       ↓
                  Updates DB
                  status='sent'
```

---

## ✅ Deployment Checklist

### Before Uploading:

- [ ] `.env` file created with all credentials
- [ ] `npm run build` succeeds (0 errors)
- [ ] `npm start` works locally
- [ ] Test booking creates email
- [ ] Email arrives in inbox
- [ ] All files committed to git

### After Upload:

- [ ] Website loads on production URL
- [ ] Create test booking
- [ ] Check email arrives
- [ ] Monitor server logs for errors
- [ ] Verify email service running

### Ongoing:

- [ ] Check server logs daily
- [ ] Monitor pending emails in database
- [ ] Set up alerts for failed emails (optional)
- [ ] Keep backups of .env file (secure)

---

## 🧪 Testing in Production

After deployment:

### 1. Website Works

```
Visit: https://your-domain.com
Should see: JKLG Travel Agency website
```

### 2. Email Service Running

```
Visit: https://your-domain.com/api/email-status
Should see: {"status":"running","timestamp":"..."}
```

### 3. Health Check

```
Visit: https://your-domain.com/api/health
Should see: {"status":"ok","uptime":...}
```

### 4. Test Email

```
1. Go to package page
2. Create test booking
3. Check inbox after 1-5 minutes
4. Should receive booking confirmation
```

### 5. Check Database

```sql
-- Should see your test booking
SELECT * FROM bookings ORDER BY created_at DESC LIMIT 1;

-- Should see sent emails
SELECT * FROM email_history WHERE status='sent' ORDER BY sent_at DESC LIMIT 1;
```

---

## 🆘 Troubleshooting

### Website won't start

**Error:** `Cannot find module 'express'`

```bash
# Fix: Install dependencies
npm install
```

**Error:** `Port 3000 already in use`

```bash
# Fix: Use different port
PORT=8080 npm start
```

### Email service won't start

**Error:** `.env file not found`

```bash
# Fix: Create .env with credentials on server
# Then restart:
npm start
```

**Error:** `Email service exited with code 1`

```bash
# Check: SMTP credentials correct?
# Check: Supabase Service Role Key correct?
# View logs to see exact error
```

### Emails not sending

```sql
-- Check for pending emails
SELECT COUNT(*) FROM email_history WHERE status='pending';

-- Check for failed emails
SELECT * FROM email_history WHERE status='failed' LIMIT 10;

-- Monitor in real-time (on server)
tail -f /path/to/app/server.log
```

---

## 📝 How It Works

### Start Command

```bash
npm start
```

Runs:

1. `npm run build` → Compiles React app to `dist/`
2. `node server.js` → Starts Express server

### Express Server (server.js)

- Serves website from `dist/` folder
- Listens on PORT 3000
- Provides `/api/health` endpoint
- Provides `/api/email-status` endpoint

### Email Service (spawned by server.js)

- Runs as child process
- Reads pending emails every 30 seconds
- Sends via SMTP
- Auto-restarts if it crashes
- Stops when server stops

---

## 🔐 Security Notes

### Keep .env Secure

- Never commit .env to git
- Use `.gitignore` to exclude it
- Set env vars on hosting platform instead
- Rotate credentials periodically

### SMTP Credentials

- Use app-specific password if available
- Don't use your main email password
- Consider dedicated email account for notifications
- Monitor email logs for suspicious activity

### Database Access

- Service Role Key should be server-side only
- Never expose in frontend code
- Rotate keys periodically
- Enable RLS (Row Level Security) policies

---

## 📈 Monitoring

### Command Line (if SSH access)

```bash
# View logs
tail -f server.log

# Check process status
ps aux | grep "node server.js"

# Check email service
curl http://localhost:3000/api/email-status
```

### Dashboard Monitoring

- Heroku Dashboard → Logs
- Railway.app → Logs
- Cloud Provider → CloudWatch/Logs

### Email Monitoring

```sql
-- Daily summary
SELECT DATE(created_at), status, COUNT(*)
FROM email_history
GROUP BY DATE(created_at), status
ORDER BY DATE(created_at) DESC;

-- Failed emails
SELECT * FROM email_history
WHERE status='failed'
ORDER BY created_at DESC;
```

---

## 🎯 Final Steps

### 1. Local Verification (Before Upload)

```bash
npm run build
npm start
```

Test booking + email locally ✅

### 2. Deploy

- Heroku: `git push heroku main`
- Railway: Connect GitHub repo
- VPS: `git push` to server
- Docker: Build and deploy image

### 3. Post-Deployment

- Test website loads
- Test booking + email
- Check server logs
- Monitor for 24 hours

### 4. Production Ready

- Website running ✅
- Emails sending ✅
- Auto-restart on crash ✅
- Monitoring in place ✅

---

## 📞 Summary

**When you deploy:**

1. Website starts automatically
2. Email service starts automatically
3. Bookings create emails
4. Emails send automatically
5. Everything runs 24/7

**No manual intervention needed!** 🎉

Just:

1. Set environment variables on hosting platform
2. Deploy code
3. Emails send automatically

---

**Status:** ✅ READY FOR PRODUCTION DEPLOYMENT  
**Next Step:** Deploy to production  
**Expected Result:** Website + Auto-emails running 24/7
