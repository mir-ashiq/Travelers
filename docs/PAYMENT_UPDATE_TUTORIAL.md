# 💳 HOW TO UPDATE PAYMENT IN BOOKING - Complete Tutorial

## 📌 Overview

I've created a new API endpoint that allows you to update payment status and amount for any booking. This is perfect for your admin panel to manage customer payments.

---

## 🎯 What You Can Do

✅ Mark booking payment as **Paid**
✅ Mark booking payment as **Pending**
✅ Mark booking payment as **Failed**
✅ Update the booking amount (optional)
✅ Automatic error handling and validation

---

## 🔗 API Endpoint

### Endpoint Details

```
Method:   POST
URL:      http://localhost:3000/api/bookings/update-payment
Header:   Content-Type: application/json
```

### Required Fields

```javascript
{
  "id": 24,                    // Booking ID (required)
  "payment_status": "Paid",    // 'Paid' | 'Pending' | 'Failed' (required)
  "amount": 24999              // New amount in rupees (optional)
}
```

---

## 💻 Code Examples

### Example 1: JavaScript Fetch

```javascript
// Mark payment as paid
fetch("http://localhost:3000/api/bookings/update-payment", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    id: 24,
    payment_status: "Paid",
  }),
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

### Example 2: React Hook

```typescript
import { useState } from "react";
import { toast } from "react-hot-toast";

function BookingPaymentButton({ bookingId, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const updatePayment = async (status: "Paid" | "Pending" | "Failed") => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:3000/api/bookings/update-payment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: bookingId,
            payment_status: status,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      const result = await response.json();
      toast.success(`✅ Payment marked as ${status}`);
      if (onSuccess) onSuccess(result.data);
    } catch (error) {
      toast.error(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => updatePayment("Paid")}
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Mark Paid
      </button>
      <button
        onClick={() => updatePayment("Pending")}
        disabled={loading}
        className="bg-yellow-500 text-white px-4 py-2 rounded"
      >
        Mark Pending
      </button>
      <button
        onClick={() => updatePayment("Failed")}
        disabled={loading}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Mark Failed
      </button>
    </div>
  );
}
```

### Example 3: Update with New Amount

```javascript
// When customer pays partial amount
fetch("http://localhost:3000/api/bookings/update-payment", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    id: 24,
    payment_status: "Pending",
    amount: 12500, // Partial payment: 12500 out of 24999
  }),
})
  .then((res) => res.json())
  .then((data) => console.log("✅ Payment updated:", data.data));
```

### Example 4: cURL Command

```bash
# Mark as paid
curl -X POST http://localhost:3000/api/bookings/update-payment \
  -H "Content-Type: application/json" \
  -d '{"id": 24, "payment_status": "Paid"}'

# Mark as failed with amount
curl -X POST http://localhost:3000/api/bookings/update-payment \
  -H "Content-Type: application/json" \
  -d '{"id": 24, "payment_status": "Failed", "amount": 22999}'
```

---

## 📊 Payment Statuses

| Status      | Meaning                       | Use When                             |
| ----------- | ----------------------------- | ------------------------------------ |
| `'Paid'`    | ✅ Payment received in full   | Customer has completed payment       |
| `'Pending'` | ⏳ Awaiting payment           | Booking created, waiting for payment |
| `'Failed'`  | ❌ Payment did not go through | Transaction declined or error        |

---

## 📝 Response Format

### Success Response (Status 200)

```json
{
  "success": true,
  "data": {
    "id": 24,
    "name": "Rahul Sharma",
    "email": "rahul.sharma@example.com",
    "phone": "+91 98765 43214",
    "package": "Kashmir Bliss: 6 Days Tour",
    "travel_date": "2025-07-15",
    "amount": 24999,
    "payment_status": "Paid",
    "status": "Confirmed",
    "assigned_to": null,
    "created_at": "2025-06-01T10:30:00Z"
  }
}
```

### Error Response (Status 400)

```json
{
  "error": "Invalid payment_status. Must be one of: Paid, Pending, Failed"
}
```

---

## 🔍 Common Errors & Solutions

### Error: "Missing required fields: id and payment_status"

**Cause:** You didn't provide id or payment_status
**Fix:** Include both fields:

```javascript
{ id: 24, payment_status: 'Paid' }
```

### Error: "Invalid payment_status. Must be one of: Paid, Pending, Failed"

**Cause:** Wrong payment status string
**Fix:** Use exact spelling (case-sensitive):

```javascript
"Paid"; // ✅ Correct
"paid"; // ❌ Wrong (lowercase)
"Completed"; // ❌ Wrong (not valid)
```

### Error: "Booking not found"

**Cause:** Booking ID doesn't exist
**Fix:** Verify the booking ID exists in database

### Error: "Failed to update payment"

**Cause:** Server error
**Fix:**

1. Check backend is running: `curl http://localhost:3000/api/health`
2. Check environment variables are set
3. Check Supabase connection

