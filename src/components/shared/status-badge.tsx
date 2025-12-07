'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { CheckCircle2, Clock, Loader2, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const statusBadgeVariants = cva(
  'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium uppercase tracking-wider',
  {
    variants: {
      status: {
        pending: 'bg-warning-light text-warning-dark',
        processing: 'bg-info-light text-info-dark',
        completed: 'bg-success-light text-success-dark',
        failed: 'bg-error-light text-error-dark',
        approved: 'bg-gold-100 text-gold-700',
        generating: 'bg-info-light text-info-dark',
        generated: 'bg-success-light text-success-dark',
        enriching: 'bg-info-light text-info-dark',
        enriched: 'bg-success-light text-success-dark',
        analyzing: 'bg-warning-light text-warning-dark',
      },
    },
    defaultVariants: {
      status: 'pending',
    },
  }
)

const statusIcons = {
  pending: Clock,
  processing: Loader2,
  completed: CheckCircle2,
  failed: XCircle,
  approved: CheckCircle2,
  generating: Loader2,
  generated: CheckCircle2,
  enriching: Loader2,
  enriched: CheckCircle2,
  analyzing: Loader2,
}

const statusLabels: Record<string, string> = {
  pending: 'Pendente',
  processing: 'Processando',
  completed: 'Concluído',
  failed: 'Falhou',
  approved: 'Aprovado',
  generating: 'Gerando',
  generated: 'Gerado',
  enriching: 'Enriquecendo',
  enriched: 'Enriquecido',
  analyzing: 'Analisando',
}

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  showIcon?: boolean
  label?: string
}

function StatusBadge({
  className,
  status,
  showIcon = true,
  label,
  ...props
}: StatusBadgeProps) {
  const Icon = status ? statusIcons[status] : Clock
  const displayLabel = label || (status ? statusLabels[status] : 'Pendente')
  const isAnimated = status === 'processing' || status === 'generating' || status === 'enriching' || status === 'analyzing'

  return (
    <div className={cn(statusBadgeVariants({ status }), className)} {...props}>
      {showIcon && (
        <Icon className={cn('h-3.5 w-3.5', isAnimated && 'animate-spin')} />
      )}
      {displayLabel}
    </div>
  )
}

export { StatusBadge, statusBadgeVariants }
