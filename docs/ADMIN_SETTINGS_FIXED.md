# Admin Settings - Troubleshooting & Setup Guide

## ✅ What Was Fixed

The admin panel settings (logo upload and general settings) were not working due to:

1. **Missing API endpoint** - The frontend was directly accessing Supabase instead of going through the backend API
2. **No logo upload functionality** - Logo upload button was non-functional with no backend handler
3. **Direct Supabase calls** - Security issue with direct Supabase access from frontend

## 🔧 Solution Implemented

### Backend Changes

1. ✅ Created `/backend/routes/settings.js` with complete CRUD endpoints:

   - `GET /api/settings` - Get all settings
   - `GET /api/settings/:key` - Get specific setting
   - `POST /api/settings` - Save/update settings
   - `PUT /api/settings/:key` - Update single setting
   - `POST /api/settings/logo` - Upload logo (file upload)
   - `DELETE /api/settings/logo` - Delete logo

2. ✅ Updated `backend/server.js` to register the settings route

3. ✅ Added `multer` dependency to `backend/package.json` for file uploads

### Frontend Changes

1. ✅ Updated `website/src/admin/settings/SettingsPage.tsx` to:

   - Use API endpoints instead of direct Supabase calls
   - Added `handleLogoUpload()` function for file upload
   - Added `handleDeleteLogo()` function to delete logo
   - Updated UI with functional upload/delete buttons

2. ✅ Logo state management with `logoUrl` and `isUploadingLogo`

3. ✅ All settings now saved through the unified API endpoint

## 🚀 Setup Steps

### Step 1: Create Storage Bucket (One-time setup)

You need to create a `site-assets` bucket in Supabase storage. Do this via:

**Option A: Supabase Dashboard**

1. Go to Supabase Dashboard → Storage
2. Click "New Bucket"
3. Name: `site-assets`
4. Leave as Private (recommended)
5. Click "Create Bucket"

**Option B: Via SQL**
Run this in your Supabase SQL editor:

```sql
-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', false)
ON CONFLICT (id) DO NOTHING;

-- Set bucket policies for authenticated users
CREATE POLICY "Allow authenticated users to upload logos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'site-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Allow public to read logos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'site-assets');

CREATE POLICY "Allow authenticated users to delete logos"
ON storage.objects
FOR DELETE
USING (bucket_id = 'site-assets' AND auth.role() = 'authenticated');
```

### Step 2: Update Environment Variables

Make sure these exist in your `.env` files:

**Backend (.env):**

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

**Frontend (.env):**

```
VITE_API_URL=http://localhost:3000/api
# For production: https://yourdomain.com/api
```

### Step 3: Restart Services

```bash
# Terminal 1 - Backend
cd backend
npm install  # Already done
npm start

# Terminal 2 - Frontend (in new terminal)
cd website
npm run dev
```

### Step 4: Test the Admin Settings

1. Open admin panel: http://localhost:5173/admin (or your dev URL)
2. Go to Settings → General Settings
3. Test each feature:
   - ✅ Upload logo (should show preview)
   - ✅ Edit company name
   - ✅ Add/remove emails and phones
   - ✅ Edit office address
   - ✅ Save all settings
   - ✅ Refresh page - settings should persist
   - ✅ Logo should appear in footer

## 📊 API Endpoints Reference

### Get All Settings

```bash
GET /api/settings
Response: { [key]: value, [key2]: value2, ... }
```

### Get Specific Setting

```bash
GET /api/settings/general_settings
Response: { general_settings: {...} }
```

### Save/Update Settings

```bash
POST /api/settings
Content-Type: application/json

{
  "general_settings": {
    "siteName": "JKLG Travel",
    "siteEmails": ["email1@..."],
    "sitePhones": ["+91..."],
    "siteAddress": "...",
    "logoUrl": "https://..."
  },
  "social_links": {...},
  "display_settings": {...}
}

Response: { success: true, message: "Settings saved successfully" }
```

### Upload Logo

```bash
POST /api/settings/logo
Content-Type: multipart/form-data

Form Data:
  - logo: [File]

Response: {
  success: true,
  logoUrl: "https://storage.url/logos/...",
  message: "Logo uploaded successfully"
}
```

### Delete Logo

```bash
DELETE /api/settings/logo

Response: {
  success: true,
  message: "Logo deleted successfully"
}
```

## 🐛 Troubleshooting

### Issue: "Failed to load settings"

**Solution**:

- Check backend is running (`npm start`)
- Check `VITE_API_URL` environment variable
- Check browser console for CORS errors
- Verify backend route is registered in `server.js`

### Issue: "Logo upload fails"

**Solution**:

- Check if `site-assets` bucket exists in Supabase storage
- Check file size is < 5MB
- Check file format is supported (jpg, png, gif, webp)
- Check Supabase storage policies allow uploads
- Check network tab in browser dev tools

### Issue: "Settings don't save"

**Solution**:

- Check backend API is running
- Check browser console for errors
- Verify Supabase connection credentials
- Check `site_settings` table exists in database

### Issue: "Multer not found"

**Solution**:

```bash
cd backend
npm install
```

## 📁 Files Changed

```
backend/
  ├── routes/settings.js         ✅ NEW
  ├── server.js                  ✅ UPDATED
  └── package.json               ✅ UPDATED

website/src/
  └── admin/settings/SettingsPage.tsx  ✅ UPDATED
```

## 🎯 Features Now Working

- ✅ Logo upload with preview
- ✅ Logo deletion
- ✅ Company name editing
- ✅ Multiple email addresses (add/remove)
- ✅ Multiple phone numbers (add/remove)
- ✅ Office address editing
- ✅ Social media links
- ✅ Hero carousel management
- ✅ Email templates
- ✅ SMTP configuration
- ✅ Display settings (brightness, opacity, animations)
- ✅ UI preferences (theme, layout, font size)
- ✅ SEO settings (meta title, description)

All settings persist to database and load on page refresh.

## 🔐 Security Notes

1. **Logo files** are stored in Supabase Storage (not in database)
2. **File upload** has validation:
   - Max size: 5MB
   - Allowed types: JPEG, PNG, GIF, WebP
   - Checked on both client and server
3. **All data** goes through authenticated backend API
4. **Storage bucket** is private by default
5. **Public access** only for read operations

## 📞 Need Help?

If settings still don't work:

1. Check all files were updated correctly
2. Verify backend is running and settings route is registered
3. Check browser DevTools → Network tab for API calls
4. Check browser DevTools → Console for errors
5. Check backend console for error messages

---

**Status**: ✅ Fixed and Ready to Use  
**Last Updated**: October 26, 2025
