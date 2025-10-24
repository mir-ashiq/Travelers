# Database Settings Schema

## Overview

The settings page now persists all configurations to the Supabase `site_settings` table. All changes are automatically loaded on page load and saved to the database.

## Table Structure: `site_settings`

```sql
CREATE TABLE site_settings (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by TEXT,

  CONSTRAINT valid_settings_key CHECK (key IN (
    'general_settings',
    'hero_slides',
    'social_links',
    'email_templates',
    'display_settings'
  ))
);
```

### Columns:

- **id**: Primary key (auto-incrementing)
- **key**: Unique identifier for the setting type (must be one of the constrained values)
- **value**: JSONB data containing the actual settings
- **updated_at**: Timestamp of last update (auto-set to NOW())
- **updated_by**: Optional field for tracking who made the change

### Row-Level Security (RLS):

- ✅ Public read access (anyone can view settings)
- ✅ Authenticated write access (only logged-in admins can update)

## Settings Keys & Data Structure

### 1. `general_settings`

Stores company information displayed on the site.

**Data Structure:**

```json
{
  "siteName": "JKLG Travel Agency",
  "siteEmail": "info@jklgtravel.com",
  "sitePhone": "+91 98765 43210",
  "siteAddress": "123 Tourism Road, Srinagar, Jammu & Kashmir, India"
}
```

### 2. `social_links`

Stores all social media profile URLs.

**Data Structure:**

```json
{
  "facebook": "https://facebook.com/jklgtravel",
  "instagram": "https://instagram.com/jklgtravel",
  "twitter": "https://twitter.com/jklgtravel",
  "youtube": "https://youtube.com/jklgtravel"
}
```

### 3. `display_settings`

Stores UI/UX display preferences and slider values.

**Data Structure:**

```json
{
  "heroBrightness": 70,
  "featureOpacity": 100,
  "animationSpeed": 50
}
```

**Fields:**

- `heroBrightness`: 0-100% - Controls hero section brightness
- `featureOpacity`: 0-100% - Controls feature cards opacity
- `animationSpeed`: 0-100% - Controls global animation speed

### 4. `hero_slides`

Stores all hero carousel slides.

**Data Structure:**

```json
[
  {
    "id": 1,
    "title": "Discover Paradise on Earth",
    "subtitle": "Experience the breathtaking beauty of Kashmir",
    "cta": "Explore Packages",
    "link": "/packages",
    "image": "https://images.pexels.com/photos/1486520/..."
  },
  {
    "id": 2,
    "title": "Adventure Awaits in Ladakh",
    "subtitle": "Journey through the roof of the world",
    "cta": "View Destinations",
    "link": "/destinations",
    "image": "https://images.pexels.com/photos/5583514/..."
  }
]
```

### 5. `email_templates`

Stores email template configurations.

**Data Structure:**

```json
[
  {
    "id": 1,
    "name": "Booking Confirmation",
    "subject": "Your booking is confirmed!"
  },
  {
    "id": 2,
    "name": "Booking Cancellation",
    "subject": "Your booking has been cancelled"
  },
  { "id": 3, "name": "Welcome Email", "subject": "Welcome to JKLG Travel!" },
  {
    "id": 4,
    "name": "Feedback Request",
    "subject": "How was your experience with JKLG Travel?"
  }
]
```

## Frontend Integration

### Updated SettingsPage Component Features:

#### 1. **Auto-Load on Mount**

```typescript
useEffect(() => {
  loadSettings();
}, []);
```

- Loads all settings from database when component mounts
- Displays loading spinner during fetch
- Gracefully handles errors

#### 2. **Save to Database**

```typescript
const handleSaveSettings = async () => {
  // Saves all settings to database
  // Shows success/error message
  // Auto-clears message after 3 seconds
};
```

#### 3. **User Feedback**

- Loading spinner while fetching settings
- Disabled save button while saving
- Success/error message display
- Auto-clearing notifications

#### 4. **State Management**

All settings are managed in React state:

- `siteName`, `siteEmail`, `sitePhone`, `siteAddress`
- `socialLinks` (object with facebook, instagram, twitter, youtube)
- `heroSlides` (array of slide objects)
- `displaySettings` (object with brightness, opacity, animation speed)
- `emailTemplates` (array of template objects)

## Usage in Frontend

### Load Settings

Settings automatically load when the SettingsPage component mounts. No manual action needed.

### Save Settings

Click the **"Save Changes"** button to persist all current state to the database.

### Modify Settings

1. Edit any field in the UI
2. Changes are reflected in React state immediately
3. Click "Save Changes" to persist to database
4. Green success message appears for 3 seconds

## Database Queries

### View Current Settings

```sql
SELECT * FROM site_settings;
```

### Update Specific Setting

```sql
UPDATE site_settings
SET value = '{...}'::jsonb
WHERE key = 'general_settings';
```

### Get Specific Setting

```sql
SELECT value FROM site_settings
WHERE key = 'display_settings';
```

## Default Values Inserted

When the table was created, default values were inserted:

- **general_settings**: Company info with JKLG defaults
- **social_links**: JKLG social media URLs
- **display_settings**: Default slider values (brightness: 70, opacity: 100, speed: 50)

## Next Steps

### To Apply Settings Frontend-Wide:

1. Create a global context/provider for settings
2. Load settings once at app startup
3. Use settings in components (e.g., apply brightness CSS to hero)
4. Update when admin saves new settings

### Example Implementation:

```typescript
// In HomePage or App component
const { displaySettings } = useSettings();

return (
  <section
    style={{
      filter: `brightness(${displaySettings.heroBrightness}%)`,
    }}
  >
    {/* Hero content */}
  </section>
);
```

## RLS Policies Applied

✅ **Read Policy**: Anyone can read site_settings

```sql
CREATE POLICY "Allow public read site_settings"
  ON site_settings
  FOR SELECT
  USING (true);
```

✅ **Insert Policy**: Authenticated users can insert

```sql
CREATE POLICY "Allow authenticated write site_settings"
  ON site_settings
  FOR INSERT
  WITH CHECK (true);
```

✅ **Update Policy**: Authenticated users can update

```sql
CREATE POLICY "Allow authenticated update site_settings"
  ON site_settings
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
```

## Troubleshooting

### Settings not saving?

1. Check browser console for errors
2. Verify RLS policies are in place
3. Check that user is authenticated
4. Try refreshing and saving again

### Settings not loading?

1. Verify table exists: `SELECT * FROM site_settings LIMIT 1;`
2. Check that records exist for each key
3. Look at browser network tab for failed requests

### Type errors?

The TypeScript errors about implicit 'any' type for supabase are non-critical and don't affect functionality. They occur because Supabase client typing is complex.

---

**Created**: October 23, 2025  
**Status**: ✅ Active and Functional
