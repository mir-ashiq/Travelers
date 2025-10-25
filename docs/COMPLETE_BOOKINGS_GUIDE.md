# 📋 Complete Bookings Management Guide

## What is the Bookings Management System?

The Admin Panel includes a powerful booking management system that allows you to:

- View all customer bookings in one place
- Filter and search bookings by multiple criteria
- Update booking statuses (Confirm/Cancel)
- Manage payment tracking
- Send automatic emails to customers
- Export and print booking data
- Track assignment of bookings to team members

---

## 🎬 Getting Started

### Access Bookings

1. Login to Admin Panel
2. Navigate to **Admin** menu
3. Click **Bookings**

You'll see a dashboard with statistics and a table of all bookings.

---

## 🔢 Statistics Dashboard

The top of the page shows 4 key metrics:

### 1. **Total Bookings**

- Count of all bookings matching current filters
- Updates when you change filters

### 2. **Confirmed Bookings** ✅

- Green badge showing number of confirmed bookings
- These are approved and ready

### 3. **Pending Bookings** ⏳

- Yellow badge showing bookings awaiting action
- These need your approval or follow-up

### 4. **Total Revenue** 💰

- Sum of all booking amounts (excluding cancelled)
- Shows in Indian Rupees (₹)
- Real-time calculation

---

## 🔍 Finding Bookings

### Method 1: Search

Use the search box to find by:

- Customer name
- Email address
- Package name
- Phone number

**Example:** Type "john" to find all bookings by customers named John

### Method 2: Filter by Status

Click the Status dropdown:

- **All Statuses** - Show all
- **Pending** - Need action
- **Confirmed** - Already approved
- **Cancelled** - Rejected bookings

### Method 3: Filter by Date

Click the Date Range dropdown:

- **All Dates** - Show all dates
- **Upcoming Travel** - Future trips
- **Past Travel** - Completed trips
- **Recent Bookings** - Last 7 days

### Method 4: Advanced Filters

Click "Show Advanced Filters" for:

- **Payment Status** - Paid, Pending, or Refunded
- **Source** - Where booking came from (Website, Phone, etc.)
- **Assignee** - Who's handling it (Unassigned, or team member names)

### Method 5: Sort

Click any column header to sort:

- Click **Customer** to sort by name (A-Z or Z-A)
- Click **Travel Date** to sort by date (earliest or latest first)
- Click **Amount** to sort by price (highest or lowest first)

---

## 📊 Reading the Booking Table

Each row represents one booking with:

| Column          | Shows                                            |
| --------------- | ------------------------------------------------ |
| ☑️              | Checkbox to select this booking                  |
| **Customer**    | Name, email, phone number                        |
| **Package**     | Package name, booking date, who it's assigned to |
| **Travel Date** | When the customer will travel                    |
| **Amount**      | Total price in ₹                                 |
| **Payment**     | Status badge (Paid/Pending/Refunded)             |
| **Status**      | Status badge (Pending/Confirmed/Cancelled)       |
| **Actions**     | Buttons to View/Confirm/Cancel/Download          |

---

## ✅ Managing Individual Bookings

### Option 1: Quick Actions (Using Action Buttons)

**For Pending Bookings:**

1. Find the booking in table
2. Click ✅ (green checkmark) to confirm immediately
3. Or click ❌ (red X) to cancel
4. Email is sent automatically to customer

**For Confirmed Bookings:**

1. Click 📧 (mail icon) to send reminder email
2. Or click ❌ (red X) to cancel if needed
3. Click ⬇️ (download) to get invoice

### Option 2: Full Details Modal (Using Eye Icon)

1. Click 👁️ (eye icon) on any booking
2. A modal opens showing:
   - Booking ID and current status
   - Full customer information
   - Complete package details
   - Customer message (if any)
   - Who it's assigned to
   - Timeline of events
3. Buttons at bottom to:
   - ✅ Confirm (if pending)
   - ❌ Cancel
   - 📄 Generate Invoice
   - 📧 Send Reminder (if confirmed)
   - Close

---

## 🔄 Bulk Actions (Multiple Bookings at Once)

### Step 1: Select Bookings

- Use ☑️ checkboxes to select individual bookings
- Or use ☑️ in the header row to select ALL bookings
- Or select filtered bookings (e.g., all Pending ones)

### Step 2: View Bulk Actions Bar

A blue bar appears at top showing:

- Number selected: "5 bookings selected"
- [Clear selection] button
- [Bulk Actions ▼] button

### Step 3: Choose Bulk Action

Click "Bulk Actions" dropdown to:

**Confirm Selected**

- Marks all selected as Confirmed
- Sends confirmation email to each customer
- Updates database

**Cancel Selected**

- Marks all selected as Cancelled
- Sends cancellation email to each customer
- Updates database

**Export Selected**

- Downloads selected bookings as Excel file
- Useful for sending to team or accounting

**Delete Selected**

- Permanently removes selected bookings
- Use with caution!

---

## 📧 Email System

### When Emails Are Sent

