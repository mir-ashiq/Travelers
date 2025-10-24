# 🚀 AUTO EMAIL SENDING - SETUP GUIDE

## What's Implemented

Your email system now **automatically sends emails** without manual intervention:

- ✅ User books package → Email queued automatically
- ✅ Admin confirms booking → Email sent automatically
- ✅ Admin cancels booking → Email sent automatically
- ✅ Bulk status updates → All emails sent automatically

---

## How It Works

```
User Action (Book/Update)
   ↓
Frontend queues email to database
   ↓
email-sender.js processes queue every 30 seconds
   ↓
Emails sent via SMTP automatically
   ↓
Database updated with sent/failed status
   ↓
Customer receives email in inbox
```

---

## 🚀 3-Minute Setup

### Step 1: Copy .env.example to .env

```powershell
Copy-Item .env.example .env
```

### Step 2: Edit .env with your credentials

Open `.env` and fill in:

```
SMTP_USER=your_email@abctravels.site
SMTP_PASSWORD=your_password
SUPABASE_SERVICE_ROLE_KEY=your_key_from_supabase
```

### Step 3: Install Dependencies

```powershell
npm install nodemailer @supabase/supabase-js
```

### Step 4: Start Email Service

Choose ONE:

**Option A: Using npm script (Recommended)**

```powershell
npm run email:start
```

**Option B: Using batch file (Windows)**

```powershell
.\start-email-service.bat
```

**Option C: Using PowerShell script**

```powershell
.\start-email-service.ps1
```

**Option D: Direct command**

```powershell
node start-email-service.js
```

---

## ✅ Verify It's Working

1. **Create a test booking**

   - Go to package page
   - Fill form and submit
   - Check console: "Booking created successfully"

2. **Check email queue**

   ```sql
   SELECT COUNT(*) FROM email_history WHERE status='pending';
   ```

3. **Service processes email**

   - Service runs every 30 seconds
   - Console shows: "Processing pending emails..."
   - Console shows: "Email sent: [message_id]"

4. **Verify email sent**

   ```sql
   SELECT status, sent_at FROM email_history WHERE id=1;
   ```

   - status should be: `sent`
   - sent_at should have timestamp

5. **Check inbox**
   - Email should arrive within 1-5 minutes

---

## 🔄 Keep Running 24/7

### Option 1: PM2 (Production - Auto-Restart)

```powershell
npm install -g pm2
npm run email:daemon
# Or directly:
pm2 start email-sender.js --name email-sender
pm2 startup
pm2 save
```

View logs:

```powershell
pm2 logs email-sender
```

### Option 2: Windows Task Scheduler (Auto-Start on Reboot)

1. Open Task Scheduler
2. Create Basic Task: "Email Sender"
3. Trigger: "At startup"
4. Action: "Start a program"
   - Program: `C:\path\to\node.exe`
   - Arguments: `C:\path\to\email-sender.js`
5. Advanced: ☑ "Run with highest privileges"

### Option 3: Keep Terminal Open (Development)

```powershell
npm run email:start
```

Service runs continuously until you close the terminal

---

## 📧 Testing All Email Flows

### Test 1: Booking Confirmation

```
1. Package detail page
2. Fill form: name, email, date
3. Click "Book Now"
4. Check email inbox
5. Email should arrive within 1-5 minutes
```

### Test 2: Admin Status Confirmation

```
1. Admin → Bookings
2. Select booking
3. Change status to "Confirmed"
4. Check email inbox
5. Email should arrive within 1-5 minutes
```

### Test 3: Admin Bulk Update

```
1. Admin → Bookings
2. Select 3-5 bookings
3. Change all to "Confirmed"
4. Check all customer emails
5. All should receive emails
```

---

## 🆘 Troubleshooting

### Emails not sending?

1. **Is service running?**

   ```powershell
   npm run email:start
   ```

2. **Check .env file**

   - Must exist in project root
   - Must have SMTP credentials filled in
   - Must have SUPABASE_SERVICE_ROLE_KEY filled in

3. **Check dependencies**

   ```powershell
   npm install nodemailer @supabase/supabase-js
   ```

4. **Check pending emails**

   ```sql
   SELECT * FROM email_history WHERE status='pending';
   ```

   - If empty: No emails queued (create test booking)
   - If full: Service not processing (check service is running)

5. **Check failed emails**
   ```sql
   SELECT * FROM email_history WHERE status='failed';
   ```
   - View error_message column for details

### SMTP connection error?

- Verify SMTP_HOST = `mail.abctravels.site`
- Verify SMTP_PORT = `587` (not 25, 465, or 2525)
- Verify SMTP_USER = your email address
- Verify SMTP_PASSWORD = correct password
- Check firewall allows outbound port 587

### Service crashes?

- Check console output for errors
- Run directly: `node email-sender.js` to see full error
- Common issue: Missing .env file
- Common issue: Wrong SUPABASE_SERVICE_ROLE_KEY

---

## 📊 Monitoring

### Check email statistics

```sql
-- Total sent
SELECT COUNT(*) FROM email_history WHERE status='sent';

-- Total failed
SELECT COUNT(*) FROM email_history WHERE status='failed';

-- Total pending (should be 0)
SELECT COUNT(*) FROM email_history WHERE status='pending';

-- Recent sent emails
SELECT recipient_email, subject, sent_at
FROM email_history
WHERE status='sent'
ORDER BY sent_at DESC
LIMIT 10;
```

### Check service logs (if using PM2)

```powershell
pm2 logs email-sender
pm2 status
```

---

## 📁 Files Created

| File                      | Purpose                           |
| ------------------------- | --------------------------------- |
| `email-sender.js`         | Main email sending service        |
| `start-email-service.js`  | Service starter with auto-restart |
| `start-email-service.bat` | Windows batch file launcher       |
| `start-email-service.ps1` | PowerShell launcher               |
| `.env.example`            | Configuration template            |
| `package.json`            | Updated with npm scripts          |

---

## 🎯 npm Scripts Available

```bash
npm run email:send      # Run once and exit
npm run email:start     # Start with auto-restart
npm run email:daemon    # Start with PM2 (production)
```

---

## ✨ Summary

Your email system is now **fully automated**:

1. ✅ Emails are queued when users take action
2. ✅ Service processes emails every 30 seconds
3. ✅ Emails automatically sent via SMTP
4. ✅ Status tracked in database
5. ✅ Can run 24/7 with PM2 or Task Scheduler

**All you need to do:**

1. Fill in .env with your credentials
2. Run: `npm run email:start`
3. Let it run in the background

**That's it! Emails will send automatically forever.** 🎉
