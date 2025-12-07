/**
 * Porter Output Component
 * Force cards showing 7 competitive forces
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { PorterAnalysis } from '@/lib/types'

interface PorterOutputProps {
  data: PorterAnalysis
}

function IntensityBadge({ intensity }: { intensity: string }) {
  const config = {
    'Alta': { color: 'bg-red-100 text-red-800', label: 'Alta' },
    'Média': { color: 'bg-yellow-100 text-yellow-800', label: 'Média' },
    'Baixa': { color: 'bg-green-100 text-green-800', label: 'Baixa' },
    'Moderada': { color: 'bg-yellow-100 text-yellow-800', label: 'Moderada' },
  }[intensity] || { color: 'bg-gray-100 text-gray-800', label: intensity }

  return (
    <Badge className={config.color}>
      {config.label}
    </Badge>
  )
}

export function PorterOutput({ data }: PorterOutputProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Análise de Porter (7 Forças)</h3>
        <p className="text-muted-foreground">{data.summary}</p>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">Atratividade Geral do Mercado</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{data.overallAttractiveness}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.forces.map((force, idx) => (
          <Card key={idx}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base flex-1">{force.force}</CardTitle>
                <IntensityBadge intensity={force.intensity} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{force.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
