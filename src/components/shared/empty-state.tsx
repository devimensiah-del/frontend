import * as React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      {Icon && (
        <div className="mb-4 p-3 bg-surface-paper border border-line">
          <Icon className="h-8 w-8 text-text-tertiary" />
        </div>
      )}
      <h3 className="text-lg font-heading font-medium text-navy-900">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-text-secondary max-w-sm">{description}</p>
      )}
      {action && (
        <Button
          variant="architect"
          size="sm"
          className="mt-6"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}
