# 🎯 AUTOMATIC EMAIL DEPLOYMENT - MASTER GUIDE

## WHAT YOU NOW HAVE

Your travel booking website can now **automatically send emails** when deployed to production.

```
Website Upload
   ↓
npm start (automatic)
   ↓
Website + Email Service running forever
```

---

## 🚀 QUICK START (5 STEPS)

### 1️⃣ Create .env File

```bash
Copy-Item .env.example .env
```

Then edit `.env`:

```env
SMTP_USER=your_email@abctravels.site
SMTP_PASSWORD=your_password
SUPABASE_SERVICE_ROLE_KEY=your_key_from_supabase
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Test Locally

```bash
npm run build
npm start
```

Visit: http://localhost:3000

### 4️⃣ Test Booking

- Create test booking
- Check email inbox (arrives in 1-5 min)
- Email status visible in database

### 5️⃣ Deploy

Choose one:

- **Heroku**: `git push heroku main`
- **Railway**: Connect GitHub repo
- **Your Server**: Upload + run `npm start`

---

## 📊 WHAT'S IMPLEMENTED

### Code Changes (Automatic Email)

- ✅ `server.js` - Express server + email service starter
- ✅ `email-sender.js` - SMTP email sending service
- ✅ `start-email-service.js` - Service launcher with auto-restart
- ✅ `Procfile` - Production deployment configuration
- ✅ `package.json` - Updated with npm scripts + dependencies

### Frontend Integration (Already Done)

- ✅ `src/lib/emailService.ts` - Email queuing functions
- ✅ `src/pages/PackageDetailPage.tsx` - Booking emails
- ✅ `src/admin/bookings/BookingsPage.tsx` - Status update emails

### Configuration

- ✅ `express` added to dependencies
- ✅ `nodemailer` added to dependencies
- ✅ `@supabase/supabase-js` added to dependencies
- ✅ `npm run start` now runs: build + server + email service

---

## 🔄 HOW IT WORKS

### In Development

```bash
npm run dev                # Website only (Vite dev server)
npm run email:start        # Start email service separately
```

### In Production (After Upload)

```bash
npm start
```

This automatically:

1. Builds React app to `dist/`
2. Starts Express server on port 3000
3. Starts email service as background process
4. Website + emails run 24/7

### Email Flow

```
User books
   ↓
Frontend calls: sendBookingConfirmationEmail()
   ↓
Email saved to database: INSERT INTO email_history (status='pending')
   ↓
Email service checks database every 30 seconds
   ↓
Service finds pending email
   ↓
Service sends via SMTP: nodemailer.sendMail()
   ↓
Database updated: UPDATE email_history SET status='sent'
   ↓
Customer receives email ✅
```

---

## 🌐 DEPLOYMENT OPTIONS

### OPTION 1: Heroku (Easiest)

```bash
heroku login
heroku create your-app-name

# Set environment variables
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

Website + emails running automatically on heroku ✅

### OPTION 2: Railway.app (Modern)

1. Go to railway.app
2. Connect GitHub repo
3. Add environment variables
4. Deploy (automatic)

### OPTION 3: VPS / Your Own Server

```bash
ssh user@server.com
git clone your-repo
cd your-repo
npm install
# Create .env with credentials
npm start
# Or: pm2 start server.js
```

---

## ✅ VERIFY IT WORKS

### Local Testing

```bash
npm run build          # Should succeed
npm start              # Should show:
# "🌐 Website server running on http://localhost:3000"
# "📧 Starting email service..."
# "✅ Email service started"

# Then visit:
http://localhost:3000/api/health      # Should return {"status":"ok",...}
http://localhost:3000/api/email-status # Should return {"status":"running"}
```

### Production Testing

```bash
# Website loads
curl https://your-domain.com

# Email service running
curl https://your-domain.com/api/email-status
# Should show: {"status":"running"}

# Create booking
# Should receive email in 1-5 minutes
```

---

## 📁 FILES CREATED/MODIFIED

### Created (New)

- `server.js` (150 lines) - Production Express server
- `email-sender.js` (200 lines) - Email sending service
- `start-email-service.js` (100 lines) - Service launcher
- `start-email-service.bat` - Windows batch launcher
- `start-email-service.ps1` - PowerShell launcher
- `Procfile` - Heroku/Railway deployment config
- `.env.example` - Configuration template
- Multiple markdown guides

### Modified

- `package.json`
  - Added: `"start"` script
  - Added: `"start:prod"` script
  - Added: `express` dependency
  - Added: `nodemailer` dependency

### Existing (Unchanged)

- All React components work as before
- No breaking changes to frontend
- Build process unchanged
- Database schema unchanged

---

## 🔐 ENVIRONMENT VARIABLES (Production)

