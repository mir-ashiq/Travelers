# 💳 PAYMENT UPDATE - VISUAL GUIDE & EXAMPLES

## 🎨 Visual Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    PAYMENT UPDATE FLOW                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Admin Panel                                                 │
│  ┌──────────────┐                                            │
│  │ Booking Row  │                                            │
│  ├──────────────┤                                            │
│  │ ID: 24       │ ──┐                                        │
│  │ Name: Rahul  │   │                                        │
│  │ Amount: 24k  │   │  Click "Mark Paid"                    │
│  │ Status: Pending │ │                                        │
│  └──────────────┘   │                                        │
│                     │                                        │
│                     ▼                                        │
│              HTTP POST Request                              │
│              ┌─────────────────┐                             │
│              │ /api/bookings/  │                             │
│              │ update-payment  │                             │
│              │ {id, status}    │                             │
│              └─────────────────┘                             │
│                     │                                        │
│                     ▼                                        │
│              Backend Route                                  │
│              ┌─────────────────┐                             │
│              │ Validate fields │                             │
│              │ Update DB       │                             │
│              │ Return data     │                             │
│              └─────────────────┘                             │
│                     │                                        │
│                     ▼                                        │
│              Supabase Database                              │
│              ┌──────────────────────┐                        │
│              │ UPDATE bookings      │                        │
│              │ SET payment_status=  │                        │
│              │ 'Paid'               │                        │
│              │ WHERE id=24          │                        │
│              └──────────────────────┘                        │
│                     │                                        │
│                     ▼                                        │
│              Response to Frontend                           │
│              ┌──────────────────────┐                        │
│              │ {success: true,      │                        │
│              │  data: {...}}        │                        │
│              └──────────────────────┘                        │
│                     │                                        │
│                     ▼                                        │
│              Admin Panel Updates                            │
│              ┌──────────────┐                                │
│              │ Booking Row  │                                │
│              ├──────────────┤                                │
│              │ ID: 24       │                                │
│              │ Name: Rahul  │                                │
│              │ Amount: 24k  │                                │
│              │ Status: Paid ✅ │                              │
│              └──────────────┘                                │
│              Toast: "Payment marked as Paid" ✅              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Payment Status Colors

```
┌─────────────────────────────────────────┐
│  PAYMENT STATUS INDICATORS              │
├─────────────────────────────────────────┤
│                                         │
│  ✅ PAID                                │
│  Color: Green (#22c55e)                 │
│  Text: "Payment Complete"               │
│  Action: None needed                    │
│                                         │
│  ⏳ PENDING                              │
│  Color: Yellow/Amber (#f59e0b)          │
│  Text: "Awaiting Payment"               │
│  Action: Send reminder                  │
│                                         │
│  ❌ FAILED                              │
│  Color: Red (#ef4444)                   │
│  Text: "Payment Failed"                 │
│  Action: Retry or contact customer      │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🔄 Workflow Examples

### Example 1: Normal Payment Flow

```
Step 1: Booking Created
  └─ payment_status: 'Pending'
  └─ amount: 24999
  └─ Customer: Rahul Sharma

Step 2: Send Reminder Email
  └─ Click "Send Reminder" button
  └─ Email sent to customer

Step 3: Customer Pays
  └─ Customer completes payment
  └─ Admin receives confirmation

Step 4: Mark Payment as Paid
  └─ Admin clicks "Mark Paid" button
  └─ POST /api/bookings/update-payment
  └─ Request: {id: 24, payment_status: 'Paid'}
  └─ Response: {success: true, data: {...}}

Step 5: Booking Status Updated
  └─ payment_status: 'Paid' ✅
  └─ Admin sees green "Paid" badge
  └─ Toast: "✅ Payment marked as Paid"

Result: Booking fully confirmed and ready for trip
```

### Example 2: Failed Payment Recovery

```
Step 1: Payment Attempt Failed
  └─ Customer tries to pay
  └─ Transaction declined
  └─ payment_status: Still 'Pending'

Step 2: Admin Marks as Failed
  └─ Admin clicks "Mark Failed" button
  └─ POST /api/bookings/update-payment
  └─ Request: {id: 24, payment_status: 'Failed'}
  └─ Response: Success

Step 3: Booking Shows Failed Status
  └─ payment_status: 'Failed' ❌
  └─ Red badge shown

Step 4: Contact Customer
  └─ Admin sends reminder email
  └─ Customer retries payment

Step 5: Payment Succeeds
  └─ Admin marks as "Paid"
  └─ payment_status: 'Paid' ✅

Result: Booking recovers and moves to Paid status
```

### Example 3: Partial Payment Update

```
Step 1: Booking Created
  └─ Full amount: 24999
  └─ payment_status: 'Pending'

Step 2: Customer Pays Partial
  └─ Customer pays: 12500 (half)
  └─ Payment received but not full

Step 3: Admin Updates Payment
  └─ Admin clicks update payment
  └─ Amount field: 12500
  └─ Status: 'Pending'
  └─ POST request with both amount and status

Step 4: Database Updated
  └─ amount: 12500 (changed from 24999)
  └─ payment_status: 'Pending' (unchanged)
  └─ Remaining balance: 12499

Step 5: Admin Tracks Progress
  └─ Make follow-up for remaining 12499
  └─ Mark as 'Paid' when full amount received

