# 📞 Multiple Contact Details - Quick Reference

## ⚡ TL;DR

You can now add **2+ phone numbers and emails** in admin settings. They automatically appear in Footer and Contact pages.

---

## 🎯 Quick Start (2 minutes)

### Step 1: Open Settings

- Go to Admin Dashboard
- Click **Settings**
- Select **General** tab

### Step 2: Add Contacts

**For Emails:**

```
Current: info@jklgtravel.com
Action: Click [+ Add Email]
Result: New empty field appears
Action: Type "bookings@jklgtravel.com"
Action: Click [+ Add Email] again
Result: Another field, type "support@jklgtravel.com"
```

**For Phones:**

```
Current: +91 98765 43210
Action: Click [+ Add Phone]
Result: New empty field appears
Action: Type "+91 98765 43211"
```

### Step 3: Save

```
Click [Save Changes] at bottom
✅ Success message appears
✅ Data saved to database
```

### Step 4: Verify

- Check **Footer** → All phones/emails show
- Check **Contact Page** → All phones/emails show
- Refresh page → Data still there

---

## 📊 What You'll See

### In Admin (Settings → General)

```
┌─────────────────────────────────────┐
│ Email Addresses                 [+] │
│ ┌─────────────────────────────────┐ │
│ │ info@jklgtravel.com         [×] │ │
│ │ bookings@jklgtravel.com     [×] │ │
│ │ support@jklgtravel.com      [×] │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Phone Numbers                   [+] │
│ ┌─────────────────────────────────┐ │
│ │ +91 98765 43210             [×] │ │
│ │ +91 98765 43211             [×] │ │
│ │ +91 98765 43212             [×] │ │
│ └─────────────────────────────────┘ │
│                                     │
│            [Save Changes]           │
└─────────────────────────────────────┘
```

### In Footer (Public)

```
Contact Us
─────────────────────
📞 +91 98765 43210
📞 +91 98765 43211
📞 +91 98765 43212

✉️ info@jklgtravel.com
✉️ bookings@jklgtravel.com
✉️ support@jklgtravel.com
```

### In Contact Page

```
Call Us:
  +91 98765 43210
  +91 98765 43211
  +91 98765 43212

Email Us:
  info@jklgtravel.com
  bookings@jklgtravel.com
  support@jklgtravel.com
```

---

## ✅ Features

| Feature                   | Status |
| ------------------------- | ------ |
| Add multiple emails       | ✅     |
| Add multiple phones       | ✅     |
| Delete individual contact | ✅     |
| Display in Footer         | ✅     |
| Display in Contact Page   | ✅     |
| Save to database          | ✅     |
| Works on page refresh     | ✅     |
| Backward compatible       | ✅     |
| All emails clickable      | ✅     |
| All phones clickable      | ✅     |

---

## 🎮 Controls

### Add Button

```
Click [+ Add Email] or [+ Add Phone]
→ New empty field appears
→ Type contact info
→ Repeat to add more
```

### Delete Button

```
Click [×] next to contact
→ That contact is removed
(Only shows if 2+ contacts exist)
```

### Save Button

```
Click [Save Changes]
→ All contacts saved to database
→ Success message appears
→ Data persists on reload
```

---

## 💾 Where Data is Stored

```
Database: Supabase
Table: site_settings
Key: general_settings
Format: JSONB (JSON)

Data Structure:
{
  "siteEmails": ["email1", "email2", ...],
  "sitePhones": ["phone1", "phone2", ...]
}
```

---

## ❓ FAQ

**Q: How many contacts can I add?**
A: Unlimited! Add as many as needed.

**Q: Do changes appear immediately?**
A: After clicking [Save Changes], yes!

**Q: What if I only want 1 email?**
A: Leave it as is. Delete button won't show if only 1 exists.

**Q: Can I change the order?**
A: Delete and re-add in desired order.

**Q: Are old settings lost?**
A: No! Old single email/phone formats still work.

**Q: Do I need to restart backend?**
A: No, changes appear immediately.

**Q: Will booking emails use all addresses?**
A: Booking emails use the primary (first) address. You can customize routing in the backend if needed.

**Q: Can customers choose which number to call?**
A: All numbers are displayed. You can add notes like "+91 98765 43210 (Bookings)" to help routing.

---

## 🧪 Quick Test

1. Add 2 emails in admin
2. Click Save
3. Go to website Footer
4. Verify both emails appear
5. Click on email → Should open mailto link
6. Refresh page → Emails still there
7. Check Contact page → Both emails show
8. Click on phone → Should dial (on mobile)

---

## 🚀 Use Cases

### Scenario 1: Multiple Departments

```
Bookings: bookings@jklgtravel.com
Support: support@jklgtravel.com
General: info@jklgtravel.com
```

### Scenario 2: Multiple Locations

```
Srinagar: +91 98765 43210
Ladakh: +91 98765 43211
Delhi: +91 98765 43212
```

### Scenario 3: Backup Contacts

```
Primary: +91 98765 43210
Backup: +91 98765 43211
```

---

## 🛠️ Troubleshooting

| Issue                  | Solution                      |
| ---------------------- | ----------------------------- |
| New email not showing  | Check Save button was clicked |
| Delete button hidden   | Need 2+ contacts to delete    |
| Footer not showing all | Refresh page, check console   |
| Save not working       | Check internet connection     |
| Data reverted          | Refresh page, check was saved |

---

## 📱 Mobile Friendly

✅ Works on mobile
✅ Touch-friendly buttons
✅ Responsive layout
✅ Easy to add/remove
✅ Phone numbers clickable (tel: links)
✅ Emails clickable (mailto: links)

---

## 🎯 Summary

```
😎 Easy: Just click [+ Add] button
✅ Works: Saves to database immediately
🎨 Pretty: Auto-displays in Footer
📱 Mobile: Works on all devices
🔄 Smart: Backward compatible
🚀 Ready: Production-ready now
```

**Status**: ✅ LIVE AND WORKING

---

**For more details, see**: `MULTIPLE_CONTACT_DETAILS_GUIDE.md`
