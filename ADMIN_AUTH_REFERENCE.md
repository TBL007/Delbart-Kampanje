# Admin Authentication System - File Reference & Architecture

## 🗺️ Complete File Structure

```
your-project/
│
├── 📄 ROOT-LEVEL FILES (Configuration)
│   ├── auth.ts                          ⭐ NextAuth configuration
│   ├── auth.types.ts                    ⭐ TypeScript type definitions
│   ├── SUPABASE_SCHEMA.sql              ⭐ Database schema
│   ├── .env.local.example               ⭐ Environment variables template
│   │
│   └── DOCUMENTATION FILES
│       ├── ADMIN_AUTH_README.md         📖 System overview
│       ├── ADMIN_AUTH_SETUP.md          📖 Setup instructions
│       ├── ADMIN_AUTH_CHECKLIST.md      📖 Implementation checklist
│       └── ADMIN_AUTH_IMPLEMENTATION.md 📖 Complete guide (this file)
│
├── app/
│   │
│   ├── 🔐 SECURITY
│   │   └── middleware.ts                Route protection middleware
│   │
│   ├── 📑 ERROR PAGES
│   │   └── 403.tsx                      Forbidden access page
│   │
│   ├── 🛡️ ADMIN SECTION
│   │   ├── admin/
│   │   │   ├── page.tsx                 Admin dashboard
│   │   │   └── users/
│   │   │       └── page.tsx             Admin user management
│   │   │
│   │   └── utils/
│   │       └── admin.ts                 Helper functions
│   │
│   └── 🔌 API ROUTES
│       └── api/
│           ├── auth/
│           │   ├── [...nextauth]/
│           │   │   └── route.ts         NextAuth handler
│           │   ├── signin/
│           │   │   └── page.tsx         Login form page
│           │   └── error/
│           │       └── page.tsx         Auth error page
│           │
│           ├── admin/
│           │   └── users/
│           │       └── route.ts         Admin CRUD API
│           │
│           ├── session/
│           │   └── route.ts             Session info endpoint
│           │
│           └── signout/
│               └── route.ts             Sign-out endpoint
```

## 🔗 File Dependency Map

```
User Login Request
    ↓
    /api/auth/signin/page.tsx (UI)
         ↓
         auth.ts (NextAuth config)
              ├─ authorize() - Verify credentials
              ├─ jwt() - Check Supabase admin_users
              └─ session() - Populate session
         ↓
         [JWT Token Created]
         ↓
    User accesses /admin/*
         ↓
         middleware.ts - Validate token
              ├─ Check token exists
              ├─ Check token not expired
              └─ Check isAdmin === true
         ↓
    app/admin/page.tsx or
    app/admin/users/page.tsx
         ↓
         app/utils/admin.ts (requireAdmin guard)
              ├─ Verify session
              ├─ Check admin status
              └─ Redirect if unauthorized
         ↓
    API Requests
         ↓
         app/api/admin/users/route.ts
              ├─ POST - Create admin
              ├─ GET - List admins
              └─ DELETE - Remove admin
              ↓
              app/utils/admin.ts (getAdminSupabaseClient)
                   ↓
                   Supabase admin_users table
```

## 📊 Data Flow Diagram

### Authentication Flow
```
┌──────────────────┐
│  Login Form      │
│ (/api/auth/signin)│
└────────┬─────────┘
         │ email + password
         ↓
┌──────────────────────┐
│ NextAuth Credential  │
│ Provider             │
└────────┬─────────────┘
         │ authorize(credentials)
         ↓
┌──────────────────────────────┐
│ Verify Credentials           │
│ (Your auth logic here)       │
└────────┬─────────────────────┘
         │ if valid
         ↓
┌──────────────────────────────┐
│ JWT Callback                 │
│ - Check admin_users table    │
│ - Set isAdmin flag           │
│ - Set expiresAt              │
└────────┬─────────────────────┘
         │ JWT created
         ↓
┌──────────────────────────────┐
│ HTTP-Only Secure Cookie      │
│ Sent to browser              │
└────────┬─────────────────────┘
         │
         ↓
┌──────────────────────────────┐
│ Session Created              │
│ {user, expiresAt}            │
└──────────────────────────────┘
```

