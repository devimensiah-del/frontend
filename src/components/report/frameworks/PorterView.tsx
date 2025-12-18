'use client'

import type { PorterAnalysis } from '@/lib/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PorterViewProps {
  data: PorterAnalysis
}

const intensityColors: Record<string, string> = {
  'Alta': 'bg-red-500',
  'Média': 'bg-yellow-500',
  'Baixa': 'bg-green-500',
  'High': 'bg-red-500',
  'Medium': 'bg-yellow-500',
  'Low': 'bg-green-500',
}

// Force configuration for rendering
const FORCES = [
  { key: 'competitive_rivalry', intensityKey: 'competitive_rivalry_intensity', label: 'Rivalidade Competitiva' },
  { key: 'supplier_power', intensityKey: 'supplier_power_intensity', label: 'Poder dos Fornecedores' },
  { key: 'buyer_power', intensityKey: 'buyer_power_intensity', label: 'Poder dos Compradores' },
  { key: 'threat_new_entrants', intensityKey: 'threat_new_entrants_intensity', label: 'Ameaça de Novos Entrantes' },
  { key: 'threat_substitutes', intensityKey: 'threat_substitutes_intensity', label: 'Ameaça de Substitutos' },
  { key: 'power_partnerships_ecosystems', intensityKey: 'power_partnerships_ecosystems_intensity', label: 'Poder de Parcerias e Ecossistemas' },
  { key: 'disruption_ai_data', intensityKey: 'disruption_ai_data_intensity', label: 'Disrupção por IA e Dados' },
] as const

type ForceKey = typeof FORCES[number]['key']
type IntensityKey = typeof FORCES[number]['intensityKey']

export function PorterView({ data }: PorterViewProps) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      {data.summary && (
        <Card className="border-gold-500">
          <CardHeader>
            <CardTitle>Síntese da Análise</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary leading-relaxed whitespace-pre-line">
              {data.summary}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Overall Attractiveness */}
      {data.overall_attractiveness && (
        <Card>
          <CardHeader>
            <CardTitle>Atratividade Geral do Mercado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary">
              {data.overall_attractiveness}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Forces */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {FORCES.map(({ key, intensityKey, label }) => {
          const content = data[key as ForceKey]
          const intensity = data[intensityKey as IntensityKey]

          if (!content) return null

          return (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="text-base">{label}</CardTitle>
                {intensity && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-text-secondary">Intensidade:</span>
                    <Badge
                      className={`${intensityColors[intensity] || 'bg-gray-500'} text-white`}
                    >
                      {intensity}
                    </Badge>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary">
                  {content}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Strategic Implications */}
      {data.strategic_implications && data.strategic_implications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Implicações Estratégicas</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {data.strategic_implications.map((implication, index) => (
                <li key={index} className="text-text-secondary">
                  {implication}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
