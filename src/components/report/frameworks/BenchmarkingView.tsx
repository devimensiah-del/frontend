'use client'

import type { BenchmarkingAnalysis } from '@/lib/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Users, TrendingDown, Lightbulb } from 'lucide-react'

interface BenchmarkingViewProps {
  data: BenchmarkingAnalysis
}

export function BenchmarkingView({ data }: BenchmarkingViewProps) {
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

      {/* Competitors Analyzed */}
      {data.competitorsAnalyzed && data.competitorsAnalyzed.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-navy-900" />
              <CardTitle>Concorrentes Analisados</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.competitorsAnalyzed.map((competitor, index) => (
                <div
                  key={index}
                  className="px-4 py-2 bg-navy-900/5 border border-line rounded text-sm font-medium"
                >
                  {competitor}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Gaps */}
      {data.performanceGaps && data.performanceGaps.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-500" />
              <CardTitle>Gaps de Performance</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {data.performanceGaps.map((gap, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-red-500/10 text-red-600 text-xs font-medium rounded-full flex-shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-sm text-text-secondary flex-1">{gap}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Best Practices */}
      {data.bestPractices && data.bestPractices.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-gold-500" />
              <CardTitle>Melhores Práticas Identificadas</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {data.bestPractices.map((practice, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-gold-500/10 text-gold-600 text-xs font-medium rounded-full flex-shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-sm text-text-secondary flex-1">{practice}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
