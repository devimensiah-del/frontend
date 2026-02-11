'use client'

import { useState } from 'react'
import { Pencil, X, Plus, Trash2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// =============================================================================
// Types
// =============================================================================

interface SWOTCrossStrategy {
  descricao: string
  elementos_swot: string[]
  prioridade: 'alta' | 'média' | 'baixa'
  prazo: 'curto' | 'médio' | 'longo'
  recursos?: string
}

interface SWOTCrossData {
  so_strategies?: SWOTCrossStrategy[] // Strengths + Opportunities (Maxi-Maxi)
  wo_strategies?: SWOTCrossStrategy[] // Weaknesses + Opportunities (Mini-Maxi)
  st_strategies?: SWOTCrossStrategy[] // Strengths + Threats (Maxi-Mini)
  wt_strategies?: SWOTCrossStrategy[] // Weaknesses + Threats (Mini-Mini)
  summary?: string
  changes_summary?: string
}

interface EditableSWOTCrossProps {
  data?: SWOTCrossData
  editMode?: boolean
  onChange?: (data: SWOTCrossData) => void
}

// =============================================================================
// Quadrant Configuration
// =============================================================================

const QUADRANTS = [
  {
    key: 'so_strategies' as const,
    title: 'SO - Maxi-Maxi',
    description: 'Usar FORÇAS para aproveitar OPORTUNIDADES',
    colorClass: 'bg-success/10 border-success/30',
    headerClass: 'bg-success/20 text-success-dark',
    badgeClass: 'text-success border-success/30 bg-success/10',
  },
  {
    key: 'wo_strategies' as const,
    title: 'WO - Mini-Maxi',
    description: 'Superar FRAQUEZAS aproveitando OPORTUNIDADES',
    colorClass: 'bg-info/10 border-info/30',
    headerClass: 'bg-info/20 text-info-dark',
    badgeClass: 'text-info border-info/30 bg-info/10',
  },
  {
    key: 'st_strategies' as const,
    title: 'ST - Maxi-Mini',
    description: 'Usar FORÇAS para minimizar AMEAÇAS',
    colorClass: 'bg-warning/10 border-warning/30',
    headerClass: 'bg-warning/20 text-warning-dark',
    badgeClass: 'text-warning border-warning/30 bg-warning/10',
  },
  {
    key: 'wt_strategies' as const,
    title: 'WT - Mini-Mini',
    description: 'Minimizar FRAQUEZAS e evitar AMEAÇAS',
    colorClass: 'bg-error/10 border-error/30',
    headerClass: 'bg-error/20 text-error-dark',
    badgeClass: 'text-error border-error/30 bg-error/10',
  },
] as const

const PRIORIDADE_OPTIONS = ['alta', 'média', 'baixa'] as const
const PRAZO_OPTIONS = ['curto', 'médio', 'longo'] as const

// =============================================================================
// Strategy Card Component
// =============================================================================

interface StrategyCardProps {
  strategy: SWOTCrossStrategy
  index: number
  quadrantKey: string
  editMode: boolean
  badgeClass: string
  onUpdate: (updated: SWOTCrossStrategy) => void
  onDelete: () => void
}

function StrategyCard({
  strategy,
  index,
  editMode,
  badgeClass,
  onUpdate,
  onDelete,
}: StrategyCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(strategy)

  const handleSave = () => {
    onUpdate(draft)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setDraft(strategy)
    setIsEditing(false)
  }

  if (isEditing && editMode) {
    return (
      <div className="p-3 bg-white border border-line rounded-md space-y-3">
        <Textarea
          value={draft.descricao}
          onChange={(e) => setDraft({ ...draft, descricao: e.target.value })}
          placeholder="Descrição da estratégia..."
          className="text-sm"
          rows={3}
        />

        <div className="flex gap-2">
          <select
            value={draft.prioridade}
            onChange={(e) => setDraft({ ...draft, prioridade: e.target.value as typeof draft.prioridade })}
            className="text-xs px-2 py-1 border border-line rounded"
          >
            {PRIORIDADE_OPTIONS.map((p) => (
              <option key={p} value={p}>Prioridade: {p}</option>
            ))}
          </select>
          <select
            value={draft.prazo}
            onChange={(e) => setDraft({ ...draft, prazo: e.target.value as typeof draft.prazo })}
            className="text-xs px-2 py-1 border border-line rounded"
          >
            {PRAZO_OPTIONS.map((p) => (
              <option key={p} value={p}>Prazo: {p}</option>
            ))}
          </select>
        </div>

        <Input
          value={draft.recursos || ''}
          onChange={(e) => setDraft({ ...draft, recursos: e.target.value })}
          placeholder="Recursos necessários..."
          className="text-sm"
        />

        <div className="flex justify-end gap-2">
          <Button size="sm" variant="ghost" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button size="sm" onClick={handleSave}>
            Salvar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 bg-white border border-line rounded-md group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-navy-900">{strategy.descricao}</p>

          {/* SWOT Elements */}
          {strategy.elementos_swot && strategy.elementos_swot.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {strategy.elementos_swot.map((elem, i) => (
                <span
                  key={i}
                  className="text-xs px-1.5 py-0.5 bg-muted/50 text-muted-foreground rounded"
                >
                  {elem}
                </span>
              ))}
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className={cn('text-xs', badgeClass)}>
              {strategy.prioridade}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Prazo: {strategy.prazo}
            </span>
            {strategy.recursos && (
              <>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground truncate">
                  {strategy.recursos}
                </span>
              </>
            )}
          </div>
        </div>

        {editMode && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 text-error hover:text-error"
              onClick={onDelete}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// Quadrant Component
// =============================================================================

interface QuadrantProps {
  config: typeof QUADRANTS[number]
  strategies: SWOTCrossStrategy[]
  editMode: boolean
  onUpdate: (strategies: SWOTCrossStrategy[]) => void
}

function Quadrant({ config, strategies, editMode, onUpdate }: QuadrantProps) {
  const handleAddStrategy = () => {
    onUpdate([
      ...strategies,
      {
        descricao: '',
        elementos_swot: [],
        prioridade: 'média',
        prazo: 'médio',
      },
    ])
  }

  const handleUpdateStrategy = (index: number, updated: SWOTCrossStrategy) => {
    const newStrategies = [...strategies]
    newStrategies[index] = updated
    onUpdate(newStrategies)
  }

  const handleDeleteStrategy = (index: number) => {
    onUpdate(strategies.filter((_, i) => i !== index))
  }

  return (
    <div className={cn('border rounded-lg overflow-hidden', config.colorClass)}>
      {/* Header */}
      <div className={cn('px-4 py-3', config.headerClass)}>
        <h4 className="font-medium text-sm">{config.title}</h4>
        <p className="text-xs opacity-80 mt-0.5">{config.description}</p>
      </div>

      {/* Strategies */}
      <div className="p-3 space-y-2">
        {strategies.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhuma estratégia definida
          </p>
        ) : (
          strategies.map((strategy, index) => (
            <StrategyCard
              key={index}
              strategy={strategy}
              index={index}
              quadrantKey={config.key}
              editMode={editMode}
              badgeClass={config.badgeClass}
              onUpdate={(updated) => handleUpdateStrategy(index, updated)}
              onDelete={() => handleDeleteStrategy(index)}
            />
          ))
        )}

        {editMode && (
          <Button
            size="sm"
            variant="ghost"
            className="w-full gap-1.5 mt-2"
            onClick={handleAddStrategy}
          >
            <Plus className="w-3.5 h-3.5" />
            Adicionar Estratégia
          </Button>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function EditableSWOTCross({
  data,
  editMode = false,
  onChange,
}: EditableSWOTCrossProps) {
  const handleQuadrantUpdate = (
    key: keyof Pick<SWOTCrossData, 'so_strategies' | 'wo_strategies' | 'st_strategies' | 'wt_strategies'>,
    strategies: SWOTCrossStrategy[]
  ) => {
    if (onChange) {
      onChange({
        ...data,
        [key]: strategies,
      })
    }
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      {data?.summary && (
        <div className="p-4 bg-muted/30 rounded-lg">
          <h4 className="text-sm font-medium text-navy-900 mb-2">Resumo</h4>
          <p className="text-sm text-muted-foreground">{data.summary}</p>
        </div>
      )}

      {/* Changes Summary (for updates) */}
      {data?.changes_summary && (
        <div className="p-4 bg-info/10 border border-info/30 rounded-lg">
          <h4 className="text-sm font-medium text-info mb-2">Alterações</h4>
          <p className="text-sm text-muted-foreground">{data.changes_summary}</p>
        </div>
      )}

      {/* Quadrant Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {QUADRANTS.map((config) => (
          <Quadrant
            key={config.key}
            config={config}
            strategies={data?.[config.key] || []}
            editMode={editMode}
            onUpdate={(strategies) => handleQuadrantUpdate(config.key, strategies)}
          />
        ))}
      </div>
    </div>
  )
}
