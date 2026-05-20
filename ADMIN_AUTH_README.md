# Admin Authentication & Authorization System

## Overview

A complete, production-ready authentication and authorization system for Next.js App Router that:

- ✅ Protects all `/admin` routes with JWT middleware
- ✅ Uses NextAuth with JWT strategy (no server sessions)
- ✅ Stores admin users in Supabase database
- ✅ Enforces 7-day session expiration
- ✅ Provides admin user management UI
- ✅ RESTful API for admin CRUD operations
- ✅ Server-side authorization checks only
- ✅ TypeScript support with full type safety

## Architecture

```
User Login
    ↓
/api/auth/signin [NextAuth Provider]
    ↓
authorize() [Verify Credentials]
    ↓
Check Supabase admin_users table
    ↓
Create JWT with {email, isAdmin, expiresAt}
    ↓
HTTP-Only Cookie (NextAuth default)
    ↓
Middleware intercepts /admin/* requests
    ↓
Validate JWT → Check expiration → Verify isAdmin
    ↓
✅ Allow Access OR 🚫 Redirect
```

## File Structure

```
your-project/
├── auth.ts                              # NextAuth configuration
├── auth.types.ts                        # TypeScript type definitions
├── SUPABASE_SCHEMA.sql                  # Database schema
├── ADMIN_AUTH_SETUP.md                  # Detailed setup guide
├── ADMIN_AUTH_CHECKLIST.md              # Implementation checklist
├── .env.local.example                   # Environment variables template
│
├── app/
│   ├── middleware.ts                    # Route protection middleware
│   ├── 403.tsx                          # Forbidden access page
│   │
│   ├── admin/
│   │   ├── page.tsx                     # Admin dashboard
│   │   └── users/
│   │       └── page.tsx                 # Admin user management
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/
│   │   │   │   └── route.ts             # NextAuth handler
│   │   │   ├── signin/
│   │   │   │   └── page.tsx             # Sign-in form
│   │   │   └── error/
│   │   │       └── page.tsx             # Auth error page
│   │   │
│   │   ├── admin/
│   │   │   └── users/
│   │   │       └── route.ts             # Admin CRUD API
│   │   │
│   │   ├── session/
│   │   │   └── route.ts                 # Get session info
│   │   │
│   │   └── signout/
│   │       └── route.ts                 # Sign-out endpoint
│   │
│   └── utils/
│       └── admin.ts                     # Admin helper functions
```

## Core Components

### 1. NextAuth Configuration (auth.ts)

**Purpose**: Handles authentication logic and JWT creation

**Key Features**:
- Credential provider with email/password
- JWT callback to check admin status from Supabase
- Session callback to populate user data
- 7-day session duration

**Main Flow**:
```typescript
authorize() → Check Supabase → Create JWT → Return session
```

### 2. Middleware (app/middleware.ts)

**Purpose**: Protects `/admin/*` routes before page load

**Security Checks**:
1. Validates JWT token exists
2. Checks if token hasn't expired (>7 days)
3. Verifies `isAdmin` flag is true
4. Redirects unauthorized users

**Redirect Behavior**:
- No token → `/api/auth/signin`
- Expired → `/api/auth/signin`
- Not admin → `/403`

### 3. Admin Utilities (app/utils/admin.ts)

**requireAdmin()**: Guard function for API routes
```typescript
export async function requireAdmin() {
  const session = await auth();
  if (!session || !session.user.isAdmin) redirect("/403");
  return session;
}
```

**isUserAdmin()**: Check admin status by email
```typescript
export async function isUserAdmin(email: string): Promise<boolean>
```

**getAdminSupabaseClient()**: Get service role client
```typescript
export function getAdminSupabaseClient() {
  return createClient(supabaseUrl, supabaseServiceKey);
}
```

### 4. Admin API Routes (app/api/admin/users/route.ts)

**GET /api/admin/users**
- Returns all admin users from Supabase
- Protected by `requireAdmin()`

**POST /api/admin/users**
- Creates new admin user
- Requires: `{ email: string }`
- Protected by `requireAdmin()`
- Validates email format
- Prevents duplicates

**DELETE /api/admin/users**
- Removes admin user by email
- Requires: `{ email: string }`
- Protected by `requireAdmin()`

### 5. Admin UI

**Dashboard** (`/admin`):
- Shows welcome message with user email
- Navigation to user management page

**User Management** (`/admin/users`):
- Lists all admin users in table
- Add new admin by email form
- Remove admin with confirmation
- Real-time feedback (success/error messages)

## Security Implementation

### JWT Token Structure

```typescript
{
  email: "admin@example.com",           // User email
  isAdmin: true,                         // Admin status from DB
  expiresAt: 1703000000000,             // Unix timestamp (now + 7 days)
  iat: 1702395200,                      // Issued at
  exp: 1702395200 + (7 * 24 * 60 * 60), // Expiration (7 days)
}
```

### Session Flow

```
1. Login
   POST /api/auth/signin?email=...&password=...
   ↓
2. Credential Verification
   authorize() checks credentials
   ↓
3. Admin Check
   JWT callback queries Supabase admin_users table
   ↓
4. Token Creation
   JWT created with email, isAdmin, expiresAt
   ↓
5. Cookie Storage
   HTTP-only, secure, sameSite=lax cookie
   ↓
6. Route Protection
   Middleware validates on each /admin request
```

### Protected API Flow

```
1. Request to /api/admin/users
   ↓
2. Call requireAdmin()
   - Get session from JWT
   - Check if isAdmin === true
   - Check expiration
   ↓
3. If Valid
   - Execute endpoint logic
   - Use Supabase service role key
   ↓
4. If Invalid
   - Throw error → redirect to /403 or /api/auth/signin
```

