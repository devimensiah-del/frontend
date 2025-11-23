# Workflow Verification Findings
**Date:** 2025-11-23

## Overview
This document analyzes the current implementation of the submission, enrichment, and analysis workflow against the intended design.

---

## Expected Workflow Logic

### 1. Submission Flow
- **Status:** Only `"received"` (never changes)
- **Lifecycle:**
  1. Submission comes in → saved with status `"received"`
  2. Submission status remains `"received"` forever
  3. All workflow state tracked in Enrichment and Analysis entities

### 2. Enrichment Flow
- **Statuses:** `"pending"` → `"finished"` → `"approved"`
- **Lifecycle:**
  1. Enrichment created when submission received → status `"pending"`
  2. Workers process enrichment → status becomes `"finished"`
  3. Admin approves enrichment through UI → status becomes `"approved"`
  4. **NO VERSIONING** for enrichment
  5. Admin can edit enrichment fields through UI

### 3. Analysis Flow
- **Statuses:** `"pending"` → `"completed"` → `"approved"` → `"sent"`
- **Lifecycle:**
  1. Analysis created when enrichment finishes → status `"pending"`
  2. Analysis completes → status `"completed"`
  3. Admin can edit analysis through UI
  4. Admin approves analysis → status `"approved"` + **PDF generation triggered**
  5. Admin sends to user → status `"sent"` + **Made available to user**
  6. **VERSIONING ENABLED**: Admin can create new versions (v1, v2, v3...)
  7. New versions inherit previous version's status until admin changes it

---

## What's Working Correctly ✅

### 1. Type Definitions (lib/types/index.ts)
- ✅ `SubmissionStatus = 'received'` (only one status)
- ✅ `EnrichmentStatus = 'pending' | 'finished' | 'approved'`
- ✅ `AnalysisStatus = 'pending' | 'completed' | 'approved' | 'sent'`
- ✅ Analysis has `version: number` and `parentId?: string` for versioning

### 2. Submission Pages
- ✅ `app/admin/envios/page.tsx`: Shows all submissions with "received" status
- ✅ `app/admin/submissions/[id]/page.tsx`: No confusion about submission status
- ✅ Correctly displays submission data as read-only context

### 3. Analysis Workflow
- ✅ `app/admin/submissions/[id]/_components/ActionToolbar.tsx`:
  - Correct status-based button visibility (lines 96-99)
  - Can approve only when status = "completed"
  - Can send only when status = "approved"
  - Can download PDF when status = "approved" or "sent"
- ✅ **Versioning fully implemented:**
  - "Nova Versão" button (lines 164-172)
  - Version selector dropdown (lines 107-125)
  - Create version dialog (lines 293-323)
  - New version inherits status from previous (line 305)
- ✅ `app/admin/analise/[id]/page.tsx`:
  - Correct status checks for approve/send actions
  - Approval at line 118: checks status = "completed"
  - Send at line 173: checks status = "approved"

---

## Issues Found ❌

### 1. Enrichment List Page - Invalid Statuses
**File:** `app/admin/enriquecimento/page.tsx`

**Issue:** Lines 100-110 reference invalid enrichment statuses:
```typescript
const pending = submissions.filter(
  (s) => s.enrichment?.status === "pending" ||
         s.enrichment?.status === "processing" || // ❌ NOT in EnrichmentStatus
         !s.enrichment
).length;
const rejected = submissions.filter(
  (s) => s.enrichment?.status === "rejected" ||  // ❌ NOT in EnrichmentStatus
         s.enrichment?.status === "failed"        // ❌ NOT in EnrichmentStatus
).length;
```

**Expected:** Only `"pending"`, `"finished"`, `"approved"`

**Fix Required:**
```typescript
const pending = submissions.filter(
  (s) => s.enrichment?.status === "pending" || !s.enrichment
).length;
const finished = submissions.filter(
  (s) => s.enrichment?.status === "finished"
).length;
const approved = submissions.filter(
  (s) => s.enrichment?.status === "approved"
).length;
// Remove 'rejected' entirely
```

---

### 2. Enrichment Status Badges - Invalid Variants
**File:** `app/admin/enriquecimento/page.tsx`

**Issue:** Lines 402-413 define badges for invalid statuses:
```typescript
const variants = {
  pending: { variant: "warning", label: "Pendente" },
  processing: { variant: "primary", label: "Processando" },  // ❌ REMOVE
  finished: { variant: "gold", label: "Pronto" },
  approved: { variant: "success", label: "Aprovado" },
  rejected: { variant: "error", label: "Rejeitado" },        // ❌ REMOVE
  failed: { variant: "error", label: "Falhou" },             // ❌ REMOVE
};
```

**Fix Required:**
```typescript
const variants = {
  pending: { variant: "warning", label: "Pendente" },
  finished: { variant: "gold", label: "Pronto" },
  approved: { variant: "success", label: "Aprovado" },
};
```

---

### 3. Analysis List - Incorrect Submission Status Update
**File:** `app/admin/analise/page.tsx`

**Issue:** Line 54 tries to update submission status to invalid value:
```typescript
await adminApi.updateSubmissionStatus(submissionId, 'generating_report'); // ❌
```

**Problem:**
- Submission only has status `"received"`
- `'generating_report'` is not a valid SubmissionStatus
- This is confusion between submission and analysis workflow

**Fix Required:**
- Remove this status update entirely
- PDF generation should be triggered when **analysis** is approved, not through submission
- Check if `handleGeneratePdf` function should actually update **analysis** status instead

---

### 4. Enrichment Approval Workflow Confusion
**File:** `app/admin/enriquecimento/[id]/page.tsx`

