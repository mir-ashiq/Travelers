# ⚠️ Non-Functional Features Analysis

## Current Status

These 4 features have **UI buttons but no functionality**:

1. ✗ **Send Reminder Email** - Button exists, no onClick handler
2. ✗ **Download Invoice** - Button exists, no onClick handler
3. ✗ **Generate Invoice** - Button exists, no onClick handler
4. ✗ **Reassign to Team Member** - Button exists, no onClick handler (only has empty onClick={() => {}})

## Issues Found

### 1. Send Reminder Email

**Location:** Modal footer for Confirmed bookings
**Problem:** Button has no onClick handler

```tsx
<button
  type="button"
  className="..."
  // Missing onClick handler!
>
  <Mail size={18} className="mr-2" />
  Send Reminder
</button>
```

**What needs to be done:** Add functionality to send email reminder to customer

---

### 2. Download Invoice

**Location:** Table row actions
**Problem:** Button has no onClick handler

```tsx
<button
  className="p-1 text-gray-600 hover:text-gray-900"
  title="Download Invoice"
  // Missing onClick handler!
>
  <ArrowDownToLine size={18} />
</button>
```

**What needs to be done:** Add functionality to download/generate invoice PDF

---

### 3. Generate Invoice

**Location:** Modal footer (all statuses)
**Problem:** Button has no onClick handler

```tsx
<button
  type="button"
  className="..."
  // Missing onClick handler!
>
  <FileText size={18} className="mr-2" />
  Generate Invoice
</button>
```

**What needs to be done:** Add functionality to generate invoice (display as PDF or download)

---

### 4. Reassign to Team Member

**Location:** Modal - Assignment section
**Problem:** Button has empty onClick handler, no dropdown menu

```tsx
<button
  onClick={() => {}} // Empty handler!
  className="..."
>
  Reassign
  <ChevronDown size={16} className="ml-1" />
</button>;
{
  /* Dropdown menu would go here */
}
```

**What needs to be done:**

- Implement dropdown menu to select team members
- Add backend API call to update assignment
- Show confirmation/success message

---

## Implementation Roadmap

### Phase 1: Send Reminder Email (Easy)

- Get booking data
- Call existing email service
- Show toast notification

### Phase 2: Reassign to Team Member (Easy)

- Create dropdown menu with team members
- Add API endpoint to update assignment
- Call endpoint and show confirmation

### Phase 3: Download Invoice (Medium)

- Generate invoice PDF from booking data
- Trigger browser download
- Or create backend endpoint to serve PDF

### Phase 4: Generate Invoice (Medium)

- Create invoice template
- Populate with booking data
- Display as PDF or download

---

## Recommended Approach

### For Send Reminder Email:

1. Create function: `sendReminderEmail(booking)`
2. Use existing Supabase or backend email service
3. Show success/error toast

### For Reassign:

1. Create dropdown with available team members
2. Add state to track selected assignee
3. Create backend API: `PATCH /api/bookings/:id/assign`
4. Call API and update local state

### For Invoice:

1. Create invoice template component
2. Populate with booking data
3. Use library like `jspdf` or `html2pdf` to convert to PDF
4. Trigger download

---

## Next Steps

Would you like me to:

1. ✅ Implement all 4 features?
2. ✅ Implement specific features first?
3. ✅ Get more details on what the invoice should look like?
4. ✅ Get list of team members to populate in Reassign dropdown?

---

**Status:** Ready to implement
**Complexity:** Easy to Medium
**Time Estimate:** 1-2 hours for all 4 features
