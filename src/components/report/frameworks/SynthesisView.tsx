'use client'

import type { Synthesis } from '@/lib/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Target, TrendingUp, Map } from 'lucide-react'

interface SynthesisViewProps {
  data: Synthesis
}

export function SynthesisView({ data }: SynthesisViewProps) {
  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Resumo Executivo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary leading-relaxed whitespace-pre-line">
            {data.executiveSummary}
          </p>
        </CardContent>
      </Card>

      {/* Key Findings */}
      {data.keyFindings && data.keyFindings.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-gold-500" />
              <CardTitle>Principais Descobertas</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {data.keyFindings.map((finding, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-gold-500/10 text-gold-500 text-xs font-medium rounded-full flex-shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-text-secondary flex-1">{finding}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Strategic Priorities */}
      {data.strategicPriorities && data.strategicPriorities.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gold-500" />
              <CardTitle>Prioridades Estratégicas</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {data.strategicPriorities.map((priority, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-navy-900 text-white text-xs font-medium rounded-full flex-shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-text-secondary flex-1">{priority}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Roadmap */}
      {data.roadmap && data.roadmap.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-gold-500" />
              <CardTitle>Roadmap de Implementação</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {data.roadmap.map((item, index) => (
                <li key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-navy-900 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    {index < data.roadmap.length - 1 && (
                      <div className="w-0.5 h-full bg-line mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-text-secondary">{item}</p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {/* Overall Recommendation */}
      {data.overallRecommendation && (
        <Card className="border-gold-500">
          <CardHeader>
            <CardTitle>Recomendação Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary leading-relaxed whitespace-pre-line">
              {data.overallRecommendation}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
