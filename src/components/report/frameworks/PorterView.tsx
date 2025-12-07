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
      {data.overallAttractiveness && (
        <Card>
          <CardHeader>
            <CardTitle>Atratividade Geral do Mercado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary">
              {data.overallAttractiveness}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Forces */}
      {data.forces && data.forces.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.forces.map((force, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-base">{force.force}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-text-secondary">Intensidade:</span>
                  <Badge
                    className={`${intensityColors[force.intensity] || 'bg-gray-500'} text-white`}
                  >
                    {force.intensity}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary">
                  {force.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
