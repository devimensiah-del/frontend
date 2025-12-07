'use client'

import { Share2, Download, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface ReportActionsProps {
  accessCode?: string
  pdfUrl?: string
  onShare?: () => void
}

export function ReportActions({ accessCode, pdfUrl }: ReportActionsProps) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = accessCode
    ? `${window.location.origin}/report/${accessCode}`
    : window.location.href

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShareDialogOpen(true)}
          className="gap-2"
        >
          <Share2 className="w-4 h-4" />
          Compartilhar
        </Button>

        {pdfUrl && (
          <Button
            variant="outline"
            size="sm"
            asChild
            className="gap-2"
          >
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
              <Download className="w-4 h-4" />
              Baixar PDF
            </a>
          </Button>
        )}
      </div>

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Compartilhar Relatório</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-text-secondary mb-2 block">
                Link de acesso público
              </label>
              <div className="flex gap-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button onClick={handleCopyUrl} size="sm">
                  {copied ? 'Copiado!' : 'Copiar'}
                </Button>
              </div>
            </div>

            {accessCode && (
              <div className="bg-surface-paper p-4 rounded border border-line">
                <p className="text-sm text-text-secondary mb-2">
                  <strong>Código de acesso:</strong>
                </p>
                <p className="font-mono text-2xl font-bold text-navy-900 tracking-wider">
                  {accessCode}
                </p>
              </div>
            )}

            <p className="text-xs text-text-secondary">
              Qualquer pessoa com este link poderá visualizar o relatório.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
