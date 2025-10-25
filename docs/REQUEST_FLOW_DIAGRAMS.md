# 🔄 User Delete & CRUD - Request Flow Diagrams

## User Delete Flow (Fixed)

### Before Fix ❌

```
User clicks Delete
    ↓
Frontend calls: supabase.from('admin_users').delete()
    ↓
Uses Anon Key (limited permissions)
    ↓
Supabase RLS Policy Check
    ↓
❌ BLOCKED: Anon key not allowed to delete admin_users
    ↓
CORS Error: Browser blocks response
    ↓
Console Error: "No 'Access-Control-Allow-Origin' header"
    ↓
❌ Delete fails silently
```

### After Fix ✅

```
User clicks Delete
    ↓
Frontend shows confirmation dialog
    ↓
Frontend retrieves JWT token from localStorage
    ↓
Frontend sends DELETE /api/users/6 with Bearer token
    ↓
Browser sends OPTIONS preflight request
    ↓
Server responds with CORS headers
    ↓
Browser allows DELETE request to proceed
    ↓
Backend receives DELETE request
    ↓
Verify CORS Origin ✅ (localhost:5173 allowed)
    ↓
Extract JWT token from Authorization header ✅
    ↓
Verify JWT signature ✅ (token valid)
    ↓
Check user role ✅ (must be Admin)
    ↓
Check self-delete ✅ (prevent deleting yourself)
    ↓
Execute database delete with Service Role Key ✅
    ↓
Return: { success: true, message: "User deleted successfully" }
    ↓
Frontend removes user from list
    ↓
Show success toast notification
    ↓
✅ Delete succeeds
```

## Architecture Diagram

### Network Request Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (Client)                          │
│                  localhost:5173                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ UsersPage Component                                   │  │
│  │ deleteUser() {                                        │  │
│  │   token = localStorage.getItem('authToken')           │  │
│  │   fetch('/api/users/6', {                             │  │
│  │     method: 'DELETE',                                 │  │
│  │     Authorization: 'Bearer ' + token                  │  │
│  │   })                                                  │  │
│  │ }                                                     │  │
│  └─────────┬──────────────────────────────────────────┘  │
└────────────┼─────────────────────────────────────────────────┘
             │ DELETE /api/users/6
             │ + Authorization header
             ↓
CORS Preflight Check
             │ OPTIONS /api/users/6
             ↓
┌─────────────────────────────────────────────────────────────┐
│                  Express Backend                             │
│               localhost:3000                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ CORS Middleware                                     │   │
│  │ ✅ Check origin: localhost:5173                     │   │
│  │ ✅ Add CORS headers                                 │   │
│  │ ✅ Handle OPTIONS preflight                         │   │
│  └────────────────┬───────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────┐   │
│  │ Express Router (DELETE /api/users/:id)             │   │
│  │ └─→ verifyAdmin middleware                         │   │
│  │     ✅ Extract JWT token                           │   │
│  │     ✅ Verify signature                            │   │
│  │     ✅ Check role === 'Admin'                      │   │
│  │     ✅ Attach user to request                      │   │
│  │                                                      │   │
│  │ └─→ Route handler                                  │   │
│  │     ✅ Check self-delete protection                │   │
│  │     ✅ Delete from database                        │   │
│  │     ✅ Return success response                     │   │
│  └────────────────┬───────────────────────────────────┘   │
└────────────────┼────────────────────────────────────────────┘
                 │ Response + CORS headers
                 ↓
┌─────────────────────────────────────────────────────────────┐
│              Supabase Database                               │
│  Service Role Key Operations (Backend Only)                 │
│  ✅ RLS Policies bypassed (service role has full access)    │
│  ✅ DELETE executed                                          │
│  ✅ User record removed                                      │
└─────────────────────────────────────────────────────────────┘
                 │
                 ↓ Response
┌─────────────────────────────────────────────────────────────┐
│                   Browser (Client)                           │
│  ✅ Receives response with 200 OK                           │
│  ✅ Response headers have Access-Control-Allow-Origin       │
│  ✅ JavaScript can read response                            │
│  ✅ Update UI: Remove user from list                        │
│  ✅ Show toast: "User deleted successfully"                 │
└─────────────────────────────────────────────────────────────┘
```

## Authorization Decision Tree

```
Request arrives at DELETE /api/users/6

                    ↓
    Is Authorization header present?
            /                    \
           YES                   NO
            ↓                     ↓
    Extract Bearer token    Return 401
            ↓           "No token provided"
    Is JWT valid?
        /      \
      YES      NO
       ↓        ↓
    Decode  Return 401
    Token   "Invalid token"
       ↓
    Is role === 'Admin'?
        /               \
      YES              NO
       ↓                ↓
    Proceed        Return 403
       ↓           "Only admins..."
    Is id === current_user.id?
        /                    \
      YES                    NO
       ↓                      ↓
    Return 400          Proceed with
    "Cannot delete      delete
    yourself"           ↓
                    Query database
                    with Service Role
                        ↓
                    ✅ Delete user
                    ✅ Return success
