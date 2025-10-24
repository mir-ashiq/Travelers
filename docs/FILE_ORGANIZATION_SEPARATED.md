# 📂 File Organization Guide

## Where Everything Goes

### 🌐 Website Folder (Vercel)

```
website/
├── src/                          ← All React code
│   ├── pages/
│   │   ├── PackageDetailPage.tsx ← Booking page
│   │   ├── ContactPage.tsx
│   │   ├── HomePage.tsx
│   │   └── ...
│   ├── components/
│   ├── admin/
│   │   └── bookings/
│   │       └── BookingsPage.tsx  ← Admin dashboard
│   ├── lib/
│   │   ├── emailService.ts       ← Email queuing
│   │   └── supabaseClient.ts
│   └── App.tsx
├── vercel.json                   ← Vercel config
├── vite.config.ts
├── package.json                  ← Website deps only
├── tsconfig.json
├── tailwind.config.js
└── README.md

Deploy to: https://your-project.vercel.app
```

---

### 📧 Backend Folder (Railway)

```
backend/
├── server.js                     ← Express server
├── email-sender.js               ← Email service
├── start-dev-with-emails.js      ← Dev starter
├── railway.json                  ← Railway config
├── package.json                  ← Backend deps only
├── .env.example                  ← Config template
└── README.md

Deploy to: https://your-backend.up.railway.app
API Endpoints:
  GET  /api/health
  GET  /api/email-status
```

---

## 📋 Copy Instructions

### Step 1: Create Folders

```bash
cd Travelers
mkdir website backend
```

### Step 2: Website Folder

Copy **TO** `website/`:

```
✅ src/
✅ vite.config.ts
✅ tsconfig.json
✅ tailwind.config.js
✅ package.json
✅ index.html
✅ .env.example
```

Create in `website/`:

```
✅ vercel.json
✅ README.md
```

### Step 3: Backend Folder

Copy **TO** `backend/`:

```
✅ server.js
✅ email-sender.js
✅ start-dev-with-emails.js
✅ package.json (keep Node.js deps only)
✅ .env.example
```

Create in `backend/`:

```
✅ railway.json
✅ README.md
```

### Step 4: Root Level (Keep)

```
✅ .gitignore
✅ DEPLOYMENT_GUIDE_SEPARATED.md
✅ README.md
✅ (other documentation files)
```

---

## 🔗 Data Flow

### User Books Package

```
website/ (Vercel)
    ↓
PackageDetailPage.tsx
    ↓
Calls emailService.ts
    ↓
emailService.sendBookingConfirmationEmail()
    ↓
API call to backend:
POST https://your-backend.up.railway.app/api/bookings
    ↓
backend/ (Railway)
    ↓
server.js receives request
    ↓
Saves to Supabase
    ↓
Queues email to database
    ↓
email-sender.js picks it up (every 30s)
    ↓
Sends via SMTP
    ↓
User receives email ✅
```

---

## 📦 Dependencies

### Website `package.json` (Vercel)

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.22.3",
    "@supabase/supabase-js": "^2.39.8",
    "lucide-react": "^0.344.0",
    "framer-motion": "^11.18.2",
    "dayjs": "^1.11.10"
  },
  "devDependencies": {
    "vite": "^5.4.2",
    "typescript": "^5.5.3",
    "tailwindcss": "^3.4.1"
  }
}
```

### Backend `package.json` (Railway)

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "nodemailer": "^6.9.7",
    "@supabase/supabase-js": "^2.39.8",
    "dotenv": "^16.4.5"
  }
}
```

---

## 🌍 Environment Variables

### Website (Vercel)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_BASE_URL=https://your-backend.up.railway.app
```

### Backend (Railway)

```env
SMTP_HOST=mail.abctravels.site
SMTP_PORT=587
SMTP_USER=test@abctravels.site
SMTP_PASSWORD=your_password
SUPABASE_SERVICE_ROLE_KEY=your_service_key
VITE_SUPABASE_URL=https://your-project.supabase.co
PORT=3000
```

---

## ✅ Deployment Checklist

### Website (Vercel)

- [ ] Create `website/` folder
- [ ] Copy React files
- [ ] Create `vercel.json`
- [ ] Commit to GitHub
- [ ] Deploy to Vercel
- [ ] Set environment variables
- [ ] Test: https://your-project.vercel.app

### Backend (Railway)

- [ ] Create `backend/` folder
- [ ] Copy Node.js files
- [ ] Create `railway.json`
- [ ] Commit to GitHub
- [ ] Deploy to Railway
- [ ] Set environment variables
- [ ] Test: https://your-backend.up.railway.app/api/health

### Integration

- [ ] Update website's `VITE_API_BASE_URL`
- [ ] Test booking flow
- [ ] Test email sending
- [ ] Verify database connection

---

## 🚀 Local Development

### Website Only

```bash
cd website
npm install
npm run dev
# http://localhost:5173
```

### Backend Only

```bash
cd backend
npm install
npm start
# http://localhost:3000
```

### Both Together (Root)

```bash
npm install
npm start
# Website on :5173 + Backend on :3000
```

---

## 📊 Comparison

| Aspect         | Before         | After             |
| -------------- | -------------- | ----------------- |
| Structure      | Mixed together | Separated folders |
| Website Deploy | Full build     | Just React        |
| Backend Deploy | Not needed     | Separate          |
| Scaling        | Limited        | Independent       |
| Maintenance    | Complex        | Simple            |
| Cost           | Higher         | Lower             |

---

**Status**: Ready for separation! 🎉
