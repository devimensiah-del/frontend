'use client'

import { ChevronDown, ChevronRight, Info } from 'lucide-react'
import { useState } from 'react'
import type { Company } from '@/lib/types'

// =============================================================================
// Types
// =============================================================================

interface EnrichmentContextPanelProps {
  company: Company
  frameworkCode: string
}

interface ContextField {
  label: string
  value: string | string[] | undefined | null
  type: 'text' | 'list'
}

// =============================================================================
// Context Mapping by Framework
// =============================================================================

function getContextFields(company: Company, frameworkCode: string): ContextField[] {
  switch (frameworkCode) {
    case 'pestel':
      return [
        { label: 'Indústria', value: company.industry, type: 'text' },
        { label: 'Setor', value: company.sector, type: 'text' },
        { label: 'Contexto Regulatório', value: company.regulatory_context, type: 'text' },
        { label: 'Tendências do Setor', value: company.industry_trends, type: 'list' },
        { label: 'Concentração de Mercado', value: company.market_concentration, type: 'text' },
        { label: 'Localização', value: company.headquarters || company.location, type: 'text' },
      ]

    case 'porter':
      return [
        { label: 'Concorrentes', value: company.competitors, type: 'list' },
        { label: 'Detalhes dos Concorrentes', value: company.competitor_details, type: 'list' },
        { label: 'Crescimento do Setor', value: company.industry_growth_rate, type: 'text' },
        { label: 'Posição no Mercado', value: company.market_share_status, type: 'text' },
        { label: 'Modelo de Negócio', value: company.business_model, type: 'text' },
        { label: 'Vantagem Competitiva', value: company.competitive_advantage, type: 'text' },
      ]

    case 'swot':
      return [
        { label: 'Forças (enriquecimento)', value: company.strengths, type: 'list' },
        { label: 'Fraquezas (enriquecimento)', value: company.weaknesses, type: 'list' },
        { label: 'Oportunidades (enriquecimento)', value: company.opportunities, type: 'list' },
        { label: 'Ameaças (enriquecimento)', value: company.threats, type: 'list' },
        { label: 'Diferenciais (USPs)', value: company.unique_selling_points, type: 'list' },
        { label: 'Proposta de Valor', value: company.value_proposition, type: 'text' },
      ]

    case 'challenge_refinement':
      return [
        { label: 'Proposta de Valor', value: company.value_proposition, type: 'text' },
        { label: 'Desafios Estratégicos', value: company.strategic_challenges, type: 'list' },
        { label: 'Notícias Recentes', value: company.recent_news, type: 'list' },
        { label: 'Tendências do Setor', value: company.industry_trends, type: 'list' },
        { label: 'Modelo de Negócio', value: company.business_model, type: 'text' },
      ]

    default:
      return []
  }
}

// =============================================================================
// Main Component
// =============================================================================

export function EnrichmentContextPanel({ company, frameworkCode }: EnrichmentContextPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const contextFields = getContextFields(company, frameworkCode)

  // Filter fields that have values
  const fieldsWithValues = contextFields.filter(field => {
    if (field.type === 'list') {
      return Array.isArray(field.value) && field.value.length > 0
    }
    return field.value && String(field.value).trim() !== ''
  })

  if (fieldsWithValues.length === 0) {
    return null
  }

  return (
    <div className="bg-surface-paper border border-line rounded-lg">
      {/* Header - Collapsible */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-gold-500" />
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Contexto do Enriquecimento
          </span>
          <span className="text-xs text-muted-foreground">
            ({fieldsWithValues.length} {fieldsWithValues.length === 1 ? 'campo' : 'campos'})
          </span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-3 pb-3 space-y-3 border-t border-line pt-3">
          {fieldsWithValues.map((field, index) => (
            <div key={index} className="text-sm">
              <span className="text-xs text-muted-foreground uppercase tracking-wide block mb-1">
                {field.label}
              </span>
              {field.type === 'list' && Array.isArray(field.value) ? (
                <div className="flex flex-wrap gap-1.5">
                  {field.value.map((item, itemIndex) => (
                    <span
                      key={itemIndex}
                      className="px-2 py-0.5 bg-navy-900/5 text-navy-800 text-xs rounded"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-navy-800 text-sm line-clamp-2">
                  {String(field.value)}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
