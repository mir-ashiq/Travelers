# 💳 QUICK REFERENCE - Update Payment

## What's New

✅ New endpoint: `POST /api/bookings/update-payment`

---

## Quick Usage

### TypeScript Function

```typescript
async function updatePayment(
  bookingId: number,
  status: "Paid" | "Pending" | "Failed",
  amount?: number
) {
  const response = await fetch(
    "http://localhost:3000/api/bookings/update-payment",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: bookingId, payment_status: status, amount }),
    }
  );
  return response.json();
}
```

### Usage Examples

```typescript
// Mark as paid
await updatePayment(24, "Paid");

// Mark as pending
await updatePayment(24, "Pending");

// Mark as failed with new amount
await updatePayment(24, "Failed", 22999);
```

---

## Request Format

```
POST http://localhost:3000/api/bookings/update-payment
Content-Type: application/json

{
  "id": 24,
  "payment_status": "Paid",
  "amount": 24999  // optional
}
```

---

## Valid Payment Statuses

- `'Paid'` - Payment received ✅
- `'Pending'` - Awaiting payment ⏳
- `'Failed'` - Payment failed ❌

---

## Response

### Success

```json
{
  "success": true,
  "data": {
    "id": 24,
    "amount": 24999,
    "payment_status": "Paid",
    "...": "other booking fields"
  }
}
```

### Error

```json
{
  "error": "Missing required fields: id and payment_status"
}
```

---

## In React Component

```typescript
const [loading, setLoading] = useState(false);

const handlePaymentUpdate = async (bookingId: number, status: string) => {
  try {
    setLoading(true);
    const response = await fetch(
      "http://localhost:3000/api/bookings/update-payment",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: bookingId, payment_status: status }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    const result = await response.json();
    toast.success(`Payment updated to: ${status}`);
    // Refresh bookings list
    refreshBookings();
  } catch (error) {
    toast.error(`Error: ${error.message}`);
  } finally {
    setLoading(false);
  }
};
```

### Buttons in UI

```jsx
<button onClick={() => handlePaymentUpdate(booking.id, 'Paid')} disabled={loading}>
  Mark as Paid
</button>

<button onClick={() => handlePaymentUpdate(booking.id, 'Pending')} disabled={loading}>
  Mark as Pending
</button>

<button onClick={() => handlePaymentUpdate(booking.id, 'Failed')} disabled={loading}>
  Mark as Failed
</button>
```

---

## File Location

- Backend route: `backend/routes/bookings.js`
- Endpoint: `POST /api/bookings/update-payment`
- Backend server: Already registered in `backend/server.js`

---

## Testing with cURL

```bash
curl -X POST http://localhost:3000/api/bookings/update-payment \
  -H "Content-Type: application/json" \
  -d '{"id": 24, "payment_status": "Paid"}'
```

---

## Status ✅

Ready to integrate into Admin Panel!

Full details: See `PAYMENT_UPDATE_GUIDE.md`
