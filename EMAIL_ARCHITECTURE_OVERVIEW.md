# 📊 Email System Architecture & Flow

## Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER ACTIONS                              │
├─────────────────────────────────────────────────────────────────┤
│  1. User books package                                           │
│  2. Admin confirms booking status                                │
│  3. Admin bulk updates multiple bookings                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React/TypeScript)                  │
├─────────────────────────────────────────────────────────────────┤
│  src/lib/emailService.ts                                        │
│  ├─ sendBookingEmail(payload)                                   │
│  ├─ sendBookingConfirmationEmail()                              │
│  └─ sendStatusUpdateEmail()                                     │
│                                                                  │
│  Called from:                                                    │
│  ├─ src/pages/PackageDetailPage.tsx (line 114)                 │
│  └─ src/admin/bookings/BookingsPage.tsx (line 217, 238)        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    INSERT INTO email_history
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE - QUEUE (PostgreSQL)                │
├─────────────────────────────────────────────────────────────────┤
│  Table: email_history                                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ id: 3                                                   │   │
│  │ recipient_email: 'imseldrith@gmail.com'                │   │
│  │ recipient_name: 'aga'                                  │   │
│  │ subject: 'Booking Confirmation - ...'                 │   │
│  │ body: '[HTML email template]'                          │   │
│  │ email_type: 'booking_confirmation'                     │   │
│  │ related_to: 'booking'                                  │   │
│  │ related_id: 23                                         │   │
│  │ status: 'pending' ← WAITING FOR SENDER                │   │
│  │ created_at: [timestamp]                                │   │
│  │ sent_at: null                                          │   │
│  │ message_id: null                                       │   │
│  │ error_message: null                                    │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
            User runs: node email-sender.js
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    EMAIL SENDER SERVICE (Node.js)               │
├─────────────────────────────────────────────────────────────────┤
│  email-sender.js                                                │
│  ├─ verifyConnection() → Test SMTP connectivity                 │
│  ├─ processPendingEmails()                                      │
│  │  └─ Read WHERE status='pending'                             │
│  ├─ sendEmail(emailRecord)                                     │
│  │  ├─ Connect to SMTP                                         │
│  │  ├─ Send email via Nodemailer                               │
│  │  └─ On success/failure:                                     │
│  │     ├─ UPDATE status='sent' + message_id                    │
│  │     └─ UPDATE status='failed' + error_message               │
│  └─ Loop: Process every 30 seconds continuously                │
│                                                                  │
│  Configuration: .env file                                       │
│  ├─ VITE_SUPABASE_URL                                          │
│  ├─ SUPABASE_SERVICE_ROLE_KEY                                  │
│  ├─ SMTP_HOST: mail.abctravels.site                            │
│  ├─ SMTP_PORT: 587                                             │
│  ├─ SMTP_USER: [email credentials]                             │
│  └─ SMTP_PASSWORD: [email password]                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                  SMTP Server → Mail Relay
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CUSTOMER INBOX (SMTP)                        │
├─────────────────────────────────────────────────────────────────┤
│  Server: mail.abctravels.site:587 (TLS)                        │
│  Recipient: imseldrith@gmail.com                               │
│  From: noreply@abctravels.site                                 │
│  Subject: Booking Confirmation - Ladakh Adventure: 8 Days Tour│
│  Delivered: Within 1-5 seconds                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
            Database Updated: status='sent'
                  message_id populated
                   sent_at timestamp
```

---

## Email Status Lifecycle

```
1. BOOKING CREATED/STATUS CHANGED
   ↓
2. EMAIL QUEUED TO DATABASE
   • status: 'pending'
   • created_at: [now]
   • message_id: null
   • error_message: null
   ↓
3. email-sender.js PROCESSES
   ↓
4a. SUCCESS → SENT                    4b. FAILURE → FAILED
    • status: 'sent'                      • status: 'failed'
    • message_id: [ID from SMTP]          • error_message: [error]
    • sent_at: [now]                      • created_at: [original]
    • Email delivered to inbox            • Email NOT delivered
    ✅ Complete                           ❌ Needs retry or fix
```

---

## Email Flow Examples

### Example 1: Package Booking

```
TIME    ACTION                                  STATUS
────────────────────────────────────────────────────────────
12:00   User books "Ladakh Adventure"
        → Booking created in DB (ID: 23)       ✅
        → sendBookingConfirmationEmail()       ✅
        → INSERT email_history (ID: 3)         ✅
        Status in DB: 'pending'

12:01   User sees: "Booking confirmed!"
        Email is in queue, waiting to send

12:02   node email-sender.js starts
        → Read pending emails
        → Found email ID 3

12:02   SMTP Connection test
        → Connect to mail.abctravels.site:587  ✅

12:02   Send email via Nodemailer
        → To: imseldrith@gmail.com             ✅
        → Subject: "Booking Confirmation..."   ✅
        → SMTP returns message_id              ✅

12:02   Update database
        → status: 'pending' → 'sent'           ✅
        → message_id: 'xyz123'                 ✅
        → sent_at: 12:02:15                    ✅

12:02   Email delivered
        → Inbox: New booking confirmation      ✅
