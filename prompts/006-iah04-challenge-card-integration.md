<objective>
Modify the ChallengeCard component to add step-by-step analysis buttons and enhancements.

This is the final phase of IAH-04 - integrating the new step-by-step flow into the existing admin company page.
</objective>

<context>
Project: IMENSIAH frontend_v2 - Next.js 15, React 18, TypeScript
Dependencies: All previous phases must be complete

Read this file carefully:
- @src/app/(admin)/admin/companies/[id]/page.tsx - Contains ChallengeCard component to modify
</context>

<requirements>
## Modify ChallengeCard in companies/[id]/page.tsx

### 1. Add Imports

Add these imports at the top:
```typescript
import { useStartAnalysisBySteps } from '@/lib/hooks/use-analysis-by-steps'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
```

### 2. Add Hook in ChallengeCard

Inside ChallengeCard component, add:
```typescript
const startStepByStep = useStartAnalysisBySteps()
const router = useRouter() // if not already imported
```

### 3. Add Start Step-by-Step Handler

```typescript
const handleStartStepByStep = () => {
  startStepByStep.mutate(challenge.id, {
    onSuccess: (data) => {
      router.push(`/admin/analysis-by-steps/${data.analysis_id}`)
    },
  })
}
```

### 4. Update Button Section

Find the existing button logic in ChallengeCard and update to show BOTH modes:

```typescript
{/* Action Buttons */}
<div className="flex flex-wrap items-center gap-2 mt-4">
  {/* Existing batch analysis button - keep as-is */}
  {!analysis && (
    <Button
      onClick={onAnalyze}
      disabled={isAnalyzing}
      size="sm"
    >
      {isAnalyzing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analisando...
        </>
      ) : (
        'Analisar (Lote)'
      )}
    </Button>
  )}

  {/* NEW: Step-by-step button */}
  {!analysis && (
    <Button
      variant="outline"
      onClick={handleStartStepByStep}
      disabled={startStepByStep.isPending || isAnalyzing}
      size="sm"
    >
      {startStepByStep.isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Iniciando...
        </>
      ) : (
        'Etapa por Etapa'
      )}
    </Button>
  )}

  {/* Continue step-by-step if in progress */}
  {analysis?.wizard_mode && analysis.status !== 'completed' && (
    <Link href={`/admin/analysis-by-steps/${analysis.id}`}>
      <Button variant="secondary" size="sm">
        Continuar Etapa
      </Button>
    </Link>
  )}

  {/* View report when completed */}
  {analysis?.status === 'completed' && (
    <Link href={`/report/${analysis.id}`} target="_blank">
      <Button variant="outline" size="sm">
        <FileText className="mr-2 h-4 w-4" />
        Ver Relatório
      </Button>
    </Link>
  )}
</div>
```

### 5. Add Created Date Display

Add after the challenge type badge:

```typescript
{/* Created date */}
<span className="text-xs text-gray-500">
  {format(new Date(challenge.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
</span>
```

### 6. Add Expandable Challenge Text

Replace the challenge description display with expandable version:

```typescript
function ExpandableText({ text, maxLength = 200 }: { text: string; maxLength?: number }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const shouldTruncate = text.length > maxLength

  if (!shouldTruncate) {
    return <p className="text-sm text-gray-600">{text}</p>
  }

  return (
    <div>
      <p className="text-sm text-gray-600">
        {isExpanded ? text : `${text.slice(0, maxLength)}...`}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-sm text-blue-600 hover:underline mt-1"
      >
        {isExpanded ? 'ver menos' : 'ver mais'}
      </button>
    </div>
  )
}

// In ChallengeCard, replace:
// <p className="text-sm text-gray-600">{challenge.business_challenge}</p>
// With:
<ExpandableText text={challenge.business_challenge} />
```

### 7. Add wizard_mode to Analysis Type (if needed)

Check if `wizard_mode` exists in the Analysis type. If not, add to domain.ts:

```typescript
export interface Analysis {
  // ... existing fields
  wizard_mode?: boolean // true if created via step-by-step flow
}
```

### 8. Handle useRouter Import

Make sure useRouter is imported:
```typescript
import { useRouter } from 'next/navigation'
```

And used inside ChallengeCard:
```typescript
const router = useRouter()
```
</requirements>

<verification>
After implementation:
1. No TypeScript errors: `npm run type-check`
2. Challenge cards show created_at date
3. Challenge text truncates at 200 chars with "ver mais"
4. Both "Analisar (Lote)" and "Etapa por Etapa" buttons appear for new challenges
5. "Etapa por Etapa" navigates to /admin/analysis-by-steps/[id]
6. "Continuar Etapa" appears for in-progress step-by-step analyses
7. "Ver Relatório" appears for completed analyses
</verification>

<success_criteria>
- ChallengeCard modified with new buttons
- created_at displayed with Portuguese format
- Challenge text is expandable
- Step-by-step flow starts correctly
- Navigation to step-by-step page works
- No regressions to existing batch analysis flow
</success_criteria>
