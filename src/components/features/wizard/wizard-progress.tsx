'use client'

import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface WizardStep {
  framework_code: string
  framework_name: string
  status: string
  approved_at?: string
}

interface WizardProgressProps {
  currentStep: number
  totalSteps: number
  previousSteps: WizardStep[]
  currentStepStatus: string
}

export function WizardProgress({
  currentStep,
  totalSteps,
  previousSteps,
  currentStepStatus
}: WizardProgressProps) {
  // Build full steps array
  const steps: Array<WizardStep & { stepNumber: number }> = []

  // Add completed/previous steps
  previousSteps.forEach((step, index) => {
    steps.push({ ...step, stepNumber: index + 1 })
  })

  // Add current step
  if (currentStep <= totalSteps) {
    steps.push({
      framework_code: 'current',
      framework_name: 'Current Step',
      status: currentStepStatus,
      stepNumber: currentStep,
    })
  }

  // Fill remaining steps
  for (let i = steps.length + 1; i <= totalSteps; i++) {
    steps.push({
      framework_code: `pending-${i}`,
      framework_name: `Step ${i}`,
      status: 'pending',
      stepNumber: i,
    })
  }

  return (
    <div className="flex flex-col items-center">
      <p className="text-sm font-medium text-text-primary mb-2">
        Passo {currentStep} de {totalSteps}
      </p>

      <div className="flex items-center gap-1">
        <TooltipProvider>
          {steps.map((step) => {
            const stepNum = step.stepNumber
            const isActive = stepNum === currentStep
            const isCompleted = step.status === 'approved'
            const isFailed = step.status === 'failed'
            const isGenerating = step.status === 'generating' || step.status === 'generated'
            const isPending = step.status === 'pending'

            return (
              <Tooltip key={stepNum}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      'w-3 h-3 rounded-full transition-all',
                      isCompleted && 'bg-green-500',
                      isFailed && 'bg-red-500',
                      isGenerating && 'bg-gold-500 animate-pulse',
                      isActive && !isCompleted && !isFailed && !isGenerating && 'bg-navy-700',
                      isPending && !isActive && 'bg-gray-200'
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{step.framework_name}</p>
                  <p className="text-xs text-gray-400">
                    {isCompleted && 'Aprovado'}
                    {isFailed && 'Erro'}
                    {isGenerating && 'Gerando...'}
                    {isActive && !isCompleted && !isFailed && !isGenerating && 'Atual'}
                    {isPending && !isActive && 'Pendente'}
                  </p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </TooltipProvider>
      </div>
    </div>
  )
}
