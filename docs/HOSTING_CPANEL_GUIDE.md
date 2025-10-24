# 🚀 How to Host on cPanel - Complete Guide

## 📌 Overview

Your JKLG Travel Agency app has two parts:

1. **Frontend**: React app (static files)
2. **Backend**: Node.js server (with email service)

**Hosting Options for cPanel:**

### Option 1: **Shared Hosting (Traditional cPanel)**

- ❌ **NOT recommended** - Most shared hosts don't support Node.js
- Limited to static sites (HTML, CSS, JS)
- Can't run your Node.js email service

### Option 2: **VPS with cPanel + Node.js** ⭐ RECOMMENDED

- ✅ Supports Node.js natively
- ✅ Full email service support
- ✅ Better performance
- Providers: Hostinger VPS, Bluehost VPS, A2 Hosting, Cloudways

### Option 3: **Separate Hosting**

- Frontend: cPanel shared hosting
- Backend/Email: Railway, Heroku, or Render (free or paid)

---

## ✅ Option 1: VPS with cPanel + Node.js (RECOMMENDED)

### Prerequisites

- VPS with cPanel installed
- Node.js 18+ installed
- npm installed
- SSH access enabled

### Step 1: SSH into Your Server

```bash
ssh username@your-vps-ip-address
```

### Step 2: Create Application Directory

```bash
cd /home/yourusername/
mkdir -p public_html/travel-app
cd public_html/travel-app
```

### Step 3: Upload Your Project

**Option A: Using Git**

```bash
git clone https://github.com/mir-ashiq/Travelers.git .
cd Travelers
```

**Option B: Using SCP (Upload from your computer)**

```bash
scp -r C:\Users\spike\OneDrive\Documents\Travelers username@vps-ip:/home/username/public_html/travel-app/
```

**Option C: Using cPanel File Manager**

- Log into cPanel
- Go to File Manager
- Navigate to public_html
- Upload your project files

### Step 4: Install Dependencies

```bash
cd /home/yourusername/public_html/travel-app
npm install
```

### Step 5: Create .env File

```bash
cp .env.example .env
nano .env
```

Edit and add your credentials:

```env
# Supabase
VITE_SUPABASE_URL=https://ynqceffvnagwrbchnyls.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email
SMTP_HOST=mail.abctravels.site
SMTP_PORT=587
SMTP_USER=test@abctravels.site
SMTP_PASSWORD=your_password
SMTP_FROM=test@abctravels.site

# Port
PORT=3000
```

### Step 6: Build the Project

```bash
npm run build
```

Output: `dist/` folder created with built files

### Step 7: Set Up Node.js App in cPanel

**Method A: Using cPanel's Node.js Manager**

1. Log into cPanel
2. Find **"Node.js Selector"** or **"Node.js Manager"**
3. Click **"Create Application"**
4. Configure:

   - **Node.js version**: 18.x or higher
   - **Application root**: `/home/username/public_html/travel-app`
   - **Application URL**: `travel-app.yourdomain.com` (or your domain)
   - **Application startup file**: `server.js`
   - **Passenger logging**: Enable

5. Click **Create**
6. In cPanel, restart the Node.js app

**Method B: Manual Setup with PM2**

```bash
npm install -g pm2
pm2 start server.js --name "travel-app"
pm2 startup
pm2 save
```

### Step 8: Set Up Reverse Proxy (if needed)

In cPanel:

1. Go to **Addon Domains** or **Subdomains**
2. Create subdomain: `app.yourdomain.com`
3. Point it to your Node.js app on port 3000

Or configure via `.htaccess`:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
</IfModule>
```

### Step 9: Install SSL Certificate

In cPanel:

1. Go to **AutoSSL** or **SSL/TLS Status**
2. Install free Let's Encrypt certificate
3. Enable **Auto Renewal**

### Step 10: Start the Email Service

SSH back in:

```bash
cd /home/yourusername/public_html/travel-app
npm run start:prod
```

Or use PM2 for background service:

```bash
pm2 start email-sender.js --name "email-service"
pm2 save
```

---

## ❌ Option 2: Shared Hosting (If Node.js Not Available)

### Frontend Only (Static Site)

1. **Build the project**:

   ```bash
   npm run build
   ```

2. **Upload `dist/` folder to cPanel**:

   - Use File Manager or FTP
   - Upload contents to `public_html/`

3. **Configure Email Service Separately**:
   - Use Heroku (free tier retired)
   - Use Railway: https://railway.app
   - Use Render: https://render.com

### Email Service on Railway (FREE)

1. Sign up: https://railway.app
2. Create new project
3. Connect GitHub repo
4. Set environment variables
5. Deploy

Railway will run `npm run start:prod` automatically!

---

## ✅ Option 3: Hybrid Approach (EASIEST)

### Frontend on cPanel (Shared Hosting)

```bash
npm run build
# Upload dist/ to cPanel public_html
```

### Backend + Email on Railway (FREE)

1. Sign up: https://railway.app
2. Connect GitHub: https://github.com/mir-ashiq/Travelers
3. Set environment variables in Railway dashboard
4. Deploy

---

## 🔧 Post-Deployment Checklist

- [ ] Update `.env` with production values
- [ ] Set `VITE_API_BASE_URL=https://yourdomain.com/api`
- [ ] Enable HTTPS/SSL
- [ ] Test email sending
- [ ] Check email logs
- [ ] Set up automatic backups
- [ ] Configure firewall rules
- [ ] Test booking flow end-to-end
- [ ] Monitor error logs
- [ ] Set up uptime monitoring

---

## 📊 Comparison Table

| Feature          | Shared cPanel | VPS with cPanel | Railway         |
| ---------------- | ------------- | --------------- | --------------- |
| Node.js Support  | ❌            | ✅              | ✅              |
| Email Service    | ❌            | ✅              | ✅              |
| Cost/month       | $3-10         | $12-30          | $5-50           |
| Setup Difficulty | Easy          | Medium          | Easy            |
| Scalability      | Low           | Medium          | High            |
| Auto-restart     | No            | Yes             | Yes             |
| Best For         | Static sites  | Full stack apps | **This app** ⭐ |

---

## 🚨 Troubleshooting

### App Won't Start

```bash
# Check Node.js version
node --version

# Check npm modules
npm install

# Check for errors
npm run build

# Test locally first
npm start
```

### Email Not Sending

```bash
# Check .env file
cat .env

# Test SMTP connection
telnet mail.abctravels.site 587

# Check email service logs
pm2 logs email-service
```

### Port Already in Use

```bash
# Find process on port 3000
lsof -i :3000

# Kill it
kill -9 <PID>
```

---

## 🎯 Recommended Setup for Your App

```
┌─────────────────────────────────────────┐
│        Your Domain (yourdomain.com)     │
└──────────────┬──────────────────────────┘
               │
        ┌──────┴──────┐
        │             │
   ┌────▼──┐    ┌────▼──────┐
   │Railway│    │ cPanel/VPS │
   ├───────┤    ├────────────┤
   │Backend│    │  Frontend  │
   │  Node │    │   (React)  │
   │Emails │    │    HTML    │
   └───────┘    └────────────┘
```

**Best for reliability and cost**: Railway backend + cPanel frontend

---

## 📞 Support Resources

- **Railway Docs**: https://docs.railway.app
- **cPanel Docs**: https://documentation.cpanel.net
- **Node.js Hosting**: https://www.creativebloq.com/hosting/best-node-js-hosting
- **Email Issues**: Check Nodemailer docs
