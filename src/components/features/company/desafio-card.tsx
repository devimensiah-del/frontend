'use client'

import {
  TrendingUp,
  Settings,
  Target,
  DollarSign,
  Lightbulb,
  Users,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// =============================================================================
// Types
// =============================================================================

export interface DesafioSuggestion {
  titulo: string
  descricao: string
  categoria: 'crescimento' | 'operacional' | 'mercado' | 'financeiro' | 'inovacao' | 'pessoas'
  urgencia: 'alta' | 'média' | 'baixa'
  impacto_potencial: 'alto' | 'médio' | 'baixo'
  frameworks_relacionados: string[]
  evidencias: string[]
  acoes_iniciais: string[]
}

interface DesafioCardProps {
  desafio: DesafioSuggestion
  index: number
  className?: string
}

// =============================================================================
// Category Configuration
// =============================================================================

const CATEGORIA_CONFIG = {
  crescimento: {
    label: 'Crescimento',
    icon: TrendingUp,
    colorClass: 'text-success border-success/30 bg-success/10',
  },
  operacional: {
    label: 'Operacional',
    icon: Settings,
    colorClass: 'text-info border-info/30 bg-info/10',
  },
  mercado: {
    label: 'Mercado',
    icon: Target,
    colorClass: 'text-accent border-accent/30 bg-accent/10',
  },
  financeiro: {
    label: 'Financeiro',
    icon: DollarSign,
    colorClass: 'text-warning border-warning/30 bg-warning/10',
  },
  inovacao: {
    label: 'Inovação',
    icon: Lightbulb,
    colorClass: 'text-purple-600 border-purple-200 bg-purple-50',
  },
  pessoas: {
    label: 'Pessoas',
    icon: Users,
    colorClass: 'text-pink-600 border-pink-200 bg-pink-50',
  },
} as const

const URGENCIA_CONFIG = {
  alta: { label: 'Urgente', colorClass: 'text-error border-error/30 bg-error/10' },
  média: { label: 'Moderada', colorClass: 'text-warning border-warning/30 bg-warning/10' },
  baixa: { label: 'Baixa', colorClass: 'text-muted-foreground border-muted-foreground/30 bg-muted/30' },
} as const

const IMPACTO_CONFIG = {
  alto: { label: 'Alto Impacto', colorClass: 'text-error border-error/30 bg-error/10' },
  médio: { label: 'Médio Impacto', colorClass: 'text-warning border-warning/30 bg-warning/10' },
  baixo: { label: 'Baixo Impacto', colorClass: 'text-muted-foreground border-muted-foreground/30 bg-muted/30' },
} as const

// =============================================================================
// Main Component
// =============================================================================

export function DesafioCard({ desafio, index, className }: DesafioCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const categoriaConfig = CATEGORIA_CONFIG[desafio.categoria] || CATEGORIA_CONFIG.operacional
  const urgenciaConfig = URGENCIA_CONFIG[desafio.urgencia] || URGENCIA_CONFIG.média
  const impactoConfig = IMPACTO_CONFIG[desafio.impacto_potencial] || IMPACTO_CONFIG.médio

  const CategoryIcon = categoriaConfig.icon

  return (
    <div
      className={cn(
        'bg-white border border-line rounded-lg overflow-hidden transition-shadow hover:shadow-sm',
        className
      )}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Priority Number */}
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-navy-900 text-white flex items-center justify-center text-sm font-semibold">
            {index + 1}
          </div>

          <div className="flex-1 min-w-0">
            {/* Title & Category */}
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-heading text-base font-medium text-navy-900 leading-tight">
                {desafio.titulo}
              </h4>
              <Badge variant="outline" className={cn('flex-shrink-0', categoriaConfig.colorClass)}>
                <CategoryIcon className="w-3 h-3 mr-1" />
                {categoriaConfig.label}
              </Badge>
            </div>

            {/* Urgency & Impact Badges */}
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className={cn('text-xs', urgenciaConfig.colorClass)}>
                <AlertTriangle className="w-3 h-3 mr-1" />
                {urgenciaConfig.label}
              </Badge>
              <Badge variant="outline" className={cn('text-xs', impactoConfig.colorClass)}>
                {impactoConfig.label}
              </Badge>
            </div>

            {/* Description (truncated) */}
            <p className={cn(
              'text-sm text-muted-foreground mt-3',
              !isExpanded && 'line-clamp-2'
            )}>
              {desafio.descricao}
            </p>

            {/* Related Frameworks */}
            {desafio.frameworks_relacionados && desafio.frameworks_relacionados.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {desafio.frameworks_relacionados.map((fw, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 bg-muted/50 text-muted-foreground rounded"
                  >
                    {fw}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Details */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 space-y-4 border-t border-line mt-2 pt-4">
          {/* Evidence */}
          {desafio.evidencias && desafio.evidencias.length > 0 && (
            <div>
              <h5 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                Evidências
              </h5>
              <ul className="space-y-1">
                {desafio.evidencias.map((ev, i) => (
                  <li key={i} className="text-sm text-navy-800 flex items-start gap-2">
                    <span className="text-gold-500 mt-1">•</span>
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Initial Actions */}
          {desafio.acoes_iniciais && desafio.acoes_iniciais.length > 0 && (
            <div>
              <h5 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                Ações Iniciais Sugeridas
              </h5>
              <ul className="space-y-1">
                {desafio.acoes_iniciais.map((acao, i) => (
                  <li key={i} className="text-sm text-navy-800 flex items-start gap-2">
                    <span className="text-success mt-1">{i + 1}.</span>
                    <span>{acao}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Expand/Collapse Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2 text-xs text-muted-foreground hover:text-navy-900 hover:bg-muted/30 transition-colors flex items-center justify-center gap-1 border-t border-line"
      >
        {isExpanded ? (
          <>
            <ChevronUp className="w-3.5 h-3.5" />
            Menos detalhes
          </>
        ) : (
          <>
            <ChevronDown className="w-3.5 h-3.5" />
            Ver detalhes
          </>
        )}
      </button>
    </div>
  )
}
