/**
 * PESTEL Output Component
 * 6-section grid for political, economic, social, tech, environmental, legal
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { PESTELAnalysis } from '@/lib/types'

interface PESTELOutputProps {
  data: PESTELAnalysis
}

const SECTIONS = [
  { key: 'political', label: 'Político', color: 'bg-red-100 text-red-800' },
  { key: 'economic', label: 'Econômico', color: 'bg-blue-100 text-blue-800' },
  { key: 'social', label: 'Social', color: 'bg-green-100 text-green-800' },
  { key: 'technological', label: 'Tecnológico', color: 'bg-purple-100 text-purple-800' },
  { key: 'environmental', label: 'Ambiental', color: 'bg-emerald-100 text-emerald-800' },
  { key: 'legal', label: 'Legal', color: 'bg-orange-100 text-orange-800' },
] as const

export function PESTELOutput({ data }: PESTELOutputProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Análise PESTEL</h3>
        <p className="text-muted-foreground">{data.summary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTIONS.map((section) => {
          const items = data[section.key as keyof Omit<PESTELAnalysis, 'summary'>] as string[]
          return (
            <Card key={section.key}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Badge className={section.color}>
                    {section.label}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {items?.map((item, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