---

## 🎨 Integration in Admin Panel

### Step 1: Create Helper Function

```typescript
// bookingService.ts
export async function updateBookingPayment(
  bookingId: number,
  paymentStatus: "Paid" | "Pending" | "Failed",
  amount?: number
) {
  const response = await fetch(
    "http://localhost:3000/api/bookings/update-payment",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: bookingId,
        payment_status: paymentStatus,
        ...(amount && { amount }),
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
}
```

### Step 2: Use in Component

```typescript
// BookingsPage.tsx
import { updateBookingPayment } from "../services/bookingService";
import { toast } from "react-hot-toast";

function BookingRow({ booking }) {
  const handlePaymentUpdate = async (status: string) => {
    try {
      await updateBookingPayment(booking.id, status);
      toast.success(`Payment updated to ${status}`);
      // Refresh bookings list
      refreshBookings();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <tr>
      <td>{booking.name}</td>
      <td>{booking.amount}</td>
      <td>
        <span
          className={`badge ${
            booking.payment_status === "Paid" ? "bg-green" : "bg-yellow"
          }`}
        >
          {booking.payment_status}
        </span>
      </td>
      <td>
        <button onClick={() => handlePaymentUpdate("Paid")}>Mark Paid</button>
        <button onClick={() => handlePaymentUpdate("Pending")}>
          Mark Pending
        </button>
        <button onClick={() => handlePaymentUpdate("Failed")}>
          Mark Failed
        </button>
      </td>
    </tr>
  );
}
```

---

## 🗄️ Database Details

### Bookings Table - Payment Fields

```
Column Name:    amount
Data Type:      INTEGER
Description:    Booking amount in rupees
Example:        24999

Column Name:    payment_status
Data Type:      TEXT
Allowed Values: 'Paid', 'Pending', 'Failed'
Example:        'Paid'
```

### What Gets Updated

```sql
UPDATE bookings
SET
  payment_status = 'Paid',
  amount = 24999  -- optional
WHERE id = 24;
```

---

## ✅ Implementation Checklist

- [x] Backend endpoint created: `POST /api/bookings/update-payment`
- [x] Validation implemented (id, payment_status required)
- [x] Error handling with proper error messages
- [x] Endpoint registered in server
- [ ] Integrate into Admin Panel UI
- [ ] Add payment update buttons to booking rows
- [ ] Add payment status badges to show current status
- [ ] Add toast notifications for feedback
- [ ] Test with real bookings
- [ ] Deploy to production

---

## 🚀 Next Steps

1. **Integrate into Admin Panel** - Add buttons for payment updates
2. **Add UI Components** - Payment status badges, update buttons
3. **Test Thoroughly** - Verify all statuses work
4. **Deploy** - Push to production when ready

---

## 📚 Documentation Files

- `PAYMENT_UPDATE_GUIDE.md` - Full technical documentation
- `PAYMENT_UPDATE_QUICK_REF.md` - Quick reference
- `PAYMENT_UPDATE_TUTORIAL.md` - This file

---

## 🔧 File Locations

| File           | Location                     | Changes                             |
| -------------- | ---------------------------- | ----------------------------------- |
| Bookings Route | `backend/routes/bookings.js` | Added new endpoint (lines 104-151)  |
| Server Config  | `backend/server.js`          | Already registers bookings route ✅ |
| Database       | Supabase bookings table      | Fields already exist ✅             |

---

## Status: ✅ READY TO USE

The endpoint is fully implemented and ready for integration into your Admin Panel!

**All 5 Booking Management Features:**

1. ✅ Send Reminder Email
2. ✅ Download Invoice
3. ✅ Generate Invoice
4. ✅ Reassign to Team Member
5. ✅ **Update Payment** (NEW!)
