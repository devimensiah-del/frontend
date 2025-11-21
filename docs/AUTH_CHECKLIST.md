# Supabase Authentication - Setup Checklist

## Phase 1: Database Setup

- [ ] Open Supabase Dashboard
- [ ] Navigate to SQL Editor
- [ ] Copy contents from `docs/SUPABASE_SETUP.sql`
- [ ] Run SQL script
- [ ] Verify `users` table created
- [ ] Check that triggers are active
- [ ] Verify RLS policies are enabled

## Phase 2: Supabase Configuration

### Authentication Settings
- [ ] Go to Authentication → Settings
- [ ] **For Development:**
  - [ ] Disable "Confirm email" (enable for production)
- [ ] **For Production:**
  - [ ] Enable "Confirm email"
  - [ ] Configure SMTP provider
- [ ] Set minimum password length (recommended: 6+)
- [ ] Add Site URL:
  - [ ] Development: `http://localhost:3000`
  - [ ] Production: Your production domain

### Email Templates (Production Only)
- [ ] Customize confirmation email
- [ ] Customize password reset email
- [ ] Test email delivery

### URL Configuration
- [ ] Add redirect URLs to allowed list
- [ ] Add your domain to allowed origins

## Phase 3: Environment Variables

- [ ] Verify `.env.local` exists in project root
- [ ] Confirm these variables are set:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
  NEXT_PUBLIC_APP_URL=http://localhost:3000
  ```
- [ ] Restart dev server after changes

## Phase 4: Testing - User Registration

- [ ] Start dev server: `npm run dev`
- [ ] Navigate to `http://localhost:3000/auth/signup`
- [ ] Fill out registration form:
  - [ ] Name field works
  - [ ] Email validation works
  - [ ] Password minimum 6 characters
  - [ ] Password confirmation matches
- [ ] Submit form
- [ ] Verify redirect to `/auth/verify-email`
- [ ] **If email confirmation enabled:**
  - [ ] Check email inbox
  - [ ] Click verification link
  - [ ] Verify redirect back to app
- [ ] Check Supabase Dashboard:
  - [ ] User appears in Authentication → Users
  - [ ] User profile in `users` table
  - [ ] Role is set to 'user'

## Phase 5: Testing - User Login

- [ ] Navigate to `/login`
- [ ] Test with invalid credentials:
  - [ ] Error message displays
  - [ ] Form doesn't submit
- [ ] Test with valid credentials:
  - [ ] Loading state shows
  - [ ] Success message appears
  - [ ] Redirects to dashboard
- [ ] Refresh page:
  - [ ] User stays logged in
  - [ ] No redirect to login
- [ ] Open in new tab:
  - [ ] User is already logged in

## Phase 6: Testing - Password Reset

- [ ] Navigate to `/auth/forgot-password`
- [ ] Enter registered email
- [ ] Submit form
- [ ] Verify success message
- [ ] Check email inbox
- [ ] Click reset link in email
- [ ] Verify redirect to `/auth/reset-password`
- [ ] Enter new password
- [ ] Confirm new password matches
- [ ] Submit form
- [ ] Verify redirect to `/login`
- [ ] Login with new password
- [ ] Verify successful login

## Phase 7: Testing - Route Protection

### Unauthenticated Access
- [ ] Logout if logged in
- [ ] Try to access `/admin/dashboard`
  - [ ] Redirects to `/login`
  - [ ] URL includes `?redirect=/admin/dashboard`
- [ ] Try to access `/dashboard`
  - [ ] Redirects to `/login`

### Authenticated User Access
- [ ] Login as regular user
- [ ] Access `/dashboard` routes
  - [ ] Successfully loads
- [ ] Try to access `/admin/dashboard`
  - [ ] Redirects to `/dashboard` (not admin)

### Admin Access
- [ ] Create admin user (see Phase 8)
- [ ] Login as admin
- [ ] Access `/admin/dashboard`
  - [ ] Successfully loads
  - [ ] No redirect

## Phase 8: Create Admin User

