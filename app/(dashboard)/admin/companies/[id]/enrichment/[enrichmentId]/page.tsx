"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { adminApi, authApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Section, Container } from "@/components/editorial/Section";
import { Heading, Text } from "@/components/ui/Typography";
import { LoadingState, ErrorState } from "@/components/ui/state-components";
import { Badge } from "@/components/ui/badge";
import { InfoItem } from "@/components/ui/InfoItem";
import {
  ArrowLeft,
  Building2,
  Globe,
  Users,
  TrendingUp,
  BarChart3,
  Target,
  DollarSign,
  CheckCircle,
  Loader2,
  XCircle,
  Calendar,
  MapPin,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Enrichment } from "@/lib/types";

// Helper to format date in São Paulo timezone
function formatInSaoPaulo(dateString: string, formatStr: string): string {
  const date = new Date(dateString);
  const saoPauloString = date.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' });
  const saoPauloDate = new Date(saoPauloString);
  return format(saoPauloDate, formatStr, { locale: ptBR });
}

export default function AdminEnrichmentDetailPage() {
  const params = useParams();
  const router = useRouter();

  const companyId = params.id as string;
  const enrichmentId = params.enrichmentId as string;

  // Fetch current user (admin check)
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: authApi.getCurrentUser,
  });

  const isAdmin = user?.role === "admin";

  // Redirect non-admins
  React.useEffect(() => {
    if (user && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [user, isAdmin, router]);

  // Fetch the enrichment
  const { data: enrichment, isLoading, error } = useQuery({
    queryKey: ["enrichment", enrichmentId],
    queryFn: () => adminApi.getEnrichmentById(enrichmentId),
    enabled: isAdmin && !!enrichmentId,
  });

  if (!isAdmin) {
    return (
      <Section className="bg-surface-paper border-0 min-h-screen">
        <Container>
          <LoadingState message="Verificando permissões..." size="lg" />
        </Container>
      </Section>
    );
  }

  if (isLoading) {
    return (
      <Section className="bg-surface-paper border-0 min-h-screen">
        <Container>
          <LoadingState message="Carregando enriquecimento..." size="lg" />
        </Container>
      </Section>
    );
  }

  if (error || !enrichment) {
    return (
      <Section className="bg-surface-paper border-0 min-h-screen">
        <Container>
          <ErrorState
            title="Enriquecimento não encontrado"
            message="O enriquecimento solicitado não existe ou você não tem permissão."
            retryLabel="Voltar"
            onRetry={() => router.push(`/admin/companies/${companyId}`)}
          />
        </Container>
      </Section>
    );
  }

  const data = (enrichment.data || {}) as Record<string, unknown>;
  const profile = (data.profile_overview || {}) as Record<string, string | undefined>;
  const financials = (data.financials || {}) as Record<string, string | undefined>;
  const marketPosition = (data.market_position || {}) as Record<string, string | undefined>;
  const strategicAssessment = (data.strategic_assessment || {}) as Record<string, unknown>;
  const competitiveLandscape = (data.competitive_landscape || {}) as Record<string, unknown>;
  const macroContext = (data.macro_context || {}) as Record<string, unknown>;
  const submittedData = (data.submitted_data || {}) as Record<string, string | undefined>;
  const discoveredData = (data.discovered_data || {}) as Record<string, string | undefined>;

  const isPending = enrichment.status === 'pending';
  const isCompleted = enrichment.status === 'completed';
  const isFailed = !isPending && !isCompleted;

  return (
    <Section className="bg-surface-paper border-0 min-h-screen">
      <Container className="py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/admin/companies/${companyId}`)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <Heading variant="section" className="text-lg">
                Detalhes do Enriquecimento
              </Heading>
              <Text variant="small" className="text-text-tertiary">
                ID: {enrichmentId.slice(0, 8)}...
              </Text>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isPending && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Processando
              </Badge>
            )}
            {isCompleted && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Completo
              </Badge>
            )}
            {isFailed && (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                <XCircle className="w-3 h-3 mr-1" />
                Falhou
              </Badge>
            )}
          </div>
        </div>

        {/* Read-only notice */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <Text variant="small" className="text-blue-800">
            <strong>Modo de visualização:</strong> Este enriquecimento é somente leitura.
            Para editar os dados da empresa, volte para a página da empresa e use o modo de edição.
          </Text>
        </div>

        {/* Processing Status */}
        {isPending && (
          <Card className="mb-6">
            <CardContent className="py-6">
              <div className="flex items-center gap-3 mb-4">
                <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
                <Text className="text-amber-700 font-medium">
                  {enrichment.currentStep || 'Processando...'}
                </Text>
              </div>
              <div className="w-full bg-amber-200 rounded-full h-2">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${enrichment.progress || 0}%` }}
                />
              </div>
              <Text variant="small" className="text-amber-600 mt-2">
                {enrichment.progress || 0}% concluído
              </Text>
            </CardContent>
          </Card>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Perfil da Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.legal_name && <InfoItem label="Razão Social" value={profile.legal_name} />}
              {profile.website && (
                <InfoItem
                  label="Website"
                  value={profile.website}
                  icon={<Globe className="w-4 h-4" />}
                />
              )}
              {profile.foundation_year && (
                <InfoItem
                  label="Ano de Fundação"
                  value={profile.foundation_year}
                  icon={<Calendar className="w-4 h-4" />}
                />
              )}
              {profile.headquarters && (
                <InfoItem
                  label="Sede"
                  value={profile.headquarters}
                  icon={<MapPin className="w-4 h-4" />}
                />
              )}
              {profile.description && (
                <div>
                  <Text variant="small" className="text-text-tertiary mb-1">Descrição</Text>
                  <Text variant="body" className="text-text-secondary">{profile.description}</Text>
                </div>
              )}
              {Object.keys(profile).length === 0 && (
                <Text className="text-text-tertiary italic">Nenhum dado de perfil disponível</Text>
              )}
            </CardContent>
          </Card>

          {/* Financials */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Informações Financeiras
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {financials.employees_range && (
                <InfoItem
                  label="Funcionários"
                  value={financials.employees_range}
                  icon={<Users className="w-4 h-4" />}
                />
              )}
              {financials.revenue_estimate && (
                <InfoItem
                  label="Receita Estimada"
                  value={financials.revenue_estimate}
                />
              )}
              {financials.business_model && (
                <InfoItem label="Modelo de Negócio" value={financials.business_model} />
              )}
              {Object.keys(financials).length === 0 && (
                <Text className="text-text-tertiary italic">Nenhum dado financeiro disponível</Text>
              )}
            </CardContent>
          </Card>

          {/* Market Position */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Posição de Mercado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {marketPosition.sector && <InfoItem label="Setor" value={marketPosition.sector} />}
              {marketPosition.target_audience && (
                <InfoItem label="Público Alvo" value={marketPosition.target_audience} />
              )}
              {marketPosition.value_proposition && (
                <div>
                  <Text variant="small" className="text-text-tertiary mb-1">Proposta de Valor</Text>
                  <Text variant="body" className="text-text-secondary">{marketPosition.value_proposition}</Text>
                </div>
              )}
              {Object.keys(marketPosition).length === 0 && (
                <Text className="text-text-tertiary italic">Nenhum dado de mercado disponível</Text>
              )}
            </CardContent>
          </Card>

          {/* Strategic Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Avaliação Estratégica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {strategicAssessment.digital_maturity !== undefined && (
                <div>
                  <Text variant="small" className="text-text-tertiary mb-1">Maturidade Digital</Text>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gold-500 rounded-full"
                        style={{ width: `${Math.min((Number(strategicAssessment.digital_maturity) / 10) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">{Math.min(Number(strategicAssessment.digital_maturity), 10)}/10</span>
                  </div>
                </div>
              )}
              {Array.isArray(strategicAssessment.strengths) && strategicAssessment.strengths.length > 0 && (
                <div>
                  <Text variant="small" className="text-green-700 font-medium mb-2">Pontos Fortes</Text>
                  <ul className="list-disc list-inside space-y-1">
                    {(strategicAssessment.strengths as string[]).map((item: string, idx: number) => (
                      <li key={idx} className="text-xs text-text-secondary">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {Array.isArray(strategicAssessment.weaknesses) && strategicAssessment.weaknesses.length > 0 && (
                <div>
                  <Text variant="small" className="text-red-700 font-medium mb-2">Pontos Fracos</Text>
                  <ul className="list-disc list-inside space-y-1">
                    {(strategicAssessment.weaknesses as string[]).map((item: string, idx: number) => (
                      <li key={idx} className="text-xs text-text-secondary">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {Object.keys(strategicAssessment).length === 0 && (
                <Text className="text-text-tertiary italic">Nenhuma avaliação disponível</Text>
              )}
            </CardContent>
          </Card>

          {/* Competitive Landscape */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Paisagem Competitiva
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {typeof competitiveLandscape.market_share_status === 'string' && competitiveLandscape.market_share_status && (
                <InfoItem label="Status de Market Share" value={competitiveLandscape.market_share_status} />
              )}
              {Array.isArray(competitiveLandscape.competitors) && competitiveLandscape.competitors.length > 0 && (
                <div>
                  <Text variant="small" className="text-text-tertiary mb-2">Concorrentes</Text>
                  <div className="flex flex-wrap gap-1">
                    {(competitiveLandscape.competitors as string[]).map((competitor: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs">{competitor}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {Object.keys(competitiveLandscape).length === 0 && (
                <Text className="text-text-tertiary italic">Nenhum dado competitivo disponível</Text>
              )}
            </CardContent>
          </Card>

          {/* Macro Context */}
          {macroContext && Object.keys(macroContext).length > 0 && (() => {
            const economicIndicators = (macroContext.economic_indicators || {}) as Record<string, string | undefined>;
            const industryTrends = (macroContext.industry_trends || {}) as Record<string, string | undefined>;
            const lastUpdated = macroContext.last_updated as string | undefined;

            return (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Contexto Macroeconômico
                </CardTitle>
                <CardDescription>
                  Indicadores econômicos utilizados na análise
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.keys(economicIndicators).length > 0 && (
                    <>
                      {economicIndicators.gdp_growth && (
                        <InfoItem label="Crescimento do PIB" value={economicIndicators.gdp_growth} />
                      )}
                      {economicIndicators.inflation_rate && (
                        <InfoItem label="Taxa de Inflação" value={economicIndicators.inflation_rate} />
                      )}
                      {economicIndicators.interest_rate && (
                        <InfoItem label="Taxa de Juros" value={economicIndicators.interest_rate} />
                      )}
                      {economicIndicators.exchange_rate && (
                        <InfoItem label="Taxa de Câmbio" value={economicIndicators.exchange_rate} />
                      )}
                      {economicIndicators.unemployment_rate && (
                        <InfoItem label="Taxa de Desemprego" value={economicIndicators.unemployment_rate} />
                      )}
                    </>
                  )}
                  {Object.keys(industryTrends).length > 0 && (
                    <>
                      {industryTrends.industry_sector && (
                        <InfoItem label="Setor Industrial" value={industryTrends.industry_sector} />
                      )}
                      {industryTrends.growth_rate && (
                        <InfoItem label="Taxa de Crescimento" value={industryTrends.growth_rate} />
                      )}
                      {industryTrends.market_maturity && (
                        <InfoItem label="Maturidade do Mercado" value={industryTrends.market_maturity} />
                      )}
                    </>
                  )}
                </div>
                {lastUpdated && (
                  <Text variant="small" className="text-text-tertiary mt-4">
                    Última atualização: {formatInSaoPaulo(lastUpdated, "d 'de' MMM 'de' yyyy 'às' HH:mm")}
                  </Text>
                )}
              </CardContent>
            </Card>
            );
          })()}

          {/* Submitted Data (Original Form Data) */}
          {Object.keys(submittedData).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Dados Enviados (Formulário)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {submittedData.company_name && (
                  <InfoItem label="Nome da Empresa" value={submittedData.company_name} />
                )}
                {submittedData.contact_name && (
                  <InfoItem label="Contato" value={submittedData.contact_name} />
                )}
                {submittedData.contact_email && (
                  <InfoItem label="Email" value={submittedData.contact_email} />
                )}
                {submittedData.business_challenge && (
                  <div>
                    <Text variant="small" className="text-text-tertiary mb-1">Desafio de Negócio</Text>
                    <Text variant="body" className="text-text-secondary text-sm">{submittedData.business_challenge}</Text>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Discovered Data (AI Enriched) */}
          {Object.keys(discoveredData).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Dados Descobertos (IA)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {discoveredData.cnpj && <InfoItem label="CNPJ" value={discoveredData.cnpj} />}
                {discoveredData.website && <InfoItem label="Website" value={discoveredData.website} />}
                {discoveredData.industry && <InfoItem label="Indústria" value={discoveredData.industry} />}
                {discoveredData.location && <InfoItem label="Localização" value={discoveredData.location} />}
                {discoveredData.foundation_year && <InfoItem label="Fundação" value={discoveredData.foundation_year} />}
                {discoveredData.funding_stage && <InfoItem label="Estágio de Funding" value={discoveredData.funding_stage} />}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Metadata */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-sm">Metadados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoItem label="ID" value={enrichment.id?.slice(0, 8) + '...'} />
              <InfoItem label="Submissão" value={enrichment.submissionId?.slice(0, 8) + '...'} />
              <InfoItem
                label="Criado em"
                value={enrichment.createdAt ? formatInSaoPaulo(enrichment.createdAt, "d MMM yyyy HH:mm") : '-'}
              />
              <InfoItem
                label="Atualizado em"
                value={enrichment.updatedAt ? formatInSaoPaulo(enrichment.updatedAt, "d MMM yyyy HH:mm") : '-'}
              />
            </div>
          </CardContent>
        </Card>
      </Container>
    </Section>
  );
}
