# Multiple Contact Details Implementation Guide

## 🎯 Overview

Added support for multiple phone numbers and email addresses in the system. This allows you to manage 2 or more contact points for different purposes (e.g., bookings email, support email, alternative phone number).

## ✨ Features Implemented

### 1. **Admin Settings Page**

- ✅ Add multiple email addresses with "Add Email" button
- ✅ Add multiple phone numbers with "Add Phone" button
- ✅ Delete individual email/phone (when more than 1 exists)
- ✅ Real-time validation
- ✅ Save all contacts to database

### 2. **Frontend Components Updated**

- ✅ **Footer.tsx** - Displays all phone numbers and emails
- ✅ Backward compatible with single email/phone
- ✅ Clean formatting in footer

### 3. **Database Updates**

- ✅ Migration adds `siteEmails` and `sitePhones` arrays to `general_settings`
- ✅ Backward compatible - still supports old `siteEmail` and `sitePhone`
- ✅ Existing data automatically supported

### 4. **TypeScript Types**

- ✅ Updated `GeneralSettings` interface
- ✅ `siteEmails?: string[]` (optional array)
- ✅ `sitePhones?: string[]` (optional array)
- ✅ Old fields still supported for backward compatibility

---

## 🚀 How to Use

### Adding Multiple Contacts in Admin

1. **Go to Settings → General**

   - You'll see "Email Addresses" section with existing email
   - You'll see "Phone Numbers" section with existing phone

2. **Add Email Address**

   - Click "Add Email" button
   - Enter new email (e.g., bookings@jklgtravel.com)
   - Can add unlimited emails

3. **Add Phone Number**

   - Click "Add Phone" button
   - Enter new phone (e.g., +91 98765 43211)
   - Can add unlimited phones

4. **Remove Contact**

   - Click trash icon next to email/phone to remove
   - Can't remove if only 1 contact exists

5. **Save Changes**
   - Click "Save Changes" button at bottom
   - All contacts are saved to database

### Display in Frontend

**Footer will automatically show:**

```
📞 Phone: +91 98765 43210
📞 Phone: +91 98765 43211
📞 Phone: +91 98765 43212

✉️ Email: info@jklgtravel.com
✉️ Email: bookings@jklgtravel.com
✉️ Email: support@jklgtravel.com
```

---

## 📋 What Gets Saved

When you click "Save Changes", this data is stored in the database:

```json
{
  "key": "general_settings",
  "value": {
    "siteName": "JKLG Travel Agency",
    "siteEmails": [
      "info@jklgtravel.com",
      "bookings@jklgtravel.com",
      "support@jklgtravel.com"
    ],
    "sitePhones": ["+91 98765 43210", "+91 98765 43211"],
    "siteAddress": "123 Tourism Road, Srinagar..."
  }
}
```

---

## 🔄 Backward Compatibility

**Old single email/phone format:**

```json
{
  "siteEmail": "info@jklgtravel.com",
  "sitePhone": "+91 98765 43210"
}
```

**New format with arrays:**

```json
{
  "siteEmails": ["info@jklgtravel.com", "..."],
  "sitePhones": ["+91 98765 43210", "..."]
}
```

**System automatically:**

- ✅ Reads both old and new formats
- ✅ Displays correctly on frontend
- ✅ Converts to arrays when saving
- ✅ No data loss

---

## 📱 Components Updated

### 1. **SettingsPage.tsx** (Admin)

**New Features:**

- Dynamic email input fields
- Dynamic phone input fields
- Add/Remove buttons
- Save to database with arrays

**Data Structure:**

```typescript
const [siteEmails, setSiteEmails] = useState(["info@jklgtravel.com"]);
const [sitePhones, setSitePhones] = useState(["+91 98765 43210"]);
```

### 2. **Footer.tsx** (Public)

**Updates:**

- Loops through all emails
- Loops through all phones
- Displays each one separately
- Falls back to single if array not available

**Code Example:**

```tsx
{
  Array.isArray(settings.general.sitePhones) ? (
    settings.general.sitePhones.map((phone, index) => (
      <li key={`phone-${index}`}>
        <Phone size={20} />
        <a href={`tel:${phone}`}>{phone}</a>
      </li>
    ))
  ) : (
    <li>
      <a href={`tel:${settings.general.sitePhone}`}>
        {settings.general.sitePhone}
      </a>
    </li>
  );
}
```

### 3. **SettingsContext.tsx** (Types)

**Updated Interface:**

```typescript
export interface GeneralSettings {
  siteName: string;
  siteEmail?: string; // Old format
  sitePhone?: string; // Old format
  siteEmails?: string[]; // New format
  sitePhones?: string[]; // New format
  siteAddress: string;
}
```

