# 📂 Complete File Organization Guide

## ✅ **ALL FILES ORGANIZED SUCCESSFULLY!**

Everything is now properly organized into the `website/` and `backend/` folders!

---

## 🗂️ **Complete Folder Structure**

### 📁 Website Folder (React Frontend)

```
website/
├── src/                          ✅ All React components
│   ├── pages/                    (Page components)
│   ├── components/               (Reusable components)
│   ├── services/                 (API services)
│   ├── types/                    (TypeScript types)
│   ├── App.tsx
│   └── main.tsx
├── public/                       ✅ Static assets
│   ├── favicon.ico
│   ├── logo.png
│   └── ...
├── .git/                         ✅ Git repository
├── .github/                      ✅ GitHub workflows
├── .gitignore                    ✅ Git ignore rules
├── .env                          ✅ Environment variables
├── .env.example                  ✅ Environment template
├── vite.config.ts                ✅ Vite configuration
├── tsconfig.json                 ✅ TypeScript config
├── tsconfig.app.json             ✅ App TypeScript config
├── tsconfig.node.json            ✅ Node TypeScript config
├── tailwind.config.js            ✅ Tailwind CSS config
├── postcss.config.js             ✅ PostCSS config
├── eslint.config.js              ✅ ESLint rules
├── index.html                    ✅ HTML entry point
├── package.json                  ✅ Website dependencies only
├── package-lock.json             ✅ Dependency lock file
├── vercel.json                   ✅ Vercel deployment config
├── README.md                     ✅ Deployment guide
└── .bolt/                        (AI project metadata)
```

### 📁 Backend Folder (Node.js API + Email)

```
backend/
├── server.js                     ✅ Express server (ES modules)
├── email-sender.js               ✅ SMTP email service
├── start-dev-with-emails.js      ✅ Dev server with emails
├── start-email-service.js        ✅ Standalone email service
├── seed.js                       ✅ Database seeding
├── seed-output.txt               ✅ Seed script output log
├── .git/                         ✅ Git repository
├── .github/                      ✅ GitHub workflows
├── .gitignore                    ✅ Git ignore rules
├── .env                          ✅ Environment variables
├── .env.example                  ✅ Environment template
├── supabase/                     ✅ Supabase configs
│   ├── config.toml               (Supabase configuration)
│   ├── seed.sql                  (Database seed)
│   └── migrations/               (Database migrations)
├── package.json                  ✅ Backend dependencies only
├── railway.json                  ✅ Railway deployment config
├── netlify.toml                  ✅ Alternative deployment config
├── README.md                     ✅ Deployment guide
└── .bolt/                        (AI project metadata)
```

### 📁 Root Folder (Documentation & Reference)

```
Travelers/
├── website/                      ✅ React frontend
├── backend/                      ✅ Node.js API
├── node_modules/                 ⚠️ Old - can delete
├── dist/                         ⚠️ Old build - can delete
├── .bolt/                        (AI project metadata)
├── .env                          (Original - reference only)
├── .env.example                  (Original - reference only)
├── .git/                         (Original - reference only)
├── .github/                      (Original - reference only)
├── .gitignore                    (Original - reference only)
├── .venv/                        (Python virtual env)
├── Procfile                      (Deployment config)
├── QUICK_START.sh                (Quick start script)
├── START.sh                      (Start script)
│
├── 📚 DOCUMENTATION FILES (Keep for Reference)
├── README.md                     (Main readme)
├── WELCOME.md                    (Welcome guide)
├── START_HERE.md                 (Getting started)
├── DEPLOYMENT_GUIDE_SEPARATED.md (Separation guide)
├── FILE_ORGANIZATION_SEPARATED.md
├── ORGANIZATION_COMPLETE.md      (Organization summary)
├── ARCHITECTURE_SEPARATED.md
├── BEFORE_AFTER_COMPARISON.md
├── SEPARATION_COMPLETE.md
├── COMPLETE_SETUP_GUIDE.md
├── EMAIL_SYSTEM_COMPLETE.md
├── DATABASE_COMPLETE_STRUCTURE.md
├── SETTINGS_COMPLETE.md
└── ... (50+ other documentation files)
```

---

## 📋 What Goes Where?

### 🌐 Website Folder Contains:

- ✅ React source code (`src/`)
- ✅ Build configuration (Vite, TypeScript, Tailwind)
- ✅ Static files (`public/`)
- ✅ Website environment variables
- ✅ Vercel deployment config
- ✅ Website git repository
- ✅ GitHub workflows for website

### 🔧 Backend Folder Contains:

- ✅ Express server (`server.js`)
- ✅ Email service files (`email-sender.js`, etc.)
- ✅ Database configuration (`supabase/`)
- ✅ Database seeding (`seed.js`)
- ✅ Backend environment variables
- ✅ Railway deployment config
- ✅ Backend git repository
- ✅ GitHub workflows for backend

### 📖 Root Folder Contains:

- ✅ Both `website/` and `backend/` folders
- ✅ All documentation files
- ✅ Original copies for reference
- ✅ Guides and setup instructions

---

## 🚀 Next Steps

### Step 1: Install Dependencies

#### Website

```bash
cd website
npm install
```

#### Backend

```bash
cd backend
npm install
```

### Step 2: Test Locally

#### Website

```bash
cd website
npm run dev
# Opens on http://localhost:5173
```

#### Backend

