# WorkflowProgress Component - API Contract Alignment

## Summary
Fixed the `WorkflowProgress.tsx` component to align with the new API contract by removing the non-existent 'failed' status and using the `errorMessage` field for error handling.

## Changes Made

### 1. Added Error Message Props
**File**: `app/(dashboard)/_components/WorkflowProgress.tsx`

Added new props to accept error messages:
```typescript
interface WorkflowProgressProps {
    enrichmentStatus?: EnrichmentStatus;
    analysisStatus?: AnalysisStatus;
    enrichmentError?: string;      // NEW
    analysisError?: string;         // NEW
    isAdmin?: boolean;
    onRetryEnrichment?: () => void;
    onRetryAnalysis?: () => void;
}
```

### 2. Updated Step Definitions
Added `errorMessage` field to each step object:
```typescript
const steps = [
    {
        id: 'enrichment',
        status: enrichmentStatus,
        errorMessage: enrichmentError,  // NEW
        // ...
    },
    {
        id: 'analysis',
        status: analysisStatus,
        errorMessage: analysisError,    // NEW
        // ...
    },
    // ...
];
```

### 3. Fixed Status Logic
**Before** (WRONG):
```typescript
const getStepState = (step) => {
    if (status === 'failed') {  // ❌ 'failed' doesn't exist in API
        return { color: 'red', icon: AlertCircle, text: 'Erro' };
    }
    // ...
};
```

**After** (CORRECT):
```typescript
const getStepState = (step) => {
    const hasError = !!step.errorMessage;

    // Error state takes priority (when errorMessage exists)
    if (hasError) {  // ✅ Check errorMessage field instead
        return { color: 'red', icon: AlertCircle, text: 'Erro' };
    }

    // Valid API statuses only: pending, completed, approved, sent
    if (status === 'completed' || status === 'approved' || status === 'sent') {
        return { color: 'green', icon: CheckCircle, text: 'Concluído' };
    }
    if (status === 'pending') {
        return { color: 'blue', icon: Loader2, text: 'Processando', animate: true };
    }

    return { color: 'gray', icon: Clock, text: 'Aguardando' };
};
```

## API Contract Compliance

### Valid Status Values
- **Enrichment**: `'pending'` → `'completed'` → `'approved'`
- **Analysis**: `'pending'` → `'completed'` → `'approved'` → `'sent'`

### Error Handling
- ❌ **NO** 'failed' status exists
- ✅ **YES** - errors are tracked via `errorMessage?: string` field
- When `errorMessage` is present, the component shows error state regardless of status

### Edit Rules
- Edit is ONLY allowed when `status === 'completed'`
- After approval, status moves to `'approved'` (enrichment) or `'approved'` → `'sent'` (analysis)

## Parent Component Requirements

Any component using `WorkflowProgress` should now pass the error messages:

```tsx
<WorkflowProgress
    enrichmentStatus={enrichment?.status}
    analysisStatus={analysis?.status}
    enrichmentError={enrichment?.errorMessage}  // NEW - from API
    analysisError={analysis?.errorMessage}      // NEW - from API
    isAdmin={isAdmin}
    onRetryEnrichment={handleRetryEnrichment}
    onRetryAnalysis={handleRetryAnalysis}
/>
```

## Visual Behavior

### Error State (Priority 1)
- Shows red badge with "Erro" text
- Displays AlertCircle icon in red
- Shows "Tentar Novamente" button for admins
- Triggered when `errorMessage` field exists

### Success State
- Shows green badge with "Concluído" text
- Displays CheckCircle icon in green
- Triggered by statuses: `completed`, `approved`, `sent`

### Processing State
- Shows blue badge with "Processando" text
- Displays animated Loader2 icon in blue
- Triggered by status: `pending`

### Waiting State (Default)
- Shows gray badge with "Aguardando" text
- Displays Clock icon in gray
- Triggered when no status is set

## Testing
- ✅ TypeScript compilation successful
- ✅ No type errors in Next.js build
- ✅ All imports resolved correctly
- ✅ Component maintains visual design integrity

## Migration Notes for Parent Components

1. Update all `WorkflowProgress` usage to include error props
2. Extract `errorMessage` from API responses
3. Remove any references to 'failed' status
4. Ensure error handling uses `errorMessage` field

---

**Date**: 2025-11-24
**File**: `C:\Users\pradord\Documents\Projects\imensiah_new\frontend\app\(dashboard)\_components\WorkflowProgress.tsx`
