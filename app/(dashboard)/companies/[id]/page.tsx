"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { companiesApi, analysisApi, authApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Section, Container } from "@/components/editorial/Section";
import { Heading, Eyebrow, Text } from "@/components/ui/Typography";
import { LoadingState, ErrorState } from "@/components/ui/state-components";
import { Badge } from "@/components/ui/badge";
import { InfoItem } from "@/components/ui/InfoItem";
import {
  ArrowLeft,
  Building2,
  Globe,
  MapPin,
  Users,
  ShieldCheck,
  Calendar,
  FileText,
  ExternalLink,
  Linkedin,
  Twitter,
  Clock,
  CheckCircle,
  Loader2,
  History,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // Fetch current user
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: authApi.getCurrentUser,
  });

  // Fetch company details
  const { data: companyData, isLoading, error } = useQuery({
    queryKey: ["company", id],
    queryFn: () => companiesApi.getById(id),
  });

  const company = companyData?.company;
  const primarySubmissionId = companyData?.primary_submission_id;
  const isOwner = company?.owner_id === user?.id;

  // Fetch analysis data (if primary submission exists)
  const { data: analysis, isLoading: isLoadingAnalysis } = useQuery({
    queryKey: ["analysis", primarySubmissionId],
    queryFn: () => analysisApi.getBySubmissionId(primarySubmissionId!),
    enabled: !!primarySubmissionId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'pending' ? 5000 : false;
    },
  });

  // Get access code from analysis (supports both camelCase and snake_case)
  const accessCode = analysis ? ((analysis as any).accessCode ?? (analysis as any).access_code) : null;

  // Determine analysis status for display
  // Report is ready when analysis has an access_code (no longer requires approval)
  const getAnalysisStatus = () => {
    if (!primarySubmissionId) return 'no_submission';
    if (isLoadingAnalysis) return 'loading';
    if (!analysis) return 'not_started';

    // Report is ready if we have an access code
    if (accessCode) return 'ready';

    // Otherwise show processing states
    if (analysis.status === 'completed' || analysis.status === 'approved') return 'completed';
    if (analysis.status === 'pending') return 'pending';
    return 'not_started';
  };

  const analysisStatus = getAnalysisStatus();

  if (isLoading) {
    return (
      <Section className="bg-surface-paper border-0 min-h-screen">
        <Container>
          <LoadingState message="Carregando detalhes da empresa..." size="lg" />
        </Container>
      </Section>
    );
  }

  if (error || !company) {
    return (
      <Section className="bg-surface-paper border-0 min-h-screen">
        <Container>
          <ErrorState
            title="Empresa não encontrada"
            message="A empresa solicitada não existe ou você não tem permissão para acessá-la."
            retryLabel="Voltar ao Dashboard"
            onRetry={() => router.push("/dashboard")}
          />
        </Container>
      </Section>
    );
  }

  return (
    <Section className="bg-surface-paper border-0 min-h-screen">
      <Container>
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        {/* Company Header */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Eyebrow className="flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              Criada em {format(new Date(company.created_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </Eyebrow>
            {company.is_verified && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <ShieldCheck className="w-3 h-3 mr-1" />
                Verificada
              </Badge>
            )}
            {isOwner && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Users className="w-3 h-3 mr-1" />
                Proprietário
              </Badge>
            )}
          </div>

          <Heading variant="section" className="mb-4">
            {company.name}
          </Heading>

          {company.legal_name && company.legal_name !== company.name && (
            <Text variant="body" className="text-text-secondary mb-4">
              {company.legal_name}
            </Text>
          )}

          {company.value_proposition && (
            <Text variant="lead" className="max-w-3xl">
              {company.value_proposition}
            </Text>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Company Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Informações da Empresa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {company.industry && (
                    <InfoItem label="Indústria" value={company.industry} />
                  )}
                  {company.sector && (
                    <InfoItem label="Setor" value={company.sector} />
                  )}
                  {company.company_size && (
                    <InfoItem label="Porte" value={company.company_size} />
                  )}
                  {company.employees_range && (
                    <InfoItem label="Funcionários" value={company.employees_range} />
                  )}
                  {company.location && (
                    <InfoItem label="Localização" value={company.location} icon={<MapPin className="w-4 h-4" />} />
                  )}
                  {company.headquarters && (
                    <InfoItem label="Sede" value={company.headquarters} />
                  )}
                  {company.foundation_year && (
                    <InfoItem label="Fundação" value={company.foundation_year} />
                  )}
                  {company.funding_stage && (
                    <InfoItem label="Estágio de Financiamento" value={company.funding_stage} />
                  )}
                  {company.target_market && (
                    <InfoItem label="Mercado Alvo" value={company.target_market} />
                  )}
                  {company.target_audience && (
                    <InfoItem label="Público Alvo" value={company.target_audience} />
                  )}
                  {company.business_model && (
                    <InfoItem label="Modelo de Negócio" value={company.business_model} />
                  )}
                  {company.revenue_estimate && (
                    <InfoItem label="Receita Estimada" value={company.revenue_estimate} />
                  )}
                  {company.cnpj && (
                    <InfoItem label="CNPJ" value={company.cnpj} />
                  )}
                </div>

                {/* Links */}
                <div className="mt-6 pt-6 border-t border-line flex flex-wrap gap-4">
                  {company.website && (
                    <a
                      href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gold-600 hover:text-gold-700"
                    >
                      <Globe className="w-4 h-4" />
                      Website
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {company.linkedin_url && (
                    <a
                      href={company.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {company.twitter_handle && (
                    <a
                      href={`https://twitter.com/${company.twitter_handle.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-sky-500 hover:text-sky-600"
                    >
                      <Twitter className="w-4 h-4" />
                      {company.twitter_handle}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Strategic Assessment */}
            {(company.strengths?.length || company.weaknesses?.length || company.competitors?.length) && (
              <Card>
                <CardHeader>
                  <CardTitle>Avaliação Estratégica</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {company.strengths && company.strengths.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">Pontos Fortes</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {company.strengths.map((item: string, idx: number) => (
                          <li key={idx} className="text-sm text-text-secondary">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {company.weaknesses && company.weaknesses.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-red-700 mb-2">Pontos Fracos</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {company.weaknesses.map((item: string, idx: number) => (
                          <li key={idx} className="text-sm text-text-secondary">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {company.competitors && company.competitors.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-text-primary mb-2">Concorrentes</h4>
                      <div className="flex flex-wrap gap-2">
                        {company.competitors.map((competitor: string, idx: number) => (
                          <Badge key={idx} variant="outline">{competitor}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {company.digital_maturity !== undefined && (
                    <div>
                      <h4 className="font-semibold text-text-primary mb-2">Maturidade Digital</h4>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gold-500 rounded-full"
                            style={{ width: `${Math.min((company.digital_maturity / 10) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{Math.min(company.digital_maturity, 10)}/10</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Analysis History Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Histórico de Análises
                </CardTitle>
                <CardDescription>
                  Relatórios estratégicos da sua empresa
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analysisStatus === 'loading' && (
                  <div className="flex items-center gap-3 text-text-secondary">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">Carregando...</span>
                  </div>
                )}

                {analysisStatus === 'no_submission' && (
                  <Text variant="small" className="text-text-tertiary">
                    Nenhuma análise solicitada ainda.
                  </Text>
                )}

                {analysisStatus === 'not_started' && (
                  <Text variant="small" className="text-text-tertiary">
                    Nenhuma análise disponível.
                  </Text>
                )}

                {analysisStatus === 'pending' && (
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-center gap-3 text-amber-700">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm font-medium">Análise em processamento</span>
                    </div>
                    <Text variant="small" className="text-amber-600 mt-1">
                      O relatório estará disponível em breve.
                    </Text>
                  </div>
                )}

                {analysisStatus === 'completed' && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3 text-blue-700">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">Análise concluída</span>
                    </div>
                    <Text variant="small" className="text-blue-600 mt-1">
                      Aguardando publicação do relatório.
                    </Text>
                  </div>
                )}

                {analysisStatus === 'ready' && analysis && accessCode && (
                  <div className="space-y-3">
                    {/* Analysis Item */}
                    <div
                      className="p-3 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors cursor-pointer"
                      onClick={() => router.push(`/report/${accessCode}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-green-800">Análise Estratégica</p>
                            {analysis.updatedAt && (
                              <p className="text-xs text-green-600">
                                {format(new Date(analysis.updatedAt), "d 'de' MMM 'de' yyyy", { locale: ptBR })}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-green-700 hover:text-green-800">
                          <FileText className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  );
}