```bash
cd backend
npm start
# Server on :3000, emails processing
```

### Step 3: Deploy to Production

#### Deploy Website to Vercel

```bash
cd website
npm run build
vercel deploy
```

#### Deploy Backend to Railway

```bash
cd backend
railway up
# Or push to GitHub for auto-deploy
```

---

## 🧹 Cleanup (Optional)

You can safely delete from root (they're copied to subfolders):

```bash
# Remove old files
rm node_modules -r          # Large folder
rm dist -r                  # Build output
rm package-lock.json        # Use one in website/
rm package.json             # Use ones in website/ and backend/
rm src -r                   # Moved to website/
rm public -r                # Moved to website/
rm *.config.* -f            # Moved to subfolders
rm vite.config.ts -f
rm index.html -f
rm server.js -f             # Moved to backend/
rm email-sender.js -f       # Moved to backend/
rm start-*.js -f            # Moved to backend/
rm seed.js -f               # Moved to backend/
```

**Or keep them for backup - doesn't hurt.**

---

## 📊 File Distribution Summary

### Original Root Files (Total: 100+)

```
✅ Moved to website/ (15 files)
   - src/, public/, vite.config.ts, tsconfig.*, tailwind.config.js,
     postcss.config.js, eslint.config.js, index.html, package.json

✅ Moved to backend/ (6 files)
   - server.js, email-sender.js, start-*.js, seed.js, supabase/

✅ Copied to both/ (5 files)
   - .git/, .github/, .gitignore, .env, .env.example

✅ Kept in root/ (80+ files)
   - Documentation files (.md files)
   - Reference files (SQL, shell scripts)
   - Package files for root (if needed)
```

---

## ✨ Environment Variables

### Website `.env`

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_BASE_URL=http://localhost:3000
```

### Backend `.env`

```env
SMTP_HOST=mail.abctravels.site
SMTP_PORT=587
SMTP_USER=test@abctravels.site
SMTP_PASSWORD=your_password
SUPABASE_SERVICE_ROLE_KEY=your_key
SUPABASE_URL=https://your-project.supabase.co
PORT=3000
NODE_ENV=production
```

---

## 📦 Package Dependencies

### Website (React only)

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.22.3",
  "framer-motion": "^11.18.2",
  "lucide-react": "^0.344.0",
  "@supabase/supabase-js": "^2.39.8",
  "vite": "^5.4.8",
  "typescript": "^5.5.3"
}
```

### Backend (Node.js only)

```json
{
  "express": "^4.18.2",
  "nodemailer": "^6.9.7",
  "@supabase/supabase-js": "^2.39.8",
  "dotenv": "^16.4.5"
}
```

---

## 🎯 Deployment Checklist

### Before Website Deployment

- [ ] `cd website && npm install`
- [ ] `npm run build` (test build)
- [ ] Update `.env` with Supabase keys
- [ ] Sign up at vercel.com
- [ ] Deploy: `vercel deploy`

### Before Backend Deployment

- [ ] `cd backend && npm install`
- [ ] Update `.env` with SMTP and Supabase keys
- [ ] Sign up at railway.app
- [ ] Deploy: `railway up` or GitHub push

### After Both Deployed

- [ ] Update website's `VITE_API_BASE_URL` to backend URL
- [ ] Test: Create booking → Email should arrive in 30 seconds
- [ ] Monitor logs in Vercel and Railway dashboards

---

## 🗂️ Git Repository Setup (Optional)

### Option 1: Separate Repos

```bash
# Website repo
cd website
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOU/website
git push -u origin main

# Backend repo
cd backend
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOU/backend
git push -u origin main
```

### Option 2: Monorepo

```bash
# Keep root repo, folders auto-deploy
git add website/ backend/
git commit -m "Separated website and backend"
git push
```

---

## 🔐 Security Notes

### 🟢 SAFE Files to Share

- `website/` folder (no secrets)
- `backend/*.js` files (no secrets)
- All `.md` documentation files

### 🔴 DO NOT Share

- `.env` files (contains passwords)
- `supabase/` folder (contains secrets)
- `.git/` folder (contains history)

---

## 📞 File Organization Questions

### "Should I delete the root files?"

**Not immediately.** Keep them as backup until both deployments are verified working. Then safely delete.

### "Can I edit files in root?"

**Not recommended after organization.** Edit files in `website/` or `backend/` instead, then sync to root if needed.

### "What if I need the root files?"

**They're still there!** Everything has been copied, not moved. Root copies remain for reference.

### "How do I update both folders?"

**Edit in `website/` and `backend/` folders respectively.** Don't edit root copies.

---

## ✅ Complete Status

```
🎉 ALL FILES ORGANIZED!

website/           → Ready for Vercel
backend/           → Ready for Railway
Root docs/         → Reference only
Backups created    → Safe to delete

Next: npm install && deploy!
```

---

## 🚀 Quick Commands Cheat Sheet

```bash
# Install
cd website && npm install
cd backend && npm install

# Development
cd website && npm run dev          # Website on 5173
cd backend && npm start            # Backend on 3000

# Build
cd website && npm run build        # Create dist/

# Deploy Website
cd website && vercel deploy

# Deploy Backend
cd backend && railway up

# Check structure
ls -la website/
ls -la backend/

# View logs
cd backend && npm start            # See email logs
```

---

**🎉 Your project is now professionally organized and ready for production!**
