'use client'

import * as React from 'react'
import { Check, Circle, Loader2, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { WizardStepSummary } from '@/lib/types'

interface StepNavigatorProps {
  steps: WizardStepSummary[]
  currentStep: number
  totalSteps: number
  status: 'pending' | 'generating' | 'generated' | 'approved' | 'failed'
  className?: string
}

const stepStatusConfig = {
  pending: {
    icon: Circle,
    className: 'text-text-tertiary border-line',
    iconClassName: '',
  },
  current: {
    icon: Play,
    className: 'text-gold-500 border-gold-500 bg-gold-50',
    iconClassName: '',
  },
  generating: {
    icon: Loader2,
    className: 'text-info border-info bg-info-light',
    iconClassName: 'animate-spin',
  },
  generated: {
    icon: Check,
    className: 'text-success border-success bg-success-light',
    iconClassName: '',
  },
  approved: {
    icon: Check,
    className: 'text-white border-success bg-success',
    iconClassName: '',
  },
  failed: {
    icon: Circle,
    className: 'text-error border-error bg-error-light',
    iconClassName: '',
  },
}

const WIZARD_FRAMEWORK_NAMES = [
  'Refinamento do Desafio',
  'PESTEL',
  'Porter 7 Forças',
  'Benchmarking',
  'SWOT',
  'TAM-SAM-SOM',
  'Blue Ocean',
  'Growth Loops',
  'Cenários',
  'Matriz de Decisão',
  'Plano 90 Dias',
  'BSC',
]

export function StepNavigator({
  steps,
  currentStep,
  totalSteps,
  status,
  className,
}: StepNavigatorProps) {
  const progressPercentage = Math.round(
    (steps.filter((s) => s.status === 'approved').length / totalSteps) * 100
  )

  const getStepStatus = (stepIndex: number) => {
    const previousStep = steps.find((s) => s.step === stepIndex)

    if (previousStep?.status === 'approved') return 'approved'
    if (stepIndex === currentStep) {
      if (status === 'generating') return 'generating'
      if (status === 'generated') return 'generated'
      return 'current'
    }
    if (stepIndex < currentStep) return 'approved'
    return 'pending'
  }

  return (
    <div className={cn('p-4', className)}>
      {/* Progress Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs uppercase tracking-widest mb-2">
          <span className="text-text-secondary">Progresso</span>
          <span className="text-gold-500 font-bold">{progressPercentage}%</span>
        </div>
        <div className="h-1 bg-navy-100 overflow-hidden">
          <div
            className="h-full bg-gold-500 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Step List */}
      <nav className="space-y-1">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepIndex = i
          const stepStatus = getStepStatus(stepIndex)
          const config = stepStatusConfig[stepStatus]
          const Icon = config.icon
          const name = WIZARD_FRAMEWORK_NAMES[stepIndex] || `Step ${stepIndex + 1}`

          return (
            <div
              key={stepIndex}
              className={cn(
                'flex items-center gap-3 px-3 py-2 transition-colors',
                stepIndex === currentStep && 'bg-surface-paper'
              )}
            >
              <div
                className={cn(
                  'flex h-6 w-6 items-center justify-center border',
                  config.className
                )}
              >
                <Icon className={cn('h-3.5 w-3.5', config.iconClassName)} />
              </div>
              <span
                className={cn(
                  'text-sm',
                  stepIndex === currentStep
                    ? 'font-medium text-navy-900'
                    : stepStatus === 'approved'
                    ? 'text-text-secondary'
                    : 'text-text-tertiary'
                )}
              >
                {name}
              </span>
            </div>
          )
        })}
      </nav>
    </div>
  )
}
