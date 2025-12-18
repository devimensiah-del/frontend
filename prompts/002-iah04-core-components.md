<objective>
Create the core UI components for the IAH-04 step-by-step analysis wizard: progress indicator, actions bar, guidance text, visibility toggle, and previous steps accordion.

This is Phase 2 of IAH-04 - building the reusable components that the main page will compose together.
</objective>

<context>
Project: IMENSIAH frontend_v2 - Next.js 15, React 18, TypeScript, Tailwind CSS, Radix UI
Dependencies: Phase 1 must be complete (types, service, hooks exist)

Read these files to understand existing patterns:
- @src/lib/types/domain.ts - Step types (AnalysisStep, FrameworkMeta, StepStatus)
- @src/components/ui/progress.tsx - Radix Progress component
- @src/components/ui/accordion.tsx - Radix Accordion component
- @src/components/ui/checkbox.tsx - Radix Checkbox component
- @src/components/ui/button.tsx - Button component
</context>

<requirements>
## Create Component Directory Structure

Create `src/components/features/analysis-by-steps/` with these files:

## 1. step-progress.tsx

Shows "Etapa X de 14 - Framework Name" with progress bar:

```typescript
'use client'

import { Progress } from '@/components/ui/progress'
import type { FrameworkMeta } from '@/lib/types'

// Framework order for icons (optional enhancement)
const FRAMEWORK_ICONS: Record<string, string> = {
  challenge_refinement: '🎯',
  pestel: '🌍',
  porter: '⚔️',
  benchmarking: '📊',
  swot: '📋',
  swotcross: '✖️',
  tam_sam_som: '📈',
  blue_ocean: '🌊',
  growth_hacking: '🚀',
  scenarios: '🔮',
  decision_matrix: '⚖️',
  okrs: '🎯',
  bsc: '📊',
  synthesis: '📝',
}

interface StepProgressProps {
  currentStep: number
  totalSteps: number
  frameworkMeta: FrameworkMeta | null
}

export function StepProgress({ currentStep, totalSteps, frameworkMeta }: StepProgressProps) {
  const progressPercent = ((currentStep + 1) / totalSteps) * 100
  const icon = frameworkMeta ? FRAMEWORK_ICONS[frameworkMeta.code] || '📄' : '📄'

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {icon} Etapa {currentStep + 1} de {totalSteps}
          {frameworkMeta && (
            <span className="text-gray-600"> — {frameworkMeta.name}</span>
          )}
        </h2>
        <span className="text-sm text-gray-500">
          {Math.round(progressPercent)}% concluído
        </span>
      </div>
      <Progress value={progressPercent} className="h-2" />
    </div>
  )
}
```

## 2. guidance-text.tsx

Read-only info box with reflection prompt:

```typescript
import { Info } from 'lucide-react'

interface GuidanceTextProps {
  text: string | null | undefined
}

export function GuidanceText({ text }: GuidanceTextProps) {
  if (!text) return null

  return (
    <div className="flex gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
      <Info className="h-5 w-5 shrink-0 text-blue-600 mt-0.5" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-blue-800">Reflexão</p>
        <p className="text-sm text-blue-700 leading-relaxed">{text}</p>
      </div>
    </div>
  )
}
```

## 3. step-visibility-toggle.tsx

Checkbox to show/hide step in final report:

```typescript
'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'

interface StepVisibilityToggleProps {
  visible: boolean
  onChange: (visible: boolean) => void
  disabled?: boolean
}

export function StepVisibilityToggle({ visible, onChange, disabled }: StepVisibilityToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id="step-visibility"
        checked={visible}
        onCheckedChange={(checked) => onChange(checked === true)}
        disabled={disabled}
      />
      <Label
        htmlFor="step-visibility"
        className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer"
      >
        {visible ? (
          <>
            <Eye className="h-4 w-4" />
            Mostrar no relatório
          </>
        ) : (
          <>
            <EyeOff className="h-4 w-4" />
            Oculto do relatório
          </>
        )}
      </Label>
    </div>
  )
}
```

## 4. step-actions.tsx

Generate/Save/Approve buttons with loading states:

```typescript
'use client'

import { Button } from '@/components/ui/button'
import { Loader2, Sparkles, Save, CheckCircle } from 'lucide-react'
import type { StepStatus } from '@/lib/types'

interface StepActionsProps {
  status: StepStatus
  hasContent: boolean
  hasChanges: boolean
  canGenerate: boolean // false if previous step not approved
  onGenerate: () => void
  onSave: () => void
  onApprove: () => void
  isGenerating: boolean
  isSaving: boolean
  isApproving: boolean
}

export function StepActions({
  status,
  hasContent,
  hasChanges,
  canGenerate,
  onGenerate,
  onSave,
  onApprove,
  isGenerating,
  isSaving,
  isApproving,
}: StepActionsProps) {
  const isLoading = isGenerating || isSaving || isApproving
  const isGeneratingStatus = status === 'generating'

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Generate Button */}
      <Button
        variant="outline"
        onClick={onGenerate}
        disabled={!canGenerate || isLoading || isGeneratingStatus}
      >
        {isGenerating || isGeneratingStatus ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Gerando...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Gerar com IA
          </>
        )}
      </Button>

      {/* Save Button */}
      <Button
        variant="outline"
        onClick={onSave}
        disabled={!hasChanges || isLoading}
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Salvar
          </>
        )}
      </Button>

      {/* Approve Button */}
      <Button
        onClick={onApprove}
        disabled={!hasContent || isLoading}
        className="bg-green-600 hover:bg-green-700"
      >
        {isApproving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Aprovando...
          </>
        ) : (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            Aprovar e Continuar
          </>
        )}
      </Button>
    </div>
  )
}
```

## 5. previous-steps.tsx

Collapsible accordion of approved steps:

```typescript
'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { CheckCircle } from 'lucide-react'
import type { AnalysisStep, FrameworkCode } from '@/lib/types'

// Framework names in Portuguese
const FRAMEWORK_NAMES: Record<FrameworkCode, string> = {
  challenge_refinement: 'Refinamento do Desafio',
  pestel: 'Análise PESTEL',
  porter: '5 Forças de Porter',
  benchmarking: 'Benchmarking',
  swot: 'Análise SWOT',
  swotcross: 'SWOT Cruzado',
  tam_sam_som: 'TAM-SAM-SOM',
  blue_ocean: 'Blue Ocean',
  growth_hacking: 'Growth Hacking',
  scenarios: 'Cenários',
  decision_matrix: 'Matriz de Decisão',
  okrs: 'OKRs',
  bsc: 'Balanced Scorecard',
  synthesis: 'Síntese Executiva',
}

interface PreviousStepsProps {
  steps: AnalysisStep[]
}

export function PreviousSteps({ steps }: PreviousStepsProps) {
  if (steps.length === 0) return null

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700">Etapas Anteriores</h3>
      <Accordion type="multiple" className="space-y-2">
        {steps.map((step) => (
          <AccordionItem
            key={step.id}
            value={step.id}
            className="border rounded-lg px-4"
          >
            <AccordionTrigger className="text-sm hover:no-underline">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>
                  {step.step_number}. {FRAMEWORK_NAMES[step.framework_code]}
                </span>
                {step.is_edited && (
                  <span className="text-xs text-gray-500">(editado)</span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <div className="rounded bg-gray-50 p-3">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-auto max-h-60">
                  {step.effective_output || step.human_edited || step.ai_output || 'Sem conteúdo'}
                </pre>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
```

## 6. index.ts (barrel export)

```typescript
export { StepProgress } from './step-progress'
export { GuidanceText } from './guidance-text'
export { StepVisibilityToggle } from './step-visibility-toggle'
export { StepActions } from './step-actions'
export { PreviousSteps } from './previous-steps'
```
</requirements>

<verification>
After implementation, verify:
1. No TypeScript errors: `npm run type-check`
2. All components export correctly from index.ts
3. Components use existing UI primitives (Button, Progress, Accordion, Checkbox)
4. Lucide icons used consistently
5. Tailwind classes follow project patterns
</verification>

<success_criteria>
- 6 files created in src/components/features/analysis-by-steps/
- All components properly typed with TypeScript
- StepProgress shows progress bar and step info
- GuidanceText displays reflection prompt in info box
- StepVisibilityToggle uses Radix Checkbox
- StepActions has proper loading and disabled states
- PreviousSteps uses Radix Accordion
- Barrel export works correctly
</success_criteria>