**Issue:** Line 157-163 and comment at line 168:
```typescript
// Then approve (backend will auto-trigger analysis job)
const response = await adminEnrichment.approve(enrichment.id);

toast({
  title: "Enriquecimento aprovado",
  description: "Análise será gerada automaticamente. Aguarde...", // ❌
```

**Expected Workflow According to User:**
1. Enrichment created → status `"pending"`
2. Workers finish → status `"finished"`
3. **Admin approves** → status `"approved"` (just status change)
4. **Analysis should be inserted with status `"pending"`** (created, not triggered by approval)
5. Analysis starts automatically

**Current Confusion:**
- Code suggests analysis is triggered when enrichment is approved
- User wants analysis to be created when enrichment **finishes**, not when admin approves

**Fix Required:**
- Approval should ONLY change enrichment status to "approved"
- Analysis should be created automatically when enrichment status becomes "finished"
- Backend worker should create analysis entity when enrichment completes

---

### 5. Unnecessary "Gerar Análise" Button
**File:** `app/admin/enriquecimento/[id]/_components/EnrichmentActions.tsx`

**Issue:** Lines 81-89 have a "Gerar Análise" button:
```tsx
{/* Generate Analysis */}
<Button
  onClick={onGenerateAnalysis}
  disabled={disabled || isGenerating}
  variant="default"
  className="bg-gold-500 text-white hover:bg-gold-600"
>
  {isGenerating ? "Gerando..." : "Gerar Análise"}
</Button>
```

**Problem:**
- Analysis should be created automatically when enrichment finishes
- Admin approval should just change enrichment status
- This button suggests manual triggering which conflicts with the workflow

**Fix Required:**
- Remove this button entirely
- Analysis creation should be automatic, not manual
- Only keep "Salvar Rascunho" and "Aprovar Enriquecimento" buttons

---

### 6. Missing Analysis Auto-Creation
**Expected:** Analysis should be created automatically when enrichment finishes

**Current Implementation:** Unclear when/how analysis is created

**Fix Required:**
- Backend should create Analysis entity when enrichment status changes to "finished"
- Analysis should start with status "pending"
- Analysis worker processes it → status becomes "completed"

---

## PDF Generation Verification ✅ (Mostly Working)

### Current Implementation:
1. ✅ `app/admin/submissions/[id]/_components/ActionToolbar.tsx`:
   - Line 189-194: "Baixar PDF" button only shown when status = "approved" or "sent"
   - Line 72-74: `onPublishPDF` handler

2. ✅ `app/admin/submissions/[id]/page.tsx`:
   - Line 211-248: `handlePublishPDF` function
   - Line 213: Saves current changes first
   - Line 224: Calls `generatePDF()`
   - Opens PDF in new tab

3. ✅ `app/admin/analise/[id]/page.tsx`:
   - Line 108-150: Approval triggers PDF generation
   - Line 135: Calls `adminAnalysis.approve(analysis.id)`
   - Line 138: Toast says "PDF será gerado automaticamente"

**Expected Trigger:** PDF generation when analysis status changes to "approved" ✅

**Working Correctly!**

---

## Admin Edit Capabilities Verification

### Enrichment Editing:
- ✅ `app/admin/enriquecimento/[id]/page.tsx`:
  - Has `EnrichmentForm` component (line 241-246)
  - Can edit enrichment data (line 98-101)
  - Auto-save functionality (line 74-85)
  - Manual save (line 104-136)

### Analysis Editing:
- ⚠️ `app/admin/analise/[id]/page.tsx`:
  - Line 329-335: Shows raw JSON editor
  - Line 336: Comment says "Editor visual de frameworks será implementado em breve"
  - **NEEDS IMPROVEMENT:** Currently only JSON editing, no visual editor

- ✅ `app/admin/submissions/[id]/page.tsx` (War Room):
  - Has `WarRoomShell` component with full editing capabilities
  - Edit SWOT, PESTEL, Porter's Forces
  - Auto-save (line 128-149)

**Status:** Editing works, but analysis editor needs visual framework editor

---

## Summary of Required Fixes

### High Priority:
1. **Enrichment Page:** Remove invalid statuses ("processing", "rejected", "failed")
2. **Enrichment Approval:** Should only change status to "approved", not trigger analysis
3. **Analysis Creation:** Should be automatic when enrichment finishes
4. **Analysis List:** Remove incorrect submission status update (`generating_report`)
5. **Enrichment Actions:** Remove "Gerar Análise" button

### Medium Priority:
1. **Analysis Editor:** Add visual framework editor (currently only JSON)
2. **Backend Verification:** Ensure analysis is created when enrichment finishes

### Working Correctly:
- ✅ Submission status flow (always "received")
- ✅ Analysis status flow (pending → completed → approved → sent)
- ✅ Analysis versioning (full implementation)
- ✅ PDF generation on approval
- ✅ Enrichment and Analysis editing capabilities

---

## Recommended Implementation Order:

1. Fix enrichment page invalid statuses
2. Remove "Gerar Análise" button from enrichment actions
3. Update enrichment approval to only change status
4. Verify backend creates analysis when enrichment finishes
5. Remove incorrect submission status update in analysis list
6. (Future) Add visual framework editor for analysis

---

## Files That Need Changes:

1. `app/admin/enriquecimento/page.tsx` (lines 100-110, 402-413)
2. `app/admin/enriquecimento/[id]/_components/EnrichmentActions.tsx` (lines 81-89)
3. `app/admin/enriquecimento/[id]/page.tsx` (lines 157-163)
4. `app/admin/analise/page.tsx` (line 54)
5. Backend (verify analysis auto-creation on enrichment finish)
