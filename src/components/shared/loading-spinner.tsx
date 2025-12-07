import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'default' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'h-4 w-4',
  default: 'h-8 w-8',
  lg: 'h-12 w-12',
}

export function LoadingSpinner({
  message,
  size = 'default',
  className,
}: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Loader2 className={cn('animate-spin text-gold-500', sizeClasses[size])} />
      {message && (
        <p className="text-sm text-text-secondary">{message}</p>
      )}
    </div>
  )
}

export function FullPageLoader({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-surface-paper z-overlay">
      <LoadingSpinner message={message} size="lg" />
    </div>
  )
}
