'use client'

import type { SWOTAnalysis } from '@/lib/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Lightbulb, AlertTriangle } from 'lucide-react'

interface SWOTViewProps {
  data: SWOTAnalysis
}

const quadrants = [
  {
    key: 'strengths',
    title: 'Forças',
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  {
    key: 'weaknesses',
    title: 'Fraquezas',
    icon: TrendingDown,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  },
  {
    key: 'opportunities',
    title: 'Oportunidades',
    icon: Lightbulb,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    key: 'threats',
    title: 'Ameaças',
    icon: AlertTriangle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
] as const

const confidenceBadgeColors: Record<string, string> = {
  'Alta': 'bg-green-500',
  'Média': 'bg-yellow-500',
  'Baixa': 'bg-red-500',
  'High': 'bg-green-500',
  'Medium': 'bg-yellow-500',
  'Low': 'bg-red-500',
}

export function SWOTView({ data }: SWOTViewProps) {
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

      {/* SWOT Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {quadrants.map((quadrant) => {
          const items = data[quadrant.key as keyof Omit<SWOTAnalysis, 'summary'>]
          if (!items || items.length === 0) return null

          const Icon = quadrant.icon

          return (
            <Card key={quadrant.key} className={quadrant.borderColor}>
              <CardHeader className={quadrant.bgColor}>
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${quadrant.color}`} />
                  <CardTitle className={quadrant.color}>
                    {quadrant.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-4">
                  {items.map((item, index) => (
                    <li key={index} className="border-b border-line last:border-0 pb-4 last:pb-0">
                      <p className="text-sm text-text-secondary mb-2">
                        {item.content}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <Badge
                          variant="outline"
                          className={`${confidenceBadgeColors[item.confidence] || 'bg-gray-500'} text-white border-0`}
                        >
                          {item.confidence}
                        </Badge>
                        <span className="text-text-secondary">
                          Fonte: {item.source}
                        </span>
                      </div>
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
