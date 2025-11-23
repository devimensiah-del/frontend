# Workflow Status Flow Analysis

## User's Required Workflow

### 1. **Submission Flow**
- **Status**: `received`
- Submission comes in → saved in DB with status `received`
- Status should remain `received` (user is unsure if it changes)
- **No other statuses needed for submission**

### 2. **Enrichment Flow**
- **Statuses**: `pending` → `finished` → `approved`
- Enrichment inserted immediately after submission with status `pending`
- Workers finish enriching → status changes to `finished`
- Admin hits "approve" button → status changes to `approved`
- **Only these 3 statuses:** `pending`, `finished`, `approved`
- Admin can edit enrichment fields through UI
- **No versioning needed for enrichment**

### 3. **Analysis Flow**  
- **Statuses**: `pending` → `completed` → `approved` → `sent`
- Analysis inserted in DB with status `pending`
- Analysis completes → status changes to `completed`
- This is version 1
- Admin can edit analysis through UI
- **Versioning IS needed for analysis**
- When admin creates new version:
  - Previous version status remains unchanged
  - New version saved as "v2", "v3", etc.
  - New version inherits status from previous version until admin changes it
- **Status progression**: `completed` → `approved` → `sent`
  - `approved` = admin approved but kept for themselves  
  - `sent` = made available to user who submitted it
- **Once analysis is `approved`, it can be downloaded as PDF** (report generation triggered)

---

## Current Implementation Analysis

### ✅ **CORRECT: Submission Status**
**File**: `frontend/lib/types/index.ts` (lines 10-12)
```typescript
export type SubmissionStatus = 'received';
```
- ✅ Only has `received` status
- ✅ Matches user requirements

---

### ❌ **INCORRECT: Enrichment Status**
**File**: `frontend/lib/types/index.ts` (lines 86-92)
```typescript
export type EnrichmentStatus =
  | 'pending'      // Initial state, waiting for worker
  | 'processing'   // Worker is enriching data
  | 'finished'     // Worker completed, waiting for admin review
  | 'approved'     // Admin approved, ready for analysis
  | 'rejected'     // Admin rejected, needs rework
  | 'failed';      // Worker failed
```

**Issues**:
1. ❌ Has `processing` status - **NOT REQUIRED**
2. ❌ Has `rejected` status - **NOT REQUIRED**  
3. ❌ Has `failed` status - **NOT REQUIRED**
4. ✅ Has `pending`, `finished`, `approved` - **CORRECT**

**Required Fix**:
```typescript
export type EnrichmentStatus = 'pending' | 'finished' | 'approved';
```

---

### ❌ **INCORRECT: Analysis Status**
**File**: `frontend/lib/types/index.ts` (lines 331-337)
```typescript
export type AnalysisStatus =
  | 'pending'      // Initial state, waiting for worker
  | 'processing'   // Worker is analyzing (optional transitional state)
  | 'completed'    // Worker completed, admin can edit
  | 'approved'     // Admin approved, ready to send
  | 'sent'         // Report sent to user
  | 'failed';      // Worker failed
```

**Issues**:
1. ❌ Has `processing` status - **NOT REQUIRED**
2. ❌ Has `failed` status - **NOT REQUIRED**
3. ✅ Has `pending`, `completed`, `approved`, `sent` - **CORRECT**

**Required Fix**:
```typescript
export type AnalysisStatus = 'pending' | 'completed' | 'approved' | 'sent';
```

---

## Missing Components Analysis

### 1. ✅ **Enrichment Edit Capability**
**File**: `frontend/app/admin/enriquecimento/[id]/page.tsx`
- ✅ Has `EnrichmentForm` component for editing
- ✅ Has save draft functionality
- ✅ Has approve functionality

### 2. ✅ **Enrichment Approve Button**
**File**: `frontend/app/admin/enriquecimento/[id]/_components/EnrichmentActions.tsx`
- ✅ Has "Aprovar Enriquecimento" button (line 103)
- ✅ Has approve confirmation dialog (lines 120-147)
- ⚠️ Also has "Rejeitar" button (lines 87-94) - **Should be removed per user requirements**

