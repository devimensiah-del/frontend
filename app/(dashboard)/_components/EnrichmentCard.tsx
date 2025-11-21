'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface EnrichmentData {
  id: string;
  marketSize?: string;
  competitors?: string[];
  technologyStack?: string[];
  regulatoryRequirements?: string;
  marketTrends?: string;
  swotAnalysis?: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  fundingOpportunities?: string[];
  partnerships?: string[];
  growthPotential?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface EnrichmentCardProps {
  enrichment: EnrichmentData;
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
          <Badge className="bg-indigo-100 text-indigo-800 border border-indigo-300">
            Enriquecido
          </Badge>
        </div>

        {/* Market Size */}
        {enrichment.marketSize && (
          <div>
            <p className="text-sm font-medium text-gray-700">Tamanho do Mercado</p>
            <p className="text-sm text-gray-900 mt-2 leading-relaxed">
              {enrichment.marketSize}
            </p>
          </div>
        )}

        {/* Competitors */}
        {enrichment.competitors && enrichment.competitors.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Concorrentes</p>
            <div className="flex flex-wrap gap-2">
              {enrichment.competitors.map((competitor, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-gray-50 text-gray-700"
                >
                  {competitor}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Technology Stack */}
        {enrichment.technologyStack && enrichment.technologyStack.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Stack Tecnológico</p>
            <div className="flex flex-wrap gap-2">
              {enrichment.technologyStack.map((tech, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Regulatory Requirements */}
        {enrichment.regulatoryRequirements && (
          <div>
            <p className="text-sm font-medium text-gray-700">Requisitos Regulatórios</p>
            <p className="text-sm text-gray-900 mt-2 leading-relaxed">
              {enrichment.regulatoryRequirements}
            </p>
          </div>
        )}

        {/* Market Trends */}
        {enrichment.marketTrends && (
          <div>
            <p className="text-sm font-medium text-gray-700">Tendências de Mercado</p>
            <p className="text-sm text-gray-900 mt-2 leading-relaxed">
              {enrichment.marketTrends}
            </p>
          </div>
        )}

        {/* SWOT Analysis */}
        {enrichment.swotAnalysis && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-4">Análise SWOT</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Strengths */}
              {enrichment.swotAnalysis.strengths.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-green-700 uppercase mb-2">
                    Forças
                  </p>
                  <ul className="space-y-1">
                    {enrichment.swotAnalysis.strengths.map((item, index) => (
                      <li key={index} className="text-sm text-gray-900 flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Weaknesses */}
              {enrichment.swotAnalysis.weaknesses.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-red-700 uppercase mb-2">
                    Fraquezas
                  </p>
                  <ul className="space-y-1">
                    {enrichment.swotAnalysis.weaknesses.map((item, index) => (
                      <li key={index} className="text-sm text-gray-900 flex items-start">
                        <span className="text-red-600 mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Opportunities */}
              {enrichment.swotAnalysis.opportunities.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-blue-700 uppercase mb-2">
                    Oportunidades
                  </p>
                  <ul className="space-y-1">
                    {enrichment.swotAnalysis.opportunities.map((item, index) => (
                      <li key={index} className="text-sm text-gray-900 flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Threats */}
              {enrichment.swotAnalysis.threats.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-orange-700 uppercase mb-2">
                    Ameaças
                  </p>
                  <ul className="space-y-1">
                    {enrichment.swotAnalysis.threats.map((item, index) => (
                      <li key={index} className="text-sm text-gray-900 flex items-start">
                        <span className="text-orange-600 mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Funding Opportunities */}
        {enrichment.fundingOpportunities && enrichment.fundingOpportunities.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Oportunidades de Financiamento
            </p>
            <ul className="space-y-2">
              {enrichment.fundingOpportunities.map((opportunity, index) => (
                <li key={index} className="text-sm text-gray-900 flex items-start">
                  <span className="text-[#00a859] mr-2">→</span>
                  {opportunity}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Partnerships */}
        {enrichment.partnerships && enrichment.partnerships.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Parcerias Potenciais
            </p>
            <div className="flex flex-wrap gap-2">
              {enrichment.partnerships.map((partner, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-purple-50 text-purple-700 border-purple-200"
                >
                  {partner}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Growth Potential */}
        {enrichment.growthPotential && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700">Potencial de Crescimento</p>
            <p className="text-sm text-gray-900 mt-2 leading-relaxed">
              {enrichment.growthPotential}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
