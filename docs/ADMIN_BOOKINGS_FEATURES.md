# 📋 Admin Panel - Bookings Management Features

## Overview

The Admin Panel has a comprehensive booking management system with multiple features for viewing, filtering, and managing customer bookings.

---

## 🔍 Main Features

### 1. **Booking List View**

The main table displays all bookings with:

- ✅ Customer name, email, phone
- ✅ Package details
- ✅ Travel date
- ✅ Booking amount (in ₹)
- ✅ Payment status
- ✅ Booking status
- ✅ Assignment info

### 2. **Quick Statistics Dashboard**

At the top of the page:

- **Total Bookings** - Count of all bookings
- **Confirmed** - Green badge showing confirmed bookings
- **Pending** - Yellow badge showing pending bookings
- **Total Revenue** - Calculated from all non-cancelled bookings

---

## 🔎 Search & Filter Options

### **Basic Filters** (Always Visible)

1. **Search Bar**

   - Search by: Customer name, email, package name, or phone number
   - Real-time filtering

2. **Status Filter** (Dropdown)

   - `All Statuses`
   - `Pending`
   - `Confirmed`
   - `Cancelled`

3. **Date Range Filter** (Dropdown)
   - `All Dates`
   - `Upcoming Travel` - Future travel dates
   - `Past Travel` - Completed travel dates
   - `Recent Bookings` - Created in last 7 days

### **Advanced Filters** (Hidden by default, click "Show Advanced Filters")

1. **Payment Status Filter**

   - `All Payment Statuses`
   - `Paid`
   - `Pending`
   - `Refunded`

2. **Source Filter**

   - Dynamically populated from booking sources
   - Track where bookings came from

3. **Assignee Filter**
   - `All Assignees`
   - `Unassigned`
   - Individual team member names

### **Clear Filters Button**

- Resets all active filters at once

---

## 📊 Sorting Options

Click on any column header to sort:

- ✅ **Customer** - Sort by name
- ✅ **Package** - Sort by package name
- ✅ **Travel Date** - Sort by travel date
- ✅ **Amount** - Sort by booking amount
- ✅ **Payment** - Sort by payment status
- ✅ **Status** - Sort by booking status

Indicators show sort direction (↑ ascending, ↓ descending)

---

## ✅ Individual Booking Actions

### **For Pending Bookings:**

1. **View Details** - Eye icon to see full booking information
2. **Confirm Booking** - Green checkmark icon
3. **Cancel Booking** - Red X icon
4. **Download Invoice** - Download arrow icon

### **For Confirmed Bookings:**

- Same view/download options
- Plus "Send Reminder" email option
- Option to cancel if needed

### **For Cancelled Bookings:**

- View details
- Option to reactivate
- Download invoice

---

## 🔄 Bulk Actions

Select multiple bookings using checkboxes, then:

1. **Select All** - Checkbox in header to select all filtered bookings
2. **Bulk Status Update**
   - Confirm multiple bookings at once
   - Cancel multiple bookings at once
   - Sends status emails to all customers
3. **Bulk Export** - Export selected bookings
4. **Bulk Delete** - Delete selected bookings

---

## 📝 Booking Details Modal

Click the eye icon or "View Details" to open detailed view:

### **Information Sections:**

1. **Booking ID** - Unique identifier
2. **Current Status** - Pending/Confirmed/Cancelled
3. **Payment Status** - Paid/Pending/Refunded

### **Customer Information Section:**

- Full name
- Email address
- Phone number

### **Package Details Section:**

- Package name
- Travel date
- Total amount
- Booking source

### **Message Section** (if provided)

- Customer message with booking

### **Assignment Section**

- Currently assigned to (or Unassigned)
- Reassign button (for future implementation)

### **Booking Timeline**

- Shows creation date
- Shows confirmation date (if confirmed)
- Shows cancellation date (if cancelled)

### **Action Buttons** (In Modal):

**For Pending Bookings:**

- ✅ **Confirm Booking** - Green button
- ❌ **Cancel Booking** - Red button
- 📄 **Generate Invoice**
- Close

**For Confirmed Bookings:**

- 📧 **Send Reminder** - Send email reminder
- ❌ **Cancel Booking** - Red button
- 📄 **Generate Invoice**
- Close

**For Cancelled Bookings:**

- ↩️ **Reactivate Booking** - Green button
- 📄 **Generate Invoice**
- Close

---

## 📥 Export & Print Options

### **Top-Right Buttons:**

1. **Export** - Download all filtered bookings (Excel format)
2. **Print** - Print all filtered bookings
3. **Refresh** - Reload booking data from database

---

## 📧 Email Integration

The system automatically sends emails when:

- ✅ Booking status is updated
- ✅ Bulk status change occurs
- ✅ Reminder is sent (manual)

Emails include:

- Customer name
- Package details
- Booking ID
- Travel date
- Amount
- Current status

---

## 📋 Table Columns Explained

| Column      | Content                                    | Sortable |
| ----------- | ------------------------------------------ | -------- |
| Checkbox    | Select booking(s)                          | No       |
| Customer    | Name, Email, Phone                         | Yes      |
| Package     | Package name, Booking date, Assigned to    | Yes      |
| Travel Date | When travel happens                        | Yes      |
| Amount      | Total booking amount in ₹                  | Yes      |
| Payment     | Status badge (Paid/Pending/Refunded)       | Yes      |
| Status      | Status badge (Pending/Confirmed/Cancelled) | Yes      |
| Actions     | View, Confirm, Cancel, Download buttons    | No       |

---

## 🎯 Common Workflows

### **Workflow 1: Process a New Booking**

1. Filter: Status = "Pending"
2. Click eye icon on booking
3. Review customer & package details
4. Click "Confirm Booking" button
5. Email sent automatically to customer

### **Workflow 2: Cancel Multiple Bookings**

1. Select bookings with checkboxes
2. Click "Bulk Actions"
3. Choose "Cancel Selected"
4. Confirmation emails sent to all

### **Workflow 3: Find Bookings by Source**

1. Click "Show Advanced Filters"
2. Select source from dropdown
3. View all bookings from that source
4. Apply additional filters as needed

### **Workflow 4: Check Payment Status**

1. Click "Show Advanced Filters"
2. Select Payment Status = "Pending"
3. View unpaid bookings
4. Follow up with customers

---

## 📊 Statistics & Metrics

The dashboard automatically calculates:

- **Total Bookings** - Current count in view
- **Confirmed Count** - Number of confirmed bookings
- **Pending Count** - Awaiting action
- **Cancelled Count** - Cancelled bookings
- **Total Revenue** - Sum of all confirmed booking amounts

Updates in real-time as filters are applied.

---

## 🔐 Permissions

Current implementation allows admins to:

- ✅ View all bookings
- ✅ Update booking status
- ✅ Send emails
- ✅ Filter and search
- ✅ Export data
- ✅ Manage assignments (prepared for future)

---

## 📱 Responsive Design

The booking management system works on:

- ✅ Desktop (full features)
- ✅ Tablet (responsive table)
- ✅ Mobile (simplified layout with essential info)

---

## 🚀 Future Features (Planned)

Based on code comments:

- [ ] Reassign bookings to team members
- [ ] Invoice generation (buttons in place)
- [ ] More advanced reporting
- [ ] Payment tracking integration
- [ ] Custom date range picker

---

## ⌨️ Keyboard Shortcuts (Planned)

Not yet implemented, but interface designed for:

- Sort columns by clicking header
- Multi-select with Shift+Click
- Bulk actions via dropdown menu

---

**Status:** ✅ Fully Operational
**Last Updated:** October 2025
**Total Features:** 25+ booking management features
