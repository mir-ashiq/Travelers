# ✅ Admin Authentication Setup - Complete Guide

## What Was Changed

### 🔐 Database Updates

- Added `password_hash` column to `admin_users` table
- Added `last_login` timestamp column
- Added `is_active` boolean flag

### 🎯 Backend Changes

- Created `/api/auth` endpoints for login, password change, and token verification
- Implemented JWT token generation for secure sessions
- Added password hashing with bcrypt
- Integrated auth into Express server

### 💻 Frontend Changes

- Updated login form to use real backend API instead of hardcoded demo
- Login now connects to `/api/auth/login` endpoint

---

## 📋 Setup Steps

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

This installs:

- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token generation

### Step 2: Set Admin Password

For each admin user that needs a password:

```bash
node create-admin.js
```

This will:

1. Show list of existing admins
2. Let you select one
3. Prompt for a new password
4. Hash and save to database

**Example:**

```
📝 Admin Password Setup
═══════════════════════════════════════

Available Admin Users:

  1. admin@jklgtravel.com (Admin) - Admin User
  2. priya@jklgtravel.com (Manager) - Priya Kaul
  3. raj@jklgtravel.com (Guide) - Raj Gupta
  4. zara@jklgtravel.com (Support) - Zara Khan

Select admin number (or enter email): 1
✅ Selected: admin@jklgtravel.com (Admin)

Enter password: ••••••
Confirm password: ••••••
🔐 Hashing password...
✅ Password set successfully!

Login Credentials:
  Email: admin@jklgtravel.com
  Password: your-password
```

### Step 3: Update JWT Secret (Production)

In `.env`, change:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2025
```

To something unique:

```env
JWT_SECRET=your-unique-secret-key-at-least-32-characters-long-abc123def456
```

### Step 4: Test Login

1. Start backend:

```bash
cd backend && npm start
```

2. Start frontend:

```bash
cd website && npm run dev
```

3. Go to http://localhost:5173
4. Login with the email and password you set

---

## 🔄 Login Flow

```
User enters credentials (email, password)
         ↓
Frontend sends POST to /api/auth/login
         ↓
Backend verifies email exists in admin_users
         ↓
Backend compares password hash with bcrypt
         ↓
If valid: Generate JWT token
         ↓
Return token + user data to frontend
         ↓
Frontend stores token in localStorage
         ↓
Frontend uses token for future API requests
```

---

## 📡 API Endpoints

### POST /api/auth/login

**Login**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@jklgtravel.com","password":"admin123"}'
```

Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "admin@jklgtravel.com",
    "name": "Admin User",
    "role": "Admin"
  }
}
```

### POST /api/auth/change-password

**Change Password**

```bash
curl -X POST http://localhost:3000/api/auth/change-password \
  -H "Content-Type: application/json" \
  -d {
    "email":"admin@jklgtravel.com",
    "currentPassword":"oldpassword",
    "newPassword":"newpassword"
  }
```

### POST /api/auth/verify

**Verify Token**

```bash
curl -X POST http://localhost:3000/api/auth/verify \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

---

## 🚨 Troubleshooting

### "Invalid credentials" on login

**Check:**

- Password was set with `node create-admin.js`
- User `is_active` is `true` in database
- Email matches exactly (case-sensitive)

### "Password not set"

**Fix:**

```bash
node create-admin.js
```

### "Cannot connect to API"

**Check:**

- Backend is running: `npm start` in backend folder
- `VITE_API_BASE_URL` in website/.env is correct
- Both servers on correct ports (3000 backend, 5173 frontend)

### "Token invalid/expired"

**Fix:**

- Clear localStorage: Press F12 → Application → localStorage → Clear All
- Login again
- Tokens expire in 24 hours

---

## 🔒 Security Best Practices

✅ **Passwords are hashed** with bcrypt (10 rounds)  
✅ **JWT tokens expire** after 24 hours  
✅ **Tokens stored** securely in localStorage  
✅ **HTTPS required** for production  
✅ **Change JWT_SECRET** before deploying

---

## 📊 Database Schema

### admin_users table

```sql
id              INTEGER PRIMARY KEY
name            TEXT
email           TEXT UNIQUE
phone           TEXT
role            TEXT (Admin|Manager|Guide|Support)
avatar          TEXT
status          TEXT
password_hash   TEXT (NEW)
last_login      TIMESTAMP (NEW)
is_active       BOOLEAN (NEW)
created_at      TIMESTAMP
```

---

## ✅ Next Steps

1. ✅ Set passwords for all admin users
2. ✅ Start both servers
3. ✅ Test login with new credentials
4. ✅ Deploy to production
5. ✅ Change JWT_SECRET on prod server

---

**For your new admin:** Follow Step 2 above to set their password!
