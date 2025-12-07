'use client'

import { useParams, useRouter } from 'next/navigation'
import { useWizardState, useGenerateStep, useApproveStep, useRefineStep } from '@/lib/hooks/use-wizard'
import { WizardProgress } from '@/components/features/wizard/wizard-progress'
import { WizardStepComponent } from '@/components/features/wizard/wizard-step'
import { WizardCompletion } from '@/components/features/wizard/wizard-completion'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'

export default function WizardPage() {
  const { analysisId } = useParams<{ analysisId: string }>()
  const router = useRouter()
  const { data: wizardState, isLoading, error, refetch } = useWizardState(analysisId)

  const generateStep = useGenerateStep()
  const approveStep = useApproveStep()
  const refineStep = useRefineStep()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar wizard. Por favor, tente novamente.
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetch()} className="mt-4">
          Tentar Novamente
        </Button>
      </div>
    )
  }

  if (!wizardState) return null

  // Check if all steps are approved (completed state)
  const allStepsApproved = wizardState.current_step > wizardState.total_steps ||
    (wizardState.step_status === 'approved' && wizardState.current_step === wizardState.total_steps)

  // Completed state
  if (allStepsApproved) {
    return <WizardCompletion analysisId={wizardState.analysis_id} />
  }

  const isGenerating = generateStep.isPending
  const isApproving = approveStep.isPending
  const isRefining = refineStep.isPending

  return (
    <div className="min-h-screen bg-surface-paper">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-line">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          <WizardProgress
            currentStep={wizardState.current_step}
            totalSteps={wizardState.total_steps}
            previousSteps={wizardState.previous_steps}
            currentStepStatus={wizardState.step_status}
          />

          <div className="w-24" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <WizardStepComponent
          currentStep={wizardState.current_step}
          totalSteps={wizardState.total_steps}
          framework={wizardState.framework}
          stepStatus={wizardState.step_status}
          output={wizardState.output ? JSON.parse(JSON.stringify(wizardState.output)) : undefined}
          errorMessage={wizardState.error_message}
          iterationCount={wizardState.iteration_count}
          previousSteps={wizardState.previous_steps}
          isGenerating={isGenerating}
          isApproving={isApproving}
          isRefining={isRefining}
          onGenerate={(context) => generateStep.mutate({ analysisId, humanContext: context })}
          onApprove={() => approveStep.mutate(analysisId)}
          onRefine={(context) => refineStep.mutate({ analysisId, additionalContext: context })}
          onRetry={() => generateStep.mutate({ analysisId })}
        />
      </main>
    </div>
  )
}
