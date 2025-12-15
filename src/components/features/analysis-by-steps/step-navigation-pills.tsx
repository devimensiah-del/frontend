'use client'

import type { AnalysisStep } from '@/lib/types'
import { cn } from '@/lib/utils'

interface StepNavigationPillsProps {
  steps: AnalysisStep[]
  selectedStep: number
  currentStep: number
  onSelect: (stepNumber: number) => void
  disabled: boolean
}

const FRAMEWORK_NAMES: Record<string, string> = {
  challenge_refinement: 'DESAFIO',
  pestel: 'PESTEL',
  porter: 'PORTER',
  benchmarking: 'BENCHMARK',
  swot: 'SWOT',
  swotcross: 'SWOT×',
  tam_sam_som: 'TAM-SAM-SOM',
  blue_ocean: 'OCEANO AZUL',
  growth_hacking: 'GROWTH',
  scenarios: 'CENÁRIOS',
  decision_matrix: 'DECISÃO',
  okrs: 'OKRs',
  bsc: 'BSC',
  synthesis: 'SÍNTESE',
}

export function StepNavigationPills({
  steps,
  selectedStep,
  currentStep,
  onSelect,
  disabled,
}: StepNavigationPillsProps) {
  const approvedCount = steps.filter(s => s.status === 'approved').length
  const totalSteps = steps.length

  return (
    <div className="space-y-4">
      {/* Progress Counter */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium uppercase tracking-wide text-navy-900">
          Progresso da Análise
        </h3>
        <span className="text-sm text-muted-foreground">
          {approvedCount}/{totalSteps} concluídas
        </span>
      </div>

      {/* Pills Container */}
      <div className="flex flex-wrap gap-2">
        {steps.map((step) => {
          const isSelected = step.step_number === selectedStep
          const isApproved = step.status === 'approved'
          const isCurrent = step.step_number === currentStep
          const isGenerated = step.status === 'generated'
          const isPending = step.status === 'pending'
          const isClickable = step.step_number <= currentStep && !disabled

          return (
            <button
              key={step.id}
              onClick={() => isClickable && onSelect(step.step_number)}
              disabled={!isClickable}
              className={cn(
                'px-3 py-1.5 text-xs font-medium uppercase tracking-wide transition-all',
                'border rounded flex items-center gap-1.5',
                // Approved state
                isApproved && !isSelected && 'bg-navy-900 text-white border-navy-900',
                // Current/Active state (frontier)
                isCurrent && isSelected && 'bg-white text-gold-600 border-gold-500 ring-2 ring-gold-500',
                // Selected but not current
                isSelected && !isCurrent && 'bg-gold-50 text-gold-700 border-gold-400 ring-2 ring-gold-400',
                // Generated (not approved, not selected)
                isGenerated && !isSelected && 'bg-gold-50 text-navy-900 border-gold-200',
                // Pending
                isPending && 'bg-gray-100 text-muted-foreground border-gray-300',
                // Cursor states
                isClickable ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed opacity-50'
              )}
            >
              <span className="font-semibold">{step.step_number}</span>
              <span className="hidden sm:inline">
                {FRAMEWORK_NAMES[step.framework_code] || step.framework_code}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
