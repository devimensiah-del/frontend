'use client'

import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoaderProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-10 h-10',
}

export function FullPageLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center min-h-screen', className)}>
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-gold-500" />
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    </div>
  )
}

export function InlineLoader({ className, size = 'md' }: LoaderProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Loader2 className={cn('animate-spin text-gold-500', sizeMap[size])} />
    </div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-surface-card',
        className
      )}
    />
  )
}

export function Shimmer({ className }: { className?: string }) {
  return (
    <div className={cn('relative overflow-hidden bg-surface-card rounded-md', className)}>
      <div
        className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{
          animation: 'shimmer 2s infinite',
        }}
      />
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white border border-line rounded-lg p-6 space-y-4">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white border border-line rounded-lg">
      <div className="border-b border-line p-4">
        <Skeleton className="h-6 w-full" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-b border-line last:border-b-0 p-4">
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  )
}
