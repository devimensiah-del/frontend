/**
 * Wizard Sidebar Component
 * Shows step navigation with status indicators
 */

import { Check, Circle, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { WizardStepSummary, FrameworkStep } from '@/lib/types'

interface WizardSidebarProps {
  previousSteps: WizardStepSummary[]
  currentFramework: FrameworkStep | null
  totalSteps: number
}

const FRAMEWORK_NAMES: Record<number, string> = {
  0: 'Refinamento do Desafio',
  1: 'PESTEL',
  2: 'Porter 5 Forças',
  3: 'Benchmarking',
  4: 'SWOT',
  5: 'TAM-SAM-SOM',
  6: 'Blue Ocean',
  7: 'Growth Loops',
  8: 'Cenários',
  9: 'Matriz de Decisão',
  10: 'Plano 90 Dias',
  11: 'BSC',
}

export function WizardSidebar({
  previousSteps,
  currentFramework,
  totalSteps,
}: WizardSidebarProps) {
  const currentStep = currentFramework?.step ?? 0

  return (
    <div className="space-y-1">
      <h3 className="mb-4 font-semibold text-sm text-muted-foreground">
        Etapas da Análise
      </h3>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isCompleted = previousSteps.some(s => s.step === index && s.status === 'approved')
        const isCurrent = index === currentStep
        const isPending = !isCompleted && !isCurrent
        const frameworkName = FRAMEWORK_NAMES[index] || `Etapa ${index + 1}`

        return (
          <div
            key={index}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
              isCurrent && 'bg-primary/10 font-medium',
              isCompleted && 'text-muted-foreground',
              isPending && 'text-muted-foreground/50'
            )}
          >
            <div className="flex-shrink-0">
              {isCompleted && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3 w-3" />
                </div>
              )}
              {isCurrent && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary">
                  <ArrowRight className="h-3 w-3 text-primary" />
                </div>
              )}
              {isPending && (
                <div className="flex h-5 w-5 items-center justify-center">
                  <Circle className="h-3 w-3 text-muted-foreground/30" />
                </div>
              )}
            </div>
            <span className={cn(isCurrent && 'font-semibold')}>{frameworkName}</span>
          </div>
        )
      })}
    </div>
  )
}
