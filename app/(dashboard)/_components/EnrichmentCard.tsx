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
    if (enrichment.status === 'finished') {
      return <Badge className="bg-gold-100 text-gold-800 border border-gold-300">Pronto</Badge>;
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
        {enrichment.data?.overview && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Visão Geral da Empresa</p>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-900 leading-relaxed">{enrichment.data.overview.description}</p>
              </div>
              {enrichment.data.overview.sources && enrichment.data.overview.sources.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Fontes</p>
                  <ul className="space-y-1">
                    {enrichment.data.overview.sources.map((source, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-start">
                        <span className="text-[#00a859] mr-2">•</span>
                        {source}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Digital Presence */}
        {enrichment.data?.digitalPresence && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Presença Digital</p>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase">Website</p>
                <a
                  href={enrichment.data.digitalPresence.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#00a859] hover:underline"
                >
                  {enrichment.data.digitalPresence.websiteUrl}
                </a>
              </div>
              {enrichment.data.digitalPresence.recentNews && enrichment.data.digitalPresence.recentNews.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Notícias Recentes</p>
                  <ul className="space-y-1">
                    {enrichment.data.digitalPresence.recentNews.map((news, index) => (
                      <li key={index} className="text-sm text-gray-900 flex items-start">
                        <span className="text-[#00a859] mr-2">•</span>
                        {news}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Market Position */}
        {enrichment.data?.marketPosition && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Posição de Mercado</p>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase">Indústria</p>
                <p className="text-sm text-gray-900">{enrichment.data.marketPosition.industry}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase">Diferencial-Chave</p>
                <p className="text-sm text-gray-900 leading-relaxed">{enrichment.data.marketPosition.keyDifferentiator}</p>
              </div>
              {enrichment.data.marketPosition.competitors && enrichment.data.marketPosition.competitors.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Principais Concorrentes</p>
                  <div className="flex flex-wrap gap-2">
                    {enrichment.data.marketPosition.competitors.map((competitor, index) => (
                      <Badge
                        key={index}
                        variant="default"
                        className="bg-orange-50 text-orange-700 border-orange-200"
                      >
                        {competitor}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Strategic Inference */}
        {enrichment.data?.strategicInference && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Inferência Estratégica</p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Tom da Marca</p>
                  <p className="text-sm text-gray-900">{enrichment.data.strategicInference.brandTone}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Maturidade Digital</p>
                  <p className="text-sm text-gray-900">{enrichment.data.strategicInference.digitalMaturity}/10</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Arquétipo de Valor</p>
                  <p className="text-sm text-gray-900">{enrichment.data.strategicInference.valueArchetype}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Segmento de Cliente</p>
                  <p className="text-sm text-gray-900">{enrichment.data.strategicInference.customerSegment}</p>
                </div>
              </div>

              {enrichment.data.strategicInference.strengths && enrichment.data.strategicInference.strengths.length > 0 && (
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-xs font-semibold text-green-700 uppercase mb-2">Forças</p>
                  <ul className="space-y-1">
                    {enrichment.data.strategicInference.strengths.map((strength, index) => (
                      <li key={index} className="text-sm text-gray-900 flex items-start">
                        <span className="text-green-600 mr-2">→</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {enrichment.data.strategicInference.weaknesses && enrichment.data.strategicInference.weaknesses.length > 0 && (
                <div className="bg-red-50 p-3 rounded">
                  <p className="text-xs font-semibold text-red-700 uppercase mb-2">Fraquezas</p>
                  <ul className="space-y-1">
                    {enrichment.data.strategicInference.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-sm text-gray-900 flex items-start">
                        <span className="text-red-600 mr-2">→</span>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
