'use client'

import { Button } from '@/components/ui/button'
import { Loader2, Sparkles, Save, CheckCircle } from 'lucide-react'

interface StepActionsProps {
  canGenerate: boolean
  hasChanges: boolean
  hasContent: boolean
  isGenerating: boolean
  isSaving: boolean
  isApproving: boolean
  isViewingPreviousStep: boolean
  onGenerate: () => void
  onSave: () => void
  onApprove: () => void
}

export function StepActions({
  canGenerate,
  hasChanges,
  hasContent,
  isGenerating,
  isSaving,
  isApproving,
  isViewingPreviousStep,
  onGenerate,
  onSave,
  onApprove,
}: StepActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 sticky bottom-0 bg-white border-t border-line p-4 -mx-6 lg:-mx-8">
      {/* Generate with AI - only on frontier */}
      {!isViewingPreviousStep && (
        <Button
          onClick={onGenerate}
          disabled={!canGenerate || isGenerating}
          variant="architect"
          size="default"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Gerar com IA
            </>
          )}
        </Button>
      )}

      {/* Save */}
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
            Salvar
          </>
        )}
      </Button>

      {/* Approve and Continue - only on frontier */}
      {!isViewingPreviousStep && (
        <Button
          onClick={onApprove}
          disabled={!hasContent || isApproving}
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
