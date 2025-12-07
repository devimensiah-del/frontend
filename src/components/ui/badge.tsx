import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider',
  {
    variants: {
      variant: {
        default: 'bg-navy-100 text-navy-900',
        success: 'bg-success-light text-success-dark',
        warning: 'bg-warning-light text-warning-dark',
        error: 'bg-error-light text-error-dark',
        outline: 'border border-line text-text-secondary',
        gold: 'bg-gold-100 text-gold-700 border border-gold-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
