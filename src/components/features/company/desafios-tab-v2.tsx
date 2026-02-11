'use client'

import { useState } from 'react'
import {
  Loader2,
  Play,
  RefreshCw,
  Lock,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { DesafioCard, type DesafioSuggestion } from './desafio-card'
import { useFrameworkResults, useExecuteFramework, useFrameworkReadiness } from '@/lib/hooks/use-frameworks'
import type { FrameworkResultStatus } from '@/lib/types'

// =============================================================================
// Types
// =============================================================================

interface DesafiosTabV2Props {
  companyId: string
  challengeId?: string
}

interface DesafiosOutput {
  desafios?: DesafioSuggestion[]
  summary?: string
  changes_summary?: string
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

export function DesafiosTabV2({ companyId, challengeId }: DesafiosTabV2Props) {
  // Fetch framework results
  const { data: frameworkResults, isLoading } = useFrameworkResults(companyId)

  // Find desafios framework result
  const desafiosResult = frameworkResults?.results?.find(r => r.framework.code === 'desafios')
  const status = desafiosResult?.result?.status
  const isStale = desafiosResult?.result?.is_stale
  const staleReason = desafiosResult?.result?.stale_reason
  const version = desafiosResult?.result?.version
  const generatedAt = desafiosResult?.result?.generated_at

  // Get desafios output
  const output = desafiosResult?.result?.result as DesafiosOutput | undefined
  const desafios = output?.desafios ?? []

  // Execution hooks
  const executeFramework = useExecuteFramework()
  const { data: readiness, isLoading: readinessLoading } = useFrameworkReadiness(
    companyId,
    'desafios',
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
      frameworkCode: 'desafios',
      challengeId,
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white border border-line rounded-lg overflow-hidden">
        <div className="p-4 border-b border-line">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-gold-600" />
              </div>
              <div>
                <h3 className="font-heading text-base font-medium text-navy-900">
                  Desafios Sugeridos
                </h3>
                <p className="text-sm text-muted-foreground">
                  Análise inteligente baseada no diagnóstico estratégico
                </p>
              </div>
            </div>
            <StatusBadge status={status} isStale={isStale} />
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
                <p className="font-medium text-warning">Desafios desatualizados</p>
                <p className="text-muted-foreground mt-1">{staleReason}</p>
              </div>
            </div>
          )}

          {/* Processing State */}
          {isProcessing && (
            <div className="flex items-center gap-2 p-3 bg-info/10 border border-info/30 rounded-md">
              <Loader2 className="w-4 h-4 text-info animate-spin" />
              <span className="text-sm text-info">
                {status === 'processing' ? 'Identificando desafios...' : 'Aguardando na fila...'}
              </span>
            </div>
          )}

          {/* Failed State */}
          {isFailed && (
            <div className="flex items-center justify-between p-3 bg-error/10 border border-error/30 rounded-md">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-error" />
                <span className="text-sm text-error">Erro ao identificar desafios</span>
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
                {isCompleted ? 'Atualizar Desafios' : 'Identificar Desafios'}
              </Button>

              {isCompleted && !isStale && (
                <span className="text-xs text-muted-foreground">
                  Clique para regenerar com dados atuais
                </span>
              )}
            </div>
          )}
        </div>

        {/* Version Info */}
        {isCompleted && generatedAt && (
          <div className="px-4 py-2 bg-muted/10 border-t border-line">
            <span className="text-xs text-muted-foreground">
              v{version || 1} • Gerado em {new Date(generatedAt).toLocaleDateString('pt-BR')}
            </span>
          </div>
        )}
      </div>

      {/* Summary */}
      {output?.summary && (
        <div className="p-4 bg-muted/30 border border-line rounded-lg">
          <h4 className="text-sm font-medium text-navy-900 mb-2">Resumo</h4>
          <p className="text-sm text-muted-foreground">{output.summary}</p>
        </div>
      )}

      {/* Changes Summary (when updated) */}
      {output?.changes_summary && (
        <div className="p-4 bg-info/10 border border-info/30 rounded-lg">
          <h4 className="text-sm font-medium text-info mb-2">Alterações</h4>
          <p className="text-sm text-muted-foreground">{output.changes_summary}</p>
        </div>
      )}

      {/* Desafios List */}
      {isCompleted && desafios.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              {desafios.length} Desafios Identificados
            </h4>
          </div>

          <div className="grid gap-4">
            {desafios.map((desafio, index) => (
              <DesafioCard
                key={index}
                desafio={desafio}
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {isCompleted && desafios.length === 0 && (
        <div className="text-center py-12 bg-muted/20 border border-dashed border-line rounded-lg">
          <Lightbulb className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
          <h4 className="font-medium text-navy-900 mb-1">Nenhum desafio identificado</h4>
          <p className="text-sm text-muted-foreground">
            Execute a análise novamente ou verifique os dados do diagnóstico.
          </p>
        </div>
      )}

      {/* Not Started State */}
      {!isCompleted && !isProcessing && !isFailed && canExecute && (
        <div className="text-center py-12 bg-muted/20 border border-dashed border-line rounded-lg">
          <Lightbulb className="w-12 h-12 mx-auto text-gold-400 mb-3" />
          <h4 className="font-medium text-navy-900 mb-1">Pronto para análise</h4>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Com base no diagnóstico estratégico completo, a IA irá identificar os principais
            desafios e oportunidades para o seu negócio.
          </p>
        </div>
      )}
    </div>
  )
}