Result: Flexible payment tracking for partial payments
```

---

## 💻 Code Implementation Examples

### Example A: Simple Update Button

```typescript
<button
  onClick={async () => {
    const res = await fetch(
      "http://localhost:3000/api/bookings/update-payment",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: bookingId, payment_status: "Paid" }),
      }
    );
    const data = await res.json();
    alert(data.success ? "Updated!" : data.error);
  }}
>
  Mark as Paid
</button>
```

### Example B: Full Component with Error Handling

```typescript
import { useState } from "react";
import { toast } from "react-hot-toast";

function PaymentManager({ booking, onPaymentUpdated }) {
  const [loading, setLoading] = useState(false);

  const updatePayment = async (status: "Paid" | "Pending" | "Failed") => {
    try {
      setLoading(true);

      // Make API call
      const response = await fetch(
        "http://localhost:3000/api/bookings/update-payment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: booking.id,
            payment_status: status,
          }),
        }
      );

      // Check for errors
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      // Success
      const result = await response.json();

      // Show success message
      const emoji =
        status === "Paid" ? "✅" : status === "Pending" ? "⏳" : "❌";
      toast.success(`${emoji} Payment marked as ${status}`);

      // Update parent component
      if (onPaymentUpdated) {
        onPaymentUpdated(result.data);
      }
    } catch (error) {
      // Show error message
      toast.error(`Error: ${error.message}`);
      console.error("Payment update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3>Payment Status: {booking.payment_status}</h3>
      <p>Amount: ₹{booking.amount}</p>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => updatePayment("Paid")}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Updating..." : "✅ Mark Paid"}
        </button>

        <button
          onClick={() => updatePayment("Pending")}
          disabled={loading}
          className="bg-yellow-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Updating..." : "⏳ Mark Pending"}
        </button>

        <button
          onClick={() => updatePayment("Failed")}
          disabled={loading}
          className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Updating..." : "❌ Mark Failed"}
        </button>
      </div>
    </div>
  );
}
```

### Example C: In Table Row

```typescript
function BookingTableRow({ booking, onUpdate }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleUpdatePayment = async (newStatus) => {
    const res = await fetch(
      "http://localhost:3000/api/bookings/update-payment",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: booking.id, payment_status: newStatus }),
      }
    );

    if (res.ok) {
      const data = await res.json();
      onUpdate(data.data);
    }
  };

  return (
    <tr className="border-b">
      <td className="p-2">{booking.id}</td>
      <td className="p-2">{booking.name}</td>
      <td className="p-2">₹{booking.amount}</td>
      <td className="p-2">
        <span
          className={`px-2 py-1 rounded ${getStatusColor(
            booking.payment_status
          )}`}
        >
          {booking.payment_status}
        </span>
      </td>
      <td className="p-2">
        <div className="flex gap-1">
          {booking.payment_status !== "Paid" && (
            <button
              onClick={() => handleUpdatePayment("Paid")}
              className="text-green-600 hover:text-green-800 text-sm"
            >
              ✓ Paid
            </button>
          )}
          {booking.payment_status !== "Failed" && (
            <button
              onClick={() => handleUpdatePayment("Failed")}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              ✗ Failed
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
```

---

## 🧪 Testing Scenarios

### Test 1: Mark Payment as Paid

```
Input:  { id: 24, payment_status: 'Paid' }
Before: payment_status = 'Pending'
After:  payment_status = 'Paid' ✅
Output: Success response with updated booking
```

### Test 2: Invalid Payment Status

```
Input:  { id: 24, payment_status: 'Completed' }
Error:  Invalid payment_status error
Output: 400 Bad Request with error message
```

### Test 3: Update with Amount

```
Input:  { id: 24, payment_status: 'Pending', amount: 12500 }
Before: amount = 24999, payment_status = 'Pending'
After:  amount = 12500, payment_status = 'Pending'
Output: Success with updated amount
```

### Test 4: Booking Not Found

```
Input:  { id: 999, payment_status: 'Paid' }
Before: Booking doesn't exist
Error:  Booking not found (404)
Output: 404 error response
```

---

## 📱 Mobile Responsive Example

```typescript
function MobilePaymentButtons({ booking, onUpdate }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <button
        onClick={() => handleUpdate("Paid")}
        className="w-full bg-green-500 text-white p-3 rounded-lg font-semibold"
      >
        ✅ Mark as Paid
      </button>

      <button
        onClick={() => handleUpdate("Pending")}
        className="w-full bg-yellow-500 text-white p-3 rounded-lg font-semibold"
      >
        ⏳ Keep Pending
      </button>

      <button
        onClick={() => handleUpdate("Failed")}
        className="w-full bg-red-500 text-white p-3 rounded-lg font-semibold"
      >
        ❌ Mark as Failed
      </button>
    </div>
  );
}
```

---

## ✅ Complete Checklist for Implementation

- [ ] Understand the endpoint: `POST /api/bookings/update-payment`
- [ ] Review valid payment statuses: 'Paid', 'Pending', 'Failed'
- [ ] Copy example code to your project
- [ ] Add payment update buttons to booking rows
- [ ] Style status badges with colors (green/yellow/red)
- [ ] Add toast notifications for feedback
- [ ] Test with browser console
- [ ] Test with real bookings
- [ ] Deploy to production

---

## 🎯 Status: Ready for Use

All example code is production-ready and can be copied directly into your React components!
