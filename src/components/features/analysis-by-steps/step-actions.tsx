'use client'

import { Button } from '@/components/ui/button'
import { Loader2, Save, CheckCircle, RefreshCw } from 'lucide-react'

interface StepActionsProps {
  hasChanges: boolean
  hasContent: boolean
  isSaving: boolean
  isApproving: boolean
  isViewingPreviousStep: boolean
  isFailed: boolean
  onRetry?: () => void
  onSave: () => void
  onApprove: () => void
}

export function StepActions({
  hasChanges,
  hasContent,
  isSaving,
  isApproving,
  isViewingPreviousStep,
  isFailed,
  onRetry,
  onSave,
  onApprove,
}: StepActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 bg-white border-t border-line p-4">
      {/* Retry button when failed */}
      {isFailed && !isViewingPreviousStep && onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="default"
          className="border-error text-error hover:bg-error/10"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Tentar Novamente
        </Button>
      )}

      {/* Save - Portuguese */}
      <Button
        onClick={onSave}
        disabled={!hasChanges || isSaving}
        variant="outline"
        size="default"
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Salvar Edições
          </>
        )}
      </Button>

      {/* Approve and Continue - only on frontier, Portuguese */}
      {!isViewingPreviousStep && (
        <Button
          onClick={onApprove}
          disabled={!hasContent || isApproving || isFailed}
          className="bg-green-600 text-white hover:bg-green-700"
          size="default"
        >
          {isApproving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Aprovando...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Aprovar e Continuar
            </>
          )}
        </Button>
      )}
    </div>
  )
}
