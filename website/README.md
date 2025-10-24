# Website (React Frontend)

# Deploy to Vercel

This folder contains the React website that users see.

## 🚀 What's Inside

- React components and pages
- Tailwind CSS styling
- Vite build configuration
- Static assets

## 📦 Setup

```bash
npm install
npm run dev    # Local development
npm run build  # Production build
```

## 🌐 Deploy to Vercel

```bash
# Option 1: Vercel CLI
npm install -g vercel
vercel

# Option 2: GitHub
# 1. Push to GitHub
# 2. Connect repo to Vercel dashboard
# 3. Auto-deploys on push
```

## 🔌 Configure Backend Connection

Add to Vercel environment variables:

```
VITE_API_BASE_URL=https://your-backend.up.railway.app
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_key
```

## 📁 Folder Structure

```
website/
├── src/
│   ├── pages/
│   ├── components/
│   ├── lib/
│   └── App.tsx
├── vercel.json
├── package.json
└── vite.config.ts
```

---

**Next:** Deploy backend to Railway
