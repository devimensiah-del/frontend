/**
 * SWOT Output Component
 * 4-quadrant grid with confidence badges
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { SWOTAnalysis, SWOTItem } from '@/lib/types'

interface SWOTOutputProps {
  data: SWOTAnalysis
}

const QUADRANTS = [
  { key: 'strengths', label: 'Forças', color: 'bg-green-50 border-green-200', badgeColor: 'bg-green-100 text-green-800' },
  { key: 'weaknesses', label: 'Fraquezas', color: 'bg-red-50 border-red-200', badgeColor: 'bg-red-100 text-red-800' },
  { key: 'opportunities', label: 'Oportunidades', color: 'bg-blue-50 border-blue-200', badgeColor: 'bg-blue-100 text-blue-800' },
  { key: 'threats', label: 'Ameaças', color: 'bg-orange-50 border-orange-200', badgeColor: 'bg-orange-100 text-orange-800' },
] as const

function ConfidenceBadge({ confidence }: { confidence: string }) {
  const color = {
    Alta: 'bg-green-100 text-green-800',
    Média: 'bg-yellow-100 text-yellow-800',
    Baixa: 'bg-gray-100 text-gray-800',
  }[confidence] || 'bg-gray-100 text-gray-800'

  return <Badge className={`${color} text-xs`}>{confidence}</Badge>
}

export function SWOTOutput({ data }: SWOTOutputProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Análise SWOT</h3>
        <p className="text-muted-foreground">{data.summary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {QUADRANTS.map((quadrant) => {
          const items = data[quadrant.key as keyof Omit<SWOTAnalysis, 'summary'>] as SWOTItem[]
          return (
            <Card key={quadrant.key} className={quadrant.color}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Badge className={quadrant.badgeColor}>
                    {quadrant.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">({items?.length || 0})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {items?.map((item, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-md border space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm flex-1">{item.content}</p>
                        <ConfidenceBadge confidence={item.confidence} />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Fonte: {item.source}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
