'use client'

import { useState } from 'react'
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  RefreshCw,
  AlertTriangle,
  Lock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { FrameworkResultStatus } from '@/lib/types'
import { useExecuteFramework, useFrameworkReadiness } from '@/lib/hooks/use-frameworks'

// =============================================================================
// Types
// =============================================================================

interface FrameworkExecutionPanelProps {
  companyId: string
  frameworkCode: string
  frameworkName: string
  challengeId?: string
  status?: FrameworkResultStatus
  isStale?: boolean
  staleReason?: string
  version?: number
  generatedAt?: string
  children?: React.ReactNode // Editor/display content when completed
  className?: string
}

// =============================================================================
// Status Badge Component
// =============================================================================

function StatusBadge({ status, isStale }: { status?: FrameworkResultStatus; isStale?: boolean }) {
  if (isStale) {
    return (
      <Badge variant="outline" className="text-warning border-warning/30 bg-warning/10">
        <AlertTriangle className="w-3 h-3 mr-1" />
        Desatualizado
      </Badge>
    )
  }

  switch (status) {
    case 'completed':
      return (
        <Badge variant="outline" className="text-success border-success/30 bg-success/10">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Concluído
        </Badge>
      )
    case 'processing':
      return (
        <Badge variant="outline" className="text-info border-info/30 bg-info/10">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Processando
        </Badge>
      )
    case 'pending':
      return (
        <Badge variant="outline" className="text-info border-info/30 bg-info/10">
          <Clock className="w-3 h-3 mr-1" />
          Na fila
        </Badge>
      )
    case 'failed':
      return (
        <Badge variant="outline" className="text-error border-error/30 bg-error/10">
          <XCircle className="w-3 h-3 mr-1" />
          Falhou
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="text-muted-foreground border-muted-foreground/30">
          <Clock className="w-3 h-3 mr-1" />
          Não executado
        </Badge>
      )
  }
}

// =============================================================================
// Main Component
// =============================================================================

export function FrameworkExecutionPanel({
  companyId,
  frameworkCode,
  frameworkName,
  challengeId,
  status,
  isStale,
  staleReason,
  version,
  generatedAt,
  children,
  className,
}: FrameworkExecutionPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const executeFramework = useExecuteFramework()
  const { data: readiness, isLoading: readinessLoading } = useFrameworkReadiness(
    companyId,
    frameworkCode,
    challengeId,
    true
  )

  const isCompleted = status === 'completed'
  const isProcessing = status === 'processing' || status === 'pending'
  const isFailed = status === 'failed'
  const canExecute = readiness?.is_ready ?? false
  const missingDependencies = readiness?.missing_dependencies ?? []

  const handleExecute = () => {
    executeFramework.mutate({
      companyId,
      frameworkCode,
      challengeId,
    })
  }

  return (
    <div className={cn('bg-white border border-line rounded-lg overflow-hidden', className)}>
      {/* Header */}
      <div className="p-4 border-b border-line">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-heading text-base font-medium text-navy-900">
              {frameworkName}
            </h3>
            <StatusBadge status={status} isStale={isStale} />
          </div>

          <div className="flex items-center gap-2">
            {/* Version info */}
            {isCompleted && generatedAt && (
              <span className="text-xs text-muted-foreground">
                v{version || 1} • {new Date(generatedAt).toLocaleDateString('pt-BR')}
              </span>
            )}

            {/* Expand/Collapse for completed results */}
            {isCompleted && children && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 h-7 w-7"
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="p-4 bg-muted/20">
        {/* Dependency Lock Warning */}
        {!canExecute && missingDependencies.length > 0 && !readinessLoading && (
          <div className="flex items-center gap-2 p-3 mb-3 bg-muted/50 border border-line rounded-md">
            <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <div className="text-sm">
              <span className="text-muted-foreground">
                Complete primeiro:{' '}
              </span>
              <span className="font-medium text-navy-900">
                {missingDependencies.join(', ')}
              </span>
            </div>
          </div>
        )}

        {/* Stale Warning */}
        {isStale && staleReason && (
          <div className="flex items-start gap-2 p-3 mb-3 bg-warning/10 border border-warning/30 rounded-md">
            <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-warning">Análise desatualizada</p>
              <p className="text-muted-foreground mt-1">{staleReason}</p>
            </div>
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="flex items-center gap-2 p-3 bg-info/10 border border-info/30 rounded-md">
            <Loader2 className="w-4 h-4 text-info animate-spin" />
            <span className="text-sm text-info">
              {status === 'processing' ? 'Processando análise...' : 'Aguardando na fila...'}
            </span>
          </div>
        )}

        {/* Failed State */}
        {isFailed && (
          <div className="flex items-center justify-between p-3 bg-error/10 border border-error/30 rounded-md">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-error" />
              <span className="text-sm text-error">Erro ao processar análise</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleExecute}
              disabled={executeFramework.isPending || !canExecute}
              className="gap-1.5"
            >
              {executeFramework.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              Tentar novamente
            </Button>
          </div>
        )}

        {/* Action Button - Only show when not processing/failed */}
        {!isProcessing && !isFailed && (
          <div className="flex items-center gap-2">
            <Button
              variant={isCompleted ? 'outline' : 'architect'}
              size="sm"
              onClick={handleExecute}
              disabled={executeFramework.isPending || !canExecute || readinessLoading}
              className="gap-1.5"
            >
              {executeFramework.isPending || readinessLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : isCompleted ? (
                <RefreshCw className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
              {isCompleted ? 'Atualizar' : 'Executar'}
            </Button>

            {isCompleted && !isStale && (
              <span className="text-xs text-muted-foreground">
                Clique para regenerar com dados atuais
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content (Editor/Display) - Collapsible */}
      {isCompleted && children && isExpanded && (
        <div className="p-4 border-t border-line">
          {children}
        </div>
      )}
    </div>
  )
}
