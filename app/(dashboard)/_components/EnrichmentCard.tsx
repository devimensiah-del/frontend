'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
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

  const getStatusBadge = () => {
    if (enrichment.status === 'approved') {
      return <Badge className="bg-green-100 text-green-800 border border-green-300">Aprovado</Badge>;
    }
    if (enrichment.status === 'rejected') {
      return <Badge className="bg-red-100 text-red-800 border border-red-300">Rejeitado</Badge>;
    }
    return <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300">Pendente</Badge>;
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Dados de Enriquecimento
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Atualizado em {formatDate(enrichment.updatedAt)}
            </p>
          </div>
          {getStatusBadge()}
        </div>

        {/* Company Overview */}
        {enrichment.companyOverview && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Visão Geral da Empresa</p>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase">Nome Legal</p>
                <p className="text-sm text-gray-900">{enrichment.companyOverview.legalName}</p>
              </div>
              {enrichment.companyOverview.headquarters && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Sede</p>
                  <p className="text-sm text-gray-900">{enrichment.companyOverview.headquarters}</p>
                </div>
              )}
              {enrichment.companyOverview.numberOfEmployees && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Funcionários</p>
                  <p className="text-sm text-gray-900">{enrichment.companyOverview.numberOfEmployees}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Strategic Profile */}
        {enrichment.strategicProfile && enrichment.strategicProfile.keyCompetencies.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Competências-Chave</p>
            <div className="flex flex-wrap gap-2">
              {enrichment.strategicProfile.keyCompetencies.map((competency, index) => (
                <Badge
                  key={index}
                  variant="default"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  {competency}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Market Intelligence */}
        {enrichment.marketIntelligence && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Inteligência de Mercado</p>
            <div className="space-y-3">
              {enrichment.marketIntelligence.industryOverview && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Visão da Indústria</p>
                  <p className="text-sm text-gray-900 leading-relaxed">{enrichment.marketIntelligence.industryOverview}</p>
                </div>
              )}
              {enrichment.marketIntelligence.marketSize && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Tamanho do Mercado</p>
                  <p className="text-sm text-gray-900">{enrichment.marketIntelligence.marketSize}</p>
                </div>
              )}
              {enrichment.marketIntelligence.keyTrends.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Tendências-Chave</p>
                  <ul className="space-y-1">
                    {enrichment.marketIntelligence.keyTrends.map((trend, index) => (
                      <li key={index} className="text-sm text-gray-900 flex items-start">
                        <span className="text-[#00a859] mr-2">•</span>
                        {trend}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Competitive Landscape */}
        {enrichment.competitiveLandscape && enrichment.competitiveLandscape.mainCompetitors.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Principais Concorrentes</p>
            <div className="space-y-3">
              {enrichment.competitiveLandscape.mainCompetitors.map((competitor, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded">
                  <p className="text-sm font-semibold text-gray-900">{competitor.name}</p>
                  {competitor.marketShare && (
                    <p className="text-xs text-gray-600 mt-1">Market Share: {competitor.marketShare}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Financial Metrics */}
        {enrichment.financialMetrics && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Métricas Financeiras</p>
            <div className="grid grid-cols-2 gap-3">
              {enrichment.financialMetrics.revenue && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Receita</p>
                  <p className="text-sm text-gray-900">{enrichment.financialMetrics.revenue}</p>
                </div>
              )}
              {enrichment.financialMetrics.profitMargin && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Margem de Lucro</p>
                  <p className="text-sm text-gray-900">{enrichment.financialMetrics.profitMargin}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Data Quality Score */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Qualidade dos Dados</p>
            <div className="flex items-center space-x-2">
              <div className="text-sm font-bold text-gray-900">{enrichment.dataQualityScore}/100</div>
              <Badge variant="default" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                {enrichment.sourceReliability}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
