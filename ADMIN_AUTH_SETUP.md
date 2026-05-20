# Admin Authentication & Authorization Setup Guide

This guide walks you through setting up the production-ready admin authentication system.

## Prerequisites

- Next.js 16+ with App Router
- TypeScript
- Supabase project created
- `next-auth@5.0.0-beta.31` installed
- `@supabase/supabase-js` and `@supabase/ssr` installed

## Setup Steps

### 1. Environment Variables

Create `.env.local` in your project root with:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# NextAuth
AUTH_SECRET=your_generated_secret_here
```

Generate `AUTH_SECRET`:
```bash
npx auth secret
```

### 2. Supabase Schema Setup

1. Go to your Supabase dashboard → SQL Editor
2. Create a new query
3. Copy the entire contents of `SUPABASE_SCHEMA.sql`
4. Execute the query
5. Update the initial admin user email at the bottom of the schema file

Or manually run:
```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_admin_users_email ON admin_users(email);

-- Insert your email as the first admin
INSERT INTO admin_users (email, role) VALUES ('your-email@example.com', 'admin');
```

### 3. Update Authentication Logic

In `auth.ts`, the `authorize` function is a placeholder. Implement your actual authentication:

```typescript
// Option 1: Simple password verification
const isValidPassword = await bcrypt.compare(credentials.password, storedHash);

// Option 2: OAuth provider (Google, GitHub, etc.)
// Use NextAuth OAuth providers instead

// Option 3: External authentication service
const isValid = await verifyWithExternalService(email, password);
```

### 4. API Routes Handlers

The system includes these protected API routes:

- `GET /api/admin/users` - List all admin users
- `POST /api/admin/users` - Add new admin user
- `DELETE /api/admin/users` - Remove admin user

### 5. Protected Pages

- `/admin` - Admin dashboard
- `/admin/users` - Admin user management page

### 6. Middleware Protection

`middleware.ts` automatically protects all `/admin/*` routes by:
1. Checking if user has valid JWT token
2. Verifying token hasn't expired (7 days)
3. Confirming user's `isAdmin` flag is true
4. Redirecting unauthorized users appropriately

## Security Features

✅ **7-Day Session Expiration** - JWTs expire after 7 days
✅ **Server-Side Admin Checks** - All admin validation happens on the server
✅ **Supabase Service Role** - Only server uses service role key for database operations
✅ **Middleware Protection** - All /admin routes protected by middleware
✅ **No Client-Side Privilege Checks** - Admin status only enforced server-side
✅ **Secure Token Storage** - JWT stored in HTTP-only cookies by NextAuth
✅ **CSRF Protection** - Built into NextAuth

## How It Works

### Authentication Flow

1. **Login** → User submits email/password to NextAuth
2. **Verification** → `authorize()` callback validates credentials
3. **Admin Check** → JWT callback checks Supabase for admin status
4. **Token Creation** → JWT token created with:
   - `email`
   - `isAdmin` (boolean)
   - `expiresAt` (timestamp)
5. **Session** → NextAuth session created from JWT

### Protected Route Flow

1. **Request** → User accesses `/admin/...`
2. **Middleware** → `middleware.ts` intercepts request
3. **Token Check** → Middleware validates JWT exists
4. **Expiration Check** → Middleware verifies token not expired
5. **Admin Check** → Middleware confirms `isAdmin === true`
6. **Access** → Request allowed or redirected

### Admin Management Flow

1. **Navigate** → Admin goes to `/admin/users`
2. **Fetch** → Page calls `GET /api/admin/users`
3. **Verify** → API route calls `requireAdmin()`
4. **Query** → Service role fetches from Supabase
5. **Display** → List of admins shown in table
6. **Add/Remove** → POST/DELETE requests update Supabase

## Customization

### Change Session Duration

Edit `auth.ts`:
```typescript
session: {
  maxAge: 14 * 24 * 60 * 60, // 14 days instead of 7
},
jwt: {
  maxAge: 14 * 24 * 60 * 60,
},
```

### Add Multiple Authentication Providers

In `auth.ts`, add more providers:
```typescript
import GitHubProvider from "next-auth/providers/github";

providers: [
  GitHubProvider({
    clientId: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
  }),
  // ... other providers
]
```

### Add Custom API Endpoints

Create new files in `/api/admin/`:
```typescript
// app/api/admin/settings/route.ts
export async function GET(request: NextRequest) {
  await requireAdmin();
  // Your logic here
}
```

### Protect Other Routes

Add to middleware matcher:
```typescript
export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/protected/:path*", // Add custom protected routes
  ],
};
```

## Testing

### Test Login
1. Navigate to `/api/auth/signin`
2. Use your admin email and password "admin" (for development only)

### Test Admin Access
1. Login successfully
2. Navigate to `/admin` - should work
3. Try to access from non-admin account - should redirect to 403

### Test Session Expiration
1. Modify `NEXT_PUBLIC_SESSION_EXPIRY` to a short duration
2. Wait for expiration
3. Try accessing `/admin` - should redirect to login

### Test API Protection
```bash
# This should fail (no auth)
curl http://localhost:3000/api/admin/users

# This should work (after login)
curl -H "Authorization: Bearer YOUR_JWT" http://localhost:3000/api/admin/users
```

## Troubleshooting

### "Unauthorized" on `/admin` routes
- Check if `AUTH_SECRET` is set in `.env.local`
- Verify token has `isAdmin: true` in JWT payload
- Check Supabase connection and `admin_users` table

### Admin user not recognized
- Verify email exists in Supabase `admin_users` table
- Check if email matches exactly (case-sensitive)
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is correct

### Session expires too quickly
- Verify `session.maxAge` and `jwt.maxAge` settings
- Check system time sync
- Ensure `expiresAt` timestamp is calculated correctly

### CORS errors with API routes
- Add your domain to Supabase CORS settings if needed
- Service role key doesn't have CORS restrictions

## Production Checklist

- [ ] Update `authorize()` with real authentication logic
- [ ] Use strong, randomly generated `AUTH_SECRET`
- [ ] Store all secrets in `.env.local` (not committed)
- [ ] Enable Supabase RLS if needed (uncomment policies in schema)
- [ ] Set up email verification for new admins
- [ ] Add admin audit logging
- [ ] Configure your OAuth provider(s) with correct URLs
- [ ] Test all protected routes thoroughly
- [ ] Set up monitoring/alerts for failed auth attempts
- [ ] Document your authentication requirements

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
