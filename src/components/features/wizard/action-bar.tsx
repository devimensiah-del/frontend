'use client'

import { Check, Loader2, RefreshCw, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useWizardStore } from '@/lib/stores/wizard-store'
import { useGenerateStep, useApproveStep } from '@/lib/hooks/use-wizard'

interface ActionBarProps {
  analysisId: string
  status: 'pending' | 'generating' | 'generated' | 'approved' | 'failed'
  onRefineClick: () => void
  showRefine?: boolean
  className?: string
}

export function ActionBar({
  analysisId,
  status,
  onRefineClick,
  showRefine,
  className,
}: ActionBarProps) {
  const store = useWizardStore()
  const generateStep = useGenerateStep()
  const approveStep = useApproveStep()

  const isGenerating = generateStep.isPending
  const isApproving = approveStep.isPending
  const isProcessing = isGenerating || isApproving

  const handleGenerate = () => {
    generateStep.mutate({
      analysisId,
      humanContext: store.humanContext,
      answers: store.humanAnswers,
    })
  }

  const handleApprove = () => {
    approveStep.mutate(analysisId)
  }

  // Don't show actions while refine panel is open
  if (showRefine) return null

  return (
    <div className={cn('flex items-center justify-end gap-3 pt-6 mt-6 border-t border-line', className)}>
      {status === 'pending' && (
        <Button onClick={handleGenerate} disabled={isProcessing}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Gerar Análise
            </>
          )}
        </Button>
      )}

      {(status === 'generated' || status === 'failed') && (
        <>
          <Button variant="outline" onClick={onRefineClick} disabled={isProcessing}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refinar
          </Button>
          <Button onClick={handleApprove} disabled={isProcessing}>
            {isApproving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Aprovando...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Aprovar e Continuar
              </>
            )}
          </Button>
        </>
      )}

      {status === 'generating' && (
        <div className="flex items-center gap-2 text-gold-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Gerando análise...</span>
        </div>
      )}
    </div>
  )
}
