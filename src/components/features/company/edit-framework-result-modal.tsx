'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useUpdateFrameworkResult } from '@/lib/hooks/use-frameworks'
import type { FrameworkResultWithDetails } from '@/lib/types'

interface EditFrameworkResultModalProps {
  result: FrameworkResultWithDetails | null
  companyId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditFrameworkResultModal({
  result,
  companyId,
  open,
  onOpenChange,
}: EditFrameworkResultModalProps) {
  const [jsonContent, setJsonContent] = useState('')
  const [jsonError, setJsonError] = useState<string | null>(null)
  const updateResult = useUpdateFrameworkResult()

  // Reset content when result changes
  useEffect(() => {
    if (result?.result.result) {
      setJsonContent(JSON.stringify(result.result.result, null, 2))
      setJsonError(null)
    }
  }, [result])

  const validateJson = (value: string): boolean => {
    try {
      JSON.parse(value)
      setJsonError(null)
      return true
    } catch (e) {
      setJsonError('JSON inválido. Verifique a sintaxe.')
      return false
    }
  }

  const handleChange = (value: string) => {
    setJsonContent(value)
    if (value.trim()) {
      validateJson(value)
    } else {
      setJsonError(null)
    }
  }

  const handleSubmit = () => {
    if (!result || !jsonContent.trim()) return

    if (!validateJson(jsonContent)) return

    const parsed = JSON.parse(jsonContent)
    updateResult.mutate(
      {
        companyId,
        resultId: result.result.id,
        result: parsed,
      },
      {
        onSuccess: () => onOpenChange(false),
      }
    )
  }

  if (!result) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Editar Resultado: {result.framework.name}</DialogTitle>
          <DialogDescription>
            Edite o resultado do framework. Certifique-se de manter a estrutura JSON válida.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4 py-4">
          <div className="space-y-2 flex-1 flex flex-col overflow-hidden">
            <Label htmlFor="json-content">Resultado (JSON)</Label>
            <Textarea
              id="json-content"
              value={jsonContent}
              onChange={(e) => handleChange(e.target.value)}
              className="flex-1 font-mono text-sm min-h-[400px] resize-none"
              placeholder="{}"
            />
            {jsonError && (
              <p className="text-xs text-error">{jsonError}</p>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            <p>Framework: {result.framework.code}</p>
            <p>Versão: {result.result.version}</p>
            {result.result.generated_at && (
              <p>Gerado em: {new Date(result.result.generated_at).toLocaleString('pt-BR')}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={updateResult.isPending || !!jsonError || !jsonContent.trim()}
          >
            {updateResult.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Alterações'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