```

### Example 2: Admin Status Update

```
TIME    ACTION                                  STATUS
────────────────────────────────────────────────────────────
13:30   Admin navigates to Bookings page
        Selects booking ID 23
        Changes status: "Pending" → "Confirmed"

13:31   updateStatus() called
        → Update bookings table                ✅
        → sendStatusUpdateEmail()              ✅
        → INSERT email_history (ID: 4)         ✅
        Status in DB: 'pending'
        User sees: "Booking updated"           ✅

13:31   email-sender.js processes
        → Found email ID 4 pending
        → Connect to SMTP                      ✅
        → Send status update email             ✅

13:32   Database updated
        → Email ID 4: status='sent'            ✅

13:32   Customer inbox
        → "Your booking is confirmed!"         ✅
```

### Example 3: Bulk Status Update

```
TIME    ACTION                                  STATUS
────────────────────────────────────────────────────────────
14:00   Admin selects 3 bookings
        All change status to "Confirmed"

14:01   For each booking:
        → sendStatusUpdateEmail()              ✅ (3 times)
        → INSERT email_history (IDs: 5, 6, 7) ✅
        All status: 'pending'

14:01   node email-sender.js processes
        → Max 10 per run, found 3 pending
        → Send to recipient 1                  ✅
        → Send to recipient 2                  ✅
        → Send to recipient 3                  ✅

14:02   Database updated
        → All 3 emails: status='sent'          ✅

14:02   All 3 customers receive confirmations ✅
```

---

## Component Responsibilities

### Frontend (React - Non-Blocking)

- User books or admin updates status
- Calls emailService.sendEmail()
- Email saved to database queue (< 100ms)
- User sees success message immediately
- No wait for SMTP connection

### Database (PostgreSQL - Queue)

- Stores all emails with full details
- Tracks status: pending → sent/failed
- Audit trail: created_at, sent_at, message_id
- Query: `SELECT * FROM email_history WHERE status='pending'`

### Email Sender (Node.js - Background Service)

- Runs continuously or on-demand
- Reads pending emails every 30 seconds
- Connects to SMTP server
- Sends email via Nodemailer
- Updates status on success/failure
- Can be run via:
  - Terminal: `node email-sender.js`
  - PM2: `pm2 start email-sender.js`
  - Task Scheduler (Windows)
  - Cron Job (Linux/Mac)

### SMTP Server (mail.abctravels.site)

- External mail relay service
- Accepts email from Node.js
- Routes email to recipient
- Returns message_id on success

---

## Key Benefits of This Architecture

✅ **Non-blocking frontend** - Users don't wait for SMTP  
✅ **Reliable delivery** - Database queue guarantees persistence  
✅ **Error tracking** - Failed emails logged for review  
✅ **Flexible deployment** - Run service anytime/anywhere  
✅ **Scalable** - Can queue 1000s of emails, process in batches  
✅ **Observable** - Complete audit trail of every email  
✅ **Retry capable** - Mark as pending again to retry  
✅ **Secure** - No credentials in frontend code

---

## Troubleshooting by Layer

### Frontend Issue?

- Check: `src/lib/emailService.ts` - Is it calling supabase.from('email_history').insert()?
- Console: "Email saved to email_history table: [{...}]"
- DB: SELECT \* FROM email_history - Is email there?

### Database Issue?

- Check: Is email_history table created?
- Query: `SELECT COUNT(*) FROM email_history WHERE status='pending'`
- Permissions: Does service role key have INSERT/UPDATE access?

### Email Sender Issue?

- Check: Is email-sender.js running?
- Console: Are you seeing "Processing pending emails..." message?
- Errors: Any ENOTFOUND, authentication, or connection errors?
- SMTP: Can you telnet mail.abctravels.site 587?

### SMTP Issue?

- Check: Is mail.abctravels.site accessible from your network?
- Credentials: Are SMTP_USER/SMTP_PASSWORD correct?
- Port: Is 587 (TLS) open? (Not 25, 465, 2525)
- Firewall: Is outbound SMTP allowed?

---

## Monitoring Commands

```sql
-- See how many emails are pending
SELECT COUNT(*) FROM email_history WHERE status='pending';

-- See which emails are pending
SELECT id, recipient_email, subject, created_at
FROM email_history
WHERE status='pending'
ORDER BY created_at ASC;

-- See recently sent emails
SELECT id, recipient_email, subject, sent_at
FROM email_history
WHERE status='sent'
ORDER BY sent_at DESC
LIMIT 10;

-- See failed emails
SELECT id, recipient_email, subject, error_message
FROM email_history
WHERE status='failed'
ORDER BY created_at DESC;

-- Email statistics
SELECT status, COUNT(*) FROM email_history GROUP BY status;

-- Emails for specific booking
SELECT * FROM email_history
WHERE related_to='booking' AND related_id=23
ORDER BY created_at DESC;
```

---

**This architecture ensures:**

- ✅ Emails never get lost (stored in database)
- ✅ Users never wait (async processing)
- ✅ Failures are tracked (audit trail)
- ✅ System is flexible (run service when needed)
- ✅ Everything is observable (full history)
