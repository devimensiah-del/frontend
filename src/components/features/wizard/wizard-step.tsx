'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Loader2, Check, RefreshCw, AlertCircle,
  ChevronDown, ChevronUp, Sparkles
} from 'lucide-react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

interface WizardStepSummary {
  step: number
  framework_code: string
  framework_name: string
  status: string
  approved_at?: string
}

interface FrameworkStep {
  step: number
  code: string
  name: string
  description: string
  questions: Array<{
    id: string
    question: string
  }>
}

interface WizardStepProps {
  currentStep: number
  totalSteps: number
  framework: FrameworkStep | null
  stepStatus: string
  output?: Record<string, unknown>
  errorMessage?: string
  iterationCount: number
  previousSteps: WizardStepSummary[]
  isGenerating: boolean
  isApproving: boolean
  isRefining: boolean
  onGenerate: (context?: string) => void
  onApprove: () => void
  onRefine: (context: string) => void
  onRetry: () => void
}

export function WizardStepComponent({
  currentStep,
  totalSteps,
  framework,
  stepStatus,
  output,
  errorMessage,
  iterationCount,
  previousSteps,
  isGenerating,
  isApproving,
  isRefining,
  onGenerate,
  onApprove,
  onRefine,
  onRetry,
}: WizardStepProps) {
  const [refinementContext, setRefinementContext] = useState('')
  const [showPrevious, setShowPrevious] = useState(false)

  const isBusy = isGenerating || isApproving || isRefining
  const isPending = stepStatus === 'pending'
  const isGeneratingState = stepStatus === 'generating'
  const hasOutput = (stepStatus === 'generated' || stepStatus === 'approved') && output
  const hasFailed = stepStatus === 'failed'

  // Convert output to markdown-friendly text
  const outputText = output ? JSON.stringify(output, null, 2) : ''

  return (
    <div className="space-y-6">
      {/* Previous Steps (Collapsible) */}
      {previousSteps.length > 0 && (
        <div>
          <Button
            variant="ghost"
            onClick={() => setShowPrevious(!showPrevious)}
            className="text-text-secondary"
          >
            {showPrevious ? <ChevronUp className="mr-2 h-4 w-4" /> : <ChevronDown className="mr-2 h-4 w-4" />}
            Ver passos anteriores ({previousSteps.length})
          </Button>

          {showPrevious && (
            <div className="mt-4 space-y-4">
              {previousSteps.map((prevStep) => (
                <Card key={prevStep.framework_code} className="bg-gray-50 border-gray-200">
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      {prevStep.step}. {prevStep.framework_name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-3">
                    <p className="text-xs text-text-tertiary">
                      Aprovado em {prevStep.approved_at ? new Date(prevStep.approved_at).toLocaleString('pt-BR') : 'N/A'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Current Step */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-navy-900 text-white text-sm font-bold">
              {currentStep}
            </span>
            {framework?.name || 'Carregando...'}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Framework Description */}
          {framework && (
            <div className="text-text-secondary text-sm">
              {framework.description}
            </div>
          )}

          {/* Pending State */}
          {isPending && (
            <div className="text-center py-8">
              <Sparkles className="mx-auto h-12 w-12 text-gold-500 mb-4" />
              <p className="text-text-secondary mb-6">
                Clique para gerar a análise do framework {framework?.name || 'atual'}.
              </p>
              <Button onClick={() => onGenerate()} disabled={isBusy} size="lg">
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  'Gerar Análise'
                )}
              </Button>
            </div>
          )}

          {/* Generating State */}
          {isGeneratingState && (
            <div className="text-center py-12">
              <Loader2 className="mx-auto h-12 w-12 text-gold-500 animate-spin mb-4" />
              <p className="text-text-secondary">Gerando análise com IA...</p>
              <p className="text-xs text-text-tertiary mt-2">Isso pode levar alguns segundos.</p>
            </div>
          )}

          {/* Failed State */}
          {hasFailed && (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {errorMessage || 'Ocorreu um erro ao gerar a análise.'}
                </AlertDescription>
              </Alert>
              <Button onClick={onRetry} disabled={isBusy}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Tentar Novamente
              </Button>
            </div>
          )}

          {/* Output Review State */}
          {hasOutput && (
            <div className="space-y-6">
              <div className="prose prose-sm max-w-none bg-white border border-line rounded-lg p-6">
                <pre className="whitespace-pre-wrap text-sm">{outputText}</pre>
              </div>

              <div className="space-y-3">
                <Label htmlFor="refinement">Fornecer Contexto Adicional (Opcional)</Label>
                <Textarea
                  id="refinement"
                  value={refinementContext}
                  onChange={(e) => setRefinementContext(e.target.value)}
                  placeholder="Se desejar refinar a análise, descreva o que gostaria de ajustar..."
                  className="min-h-[100px]"
                  disabled={isBusy}
                />
                <p className="text-xs text-text-tertiary">
                  Refinamentos feitos: {iterationCount}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => {
                    if (refinementContext.trim()) {
                      onRefine(refinementContext)
                      setRefinementContext('')
                    }
                  }}
                  variant="outline"
                  disabled={isBusy || !refinementContext.trim()}
                  className="flex-1"
                >
                  {isRefining ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Refinando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refinar
                    </>
                  )}
                </Button>

                <Button onClick={onApprove} disabled={isBusy} className="flex-1">
                  {isApproving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Aprovando...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      {currentStep === totalSteps ? 'Finalizar' : 'Aprovar e Continuar'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
