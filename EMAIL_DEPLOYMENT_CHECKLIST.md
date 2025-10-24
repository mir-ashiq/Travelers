# ✅ EMAIL SYSTEM DEPLOYMENT CHECKLIST

## Phase 1: Setup (Next 5 Minutes)

### Prerequisites ✅

- [x] Node.js installed
- [x] npm available
- [x] Project cloned
- [x] Development server running

### Dependencies Installation

- [ ] Run: `npm install nodemailer @supabase/supabase-js`
- [ ] Verify: `npm list nodemailer` shows v6.9.7+

### Environment Configuration

- [ ] Create `.env` file in project root
- [ ] Get Service Role Key from Supabase
  - Go to Supabase Dashboard
  - Project Settings → API
  - Copy "Service role key"
  - ⚠️ NOT the "anon key"
- [ ] Get SMTP credentials from mail.abctravels.site
- [ ] Populate `.env`:
  ```
  ✓ VITE_SUPABASE_URL
  ✓ SUPABASE_SERVICE_ROLE_KEY
  ✓ SMTP_HOST
  ✓ SMTP_PORT
  ✓ SMTP_USER
  ✓ SMTP_PASSWORD
  ✓ SMTP_FROM
  ```

### Initial Test

- [ ] Run: `node email-sender.js`
- [ ] Check console output:
  - [ ] "📧 Processing pending emails..."
  - [ ] "✅ Email sent: [message_id]"
  - [ ] "Updated email_history ID 3 to sent status"
- [ ] Check inbox for booking confirmation
  - Recipient: imseldrith@gmail.com
  - Subject: "Booking Confirmation - Ladakh Adventure..."
- [ ] Database verification:
  - Query: `SELECT * FROM email_history WHERE id=3;`
  - Check: status = 'sent'
  - Check: message_id is populated

---

## Phase 2: Verification (After Initial Test)

### Email Arrived?

- [ ] Check inbox
- [ ] Check spam/promotions folder
- [ ] Verify sender: noreply@abctravels.site
- [ ] Verify subject line correct

### Database Updated?

- [ ] Run: `SELECT status FROM email_history WHERE id=3;`
- [ ] Status should be: `sent`
- [ ] message_id should exist
- [ ] sent_at should have timestamp

### No Errors?

- [ ] Console shows no errors
- [ ] No ENOTFOUND errors
- [ ] No authentication errors
- [ ] No connection refused errors

---

## Phase 3: Feature Testing

### Test 1: New Booking Email

- [ ] Browse to package page
- [ ] Fill booking form
- [ ] Click "Book Now"
- [ ] Check console: "Booking created successfully with ID: XX"
- [ ] Check console: "Email saved to email_history table"
- [ ] Run: `node email-sender.js`
- [ ] Check inbox: New confirmation email arrived
- [ ] Database: New email_history row has status='sent'

### Test 2: Admin Status Update

- [ ] Go to Admin → Bookings
- [ ] Select a booking
- [ ] Change status to "Confirmed"
- [ ] Console shows: "Email saved to email_history table"
- [ ] Run: `node email-sender.js`
- [ ] Customer receives status update email
- [ ] Database: Email marked status='sent'

### Test 3: Bulk Updates

- [ ] Select 3-5 bookings
- [ ] Change all to "Confirmed"
- [ ] Console shows: "Email saved" (multiple times)
- [ ] Run: `node email-sender.js`
- [ ] All customers receive emails (check 3 inboxes)
- [ ] Database: All emails marked status='sent'

### Test 4: Error Handling

- [ ] Intentionally provide wrong email address
- [ ] Verify email is queued as 'pending'
- [ ] Run email-sender.js
- [ ] Check database: Email should have status='failed'
- [ ] Verify error_message is populated
- [ ] Service should continue (not crash)

---

## Phase 4: Production Deployment

### Choose Service Manager (Pick ONE)

#### Option A: PM2 (Recommended)

- [ ] Install PM2 globally: `npm install -g pm2`
- [ ] Start service: `pm2 start email-sender.js --name "email-sender"`
- [ ] Setup auto-startup: `pm2 startup`
- [ ] Save config: `pm2 save`
- [ ] Verify running: `pm2 status`
- [ ] View logs: `pm2 logs email-sender`
- [ ] Configure monitoring: `pm2 monitor` (optional)

#### Option B: Windows Task Scheduler

- [ ] Read: `EMAIL_SENDER_SETUP.md` (Deployment Options section)
- [ ] Create task: "Email Sender"
- [ ] Program: `C:\path\to\node.exe`
- [ ] Arguments: `C:\path\to\email-sender.js`
- [ ] Trigger: Every 5 minutes
- [ ] Run: Whether user logged in or not
- [ ] Run with highest privileges: ✓
- [ ] Test: Manually run and check logs

#### Option C: Cron Job (Linux/Mac only)

- [ ] Edit crontab: `crontab -e`
- [ ] Add: `*/5 * * * * cd /path/to/project && node email-sender.js`
- [ ] Save and close
- [ ] Verify: `crontab -l`
- [ ] Check logs: `tail -f /var/log/cron`

#### Option D: Keep Terminal Open

- [ ] Terminal: `node email-sender.js`
- [ ] Service runs continuously
- [ ] Stops when terminal closes
- [ ] Good for development only

### 24/7 Operation Verification

- [ ] Service is running continuously
- [ ] Check command: `pm2 status` (or Task Scheduler / ps)
- [ ] Logs show regular email processing
- [ ] No errors in logs
- [ ] Service auto-restarts on failure (if using PM2)
- [ ] Service auto-starts on server reboot (if using PM2 startup)