### Protected Route Access Flow
```
┌──────────────────┐
│ User visits      │
│ /admin/*         │
└────────┬─────────┘
         │
         ↓
┌──────────────────────────────┐
│ middleware.ts intercepts     │
│ - Get JWT from cookie        │
│ - Validate exists?           │
│ - Check expiration?          │
│ - Check isAdmin === true?    │
└────────┬──────────┬──────────┘
         │          │
    ✅ Valid       ❌ Invalid
         │          │
         ↓          ↓
    Proceed    Redirect to:
      to       - /api/auth/signin
    page         (if no token/expired)
               - /403
                 (if not admin)
```

### Admin API Flow
```
┌──────────────────────────┐
│ POST /api/admin/users    │
│ {email: "new@admin.com"} │
└────────┬─────────────────┘
         │
         ↓
┌──────────────────────────┐
│ requireAdmin() guard     │
│ - Verify session exists  │
│ - Check isAdmin: true    │
│ - Check not expired      │
└────────┬─────────────────┘
         │ if valid
         ↓
┌──────────────────────────────┐
│ Create in Supabase           │
│ INSERT INTO admin_users      │
│ (using service role key)     │
└────────┬─────────────────────┘
         │
         ↓
┌──────────────────────────┐
│ Return 201 + user data   │
└──────────────────────────┘
```

## 🔑 Key Interfaces & Types

### Session Type (from auth.types.ts)
```typescript
{
  user: {
    email: string;
    isAdmin: boolean;
    expiresAt: number;
    name?: string;
  };
}
```

### JWT Token Type (from auth.types.ts)
```typescript
{
  email: string;
  isAdmin: boolean;
  expiresAt: number;
  iat: number;          // Issued at
  exp: number;          // Expiration
  sub: string;          // Subject (user id)
}
```

### Admin User Type (Supabase)
```typescript
{
  id: string;                    // UUID
  email: string;                 // Unique email
  role: string;                  // 'admin' or custom
  created_at: string;            // ISO timestamp
  updated_at: string;            // ISO timestamp
}
```

## 🎯 Function Reference

### In `auth.ts`

**isUserAdmin(email)**
- Type: `async (email: string) => Promise<boolean>`
- Purpose: Check if email exists in admin_users table
- Used: JWT callback during login

**authorize(credentials)**
- Type: `async (credentials: {email, password}) => User | null`
- Purpose: Verify user credentials (YOU customize this)
- Used: During login attempt

### In `app/utils/admin.ts`

**requireAdmin()**
- Type: `async () => Promise<Session>`
- Purpose: Guard function for API routes
- Throws: Redirects if not admin or expired
- Used: At start of protected API routes

**isUserAdmin(email)**
- Type: `async (email: string) => Promise<boolean>`
- Purpose: Check if email is admin
- Used: To verify user before actions

**getAdminSupabaseClient()**
- Type: `() => SupabaseClient`
- Purpose: Get Supabase client with service role key
- Used: To query/modify admin_users table

## 🛣️ Route Map

### Public Routes (No Authentication Required)
```
GET  /                    → Home page
GET  /api/auth/signin     → Login form page
GET  /api/auth/error      → Error page
```

### Protected Routes (Authentication Required)
```
GET  /admin               → Admin dashboard (admin only)
GET  /admin/users         → User management UI (admin only)
GET  /api/admin/users     → List admins API (admin only)
POST /api/admin/users     → Create admin API (admin only)
DELETE /api/admin/users   → Delete admin API (admin only)
GET  /api/session         → Get current session (auth required)
POST /api/signout         → Sign out (auth required)
```

### Special Routes
```
GET  /403                 → Forbidden page (shown by middleware)
POST /api/auth/callback   → NextAuth callback (internal)
GET  /api/auth/providers  → List providers (internal)
```

