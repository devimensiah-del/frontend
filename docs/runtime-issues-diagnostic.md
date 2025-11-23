# Runtime Issues Diagnostic Report
**Date:** 2025-11-23
**Environment:** Production (Vercel + Railway)

---

## 🔍 Issue Summary

After deploying the workflow fixes, the application is experiencing three critical runtime issues:

1. **404 Errors** - Enrichment and analysis endpoints not found
2. **Authentication Failures** - Missing authorization headers
3. **Ghost Data** - Analysis showing in dashboard despite empty Supabase table

---

## 1. 404 Errors - Missing Backend Endpoints

### Console Errors:
```
GET https://backendv3-production-3235.up.railway.app/api/v1/submissions/ae9aa5f5-49af-45d1-acb4-490a44cdeb2b/enrichment 404
GET https://backendv3-production-3235.up.railway.app/api/v1/submissions/ae9aa5f5-49af-45d1-acb4-490a44cdeb2b/analysis 404
```

### Root Cause:
The frontend API client is calling endpoints that may not exist on the backend:

**Frontend API calls** (`lib/api/client.ts`):
```typescript
// Line 276
enrichmentApi.getBySubmissionId(submissionId)
→ GET /submissions/${submissionId}/enrichment

// Line 347
analysisApi.getBySubmissionId(submissionId)
→ GET /submissions/${submissionId}/analysis
```

**Pages making these calls:**
- `app/(dashboard)/painel/page.tsx` (lines 49, 58) - User dashboard
- `app/admin/envios/[id]/page.tsx` (line 40) - Admin submission detail
- `app/admin/enriquecimento/page.tsx` - Enrichment list

### Investigation Needed:
1. **Check Go Backend Routes**: Verify if these routes exist:
   - `GET /api/v1/submissions/:id/enrichment`
   - `GET /api/v1/submissions/:id/analysis`

2. **Possible Backend Implementation**:
   - Routes might be named differently (e.g., `/enrichments/:id` instead)
   - Routes might require enrichment/analysis IDs instead of submission IDs
   - Routes might not be implemented yet

3. **Database Check**: Verify if submission ID `ae9aa5f5-49af-45d1-acb4-490a44cdeb2b` exists in database

---

## 2. Authentication Failures

### Console Error:
```json
{"error":"Unauthorized","message":"Missing authorization header"}
```

### Root Cause Analysis:

**Auth Token Flow** (`lib/api/client.ts`):
```typescript
// Line 26-29: Get token from localStorage
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

// Line 50-64: Add to request headers
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  // ...
}
```

### Possible Causes:
1. **Token Not Stored**: User logged in but token wasn't saved to localStorage
2. **Token Expired**: JWT token expired and needs refresh
3. **SSR Issue**: `window` is undefined during server-side rendering
4. **Token Format**: Backend expects different token format

### How to Debug:
1. Open browser DevTools → Application → Local Storage
2. Check if `auth_token` key exists and has a value
3. If token exists, decode it (JWT.io) to check expiration
4. Verify login flow actually calls `setAuthToken(response.token)` (line 101)

---

## 3. Ghost Analysis Data

### User Report:
> "why do i see analysis data in dashboard when my analysis table in supabase is empty?"

### Dashboard Logic (`app/(dashboard)/painel/page.tsx`):

```typescript
// Lines 56-63
try {
  const analysisData = await analysisApi.getBySubmissionId(latestSubmission.id);
  setAnalysis(analysisData);
} catch (analysisError) {
  console.log('No analysis data available yet');
  // Analysis not available yet - this is normal
}

// Lines 178-199
{hasAnalysis && (
  <AccordionItem value="analysis">
    {/* Shows analysis card */}
  </AccordionItem>
)}
```

### Expected Behavior:
- If API returns 404, catch block runs → `analysis` stays `null`
- `hasAnalysis` (line 117) checks `analysis !== null`
- If `hasAnalysis` is false, analysis section should NOT render

### Possible Explanations:

1. **Browser Cache**:
   - Old data cached in browser
   - Service worker caching API responses
   - **Fix**: Hard refresh (Ctrl+Shift+R) or clear cache

2. **Component State**:
   - `analysis` state not being reset properly
   - Old state persisting from previous submission

3. **API Returns 200 with Empty Data**:
   - Backend returns `{ analysis: {} }` instead of 404
   - Empty object is truthy, so `hasAnalysis` = true

