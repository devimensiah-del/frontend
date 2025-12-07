'use client'

import { useState } from 'react'
import { Copy, RefreshCw, Check, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useGenerateAccessCode } from '@/lib/hooks/use-admin'
import { toast } from 'sonner'

interface AccessCodeManagerProps {
  analysisId: string
  accessCode?: string
  isPublic: boolean
}

export function AccessCodeManager({
  analysisId,
  accessCode: initialCode,
  isPublic,
}: AccessCodeManagerProps) {
  const [copied, setCopied] = useState(false)
  const [accessCode, setAccessCode] = useState(initialCode)
  const generateCode = useGenerateAccessCode()

  const shareableUrl = accessCode
    ? `${window.location.origin}/report/${accessCode}`
    : ''

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Copiado para a área de transferência')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Falha ao copiar')
    }
  }

  const handleGenerate = () => {
    generateCode.mutate(analysisId, {
      onSuccess: (data) => {
        setAccessCode(data.access_code)
      },
    })
  }

  if (!isPublic) {
    return (
      <div className="text-sm text-muted-foreground space-y-2">
        <p>
          O relatório não está público. Ative o acesso público para gerar um código de acesso.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Access Code */}
      <div>
        <label className="text-sm font-medium mb-2 block">Código de Acesso</label>
        <div className="flex gap-2">
          <Input
            value={accessCode || 'Nenhum código gerado'}
            readOnly
            className="font-mono"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => accessCode && handleCopy(accessCode)}
            disabled={!accessCode}
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleGenerate}
            disabled={generateCode.isPending}
          >
            <RefreshCw
              className={`w-4 h-4 ${generateCode.isPending ? 'animate-spin' : ''}`}
            />
          </Button>
        </div>
      </div>

      {/* Shareable URL */}
      {accessCode && (
        <div>
          <label className="text-sm font-medium mb-2 block">Link Compartilhável</label>
          <div className="flex gap-2">
            <Input value={shareableUrl} readOnly className="text-sm" />
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleCopy(shareableUrl)}
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              asChild
            >
              <a href={shareableUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Qualquer pessoa com este link poderá acessar o relatório
          </p>
        </div>
      )}
    </div>
  )
}
