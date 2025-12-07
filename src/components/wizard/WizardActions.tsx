/**
 * Wizard Actions Component
 * Generate, Approve, and Refine buttons
 */

import { Button } from '@/components/ui/button'
import { Loader2, Sparkles, Check, RefreshCw } from 'lucide-react'

interface WizardActionsProps {
  stepStatus: 'pending' | 'generating' | 'generated' | 'approved' | 'failed'
  onGenerate: () => void
  onApprove: () => void
  onRefine: () => void
  isGenerating?: boolean
  isApproving?: boolean
  isRefining?: boolean
}

export function WizardActions({
  stepStatus,
  onGenerate,
  onApprove,
  onRefine,
  isGenerating = false,
  isApproving = false,
  isRefining = false,
}: WizardActionsProps) {
  // Pending state: Show generate button
  if (stepStatus === 'pending' || stepStatus === 'failed') {
    return (
      <div className="flex justify-end">
        <Button
          onClick={onGenerate}
          disabled={isGenerating}
          size="lg"
          className="min-w-[200px]"
        >
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
      </div>
    )
  }

  // Generating state: Show loading
  if (stepStatus === 'generating') {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">
            Gerando análise... Isso pode levar alguns minutos.
          </p>
        </div>
      </div>
    )
  }

  // Generated state: Show approve and refine buttons
  if (stepStatus === 'generated') {
    return (
      <div className="flex items-center justify-end gap-3">
        <Button
          onClick={onRefine}
          disabled={isRefining}
          variant="outline"
          size="lg"
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
        <Button
          onClick={onApprove}
          disabled={isApproving}
          size="lg"
          className="min-w-[200px]"
        >
          {isApproving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Aprovando...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Aprovar e Avançar
            </>
          )}
        </Button>
      </div>
    )
  }

  // Approved state: Read-only, no actions
  return null
}
