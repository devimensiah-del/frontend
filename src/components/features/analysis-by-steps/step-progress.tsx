'use client'

import type { AnalysisStep } from '@/lib/types'
import { StepNavigationPills } from './step-navigation-pills'

interface StepProgressProps {
  steps: AnalysisStep[]
  selectedStep: number
  currentStep: number
  onSelect: (stepNumber: number) => void
  disabled: boolean
}

export function StepProgress({ steps, selectedStep, currentStep, onSelect, disabled }: StepProgressProps) {
  return (
    <StepNavigationPills
      steps={steps}
      selectedStep={selectedStep}
      currentStep={currentStep}
      onSelect={onSelect}
      disabled={disabled}
    />
  )
}
