# ✅ Environment Variables - Complete Setup

## 🎯 Summary of Changes

Your application now supports **both** `.env` files AND system environment variables:

### ✨ What This Means

**Before:**

- ❌ Needed `.env` file to run
- ❌ Couldn't work on hosting without .env
- ❌ Required uploading sensitive files

**After:**

- ✅ Works with `.env` file (local dev)
- ✅ Works with environment variables (production)
- ✅ Perfect for hosting (Railway, cPanel, Heroku)
- ✅ Never need to upload `.env` to hosting

---

## 🚀 How to Use

### Local Development

```bash
# Create .env from template
cp .env.example .env

# Edit with your values
nano .env

# Run (uses .env file)
npm start
```

### Production Deployment

#### On Railway.app

```bash
# Set variables in Railway Dashboard > Variables
SMTP_HOST=mail.abctravels.site
SMTP_PORT=587
SMTP_USER=test@abctravels.site
SMTP_PASSWORD=your_password
SUPABASE_SERVICE_ROLE_KEY=your_key

# Deploy
git push origin main
```

#### On cPanel VPS

```bash
# SSH in
ssh username@vps-ip

# Set environment variables
export SMTP_HOST=mail.abctravels.site
export SMTP_PORT=587
export SMTP_USER=test@abctravels.site
export SMTP_PASSWORD=your_password
export SUPABASE_SERVICE_ROLE_KEY=your_key

# Run app
npm run start:prod
```

#### On Heroku

```bash
# Set config variables
heroku config:set SMTP_HOST=mail.abctravels.site
heroku config:set SMTP_PORT=587
heroku config:set SMTP_USER=test@abctravels.site
heroku config:set SMTP_PASSWORD=your_password
heroku config:set SUPABASE_SERVICE_ROLE_KEY=your_key

# Deploy
git push heroku main
```

---

## 📋 Environment Variables Checklist

### For Email Service (REQUIRED)

- [ ] `SMTP_HOST` - Your SMTP server
- [ ] `SMTP_PORT` - SMTP port (usually 587)
- [ ] `SMTP_USER` - Email address
- [ ] `SMTP_PASSWORD` - Email password

### For Supabase (REQUIRED)

- [ ] `SUPABASE_SERVICE_ROLE_KEY` - From Supabase > Settings > API

### Optional

- [ ] `SMTP_FROM` - From address (default: noreply@abctravels.site)
- [ ] `PORT` - Server port (default: 3000)
- [ ] `VITE_SUPABASE_URL` - Supabase URL (default: your-project.supabase.co)

---

## 🔍 How It Works

### When App Starts

1. **Check if `.env` exists**

   - YES → Load variables from `.env`
   - NO → Continue to step 2

2. **Use system environment variables**

   - Check for required variables in system environment
   - If found → Use them
   - If missing → Show error

3. **Validate credentials**

   - SMTP user/password present?
   - Supabase key present?
   - If no → Show clear error message

4. **Start services**
   - Express server on port 3000
   - Email service in background
   - Both running automatically

---

## ✅ Testing

### Test 1: With .env File (Local)

```bash
# Ensure .env exists with credentials
ls -la .env

# Run
npm start

# Expected: "✅ Email service started (background process)"
```

### Test 2: Without .env File (Production Simulation)

```bash
# Temporarily rename .env
mv .env .env.backup

# Set environment variables
export SMTP_HOST=mail.abctravels.site
export SMTP_PORT=587
export SMTP_USER=test@abctravels.site
export SMTP_PASSWORD=your_password
export SUPABASE_SERVICE_ROLE_KEY=your_key

# Run
npm start

# Should still work without .env file!
# Expected: "ℹ️  .env file not found. Using environment variables instead."

# Restore .env
mv .env.backup .env
```

---

## 🐛 Troubleshooting

### Error: "Missing SMTP environment variables"

**Solution:** Set these variables:

```bash
export SMTP_HOST=your_host
export SMTP_PORT=587
export SMTP_USER=your_email
export SMTP_PASSWORD=your_password
```

### Error: "SUPABASE_SERVICE_ROLE_KEY not set"

**Solution:** Get key from Supabase > Settings > API > Service Role Key

```bash
export SUPABASE_SERVICE_ROLE_KEY=your_key
```

### Emails not sending

1. Check if variables are set: `echo $SMTP_USER`
2. Verify email credentials are correct
3. Check server logs for errors
4. Test SMTP connection: `telnet mail.abctravels.site 587`

---

## 📂 Files Modified

1. **server.js** ✅

   - Checks for `.env` file existence
   - Falls back to environment variables
   - Validates SMTP credentials

2. **email-sender.js** ✅

   - Checks for `.env` file existence
   - Uses environment variables if needed
   - Better error messages

3. **start-dev-with-emails.js** ✅
   - Development server with fallback logic
   - Email service validates variables

---

## 🎯 Deployment Ready

Your app is now **production-ready** for:

✅ **Railway.app** - Set variables in dashboard
✅ **cPanel VPS** - Set with export commands
✅ **Heroku** - Set with heroku config:set
✅ **Docker** - Pass env vars to container
✅ **AWS** - Set in environment variables
✅ **Google Cloud** - Set in env config
✅ **Azure** - Set in app settings
✅ **DigitalOcean** - Set in app platform

---

## 🔒 Security Notes

### ✅ DO

- Use environment variables in production
- Rotate passwords regularly
- Use `.env` for local development only
- Add `.env` to `.gitignore` ✓ (already done)

### ❌ DON'T

- Commit `.env` to Git
- Hardcode passwords
- Share credentials in chat/email
- Upload `.env` to hosting

---

## 📖 Quick Reference

| Environment | Method    | Command                         |
| ----------- | --------- | ------------------------------- |
| Local Dev   | .env file | `npm start`                     |
| Production  | Env vars  | Set vars + `npm run start:prod` |
| Railway     | Dashboard | Set vars in UI + git push       |
| Heroku      | CLI       | `heroku config:set` + git push  |
| Docker      | Docker    | Pass with `-e` flag             |

---

## ✨ Status

**✅ Complete!** Your application now:

- Works with `.env` file (development)
- Works with environment variables (production)
- Provides clear error messages
- Ready for any hosting platform
- Fully backwards compatible

**No code changes needed!** Everything works as before, but now supports environment variables too.
