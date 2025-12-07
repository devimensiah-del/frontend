'use client'

import type { DecisionMatrixAnalysis } from '@/lib/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Award, Calendar, DollarSign, BarChart3, RefreshCw, AlertCircle } from 'lucide-react'

interface DecisionMatrixViewProps {
  data: DecisionMatrixAnalysis
}

export function DecisionMatrixView({ data }: DecisionMatrixViewProps) {
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

      {/* Final Recommendation */}
      {data.final_recommendation && (
        <Card className="border-navy-900">
          <CardHeader className="bg-navy-900 text-white">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-gold-500" />
              <CardTitle className="text-white">Recomendação Final</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div>
              <p className="text-sm font-medium text-navy-900 mb-2">
                Opção Recomendada:
              </p>
              <p className="text-lg font-semibold text-gold-500">
                {data.recommended_option}
              </p>
            </div>

            {data.score && (
              <div>
                <p className="text-sm font-medium text-navy-900 mb-1">
                  Pontuação:
                </p>
                <p className="text-2xl font-bold text-navy-900">{data.score}</p>
              </div>
            )}

            {data.score_comparison && (
              <div className="pt-3 border-t border-line">
                <p className="text-sm text-text-secondary">
                  {data.score_comparison}
                </p>
              </div>
            )}

            <div className="pt-3 border-t border-line">
              <p className="text-sm text-text-secondary whitespace-pre-line">
                {data.final_recommendation}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alternatives and Criteria */}
      <div className="grid gap-6 md:grid-cols-2">
        {data.alternatives && data.alternatives.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Alternativas Avaliadas</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.alternatives.map((alternative, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-navy-900 text-white text-xs font-medium rounded-full flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-sm text-text-secondary flex-1">
                      {alternative}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {data.criteria && data.criteria.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Critérios de Avaliação</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.criteria.map((criterion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="inline-block w-1.5 h-1.5 bg-gold-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-text-secondary flex-1">
                      {criterion}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Priority Recommendations */}
      {data.priority_recommendations && data.priority_recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-heading font-medium text-navy-900">
            Recomendações Priorizadas
          </h3>

          <div className="space-y-4">
            {data.priority_recommendations.map((rec) => (
              <Card key={rec.priority}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-gold-500 text-white rounded-full font-bold">
                      {rec.priority}
                    </div>
                    <div>
                      <CardTitle className="text-base">{rec.title}</CardTitle>
                      <div className="flex gap-3 mt-2 text-xs text-text-secondary">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {rec.timeline}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {rec.budget}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-text-secondary">
                    {rec.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Review Cycle */}
      {data.review_cycle && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-navy-900" />
              <CardTitle className="text-base">Ciclo de Revisão</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.review_cycle.frequency && (
              <div>
                <p className="text-xs font-medium text-text-secondary mb-1">
                  Frequência:
                </p>
                <p className="text-sm text-navy-900">
                  {data.review_cycle.frequency}
                </p>
              </div>
            )}

            {data.review_cycle.extraordinary_triggers && data.review_cycle.extraordinary_triggers.length > 0 && (
              <div>
                <p className="text-xs font-medium text-text-secondary mb-2">
                  Gatilhos Extraordinários:
                </p>
                <ul className="space-y-1">
                  {data.review_cycle.extraordinary_triggers.map((trigger, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertCircle className="w-3 h-3 text-orange-500 flex-shrink-0 mt-1" />
                      <span className="text-xs text-text-secondary flex-1">
                        {trigger}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Monitoring Metrics */}
      {data.monitoring_metrics && data.monitoring_metrics.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-navy-900" />
              <CardTitle className="text-base">Métricas de Monitoramento</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.monitoring_metrics.map((metric, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="inline-block w-1.5 h-1.5 bg-navy-900 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm text-text-secondary flex-1">
                    {metric}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
