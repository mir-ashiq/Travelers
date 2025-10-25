# 💳 UPDATE PAYMENT IN BOOKING - Complete Guide

## Overview

Update payment status and/or amount for any booking. Supports three payment statuses: Paid, Pending, Failed.

---

## API Endpoint

### Endpoint

```
POST /api/bookings/update-payment
```

### Base URL

```
http://localhost:3000/api/bookings/update-payment
```

### Full URL Example

```
http://localhost:3000/api/bookings/update-payment
```

---

## Request Format

### Headers

```
Content-Type: application/json
```

### Body Parameters

| Parameter        | Type   | Required | Description                               |
| ---------------- | ------ | -------- | ----------------------------------------- |
| `id`             | number | YES      | Booking ID to update                      |
| `payment_status` | string | YES      | One of: `'Paid'`, `'Pending'`, `'Failed'` |
| `amount`         | number | NO       | New amount in rupees (optional)           |

### Example Requests

#### Example 1: Mark Payment as Paid

```javascript
const response = await fetch(
  "http://localhost:3000/api/bookings/update-payment",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: 24,
      payment_status: "Paid",
    }),
  }
);
const result = await response.json();
console.log(result);
```

#### Example 2: Mark Payment as Failed with Updated Amount

```javascript
const response = await fetch(
  "http://localhost:3000/api/bookings/update-payment",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: 24,
      payment_status: "Failed",
      amount: 22999, // Updated amount
    }),
  }
);
```

#### Example 3: Mark Payment as Pending

```javascript
const response = await fetch(
  "http://localhost:3000/api/bookings/update-payment",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: 24,
      payment_status: "Pending",
    }),
  }
);
```

---

## Response Format

### Success Response (200 OK)

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
    "booking_date": "2025-06-01",
    "amount": 24999,
    "status": "Confirmed",
    "message": "Looking forward to the trip!",
    "payment_status": "Paid",
    "source": "Website",
    "assigned_to": null,
    "created_at": "2025-06-01T10:30:00Z"
  }
}
```

### Error Responses

#### Missing Required Fields (400)

```json
{
  "error": "Missing required fields: id and payment_status"
}
```

#### Invalid Payment Status (400)

```json
{
  "error": "Invalid payment_status. Must be one of: Paid, Pending, Failed"
}
```

#### Booking Not Found (404)

```json
{
  "error": "Booking not found"
}
```

#### Server Error (500)

```json
{
  "error": "Failed to update payment"
}
```

---

## Valid Payment Statuses

| Status      | Meaning          | Use Case                          |
| ----------- | ---------------- | --------------------------------- |
| `'Paid'`    | Payment received | Customer paid in full             |
| `'Pending'` | Awaiting payment | Waiting for customer payment      |
| `'Failed'`  | Payment failed   | Transaction declined/unsuccessful |

---

## Usage Examples

### Frontend TypeScript (React)

#### Simple Payment Update Function

```typescript
async function updateBookingPayment(
  bookingId: number,
  status: "Paid" | "Pending" | "Failed",
  newAmount?: number
) {
  try {
    const response = await fetch(
      "http://localhost:3000/api/bookings/update-payment",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: bookingId,
          payment_status: status,
          ...(newAmount && { amount: newAmount }),
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    const result = await response.json();
    console.log("✅ Payment updated:", result.data);
    return result.data;
  } catch (error) {
    console.error("❌ Failed to update payment:", error);
    throw error;
  }
}
```

#### Usage in Component

```typescript
// Mark payment as paid
await updateBookingPayment(24, "Paid");

// Mark payment as pending
await updateBookingPayment(24, "Pending");

// Mark payment as failed with new amount
await updateBookingPayment(24, "Failed", 22999);
```

#### In Admin Panel Button Click

```typescript
const handleMarkAsPaid = async (bookingId: number) => {
  try {
    await updateBookingPayment(bookingId, "Paid");
    toast.success("Payment marked as Paid");
    // Refresh booking list
    refreshBookings();
  } catch (error) {
    toast.error("Failed to update payment");
  }
};
```

---

## Using with cURL

### Mark as Paid

```bash
curl -X POST http://localhost:3000/api/bookings/update-payment \
  -H "Content-Type: application/json" \
  -d '{
    "id": 24,
    "payment_status": "Paid"
  }'
```

### Mark as Failed with Amount Update

```bash
curl -X POST http://localhost:3000/api/bookings/update-payment \
  -H "Content-Type: application/json" \
  -d '{
    "id": 24,
    "payment_status": "Failed",
    "amount": 22999
  }'
```

### Mark as Pending

```bash
curl -X POST http://localhost:3000/api/bookings/update-payment \
  -H "Content-Type: application/json" \
  -d '{
    "id": 24,
    "payment_status": "Pending"
  }'
```

---

## Database Update Details

### What Gets Updated

When you call this endpoint:

```javascript
{
  id: 24,
  payment_status: 'Paid',
  amount: 24999
}
```

The database updates:

```sql
UPDATE bookings
SET
  payment_status = 'Paid',
  amount = 24999
