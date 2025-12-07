'use client'

import type { PESTELAnalysis } from '@/lib/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PESTELViewProps {
  data: PESTELAnalysis
}

const categories = [
  { key: 'political', label: 'Político', color: 'bg-red-500' },
  { key: 'economic', label: 'Econômico', color: 'bg-blue-500' },
  { key: 'social', label: 'Social', color: 'bg-green-500' },
  { key: 'technological', label: 'Tecnológico', color: 'bg-purple-500' },
  { key: 'environmental', label: 'Ambiental', color: 'bg-teal-500' },
  { key: 'legal', label: 'Legal', color: 'bg-orange-500' },
] as const

export function PESTELView({ data }: PESTELViewProps) {
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

      {/* Category Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        {categories.map((category) => {
          const items = data[category.key as keyof Omit<PESTELAnalysis, 'summary'>] as string[]
          if (!items || items.length === 0) return null

          return (
            <Card key={category.key}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className={`w-1 h-6 ${category.color} rounded-full`} />
                  <CardTitle className="text-lg">{category.label}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="inline-block w-1.5 h-1.5 bg-navy-900 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-text-secondary flex-1">
                        {item}
                      </span>
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
