# ⚡ AUTO-EMAILS RUNNING NOW - 5 MINUTE SETUP

## What You Have

✅ **Email code is written and integrated**
✅ **Automatic email sending configured**
✅ **All you need to do: 3 simple steps**

---

## 🚀 SETUP (Copy-Paste Instructions)

### Step 1: Create .env file with credentials

```powershell
Copy-Item .env.example .env
```

Then edit `.env` and add your SMTP credentials:

```
SMTP_USER=your_email@abctravels.site
SMTP_PASSWORD=your_password
SUPABASE_SERVICE_ROLE_KEY=paste_from_supabase_dashboard
```

### Step 2: Install dependencies

```powershell
npm install nodemailer @supabase/supabase-js
```

### Step 3: Start automatic email service

```powershell
npm run email:start
```

**That's it! Emails will now send automatically forever.** 🎉

---

## ✅ Test It Works

1. Go to package page and create test booking
2. Console shows: "Booking created successfully with ID: X"
3. Check email inbox - should arrive in 1-5 minutes
4. Service runs continuously, processing emails every 30 seconds

---

## 🔄 Keep Running 24/7

### Option 1: PM2 (Auto-restart on crash)

```powershell
npm install -g pm2
pm2 start email-sender.js --name email-sender
pm2 startup
pm2 save
```

### Option 2: Windows Task Scheduler (Auto-start on reboot)

See: `AUTO_EMAIL_SETUP.md` → "Keep Running 24/7" section

---

## 📧 What Happens Now

**When user books:**

- ✅ Email queued to database instantly
- ✅ Service sends within 30 seconds
- ✅ Customer receives confirmation email

**When admin confirms:**

- ✅ Email queued to database instantly
- ✅ Service sends within 30 seconds
- ✅ Customer receives status update email

**Every 30 seconds:**

- Service checks for pending emails
- Sends all pending emails
- Updates database with status (sent/failed)

---

## 🆘 Issues?

| Issue                    | Fix                                |
| ------------------------ | ---------------------------------- |
| "❌ .env not found"      | Run: `Copy-Item .env.example .env` |
| "No pending emails"      | Create test booking first          |
| "SMTP connection failed" | Check SMTP credentials in .env     |
| "Service crashes"        | Check console output for error     |

---

## 📊 Verify It Works

```sql
-- Check pending emails (should be 0)
SELECT COUNT(*) FROM email_history WHERE status='pending';

-- Check sent emails
SELECT COUNT(*) FROM email_history WHERE status='sent';

-- View recent sent emails
SELECT recipient_email, subject, sent_at
FROM email_history
WHERE status='sent'
ORDER BY sent_at DESC
LIMIT 5;
```

---

## 🎯 Three Ways to Run

```bash
npm run email:start     # ← Best: Auto-restart on crash
npm run email:send      # ← One-time: Process once and exit
npm run email:daemon    # ← PM2: Production grade
```

---

**Status:** ✅ READY TO DEPLOY  
**Time to first email:** 5 minutes  
**Next action:** Copy .env.example → .env and add your credentials

**Let's go! 🚀**
