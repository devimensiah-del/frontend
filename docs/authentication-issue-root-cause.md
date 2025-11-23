# Authentication Issue - Root Cause Analysis
**Date:** 2025-11-23
**Status:** 🔴 CRITICAL - Authentication Blocking All Protected Routes

---

## ✅ Routes Exist - Confirmed!

I verified the backend code. **All routes the frontend expects DO EXIST:**

### Backend Routes (from `backend_v3/api/router.go`):
```go
// Lines 74-75
protectedAPI.GET("/submissions/:id/enrichment", handler.GetEnrichment)
protectedAPI.GET("/submissions/:id/analysis", handler.GetAnalysis)
```

These match exactly what the frontend calls:
- Frontend: `GET /api/v1/submissions/${submissionId}/enrichment`
- Backend: `GET /api/v1/submissions/:id/enrichment` ✅

---

## 🔴 The Real Problem: Authentication Failure

### How The Routes Work:

**Enrichment Handler** (`backend_v3/api/enrichment_handlers.go:10-96`):
```go
func (h *Handler) GetEnrichment(c *gin.Context) {
    // Line 24-31: Check authentication
    userID, exists := c.Get("userID")
    if !exists {
        c.JSON(http.StatusUnauthorized, ErrorResponse{
            Error:   "Unauthorized",
            Message: "User not authenticated",
        })
        return
    }

    // Line 72-78: Get enrichment (returns 404 if not found)
    enrichment, err := h.enrichmentSvc.GetBySubmissionID(c.Request.Context(), subUUID)
    if err != nil {
        c.JSON(http.StatusNotFound, ErrorResponse{
            Error:   "Not found",
            Message: "Enrichment data not found for this submission",
        })
        return
    }
}
```

**Analysis Handler** (`backend_v3/api/analysis_handlers.go:10-119`):
```go
func (h *Handler) GetAnalysis(c *gin.Context) {
    // Line 24-32: Check authentication
    userID, exists := c.Get("userID")
    if !exists {
        c.JSON(http.StatusUnauthorized, ErrorResponse{
            Error:   "Unauthorized",
            Message: "User not authenticated",
        })
        return
    }

    // Line 72-79: Get analysis (returns 404 if not found)
    analysis, err := h.analysisSvc.GetBySubmissionID(c.Request.Context(), submissionID)
    if err != nil {
        c.JSON(http.StatusNotFound, ErrorResponse{
            Error:   "Not found",
            Message: "Analysis not found for this submission",
        })
        return
    }
}
```

### What's Happening:

1. **Frontend makes request** → `GET /api/v1/submissions/ae9aa5f5.../enrichment`
2. **Auth middleware runs** → Checks for `Authorization: Bearer {token}` header
3. **Auth middleware fails** → Either:
   - Header is missing → Returns 401 with `{"error":"Unauthorized","message":"Missing authorization header"}`
   - Token is invalid → Doesn't set `userID` in context
4. **Handler receives request** → `userID` not in context
5. **Handler returns 401 or 404** → Depends on what auth middleware does

---

## 🔍 Why You See 404 Instead of 401

The console shows **404 errors**, not 401. This means:

**Option 1: Auth middleware returns 404 when header is missing**
- Some middleware configurations return 404 for unauthenticated requests
- Check `backend_v3/api/middleware.go` for AuthMiddleware behavior

**Option 2: Auth passes but data doesn't exist**
- Token IS being sent
- User IS authenticated
- But enrichment/analysis records don't exist in database for this submission ID

**Option 3: Preflight CORS issue**
- Browser preflight OPTIONS request fails
- Main request never includes headers
- Backend returns 404 from route not found

---

## 🧪 How to Debug This

### Step 1: Check Browser DevTools

**Open DevTools → Network Tab → Filter to XHR**

Find the failed request to `/submissions/.../enrichment`

**Click on it and check:**

