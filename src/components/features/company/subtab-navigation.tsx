'use client'

import {
  Loader2,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FrameworkResultStatus } from '@/lib/types'

// =============================================================================
// Types
// =============================================================================

export interface SubtabItem {
  code: string
  name: string
  status?: FrameworkResultStatus
  isStale?: boolean
  isDataOnly?: boolean // For tabs like "Mercado" that are just data display
}

interface SubtabNavigationProps {
  tabs: SubtabItem[]
  activeTab: string
  onTabChange: (code: string) => void
  className?: string
}

// =============================================================================
// Status Indicator
// =============================================================================

function StatusIndicator({ status, isStale, isDataOnly }: {
  status?: FrameworkResultStatus
  isStale?: boolean
  isDataOnly?: boolean
}) {
  // Data-only tabs don't have status indicators
  if (isDataOnly) {
    return null
  }

  if (isStale) {
    return <AlertTriangle className="w-3.5 h-3.5 text-warning" />
  }

  switch (status) {
    case 'completed':
      return <CheckCircle2 className="w-3.5 h-3.5 text-success" />
    case 'processing':
    case 'pending':
      return <Loader2 className="w-3.5 h-3.5 text-info animate-spin" />
    default:
      return <Clock className="w-3.5 h-3.5 text-muted-foreground" />
  }
}

// =============================================================================
// Main Component
// =============================================================================

export function SubtabNavigation({
  tabs,
  activeTab,
  onTabChange,
  className,
}: SubtabNavigationProps) {
  return (
    <div className={cn('flex items-center gap-1 p-1 bg-muted/30 rounded-lg', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.code

        return (
          <button
            key={tab.code}
            onClick={() => onTabChange(tab.code)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all',
              isActive
                ? 'bg-white shadow-sm text-navy-900'
                : 'text-muted-foreground hover:text-navy-900 hover:bg-white/50',
            )}
          >
            <StatusIndicator
              status={tab.status}
              isStale={tab.isStale}
              isDataOnly={tab.isDataOnly}
            />
            <span>{tab.name}</span>
          </button>
        )
      })}
    </div>
  )
}
