# 🧪 GUEST CHECKOUT - TESTING GUIDE

## Pre-Testing Checklist

- [x] Backend server running on http://localhost:3000
- [x] Frontend server running on http://localhost:5174
- [x] Both Supabase and Stripe configured
- [x] Email service running

**Ready?** Let's test! ↓

---

## TEST 1: Guest Checkout Flow (Primary Use Case)

### Steps

1. Open http://localhost:5174 in browser
2. Navigate to **Destinations** or **Packages**
3. Click on any package to view details
4. Scroll down and click **"Book Now"** button
5. Fill the booking form:
   - **Name**: Test Guest
   - **Email**: testguest@example.com
   - **Phone**: +1-555-0123
   - **Travel Date**: Select any future date
   - **Message**: Test booking
6. Click **"Create Booking"**
7. You should see: ✅ **Booking created successfully!**
8. Click the **"Proceed to Payment"** button
9. At payment page, choose: **○ I'm a new customer (Guest checkout)**
10. Fill guest info:
    - **Full Name**: Test Guest
    - **Email**: testguest@example.com
    - **Phone**: +1-555-0123
11. Click **"Continue to Billing"**
12. Fill billing address:
    - **Address**: 123 Main Street
    - **City**: New York
    - **State**: NY
    - **ZIP**: 10001
    - **Country**: United States
13. Click **"Continue to Payment"**
14. Fill Stripe test card:
    - **Card**: 4242 4242 4242 4242
    - **Expiry**: 12/25
    - **CVC**: 123
15. Click **"Pay $[amount]"**
16. Wait for processing...

### Expected Results

- ✅ Form validates all entries
- ✅ Payment processes successfully
- ✅ See **"Payment Successful!"** message
- ✅ Confirmation shows email received
- ✅ Auto-redirects to home page after 3 seconds

### What Could Go Wrong

| Issue                  | Solution                                |
| ---------------------- | --------------------------------------- |
| "Card declined"        | Use test card 4242 4242 4242 4242       |
| "Form won't submit"    | Check all required fields are filled    |
| "Payment intent error" | Check backend logs for API errors       |
| "Booking not found"    | Verify booking was created successfully |

---

## TEST 2: Customer Login at Checkout

### Prerequisites

- User account already created
- Email verified

### Steps