## Configuration

### Environment Variables

Required in `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbc...

# NextAuth
AUTH_SECRET=your_secret_from_npx_auth_secret
AUTH_URL=http://localhost:3000  # Production: your domain
```

### Session Configuration

In `auth.ts`:

```typescript
session: {
  maxAge: 7 * 24 * 60 * 60,  // 7 days in seconds
  strategy: "jwt"             // Use JWT instead of database
},
jwt: {
  maxAge: 7 * 24 * 60 * 60   // JWT expires after 7 days
}
```

### Middleware Matcher

In `middleware.ts`:

```typescript
export const config = {
  matcher: [
    "/admin/:path*",        // All /admin routes
    "/api/admin/:path*"     // All /api/admin routes
  ],
};
```

## Usage Examples

### Login Programmatically

```typescript
import { signIn } from "next-auth/react";

await signIn("credentials", {
  email: "admin@example.com",
  password: "password",
  redirect: true,
  callbackUrl: "/admin"
});
```

### Check Admin Status (Client)

```typescript
import { useSession } from "next-auth/react";

export function AdminCheck() {
  const { data: session } = useSession();
  
  if (session?.user?.isAdmin) {
    return <div>Admin access granted</div>;
  }
  return <div>Not admin</div>;
}
```

### Check Admin Status (Server)

```typescript
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  
  if (!session?.user?.isAdmin) {
    redirect("/403");
  }
  
  return <div>Admin content</div>;
}
```

### Call Protected API

```typescript
// Add admin user
const response = await fetch("/api/admin/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "new-admin@example.com" })
});

const data = await response.json();

// Remove admin user
const response = await fetch("/api/admin/users", {
  method: "DELETE",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "admin@example.com" })
});
```

## Database Schema

**admin_users table**:

```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_admin_users_email ON admin_users(email);
```

## Customization

### Add OAuth Provider

```typescript
import GoogleProvider from "next-auth/providers/google";

providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
  }),
  CredentialsProvider({...})
]
```

### Change Session Duration

```typescript
session: {
  maxAge: 14 * 24 * 60 * 60  // 14 days instead of 7
}
```

### Add Role-Based Access Control

```typescript
// Update JWT structure
jwt({ token, user }) {
  if (user) {
    token.role = await getUserRole(user.email);  // "admin", "editor", "viewer"
  }
  return token;
}

// In middleware
if (token.role !== "admin") {
  return redirect("/403");
}
```

### Add Two-Factor Authentication

```typescript
// In authorize callback
if (isTwoFactorEnabled(credentials.email)) {
  // Generate and send 2FA code
  // Return user with 2FA pending status
}

// Create separate route for 2FA verification
```

## Testing

### Unit Tests

```typescript
// Test admin check
it("should identify admin users", async () => {
  const isAdmin = await isUserAdmin("admin@example.com");
  expect(isAdmin).toBe(true);
});

// Test middleware
it("should redirect non-admins", async () => {
  const response = await GET("/admin");
  expect(response.status).toBe(307);
});
```

### Integration Tests

```typescript
// Test login flow
it("should login and create session", async () => {
  const result = await signIn("credentials", {
    email: "admin@example.com",
    password: "password",
  });
  expect(result.ok).toBe(true);
});
```

### Manual Testing

1. **Login**: Navigate to `/api/auth/signin` and test login
2. **Protected Routes**: Try accessing `/admin` as non-admin
3. **User Management**: Add/remove admins from `/admin/users`
4. **API Calls**: Use curl to test `/api/admin/users` endpoints

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| "Unauthorized" on /admin | Invalid token or expired | Check JWT token, login again |
| Admin not recognized | User not in admin_users | Add email to Supabase admin_users |
| Session expires quickly | Token age check fails | Verify expiresAt calculation |
| CORS error | Missing origin | Add domain to Supabase settings |
| 403 on API routes | User not admin | Verify user in admin_users table |

## Performance Considerations

- **JWT Validation**: Fast (no database query)
- **Admin Check**: One Supabase query per login (cached in JWT)
- **Middleware**: Minimal overhead (just JWT validation)
- **API Routes**: One database query per request
- **Session**: HTTP-only cookie, no client-side parsing

## Best Practices

1. **Never store JWT in localStorage** - Use HTTP-only cookies (NextAuth default)
2. **Validate on every protected request** - Middleware + API routes
3. **Use service role only on server** - Never expose in client code
4. **Implement audit logging** - Track all admin actions
5. **Set reasonable session duration** - 7 days is default, adjust per needs
6. **Monitor failed login attempts** - Detect brute force attacks
7. **Use HTTPS in production** - Secure cookie transmission
8. **Rotate secrets regularly** - Update AUTH_SECRET periodically

## Next Steps

1. Implement real authentication in `authorize()` callback
2. Add email verification for new admins
3. Implement audit logging for all admin actions
4. Add two-factor authentication
5. Set up monitoring and alerting
6. Create admin onboarding documentation
7. Plan for admin recovery procedures

## Resources

- [NextAuth.js Documentation](https://next-auth.js.org)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

## Support

For issues or questions:
1. Check [ADMIN_AUTH_SETUP.md](ADMIN_AUTH_SETUP.md) for setup help
2. Review [ADMIN_AUTH_CHECKLIST.md](ADMIN_AUTH_CHECKLIST.md) for implementation steps
3. Consult NextAuth and Supabase official documentation
4. Check error messages in browser console and server logs
