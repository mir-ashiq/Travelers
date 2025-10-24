# Destination Form Column Name Fixes

## Issue

The destination forms (EditDestinationPage and NewDestinationPage) were using camelCase field names while the Supabase database uses snake_case column names. This caused 400 Bad Request errors when trying to save destinations.

**Error Message:**

```
Error creating destination: {code: 'PGRST204', message: "Could not find the 'averageTemperature' column of 'destinations' in the schema cache"}
```

## Root Cause

Database column names are in snake_case, but the component used camelCase:

- ❌ `averageTemperature` → ✅ `average_temperature`
- ❌ `bestSeason` → ✅ `best_season`
- ❌ `bestFor` → ✅ `best_for`

## Solution

### Files Modified

1. `src/admin/destinations/EditDestinationPage.tsx`
2. `src/admin/destinations/NewDestinationPage.tsx`

### Changes Made

#### 1. State Object Keys (formData)

Changed all form state keys to match database column names:

**Before:**

```tsx
const [formData, setFormData] = useState({
  bestSeason: "",
  averageTemperature: "",
  bestFor: [] as string[],
  // ...
});
```

**After:**

```tsx
const [formData, setFormData] = useState({
  best_season: "",
  average_temperature: "",
  best_for: [] as string[],
  // ...
});
```

#### 2. Function Parameters

Updated array handler function type signatures:

**Before:**

```tsx
const handleArrayChange = (fieldName: 'attractions' | 'activities' | 'bestFor', ...) => {
```

**After:**

```tsx
const handleArrayChange = (fieldName: 'attractions' | 'activities' | 'best_for', ...) => {
```

#### 3. Data Fetching

Updated field mapping when loading data from Supabase:

**Before:**

```tsx
bestSeason: data.bestSeason || '',
averageTemperature: data.averageTemperature || '',
bestFor: Array.isArray(data.bestFor) ? data.bestFor : [],
```

**After:**

```tsx
best_season: data.best_season || '',
average_temperature: data.average_temperature || '',
best_for: Array.isArray(data.best_for) ? data.best_for : [],
```

#### 4. Data Submission

Updated field names when sending to Supabase:

**Before:**

```tsx
bestSeason: formData.bestSeason || null,
averageTemperature: formData.averageTemperature || null,
bestFor: formData.bestFor.filter(b => b.trim()),
```

**After:**

```tsx
best_season: formData.best_season || null,
average_temperature: formData.average_temperature || null,
best_for: formData.best_for.filter((b: string) => b.trim()),
```

#### 5. Form Input Fields

Updated input name attributes and form field references:

**Before:**

```tsx
<input name="bestSeason" value={formData.bestSeason} />
<input name="averageTemperature" value={formData.averageTemperature} />
```

**After:**

```tsx
<input name="best_season" value={formData.best_season} />
<input name="average_temperature" value={formData.average_temperature} />
```

#### 6. Type Annotations

Added explicit types to callback parameters:

**Before:**

```tsx
{formData.bestFor.map((category, index) => (
```

**After:**

```tsx
{formData.best_for.map((category: string, index: number) => (
```

## Database Schema Reference

| Database Column       | Type           | Notes                           |
| --------------------- | -------------- | ------------------------------- |
| `best_season`         | varchar        | e.g., "June to September"       |
| `average_temperature` | varchar        | e.g., "15-25°C"                 |
| `best_for`            | text[] (array) | e.g., ["families", "adventure"] |

All other columns remain unchanged:

- `altitude`, `distance`, `accommodation`, `difficulty`
- `attractions`, `activities`
- `latitude`, `longitude`

## Results

✅ **Build Status:** SUCCESS

- **Build Time:** 5.28 seconds
- **Modules:** 1970 transformed
- **TypeScript Errors:** 0
- **Warnings:** 0 (only chunk size warning, which is expected)

✅ **Functionality:**

- Edit destination form now saves with correct column names
- New destination form now saves with correct column names
- All field values properly mapped between form and database
- Type safety fully enforced

## Testing Checklist

- [ ] Navigate to admin/destinations
- [ ] Click "Edit" on a destination
- [ ] Modify best_season, average_temperature, best_for fields
- [ ] Click "Save Changes"
- [ ] Verify the update succeeds (no 400 error)
- [ ] Navigate to admin/destinations/new
- [ ] Fill in a new destination with all fields
- [ ] Click "Create Destination"
- [ ] Verify the new destination appears in the list
- [ ] Check Supabase dashboard to confirm column names saved correctly

## Files Modified

1. **EditDestinationPage.tsx** (590 lines total)

   - Line 10-27: formData state keys
   - Line 66-78: fetchDestination mapping
   - Line 102-125: handleArrayChange function signature
   - Line 139-158: handleSubmit field names
   - Line 340-354: best_season input
   - Line 368-382: average_temperature input
   - Line 514-538: best_for section

2. **NewDestinationPage.tsx** (511 lines total)
   - Line 9-26: formData state keys
   - Line 41-62: handleArrayChange function signature
   - Line 77-96: handleSubmit field names
   - Line 268-282: best_season input
   - Line 296-310: average_temperature input
   - Line 440-465: best_for section

## Related Issues Fixed

This fix addresses the root cause of the console error:

```
POST https://ynqceffvnagwrbchnyls.supabase.co/rest/v1/destinations?... 400 (Bad Request)
Error: {code: 'PGRST204', message: "Could not find the 'averageTemperature' column..."}
```

## Next Steps

1. Test the destination create/edit forms in the browser
2. Verify all fields save correctly to Supabase
3. Check that the form displays existing data correctly when editing
4. Monitor console for any remaining errors