1. Open http://localhost:5174 in browser
2. Go to **Packages** page
3. Click any package and click **"Book Now"**
4. Fill booking form with any guest info (email doesn't matter)
5. Click **"Create Booking"**
6. Click **"Proceed to Payment"**
7. Choose: **○ I have an existing account**
8. Enter credentials:
   - **Email**: your-test@email.com (your account)
   - **Password**: your-password
9. Click **"Continue to Billing"**
10. Verify billing info is **auto-filled** from your profile
    - Your name should appear
    - Your phone should appear
    - Your address should appear (if saved)
11. Click **"Continue to Payment"**
12. Enter test card and pay
13. You should be **redirected to dashboard** (not home)

### Expected Results

- ✅ Login succeeds with correct credentials
- ✅ Billing address **auto-fills**
- ✅ Payment processes
- ✅ Redirects to **/customer-dashboard** (not home)
- ✅ Booking appears in your booking list

### What Could Go Wrong

| Issue                         | Solution                        |
| ----------------------------- | ------------------------------- |
| "Invalid credentials"         | Check email/password            |
| "Billing not auto-filled"     | Check customer profile is saved |
| "Not redirected to dashboard" | Check localStorage for token    |

---

## TEST 3: Back Button Navigation

### Steps

1. Start guest checkout
2. At **Step 2 (Billing)**, click **"Back"**
3. Verify you're back at **Step 1 (Authentication)**
4. At **Step 1**, click **"Continue to Billing"** again
5. Verify billing page still has your data
6. At **Step 3 (Payment)**, click **"Back"**
7. Verify you're at **Step 2 (Billing)**
8. Billing data should still be there

### Expected Results

- ✅ Back buttons work at each step
- ✅ Form data persists when going back
- ✅ Can navigate between steps freely
- ✅ No data loss when navigating back

---

## TEST 4: Form Validation

### Test: Missing Required Fields

**At Step 1 (Guest checkout selected)**:

- [ ] Leave **Name** empty → Try to continue → Error shown
- [ ] Leave **Email** empty → Try to continue → Error shown
- [ ] Leave **Phone** empty → Try to continue → Error shown
- [ ] Invalid **Email** format → Try to continue → Error shown

**At Step 2 (Billing)**:

- [ ] Leave **Address** empty → Try to continue → Error shown
- [ ] Leave **City** empty → Try to continue → Error shown
- [ ] Leave **State** empty → Try to continue → Error shown
- [ ] Leave **ZIP** empty → Try to continue → Error shown

**At Step 3 (Payment)**:

- [ ] Empty **Card** field → Try to pay → Error shown
- [ ] Invalid **Card** number → Try to pay → Error shown
- [ ] Expired **Card** → Try to pay → Stripe error

### Expected Results

- ✅ All validation errors caught
- ✅ Helpful error messages shown
- ✅ Red highlight on invalid fields
- ✅ Form prevents submission with errors

---

## TEST 5: Payment Failures

### Test Case 1: Declined Card

```
Card: 4000 0000 0000 0002
Expiry: 12/25
CVC: 123
```

**Expected**: "Your card was declined" error

### Test Case 2: Insufficient Funds

```
Card: 4000 0000 0000 9995
Expiry: 12/25
CVC: 123
```

**Expected**: "Insufficient funds" error

### Test Case 3: Lost Card

```
Card: 4000 0000 0000 9987
Expiry: 12/25
CVC: 123
```

**Expected**: "Your card was lost" error

### Expected Results (All Cases)

- ✅ Error message displayed clearly
- ✅ User can try again
- ✅ Form state preserved
- ✅ No booking marked as paid

---

## TEST 6: Stripe Security Badge

### Steps

1. Get to **Step 3 (Payment)**
2. Look for **🔒 "Secure with Stripe"** badge
3. Look for **padlock icon** in browser
4. Enter card details
5. Look for **Stripe Elements** styling (blue outline)

### Expected Results

- ✅ Security badge visible
- ✅ Browser shows secure connection
- ✅ Stripe Elements styled correctly
- ✅ Confidence in payment security

---

## TEST 7: Email Confirmation

### Steps

1. Complete guest checkout with valid email
2. Check **backend terminal/logs** for email sending
3. Look for line like: `"Sending confirmation email to testguest@example.com"`
4. Check actual email inbox (if using real SMTP)

### Expected Email Should Contain:

- [ ] Booking confirmation
- [ ] Booking ID
- [ ] Package details
- [ ] Total amount paid
- [ ] Date of travel
- [ ] Number of guests
- [ ] Contact information
- [ ] Link to customer account (if applicable)

### Expected Results

- ✅ Email log entry in backend
- ✅ Email received (if real SMTP)
- ✅ Email contains all details
- ✅ Email looks professional

---

## TEST 8: Guest vs Customer Behavior

### Guest Checkout Behavior

```
Payment Success → Email sent → Redirect to home page
                                     ↓
                            User can't see booking history
                            (unless they login later)
```

### Customer Checkout Behavior

```
Payment Success → Email sent → Redirect to dashboard
                                     ↓
                            User can see booking in history
                            Can manage booking from there
```

### Steps to Verify

1. Complete payment as **guest**
2. Note that home page is shown
3. Complete payment as **customer**
4. Note that dashboard is shown with booking in history

### Expected Results

- ✅ Different redirect based on auth status
- ✅ Customers see booking immediately
- ✅ Guests get confirmation email
- ✅ Both receive confirmations

---

## TEST 9: Same Email - Guest Then Customer

### Scenario

Guest books with email: `john@example.com`
Later, customer creates account with same email

### Steps

1. Book as guest with `john@example.com`
2. Complete payment
3. Go to signup and create account with `john@example.com`
4. Verify email for account
5. Login to dashboard
6. Check if booking appears

### Expected Results

- ✅ Guest booking was made
- ✅ Account creation succeeds (same email allowed)
- ✅ Account verified
- ✅ Login works
- ✅ Guest booking may or may not appear in history (depends on business logic)

---

## TEST 10: Mobile Responsiveness

### Steps (on mobile or responsive view)

1. Resize browser to 375px width (mobile)
2. Go through entire checkout flow
3. Verify at each step:
   - Form fields stack vertically
   - Buttons are touch-friendly (44px+ height)
   - Text is readable
   - No horizontal scrolling
   - Side panel might hide/adjust

### Expected Results

- ✅ All steps readable on mobile
- ✅ Form fields properly sized
- ✅ Buttons clickable without zoom
- ✅ Responsive design works
- ✅ No layout shifts

---

## TEST 11: Cross-Browser Testing

### Browsers to Test

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (if available)
- [ ] Edge (if available)

### What to Check

- [ ] Stripe Elements render correctly
- [ ] Form validation works
- [ ] Payment processing succeeds
- [ ] No console errors
- [ ] Layout looks good

---

## TEST 12: Error Recovery

### Scenario 1: Lost Connection During Payment

1. Start payment
2. Disconnect internet (kill backend)
3. Try to submit
   **Expected**: Connection error shown, can retry

### Scenario 2: Session Timeout

1. Login as customer
2. Wait 1 hour (or mock timeout)
3. Try to continue to payment
   **Expected**: Re-login prompt or error

### Scenario 3: Invalid Booking ID

1. Manually visit: `/payment/999999`
2. Should see: "Booking not found" error
   **Expected**: Friendly error message

---

## SMOKE TEST (Quick 5-minute test)

Use this when you just want to quickly verify everything works:

```
1. ✅ Frontend loads at localhost:5174
2. ✅ Can view packages
3. ✅ Can create booking as guest
4. ✅ Payment page loads
5. ✅ Can select "Guest checkout"
6. ✅ Can fill billing form
7. ✅ Stripe card form renders
8. ✅ Can enter test card
9. ✅ Payment processes (success or visible error)
10. ✅ Confirmation or error shown

Time: ~5 minutes
Result: Working? ✅ YES or ❌ NO
```

---

## Bug Report Template

If you find an issue, document it:

```
ISSUE: [Title of issue]
SEVERITY: [Critical/High/Medium/Low]
STEPS TO REPRODUCE:
1. [Step 1]
2. [Step 2]
...

EXPECTED BEHAVIOR:
[What should happen]

ACTUAL BEHAVIOR:
[What actually happened]

BROWSER/ENV:
- Browser: [Chrome, Firefox, etc.]
- Device: [Desktop, Mobile]
- OS: [Windows, Mac, Linux]
- Backend: http://localhost:3000
- Frontend: http://localhost:5174

CONSOLE ERRORS:
[Paste any errors from browser console]

BACKEND LOGS:
[Paste any relevant backend logs]

SCREENSHOT/VIDEO:
[If possible, attach screenshot or video]
```

---

## Success Criteria

| Criteria                            | Pass/Fail |
| ----------------------------------- | --------- |
| Guest can book without registration | [ ]       |
| Guest can pay as guest              | [ ]       |
| Customer can login at payment       | [ ]       |
| Billing auto-fills for customers    | [ ]       |
| Payment processes successfully      | [ ]       |
| Success page shows                  | [ ]       |
| Confirmation emails sent            | [ ]       |
| Form validation works               | [ ]       |
| Back button navigates               | [ ]       |
| Mobile responsive                   | [ ]       |
| No console errors                   | [ ]       |
| **OVERALL**: ALL PASS               | [ ] ✅    |

---

## When You're Done Testing

1. Document any issues found
2. Create bug reports for critical issues
3. Note any UI/UX improvements needed
4. Test payment webhook (if applicable)
5. Verify email delivery
6. Check admin dashboard shows payments
7. Ready for production deployment!

---

**Good luck with testing! Let me know if you find any issues!** 🚀
