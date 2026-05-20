# Admin Authentication System - Implementation Checklist

A complete production-ready admin authentication and authorization system for Next.js App Router using NextAuth, Supabase, and middleware protection.

## Quick Start Checklist

### 1. Environment Setup
- [ ] Copy `.env.local.example` to `.env.local`
- [ ] Add Supabase credentials to `.env.local`
- [ ] Generate and add `AUTH_SECRET` to `.env.local` using: `npx auth secret`

### 2. Supabase Setup
- [ ] Go to Supabase Dashboard
- [ ] Create new query in SQL Editor
- [ ] Copy contents of `SUPABASE_SCHEMA.sql`
- [ ] Run the query to create `admin_users` table
- [ ] Insert your email as the first admin user
- [ ] (Optional) Enable Row Level Security (RLS) on the table

### 3. Code Files Created

#### Core Authentication
- [auth.ts](auth.ts) - NextAuth configuration with JWT strategy
- [auth.types.ts](auth.types.ts) - TypeScript type definitions for auth

#### Middleware Protection
- [app/middleware.ts](app/middleware.ts) - Protects all /admin routes

#### Admin Utilities
- [app/utils/admin.ts](app/utils/admin.ts) - Helper functions (requireAdmin, isUserAdmin)

#### Admin API Routes
- [app/api/admin/users/route.ts](app/api/admin/users/route.ts) - CRUD operations for admin users
- [app/api/auth/[...nextauth]/route.ts](app/api/auth/%5B...nextauth%5D/route.ts) - NextAuth handler
- [app/api/session/route.ts](app/api/session/route.ts) - Get current session
- [app/api/signout/route.ts](app/api/signout/route.ts) - Sign out endpoint

#### Admin Pages
- [app/admin/page.tsx](app/admin/page.tsx) - Admin dashboard
- [app/admin/users/page.tsx](app/admin/users/page.tsx) - Admin user management
- [app/403.tsx](app/403.tsx) - Forbidden access page
- [app/api/auth/signin/page.tsx](app/api/auth/signin/page.tsx) - Sign in page
- [app/api/auth/error/page.tsx](app/api/auth/error/page.tsx) - Error page

### 4. Update Authentication Logic

In [auth.ts](auth.ts), update the `authorize()` function:

```typescript
// Replace the placeholder authentication logic with your actual logic:
async authorize(credentials) {
  // Option 1: Hash password verification
  const user = await db.user.findUnique({ email: credentials.email });
  const isValid = await bcrypt.compare(credentials.password, user.password);
  
  // Option 2: External service
  const isValid = await verifyWithService(credentials.email, credentials.password);
  
  // Option 3: OAuth provider (use NextAuth OAuth providers instead)
  
  if (isValid) {
    return { id: credentials.email, email: credentials.email };
  }
  throw new Error("Invalid credentials");
}
```

### 5. Test the System

**Test 1: Login Flow**
```bash
1. Navigate to http://localhost:3000/api/auth/signin
2. Enter your admin email and password
3. Should redirect to /admin dashboard
```

**Test 2: Protected Routes**
```bash
1. Try accessing http://localhost:3000/admin as non-admin
2. Should redirect to 403 page
3. Log in with admin account
4. Should access /admin without issues
```

**Test 3: Admin User Management**
```bash
1. Go to http://localhost:3000/admin/users
2. Add a new admin by email
3. Verify user appears in the list
4. Remove admin and verify it's gone
```

**Test 4: API Protection**
```bash
# Should fail without authentication
curl http://localhost:3000/api/admin/users

# Should fail with non-admin account
curl -H "Cookie: your_non_admin_jwt" http://localhost:3000/api/admin/users

# Should work with admin account
curl -H "Cookie: your_admin_jwt" http://localhost:3000/api/admin/users
```

## System Architecture

