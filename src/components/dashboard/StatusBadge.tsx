import { cn } from '@/lib/utils'
import type { EnrichmentStatus, AnalysisStatus } from '@/lib/types'

interface StatusBadgeProps {
  status: EnrichmentStatus | AnalysisStatus | string
  className?: string
}

const statusConfig: Record<string, { label: string; className: string }> = {
  // Enrichment statuses
  pending: { label: 'Pendente', className: 'bg-gray-100 text-gray-700' },
  processing: { label: 'Processando', className: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Concluído', className: 'bg-green-100 text-green-700' },
  failed: { label: 'Falhou', className: 'bg-red-100 text-red-700' },
  // Submission derived statuses
  received: { label: 'Recebido', className: 'bg-gray-100 text-gray-700' },
  enriching: { label: 'Enriquecendo', className: 'bg-blue-100 text-blue-700' },
  enriched: { label: 'Enriquecido', className: 'bg-green-100 text-green-700' },
  analyzing: { label: 'Analisando', className: 'bg-yellow-100 text-yellow-700' },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    className: 'bg-gray-100 text-gray-700'
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
