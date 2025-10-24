# ✅ Environment Variables - Fallback Support

## 🔄 What Changed

Your application now checks for environment variables in this order:

1. **Load `.env` file if it exists** (highest priority)
2. **Use system environment variables if `.env` not found**
3. **Use defaults if available** (e.g., Supabase URL)
4. **Exit with error if required variables missing**

---

## 📝 How to Use

### Option 1: Using .env File (Local Development)

```bash
# Create .env file
cp .env.example .env

# Edit .env with your values
# Then run:
npm start
```

### Option 2: Using Environment Variables (Production/Hosting)

**On Railway.app:**

1. Go to Variables section
2. Add each variable:
   ```
   SMTP_HOST=mail.abctravels.site
   SMTP_PORT=587
   SMTP_USER=test@abctravels.site
   SMTP_PASSWORD=your_password
   SUPABASE_SERVICE_ROLE_KEY=your_key
   PORT=3000
   ```
3. Deploy

**On cPanel VPS:**

```bash
# Set environment variables
export SMTP_HOST=mail.abctravels.site
export SMTP_PORT=587
export SMTP_USER=test@abctravels.site
export SMTP_PASSWORD=your_password
export SUPABASE_SERVICE_ROLE_KEY=your_key
export PORT=3000

# Then run:
npm run start:prod
```

**On Heroku:**

```bash
# Set config vars
heroku config:set SMTP_HOST=mail.abctravels.site
heroku config:set SMTP_PORT=587
heroku config:set SMTP_USER=test@abctravels.site
heroku config:set SMTP_PASSWORD=your_password
heroku config:set SUPABASE_SERVICE_ROLE_KEY=your_key

# Deploy
git push heroku main
```

---

## 🔍 Required Environment Variables

### For Email Service

| Variable        | Required | Default                 | Example               |
| --------------- | -------- | ----------------------- | --------------------- |
| `SMTP_HOST`     | ✅ YES   | -                       | mail.abctravels.site  |
| `SMTP_PORT`     | ✅ YES   | -                       | 587                   |
| `SMTP_USER`     | ✅ YES   | -                       | test@abctravels.site  |
| `SMTP_PASSWORD` | ✅ YES   | -                       | your_password         |
| `SMTP_FROM`     | ❌ NO    | noreply@abctravels.site | admin@abctravels.site |

### For Supabase

| Variable                    | Required | Default                                  | Example       |
| --------------------------- | -------- | ---------------------------------------- | ------------- |
| `VITE_SUPABASE_URL`         | ❌ NO    | https://ynqceffvnagwrbchnyls.supabase.co | -             |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ YES   | -                                        | your_key_here |

### For Server

| Variable | Required | Default | Example |
| -------- | -------- | ------- | ------- |
| `PORT`   | ❌ NO    | 3000    | 8080    |

---

## 🧪 Testing

### Test with .env file

```bash
npm start
# Should see: ✅ Email service started
```

### Test with environment variables (no .env)

```bash
# Remove .env temporarily
mv .env .env.backup

# Set environment variables
export SMTP_HOST=mail.abctravels.site
export SMTP_PORT=587
export SMTP_USER=test@abctravels.site
export SMTP_PASSWORD=your_password
export SUPABASE_SERVICE_ROLE_KEY=your_key

# Run
npm start

# Restore .env
mv .env.backup .env
```

---

## 🔐 Security Best Practices

### ❌ DO NOT

- Commit `.env` to Git repository
- Hardcode passwords in code
- Share `.env` files with others

### ✅ DO

- Add `.env` to `.gitignore` (already done)
- Use environment variables in production
- Rotate passwords regularly
- Use `.env.example` as template

---

## 📂 Files Updated

1. **server.js**

   - Checks for `.env` file existence
   - Validates SMTP environment variables
   - Provides clear error messages

2. **email-sender.js**

   - Checks for `.env` file existence
   - Validates required credentials
   - Better error reporting

3. **start-dev-with-emails.js**
   - Development server also uses fallback logic
   - Email service validates environment variables

---

## ✨ Error Messages

### Missing SMTP Configuration

```
❌ Missing SMTP environment variables: SMTP_USER, SMTP_PASSWORD
   Email service will not start.
   Set variables in .env or environment variables
```

### Missing Supabase Key

```
❌ SUPABASE_SERVICE_ROLE_KEY environment variable not set
   Set it in .env or as a system environment variable
```

### .env File Not Found (But Variables Set)

```
ℹ️  .env file not found. Using environment variables instead.
✅ Email service started (background process)
```

---

## 🎯 Quick Reference

### Local Development

```bash
cp .env.example .env
# Edit .env
npm start
```

### Production Deployment

```bash
# No .env needed - set environment variables instead
npm run start:prod
```

### Railway Deployment

```bash
# Set Variables in Railway dashboard
# Then deploy
git push origin main
```

### cPanel VPS Deployment

```bash
# SSH in and set environment variables
export SMTP_PASSWORD=your_password
# ... etc
npm run start:prod
```

---

**Status**: ✅ Your app now works with or without `.env` file!
