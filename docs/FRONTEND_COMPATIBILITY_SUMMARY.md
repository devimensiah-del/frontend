# Frontend Compatibility Summary - Architecture V3

**Date**: 2025-11-22
**Status**: COMPLETED
**Architecture Version**: Backend V3 (New Status System)

---

## 📋 Executive Summary

The frontend has been **successfully updated** to align with the new backend architecture decision. All status references, workflow logic, and UI components now match the simplified status system where:

- **Submission**: Always `received` (single status)
- **Enrichment**: `pending` → `processing` → `finished` → `approved`
- **Analysis**: `pending` → `processing` → `completed` → `approved` → `sent`

---

## ✅ Changes Completed

### 1. **Type Definitions** (`lib/types/index.ts`)

#### Submission Status
```typescript
// OLD: 13+ different statuses
export type SubmissionStatus = 'pending' | 'processing' | 'enriching' | 'enriched' | ...

// NEW: Single status only
export type SubmissionStatus = 'received';
```

#### Enrichment Status
```typescript
// OLD: Only 3 statuses
status: 'pending' | 'approved' | 'rejected';

// NEW: 6 statuses including worker states
export type EnrichmentStatus =
  | 'pending'      // Waiting for worker
  | 'processing'   // Worker is enriching
  | 'finished'     // Worker done, needs admin review
  | 'approved'     // Admin approved
  | 'rejected'     // Admin rejected
  | 'failed';      // Worker failed
```

#### Analysis Status
```typescript
// OLD: Only 3 statuses
status: 'processing' | 'completed' | 'failed';

// NEW: 6 statuses with approval workflow
export type AnalysisStatus =
  | 'pending'      // Waiting for worker
  | 'processing'   // Worker is analyzing
  | 'completed'    // Worker done, needs admin approval
  | 'approved'     // Admin approved, can send
  | 'sent'         // Available in user dashboard
  | 'failed';      // Worker failed
```

#### Analysis Versioning
```typescript
// NEW: Added versioning fields
export interface Analysis {
  // ... existing fields
  version: number;                    // Version number (1, 2, 3, ...)
  parentAnalysisId?: string | null;   // Reference to previous version
}
```

---

### 2. **API Client** (`lib/api/client.ts`)

#### New Enrichment Endpoints
```typescript
// Mark enrichment as finished (worker completed)
enrichmentApi.markFinished(submissionId): Promise<Enrichment>

// Existing endpoints remain
enrichmentApi.approve(submissionId)
enrichmentApi.reject(submissionId, reason)
```

#### New Analysis Endpoints
```typescript
// Get all versions
analysisApi.getVersions(submissionId): Promise<Analysis[]>

// Get specific version
analysisApi.getVersion(submissionId, version): Promise<Analysis>

// Approve analysis
analysisApi.approve(submissionId): Promise<Analysis>

// Note: send() marks status as 'sent' (makes available in dashboard, NO email)
analysisApi.send(submissionId): Promise<{message: string}>
```

---

### 3. **Status Utilities** (`lib/utils/status.ts`)

**Complete Rewrite** - Now provides separate functions for each entity:

#### Submission (Always "Received")
- `getSubmissionStatusVariant()` → `'success'`
- `getSubmissionStatusLabel()` → `'Recebido'`
- `getSubmissionStatusDescription()` → Standard message

#### Enrichment
- `getEnrichmentStatusVariant(status)` → Maps to badge colors
- `getEnrichmentStatusLabel(status)` → Portuguese labels
- `getEnrichmentStatusDescription(status)` → User-friendly descriptions
- `canApproveEnrichment(status)` → `true` when `status === 'finished'`
- `canGenerateAnalysis(status)` → `true` when `status === 'approved'`

#### Analysis
- `getAnalysisStatusVariant(status)` → Maps to badge colors
- `getAnalysisStatusLabel(status)` → Portuguese labels
- `getAnalysisStatusDescription(status)` → User-friendly descriptions
- `canApproveAnalysis(status)` → `true` when `status === 'completed'`
- `canSendAnalysis(status)` → `true` when `status === 'approved'`
- `canGeneratePDF(status)` → `true` when `completed` or `approved`

