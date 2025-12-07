'use client'

import { Loader2, Send, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { useWizardStore } from '@/lib/stores/wizard-store'
import { useRefineStep } from '@/lib/hooks/use-wizard'

interface RefinementInputProps {
  analysisId: string
  onClose: () => void
}

export function RefinementInput({ analysisId, onClose }: RefinementInputProps) {
  const store = useWizardStore()
  const refineStep = useRefineStep()
  const isSubmitting = refineStep.isPending

  const handleSubmit = () => {
    refineStep.mutate(
      {
        analysisId,
        additionalContext: store.humanContext,
      },
      {
        onSuccess: () => onClose(),
      }
    )
  }

  return (
    <div className="border border-gold-500 bg-gold-500/5 rounded-lg p-6 mt-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-navy-900">Refinar Análise</h4>
          <p className="text-sm text-muted-foreground">
            Forneça contexto adicional ou atualize suas respostas para regenerar a análise.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Updated Answers */}
      {store.framework?.questions && store.framework.questions.length > 0 && (
        <div className="space-y-4">
          <Label className="text-gold-700">Atualizar Respostas</Label>
          {store.framework.questions.map((question) => (
            <div key={question.id} className="space-y-1">
              <Label htmlFor={`refine-${question.id}`} className="text-xs">
                {question.question}
              </Label>
              <Input
                id={`refine-${question.id}`}
                value={store.humanAnswers[question.id] || ''}
                onChange={(e) => store.setAnswer(question.id, e.target.value)}
                placeholder="Atualizar resposta..."
              />
            </div>
          ))}
        </div>
      )}

      {/* Context */}
      <div className="space-y-2">
        <Label htmlFor="refine-context">Contexto de Refinamento</Label>
        <Textarea
          id="refine-context"
          value={store.humanContext}
          onChange={(e) => store.setContext(e.target.value)}
          placeholder="O que você gostaria de mudar ou melhorar na análise?"
          className="min-h-[80px]"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting || !store.humanContext}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Refinando...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Regenerar
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
