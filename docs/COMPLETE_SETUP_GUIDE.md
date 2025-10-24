# 🎯 COMPLETE SETUP - DO THIS NOW

## ✅ What's Already Done

- ✅ `email-sender.js` - Sends emails
- ✅ `server.js` - Runs website + emails
- ✅ `start-email-service.js` - Local auto-start
- ✅ `start-email-service.bat` - Windows launcher
- ✅ `start-email-service.ps1` - PowerShell launcher
- ✅ `Procfile` - Production deployment config
- ✅ `package.json` - Updated with all scripts
- ✅ `src/lib/emailService.ts` - Email queuing
- ✅ Integration in `PackageDetailPage.tsx` - Booking emails
- ✅ Integration in `BookingsPage.tsx` - Status update emails

---

## 🚀 WHAT YOU NEED TO DO

### STEP 1: Create .env File

```bash
Copy-Item .env.example .env
```

Edit `.env` and fill in:

```
SMTP_USER=your_email@abctravels.site
SMTP_PASSWORD=your_password
SUPABASE_SERVICE_ROLE_KEY=your_key_from_supabase
```

### STEP 2: Install Dependencies

```bash
npm install
```

This adds:

- `express` - Web server
- `nodemailer` - Email sending
- `@supabase/supabase-js` - Database
- `dotenv` - Environment variables

### STEP 3: Test Locally

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

Then:

1. Visit http://localhost:3000
2. Create test booking
3. Check email inbox (should arrive in 1-5 min)

### STEP 4: Commit & Push

```bash
git add .
git commit -m "Add production deployment with auto-emails"
git push origin main
```

### STEP 5: Deploy to Production

**Choose ONE:**

#### HEROKU

```bash
heroku create your-app-name
heroku config:set VITE_SUPABASE_URL=...
heroku config:set SUPABASE_SERVICE_ROLE_KEY=...
heroku config:set SMTP_HOST=mail.abctravels.site
heroku config:set SMTP_PORT=587
heroku config:set SMTP_USER=your_email@abctravels.site
heroku config:set SMTP_PASSWORD=your_password
heroku config:set SMTP_FROM=noreply@abctravels.site
git push heroku main
```

#### RAILWAY.APP

1. Connect GitHub repo at railway.app
2. Add env variables
3. Deploy (auto)

#### YOUR SERVER

```bash
ssh user@server.com
git clone repo && cd repo
npm install
# Create .env
npm start
```

---

## ✨ WHAT HAPPENS AFTER DEPLOYMENT

```
Website uploads
   ↓
npm start runs automatically
   ↓
Website loads at your-domain.com
   ↓
Email service starts in background
   ↓
User creates booking
   ↓
Email saved to database (instant)
   ↓
Service sends email (within 30 seconds)
   ↓
Customer receives confirmation
   ↓
Repeat forever ✅
```

---

## 📊 Files You're Uploading

```
Your Website
├── src/              (React code)
├── dist/             (Built website)
├── server.js         ← New (serves website + emails)
├── email-sender.js   ← New (sends emails)
├── Procfile          ← New (deployment config)
├── .env              ← Create this with your credentials
├── package.json      ← Updated
└── ...other files
```

---

## 🔍 Verify After Deployment

```bash
# Website loads
curl https://your-domain.com

# Email service running
curl https://your-domain.com/api/email-status
# Should show: {"status":"running"}

# Check server logs
heroku logs -t
# OR on your server:
pm2 logs
```

---

## 🆘 Common Issues

| Issue                           | Fix                            |
| ------------------------------- | ------------------------------ |
| "❌ Cannot find .env"           | Create .env with credentials   |
| "❌ Cannot find module express" | Run: npm install               |
| "❌ Website won't load"         | Check server logs              |
| "❌ Emails not sending"         | Check SMTP credentials in .env |
| "❌ Port already in use"        | Change PORT in .env            |

---

## 📝 Time Estimate

- Setup .env: 2 minutes
- Test locally: 5 minutes
- Deploy: 5 minutes
- **Total: 12 minutes** ⏱️

---

## 🎉 Result

After deployment:

✅ Website running at your-domain.com  
✅ Emails sending automatically  
✅ No manual steps needed  
✅ Runs 24/7 forever

**Congratulations! You're done!** 🚀

---

## 📞 Quick Reference

```bash
# Local development
npm run dev                  # Website only
npm run email:start          # Start email service separately

# Local production test
npm run build
npm start                    # Website + emails

# Production startup
npm run start:prod           # Start server only (if already built)

# Check email status
curl http://localhost:3000/api/email-status

# Check health
curl http://localhost:3000/api/health
```

---

## 🎯 Next Steps

1. **Create .env** with your credentials
2. **Run `npm install`** to add dependencies
3. **Test with `npm start`** locally
4. **Deploy** to Heroku/Railway/Your server
5. **Verify** website + emails working

**That's all you need to do!** Everything else is automatic. 🎉
