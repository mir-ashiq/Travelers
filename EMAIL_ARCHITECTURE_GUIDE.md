# Email System - Complete Solution Guide

## Current Status

✅ **Emails are now being saved to the database** when bookings are created and updated. No more 500 errors!

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   FRONTEND (React)                              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  User Books Package or Admin Updates Status               │ │
│  └─────────────────────┬──────────────────────────────────────┘ │
└────────────────────────┼──────────────────────────────────────────┘
                         │
                         ▼
            ┌────────────────────────────┐
            │  supabase.from('bookings') │
            │   .insert(bookingData)     │
            └────────┬───────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
   Booking Saved           Email Queued
   (bookings table)         (email_history)
        │                         │
        │                         ▼
        │            ┌──────────────────────┐
        │            │  email_history table │
        │            │  status: 'pending'   │
        │            │  recipient_email     │
        │            │  subject             │
        │            │  body (HTML)         │
        │            │  email_type          │
        │            └──────────────────────┘
        │
        ▼
   User Success Toast
   "Booking submitted!"

        [Later - External Service]
        ▼
   Read from email_history table
   WHERE status = 'pending'
        ▼
   Send via SMTP or Email API
        ▼
   Update status = 'sent'
```

## File Changes

### `src/lib/emailService.ts`

**Changed from:**

```typescript
// Calling Edge Function (causes 500 error due to verify_jwt=true)
const { data, error } = await supabase.functions.invoke('send-email', {...})
```

**Changed to:**

```typescript
// Storing in database directly (no auth issues)
const { data, error } = await supabase.from("email_history").insert([
  {
    recipient_email: payload.customerEmail,
    recipient_name: payload.customerName,
    subject: template.subject,
    body: template.html,
    email_type: payload.type,
    related_to: "booking",
    related_id: payload.bookingId,
    status: "pending",
  },
]);
```

### `src/pages/PackageDetailPage.tsx`

- Calls `sendBookingConfirmationEmail()` after booking created
- Email is queued in database, doesn't block booking operation

### `src/admin/bookings/BookingsPage.tsx`

- Calls `sendStatusUpdateEmail()` when status changes
- Supports bulk updates - all emails queued at once

## Email Triggers

### 1. New Booking

```
handleBooking() in PackageDetailPage.tsx
    ↓
sendBookingConfirmationEmail(name, email, package, bookingId, travelDate, amount)
    ↓
Email stored in email_history with type='booking_confirmation'
    ↓
Status: pending (ready for external service to send)
```

### 2. Single Status Update

```
updateStatus(bookingId, newStatus) in BookingsPage.tsx
    ↓
sendStatusUpdateEmail(name, email, package, bookingId, travelDate, amount, newStatus)
    ↓
Email stored in email_history with type='status_update'
    ↓
Status: pending (ready for external service to send)
```

### 3. Bulk Status Updates

```
bulkUpdateStatus(newStatus) in BookingsPage.tsx
    ↓
For each selected booking:
  sendStatusUpdateEmail(...)
    ↓
All emails stored in email_history
    ↓
Status: pending for all (ready for external service to send)
```

## Email Templates

Two professional HTML templates included:

### Booking Confirmation

- Gradient purple header
- Shows booking ID, package, travel date, amount
- Status shown as "PENDING"
- Agency contact info

### Status Update

- Gradient purple header
- Color-coded status (green=Confirmed, red=Cancelled, orange=other)
- Status-specific message
- Full booking details
- Agency contact info

## Database Schema

### email_history Table

```sql
CREATE TABLE email_history (
  id BIGINT PRIMARY KEY,
  recipient_email TEXT,
  recipient_name TEXT,
  subject TEXT,
  body TEXT (HTML content),
  email_type TEXT ('booking_confirmation' | 'status_update'),
  related_to TEXT ('booking'),
  related_id BIGINT,
  status TEXT ('pending' | 'sent' | 'failed'),
  sent_at TIMESTAMP,
  created_at TIMESTAMP,
  error_message TEXT
);
```

## How to Send Emails

### Option 1: Backend Service (Recommended)

Create a Node.js/Python service that runs periodically:

```typescript
// Pseudo-code
async function sendPendingEmails() {
  // Get all pending emails
  const pending = await supabase
    .from("email_history")
    .select("*")
    .eq("status", "pending")
    .limit(50);

  // Send each email
  for (const email of pending.data) {
    try {
      await nodemailer.sendMail({
        from: SMTP_FROM,
        to: email.recipient_email,
        subject: email.subject,
        html: email.body,
      });

      // Mark as sent
      await supabase
        .from("email_history")
        .update({ status: "sent", sent_at: now() })
        .eq("id", email.id);
    } catch (error) {
      // Mark as failed with error message
      await supabase
        .from("email_history")
        .update({ status: "failed", error_message: error.message })
        .eq("id", email.id);
    }
  }
}
```

### Option 2: Supabase Cron + Edge Function

Create a scheduled function that processes the queue automatically

### Option 3: Third-Party Email Service

Use SendGrid, Mailgun, or similar to read from the table and send

## Testing

```bash
# 1. Create a booking from the website
# 2. Check database:
SELECT * FROM email_history WHERE email_type = 'booking_confirmation' ORDER BY created_at DESC;

# 3. Update booking status
# 4. Check database:
SELECT * FROM email_history WHERE email_type = 'status_update' ORDER BY created_at DESC;

# 5. Verify all records have status='pending'
```

## Benefits of This Approach

✅ **No authentication issues** - Stores in database, not calling Edge Function  
✅ **Non-blocking** - Emails queued instantly, doesn't delay user operations  
✅ **Auditable** - Complete email history in database  
✅ **Reliable** - Can retry failed emails, track errors  
✅ **Scalable** - Can process emails at any time, handle rate limiting  
✅ **Flexible** - Can integrate with any email service

## Production Checklist

- [x] Email queueing works without errors
- [x] All emails stored in database
- [x] Non-blocking architecture implemented
- [x] Templates are professional and complete
- [x] Booking triggers email correctly
- [x] Status update triggers email correctly
- [x] Bulk updates trigger emails correctly
- [ ] **TODO**: Setup email sending service (backend/cron job)
- [ ] **TODO**: Test actual email delivery
- [ ] **TODO**: Setup error handling and retries

---

**Next Step**: Deploy a backend service or cron job to read from `email_history` and send the queued emails.
