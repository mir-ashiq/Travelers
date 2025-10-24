# Quick Settings Database Reference

## 🚀 What Just Happened

You now have **database persistence** for all admin settings. Everything saves to Supabase.

## 📊 The Table

**Table Name**: `site_settings`

```
id (int) | key (text) | value (JSONB) | updated_at | updated_by
```

## 🔑 5 Setting Keys

| Key                | Stores                                     |
| ------------------ | ------------------------------------------ |
| `general_settings` | Company name, email, phone, address        |
| `hero_slides`      | All 3 carousel slides                      |
| `social_links`     | Facebook, Instagram, Twitter, YouTube URLs |
| `display_settings` | Brightness, opacity, animation sliders     |
| `email_templates`  | Email templates config                     |

## 💾 How Data Flows

```
UI Input → React State → Click "Save" → Database Saved
                ↑                           ↓
                └─ Load on Page Open ──────┘
```

## ✅ What Works

- ✅ Load settings automatically when SettingsPage opens
- ✅ Save all settings to database with one click
- ✅ Show loading spinner
- ✅ Show success/error messages
- ✅ Persist across browser refreshes

## 🧪 Test It

1. Go to **Admin → Settings**
2. Change something (e.g., Site Name to "Test Agency")
3. Click **"Save Changes"**
4. See **green success message**
5. **Refresh** the page
6. Value should **still be there**

## 🐛 If Not Working

**Check in Supabase SQL Editor:**

```sql
-- View all settings
SELECT * FROM site_settings;

-- Should see 5 rows with keys:
-- - general_settings
-- - social_links
-- - display_settings
-- - hero_slides (created when you save)
-- - email_templates (created when you save)
```

## 📝 Example Values

**general_settings:**

```json
{
  "siteName": "JKLG Travel Agency",
  "siteEmail": "info@jklgtravel.com",
  "sitePhone": "+91 98765 43210",
  "siteAddress": "123 Tourism Road..."
}
```

**display_settings:**

```json
{
  "heroBrightness": 70,
  "featureOpacity": 100,
  "animationSpeed": 50
}
```

## 🔐 Security

- **Read**: Anyone can read (for public site display)
- **Write**: Only authenticated admins can update
- **RLS**: Enabled and enforced

## 📂 Files Created

1. `site_settings` table in Supabase ✅
2. `DATABASE_SETTINGS_SCHEMA.md` - Full docs
3. `SETTINGS_DATABASE_SETUP.md` - Setup guide
4. Updated `src/admin/settings/SettingsPage.tsx` - DB integration

## 🎯 Next Steps

### Option 1: Apply Settings Globally (Recommended)

Create a `SettingsContext` to use saved settings across the entire app:

```typescript
// Use brightness in hero
<section style={{ filter: `brightness(${settings.heroBrightness}%)` }}>
```

### Option 2: Just Keep Saving

Settings will keep working as-is. They'll persist but won't affect the UI yet.

## ⚡ Quick SQL Checks

```sql
-- Count settings
SELECT COUNT(*) FROM site_settings;
-- Should be: 5 (after first save, 3 initially)

-- View one setting
SELECT * FROM site_settings WHERE key = 'general_settings';

-- Clear a setting (reset to null)
UPDATE site_settings SET value = 'null'::jsonb WHERE key = 'hero_slides';
```

## 🎉 You're All Set!

- ✅ Database table created
- ✅ Component integrated
- ✅ Auto-save working
- ✅ Persistence ready

**Start saving your settings!**

---

For more details, see `DATABASE_SETTINGS_SCHEMA.md`