Set these on your hosting platform:

```env
# Required: Supabase
VITE_SUPABASE_URL=https://ynqceffvnagwrbchnyls.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_from_supabase

# Required: SMTP (Email Sending)
SMTP_HOST=mail.abctravels.site
SMTP_PORT=587
SMTP_USER=your_email@abctravels.site
SMTP_PASSWORD=your_email_password
SMTP_FROM=noreply@abctravels.site

# Optional: Server Port
PORT=3000
NODE_ENV=production
```

---

## 🎯 npm Scripts Reference

```bash
# Development
npm run dev               # Start Vite dev server (localhost:5173)

# Build
npm run build             # Build React app to dist/
npm run type-check        # Check TypeScript
npm run lint              # Run ESLint

# Production
npm start                 # Build + start server + email service
npm run start:prod        # Start server only (if already built)

# Email Service
npm run email:send        # Send emails once and exit
npm run email:start       # Start service with auto-restart
npm run email:daemon      # Start with PM2 (production)

# Database
npm run seed              # Seed database
npm run seed:reset        # Reset and seed
npm run seed:fresh        # Fresh seed
```

---

## 📈 WHAT RUNS AUTOMATICALLY

### Express Server

- Listens on PORT 3000
- Serves React app from `dist/`
- Serves static files
- Provides health check endpoints
- Handles requests 24/7

### Email Service

- Runs as child process (background)
- Queries database every 30 seconds
- Sends pending emails
- Updates status in database
- Auto-restarts if crashes
- Handles graceful shutdown

### Both Together

- One `npm start` command starts everything
- Both run forever until server stops
- If email service crashes, automatically restarts
- Ctrl+C stops both gracefully

---

## 🆘 TROUBLESHOOTING

### Website won't start

```bash
# Issue: Module not found
npm install

# Issue: Port in use
PORT=8080 npm start

# Issue: Build failed
npm run type-check        # Check TypeScript errors
npm run lint              # Check ESLint errors
```

### Email service won't start

```bash
# Issue: .env not found
# Create .env with your credentials

# Issue: SMTP connection failed
# Check SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD

# Issue: Database error
# Check SUPABASE_SERVICE_ROLE_KEY is correct
```

### Emails not sending

```sql
-- Check pending emails
SELECT COUNT(*) FROM email_history WHERE status='pending';

-- Check failed emails
SELECT * FROM email_history WHERE status='failed' LIMIT 5;

-- Monitor service output
# On local: Watch npm start console
# On Heroku: heroku logs -t
# On server: pm2 logs
```

---

## 📋 DEPLOYMENT CHECKLIST

### Before Upload

- [ ] `.env` created with all credentials
- [ ] `npm install` completed
- [ ] `npm run build` succeeds (0 errors)
- [ ] `npm start` works locally
- [ ] Test booking creates email
- [ ] Email arrives in inbox
- [ ] All files committed to git

### After Upload

- [ ] Website loads at your domain
- [ ] Email service endpoint shows "running"
- [ ] Create test booking
- [ ] Email arrives
- [ ] Check server logs for errors
- [ ] Monitor for 24 hours

### Ongoing

- [ ] Check pending email count daily
- [ ] Monitor for failed emails weekly
- [ ] Keep backups of credentials
- [ ] Test monthly

---

## 🎉 FINAL RESULT

When deployed:

✅ Website loads instantly  
✅ Users can book packages  
✅ Emails queue automatically  
✅ Emails send every 30 seconds  
✅ Database tracks all emails  
✅ Auto-restart on crash  
✅ Runs 24/7 forever  
✅ No manual intervention needed

**All you did was upload the code!** 🚀

---

## 📚 DOCUMENTATION

| Document                                    | For                             |
| ------------------------------------------- | ------------------------------- |
| `COMPLETE_SETUP_GUIDE.md`                   | Step-by-step setup instructions |
| `DEPLOY_NOW.md`                             | Quick deployment reference      |
| `PRODUCTION_DEPLOYMENT_WITH_AUTO_EMAILS.md` | Detailed architecture           |
| `AUTO_EMAIL_SETUP.md`                       | Local auto-start guide          |
| `CODE_ADDED_FOR_AUTO_EMAILS.md`             | Code overview                   |
| `IMPLEMENTATION_COMPLETE.md`                | Implementation summary          |

---

## 🎯 NEXT ACTIONS

1. **Create .env** with your credentials
2. **Run `npm install`** to add dependencies
3. **Test locally** with `npm start`
4. **Deploy** to Heroku/Railway/Your server
5. **Verify** website + emails working

**That's it! You're done!** 🎉

---

**Status:** ✅ **COMPLETE - PRODUCTION READY**  
**Next:** Deploy and watch emails send automatically 🚀
