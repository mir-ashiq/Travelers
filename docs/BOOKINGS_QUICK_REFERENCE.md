# ⚡ Quick Reference - Bookings Admin Panel

## 📍 Navigate to Bookings

**Admin Panel** → **Bookings**

---

## 🎛️ Top Menu Buttons

```
[📥 Export] [🖨️ Print] [🔄 Refresh]
```

| Button     | Purpose                    |
| ---------- | -------------------------- |
| 📥 Export  | Download bookings as Excel |
| 🖨️ Print   | Print booking list         |
| 🔄 Refresh | Reload latest data         |

---

## 📊 Dashboard Stats (Top Cards)

```
[Total Bookings]  [✅ Confirmed]  [⏳ Pending]  [💰 Revenue]
```

Real-time counts that update with filters.

---

## 🔍 Search & Filter Bar

### Quick Filters (Always Visible)

```
[🔍 Search...] [Status ▼] [📅 Date Range ▼]
```

### Advanced Filters (Click "Show Advanced Filters")

```
[💳 Payment ▼] [🌍 Source ▼] [👤 Assignee ▼]
```

### Clear All

```
[❌ Clear Filters]
```

---

## 📋 Booking Table Columns

```
| ☑️ | 👤 Customer | 📦 Package | 📅 Travel | 💰 Amount | 💳 Payment | ✅ Status | ⚙️ Actions |
```

**Clickable Headers = Sortable** (Shows ↑ or ↓ indicator)

---

## ⚙️ Actions per Booking

### Pending Bookings

```
[👁️ View] [✅ Confirm] [❌ Cancel] [⬇️ Download]
```

### Confirmed Bookings

```
[👁️ View] [📧 Remind] [❌ Cancel] [⬇️ Download]
```

### Cancelled Bookings

```
[👁️ View] [↩️ Reactivate] [⬇️ Download]
```

---

## 📝 Detail Modal Actions

When you click the **eye icon** (👁️), you see:

### Booking Info

- ID, Status, Payment Status

### Customer Info

- Name, Email, Phone

### Package Info

- Package name, Travel date, Amount, Source

### Message (if any)

- Customer's special request

### Assignment

- Who it's assigned to
- Reassign button (future feature)

### Timeline

- Creation date
- Confirmation/Cancellation date

### Modal Buttons

```
[✅ Confirm] [❌ Cancel] [📄 Invoice] [Close]
```

_(Changes based on current status)_

---

## 🔲 Bulk Actions

### Step 1: Select Bookings

- Use ☑️ checkboxes to select individual bookings
- Or use ☑️ in header to select all

### Step 2: See Bulk Actions Bar

```
"5 bookings selected" [Clear]  [Bulk Actions ▼]
```

### Step 3: Choose Action

- ✅ Confirm Selected
- ❌ Cancel Selected
- 📥 Export Selected
- 🗑️ Delete Selected

---

## 🎯 Common Filter Combinations

| Goal                     | Steps                                       |
| ------------------------ | ------------------------------------------- |
| Find unpaid bookings     | Advanced Filters → Payment = "Pending"      |
| See recent bookings      | Date Range = "Recent Bookings"              |
| Find unassigned          | Advanced Filters → Assignee = "Unassigned"  |
| Check bookings by source | Advanced Filters → Source = "[source name]" |
| Sort by amount           | Click "Amount" column header                |
| Search customer          | Search box → Type name/email/phone          |

---

## 📧 Automatic Emails

When you:

- ✅ Confirm booking → Customer gets "Booking Confirmed" email
- ❌ Cancel booking → Customer gets "Booking Cancelled" email
- 🔄 Bulk update → All customers get status email
- 📧 Send Reminder → Reminder sent to customer

---

## 💡 Pro Tips

1. **Fast Confirmation**: Click green checkmark ✅ instead of opening modal
2. **Bulk Operations**: Select multiple bookings → Use Bulk Actions for speed
3. **Export Data**: Use Export button monthly for reporting
4. **Filter First**: Apply filters before bulk actions to avoid mistakes
5. **Sort by Amount**: Click Amount header to find high-value bookings

---

## 🔴 Status Meanings

| Status       | Color  | Meaning                    |
| ------------ | ------ | -------------------------- |
| ⏳ Pending   | Yellow | Awaiting confirmation      |
| ✅ Confirmed | Green  | Booking approved           |
| ❌ Cancelled | Red    | Booking rejected/cancelled |

---

## 💳 Payment Status Meanings

| Status      | Color  | Meaning               |
| ----------- | ------ | --------------------- |
| ✅ Paid     | Green  | Full payment received |
| ⏳ Pending  | Yellow | Awaiting payment      |
| 💰 Refunded | Blue   | Payment refunded      |

---

## 🆘 Troubleshooting

| Problem             | Solution                    |
| ------------------- | --------------------------- |
| Can't find booking  | Try Search or clear filters |
| Status won't change | Refresh page, try again     |
| Email not sent      | Check backend logs          |
| Data outdated       | Click Refresh button        |

---

## 📞 Support

- **View Details**: Click 👁️ icon for complete information
- **Send Email**: Click 📧 Remind button
- **Export Report**: Click 📥 Export button
- **Print List**: Click 🖨️ Print button

---

**Status:** ✅ All features operational
**Last Updated:** Oct 2025
