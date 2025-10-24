# 🚀 Quick Start - Email Sender Service

## In 5 Minutes: Send Your First Email

### Step 1: Install Dependencies (1 minute)

```bash
npm install nodemailer @supabase/supabase-js
```

### Step 2: Create `.env` File (1 minute)

Create file `.env` in your project root:

```
VITE_SUPABASE_URL=https://ynqceffvnagwrbchnyls.supabase.co
SUPABASE_SERVICE_ROLE_KEY=paste_your_service_role_key_here
SMTP_HOST=mail.abctravels.site
SMTP_PORT=587
SMTP_USER=your_email@abctravels.site
SMTP_PASSWORD=your_email_password
SMTP_FROM=noreply@abctravels.site
```

**Where to get Service Role Key:**

- Go to Supabase Dashboard → Project Settings → API
- Copy "Service role key" (⚠️ NOT the anon key)

### Step 3: Test Connection (1 minute)

```bash
node email-sender.js
```

Should output:

```
✅ SMTP connection verified
🔍 Fetching pending emails...
```

### Step 4: Create a Test Booking (1 minute)

1. Open website
2. Book any package with your email
3. Submit booking

### Step 5: Send the Email (1 minute)

```bash
node email-sender.js
```

You should see:

```
📮 Sending email to your_email@example.com...
✅ Email sent: <message_id>
```

**Check your email inbox - you got the booking confirmation! 🎉**

---

## Keep It Running 24/7

### Option A: Simple (Development)

```bash
node email-sender.js
```

Keeps running, processes emails every 30 seconds.

Press `Ctrl+C` to stop.

### Option B: PM2 (Production) - Recommended

```bash
# Install PM2
npm install -g pm2

# Start service
pm2 start email-sender.js --name "email-sender"

# Make it start on reboot
pm2 startup
pm2 save

# View status
pm2 status
```

### Option C: Windows Task Scheduler

1. Create batch file `email-sender.bat`:

```batch
node C:\Users\spike\OneDrive\Documents\Travelers\email-sender.js
```

2. Open Task Scheduler → Create Basic Task
3. Set to run `email-sender.bat` every 5 minutes
4. Set "Run whether user is logged in or not"

---

## Verify It's Working

### Method 1: Check Email History Table

```sql
SELECT * FROM email_history
WHERE status = 'sent'
ORDER BY sent_at DESC
LIMIT 5;
```

You should see emails with:

- status: 'sent'
- sent_at: timestamp
- message_id: email confirmation

### Method 2: Check Email Inbox

Emails arrive in customer inbox immediately after service processes them.

---

## Troubleshooting

| Issue                     | Solution                                          |
| ------------------------- | ------------------------------------------------- |
| "Invalid login" error     | Check SMTP username/password in .env              |
| "Connection timeout"      | Try SMTP_PORT=465 instead of 587                  |
| Emails stuck as "pending" | Run `node email-sender.js` manually to see errors |
| Service won't start       | Make sure `npm install` was run first             |

---

## That's It! ✅

Your email system is now:

- ✅ Saving emails to database when bookings created
- ✅ Saving emails to database when admin updates status
- ✅ Actually sending emails via SMTP
- ✅ Tracking sent/failed status
- ✅ Running 24/7

**Customers will now receive:**

1. Booking confirmation immediately after booking
2. Status update when admin confirms/declines
3. Beautiful HTML formatted emails

---

## What's Next?

- Monitor `email_history` table for delivery status
- Setup PM2 for automatic restarts
- Add email notifications to admin when sending fails
- Setup email templates in database (optional)

**Your email system is now FULLY FUNCTIONAL! 🎉**