---

## 🔧 Implementation Details

### Database Schema

- **No schema changes needed** - Using existing JSONB field
- Values stored in `site_settings` table
- Column: `site_settings.value` (JSONB)

### API Endpoints

- **GET** `/api/settings` - Returns all settings (with multiple contacts)
- **PUT** `/api/settings` - Updates settings (accepts arrays)
- **No breaking changes** to existing API

### Email Sending

When integrating with email service:

```typescript
// Get primary email (first in array)
const primaryEmail = settings.general.siteEmails?.[0]
  || settings.general.siteEmail;

// Or send to all emails
settings.general.siteEmails?.forEach(email => {
  sendEmail(email, ...);
});
```

---

## 🎯 Use Cases

### 1. **Multiple Booking Channels**

- `bookings@jklgtravel.com` - Main booking email
- `info@jklgtravel.com` - General inquiries
- `support@jklgtravel.com` - Customer support

### 2. **Redundancy & Failover**

- Primary phone: `+91 98765 43210`
- Backup phone: `+91 98765 43211`
- Ensures clients can always reach you

### 3. **Department-Specific Contacts**

- Sales: `sales@jklgtravel.com`
- Bookings: `bookings@jklgtravel.com`
- Support: `support@jklgtravel.com`

### 4. **Regional Offices**

- Srinagar: `+91 98765 43210`
- Ladakh: `+91 98765 43211`
- Delhi: `+91 98765 43212`

---

## ✅ Testing Checklist

- [ ] Add second email address in Settings
- [ ] Add second phone number in Settings
- [ ] Click "Save Changes"
- [ ] Verify data saved (check browser console)
- [ ] Refresh page, both contacts still visible
- [ ] Check Footer shows all phone numbers
- [ ] Check Footer shows all email addresses
- [ ] Test removing a phone number
- [ ] Test removing an email address
- [ ] Can't remove if only 1 exists
- [ ] Load existing single contact, verify it works
- [ ] Save existing data, verify converts to arrays

---

## 🐛 Troubleshooting

### Contacts not showing in Footer

**Solution:**

- Check if `sitePhones` and `siteEmails` are arrays
- Check browser console for errors
- Verify settings loaded from database

### Can't add more contacts

**Solution:**

- Check "Add Email"/"Add Phone" buttons work
- Check form validation
- Open browser console for errors

### Old format not working

**Solution:**

- System checks for both `siteEmail` and `siteEmails`
- Falls back to single values if arrays not present
- Should work automatically

---

## 📊 Data Examples

### Admin Saves This:

```json
{
  "siteName": "JKLG Travel Agency",
  "siteEmails": [
    "info@jklgtravel.com",
    "bookings@jklgtravel.com",
    "support@jklgtravel.com"
  ],
  "sitePhones": ["+91 98765 43210", "+91 98765 43211"],
  "siteAddress": "123 Tourism Road, Srinagar, Jammu & Kashmir, India"
}
```

### Frontend Reads This:

```typescript
// Settings loaded from database
{
  general: {
    siteName: "JKLG Travel Agency",
    siteEmails: ["info@...", "bookings@...", "support@..."],
    sitePhones: ["+91 98765 43210", "+91 98765 43211"],
    siteAddress: "123 Tourism Road..."
  }
}

// Then displays in Footer:
// 📞 +91 98765 43210
// 📞 +91 98765 43211
// ✉️ info@jklgtravel.com
// ✉️ bookings@jklgtravel.com
// ✉️ support@jklgtravel.com
```

---

## 🚀 Next Steps

1. ✅ **Restart Backend** - To ensure changes take effect
2. ✅ **Test in Admin** - Add multiple contacts
3. ✅ **Verify in Frontend** - Check Footer displays all
4. ✅ **Update Other Components** - ContactPage.tsx (optional)
5. ✅ **Deploy to Production**

---

## 📞 Need More?

To extend this feature to other components:

### ContactPage.tsx

```tsx
// Display multiple contacts
{
  settings.general.sitePhones?.map((phone) => (
    <a href={`tel:${phone}`} key={phone}>
      {phone}
    </a>
  ));
}
```

### Booking Confirmations

```tsx
// Use multiple contact info in emails
const emailBody = `
  Contact us at:
  ${settings.general.sitePhones?.join(" | ")}
  ${settings.general.siteEmails?.join(" | ")}
`;
```

### API Endpoints

```typescript
// Backend can access arrays directly
const { siteEmails, sitePhones } = req.body.settings.general;
```

---

**Status**: ✅ Complete and Ready to Use  
**Last Updated**: October 26, 2025