### 3. ⚠️ **Analysis Edit Capability**
**File**: `frontend/app/admin/submissions/[id]/page.tsx`
- ✅ Has `WarRoomShell` for editing analysis
- ✅ Has save draft functionality
- ❌ **Missing explicit "Approve" button for analysis**
- ❌ **Missing "Send to User" button for analysis**
- Has "Publish PDF" button (generates PDF but doesn't change status to `approved`)

### 4. ❌ **Analysis Versioning UI**
- ❌ No visible UI for creating new analysis versions
- ❌ No UI to view previous analysis versions
- ❌ No UI to switch between analysis versions
- Backend supports versioning (see `analysisApi.getVersions`, `analysisApi.getVersion`)
- Frontend doesn't expose this functionality

### 5. ❌ **Analysis Status Workflow Buttons**
**Required Buttons Missing**:
1. ❌ "Approve Analysis" button (changes status `completed` → `approved`, triggers PDF generation)
2. ❌ "Send to User" button (changes status `approved` → `sent`)
3. ❌ "Create New Version" button (creates v2, v3, etc.)

---

## API Client Status

### ✅ **Enrichment API** 
**File**: `frontend/lib/api/client.ts`
- ✅ `enrichmentApi.approve()` - line 297
- ✅ `enrichmentApi.reject()` - line 311 (can be removed)
- ✅ `enrichmentApi.update()` - line 326
- ✅ `enrichmentApi.markFinished()` - line 283

### ⚠️ **Analysis API**
**File**: `frontend/lib/api/client.ts`
- ✅ `analysisApi.approve()` - line 399 (marks as `approved`)
- ✅ `analysisApi.send()` - line 423 (marks as `sent`)
- ✅ `analysisApi.update()` - line 384
- ✅ `analysisApi.getVersions()` - line 354
- ✅ `analysisApi.getVersion()` - line 362
- ❌ **Missing**: Create new version API call
  - Comment says "creates new version if status is 'approved'" but there's no explicit version creation endpoint

### ✅ **Admin API**
**File**: `frontend/lib/api/client.ts`
- ✅ `adminApi.approveEnrichment()` - line 531
- ✅ `adminApi.approveAnalysis()` - line 568
- ✅ `adminApi.sendAnalysis()` - line 577
- ✅ `adminApi.createAnalysisVersion()` - line 554 ✅ **EXISTS!**
- ✅ `adminApi.updateAnalysis()` - line 540

---

## Required Changes Summary

### 1. **Type Definitions** (HIGH PRIORITY)
- [ ] Update `EnrichmentStatus` to only: `'pending' | 'finished' | 'approved'`
- [ ] Update `AnalysisStatus` to only: `'pending' | 'completed' | 'approved' | 'sent'`

### 2. **Enrichment Actions Component** (MEDIUM PRIORITY)
- [ ] Remove "Rejeitar" (Reject) button from EnrichmentActions
- [ ] Remove rejection dialog
- [ ] Remove `onReject` prop

### 3. **Analysis War Room Component** (HIGH PRIORITY)  
**File**: `frontend/app/admin/submissions/[id]/page.tsx`
- [ ] Add "Approve Analysis" button
  - Should call `adminApi.approveAnalysis()`
  - Should change status to `approved`
  - Should trigger PDF generation
- [ ] Add "Send to User" button  
  - Should call `adminApi.sendAnalysis()`
  - Should change status to `sent`
  - Should only be enabled when status is `approved`
- [ ] Add "Create New Version" button
  - Should call `adminApi.createAnalysisVersion()`
  - Should create v2, v3, etc.
  - New version inherits status from previous
- [ ] Add version selector dropdown
  - Show all versions (v1, v2, v3...)
  - Allow switching between versions
  - Call `analysisApi.getVersions()` and `analysisApi.getVersion()`

### 4. **Workflow Progress** (LOW PRIORITY)
- [ ] Update stage counting to use enrichment/analysis statuses instead of submission status
  - Stage 1 (Envios): Count submissions with enrichment status = 'pending' or 'finished'
  - Stage 2 (Enriquecimento): Count enrichments with status = 'finished' (awaiting approval)
  - Stage 3 (Análise): Count analyses with status = 'completed' or 'approved' (awaiting send)

### 5. **Dashboard Stats** (LOW PRIORITY)  
**File**: `frontend/app/admin/dashboard/page.tsx`
- [ ] Update stats to show meaningful counts based on enrichment/analysis status
- Currently shows hardcoded 0s for pending/completed

---

## Workflow Validation Checklist

Based on user requirements, here's what should happen:

### ✅ Step 1: Submission Received
- [x] Submission saved with status `received`
- [x] Enrichment auto-created with status `pending`

### ⚠️ Step 2: Enrichment Processing
- [x] Worker processes enrichment
- [ ] Worker marks enrichment as `finished` (API exists, need to verify worker calls it)

### ✅ Step 3: Admin Reviews Enrichment  
- [x] Admin can edit enrichment data via UI
- [x] Admin can save drafts
- [x] Admin clicks "Approve" → enrichment status becomes `approved`
- [ ] ❌ Analysis should be auto-triggered (need to verify backend does this)

### ⚠️ Step 4: Analysis Processing
- [x] Analysis created with status `pending`
- [x] Worker processes analysis
- [ ] Worker marks analysis as `completed` (need to verify worker does this)

### ❌ Step 5: Admin Reviews Analysis (v1)
- [x] Admin can edit analysis data via UI  
- [x] Admin can save drafts
- [ ] ❌ Admin clicks "Approve" → analysis status becomes `approved` (button missing)
- [ ] ❌ PDF generation triggered (need to verify)

### ❌ Step 6: Admin Creates New Version (optional)
- [ ] ❌ Admin clicks "Create New Version" (button missing)
- [ ] ❌ New version (v2) created with previous status (logic exists in backend?)
- [ ] ❌ Admin edits v2
- [ ] ❌ Admin approves v2 → status becomes `approved`

### ❌ Step 7: Send to User
- [ ] ❌ Admin clicks "Send to User" → analysis status becomes `sent` (button missing)
- [ ] ❌ Email sent to user with PDF link (need to verify backend does this)

---

## Files Requiring Changes

### **HIGH PRIORITY**
1. `frontend/lib/types/index.ts` - Fix status type definitions
2. `frontend/app/admin/submissions/[id]/page.tsx` - Add approve/send/version buttons
3. `frontend/app/admin/submissions/[id]/_components/ActionToolbar.tsx` - May need update for new buttons

### **MEDIUM PRIORITY**  
4. `frontend/app/admin/enriquecimento/[id]/_components/EnrichmentActions.tsx` - Remove reject button
5. `frontend/components/admin/WorkflowProgress.tsx` - Update stage counting logic

### **LOW PRIORITY**
6. `frontend/app/admin/dashboard/page.tsx` - Update stats to use real status counts
7. Any status badge display components - Update to only show valid statuses

---

## Questions for Backend Verification

1. Does enrichment approval auto-trigger analysis creation?
2. Does analysis approval auto-trigger PDF generation?  
3. Does `adminApi.sendAnalysis()` send email to user?
4. How does analysis versioning work on backend?
   - Does `adminApi.createAnalysisVersion()` copy previous version's status?
   - Can admin edit previous versions or only latest?
5. What happens to previous analysis versions when new one is created?
   - Are they preserved in DB?
   - Can they be retrieved?