Choose one method:

### Method A: Promote Existing User
- [ ] Sign up normally through app
- [ ] Open Supabase SQL Editor
- [ ] Run:
  ```sql
  UPDATE public.users
  SET role = 'admin'
  WHERE email = 'your-email@example.com';
  ```
- [ ] Verify update in `users` table
- [ ] Logout and login again
- [ ] Test admin access

### Method B: Create in Dashboard
- [ ] Go to Authentication → Users
- [ ] Click "Add user"
- [ ] Enter email and password
- [ ] User is created
- [ ] Run SQL from Method A to set role
- [ ] Test login and admin access

## Phase 9: Session Management

- [ ] Login in browser tab 1
- [ ] Open new tab 2
- [ ] Navigate to protected route in tab 2
  - [ ] Automatically logged in
- [ ] Logout in tab 1
- [ ] Check tab 2
  - [ ] Automatically logged out or redirect on next action
- [ ] Close all tabs
- [ ] Reopen browser
- [ ] Navigate to protected route
  - [ ] Session persists (still logged in)

## Phase 10: Error Handling

### Test Error Scenarios
- [ ] Signup with existing email
  - [ ] Proper error message
- [ ] Login with wrong password
  - [ ] Proper error message
- [ ] Login with unverified email (if confirmation enabled)
  - [ ] Proper error message
- [ ] Reset password with invalid email
  - [ ] Generic success message (security)
- [ ] Use expired reset link
  - [ ] Proper error message
- [ ] Access token tampering
  - [ ] Redirects to login

## Phase 11: Production Preparation

### Security
- [ ] Enable email confirmation
- [ ] Configure production SMTP
- [ ] Set strong password requirements
- [ ] Enable rate limiting in Supabase
- [ ] Review RLS policies
- [ ] Test all policies work correctly

### Configuration
- [ ] Update `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Add production domain to Supabase allowed URLs
- [ ] Configure CORS if needed
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure logging

### Email
- [ ] Customize email templates
- [ ] Set proper sender email
- [ ] Test email deliverability
- [ ] Check spam scores
- [ ] Set up SPF/DKIM records

### Testing
- [ ] Test complete flow in production environment
- [ ] Test from different devices
- [ ] Test email delivery
- [ ] Test all error scenarios
- [ ] Load test authentication endpoints

### Documentation
- [ ] Document admin user creation process
- [ ] Document troubleshooting steps
- [ ] Document recovery procedures
- [ ] Share credentials with team (securely)

## Phase 12: Monitoring & Maintenance

### Set Up Monitoring
- [ ] Track successful logins
- [ ] Track failed login attempts
- [ ] Monitor password reset requests
- [ ] Set up alerts for suspicious activity
- [ ] Track session duration

### Regular Maintenance
- [ ] Review user accounts monthly
- [ ] Clean up test accounts
- [ ] Review and update RLS policies
- [ ] Update dependencies
- [ ] Monitor Supabase quotas

## Completion

- [ ] All phases completed
- [ ] All tests passing
- [ ] Documentation reviewed
- [ ] Team trained on system
- [ ] Ready for production

---

## Quick Reference

### Important Files
- `docs/QUICK_START_AUTH.md` - Fast setup guide
- `docs/AUTHENTICATION.md` - Complete documentation
- `docs/SUPABASE_SETUP.sql` - Database setup script
- `middleware.ts` - Route protection
- `lib/providers/AuthProvider.tsx` - Auth state

### Common SQL Commands

**Check user role:**
```sql
SELECT email, role FROM public.users WHERE email = 'user@example.com';
```

**Make user admin:**
```sql
UPDATE public.users SET role = 'admin' WHERE email = 'user@example.com';
```

**List all admins:**
```sql
SELECT id, email, name, created_at FROM public.users WHERE role = 'admin';
```

**Delete test user:**
```sql
DELETE FROM public.users WHERE email = 'test@example.com';
```

---

**Need Help?** Refer to `docs/AUTHENTICATION.md` for detailed troubleshooting and support information.