```
┌─────────────────────────────────────────────────┐
│              Next.js App Router                  │
├─────────────────────────────────────────────────┤
│
├─── /admin/* routes ──► middleware.ts ──┐
│                                         │
│                                    ┌────▼─────────┐
│                                    │ Token Valid? │
│                                    │ Admin? Exp?  │
│                                    └──────┬───────┘
│                                           │
│              ┌────────────────────────────┘
│              │
│         ┌────▼─────┐
│         │ Redirect │
│         │ or Allow │
│         └──────────┘
│
├─── /api/admin/users ──► POST/GET/DELETE ──► Supabase
│                                │
│                         (Service Role Key)
│
└─────────────────────────────────────────────────┘

Authentication Flow:
1. User submits email/password to /api/auth/signin
2. NextAuth verifies credentials via authorize()
3. JWT created with: email, isAdmin, expiresAt
4. Session created from JWT (HTTP-only cookie)
5. Middleware verifies JWT on every /admin request
6. Admin APIs use Supabase service role for database access
```

## Security Features Implemented

✅ **7-Day JWT Expiration** - Sessions expire after 7 days
✅ **Server-Side Admin Validation** - All checks happen server-side
✅ **Service Role Protection** - Only server uses Supabase service role
✅ **Middleware Route Protection** - All /admin/* protected
✅ **No Client-Side Privilege Checks** - Admin status only from server
✅ **HTTP-Only Cookies** - JWT never accessible from JavaScript
✅ **CSRF Token Protection** - Built into NextAuth
✅ **Secure Token Storage** - NextAuth default best practices

## Key Files Reference

### auth.ts
- Configures NextAuth with JWT strategy
- Implements credential verification
- Checks admin status from Supabase
- Sets 7-day expiration

### middleware.ts
- Protects /admin/* routes
- Validates JWT exists
- Checks expiration
- Verifies isAdmin flag
- Redirects unauthorized users

### app/utils/admin.ts
- `requireAdmin()` - Guard for API routes
- `isUserAdmin()` - Check if email is admin
- `getAdminSupabaseClient()` - Get service role client

### app/api/admin/users/route.ts
- GET - List all admin users
- POST - Add new admin
- DELETE - Remove admin
- All protected by requireAdmin()

## Troubleshooting

### "Unauthorized" when accessing /admin
**Solution:** Check if:
- `AUTH_SECRET` is set in `.env.local`
- User exists in Supabase `admin_users` table
- Email matches exactly
- JWT hasn't expired

### Admin user not recognized
**Solution:**
- Verify user email in Supabase `admin_users` table
- Check `SUPABASE_SERVICE_ROLE_KEY` is correct
- Check database connection

### Session expires unexpectedly
**Solution:**
- Verify `session.maxAge` and `jwt.maxAge` in auth.ts
- Check system time synchronization
- Look at `expiresAt` timestamp calculation

### CORS errors
**Solution:**
- Service role key doesn't have CORS restrictions
- If using Supabase client from browser, add CORS origin in Supabase settings

## Next Steps

1. **Implement Real Authentication**
   - Replace `authorize()` placeholder with actual logic
   - Connect to user database or OAuth provider

2. **Add Audit Logging**
   - Log all admin actions
   - Track failed login attempts
   - Monitor access to sensitive endpoints

3. **Email Verification**
   - Verify email before adding as admin
   - Send confirmation emails

4. **Two-Factor Authentication**
   - Add 2FA for admin accounts
   - Use time-based one-time passwords (TOTP)

5. **Session Management**
   - Add session listing/revocation
   - Show active sessions per admin
   - Add "logout from all devices" option

6. **Role-Based Access Control (RBAC)**
   - Instead of just `isAdmin: true/false`
   - Implement granular roles (viewer, editor, admin)
   - Check specific permissions in middleware

## Production Deployment

Before deploying to production:

- [ ] Set strong, random `AUTH_SECRET`
- [ ] Set `AUTH_URL` to your production domain
- [ ] Implement real authentication (not dev password)
- [ ] Enable Supabase RLS for extra security
- [ ] Set up monitoring and alerting
- [ ] Configure OAuth provider URLs
- [ ] Test all routes thoroughly
- [ ] Set up HTTPS/TLS
- [ ] Enable audit logging
- [ ] Document admin procedures

## Documentation

See [ADMIN_AUTH_SETUP.md](ADMIN_AUTH_SETUP.md) for detailed setup instructions and [SUPABASE_SCHEMA.sql](SUPABASE_SCHEMA.sql) for database schema.
