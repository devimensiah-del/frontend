# Authentication System Documentation

## Overview

The Imensiah frontend implements a complete authentication system using **Supabase Auth**. This system provides secure user authentication with email/password, password reset, and role-based access control.

## Architecture

### Components

1. **Supabase Client** (`lib/utils/supabase-client.ts`)
   - Browser-side Supabase client
   - Session management utilities
   - Authentication helper functions

2. **AuthProvider** (`lib/providers/AuthProvider.tsx`)
   - React Context for global auth state
   - Auth state synchronization with Supabase
   - User profile management

3. **Middleware** (`middleware.ts`)
   - Route protection
   - Session validation
   - Role-based access control

4. **Auth Pages**
   - `/login` - User login
   - `/auth/signup` - User registration
   - `/auth/forgot-password` - Password reset request
   - `/auth/reset-password` - Password reset form
   - `/auth/verify-email` - Email verification message

## Authentication Flow

### 1. User Registration (Signup)

```typescript
// User fills out signup form
await signUp(email, password, name);

// Supabase sends verification email
// User confirms email
// User can now sign in
```

**Features:**
- Email validation
- Password strength requirements (min 6 characters)
- Password confirmation
- User metadata (name) stored in Supabase
- Email verification required before login

### 2. User Login

```typescript
// User enters credentials
await signIn(email, password);

// AuthProvider updates state
// User redirected to dashboard/admin
```

**Features:**
- Email/password authentication
- Error handling with user-friendly messages
- Loading states
- Automatic redirection after login

### 3. Password Reset

```typescript
// Step 1: Request reset
await sendPasswordReset(email);

// Step 2: User clicks link in email
// Step 3: User enters new password
await updatePassword(newPassword);
```

**Features:**
- Secure email-based reset
- Token validation
- Password confirmation
- Link expiration (1 hour)

### 4. Session Management

```typescript
// AuthProvider automatically:
- Checks for existing session on mount
- Listens to auth state changes
- Refreshes tokens automatically
- Syncs across tabs
```

## Using the Auth System

### In Components

```typescript
import { useAuthContext } from '@/lib/providers/AuthProvider';

function MyComponent() {
  const { user, isAuthenticated, isLoading, signOut } = useAuthContext();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please login</div>;

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <button onClick={signOut}>Logout</button>
    </div>
  );
}
```

### Protecting Routes

Routes are automatically protected by middleware:

- **Public routes**: `/`, `/login`, `/auth/*`
- **Protected routes**: `/admin/*`, `/dashboard/*`
- **Admin only**: `/admin/*` (requires `role: 'admin'`)

### Manual Route Protection

```typescript
// In a page component
'use client';

import { useAuthContext } from '@/lib/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { isAuthenticated, user, isLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return <div>Protected content</div>;
}
```

## API Integration

### Making Authenticated API Calls

```typescript
import { supabase } from '@/lib/utils/supabase-client';

// Get current session
const session = await supabase.auth.getSession();
const token = session.data.session?.access_token;

// Make API call with auth header
const response = await fetch(`${API_URL}/submissions`, {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

## Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Database Schema

The auth system expects a `users` table in Supabase:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create trigger to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Security Considerations

1. **Password Requirements**
   - Minimum 6 characters (configured in Supabase)
   - Can be enhanced with more complex rules

2. **Session Management**
   - Sessions stored in HTTP-only cookies
   - Automatic token refresh
   - Secure session storage

3. **CSRF Protection**
   - Supabase handles CSRF tokens automatically
   - State parameter in OAuth flows

4. **Rate Limiting**
   - Configure in Supabase dashboard
   - Protects against brute force attacks

5. **Email Verification**
   - Required before full access
   - Prevents spam accounts

## Error Handling

Common errors and solutions:

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid login credentials" | Wrong email/password | Check credentials, reset password |
| "Email not confirmed" | User hasn't verified email | Resend verification email |
| "User already registered" | Email already exists | Use forgot password or different email |
| "Invalid token" | Reset link expired | Request new reset link |

## Testing

### Test User Creation

1. Create a test admin user in Supabase dashboard:
   - Go to Authentication > Users
   - Click "Add user"
   - Set email, password
   - In SQL Editor, run:
     ```sql
     UPDATE users SET role = 'admin' WHERE email = 'admin@test.com';
     ```

2. Test the auth flow:
   - Signup → Check email verification
   - Login → Check redirect
   - Forgot password → Check email
   - Reset password → Check success

## Troubleshooting

### Cookies Not Being Set

- Check CORS settings in Supabase
- Ensure `NEXT_PUBLIC_APP_URL` matches your domain
- Check browser privacy settings

### Middleware Not Working

- Verify environment variables are loaded
- Check middleware matcher config
- Look for console errors in browser/server

### Email Not Sending

- Configure email templates in Supabase dashboard
- Check SMTP settings (if custom provider)
- Verify domain whitelist

## Future Enhancements

Planned improvements:

1. **OAuth Providers**
   - Google Sign-In
   - GitHub Sign-In

2. **Two-Factor Authentication**
   - TOTP support
   - SMS verification

3. **Session Management Dashboard**
   - View active sessions
   - Revoke sessions

4. **Password Policies**
   - Complexity requirements
   - Password history
   - Expiration

## Support

For issues or questions:
- Check [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- Review error logs in browser console
- Check Supabase dashboard for auth logs