## 🔄 Request/Response Examples

### Login Request
```
POST /api/auth/signin
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "securepassword"
}

Response: Redirect to /admin + Set-Cookie: next-auth.session-token=...
```

### Add Admin Request
```
POST /api/admin/users
Authorization: Cookie (HTTP-only)
Content-Type: application/json

{
  "email": "new-admin@example.com"
}

Response 201:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "new-admin@example.com",
  "role": "admin",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### List Admins Request
```
GET /api/admin/users
Authorization: Cookie (HTTP-only)

Response 200:
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "admin1@example.com",
    "role": "admin",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "email": "admin2@example.com",
    "role": "admin",
    "created_at": "2024-01-16T09:15:00Z",
    "updated_at": "2024-01-16T09:15:00Z"
  }
]
```

### Delete Admin Request
```
DELETE /api/admin/users
Authorization: Cookie (HTTP-only)
Content-Type: application/json

{
  "email": "admin@example.com"
}

Response 200:
{
  "message": "Admin user deleted successfully"
}
```

## 📋 Environment Variables Checklist

```bash
# ✅ REQUIRED
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
AUTH_SECRET=your_secret_here

# ✅ RECOMMENDED
AUTH_URL=http://localhost:3000  # Change in production
NODE_ENV=development             # or production

# ❌ OPTIONAL (if using OAuth)
# GITHUB_ID=...
# GITHUB_SECRET=...
```

## 🚦 Status Codes Reference

### Authentication Endpoints
| Code | Meaning |
|------|---------|
| 200 | Login successful, session created |
| 307 | Redirect to admin dashboard after login |
| 401 | Invalid credentials |
| 403 | User not admin |
| 500 | Server error |

### Admin API Endpoints
| Code | Meaning |
|------|---------|
| 200 | Success (GET, DELETE) |
| 201 | Created (POST) |
| 400 | Bad request (missing/invalid email) |
| 403 | Not authorized (not admin) |
| 409 | Conflict (admin already exists) |
| 500 | Server error |

## 🔍 Debugging Tips

### Enable Logging
```typescript
// Add to auth.ts
callbacks: {
  jwt({ token, user }) {
    console.log("JWT callback:", { token, user });
    return token;
  },
  session({ session, token }) {
    console.log("Session callback:", { session, token });
    return session;
  }
}
```

### Check JWT Payload
```typescript
// In browser console
// The JWT is in HttpOnly cookie (not accessible)
// But you can check the session:
const response = await fetch('/api/session');
const data = await response.json();
console.log(data.session);  // See email, isAdmin, expiresAt
```

### Monitor Database
```sql
-- Check all admin users
SELECT * FROM admin_users;

-- Check specific admin
SELECT * FROM admin_users WHERE email = 'admin@example.com';

-- View recent changes
SELECT * FROM admin_users ORDER BY updated_at DESC LIMIT 10;
```

### View Server Logs
```bash
# Terminal running `npm run dev`
# Look for logs from auth.ts callbacks
# Look for logs from middleware.ts
# Look for logs from API routes
```

## 📚 File Dependencies Summary

| File | Imports From | Exports |
|------|--------------|---------|
| auth.ts | NextAuth, Supabase | handlers, auth, signIn, signOut |
| middleware.ts | auth.ts, next/server | middleware, config |
| admin.ts | auth, Supabase, next/navigation | requireAdmin, isUserAdmin, getAdminSupabaseClient |
| users/route.ts | admin.ts, next/server | GET, POST, DELETE handlers |
| admin/page.tsx | admin.ts, auth | AdminPage component |
| admin/users/page.tsx | React hooks, fetch | AdminUsersPage component |
| [...nextauth]/route.ts | auth.ts | handlers |

---

This reference guide maps the entire authentication system. Use it to understand:
- How files relate to each other
- Where data flows through the system
- What each function does
- Expected inputs and outputs