WHERE id = 24;
```

### Fields Updated

- **payment_status**: Always updated (required)
- **amount**: Only updated if provided and > 0 (optional)

---

## Integration in Admin Panel

### Button Examples

#### Button to Mark as Paid

```typescript
<button
  onClick={() => updateBookingPayment(booking.id, "Paid")}
  className="bg-green-500 text-white px-4 py-2 rounded"
>
  Mark as Paid
</button>
```

#### Button to Mark as Pending

```typescript
<button
  onClick={() => updateBookingPayment(booking.id, "Pending")}
  className="bg-yellow-500 text-white px-4 py-2 rounded"
>
  Mark as Pending
</button>
```

#### Button to Mark as Failed

```typescript
<button
  onClick={() => updateBookingPayment(booking.id, "Failed")}
  className="bg-red-500 text-white px-4 py-2 rounded"
>
  Mark as Failed
</button>
```

### Status Badge Component

```typescript
function PaymentStatusBadge({ status }) {
  const colors = {
    Paid: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Failed: "bg-red-100 text-red-800",
  };

  return (
    <span className={`px-2 py-1 rounded ${colors[status]}`}>{status}</span>
  );
}
```

---

## Error Handling

### Complete Error Handler

```typescript
async function updatePaymentWithErrorHandling(
  bookingId: number,
  status: string,
  amount?: number
) {
  try {
    const response = await fetch(
      "http://localhost:3000/api/bookings/update-payment",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: bookingId, payment_status: status, amount }),
      }
    );

    if (response.status === 400) {
      const error = await response.json();
      console.error("Validation Error:", error.error);
      throw new Error(error.error);
    }

    if (response.status === 404) {
      throw new Error("Booking not found");
    }

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Payment Update Failed:", error.message);
    throw error;
  }
}
```

---

## Testing the Endpoint

### Test 1: Verify Endpoint Works

```bash
# Test if backend is running
curl http://localhost:3000/api/health

# Should return:
# {"status":"ok","timestamp":"...","uptime":...}
```

### Test 2: Update a Real Booking

```javascript
// In browser console:
fetch("http://localhost:3000/api/bookings/update-payment", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ id: 24, payment_status: "Paid" }),
})
  .then((r) => r.json())
  .then((d) => console.log(d));
```

### Test 3: Verify in Database

After updating, check Supabase:

1. Go to Supabase Dashboard
2. Select bookings table
3. Find the booking by ID
4. Verify payment_status column shows new value

---

## Database Fields Reference

### Bookings Table - Payment Fields

| Column           | Type    | Constraints                                   | Default |
| ---------------- | ------- | --------------------------------------------- | ------- |
| `amount`         | INTEGER | NOT NULL                                      | -       |
| `payment_status` | TEXT    | CHECK status IN ('Paid', 'Pending', 'Failed') | -       |

### Sample Data

```
ID  | Amount | Status   | Updated
----|--------|----------|----------
24  | 24999  | Paid     | 2025-06-15
25  | 34999  | Pending  | 2025-06-14
26  | 22999  | Failed   | 2025-06-13
```

---

## Common Workflows

### Workflow 1: Customer Pays In Full

```
1. Booking created → payment_status: 'Pending', amount: 24999
2. Customer makes payment
3. Admin receives confirmation
4. Call: updateBookingPayment(24, 'Paid')
5. Result: payment_status changed to 'Paid' ✅
```

### Workflow 2: Partial Payment

```
1. Booking created → amount: 24999, payment_status: 'Pending'
2. Customer pays partial: 12500
3. Admin updates: updateBookingPayment(24, 'Pending', 12500)
4. Result: amount updated to 12500, status stays Pending
```

### Workflow 3: Payment Failed

```
1. Customer attempts payment
2. Payment declined/failed
3. Admin marks: updateBookingPayment(24, 'Failed')
4. Result: payment_status changed to 'Failed' ⚠️
5. Admin can retry or update amount and try again
```

---

## Backend Implementation

### Endpoint Added to:

```
backend/routes/bookings.js → router.post('/update-payment', ...)
```

### How It Works

1. Validates required fields (id, payment_status)
2. Validates payment_status is one of allowed values
3. Optionally validates and updates amount
4. Updates database via Supabase
5. Returns updated booking data
6. Logs success/error messages

### Validation Rules

- ✅ id must be provided
- ✅ payment_status must be provided
- ✅ payment_status must be: 'Paid', 'Pending', or 'Failed'
- ✅ amount (if provided) must be > 0
- ✅ Booking must exist in database

---

## Status

✅ **Endpoint Created and Ready to Use**

All 4 booking features now include payment management:

1. ✅ Send Reminder Email
2. ✅ Download Invoice
3. ✅ Generate Invoice
4. ✅ Reassign to Team Member
5. ✅ **Update Payment** (NEW)

---

## Next Steps

1. **Integrate into Admin Panel UI** - Add payment update buttons
2. **Add Toast Notifications** - Show success/error messages
3. **Refresh Booking List** - After payment update
4. **Log Payment Changes** - Track who updated payment and when

See examples above for React/TypeScript integration!
