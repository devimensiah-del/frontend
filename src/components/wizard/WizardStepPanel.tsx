/**
 * Wizard Step Panel Component
 * Main content area showing questions, output, and actions
 */

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Info } from 'lucide-react'
import { ClarifyingQuestions } from './ClarifyingQuestions'
import { ContextInput } from './ContextInput'
import { WizardActions } from './WizardActions'
import { RefineModal } from './RefineModal'
import type { FrameworkStep } from '@/lib/types'

interface WizardStepPanelProps {
  framework: FrameworkStep
  stepStatus: 'pending' | 'generating' | 'generated' | 'approved' | 'failed'
  output?: Record<string, unknown>
  errorMessage?: string
  onGenerate: (params: { human_context?: string; human_answers?: Record<string, string> }) => void
  onApprove: () => void
  onRefine: (context: string) => void
  isGenerating?: boolean
  isApproving?: boolean
  isRefining?: boolean
  iterationCount?: number
}

export function WizardStepPanel({
  framework,
  stepStatus,
  output,
  errorMessage,
  onGenerate,
  onApprove,
  onRefine,
  isGenerating = false,
  isApproving = false,
  isRefining = false,
  iterationCount = 0,
}: WizardStepPanelProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [context, setContext] = useState('')
  const [showRefineModal, setShowRefineModal] = useState(false)

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleGenerate = () => {
    onGenerate({
      human_context: context || undefined,
      human_answers: Object.keys(answers).length > 0 ? answers : undefined,
    })
  }

  const handleRefineSubmit = (refineContext: string) => {
    setShowRefineModal(false)
    onRefine(refineContext)
  }

  const handleRefineClick = () => {
    setShowRefineModal(true)
  }

  const isReadOnly = stepStatus === 'approved' || stepStatus === 'generating'

  return (
    <div className="space-y-6">
      {/* Framework Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{framework.name}</span>
            {iterationCount > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                Iteração {iterationCount + 1}
              </span>
            )}
          </CardTitle>
          <CardDescription>{framework.description}</CardDescription>
        </CardHeader>
      </Card>

      {/* Error Alert */}
      {stepStatus === 'failed' && errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Questions and Context (only if not yet generated) */}
      {(stepStatus === 'pending' || stepStatus === 'failed') && (
        <Card>
          <CardContent className="pt-6 space-y-6">
            <ClarifyingQuestions
              questions={framework.questions}
              answers={answers}
              onChange={handleAnswerChange}
              disabled={isReadOnly}
            />

            <ContextInput
              value={context}
              onChange={setContext}
              disabled={isReadOnly}
            />
          </CardContent>
        </Card>
      )}

      {/* Output Display */}
      {output && stepStatus !== 'pending' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resultado da Análise</CardTitle>
            {stepStatus === 'generated' && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Revise a análise abaixo. Você pode aprovar e avançar ou refinar com mais contexto.
                </AlertDescription>
              </Alert>
            )}
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap break-words text-sm">
                {JSON.stringify(output, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <WizardActions
        stepStatus={stepStatus}
        onGenerate={handleGenerate}
        onApprove={onApprove}
        onRefine={handleRefineClick}
        isGenerating={isGenerating}
        isApproving={isApproving}
        isRefining={isRefining}
      />

      {/* Refine Modal */}
      <RefineModal
        open={showRefineModal}
        onOpenChange={setShowRefineModal}
        onSubmit={handleRefineSubmit}
        isSubmitting={isRefining}
      />
    </div>
  )
}
