import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sparkles,
  Building2,
  DollarSign,
  TrendingUp,
  Globe,
  Target,
} from 'lucide-react';
import {
  Section,
  DataGrid,
  StatusBadge,
} from '@/components/workflow';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { getEnrichmentCompletion, getDataQualityScore } from '@/lib/utils/workflow-helpers';
import type { Enrichment } from '@/types';

interface EnrichmentCardProps {
  enrichment: Enrichment;
}

export function EnrichmentCard({ enrichment }: EnrichmentCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const completionPercentage = getEnrichmentCompletion(enrichment);
  const qualityScore = getDataQualityScore(enrichment);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-1">
            <Sparkles className="w-5 h-5 text-gold-600" />
            <div>
              <CardTitle className="text-navy-900">Análise de Mercado</CardTitle>
              <p className="text-xs text-text-secondary mt-1">
                Atualizado em {formatDate(enrichment.updatedAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge
              status={
                enrichment.status === 'approved'
                  ? 'approved'
                  : enrichment.status === 'pending'
                  ? 'processing'
                  : 'completed'
              }
              size="sm"
            />
          </div>
        </div>

        {/* Quality Score */}
        {qualityScore && (
          <div className="mt-4 flex items-center gap-4 p-3 bg-surface-paper rounded-lg">
            <ProgressRing percentage={qualityScore} size="sm" />
            <div>
              <p className="text-xs font-semibold text-navy-900 uppercase tracking-wider">
                Qualidade dos Dados
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                {qualityScore >= 80
                  ? 'Excelente cobertura de dados'
                  : qualityScore >= 60
                  ? 'Boa cobertura de dados'
                  : 'Dados básicos coletados'}
              </p>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">

        {/* Profile Overview */}
        {enrichment.data?.profile_overview && (
          <Section title="Visão Geral" icon={<Building2 />}>
            <DataGrid items={enrichment.data.profile_overview} />
          </Section>
        )}

        {/* Financials */}
        {enrichment.data?.financials && (
          <Section title="Contexto Financeiro" icon={<DollarSign />}>
            <DataGrid items={enrichment.data.financials} />
          </Section>
        )}

        {/* Market Position */}
        {enrichment.data?.market_position && (
          <Section title="Posicionamento de Mercado" icon={<TrendingUp />}>
            <DataGrid items={enrichment.data.market_position} />

            {/* Competitors */}
            {enrichment.data.competitive_landscape?.competitors &&
              enrichment.data.competitive_landscape.competitors.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                    Principais Concorrentes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {enrichment.data.competitive_landscape.competitors.map(
                      (competitor: string, index: number) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-orange-50 text-orange-700 border-orange-200"
                        >
                          {competitor}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}
          </Section>
        )}

        {/* Strategic Assessment */}
        {enrichment.data?.strategic_assessment && (
          <Section title="Avaliação Estratégica" icon={<Target />}>
            <div className="space-y-4">
              {enrichment.data.strategic_assessment.digital_maturity && (
                <div className="flex items-center gap-4">
                  <ProgressRing
                    percentage={enrichment.data.strategic_assessment.digital_maturity * 10}
                    size="sm"
                  />
                  <div>
                    <p className="text-xs font-semibold text-navy-900 uppercase tracking-wider">
                      Maturidade Digital
                    </p>
                    <p className="text-sm text-text-secondary">
                      {enrichment.data.strategic_assessment.digital_maturity}/10
                    </p>
                  </div>
                </div>
              )}

              {enrichment.data.strategic_assessment.strengths &&
                enrichment.data.strategic_assessment.strengths.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-2">
                      Forças Identificadas
                    </p>
                    <ul className="space-y-2">
                      {enrichment.data.strategic_assessment.strengths.map(
                        (strength: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-navy-900">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{strength}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

              {enrichment.data.strategic_assessment.weaknesses &&
                enrichment.data.strategic_assessment.weaknesses.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-xs font-semibold text-red-700 uppercase tracking-wider mb-2">
                      Pontos de Atenção
                    </p>
                    <ul className="space-y-2">
                      {enrichment.data.strategic_assessment.weaknesses.map(
                        (weakness: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-navy-900">
                            <span className="text-red-600 mt-1 flex-shrink-0">→</span>
                            <span>{weakness}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
            </div>
          </Section>
        )}

        {/* Data Sources */}
        {enrichment.data?.data_sources && enrichment.data.data_sources.length > 0 && (
          <div className="pt-4 border-t border-surface-border">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
              Fontes de Dados
            </p>
            <div className="flex flex-wrap gap-2">
              {enrichment.data.data_sources.map((source: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  <Globe className="w-3 h-3 mr-1" />
                  {source}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