---

## Phase 5: Ongoing Monitoring

### Daily Tasks

- [ ] Check pending email count:

  ```sql
  SELECT COUNT(*) FROM email_history WHERE status='pending';
  ```

  Should be: **0** (all processed)

- [ ] Check for failed emails:

  ```sql
  SELECT COUNT(*) FROM email_history WHERE status='failed';
  ```

  Should be: **0** or very low

- [ ] Check service is running:
  - PM2: `pm2 status`
  - Task Scheduler: Verify task completed
  - Terminal: Still open?
  - Cron: Check logs

### Weekly Tasks

- [ ] Review failed emails (if any)
- [ ] Check SMTP server status
- [ ] Monitor email delivery rates
- [ ] Check database size:
  ```sql
  SELECT COUNT(*) FROM email_history;
  ```

### Monthly Tasks

- [ ] Archive old emails (optional):
  ```sql
  DELETE FROM email_history WHERE created_at < NOW() - INTERVAL '90 days';
  ```
- [ ] Review email templates (update if needed)
- [ ] Check for SMTP credential expiry
- [ ] Document any issues or improvements

---

## 🆘 Troubleshooting Checklist

### If Emails Not Sending

- [ ] Is email-sender.js running?

  - Check: `pm2 status` or Task Scheduler
  - If not: Start it

- [ ] Are there pending emails?

  - Query: `SELECT COUNT(*) FROM email_history WHERE status='pending';`
  - If 0: No emails to send (create test booking)

- [ ] Is .env file correct?

  - Check: File exists in project root
  - Check: SMTP_HOST = mail.abctravels.site
  - Check: SMTP_PORT = 587
  - Check: SMTP_USER and SMTP_PASSWORD match credentials

- [ ] Is SMTP connection working?

  - Look for console output: "SMTP connection verified"
  - If missing: Connection test failed

- [ ] Check error logs:

  ```sql
  SELECT id, recipient_email, error_message
  FROM email_history
  WHERE status='failed'
  LIMIT 1;
  ```

- [ ] Check PM2 logs (if using PM2):
  ```powershell
  pm2 logs email-sender
  ```

### If Specific Email Failed

- [ ] Get error message:

  ```sql
  SELECT error_message FROM email_history WHERE id=[email_id];
  ```

- [ ] Common errors:
  - "Invalid credentials" → Check SMTP_USER/SMTP_PASSWORD
  - "ENOTFOUND" → Check SMTP_HOST spelling
  - "Connection refused" → Check firewall, try different network
  - "Invalid recipient" → Check email address format

### If Build System Affected

- [ ] Clean build: `npm run build`
- [ ] Should still succeed (0 errors)
- [ ] email-sender.js not included in build (it's Node.js, not web)
- [ ] If build errors: Check `src/**/*.ts` files only

---

## 📊 Success Metrics

### Technical

- [x] Frontend queuing working
- [x] Database storing emails
- [x] email-sender.js created
- [ ] First email sent successfully
- [ ] PM2/Task Scheduler running 24/7
- [ ] Zero pending emails
- [ ] Zero failed emails
- [ ] All tests passing

### Functional

- [ ] Users can book packages
- [ ] Booking confirmation email arrives
- [ ] Admin can confirm bookings
- [ ] Status update email arrives
- [ ] Bulk updates send multiple emails
- [ ] All emails have correct recipient, subject, body

### Production Ready

- [ ] Service running continuously
- [ ] Auto-restarts on failure
- [ ] Auto-starts on server reboot
- [ ] Monitoring in place
- [ ] Logs checked weekly
- [ ] Error handling verified
- [ ] Documentation complete

---

## 📝 Notes & Observations

### What's Working

```
[Space for you to add notes]
```

### Issues Encountered

```
[Space for you to add notes]
```

### Customizations Made

```
[Space for you to add notes]
```

---

## 🎯 Status Summary

**As of:** [Date]
**Completed Phases:** [Check which phases above]
**Current Phase:** [Currently on]
**Next Action:** [What to do next]
**Blockers:** [Any issues]
**Ready to Deploy:** [ ] YES / [ ] NO

---

## 📞 Quick Reference

### Important Files

- `email-sender.js` - The service file
- `.env` - Your credentials (CONFIDENTIAL)
- `src/lib/emailService.ts` - Frontend queuing
- `EMAIL_SENDER_SETUP.md` - Full guide
- `EMAIL_QUICK_START.md` - Quick reference

### Important Commands

```powershell
# Install dependencies
npm install nodemailer @supabase/supabase-js

# Test the service (one-time)
node email-sender.js

# Start with PM2
pm2 start email-sender.js --name "email-sender"

# Check PM2 status
pm2 status

# View PM2 logs
pm2 logs email-sender

# Stop PM2 service
pm2 stop email-sender
```

### Important Queries

```sql
-- Check pending emails
SELECT COUNT(*) FROM email_history WHERE status='pending';

-- Check sent emails
SELECT COUNT(*) FROM email_history WHERE status='sent';

-- Check failed emails
SELECT * FROM email_history WHERE status='failed';

-- Check all emails for a booking
SELECT * FROM email_history WHERE related_id=[booking_id];
```

---

**Status:** ✅ Ready to deploy  
**Time to complete all phases:** 30-60 minutes  
**Support:** See EMAIL_SENDER_SETUP.md for troubleshooting

**Let's get those emails sending! 🚀**