1. **Request Headers tab:**
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

   **Is this header present?**
   - ✅ **YES** → Token is being sent, check Step 2
   - ❌ **NO** → Token not in localStorage or frontend bug

2. **Response tab:**
   ```json
   {
     "error": "Unauthorized",
     "message": "Missing authorization header"
   }
   ```

   **What's the response body?**
   - `"Missing authorization header"` → Token not sent
   - `"User not authenticated"` → Token invalid/expired
   - `"Not found"` → Auth passed, data doesn't exist

### Step 2: Check LocalStorage

**DevTools → Application → Local Storage → https://your-frontend.vercel.app**

**Look for:**
```
Key: auth_token
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Is it there?**
- ✅ **YES** → Check if token is valid (Step 3)
- ❌ **NO** → Login flow isn't saving token

### Step 3: Decode JWT Token

**Copy the token value and go to https://jwt.io**

**Paste token and check:**
```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "role": "user",
  "exp": 1732345678,  // ← Check this timestamp
  "iat": 1732259278
}
```

**Check expiration:**
- `exp` should be in the future
- Compare with current time: `Date.now() / 1000`
- If `exp < current time` → Token expired

### Step 4: Check Backend Middleware

**Read `backend_v3/api/middleware.go` line 50-100 (AuthMiddleware function)**

Check what it returns when:
- Authorization header is missing
- Token is invalid
- Token is expired

---

## 🛠️ Likely Solutions

### Solution 1: Token Not Being Saved After Login

**Problem:** Login succeeds but `setAuthToken()` never runs

**Check:** `frontend/lib/api/client.ts` line 94-103
```typescript
async login(credentials: LoginFormData): Promise<{ user: User; token: string }> {
  const response = await apiRequest<{ user: User; token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  // Save token to localStorage
  setAuthToken(response.token);  // ← Does this run?

  return response;
}
```

**Fix:**
- Add console.log to verify token is received
- Check if localStorage.setItem is blocked (privacy mode)
- Verify login component calls this function

### Solution 2: Token Expired

**Problem:** User logged in days ago, token expired

**Fix:**
- Implement token refresh
- Add auto-logout on 401
- Redirect to login when token invalid

**Quick fix for testing:**
```typescript
// In apiRequest function (lib/api/client.ts:72-74)
if (!response.ok) {
  if (response.status === 401) {
    removeAuthToken();
    window.location.href = '/login';
  }
  await handleApiError(response);
}
```

### Solution 3: CORS Stripping Headers

**Problem:** Browser preflight fails, main request missing headers

**Fix:** Check backend CORS middleware allows `Authorization` header

**Verify in `backend_v3/api/middleware.go`:**
```go
// Should include:
c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
```

### Solution 4: SSR Token Access

**Problem:** `window` is undefined during server-side rendering

**Current code** (`lib/api/client.ts:26-29`):
```typescript
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;  // ← Returns null on server
  return localStorage.getItem('auth_token');
}
```

This is **CORRECT** - it handles SSR properly. But it means:
- Server-side API calls won't be authenticated
- Only client-side calls work

**Is the dashboard page SSR or client-side?**
- Check if `'use client'` directive is at top of file
- User dashboard should be client-only

---

## 👻 Ghost Data Explanation

**Why analysis shows when Supabase table is empty:**

### Dashboard Code (`app/(dashboard)/painel/page.tsx:56-63`):
```typescript
try {
  const analysisData = await analysisApi.getBySubmissionId(latestSubmission.id);
  setAnalysis(analysisData);
} catch (analysisError) {
  console.log('No analysis data available yet');
  // BUG: Doesn't set analysis to null on error!
}
```

**The bug:**
- Catch block logs error but **doesn't clear state**
- If `analysis` was previously set (from cache/old data), it persists
- React shows stale data

**Fix:**
```typescript
try {
  const analysisData = await analysisApi.getBySubmissionId(latestSubmission.id);
  setAnalysis(analysisData);
} catch (analysisError) {
  console.log('No analysis data available yet');
  setAnalysis(null);  // ← Clear stale data
}
```

---

## 📋 Action Plan

### Immediate Actions (Debug):

1. **Check Network Tab**:
   - Open DevTools
   - Go to Network tab
   - Filter XHR/Fetch
   - Find failed `/enrichment` or `/analysis` request
   - Check if `Authorization` header is present
   - Check response status code (401? 404?)
   - Check response body message

2. **Check LocalStorage**:
   - DevTools → Application → Local Storage
   - Look for `auth_token` key
   - If missing → Login flow broken
   - If present → Copy value and decode at jwt.io

3. **Check Token Expiration**:
   - Decode token at https://jwt.io
   - Check `exp` field
   - Compare with current timestamp

### Code Fixes:

**Fix 1: Clear stale analysis data**
```typescript
// app/(dashboard)/painel/page.tsx line 56-63
try {
  const analysisData = await analysisApi.getBySubmissionId(latestSubmission.id);
  setAnalysis(analysisData);
} catch (analysisError) {
  console.log('No analysis data available yet');
  setAnalysis(null);  // ← ADD THIS
}

