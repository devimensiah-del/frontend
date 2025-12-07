'use client'

import type { OKRsAnalysis } from '@/lib/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Target, DollarSign, CheckCircle2 } from 'lucide-react'

interface OKRsViewProps {
  data: OKRsAnalysis
}

export function OKRsView({ data }: OKRsViewProps) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      {data.summary && (
        <Card className="border-gold-500">
          <CardHeader>
            <CardTitle>Síntese do Plano 90 Dias</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary leading-relaxed whitespace-pre-line">
              {data.summary}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Overview Metrics */}
      {(data.total_investment || data.success_metrics) && (
        <div className="grid gap-6 md:grid-cols-2">
          {data.total_investment && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <CardTitle className="text-base">Investimento Total</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-navy-900">
                  {data.total_investment}
                </p>
              </CardContent>
            </Card>
          )}

          {data.success_metrics && data.success_metrics.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-gold-500" />
                  <CardTitle className="text-base">Métricas de Sucesso</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {data.success_metrics.map((metric, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-text-secondary">{metric}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Monthly OKRs */}
      {data.plan_90_days && data.plan_90_days.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-heading font-medium text-navy-900">
            Plano Mensal
          </h3>

          <div className="grid gap-6 lg:grid-cols-3">
            {data.plan_90_days.map((monthOKR, index) => (
              <Card key={index}>
                <CardHeader className="bg-navy-900 text-white">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <CardTitle className="text-base text-white">
                      {monthOKR.month}
                    </CardTitle>
                  </div>
                  {monthOKR.focus && (
                    <Badge variant="outline" className="mt-2 bg-white/10 border-white/20 text-white">
                      {monthOKR.focus}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  {/* Objective */}
                  <div>
                    <p className="text-xs font-medium text-text-secondary mb-1">
                      Objetivo:
                    </p>
                    <p className="text-sm font-medium text-navy-900">
                      {monthOKR.objective}
                    </p>
                  </div>

                  {/* Key Results */}
                  {monthOKR.key_results && monthOKR.key_results.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-text-secondary mb-2">
                        Resultados-Chave:
                      </p>
                      <ul className="space-y-1">
                        {monthOKR.key_results.map((kr, krIndex) => (
                          <li key={krIndex} className="flex items-start gap-2">
                            <span className="inline-block w-1 h-1 bg-gold-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-xs text-text-secondary flex-1">
                              {kr}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Investment */}
                  {monthOKR.investment && (
                    <div className="pt-3 border-t border-line">
                      <p className="text-xs text-text-secondary mb-1">Investimento:</p>
                      <p className="text-sm font-semibold text-navy-900">
                        {monthOKR.investment}
                      </p>
                    </div>
                  )}

                  {/* Aligned Recommendation */}
                  {monthOKR.aligned_recommendation && (
                    <div className="pt-3 border-t border-line">
                      <p className="text-xs text-text-secondary mb-1">Alinhado com:</p>
                      <p className="text-xs text-navy-900">
                        {monthOKR.aligned_recommendation}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