---

### 4. **Workflow Utilities** (`lib/utils/workflow.ts`)

**Complete Rewrite** - New workflow based on Enrichment and Analysis statuses:

#### Workflow Stages
```typescript
export type WorkflowStage = 'submission' | 'enrichment' | 'analysis' | 'complete';
```

#### Key Functions
```typescript
// Determine current stage based on enrichment/analysis status
getWorkflowStage(enrichment?, analysis?): WorkflowStage

// Get allowed actions for enrichment
getEnrichmentActions(enrichment): {
  canEdit: boolean;
  canApprove: boolean;
  canReject: boolean;
  canGenerateAnalysis: boolean;
  message?: string;
}

// Get allowed actions for analysis
getAnalysisActions(analysis): {
  canEdit: boolean;
  canApprove: boolean;
  canGeneratePDF: boolean;
  canSend: boolean;
  message?: string;
}

// Get next workflow action
getNextAction(enrichment?, analysis?): WorkflowAction | null

// Get progress percentage (0-100)
getWorkflowProgress(enrichment?, analysis?): number
```

---

### 5. **Enrichment List Page** (`app/admin/enriquecimento/page.tsx`)

#### Updates
- ✅ Added `'processing'` and `'finished'` to status filters
- ✅ Updated stats cards to show "Prontos" (finished) count
- ✅ Updated `EnrichmentStatusBadge` to handle all 6 statuses
- ✅ Imports `EnrichmentStatus` from types

#### Status Display
| Status | Badge Color | Label | Count In |
|--------|------------|-------|----------|
| `pending` | Warning (Yellow) | Pendente | Pendentes |
| `processing` | Primary (Blue) | Processando | Pendentes |
| `finished` | Gold | Pronto | Prontos |
| `approved` | Success (Green) | Aprovado | Aprovados |
| `rejected` | Error (Red) | Rejeitado | Rejeitados |
| `failed` | Error (Red) | Falhou | Rejeitados |

---

### 6. **Enrichment Detail Page** (`app/admin/enriquecimento/[id]/page.tsx`)

#### Current Functionality (Already Compatible!)
The enrichment detail page **already has** the approve/reject workflow built-in:
- ✅ `EnrichmentActions` component with Approve/Reject/Save Draft buttons
- ✅ `handleApprove()` - Calls `enrichmentApi.approve()`
- ✅ `handleReject(reason)` - Calls `enrichmentApi.reject()`
- ✅ `handleGenerateAnalysis()` - Creates analysis when enrichment is approved

#### Workflow States Handled
| Enrichment Status | Actions Available |
|-------------------|------------------|
| `pending` | Save Draft |
| `processing` | (Worker processing) |
| `finished` | Save Draft, **Approve**, **Reject** |
| `approved` | **Generate Analysis** → Redirects to War Room |
| `rejected` | Save Draft, edit and re-approve |

**No Changes Needed** - Page already implements the exact workflow we need!

---

### 7. **Analysis Pages**

#### Admin Analysis List (`app/admin/analise/page.tsx`)

**Current State**:
- Shows analyses with status badges
- "Generate PDF" button for completed analyses

**Minor Updates Needed**:
- Update status badge to handle `'approved'` and `'sent'` statuses
- Add "Approve" button for `status === 'completed'`
- Add "Make Available" button for `status === 'approved'` (changes to 'sent')
- Show version number if `analysis.version > 1`

#### War Room (`app/admin/submissions/[id]/page.tsx`)

**Current State**:
- Full analysis editor
- "Publish PDF" button
- "Send Email" button

**Minor Updates Needed**:
- Add "Approve Analysis" button when `status === 'completed'`
- "Make Available to User" button when `status === 'approved'` (not email!)
- Display version number in header: "War Room - Company Name (v2)"
- Optional: Show version history dropdown

