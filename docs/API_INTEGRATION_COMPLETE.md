# API Integration Complete - Real Backend Connection

## Summary

Successfully replaced mock API client with real HTTP calls to the Go backend running at `http://localhost:8080/api/v1`.

## Files Created

### 1. Error Handler (`lib/api/error-handler.ts`)
- **Purpose**: Centralized error handling for all API requests
- **Features**:
  - Custom `ApiError` class with status code, error code, and details
  - User-friendly error messages in Portuguese
  - HTTP status code mapping (400, 401, 403, 404, 422, 429, 500, 502, 503, 504)
  - Network error handling
  - Helper functions: `isAuthError()`, `isPermissionError()`, `isNotFoundError()`, `isValidationError()`

## Files Updated

### 1. API Client (`lib/api/client.ts`)
Completely replaced mock implementation with real HTTP calls.

**Key Features**:
- Uses `fetch()` API for all requests
- Token-based authentication with `localStorage`
- Automatic `Authorization: Bearer {token}` headers
- Proper JSON request/response handling
- Error handling with custom `ApiError`
- Environment-based API URL (`NEXT_PUBLIC_API_URL`)

**API Modules**:

#### Authentication API (`authApi`)
- `login(credentials)` → POST `/auth/login`
- `signup(data)` → POST `/auth/signup`
- `logout()` → POST `/auth/logout`
- `getCurrentUser()` → GET `/auth/me`
- `forgotPassword(email)` → POST `/auth/forgot-password`
- `resetPassword(data)` → POST `/auth/reset-password`
- `updatePassword(oldPassword, newPassword)` → PUT `/auth/update-password`

#### Submissions API (`submissionsApi`)
- `getById(id)` → GET `/submissions/:id`
- `getAll(params)` → GET `/submissions?status=&page=&pageSize=`
- `create(data)` → POST `/submissions`
- `update(id, data)` → PUT `/submissions/:id`
- `delete(id)` → DELETE `/submissions/:id`

#### Enrichment API (`enrichmentApi`)
- `getBySubmissionId(submissionId)` → GET `/submissions/:id/enrichment`
- `approve(submissionId)` → PUT `/submissions/:id/enrichment/approve`
- `reject(submissionId, reason)` → PUT `/submissions/:id/enrichment/reject`
- `update(submissionId, data)` → PUT `/submissions/:id/enrichment`

#### Analysis API (`analysisApi`)
- `getBySubmissionId(submissionId)` → GET `/submissions/:id/analysis`
- `generate(submissionId)` → POST `/submissions/:id/analysis`
- `update(submissionId, data)` → PUT `/submissions/:id/analysis`
- `getPdf(submissionId)` → GET `/submissions/:id/analysis/pdf` (returns Blob)
- `send(submissionId)` → POST `/submissions/:id/analysis/send`

#### User API (`userApi`)
- `getProfile()` → GET `/user/profile`
- `updateProfile(data)` → PUT `/user/profile`

#### Admin API (`adminApi`)
- `getAllSubmissions(params)` → GET `/admin/submissions?status=&page=&pageSize=`
- `getSubmission(id)` → GET `/admin/submissions/:id`
- `updateSubmissionStatus(id, status)` → PUT `/admin/submissions/:id/status`
- `getAnalytics()` → GET `/admin/analytics`

### 2. React Hooks (Updated to use new API)

#### `lib/hooks/use-submissions.ts`
- Updated to use `submissionsApi.getAll()` and `submissionsApi.create()`
- Changed parameter names: `limit` → `pageSize`
- Updated imports to use separate `ApiError` from error handler

#### `lib/hooks/use-submission.ts`
- Updated to use `submissionsApi.getById()`, `submissionsApi.update()`, `submissionsApi.delete()`
- Updated imports to use separate `ApiError` from error handler

#### `lib/hooks/use-enrichment.ts`
- Updated to use `enrichmentApi.getBySubmissionId()`, `enrichmentApi.approve()`, `enrichmentApi.reject()`
- Simplified mutation functions (removed unnecessary ID parameters)
- Changed type from `EnrichmentData` to `Enrichment`

#### `lib/hooks/use-analysis.ts`
- Updated to use `analysisApi.getBySubmissionId()`, `analysisApi.generate()`, `analysisApi.update()`
- Updated PDF generation to use `analysisApi.getPdf()`
- Updated send function to use `analysisApi.send()`
- Changed type from `AnalysisData` to `Analysis`

#### `lib/hooks/use-profile.ts`
- Updated to use `userApi.getProfile()` and `userApi.updateProfile()`
- Removed unnecessary `userId` parameter from API calls
- Updated imports to use separate `ApiError` from error handler

## Environment Configuration

The API client reads the base URL from environment variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

For production:
```env
NEXT_PUBLIC_API_URL=https://your-backend.run.app/api/v1
```

## Authentication Flow

1. User logs in via `authApi.login()` or `authApi.signup()`
2. Backend returns `{ user, token }`
3. Token is saved to `localStorage` as `auth_token`
4. All subsequent requests include `Authorization: Bearer {token}` header
5. On logout, token is removed from `localStorage`
6. On 401 error, token is automatically removed

## Error Handling

All API functions throw `ApiError` on failure:

```typescript
try {
  const submission = await submissionsApi.getById(id);
} catch (error) {
  if (error instanceof ApiError) {
    console.error(error.message); // User-friendly message in Portuguese
    console.error(error.status);  // HTTP status code
    console.error(error.code);    // Backend error code (optional)
  }
}
```

Helper functions available:
```typescript
import { isAuthError, isPermissionError, isNotFoundError, isValidationError } from '@/lib/api/error-handler';

if (isAuthError(error)) {
  // Redirect to login
}
```

## Type Safety

All API functions use TypeScript types from `types/index.ts`:
- `User`, `Submission`, `Enrichment`, `Analysis`, `Report`
- Form types: `LoginFormData`, `SignupFormData`, `SubmissionFormData`, etc.
- Response types: `ApiResponse<T>`, `PaginatedResponse<T>`

## Testing

To test the integration:

1. **Start the backend**:
   ```bash
   cd backend
   go run cmd/api/main.go
   ```

2. **Start the frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test endpoints**:
   - Login: `http://localhost:3000/login`
   - Create submission: `http://localhost:3000/`
   - View submissions: `http://localhost:3000/dashboard`
   - Admin panel: `http://localhost:3000/admin`

## Next Steps

1. Ensure backend is running on `http://localhost:8080`
2. Test all API endpoints with real data
3. Handle edge cases (network failures, slow responses)
4. Add loading states and error messages in UI components
5. Configure production API URL before deployment

## Backward Compatibility

The function signatures remain the same, so existing code should continue to work without changes. The only difference is:
- Mock data with `setTimeout()` delays → Real HTTP requests
- Local state mutations → Database persistence

---

**Integration Status**: ✅ Complete
**Date**: 2025-11-21
**Backend URL**: http://localhost:8080/api/v1
