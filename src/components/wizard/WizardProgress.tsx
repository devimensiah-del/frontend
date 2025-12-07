/**
 * Wizard Progress Bar Component
 * Shows current step and overall progress
 */

import { Progress } from '@/components/ui/progress'

interface WizardProgressProps {
  currentStep: number
  totalSteps: number
  frameworkName: string
}

export function WizardProgress({
  currentStep,
  totalSteps,
  frameworkName,
}: WizardProgressProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-muted-foreground">
          Etapa {currentStep + 1} de {totalSteps}
        </span>
        <span className="font-semibold">{frameworkName}</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  )
}
