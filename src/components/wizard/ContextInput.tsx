/**
 * Context Input Component
 * Additional context textarea for guiding AI
 */

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface ContextInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ContextInput({
  value,
  onChange,
  disabled = false,
  placeholder = 'Adicione contexto adicional para orientar a análise...',
}: ContextInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="context" className="text-base">
        Contexto Adicional (Opcional)
      </Label>
      <Textarea
        id="context"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        rows={4}
        className="resize-none"
      />
      <p className="text-xs text-muted-foreground">
        Forneça informações adicionais que possam ajudar a IA a gerar uma análise mais precisa.
      </p>
    </div>
  )
}
