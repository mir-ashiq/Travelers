# 📧 Email Sender Service - Setup & Run Guide

## What is This?

The `email-sender.js` service reads emails from the `email_history` table and **actually sends them** via your SMTP server.

## How It Works

```
email_history table
  (status='pending')
        ↓
email-sender.js reads
        ↓
Sends via SMTP to mail.abctravels.site
        ↓
Updates status='sent' if successful
  or status='failed' if error
```

## Setup

### 1. Install Dependencies

```bash
npm install nodemailer @supabase/supabase-js
```

### 2. Get Your Service Role Key

You need the Supabase Service Role Key (not the anon key).

- Go to Supabase Dashboard
- Project Settings → API
- Copy the "Service Role Key" (the secret one, not the anon key)

### 3. Set Environment Variables

Create a `.env` file in your project root:

```
VITE_SUPABASE_URL=https://ynqceffvnagwrbchnyls.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SMTP_HOST=mail.abctravels.site
SMTP_PORT=587
SMTP_USER=your_email@abctravels.site
SMTP_PASSWORD=your_smtp_password
SMTP_FROM=noreply@abctravels.site
```

### 4. Test the Connection

```bash
node email-sender.js
```

You should see:

```
📧 Email Sender Service Starting...
SMTP Server: mail.abctravels.site:587
From: noreply@abctravels.site
🔐 Verifying SMTP connection...
✅ SMTP connection verified
🔍 Fetching pending emails...
```

## Running the Service

### Option 1: One-Time Send

```bash
node email-sender.js
```

This will:

- Send all pending emails (max 10 per run)
- Update status to 'sent' or 'failed'
- Exit

### Option 2: Continuous Service (Recommended)

```bash
node email-sender.js
```

Runs continuously, checking every 30 seconds for pending emails.

Keep it running with:

```bash
# Using PM2 (recommended for production)
pm2 start email-sender.js --name "email-sender"
pm2 save
pm2 startup

# Or using screen/tmux
screen -S email-sender
node email-sender.js
# Press Ctrl+A then D to detach
```

### Option 3: Schedule with Task Scheduler (Windows)

1. Create batch file `send-emails.bat`:

```batch
@echo off
cd C:\Users\spike\OneDrive\Documents\Travelers
node email-sender.js
```

2. Open Task Scheduler
3. Create Basic Task
4. Set to run `send-emails.bat` every 5 minutes

### Option 4: Cron Job (Mac/Linux)

Add to crontab:

```bash
*/5 * * * * cd /path/to/Travelers && node email-sender.js >> logs/email-sender.log 2>&1
```

## Monitoring

### Check Email Status in Database

```sql
-- View all pending emails
SELECT id, recipient_email, subject, status, created_at
FROM email_history
WHERE status = 'pending';

-- View sent emails
SELECT id, recipient_email, subject, status, sent_at, message_id
FROM email_history
WHERE status = 'sent';

-- View failed emails
SELECT id, recipient_email, subject, status, error_message
FROM email_history
WHERE status = 'failed';

-- View latest 10 emails
SELECT id, recipient_email, subject, status, created_at
FROM email_history
ORDER BY created_at DESC
LIMIT 10;
```

## Troubleshooting

### Connection Error: "Invalid login"

- Check SMTP credentials in `.env`
- Verify username/password are correct
- Try different ports: 587 (TLS), 465 (SSL)

### "No pending emails to send"

- Check that emails are in `email_history` table
- Verify status is 'pending':
  ```sql
  SELECT * FROM email_history WHERE status = 'pending';
  ```

### Emails not sending but no error

- Run manually to see detailed output:
  ```bash
  node email-sender.js
  ```
- Check `email_history` table for error_message

### Port 587 blocked

- Try port 465 (SSL)
- Check if ISP blocks port 587
- Use VPN if needed

## Service Output Example

```
📧 Email Sender Service Starting...
SMTP Server: mail.abctravels.site:587
From: noreply@abctravels.site
🔐 Verifying SMTP connection...
✅ SMTP connection verified
🔍 Fetching pending emails...
📬 Found 2 pending email(s)

📮 Sending email to imseldrith@gmail.com...
✅ Email sent: <ABC123@mail.abctravels.site>

📮 Sending email to customer@example.com...
✅ Email sent: <XYZ789@mail.abctravels.site>

📊 Summary: 2 sent, 0 failed

⏰ Setting up to process emails every 30 seconds...
```

## Email Status Lifecycle

```
1. User books or admin updates status
   ↓
2. Email saved to email_history with status='pending'
   ↓
3. email-sender.js reads pending email
   ↓
4. Sends via SMTP
   ↓
5. SUCCESS:
   - Status updated to 'sent'
   - message_id stored
   - sent_at timestamp recorded

   OR FAILURE:
   - Status updated to 'failed'
   - error_message recorded
   - Can retry later
```

## Testing

### Step 1: Create a Test Booking

1. Go to website
2. Book a package
3. Check `email_history` table - should see 'pending' email

### Step 2: Run Email Sender

```bash
node email-sender.js
```

### Step 3: Check Email Status

```sql
SELECT * FROM email_history WHERE status = 'sent' ORDER BY sent_at DESC;
```

### Step 4: Verify Email

- Check your inbox
- Email should have arrived

## Production Deployment

For production, use PM2:

```bash
# Install PM2 globally
npm install -g pm2

# Start service
pm2 start email-sender.js --name "email-sender"

# Make it restart on server reboot
pm2 startup
pm2 save

# Monitor
pm2 monit

# View logs
pm2 logs email-sender
```

## Logs

The service outputs to console. To save logs:

```bash
node email-sender.js >> logs/email-sender.log 2>&1 &
```

Or with PM2:

```bash
pm2 logs email-sender
```

---

## Summary

✅ Service reads pending emails from database
✅ Sends via your SMTP server
✅ Updates status automatically
✅ Tracks errors
✅ Can run continuously or on schedule
✅ Fully automated email delivery

**Once running, your booking confirmations and status updates will be sent automatically to customers!**
