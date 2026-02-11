'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  RefreshCw,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { StaleResultInfo, UpstreamChange } from '@/lib/types'
import { useStaleFrameworks, useAcknowledgeStale } from '@/lib/hooks/use-frameworks'

// =============================================================================
// Upstream Change List
// =============================================================================

interface UpstreamChangesProps {
  changes: UpstreamChange[]
}

function UpstreamChanges({ changes }: UpstreamChangesProps) {
  if (changes.length === 0) return null

  return (
    <div className="mt-2 text-xs text-muted-foreground">
      <span className="font-medium">Alterações upstream:</span>
      <ul className="mt-1 space-y-0.5">
        {changes.map((change, index) => (
          <li key={index} className="flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-warning" />
            <span>{change.framework_name}</span>
            <span className="text-muted-foreground/70">
              ({change.change_type === 'updated' ? 'atualizado' :
                change.change_type === 'rerun' ? 're-executado' : 'nova versão'})
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// =============================================================================
// Stale Item Card
// =============================================================================

interface StaleItemCardProps {
  item: StaleResultInfo
  selected: boolean
  onToggle: () => void
}

function StaleItemCard({ item, selected, onToggle }: StaleItemCardProps) {
  return (
    <div
      className={cn(
        'p-3 border rounded-md cursor-pointer transition-all',
        selected
          ? 'border-warning bg-warning/10'
          : 'border-line hover:border-warning/50',
      )}
      onClick={onToggle}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5',
            selected ? 'bg-warning border-warning text-white' : 'border-muted-foreground/30',
          )}
        >
          {selected && <Check className="w-3 h-3" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{item.framework_name}</span>
            <Badge variant="outline" className="text-xs text-warning border-warning/30 bg-warning/10">
              Desatualizado
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{item.stale_reason}</p>
          <UpstreamChanges changes={item.upstream_changes} />
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Main Stale Warning Banner Component
// =============================================================================

interface StaleWarningBannerProps {
  companyId: string
  challengeId?: string
}

export function StaleWarningBanner({ companyId, challengeId }: StaleWarningBannerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const { data: staleData, isLoading } = useStaleFrameworks(companyId, challengeId)
  const acknowledgeMutation = useAcknowledgeStale()

  // No stale frameworks - don't render
  if (isLoading || !staleData || staleData.total === 0) {
    return null
  }

  const staleResults = staleData.stale_results

  const toggleSelection = (resultId: string) => {
    const newSelection = new Set(selectedIds)
    if (newSelection.has(resultId)) {
      newSelection.delete(resultId)
    } else {
      newSelection.add(resultId)
    }
    setSelectedIds(newSelection)
  }

  const selectAll = () => {
    setSelectedIds(new Set(staleResults.map(r => r.result_id)))
  }

  const deselectAll = () => {
    setSelectedIds(new Set())
  }

  const handleAcknowledge = () => {
    if (selectedIds.size === 0) return
    acknowledgeMutation.mutate({
      companyId,
      request: {
        result_ids: Array.from(selectedIds),
        action: 'acknowledge',
      },
    }, {
      onSuccess: () => setSelectedIds(new Set()),
    })
  }

  const handleRerun = () => {
    if (selectedIds.size === 0) return
    acknowledgeMutation.mutate({
      companyId,
      request: {
        result_ids: Array.from(selectedIds),
        action: 'rerun',
      },
    }, {
      onSuccess: () => setSelectedIds(new Set()),
    })
  }

  const handleRerunCascade = () => {
    if (selectedIds.size === 0) return
    acknowledgeMutation.mutate({
      companyId,
      request: {
        result_ids: Array.from(selectedIds),
        action: 'rerun_cascade',
      },
    }, {
      onSuccess: () => setSelectedIds(new Set()),
    })
  }

  return (
    <div className="bg-warning/10 border border-warning/30 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        className="w-full flex items-center justify-between p-4 text-left"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <div>
            <span className="font-medium text-navy-900">
              {staleData.total} análise{staleData.total > 1 ? 's' : ''} desatualizada{staleData.total > 1 ? 's' : ''}
            </span>
            <p className="text-xs text-muted-foreground mt-0.5">
              Dados upstream foram alterados. Recomendamos atualizar.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-warning border-warning/30">
            {staleData.total}
          </Badge>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Selection controls */}
          <div className="flex items-center justify-between pt-2 border-t border-warning/20">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{selectedIds.size} selecionado(s)</span>
              {selectedIds.size < staleResults.length && (
                <button
                  onClick={selectAll}
                  className="text-accent hover:underline"
                >
                  Selecionar todos
                </button>
              )}
              {selectedIds.size > 0 && (
                <button
                  onClick={deselectAll}
                  className="text-muted-foreground hover:underline"
                >
                  Limpar seleção
                </button>
              )}
            </div>
          </div>

          {/* Stale items list */}
          <div className="space-y-2">
            {staleResults.map((item) => (
              <StaleItemCard
                key={item.result_id}
                item={item}
                selected={selectedIds.has(item.result_id)}
                onToggle={() => toggleSelection(item.result_id)}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-warning/20">
            <Button
              size="sm"
              variant="outline"
              onClick={handleAcknowledge}
              disabled={selectedIds.size === 0 || acknowledgeMutation.isPending}
              className="gap-1.5"
            >
              {acknowledgeMutation.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              Reconhecer
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRerun}
              disabled={selectedIds.size === 0 || acknowledgeMutation.isPending}
              className="gap-1.5"
            >
              {acknowledgeMutation.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              Atualizar
            </Button>
            <Button
              size="sm"
              variant="architect"
              onClick={handleRerunCascade}
              disabled={selectedIds.size === 0 || acknowledgeMutation.isPending}
              className="gap-1.5"
            >
              {acknowledgeMutation.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              Atualizar em Cascata
            </Button>
          </div>

          {/* Info text */}
          <p className="text-xs text-muted-foreground">
            <strong>Reconhecer:</strong> Mantém o resultado atual, ignora o alerta.{' '}
            <strong>Atualizar:</strong> Re-executa apenas os selecionados.{' '}
            <strong>Atualizar em Cascata:</strong> Re-executa os selecionados e todos os dependentes.
          </p>
        </div>
      )}
    </div>
  )
}