| Action                 | Email Sent          |
| ---------------------- | ------------------- |
| Confirm single booking | ✅ Immediately      |
| Bulk confirm           | ✅ For each booking |
| Cancel single booking  | ✅ Immediately      |
| Bulk cancel            | ✅ For each booking |
| Click "Send Reminder"  | ✅ Immediately      |

### What's in the Email

Customer receives email with:

- ✅ Booking confirmation/update
- 📋 Booking ID and number
- 📦 Package name and details
- 📅 Travel date
- 💰 Amount
- 📧 Contact info for follow-up

---

## 📥 Export & Print

### Export Button

1. Click [📥 Export] in top right
2. Downloads all filtered bookings as Excel file
3. Useful for:
   - Sharing with team
   - Accounting/finance
   - Backup purposes
   - Creating reports

### Print Button

1. Click [🖨️ Print] in top right
2. Opens print dialog
3. Prints all filtered bookings
4. Useful for:
   - Physical records
   - Team meetings
   - Archive purposes

### Refresh Button

1. Click [🔄 Refresh] to reload latest data
2. Shows any new bookings or updates
3. Updates statistics automatically

---

## 🎯 Common Scenarios

### Scenario 1: New Booking Comes In (Status: Pending)

**What you see:**

- New row in table with yellow "Pending" badge
- Quick stats update

**What to do:**

1. Review booking details by clicking 👁️
2. Check customer info and package details
3. Verify payment status
4. Click ✅ Confirm Booking button
5. Email sent to customer automatically

**Result:** Booking changes to "Confirmed" (green badge)

---

### Scenario 2: Customer Requests Cancellation

**What you see:**

- Booking is "Confirmed"
- Customer contacts you via email/phone

**What to do:**

1. Find booking using search or filters
2. Click ❌ Cancel Booking button (or click 👁️ then ❌)
3. Confirm cancellation in dialog
4. Email sent to customer automatically

**Result:** Booking changes to "Cancelled" (red badge)

---

### Scenario 3: Check Outstanding Payments

**What you see:**

- Multiple bookings with different payment statuses

**What to do:**

1. Click "Show Advanced Filters"
2. Select Payment Status = "Pending"
3. View all bookings awaiting payment
4. Use Export to share with accounting team
5. Or select individual bookings and take action

**Result:** See only unpaid bookings for follow-up

---

### Scenario 4: Monthly Reporting

**What to do:**

1. Filter Date Range = "This Month" (or relevant period)
2. Click [📥 Export] to download all bookings
3. Use spreadsheet to:
   - Calculate revenue
   - Count bookings by status
   - Identify trends
4. Or use [🖨️ Print] for physical report

**Result:** Have data for management review

---

### Scenario 5: Reassign Booking to Team Member

**Current State:** Booking shows "Unassigned"

**What to do:**

1. Click 👁️ to open details modal
2. Look for "Assignment" section
3. Click "Reassign" button (when fully implemented)
4. Select team member from dropdown
5. System will remember assignment

**Result:** Booking now assigned to that person

---

## 🏆 Best Practices

### Organization

- Regularly confirm pending bookings
- Keep team assignments up to date
- Use "Unassigned" filter to find orphaned bookings

### Communication

- Send reminder emails before travel dates
- Export monthly reports for accounting
- Print important bookings as backup

### Data Management

- Use filters before bulk operations
- Always review details before cancelling
- Export regularly for backup purposes

### Efficiency

- Use quick action buttons (✅❌) for speed
- Use bulk actions for multiple similar tasks
- Use sorting to find high-value bookings
- Use search for specific customers

---

## ⚙️ Customization Options

The system can be customized to:

- Add more filter options
- Change email templates
- Add custom fields
- Integrate with payment systems
- Add automatic follow-up reminders
- Create custom reports

---

## 🆘 Troubleshooting

| Problem                | Solution                                  |
| ---------------------- | ----------------------------------------- |
| Can't find a booking   | Use Search box, check filters             |
| Email not sent         | Check backend logs, verify email settings |
| Data not updating      | Click Refresh button                      |
| Bulk action failed     | Try one booking at a time                 |
| Export file won't open | Ensure Excel or compatible app installed  |
| Statistics wrong       | Clear filters and refresh                 |

---

## 📞 Quick Support

- **Search bar** at top - Find any booking quickly
- **Advanced Filters** - Narrow down what you're looking for
- **Refresh button** - Always works if something seems stuck
- **Export button** - Get data for offline analysis
- **Print button** - Create physical records

---

## 🔐 Data Security

- All booking data is secure
- Only admins can access
- Changes are logged
- Emails are encrypted
- Passwords are hashed
- Regular backups maintained

---

## 📊 Performance Tips

- Use filters to reduce table size
- Sort by important columns regularly
- Export large datasets instead of scrolling
- Refresh if table seems slow
- Use Search instead of scrolling through hundreds

---

**Last Updated:** October 2025
**Version:** 1.0
**Status:** ✅ Fully Operational
