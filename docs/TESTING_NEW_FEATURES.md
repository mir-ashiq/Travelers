# 🧪 Testing Guide - New Features

## Setup for Testing

### Prerequisites

- ✅ Backend running on http://localhost:3000
- ✅ Frontend running on http://localhost:5174
- ✅ Logged in as admin user
- ✅ Bookings exist in database

### Start Testing

Navigate to: **Admin** → **Bookings**

---

## Test 1: Send Reminder Email ✉️

### Steps:

1. Find a booking with status **"Confirmed"** (green badge)
2. Click the 👁️ (eye icon) to open details
3. Look for **"Send Reminder"** button (blue, in modal footer)
4. Click **"Send Reminder"** button
5. Expected: Green toast saying "Reminder email sent to customer"

### What Happens:

- Email sent to customer with booking details
- Success notification appears
- Modal remains open

### Verification:

- Check customer email inbox
- Should receive reminder with booking details
- Email contains: Package, Travel Date, Amount, Booking ID

**Result:** ✅ Pass / ❌ Fail

---

## Test 2: Download Invoice 📥

### Steps:

1. Find any booking in the table
2. Scroll right to see **Actions** column
3. Click the ⬇️ (download arrow icon)
4. Expected: File downloads as `Invoice_[ID]_[Date].html`

### What Happens:

- Browser download triggers
- HTML file saves to Downloads folder
- Success toast: "Invoice downloaded successfully"

### Verification:

1. Open downloaded file in browser
2. Check file contains:
   - Booking ID
   - Customer name, email, phone
   - Package details
   - Travel date
   - Total amount
   - Status and payment status

**Result:** ✅ Pass / ❌ Fail

---

## Test 3: Generate Invoice & Save as PDF 📄

### Steps:

1. Open any booking (click 👁️ icon)
2. Scroll to bottom of modal
3. Click **"Generate Invoice"** button (gray, in modal footer)
4. Print dialog opens
5. In printer dropdown, select **"Save as PDF"**
6. Click **"Save"**
7. Choose location and filename
8. Expected: PDF saved to your computer

### What Happens:

- Browser print dialog opens
- User can save as PDF or print directly
- Success toast: "Invoice opened for printing/saving as PDF"

### Verification:

1. Open saved PDF
2. Verify formatting looks professional
3. Check all booking details present
4. Company header visible
5. Clear layout with all info

**Result:** ✅ Pass / ❌ Fail

---

## Test 4: Reassign to Team Member 👤

### Steps:

1. Open any booking (click 👁️ icon)
2. Find **"Assignment"** section (middle of modal)
3. Shows: "Assigned to: [Name or Unassigned]"
4. Click **"Reassign"** button
5. Expected: Dropdown menu appears

### Dropdown Actions:

- **If currently Unassigned:**

  1. Click a team member name
  2. Booking reassigned
  3. Success toast appears
  4. Modal updates to show new assignee

- **If currently Assigned:**
  1. Can change to different person
  2. Or click "Unassigned" to unassign

### Verification:

1. Dropdown shows all team members
2. "Unassigned" option available
3. After selection:
   - Success toast: "Booking assigned to [Name]"
   - Modal shows new assignee
   - Closes dropdown automatically
4. Refresh page - assignment persists in database

**Result:** ✅ Pass / ❌ Fail

---

## 🎯 Test Scenarios

### Scenario 1: Complete Workflow

1. Create/find a Pending booking
2. Confirm it → Status changes to "Confirmed"
3. Send reminder email → Email sent to customer
4. Generate invoice → Save as PDF
5. Assign to team member → Assignment updated

**Expected:** All 5 steps complete without errors

---

### Scenario 2: Reassign Multiple Times

1. Open booking
2. Reassign to Team Member A → Success
3. Reassign to Team Member B → Success
4. Reassign to "Unassigned" → Success
5. Refresh page → Shows last assignment

**Expected:** All reassignments work, last one persists

---

### Scenario 3: Invoice Generation

1. Generate invoice for Pending booking
2. Generate invoice for Confirmed booking
3. Generate invoice for Cancelled booking
4. Save all 3 as PDFs
5. Open each PDF

**Expected:** All 3 PDFs generate correctly with appropriate status

---

## 📊 Test Results Template

```
Feature: Send Reminder Email
Status: [ ] Pass  [ ] Fail
Notes: ________________________

Feature: Download Invoice
Status: [ ] Pass  [ ] Fail
Notes: ________________________

Feature: Generate Invoice
Status: [ ] Pass  [ ] Fail
Notes: ________________________

Feature: Reassign Booking
Status: [ ] Pass  [ ] Fail
Notes: ________________________
```

---

## 🐛 Debugging

### If Send Reminder Fails:

- Check backend logs
- Verify email service is running
- Check customer email address is valid
- Look for SMTP errors in terminal

### If Download Invoice Fails:

- Check browser console (F12)
- Verify booking data is complete
- Try in different browser
- Check Downloads folder permissions

### If Generate Invoice Fails:

- Check browser console (F12)
- Verify window.open is not blocked by popup blocker
- Try in incognito mode
- Update browser

### If Reassign Fails:

- Verify JWT token is valid (refresh page)
- Check you're logged in as admin
- Verify team members exist in database
- Check browser console for errors

---

## ✅ Checklist

- [ ] Send Reminder Email works
- [ ] Download Invoice works
- [ ] Generate Invoice works
- [ ] Reassign to Team Member works
- [ ] All features show success toast
- [ ] All features update database correctly
- [ ] No browser console errors
- [ ] Features work on mobile (responsive)
- [ ] Features work in different browsers
- [ ] Ready for production deployment

---

## 📝 Notes for Testing

- Test with multiple bookings in different statuses
- Try edge cases (very long customer names, special characters, etc.)
- Test on different browsers (Chrome, Firefox, Safari, Edge)
- Test on mobile/tablet
- Monitor backend logs during testing
- Check email delivery (may take 30 seconds to 1 minute)

---

**Testing Status:** Ready to Begin 🚀
