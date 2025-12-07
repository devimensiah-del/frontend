/**
 * Refine Modal Component
 * Modal for adding refinement context
 */

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface RefineModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (context: string) => void
  isSubmitting?: boolean
}

export function RefineModal({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}: RefineModalProps) {
  const [context, setContext] = useState('')

  const handleSubmit = () => {
    onSubmit(context)
    setContext('') // Reset after submit
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Refinar Análise</DialogTitle>
          <DialogDescription>
            Adicione informações ou orientações adicionais para refinar a análise gerada.
            A IA irá regenerar o framework considerando seu feedback.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="refine-context">
              O que você gostaria de ajustar?
            </Label>
            <Textarea
              id="refine-context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Ex: Focar mais no mercado brasileiro, considerar impacto da inflação, adicionar dados sobre concorrentes específicos..."
              rows={6}
              className="resize-none"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Seja específico sobre o que precisa ser melhorado ou adicionado.
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !context.trim()}
          >
            {isSubmitting ? 'Refinando...' : 'Refinar Análise'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
