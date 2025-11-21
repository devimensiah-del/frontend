# Vercel Deployment Guide - IMENSIAH Frontend

## ✅ Build Status

**Current Status:** ✅ **READY FOR DEPLOYMENT**

All critical issues have been resolved:
- ✅ TypeScript compilation errors fixed
- ✅ ESLint errors fixed
- ✅ Production build successful
- ✅ All type checks passing

---

## 🚀 Deployment Steps

### 1. Push to GitHub

Ensure all changes are committed and pushed to your GitHub repository.

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "Add New Project"
4. Import your `imensiah_new/frontend` repository
5. Vercel will auto-detect Next.js configuration

### 3. Configure Environment Variables

**CRITICAL:** You must configure these environment variables in Vercel before deployment.

Go to: **Project Settings → Environment Variables**

---

## 🔐 Required Environment Variables

### Backend API Configuration (Required)

```bash
NEXT_PUBLIC_API_URL
```
**Value:** Your backend API URL (e.g., `https://api.imensiah.com/api/v1`)
**Description:** Base URL for all API calls to your Go backend
**Required for:** All API communication

---

### Supabase Authentication (Required)

```bash
NEXT_PUBLIC_SUPABASE_URL
```
**Value:** Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)
**Description:** Supabase project URL for authentication
**Required for:** User authentication, protected routes

```bash
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
**Value:** Your Supabase anonymous/public key
**Description:** Public API key for client-side Supabase operations
**Required for:** User authentication, session management

```bash
SUPABASE_SERVICE_ROLE_KEY
```
**Value:** Your Supabase service role key
**Description:** Server-side secret key with elevated permissions
**Required for:** Admin operations, server-side auth
**⚠️ KEEP SECRET:** This should NEVER be exposed to the client

---

### Application Configuration (Required)

```bash
NEXT_PUBLIC_APP_URL
```
**Value:** Your Vercel deployment URL (e.g., `https://imensiah.vercel.app`)
**Description:** Your application's public URL
**Required for:** Email redirects, OAuth callbacks

```bash
NEXT_PUBLIC_APP_NAME
```
**Value:** `IMENSIAH`
**Description:** Application name displayed in UI

```bash
NEXT_PUBLIC_REPORT_PRICE
```
**Value:** `890`
**Description:** Price for reports in Brazilian Reais (BRL)

---

### Optional - Payment Integration

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```
**Value:** `pk_test_xxxxx` or `pk_live_xxxxx`
**Description:** Stripe publishable key for payment processing
**Required only if:** Payment features are enabled

---

### Optional - Analytics & Monitoring

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID
```
**Value:** `G-XXXXXXXXXX`
**Description:** Google Analytics measurement ID
**Usage:** Track user analytics

```bash
NEXT_PUBLIC_SENTRY_DSN
```
**Value:** Your Sentry DSN
**Description:** Error tracking and monitoring
**Usage:** Production error monitoring

---

### Optional - Feature Flags

```bash
NEXT_PUBLIC_ENABLE_PAYMENTS
```
**Value:** `true` or `false`
**Default:** `true`
**Description:** Enable/disable payment features

```bash
NEXT_PUBLIC_ENABLE_ANALYTICS
```
**Value:** `true` or `false`
**Default:** `true`
**Description:** Enable/disable analytics tracking

```bash
NEXT_PUBLIC_ENABLE_CHAT
```
**Value:** `true` or `false`
**Default:** `false`
**Description:** Enable/disable chat features

```bash
NEXT_PUBLIC_MAINTENANCE_MODE
```
**Value:** `true` or `false`
**Default:** `false`
**Description:** Enable maintenance mode

---

## 📋 Environment Variables Checklist

Use this checklist when configuring Vercel:

### Critical (Must Set)
- [ ] `NEXT_PUBLIC_API_URL` - Backend API endpoint
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase public key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Supabase secret key (server-only)
- [ ] `NEXT_PUBLIC_APP_URL` - Your Vercel deployment URL
- [ ] `NEXT_PUBLIC_APP_NAME` - Application name (IMENSIAH)
- [ ] `NEXT_PUBLIC_REPORT_PRICE` - Report price (890)

### Optional (Recommended)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - For payments
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` - For analytics
- [ ] `NEXT_PUBLIC_SENTRY_DSN` - For error tracking

### Optional (Feature Flags)
- [ ] `NEXT_PUBLIC_ENABLE_PAYMENTS` - Default: true
- [ ] `NEXT_PUBLIC_ENABLE_ANALYTICS` - Default: true
- [ ] `NEXT_PUBLIC_ENABLE_CHAT` - Default: false
- [ ] `NEXT_PUBLIC_MAINTENANCE_MODE` - Default: false

---

## 🔧 Build Configuration

Vercel will automatically detect these settings, but you can verify:

- **Framework:** Next.js
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `npm install` (auto-detected)
- **Node Version:** 18.x or 20.x (Vercel default)

---

## 🎯 Post-Deployment Verification

After deployment, verify these items:

### 1. Check Build Logs
- Ensure build completed successfully
- No warnings about missing environment variables
- All routes generated correctly

### 2. Test Critical Paths
- [ ] Homepage loads correctly
- [ ] Login/signup functionality works
- [ ] Protected routes redirect to login
- [ ] API calls connect to backend
- [ ] Supabase authentication works

### 3. Monitor Console Errors
- Open browser DevTools console
- Check for any API connection errors
- Verify no missing environment variable warnings

### 4. Test Authentication Flow
- [ ] Sign up new user
- [ ] Verify email works
- [ ] Login works
- [ ] Protected routes are accessible
- [ ] Logout works

---

## 🚨 Common Issues & Solutions

### Issue: "Failed to load API"
**Solution:** Check that `NEXT_PUBLIC_API_URL` is correctly set and backend is running

### Issue: "Supabase client error"
**Solution:** Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct

### Issue: "Redirect URL mismatch"
**Solution:** Add your Vercel URL to Supabase → Authentication → URL Configuration → Redirect URLs

### Issue: Build fails with TypeScript errors
**Solution:** This shouldn't happen - all TypeScript errors are fixed. If it does, check that you pushed all changes.

---

## 📊 Build Output Summary

Your successful build generated:

- **Total Routes:** 21 pages
- **Static Pages:** 17 (pre-rendered)
- **Dynamic Pages:** 4 (server-rendered on demand)
- **Middleware:** Authentication & route protection
- **Bundle Size:** Optimized for production

### Route Details
- Landing page (/)
- Authentication pages (/login, /signup, /auth/*)
- User dashboard (/painel, /perfil, /envios)
- Admin pages (/admin/*)
- Legal pages (/termos, /privacidade)

---

## 🎉 Ready to Deploy!

Your frontend is production-ready. Once you:
1. Set all required environment variables in Vercel
2. Push your code to GitHub
3. Deploy via Vercel

The application will be live and fully functional!

---

## 📞 Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs

---

**Last Updated:** 2025-11-21
**Build Status:** ✅ Passing
**TypeScript:** ✅ No errors
**Production Build:** ✅ Successful
