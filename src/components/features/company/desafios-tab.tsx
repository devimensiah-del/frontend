'use client'

import { Loader2, Lock, CheckCircle2, XCircle, Clock, Play, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Company, FrameworkResultWithDetails, FrameworkResultStatus } from '@/lib/types'
import { useRunFramework } from '@/lib/hooks/use-frameworks'
import { EnrichmentContextPanel } from './enrichment-context-panel'
import { EditableChallengeRefinement } from './editors/editable-challenge-refinement'

// =============================================================================
// Types
// =============================================================================

interface DesafiosTabProps {
  companyId: string
  company: Company
  challengeId?: string
  result?: FrameworkResultWithDetails
  editMode: boolean
  pendingChanges: Record<string, unknown>
  onResultChange: (code: string, data: unknown) => void
  onRefetch: () => void
  isAdmin?: boolean
}

// =============================================================================
// Status Badge Component
// =============================================================================

function StatusBadge({ status }: { status?: FrameworkResultStatus }) {
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
          Pendente
        </Badge>
      )
  }
}

// =============================================================================
// Main Component
// =============================================================================

export function DesafiosTab({
  companyId,
  company,
  challengeId,
  result,
  editMode,
  pendingChanges,
  onResultChange,
  onRefetch,
  isAdmin = false,
}: DesafiosTabProps) {
  const runFramework = useRunFramework()

  // Status checks
  const status = result?.result?.status
  const isCompleted = status === 'completed'
  const isProcessing = status === 'processing'
  const isPending = status === 'pending'
  const isFailed = status === 'failed'

  const isRunning = runFramework.isPending

  // Handle running the framework
  const handleRun = () => {
    runFramework.mutate({
      companyId,
      frameworkCode: 'challenge_refinement',
      challengeId,
    })
  }

  // Get current data (pending changes or original)
  const getData = () => {
    if (pendingChanges['challenge_refinement']) {
      return pendingChanges['challenge_refinement'] as Record<string, unknown>
    }
    return result?.result?.result as Record<string, unknown> | undefined
  }

  return (
    <div className="space-y-4">
      {/* Header with Status */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-base font-medium text-navy-900">
            Refinamento do Desafio
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Validação e refinamento do problema de negócio identificado
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Enrichment Context */}
      <EnrichmentContextPanel company={company} frameworkCode="challenge_refinement" />

      {/* Action Buttons */}
      {isProcessing || isPending ? (
        <div className="flex items-center gap-2 p-4 bg-info/10 rounded-lg border border-info/30">
          <Loader2 className="w-4 h-4 text-info animate-spin" />
          <span className="text-sm text-info">
            {isProcessing ? 'Processando refinamento...' : 'Aguardando processamento...'}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button
            variant={isCompleted ? 'outline' : 'architect'}
            size="sm"
            onClick={handleRun}
            disabled={isRunning}
          >
            {isRunning ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : isCompleted ? (
              <RefreshCw className="w-4 h-4 mr-1" />
            ) : (
              <Play className="w-4 h-4 mr-1" />
            )}
            {isCompleted ? 'Refinar Novamente' : 'Iniciar Refinamento'}
          </Button>
        </div>
      )}

      {/* Completed Content */}
      {isCompleted && (
        <EditableChallengeRefinement
          data={getData()}
          editMode={editMode}
          onChange={(data) => onResultChange('challenge_refinement', data)}
        />
      )}

      {/* Failed State */}
      {isFailed && (
        <div className="p-4 bg-error/10 rounded-lg border border-error/30 space-y-3">
          <div className="flex items-center gap-2 text-error">
            <XCircle className="w-5 h-5" />
            <span className="font-medium">Refinamento falhou</span>
          </div>
          {result?.result?.error_message && (
            <p className="text-sm text-muted-foreground">{result.result.error_message}</p>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRun}
            disabled={isRunning}
            className="border-error/30 text-error hover:bg-error/10"
          >
            {isRunning ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-1" />
            )}
            Tentar Novamente
          </Button>
        </div>
      )}
    </div>
  )
}