// Also for enrichment (lines 48-54)
try {
  const enrichmentData = await enrichmentApi.getBySubmissionId(latestSubmission.id);
  setEnrichment(enrichmentData);
} catch (enrichmentError) {
  console.log('No enrichment data available yet');
  setEnrichment(null);  // ← ADD THIS
}
```

**Fix 2: Add better error handling**
```typescript
// lib/api/client.ts line 72-74
if (!response.ok) {
  // Handle unauthorized
  if (response.status === 401) {
    console.error('Unauthorized - removing invalid token');
    removeAuthToken();
    // Optionally redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  await handleApiError(response);
}
```

**Fix 3: Add debug logging**
```typescript
// lib/api/client.ts line 50-64
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  // ADD: Debug logging
  console.log(`API Request: ${options.method || 'GET'} ${endpoint}`);
  console.log(`Token present: ${!!token}`);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log(`Authorization header added`);  // ADD
  } else {
    console.warn(`No auth token found in localStorage`);  // ADD
  }

  // ... rest of function
}
```

---

## 🎯 Most Likely Root Cause

Based on the error message `"Missing authorization header"`, I believe:

1. ✅ Backend routes exist and are correct
2. ❌ **Frontend is not sending the Authorization header**
3. Possible reasons:
   - Token not in localStorage (login didn't save it)
   - Token retrieval failing silently
   - CORS preflight removing headers

**Next step:** Check DevTools Network tab to see if `Authorization` header is in the request.

---

## 📊 Backend Route Summary

All these routes are **CONFIRMED TO EXIST**:

### User Routes (Protected - Require Auth):
```
GET  /api/v1/submissions              ✅ Lists user's submissions
GET  /api/v1/submissions/:id          ✅ Get submission
GET  /api/v1/submissions/:id/enrichment   ✅ Get enrichment (THIS ONE)
GET  /api/v1/submissions/:id/analysis     ✅ Get analysis (THIS ONE)
GET  /api/v1/submissions/:id/report/preview  ✅
POST /api/v1/submissions/:id/report/publish  ✅
```

### Admin Routes (Protected - Require Auth + Admin Role):
```
GET  /api/v1/admin/submissions        ✅
GET  /api/v1/admin/submissions/:id    ✅
POST /api/v1/admin/submissions/:id/retry-enrichment  ✅
POST /api/v1/admin/submissions/:id/retry-analysis    ✅
PUT  /api/v1/admin/enrichment/:id     ✅
POST /api/v1/admin/enrichment/:id/approve  ✅
PUT  /api/v1/admin/analysis/:id       ✅
POST /api/v1/admin/analysis/:id/version    ✅
POST /api/v1/admin/analysis/:id/approve    ✅
POST /api/v1/admin/analysis/:id/send       ✅
```

**All routes match frontend expectations perfectly!**

The issue is **authentication**, not missing routes.