4. **Different Submission**:
   - Dashboard showing analysis for a different submission
   - Supabase table empty for *this* submission but has data for another

### How to Debug:
1. Open DevTools → Console → Check Network tab
2. Look for response to `/submissions/${id}/analysis`
3. If 404: Check browser cache/storage
4. If 200: Check response body - should have actual data or be empty
5. Verify submission ID matches between dashboard and Supabase query

---

## 🔧 Immediate Action Items

### Priority 1: Backend Routes
**Action**: Verify Go backend has these endpoints implemented
- [ ] `GET /api/v1/submissions/:id/enrichment`
- [ ] `GET /api/v1/submissions/:id/analysis`
- [ ] Check route parameters (submission ID vs enrichment/analysis ID)
- [ ] Review backend route definitions in Go code

### Priority 2: Authentication
**Action**: Debug token handling
- [ ] Check browser localStorage for `auth_token`
- [ ] Verify token is saved after login
- [ ] Check token expiration (decode JWT)
- [ ] Test login flow end-to-end
- [ ] Add error logging to `getAuthToken()` function

### Priority 3: Ghost Data
**Action**: Clear cache and verify API responses
- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Clear browser cache and localStorage
- [ ] Check Network tab for actual API responses
- [ ] Verify submission IDs match between frontend and database
- [ ] Check if backend returns 200 with empty data instead of 404

---

## 📊 Backend API Endpoint Verification Needed

Based on the frontend code, the backend **MUST** implement these routes:

### Enrichment Routes:
```
GET    /api/v1/submissions/:submissionId/enrichment
PUT    /api/v1/submissions/:submissionId/enrichment
PUT    /api/v1/submissions/:submissionId/enrichment/finish
PUT    /api/v1/submissions/:submissionId/enrichment/approve
PUT    /api/v1/submissions/:submissionId/enrichment/reject
```

### Analysis Routes:
```
GET    /api/v1/submissions/:submissionId/analysis
POST   /api/v1/submissions/:submissionId/analysis
PUT    /api/v1/submissions/:submissionId/analysis
GET    /api/v1/submissions/:submissionId/analysis/versions
GET    /api/v1/submissions/:submissionId/analysis/versions/:version
PUT    /api/v1/submissions/:submissionId/analysis/approve
POST   /api/v1/submissions/:submissionId/analysis/send
POST   /api/v1/submissions/:submissionId/report/publish
```

### Admin Routes:
```
GET    /api/v1/admin/submissions
GET    /api/v1/admin/submissions/:id
PUT    /api/v1/admin/submissions/:id/status
PUT    /api/v1/admin/enrichment/:enrichmentId
POST   /api/v1/admin/enrichment/:enrichmentId/approve
PUT    /api/v1/admin/analysis/:analysisId
POST   /api/v1/admin/analysis/:analysisId/version
POST   /api/v1/admin/analysis/:analysisId/approve
POST   /api/v1/admin/analysis/:analysisId/send
POST   /api/v1/admin/submissions/:submissionId/retry-enrichment
POST   /api/v1/admin/submissions/:submissionId/retry-analysis
```

---

## 🎯 Next Steps

1. **Backend Developer**:
   - Review Go backend code
   - Verify all routes listed above are implemented
   - Check route parameters match frontend expectations
   - Ensure proper error responses (404 vs 200 with null)

2. **Frontend Testing**:
   - Clear browser cache completely
   - Login with fresh credentials
   - Check localStorage for token
   - Monitor Network tab for API calls
   - Verify submission IDs are correct

3. **Database Verification**:
   - Check if submission IDs in console match database
   - Verify enrichment/analysis records exist for these submissions
   - Check if foreign key relationships are correct

---

## 📝 Related Files

### Frontend API Client:
- `lib/api/client.ts` - All API method definitions

### Pages Using Enrichment/Analysis APIs:
- `app/(dashboard)/painel/page.tsx` - User dashboard
- `app/admin/envios/[id]/page.tsx` - Admin submission detail
- `app/admin/enriquecimento/page.tsx` - Enrichment list
- `app/admin/enriquecimento/[id]/page.tsx` - Enrichment editor
- `app/admin/analise/page.tsx` - Analysis list
- `app/admin/analise/[id]/page.tsx` - Analysis editor

### Hooks:
- `lib/hooks/use-analysis.ts` - Analysis data fetching
- `lib/hooks/use-enrichment.ts` - Enrichment data fetching

---

**Status**: ⚠️ INVESTIGATION REQUIRED - Backend route verification needed
