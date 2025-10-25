# Testing User CRUD & Delete Functionality

## Quick Test Procedure

### Setup

1. Backend running on `http://localhost:3000`
2. Frontend running on `http://localhost:5173`
3. Logged in as admin with valid JWT token

### Test Cases

#### ✅ Test 1: Delete User

1. Go to Admin Panel → Users
2. Identify a test user (not yourself)
3. Click the **Trash/Delete icon** in the user row
4. Confirm the deletion dialog
5. **Expected**: User removed from list, success toast notification

**If CORS error appears in console:**

- The fix has been applied - CORS headers should now be sent
- Verify backend is running: `npm start` in backend folder
- Check browser console for specific error message
- If still failing, backend restart needed

#### ✅ Test 2: Toggle User Status

1. Go to Admin Panel → Users
2. Click the **Status Toggle** button (circle icon showing Active/Inactive)
3. User status should change immediately
4. **Expected**: Success notification, status updated in UI and database

#### ✅ Test 3: Edit User

1. Go to Admin Panel → Users
2. Click the **Edit icon** (pencil)
3. Update any field (name, email, phone, role)
4. Click **Save**
5. **Expected**: Changes reflected immediately, success notification

#### ✅ Test 4: API Direct Test (curl)

**Login and get token:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@jklgtravel.com","password":"admin123"}'
```

Copy the returned `token` value.

**List users:**

```bash
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Delete user (ID 6):**

```bash
curl -X DELETE http://localhost:3000/api/users/6 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected response:**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

#### ✅ Test 5: Authorization Check

1. Try deleting your own user (should fail)
2. **Expected error**: "Cannot delete your own account"
3. Try deactivating yourself (should fail)
4. **Expected error**: "Cannot deactivate your own account"

#### ✅ Test 6: Error Cases

1. Delete non-existent user (ID: 99999)
   - **Expected**: 404 Not Found
2. Create user with duplicate email
   - **Expected**: 409 Conflict
3. Invalid status value
   - **Expected**: 400 Bad Request

## Browser Console Checks

### ✅ Good Signs

- No CORS errors
- DELETE request shows status 200 (OK)
- Response JSON with `{ "success": true }`
- No 401/403/404 errors for valid operations

### ❌ Error Signs

```
CORS error: No 'Access-Control-Allow-Origin' header
→ Backend not running or needs restart

401 Unauthorized: Invalid token
→ Token expired, log in again

403 Forbidden: Only admins can delete users
→ User account role is not "Admin"

404 Not Found: User not found
→ User already deleted or wrong ID

500 Server Error: Failed to delete user
→ Database error, check backend logs
```

## Endpoint Reference

| Method | Endpoint                | Purpose         |
| ------ | ----------------------- | --------------- |
| GET    | `/api/users`            | List all users  |
| GET    | `/api/users/:id`        | Get single user |
| POST   | `/api/users`            | Create user     |
| PUT    | `/api/users/:id`        | Update user     |
| DELETE | `/api/users/:id`        | Delete user     |
| PATCH  | `/api/users/:id/status` | Toggle status   |

## Files That Were Updated

1. **backend/routes/users.js** (NEW)

   - Implements all CRUD endpoints
   - Includes authorization middleware
   - Full error handling

2. **backend/server.js** (MODIFIED)

   - Enhanced CORS with explicit headers
   - Imported and registered users routes
   - Added OPTIONS handler

3. **website/src/admin/users/UsersPage.tsx** (MODIFIED)
   - deleteUser now calls `/api/users/:id`
   - toggleUserStatus now calls `/api/users/:id/status`
   - Both send JWT token

## Troubleshooting

### Problem: CORS Error on DELETE

**Solution:**

```bash
# Kill old node processes
Stop-Process -Name node -Force

# Restart backend
cd backend
npm start
```

### Problem: 401 Unauthorized

**Solution:**

- Log in again to get fresh token
- Check token is in localStorage
- Verify token in Authorization header

### Problem: 403 Forbidden

**Solution:**

- Verify user account has "Admin" role
- Non-admin users cannot perform CRUD operations

### Problem: Delete fails silently

**Solution:**

- Check browser console for errors
- Verify backend console shows request
- Check network tab in DevTools
- Look for 200 status with error in response

### Problem: Changes don't persist

**Solution:**

- Verify response was 200 OK
- Check backend logs for errors
- Refresh page and verify in database
- Check Supabase dashboard

## Backend Restart Command

If any issues persist, restart the backend:

```bash
cd c:\Users\spike\OneDrive\Documents\Travelers\backend
npm start
```

The server should display:

```
📧 Email service started (background process)
🌐 Website server running on http://localhost:3000
```

## Next Steps

Once testing is complete:

1. ✅ Verify all CRUD operations work
2. ✅ Confirm CORS errors are gone
3. ✅ Test authorization (403 for non-admins)
4. ✅ Test error cases
5. Deploy to Vercel (frontend) & Railway (backend)
