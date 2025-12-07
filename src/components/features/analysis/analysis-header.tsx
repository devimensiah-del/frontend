import Link from 'next/link'
import { ArrowLeft, Download, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/status-badge'
import type { AnalysisStatus } from '@/lib/types'

interface AnalysisHeaderProps {
  companyName: string
  status: AnalysisStatus
  pdfUrl?: string
  accessCode?: string
  backHref?: string
}

export function AnalysisHeader({
  companyName,
  status,
  pdfUrl,
  accessCode,
  backHref = '/dashboard',
}: AnalysisHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <Link
          href={backHref}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-navy-900 mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Link>
        <h1 className="text-2xl font-semibold text-navy-900">{companyName}</h1>
        <StatusBadge status={status} />
      </div>

      <div className="flex items-center gap-2">
        {pdfUrl && (
          <Button asChild variant="outline">
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
              <Download className="w-4 h-4 mr-2" />
              Baixar PDF
            </a>
          </Button>
        )}
        {accessCode && (
          <Button
            variant="outline"
            onClick={() => {
              const url = `${window.location.origin}/report/${accessCode}`
              navigator.clipboard.writeText(url)
            }}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar
          </Button>
        )}
      </div>
    </div>
  )
}