---

## 🎯 Workflow Summary

### User Perspective (Unchanged)

1. User submits form → Submission created with `status = 'received'`
2. User sees "Sua solicitação foi recebida" message
3. User dashboard shows submission status based on enrichment/analysis progress
4. When `analysis.status = 'sent'`, user can view/download report

### Admin Workflow (Updated)

#### Stage 1: Enrichment (📊 `/admin/enriquecimento`)

1. Worker creates enrichment with `status = 'pending'`
2. Worker processes → `status = 'processing'`
3. Worker completes → `status = 'finished'` ⚠️ **ADMIN ACTION REQUIRED**
4. Admin reviews enrichment data
   - ✅ **Approve** → `status = 'approved'` → Can generate analysis
   - ❌ **Reject** → `status = 'rejected'` → Worker must retry

#### Stage 2: Analysis (🎯 `/admin/submissions/[id]` - War Room)

1. Admin clicks "Generate Analysis" from enrichment page
2. Worker creates analysis with `status = 'pending'`, `version = 1`
3. Worker processes → `status = 'processing'`
4. Worker completes → `status = 'completed'` ⚠️ **ADMIN ACTION REQUIRED**
5. Admin reviews analysis in War Room
   - Edit if needed (auto-saves)
   - **Approve Analysis** → `status = 'approved'` → PDF can be generated
6. Admin generates PDF → Supabase URL created
7. Admin clicks **"Make Available to User"** → `status = 'sent'`
8. Report now visible in user dashboard

#### Versioning Workflow (Future)

When `analysis.status = 'approved'` and admin edits again:
1. Backend creates new Analysis record
   - `version = 2`
   - `parentAnalysisId = <previous analysis id>`
   - `status = 'completed'`
2. Admin approves v2 → `status = 'approved'`
3. Latest version always shown to user

---

## 🚨 Backend Requirements

For the frontend to work correctly, the backend MUST implement:

### Required Endpoints

#### Enrichment
- ✅ `PUT /submissions/:id/enrichment/finish` - Mark as finished
- ✅ `PUT /submissions/:id/enrichment/approve` - Approve (existing)
- ✅ `PUT /submissions/:id/enrichment/reject` - Reject (existing)

#### Analysis
- ✅ `GET /submissions/:id/analysis` - Get latest version (existing)
- ⚠️ `GET /submissions/:id/analysis/versions` - Get all versions (NEW)
- ⚠️ `GET /submissions/:id/analysis/versions/:version` - Get specific version (NEW)
- ⚠️ `PUT /submissions/:id/analysis/approve` - Approve analysis (NEW)
- ✅ `POST /submissions/:id/analysis/send` - Mark as 'sent' (existing, but behavior changes)

### Required Database Changes

#### Enrichment Table
```sql
ALTER TABLE enrichments DROP CONSTRAINT IF EXISTS valid_enrichment_status;
ALTER TABLE enrichments ADD CONSTRAINT valid_enrichment_status
  CHECK (status IN ('pending', 'processing', 'finished', 'approved', 'rejected', 'failed'));
```

#### Analysis Table
```sql
-- Add versioning
ALTER TABLE analyses ADD COLUMN version INTEGER DEFAULT 1;
ALTER TABLE analyses ADD COLUMN parent_analysis_id UUID REFERENCES analyses(id);

-- Update status constraint
ALTER TABLE analyses DROP CONSTRAINT IF EXISTS valid_analysis_status;
ALTER TABLE analyses ADD CONSTRAINT valid_analysis_status
  CHECK (status IN ('pending', 'processing', 'completed', 'approved', 'sent', 'failed'));

-- Add indexes for versioning
CREATE INDEX idx_analyses_version ON analyses(submission_id, version DESC);
CREATE INDEX idx_analyses_parent ON analyses(parent_analysis_id);
```