```

## Data Flow - Delete Operation

```
┌────────────────────────────────────────────────────────────┐
│ Frontend State                                             │
│ - users: [...] (includes id:6)                            │
│ - authToken: "eyJ..." (JWT from login)                    │
└────────────────────────┬─────────────────────────────────┘
                        │ User clicks Delete
                        ↓
┌────────────────────────────────────────────────────────────┐
│ DELETE Request                                             │
│ URL: /api/users/6                                         │
│ Method: DELETE                                             │
│ Headers: {                                                 │
│   Authorization: "Bearer eyJ..."                          │
│   Content-Type: "application/json"                        │
│ }                                                          │
└────────────────────────┬─────────────────────────────────┘
                        │
                        ↓
┌────────────────────────────────────────────────────────────┐
│ Backend Processing                                         │
│ 1. Verify CORS ✅                                          │
│ 2. Parse JWT ✅                                            │
│ 3. Check authorization ✅                                  │
│ 4. Query: DELETE FROM admin_users WHERE id = 6             │
│ 5. Supabase RLS: Service role bypasses policies ✅         │
│ 6. Database: Record deleted ✅                             │
└────────────────────────┬─────────────────────────────────┘
                        │
                        ↓
┌────────────────────────────────────────────────────────────┐
│ Response                                                   │
│ Status: 200 OK                                             │
│ Headers: {                                                 │
│   Access-Control-Allow-Origin: "http://localhost:5173"   │
│   Content-Type: "application/json"                        │
│ }                                                          │
│ Body: {                                                    │
│   "success": true,                                         │
│   "message": "User deleted successfully"                  │
│ }                                                          │
└────────────────────────┬─────────────────────────────────┘
                        │
                        ↓
┌────────────────────────────────────────────────────────────┐
│ Frontend Update                                            │
│ 1. Receive response ✅                                     │
│ 2. setUsers(users.filter(u => u.id !== 6))               │
│ 3. Show toast: "User deleted successfully"                │
│ 4. UI re-renders without user 6                           │
└────────────────────────────────────────────────────────────┘
```

## CORS Handshake Diagram

### Step 1: Browser Preflight Request

```
OPTIONS /api/users/6
Host: localhost:3000
Origin: http://localhost:5173
Access-Control-Request-Method: DELETE
Access-Control-Request-Headers: Authorization, Content-Type
```

### Step 2: Server Response to Preflight

```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true

(Empty body)
```

### Step 3: Actual DELETE Request (Allowed)

```
DELETE /api/users/6
Host: localhost:3000
Origin: http://localhost:5173
Authorization: Bearer eyJ...
Content-Type: application/json
```

### Step 4: Successful Response

```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
Content-Type: application/json

{
  "success": true,
  "message": "User deleted successfully"
}
```

## Error Flow Examples

### Scenario 1: No Token

```
Request: DELETE /api/users/6 (No Authorization header)
    ↓
Backend: Authorization header missing
    ↓
Response: 401 Unauthorized
Body: { "error": "No token provided" }
    ↓
Frontend: Toast error: "No token provided"
```

### Scenario 2: Invalid Role

```
Request: DELETE /api/users/6
Token: JWT with role: "Manager" (not Admin)
    ↓
Backend: jwt.verify() ✅, role check ❌
    ↓
Response: 403 Forbidden
Body: { "error": "Only admins can perform this action" }
    ↓
Frontend: Toast error: "Only admins can delete"
```

### Scenario 3: Self-Delete

```
Request: DELETE /api/users/6
Token: JWT with id: 6 (trying to delete self)
    ↓
Backend: Authorization ✅, self-check ❌
    ↓
Response: 400 Bad Request
Body: { "error": "Cannot delete your own account" }
    ↓
Frontend: Toast error: "Cannot delete your own account"
```

## Status & State Management

### Frontend LocalStorage

```javascript
// After successful login:
localStorage.authToken = "eyJ0eXAiOiJKV1QiLCJhbGc...";
localStorage.userData = JSON.stringify({
  id: 1,
  name: "Admin User",
  email: "admin@example.com",
  role: "Admin",
});

// After successful delete:
users.splice(
  users.findIndex((u) => u.id === 6),
  1
);
setUsers([...filteredUsers]);
```

### Backend JWT Payload

```javascript
// Token created at login:
{
  id: 1,
  name: "Admin User",
  email: "admin@example.com",
  role: "Admin",
  iat: 1698153600,
  exp: 1698240000  // 24 hours later
}

// Verified on each request:
if (decoded.role !== 'Admin') {
  return 403 Forbidden
}
```

---

This comprehensive flow documentation helps understand exactly what happens at each step of the user delete process and how authorization protects the operation.
