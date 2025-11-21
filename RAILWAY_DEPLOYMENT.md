# Railway Deployment Guide - Frontend

## Prerequisites
- Railway account: https://railway.app
- Backend deployed and URL obtained
- Supabase project credentials
- GitHub repository connected

## Environment Variables Required

Add these in Railway Frontend Service > Variables:

```bash
# API Configuration (use backend Railway URL)
NEXT_PUBLIC_API_URL=https://your-backend-production.up.railway.app/api/v1

# Supabase (from Supabase Settings > API)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxx...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxx...

# App Configuration (will update after deployment)
NEXT_PUBLIC_APP_URL=https://your-frontend-production.up.railway.app
NEXT_PUBLIC_APP_NAME=IMENSIAH
NEXT_PUBLIC_REPORT_PRICE=890

# Feature Flags
NEXT_PUBLIC_ENABLE_PAYMENTS=false
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_CHAT=false
NEXT_PUBLIC_MAINTENANCE_MODE=false
NEXT_PUBLIC_TEST_MODE=false
NEXT_PUBLIC_DEBUG=false
NEXT_PUBLIC_SHOW_DEV_TOOLS=false
```

## Deployment Steps

### 1. Use Same Railway Project as Backend
```bash
# Go to your existing IMENSIAH project in Railway
# This keeps backend and frontend together
```

### 2. Deploy Frontend Service
```bash
# In Railway project:
# Click "+ New"
# Select "GitHub Repo"
# Select: devimensiah-del/frontend
# Railway will auto-detect Dockerfile
```

### 3. Configure Environment Variables
```bash
# Click on Frontend service
# Go to "Variables" tab
# Click "+ New Variable" for each variable above
# Use backend Railway URL for NEXT_PUBLIC_API_URL
```

### 4. Deploy
```bash
# Click "Deploy"
# Build takes 5-10 minutes (Next.js build)
# Wait for "Deployed" status
```

### 5. Get Frontend URL
```bash
# Go to "Settings" tab
# Under "Domains" > "Generate Domain"
# Copy URL: https://frontend-production-xxxx.up.railway.app
```

### 6. Update Environment Variables
```bash
# Update NEXT_PUBLIC_APP_URL with frontend URL
# Click "Redeploy" to apply changes
```

### 7. Update Backend CORS
```bash
# Go to Backend service
# Update ALLOWED_ORIGINS variable:
ALLOWED_ORIGINS=https://your-frontend.up.railway.app,https://yourdomain.com
# Click "Redeploy" backend
```

### 8. Test Deployment
```bash
# Visit your frontend URL
# Open browser DevTools (F12)
# Check for errors in Console
# Test login/signup flow
# Verify API calls to backend work
```

## Routes Available

### Public Routes
- `/` - Landing page
- `/login` - Login page
- `/auth/signup` - Signup page
- `/auth/forgot-password` - Password reset
- `/termos` - Terms of service
- `/privacidade` - Privacy policy
- `/report/[id]` - Public report viewer

### Protected User Routes (Require Login)
- `/painel` - User dashboard
- `/perfil` - User profile
- `/envios` - Submissions list
- `/envios/[id]` - Submission detail
- `/nova-analise` - New submission
- `/configuracoes` - Account settings

### Admin Routes (Require Admin Role)
- `/admin/dashboard` - Admin submissions list
- `/admin/enriquecimento` - Enrichment queue
- `/admin/enriquecimento/[id]` - Enrichment editor
- `/admin/submissions/[id]` - War Room (analysis editor)

## Troubleshooting

### Issue: Build fails with module errors
```
Error: Cannot find module '@/lib/...'
```
**Solution**: Ensure all dependencies in package.json, run `npm install` locally and commit package-lock.json

### Issue: API calls return 404
```
GET https://.../api/v1/submit 404
```
**Solution**: Verify NEXT_PUBLIC_API_URL matches backend URL exactly including /api/v1 path

### Issue: "Environment variable undefined" in browser
```
Uncaught ReferenceError: process is not defined
```
**Solution**: Ensure all client-side env vars start with NEXT_PUBLIC_

### Issue: Build succeeds but app crashes
```
Error: Cannot find module '.next/standalone/server.js'
```
**Solution**: Verify next.config.ts has `output: 'standalone'` (already added)

### Issue: Images don't load
```
Image optimization error
```
**Solution**: Check remotePatterns in next.config.ts, ensure Supabase domain allowed

### Issue: CORS errors in browser
```
Access-Control-Allow-Origin error
```
**Solution**: Update backend ALLOWED_ORIGINS to include frontend Railway URL

### Issue: Authentication fails
```
Supabase auth error
```
**Solution**: Verify all Supabase env vars are correct, check anon key vs service role key

## Performance Optimization

### Enable Caching
Railway automatically caches:
- Next.js build cache
- node_modules
- Static assets

### Image Optimization
Next.js automatically optimizes images. Ensure:
- Use next/image component
- Remote patterns configured
- Supabase storage allowed

### Bundle Size
Monitor build output:
```bash
# In build logs, check:
Route (app)                              Size     First Load JS
┌ ○ /                                    XXX kB         XXX kB
```

## Monitoring

### View Build Logs
```bash
# In Railway Dashboard
# Click on Frontend service
# Go to "Deployments" tab
# Click latest deployment
# View build and runtime logs
```

### Check Performance
```bash
# Use Lighthouse in Chrome DevTools
# Run performance audit
# Target: 90+ score
```

### Monitor Errors
```bash
# Check browser console regularly
# Set up Sentry for production error tracking (optional)
```

## Scaling

### Current Configuration
- 1 vCPU, 1GB RAM (~$5/month)
- Auto-scales with traffic
- Global CDN for static assets

### Increase Resources
```bash
# Go to "Settings" tab
# Scroll to "Resources"
# Adjust as needed for traffic
```

## Custom Domain (Optional)

### Add Custom Domain
```bash
# In Railway Frontend service
# Go to "Settings" > "Domains"
# Click "Add Domain"
# Enter: imensiah.com or www.imensiah.com
# Follow DNS configuration instructions
```

### Update Environment
```bash
# Update NEXT_PUBLIC_APP_URL to use custom domain
# Update backend ALLOWED_ORIGINS to include custom domain
# Redeploy both services
```

## Security Checklist

- [ ] All env vars use NEXT_PUBLIC_ prefix for client-side
- [ ] Service role key is server-side only (no NEXT_PUBLIC_)
- [ ] TEST_MODE is false
- [ ] DEBUG is false
- [ ] CORS configured correctly on backend
- [ ] HTTPS enforced (automatic on Railway)
- [ ] No secrets in code or git

## Cost Optimization

- Frontend: ~$5/month (1 vCPU, 1GB RAM)
- Use Railway's free tier first ($5 credit)
- Enable caching to reduce build times
- Optimize images to reduce bandwidth

## Support

- Railway Docs: https://docs.railway.app
- Next.js Docs: https://nextjs.org/docs
- Frontend GitHub: https://github.com/devimensiah-del/frontend

## Post-Deployment Checklist

- [ ] Landing page loads without errors
- [ ] Login/signup works
- [ ] User dashboard accessible
- [ ] Admin dashboard requires admin role
- [ ] API calls to backend succeed
- [ ] Images load correctly
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Performance score 90+
- [ ] Backend CORS includes frontend URL
