# Quick Start - Supabase Authentication

## 5-Minute Setup Guide

### Step 1: Run Database Setup (2 minutes)

1. Open Supabase Dashboard → SQL Editor
2. Copy entire contents of `docs/SUPABASE_SETUP.sql`
3. Paste and click "Run"
4. Verify success message

### Step 2: Configure Supabase Auth (1 minute)

1. Go to **Authentication → Settings**
2. **Email Auth Settings:**
   - Disable "Confirm email" for testing (enable in production!)
   - Set minimum password length to 6
3. **Site URL:** Add your app URL
   - Development: `http://localhost:3000`
   - Production: Your domain

### Step 3: Test the System (2 minutes)

```bash
# Start the dev server
npm run dev

# Navigate to http://localhost:3000/auth/signup
```

**Test Flow:**
1. Create account at `/auth/signup`
2. (If email confirmation enabled) Check email and confirm
3. Login at `/login`
4. You should be redirected to `/admin/dashboard`

### Step 4: Create Admin User

**Option A: Via SQL**
```sql
-- After signing up, run this in Supabase SQL Editor
UPDATE public.users
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

**Option B: Via Dashboard**
1. Supabase → Authentication → Users
2. Find your user
3. Click to edit
4. Change role in SQL Editor (see Option A)

## Common Commands

### Check Auth Status in Component
```typescript
import { useAuthContext } from '@/lib/providers/AuthProvider';

function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please login</div>;

  return <div>Welcome, {user.name}!</div>;
}
```

### Sign Out
```typescript
const { signOut } = useAuthContext();
await signOut();
```

### Check if Admin
```typescript
const { user } = useAuthContext();
const isAdmin = user?.role === 'admin';
```

## File Structure

```
lib/
  ├── utils/
  │   ├── supabase-client.ts      # Supabase client & helpers
  │   └── supabase-middleware.ts  # Server-side utilities
  └── providers/
      └── AuthProvider.tsx        # Auth context & state

app/
  ├── login/page.tsx              # Login page
  └── auth/
      ├── signup/page.tsx         # Registration
      ├── forgot-password/page.tsx# Request reset
      ├── reset-password/page.tsx # Reset form
      └── verify-email/page.tsx   # Verification message

middleware.ts                      # Route protection
```

## Protected Routes

- **Public:** `/`, `/login`, `/auth/*`
- **Requires Auth:** `/dashboard/*`, `/admin/*`
- **Admin Only:** `/admin/*`

Routes are automatically protected by middleware.

## Troubleshooting

### "Invalid login credentials"
- Check email is verified (if enabled)
- Verify password is correct
- Check user exists in Supabase Auth

### "Not redirecting after login"
- Check browser console for errors
- Verify AuthProvider is wrapping your app
- Check middleware is running

### "Middleware not working"
- Verify `.env.local` has Supabase keys
- Restart dev server after adding env vars
- Check middleware.ts is in project root

### "Email not sending"
- For development: Disable email confirmation
- For production: Configure SMTP in Supabase

## Environment Variables

```env
# Required in .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Next Steps

1. ✅ Run database setup
2. ✅ Configure Supabase Auth
3. ✅ Test signup/login flow
4. ✅ Create admin user
5. [ ] Customize email templates (production)
6. [ ] Add profile management UI (optional)
7. [ ] Enable MFA (optional)
8. [ ] Set up OAuth providers (optional)

## Resources

- [Full Documentation](./AUTHENTICATION.md)
- [Implementation Summary](./AUTH_IMPLEMENTATION_SUMMARY.md)
- [Database Setup](./SUPABASE_SETUP.sql)
- [Supabase Docs](https://supabase.com/docs/guides/auth)

---

**Need Help?** Check the full documentation in `AUTHENTICATION.md` for detailed guides, examples, and troubleshooting.