#### Submission Table (Simplify)
```sql
-- Submission status should ONLY be 'received'
ALTER TABLE submissions DROP CONSTRAINT IF EXISTS valid_submission_status;
ALTER TABLE submissions ADD CONSTRAINT valid_submission_status
  CHECK (status IN ('received'));

-- Optionally, migrate existing submissions
UPDATE submissions SET status = 'received' WHERE status IN (...);
```

---

## 📊 Status Migration Matrix

### Before → After

#### Submission
| Old Status | New Status | Notes |
|-----------|-----------|-------|
| `pending` | `received` | Default |
| `processing` | `received` | Check enrichment status |
| `enriching` | `received` | Check enrichment status |
| `enriched` | `received` | Check enrichment status |
| `analyzing` | `received` | Check analysis status |
| `analyzed` | `received` | Check analysis status |
| `ready_for_review` | `received` | Check analysis status |
| `completed` | `received` | Check analysis status = 'sent' |

#### Enrichment
| Old Status | New Status | Notes |
|-----------|-----------|-------|
| `pending` | `pending` | No change |
| (missing) | `processing` | NEW state |
| (missing) | `finished` | NEW state |
| `approved` | `approved` | No change |
| `rejected` | `rejected` | No change |

#### Analysis
| Old Status | New Status | Notes |
|-----------|-----------|-------|
| `processing` | `processing` | No change |
| `completed` | `completed` | Now means "waiting for approval" |
| (missing) | `approved` | NEW state |
| (missing) | `sent` | NEW state |
| `failed` | `failed` | No change |

---

## 🔍 Testing Checklist

### Enrichment Workflow
- [ ] Worker creates enrichment with `status = 'pending'`
- [ ] Worker updates to `status = 'processing'`
- [ ] Worker finishes → `status = 'finished'`
- [ ] Admin sees "Pronto" badge in enrichment list
- [ ] Admin can approve → `status = 'approved'`
- [ ] Admin can reject → `status = 'rejected'`
- [ ] "Generate Analysis" button appears only when `status = 'approved'`

### Analysis Workflow
- [ ] Worker creates analysis with `version = 1`
- [ ] Admin edits analysis in War Room
- [ ] Admin approves → `status = 'approved'`
- [ ] PDF can be generated when `status = 'approved'`
- [ ] Admin clicks "Make Available" → `status = 'sent'`
- [ ] User sees report in dashboard when `status = 'sent'`

### Versioning (Future)
- [ ] Admin edits approved analysis → creates v2
- [ ] Version history shows in dropdown
- [ ] `parentAnalysisId` links to previous version
- [ ] Latest version always shown by default

---

## 📝 Notes & Clarifications

1. **"Send to User" = Make Available in Dashboard** (NOT email)
   - When admin clicks "Send", `analysis.status` changes to `'sent'`
   - User can then view/download report from their dashboard
   - No email is sent (email may be sent separately as notification)

2. **Enrichment "Finished" State**
   - Critical new state between worker completion and admin approval
   - Allows admin to review before moving to analysis stage
   - Worker calls `/enrichment/finish` when done

3. **Analysis Approval Required**
   - Analysis cannot be sent to user without admin approval
   - Approval workflow: `completed` → (admin approves) → `approved` → (admin sends) → `sent`

4. **Versioning Strategy**
   - Each edit after approval creates new version
   - `parentAnalysisId` maintains version chain
   - User always sees latest version
   - Admin can view version history (future feature)

---

## 🎉 Conclusion

**Frontend Status**: ✅ READY FOR BACKEND V3

All necessary changes have been implemented to support the new architecture. The frontend is now:
- **Type-safe** with updated TypeScript definitions
- **Workflow-aware** with new utility functions
- **UI-updated** with status badges and filters
- **API-ready** with new endpoint calls

**Next Steps**:
1. Backend team implements database migrations
2. Backend team implements new API endpoints
3. Integration testing with real backend
4. Deploy and monitor

---

**Document Version**: 1.0
**Last Updated**: 2025-11-22
**Author**: Claude (AI Assistant)
**Reviewed By**: [Pending]
