'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock, Loader2, ThumbsUp } from 'lucide-react';
import { EnrichmentData } from '@/types';

interface EnrichmentApprovalCardProps {
  enrichmentData?: EnrichmentData;
  enrichmentCompletedAt?: string;
  isApproved: boolean;
  onApprove: () => void;
  isApproving: boolean;
}

export function EnrichmentApprovalCard({
  enrichmentData,
  enrichmentCompletedAt,
  isApproved,
  onApprove,
  isApproving,
}: EnrichmentApprovalCardProps) {
  // Calculate enrichment quality metrics
  const getEnrichmentQuality = () => {
    if (!enrichmentData) return { score: 0, status: 'pending', color: 'gray' };

    let totalFields = 0;
    let filledFields = 0;

    // Count website fields
    if (enrichmentData.website) {
      totalFields += 6;
      if (enrichmentData.website.title) filledFields++;
      if (enrichmentData.website.description) filledFields++;
      if (enrichmentData.website.keywords?.length) filledFields++;
      if (enrichmentData.website.og_image) filledFields++;
      if (enrichmentData.website.domain) filledFields++;
      if (enrichmentData.website.language) filledFields++;
    }

    // Count LinkedIn company fields
    if (enrichmentData.linkedin_company) {
      totalFields += 7;
      if (enrichmentData.linkedin_company.name) filledFields++;
      if (enrichmentData.linkedin_company.description) filledFields++;
      if (enrichmentData.linkedin_company.industry) filledFields++;
      if (enrichmentData.linkedin_company.company_size) filledFields++;
      if (enrichmentData.linkedin_company.headquarters) filledFields++;
      if (enrichmentData.linkedin_company.founded) filledFields++;
      if (enrichmentData.linkedin_company.specialties?.length) filledFields++;
    }

    // Count LinkedIn founder fields
    if (enrichmentData.linkedin_founder) {
      totalFields += 5;
      if (enrichmentData.linkedin_founder.name) filledFields++;
      if (enrichmentData.linkedin_founder.title) filledFields++;
      if (enrichmentData.linkedin_founder.company) filledFields++;
      if (enrichmentData.linkedin_founder.location) filledFields++;
      if (enrichmentData.linkedin_founder.headline) filledFields++;
    }

    // Count social media fields
    if (enrichmentData.social_media) {
      if (enrichmentData.social_media.instagram) {
        totalFields += 2;
        if (enrichmentData.social_media.instagram.followers) filledFields++;
        if (enrichmentData.social_media.instagram.bio) filledFields++;
      }
      if (enrichmentData.social_media.tiktok) {
        totalFields += 2;
        if (enrichmentData.social_media.tiktok.followers) filledFields++;
        if (enrichmentData.social_media.tiktok.bio) filledFields++;
      }
    }

    // Count Brazil DB fields
    if (enrichmentData.brazil_dbs) {
      totalFields += 8;
      if (enrichmentData.brazil_dbs.cnpj) filledFields++;
      if (enrichmentData.brazil_dbs.razao_social) filledFields++;
      if (enrichmentData.brazil_dbs.nome_fantasia) filledFields++;
      if (enrichmentData.brazil_dbs.data_abertura) filledFields++;
      if (enrichmentData.brazil_dbs.situacao_cadastral) filledFields++;
      if (enrichmentData.brazil_dbs.capital_social) filledFields++;
      if (enrichmentData.brazil_dbs.porte) filledFields++;
      if (enrichmentData.brazil_dbs.atividade_principal) filledFields++;
    }

    const score = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;

    let status: 'excellent' | 'good' | 'fair' | 'poor' | 'pending';
    let color: string;

    if (score >= 80) {
      status = 'excellent';
      color = 'green';
    } else if (score >= 60) {
      status = 'good';
      color = 'blue';
    } else if (score >= 40) {
      status = 'fair';
      color = 'yellow';
    } else if (score > 0) {
      status = 'poor';
      color = 'red';
    } else {
      status = 'pending';
      color = 'gray';
    }

    return { score, status, color, filledFields, totalFields };
  };

  const quality = getEnrichmentQuality();

  const getStatusBadge = () => {
    if (isApproved) {
      return (
        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Aprovado
        </Badge>
      );
    }

    if (!enrichmentData || !enrichmentCompletedAt) {
      return (
        <Badge className="bg-gray-100 text-gray-800 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Aguardando coleta
        </Badge>
      );
    }

    return (
      <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        Pendente aprovação
      </Badge>
    );
  };

  const getQualityColor = () => {
    switch (quality.color) {
      case 'green':
        return 'bg-green-100 border-green-300 text-green-900';
      case 'blue':
        return 'bg-blue-100 border-blue-300 text-blue-900';
      case 'yellow':
        return 'bg-yellow-100 border-yellow-300 text-yellow-900';
      case 'red':
        return 'bg-red-100 border-red-300 text-red-900';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-900';
    }
  };

  const getQualityLabel = () => {
    switch (quality.status) {
      case 'excellent':
        return 'Excelente';
      case 'good':
        return 'Bom';
      case 'fair':
        return 'Razoável';
      case 'poor':
        return 'Insuficiente';
      default:
        return 'Pendente';
    }
  };

  return (
    <Card className="shadow-lg border-2 border-[hsl(195_100%_8%)]/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[hsl(195_100%_8%)]">Enriquecimento de Dados</CardTitle>
            <CardDescription>
              Coleta automática de informações de múltiplas fontes
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quality Score */}
        {enrichmentData && (
          <div className={`p-4 rounded-lg border-2 ${getQualityColor()}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">Qualidade do Enriquecimento</span>
              <span className="text-2xl font-bold">{quality.score}%</span>
            </div>
            <div className="h-2 bg-white/50 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full transition-all duration-500 ${
                  quality.color === 'green'
                    ? 'bg-green-600'
                    : quality.color === 'blue'
                    ? 'bg-blue-600'
                    : quality.color === 'yellow'
                    ? 'bg-yellow-600'
                    : 'bg-red-600'
                }`}
                style={{ width: `${quality.score}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>
                {quality.filledFields} de {quality.totalFields} campos preenchidos
              </span>
              <span className="font-semibold">{getQualityLabel()}</span>
            </div>
          </div>
        )}

        {/* Data Sources Summary */}
        {enrichmentData && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {enrichmentData.website && (
              <div className="p-3 bg-gray-50 rounded-lg border">
                <div className="text-xs text-gray-600 mb-1">Website</div>
                <div className="font-semibold text-[hsl(195_100%_8%)]">
                  <CheckCircle className="w-4 h-4 inline mr-1 text-green-600" />
                  Coletado
                </div>
              </div>
            )}
            {enrichmentData.linkedin_company && (
              <div className="p-3 bg-gray-50 rounded-lg border">
                <div className="text-xs text-gray-600 mb-1">LinkedIn Empresa</div>
                <div className="font-semibold text-[hsl(195_100%_8%)]">
                  <CheckCircle className="w-4 h-4 inline mr-1 text-green-600" />
                  Coletado
                </div>
              </div>
            )}
            {enrichmentData.linkedin_founder && (
              <div className="p-3 bg-gray-50 rounded-lg border">
                <div className="text-xs text-gray-600 mb-1">LinkedIn Fundador</div>
                <div className="font-semibold text-[hsl(195_100%_8%)]">
                  <CheckCircle className="w-4 h-4 inline mr-1 text-green-600" />
                  Coletado
                </div>
              </div>
            )}
            {enrichmentData.social_media && (
              <div className="p-3 bg-gray-50 rounded-lg border">
                <div className="text-xs text-gray-600 mb-1">Redes Sociais</div>
                <div className="font-semibold text-[hsl(195_100%_8%)]">
                  <CheckCircle className="w-4 h-4 inline mr-1 text-green-600" />
                  Coletado
                </div>
              </div>
            )}
            {enrichmentData.brazil_dbs && (
              <div className="p-3 bg-gray-50 rounded-lg border">
                <div className="text-xs text-gray-600 mb-1">Dados Brasil</div>
                <div className="font-semibold text-[hsl(195_100%_8%)]">
                  <CheckCircle className="w-4 h-4 inline mr-1 text-green-600" />
                  Coletado
                </div>
              </div>
            )}
          </div>
        )}

        {/* Completion timestamp */}
        {enrichmentCompletedAt && (
          <div className="text-sm text-gray-600">
            <Clock className="w-4 h-4 inline mr-1" />
            Concluído em:{' '}
            {new Date(enrichmentCompletedAt).toLocaleString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        )}

        {/* Approval Button */}
        {!isApproved && enrichmentData && enrichmentCompletedAt && (
          <div className="pt-4 border-t">
            <Button
              onClick={onApprove}
              disabled={isApproving}
              size="lg"
              className="w-full bg-[hsl(195_100%_8%)] hover:bg-[hsl(195_100%_8%)]/90 text-white"
            >
              {isApproving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Aprovando...
                </>
              ) : (
                <>
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  Aprovar Enriquecimento e Iniciar Análise IA
                </>
              )}
            </Button>
            <p className="text-xs text-gray-600 text-center mt-2">
              Ao aprovar, a análise de IA será iniciada automaticamente
            </p>
          </div>
        )}

        {/* After Approval Message */}
        {isApproved && (
          <div className="p-4 bg-green-50 rounded-lg border-2 border-green-300">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-green-900 mb-1">
                  Enriquecimento aprovado!
                </div>
                <div className="text-sm text-green-800">
                  Análise de IA em andamento...
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Waiting for Data Message */}
        {!enrichmentData && !enrichmentCompletedAt && (
          <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-300">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-gray-900 mb-1">
                  Aguardando coleta de dados
                </div>
                <div className="text-sm text-gray-600">
                  O processo de enriquecimento ainda não foi iniciado ou está em andamento.
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
