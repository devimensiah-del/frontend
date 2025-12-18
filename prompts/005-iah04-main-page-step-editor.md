<objective>
Create the main step-by-step analysis page and step-editor routing component for IAH-04.

This is Phase 5 - the page that composes all components together and the step-editor that routes to framework-specific editors.
</objective>

<context>
Project: IMENSIAH frontend_v2 - Next.js 15, React 18, TypeScript
Dependencies: Phases 1-4 must be complete (types, service, hooks, all components, all editors)

Read these files:
- @src/lib/types/domain.ts - Step types
- @src/lib/hooks/use-analysis-by-steps.ts - React Query hooks
- @src/components/features/analysis-by-steps/index.ts - Core components
- @src/components/features/analysis-by-steps/editors/index.ts - Framework editors
- @src/app/(admin)/admin/companies/[id]/page.tsx - Admin page patterns
</context>

<requirements>
## 1. Create step-editor.tsx (Routes to Framework Editors)

Create `src/components/features/analysis-by-steps/step-editor.tsx`:

```typescript
'use client'

import { useState, useEffect, useCallback } from 'react'
import type { AnalysisStep, FrameworkCode } from '@/lib/types'
import {
  PESTELEditor,
  SWOTEditor,
  PorterEditor,
  BenchmarkingEditor,
  TamSamSomEditor,
  BlueOceanEditor,
  GrowthHackingEditor,
  ScenariosEditor,
  DecisionMatrixEditor,
  OKRsEditor,
  BSCEditor,
  SynthesisEditor,
  ChallengeRefinementEditor,
  SWOTCrossEditor,
} from './editors'

interface StepEditorProps {
  step: AnalysisStep
  onContentChange: (content: string) => void
  disabled?: boolean
}

// Parse JSON string to object safely
function parseContent<T>(content: string | null | undefined): T | null {
  if (!content) return null
  try {
    return JSON.parse(content) as T
  } catch {
    return null
  }
}

// Framework editor mapping
const EDITOR_MAP: Record<FrameworkCode, React.ComponentType<{ data: unknown; onChange: (data: unknown) => void; disabled?: boolean }>> = {
  challenge_refinement: ChallengeRefinementEditor,
  pestel: PESTELEditor,
  porter: PorterEditor,
  benchmarking: BenchmarkingEditor,
  swot: SWOTEditor,
  swotcross: SWOTCrossEditor,
  tam_sam_som: TamSamSomEditor,
  blue_ocean: BlueOceanEditor,
  growth_hacking: GrowthHackingEditor,
  scenarios: ScenariosEditor,
  decision_matrix: DecisionMatrixEditor,
  okrs: OKRsEditor,
  bsc: BSCEditor,
  synthesis: SynthesisEditor,
}

export function StepEditor({ step, onContentChange, disabled }: StepEditorProps) {
  // Use effective output (human_edited if exists, else ai_output)
  const effectiveContent = step.human_edited || step.ai_output || null
  const [data, setData] = useState<unknown>(() => parseContent(effectiveContent))

  // Re-parse when step content changes (e.g., after AI generation)
  useEffect(() => {
    const parsed = parseContent(effectiveContent)
    setData(parsed)
  }, [effectiveContent])

  const handleChange = useCallback((newData: unknown) => {
    setData(newData)
    // Serialize back to JSON string for API
    onContentChange(JSON.stringify(newData, null, 2))
  }, [onContentChange])

  const Editor = EDITOR_MAP[step.framework_code]

  if (!Editor) {
    return (
      <div className="p-4 border rounded-lg bg-yellow-50 text-yellow-800">
        Editor não disponível para: {step.framework_code}
      </div>
    )
  }

  return (
    <div className="border rounded-lg p-4 bg-white">
      <Editor
        data={data}
        onChange={handleChange}
        disabled={disabled}
      />
    </div>
  )
}
```

## 2. Update barrel export

Add to `src/components/features/analysis-by-steps/index.ts`:

```typescript
export { StepEditor } from './step-editor'
```

## 3. Create Main Page

Create `src/app/(admin)/admin/analysis-by-steps/[id]/page.tsx`:

```typescript
'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  StepProgress,
  GuidanceText,
  StepVisibilityToggle,
  StepActions,
  PreviousSteps,
  StepEditor,
} from '@/components/features/analysis-by-steps'
import {
  useStepState,
  useGenerateStep,
  useSaveStepEdit,
  useApproveStep,
  useToggleStepVisibility,
} from '@/lib/hooks/use-analysis-by-steps'

export default function AnalysisByStepsPage() {
  const params = useParams()
  const router = useRouter()
  const analysisId = params.id as string

  // Local state for tracking changes
  const [editedContent, setEditedContent] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  // Queries and mutations
  const { data: state, isLoading, error } = useStepState(analysisId)
  const generateStep = useGenerateStep()
  const saveEdit = useSaveStepEdit()
  const approveStep = useApproveStep()
  const toggleVisibility = useToggleStepVisibility()

  const currentStep = state?.current_step_data
  const previousSteps = state?.previous_steps || []
  const frameworkMeta = state?.framework_meta

  // Handle content changes from editor
  const handleContentChange = useCallback((content: string) => {
    setEditedContent(content)
    setHasChanges(true)
  }, [])

  // Handle generate
  const handleGenerate = useCallback(() => {
    if (!currentStep) return
    generateStep.mutate({
      analysisId,
      stepNumber: currentStep.step_number,
    })
  }, [analysisId, currentStep, generateStep])

  // Handle save
  const handleSave = useCallback(() => {
    if (!currentStep || !editedContent) return
    saveEdit.mutate(
      {
        analysisId,
        stepNumber: currentStep.step_number,
        content: editedContent,
      },
      {
        onSuccess: () => {
          setHasChanges(false)
        },
      }
    )
  }, [analysisId, currentStep, editedContent, saveEdit])

  // Handle approve
  const handleApprove = useCallback(() => {
    if (!currentStep) return
    // Save first if there are changes
    if (hasChanges && editedContent) {
      saveEdit.mutate(
        {
          analysisId,
          stepNumber: currentStep.step_number,
          content: editedContent,
        },
        {
          onSuccess: () => {
            approveStep.mutate(
              { analysisId, stepNumber: currentStep.step_number },
              {
                onSuccess: (data) => {
                  setHasChanges(false)
                  setEditedContent(null)
                  if (data.is_complete) {
                    // Redirect to report when complete
                    router.push(`/admin/companies/${state?.analysis_id}`)
                  }
                },
              }
            )
          },
        }
      )
    } else {
      approveStep.mutate(
        { analysisId, stepNumber: currentStep.step_number },
        {
          onSuccess: (data) => {
            setHasChanges(false)
            setEditedContent(null)
            if (data.is_complete) {
              router.push(`/admin/companies/${state?.analysis_id}`)
            }
          },
        }
      )
    }
  }, [analysisId, currentStep, hasChanges, editedContent, saveEdit, approveStep, router, state])

  // Handle visibility toggle
  const handleVisibilityChange = useCallback((visible: boolean) => {
    if (!currentStep) return
    toggleVisibility.mutate({
      analysisId,
      stepNumber: currentStep.step_number,
      visible,
    })
  }, [analysisId, currentStep, toggleVisibility])

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">Erro ao carregar análise</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
      </div>
    )
  }

  // No current step (shouldn't happen but handle gracefully)
  if (!currentStep) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600 mb-4">Nenhuma etapa disponível</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
      </div>
    )
  }

  const hasContent = !!(currentStep.ai_output || currentStep.human_edited)
  const canGenerate = currentStep.step_number === 0 || previousSteps.every(s => s.status === 'approved')
  const isGenerating = currentStep.status === 'generating' || generateStep.isPending

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <Link href={`/report/${analysisId}`} target="_blank">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" /> Ver Relatório
          </Button>
        </Link>
      </div>

      {/* Progress */}
      <StepProgress
        currentStep={state?.current_step ?? 0}
        totalSteps={state?.total_steps ?? 14}
        frameworkMeta={frameworkMeta}
      />

      {/* Guidance Text */}
      {frameworkMeta && (
        <GuidanceText text={frameworkMeta.guidance_text} />
      )}

      {/* Step Editor */}
      <div className="space-y-3">
        <StepEditor
          step={currentStep}
          onContentChange={handleContentChange}
          disabled={isGenerating}
        />

        {/* Visibility Toggle */}
        <StepVisibilityToggle
          visible={currentStep.visible}
          onChange={handleVisibilityChange}
          disabled={toggleVisibility.isPending}
        />
      </div>

      {/* Actions */}
      <StepActions
        status={currentStep.status}
        hasContent={hasContent}
        hasChanges={hasChanges}
        canGenerate={canGenerate}
        onGenerate={handleGenerate}
        onSave={handleSave}
        onApprove={handleApprove}
        isGenerating={isGenerating}
        isSaving={saveEdit.isPending}
        isApproving={approveStep.isPending}
      />

      {/* Previous Steps */}
      {previousSteps.length > 0 && (
        <PreviousSteps steps={previousSteps} />
      )}
    </div>
  )
}
```
</requirements>

<verification>
After implementation:
1. No TypeScript errors: `npm run type-check`
2. Page accessible at `/admin/analysis-by-steps/[id]`
3. StepEditor routes to correct framework editor
4. All buttons have correct enabled/disabled states
5. Generate → Save → Approve flow works
6. Previous steps display in accordion
7. Report link opens in new tab
</verification>

<success_criteria>
- step-editor.tsx created with framework routing
- Main page created at correct route
- Page composes all components correctly
- Loading and error states handled
- Content changes tracked for save detection
- Approve saves changes first if pending
</success_criteria>
