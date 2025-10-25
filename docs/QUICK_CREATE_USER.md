# 🚀 Quick Reference - Creating & Using New Admin Users

## Current Servers Status

```
✅ Backend API: http://localhost:3000/api
✅ Frontend Dev: http://localhost:5174 (with HMR hot reload)
✅ Email Service: Running automatically
```

## Create New Admin User (5 Steps)

### 1️⃣ Login as Admin

- URL: `http://localhost:5174/admin/login`
- Email: `admin@jklgtravel.com`
- Password: `admin123`

### 2️⃣ Go to Users

- Click **Admin** menu
- Click **Users**
- Click **Add New User** button

### 3️⃣ Fill User Form

```
Name: [Full Name]
Email: [unique email]
Phone: [phone number]
Role: Admin or Support
Password: [at least 6 chars] ⭐ IMPORTANT
Confirm Password: [must match]
Status: Active
Avatar: [optional]
```

### 4️⃣ Create User

- Click **Create User** button
- Wait for "User created successfully!" message

### 5️⃣ Test Login

- Logout current admin
- Go to http://localhost:5174/admin/login
- Use new user's email & password
- Should login successfully ✅

## Key Points

✅ **Password MUST be at least 6 characters**
✅ **Password is hashed with bcrypt before saving**
✅ **Only admins can create new users**
✅ **Email must be unique**
✅ **Frontend has hot reload (no refresh needed)**

## Troubleshooting

### "Password not set" error

- ❌ Problem: Password was created with old code
- ✅ Solution: Delete user, create again with current code

### "No authentication token found"

- ❌ Problem: Not logged in as admin
- ✅ Solution: Login as admin first

### Frontend changes not showing

- ❌ Problem: Browser cache
- ✅ Solution: Press F5 to refresh (Vite handles HMR)

### Can't connect to backend

- ❌ Problem: Backend not running
- ✅ Solution: Run `npm start` in backend folder

---

**Everything is working! Try creating a new user now.** 🎉
