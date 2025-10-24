# Destination Details Quick Reference

## New Destination Fields

| Field                | Type                                  | Example                             | Use Case                              |
| -------------------- | ------------------------------------- | ----------------------------------- | ------------------------------------- |
| `altitude`           | number                                | 2650                                | Display elevation in meters           |
| `bestSeason`         | string                                | "June to September"                 | Show best time to visit               |
| `distance`           | number                                | 52                                  | Distance in km from nearest city      |
| `averageTemperature` | string                                | "15-25°C"                           | Display weather info                  |
| `accommodation`      | string                                | "Hotels, Resorts, Guesthouses"      | Show lodging options                  |
| `difficulty`         | 'Easy' \| 'Moderate' \| 'Challenging' | "Easy"                              | Indicate difficulty level             |
| `attractions`        | string[]                              | ["Gondola", "Lake", "Meadow"]       | List main attractions                 |
| `activities`         | string[]                              | ["Skiing", "Hiking", "Photography"] | List available activities             |
| `bestFor`            | string[]                              | ["families", "photographers"]       | Show target audiences                 |
| `latitude`           | number                                | 34.2143                             | Geographic coordinates (future: maps) |
| `longitude`          | number                                | 75.4208                             | Geographic coordinates (future: maps) |

## Admin Panel Usage

### Adding a New Destination

1. **Go to Admin → Destinations → Add New**

2. **Fill Basic Information**

   - Name: Destination name
   - Region: Kashmir, Jammu, Ladakh, or Gurez
   - Description: Detailed description
   - Image URL: Full image URL

3. **Fill Location & Climate**

   - Altitude: Height above sea level
   - Best Season: E.g., "June to September"
   - Distance: Km from nearest city
   - Temperature: E.g., "15-25°C"
   - Accommodation: Types available

4. **Set Difficulty & Coordinates**

   - Difficulty: Easy/Moderate/Challenging
   - Latitude/Longitude: Precise GPS coordinates

5. **Add Attractions**

   - Click "+ Add Attraction"
   - Enter attraction name
   - Repeat for each attraction
   - Click Remove to delete

6. **Add Activities**

   - Click "+ Add Activity"
   - Enter activity name
   - Repeat for each activity
   - Click Remove to delete

7. **Add Categories (Best For)**

   - Click "+ Add Category"
   - Enter category (e.g., "families", "adventure")
   - Repeat for each category
   - Click Remove to delete

8. **Mark as Featured (Optional)**

   - Check "Feature this destination"
   - Will appear on homepage

9. **Save**
   - Click "Create Destination" or "Save Changes"

### Editing a Destination

Same process as adding, but:

- Existing data is pre-filled
- Click "Save Changes" instead of "Create"
- All arrays show current items
- Add/remove items as needed

## Frontend Display

### Destination Detail Page

**What Visitors See**:

1. **Hero Image**

   - Full-width destination image

2. **Header**

   - Destination name (large)
   - Region badge

3. **Information Cards** (7 columns on desktop)

   - 🗺️ Region
   - ⛰️ Altitude (if available)
   - 📅 Best Season (if available)
   - 🌡️ Temperature (if available)
   - 📍 Distance (if available)
   - 🏠 Accommodation (if available)
   - 🎯 Difficulty (if available)

4. **About Section**

   - Full description text

5. **Main Attractions** (if available)

   - List with bullet points
   - Grid layout

6. **Activities** (if available)

   - List with activity icons
   - Color-coded cards

7. **Perfect For** (if available)

   - Category badges with checkmarks

8. **Call-to-Action**
   - "View Packages" button

## Data Structure Examples

### Minimal Destination

```json
{
  "id": 1,
  "name": "Dal Lake",
  "region": "Kashmir",
  "description": "Beautiful lake...",
  "image": "https://...",
  "featured": false
}
```

### Complete Destination

```json
{
  "id": 1,
  "name": "Gulmarg",
  "region": "Kashmir",
  "description": "Alpine meadow at high altitude...",
  "image": "https://...",
  "featured": true,
  "altitude": 2650,
  "bestSeason": "June to September",
  "distance": 52,
  "attractions": [
    "Gondola Chairlift",
    "Strawberry Fields",
    "Alpather Lake",
    "Twin Lakes"
  ],
  "activities": [
    "Skiing (Winter)",
    "Hiking",
    "Photography",
    "Horse Riding",
    "Camping"
  ],
  "latitude": 34.2143,
  "longitude": 75.4208,
  "averageTemperature": "8-15°C",
  "accommodation": "Hotels, Resorts, Guesthouses",
  "difficulty": "Easy",
  "bestFor": ["families", "photographers", "nature lovers", "adventure seekers"]
}
```

## Best Practices

### Altitude

- Always enter as number (no units)
- For sea-level destinations, use 0 or leave blank
- Examples: 2650, 3000, 1500

### Best Season

- Use readable format
- Examples:
  - "June to September"
  - "March to May"
  - "Year-round"
  - "December to February"

### Distance

- Always in kilometers
- From nearest city/town
- Approximate is fine
- Examples: 52, 100, 25

### Temperature

- Include both Celsius and Fahrenheit or just one
- Examples:
  - "15-25°C"
  - "10-20°C (50-68°F)"
  - "Average 20°C"

### Accommodation

- Comma-separated list
- Examples:
  - "Hotels, Resorts, Guesthouses"
  - "Homestays, Budget Hotels"
  - "5-star Hotels, Luxury Resorts"
  - "Hostels, Camping, Guesthouses"

### Difficulty Levels

- **Easy**: Suitable for all fitness levels
- **Moderate**: Requires basic fitness
- **Challenging**: Requires good fitness/experience

### Attractions

- Specific landmarks and points of interest
- Examples for Gulmarg:
  - Gondola Chairlift
  - Strawberry Fields
  - Alpather Lake
  - Twin Lakes

### Activities

- Action words
- Include seasonal info if relevant
- Examples:
  - "Skiing (Winter)"
  - "Hiking"
  - "Photography"
  - "Horse Riding"
  - "Camping"
  - "Water Sports"

### Best For

- Single words or short phrases
- Lowercase preferred
- Examples:
  - "families"
  - "photographers"
  - "adventure seekers"
  - "nature lovers"
  - "couples"
  - "solo travelers"
  - "seniors"

### Coordinates

- Use decimal format
- 6 decimal places for precision (~0.1m accuracy)
- Examples:
  - Latitude: 34.2143
  - Longitude: 75.4208

## Validation Rules

✅ **Required Fields**

- name
- region
- description
- image

✅ **Optional but Recommended**

- altitude
- bestSeason
- difficulty
- attractions (at least 1)
- activities (at least 1)
- bestFor (at least 1)

✅ **Validation**

- Altitude: Must be number or empty
- Distance: Must be number or empty
- Temperature: Any text allowed
- Arrays: Empty items filtered on save
- Coordinates: Must be valid decimals if provided

## Troubleshooting

**Arrays showing as empty?**

- Make sure items aren't just whitespace
- Click "+ Add" button to add items
- Don't leave fields empty between items

**Image not showing?**

- Verify URL is correct
- Must start with https://
- Check image still exists

**Can't save?**

- Fill all required fields (name, region, description, image)
- Check for errors in temperature field
- Remove any special characters

**Coordinates not working?**

- Use decimal format (34.2143)
- Don't use compass directions (N/S/E/W)
- Must be valid latitude (-90 to 90) and longitude (-180 to 180)
