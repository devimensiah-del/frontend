"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminCompaniesApi, adminApi, authApi } from "@/lib/api/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Section, Container } from "@/components/editorial/Section";
import { Heading, Eyebrow, Text } from "@/components/ui/Typography";
import { LoadingState, ErrorState } from "@/components/ui/state-components";
import { Badge } from "@/components/ui/badge";
import { InfoItem } from "@/components/ui/InfoItem";
import { Textarea } from "@/components/ui/Textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Building2,
  Globe,
  MapPin,
  Calendar,
  FileText,
  ExternalLink,
  Linkedin,
  Twitter,
  Sparkles,
  BarChart3,
  CheckCircle,
  Loader2,
  Eye,
  EyeOff,
  AlertCircle,
  XCircle,
  Plus,
  Pencil,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { EnrichmentStatusInfo, AnalysisHistoryItem } from "@/lib/types";
import { CompanyEditor } from "@/components/admin/editors/CompanyEditor";

// Helper to format date in São Paulo timezone (BRT/BRST)
function formatInSaoPaulo(dateString: string, formatStr: string): string {
  const date = new Date(dateString);
  const saoPauloString = date.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' });
  const saoPauloDate = new Date(saoPauloString);
  return format(saoPauloDate, formatStr, { locale: ptBR });
}

// Truncate text for display
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export default function AdminCompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // State for challenge dialog
  const [showChallengeDialog, setShowChallengeDialog] = React.useState(false);
  const [newChallenge, setNewChallenge] = React.useState("");
  const [generatingCodeFor, setGeneratingCodeFor] = React.useState<string | null>(null);

  // State for company edit mode
  const [isEditingCompany, setIsEditingCompany] = React.useState(false);

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

  // Fetch company details with submissions and analyses history
  const { data: companyData, isLoading, error } = useQuery({
    queryKey: ["adminCompany", id],
    queryFn: () => adminCompaniesApi.getById(id),
    enabled: isAdmin,
    refetchInterval: (query) => {
      // Auto-refresh if there's a pending analysis
      const analyses = query.state.data?.analyses_history || [];
      const hasPending = analyses.some((a: AnalysisHistoryItem) =>
        a.status === 'pending' || a.status === 'processing'
      );
      return hasPending ? 5000 : false;
    },
  });

  const company = companyData?.company;
  const submissions = companyData?.submissions || [];
  const enrichmentStatus = companyData?.enrichment_status;
  const enrichmentsHistoryRaw = companyData?.enrichments_history || [];
  const analysesHistory = companyData?.analyses_history || [];

  // Filter out "copied" enrichments - only show enrichments where real AI work was done
  const enrichmentsHistory = enrichmentsHistoryRaw.filter(
    (e: EnrichmentStatusInfo) => !e.current_step?.toLowerCase().includes('copied')
  );

  // Get last challenge from analysis history (if available)
  const lastChallenge = analysesHistory.length > 0 ? analysesHistory[0].business_challenge : null;

  // Mutations
  const enrichMutation = useMutation({
    mutationFn: () => adminCompaniesApi.reEnrich(id),
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Enriquecimento iniciado." });
      queryClient.invalidateQueries({ queryKey: ["adminCompany", id] });
    },
    onError: (error: Error) => {
      toast({ title: "Erro", description: error.message || "Falha ao enriquecer.", variant: "destructive" });
    },
  });

  // Re-analyze with last challenge
  const reAnalyzeMutation = useMutation({
    mutationFn: () => adminCompaniesApi.reAnalyze(id),
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Análise iniciada com o último desafio." });
      queryClient.invalidateQueries({ queryKey: ["adminCompany", id] });
    },
    onError: (error: Error) => {
      toast({ title: "Erro", description: error.message || "Falha ao iniciar análise.", variant: "destructive" });
    },
  });

  // Analyze with new challenge
  const analyzeNewChallengeMutation = useMutation({
    mutationFn: (challenge: string) => adminCompaniesApi.analyzeWithNewChallenge(id, challenge),
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Análise iniciada para o novo desafio." });
      queryClient.invalidateQueries({ queryKey: ["adminCompany", id] });
      setShowChallengeDialog(false);
      setNewChallenge("");
    },
    onError: (error: Error) => {
      toast({ title: "Erro", description: error.message || "Falha ao iniciar análise.", variant: "destructive" });
    },
  });

  const toggleBlurMutation = useMutation({
    mutationFn: ({ analysisId, blurred }: { analysisId: string; blurred: boolean }) =>
      adminApi.toggleBlur(analysisId, blurred),
    onSuccess: (_, { blurred }) => {
      queryClient.invalidateQueries({ queryKey: ["adminCompany", id] });
      toast({
        title: blurred ? "Relatório borrado" : "Relatório desbloqueado",
        description: blurred
          ? "O relatório está agora borrado para não-admins."
          : "O relatório está agora visível para todos.",
      });
    },
    onError: () => {
      toast({ title: "Erro", description: "Não foi possível alterar o blur.", variant: "destructive" });
    },
  });

  // Update company fields mutation
  const updateCompanyMutation = useMutation({
    mutationFn: (fields: Record<string, string>) => adminCompaniesApi.updateCompany(id, fields),
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Empresa atualizada com sucesso." });
      queryClient.invalidateQueries({ queryKey: ["adminCompany", id] });
      setIsEditingCompany(false);
    },
    onError: (error: Error) => {
      toast({ title: "Erro", description: error.message || "Falha ao atualizar empresa.", variant: "destructive" });
    },
  });

  const handleNewChallengeClick = () => {
    setShowChallengeDialog(true);
  };

  // Handle viewing a report - generate access code if needed
  const handleViewReport = async (analysis: AnalysisHistoryItem) => {
    // If we already have an access code, navigate directly
    if (analysis.access_code) {
      router.push(`/report/${analysis.access_code}?preview=admin`);
      return;
    }

    // Generate access code first
    setGeneratingCodeFor(analysis.analysis_id);
    try {
      const response = await adminApi.generateAccessCode(analysis.analysis_id);
      router.push(`/report/${response.access_code}?preview=admin`);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o código de acesso.",
        variant: "destructive",
      });
    } finally {
      setGeneratingCodeFor(null);
    }
  };

  const handleAnalyzeSubmit = () => {
    if (!newChallenge.trim()) {
      toast({ title: "Erro", description: "Por favor, insira um desafio de negócio.", variant: "destructive" });
      return;
    }
    analyzeNewChallengeMutation.mutate(newChallenge.trim());
  };

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
            message="A empresa solicitada não existe."
            retryLabel="Voltar"
            onRetry={() => router.push("/admin")}
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
          onClick={() => router.push("/admin")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        {/* Company Header */}
        <div className="mb-12">
          <Eyebrow className="flex items-center gap-2 mb-4">
            <Calendar className="w-3 h-3" />
            Criada em {formatInSaoPaulo(company.created_at, "d 'de' MMMM 'de' yyyy")}
          </Eyebrow>

          <Heading variant="section" className="mb-4">
            {company.name}
          </Heading>

          {company.legal_name && company.legal_name !== company.name && (
            <Text variant="body" className="text-text-secondary mb-4">
              {company.legal_name}
            </Text>
          )}

          {/* Admin Actions */}
          <div className="flex flex-wrap gap-3 mt-6">
            {/* Edit Company Button */}
            <Button
              variant={isEditingCompany ? "default" : "outline"}
              onClick={() => setIsEditingCompany(!isEditingCompany)}
            >
              <Pencil className="w-4 h-4 mr-2" />
              {isEditingCompany ? "Cancelar Edição" : "Editar Empresa"}
            </Button>

            <Button
              variant="outline"
              onClick={() => enrichMutation.mutate()}
              disabled={enrichMutation.isPending || enrichmentStatus?.status === 'pending'}
            >
              <Sparkles className={`w-4 h-4 mr-2 ${enrichMutation.isPending ? 'animate-pulse' : ''}`} />
              Enriquecer
            </Button>

            {/* Analisar - uses last submission challenge */}
            <Button
              variant="outline"
              onClick={() => reAnalyzeMutation.mutate()}
              disabled={reAnalyzeMutation.isPending || analyzeNewChallengeMutation.isPending}
              title={lastChallenge ? `Último desafio: ${lastChallenge.slice(0, 50)}...` : 'Usar desafio da última submissão'}
            >
              <BarChart3 className={`w-4 h-4 mr-2 ${reAnalyzeMutation.isPending ? 'animate-pulse' : ''}`} />
              Analisar
            </Button>

            {/* Analisar com novo desafio */}
            <Button
              variant="outline"
              onClick={handleNewChallengeClick}
              disabled={reAnalyzeMutation.isPending || analyzeNewChallengeMutation.isPending}
            >
              <Plus className={`w-4 h-4 mr-2 ${analyzeNewChallengeMutation.isPending ? 'animate-pulse' : ''}`} />
              Novo Desafio
            </Button>
          </div>
        </div>

        {/* Company Editor (when in edit mode) */}
        {isEditingCompany ? (
          <CompanyEditor
            company={company}
            onSave={(fields) => updateCompanyMutation.mutate(fields)}
            onCancel={() => setIsEditingCompany(false)}
            isSaving={updateCompanyMutation.isPending}
          />
        ) : (
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
                  {company.cnpj && <InfoItem label="CNPJ" value={company.cnpj} />}
                  {company.industry && <InfoItem label="Indústria" value={company.industry} />}
                  {company.sector && <InfoItem label="Setor" value={company.sector} />}
                  {company.company_size && <InfoItem label="Porte" value={company.company_size} />}
                  {company.employees_range && <InfoItem label="Funcionários" value={company.employees_range} />}
                  {company.location && <InfoItem label="Localização" value={company.location} icon={<MapPin className="w-4 h-4" />} />}
                  {company.headquarters && <InfoItem label="Sede" value={company.headquarters} />}
                  {company.foundation_year && <InfoItem label="Fundação" value={company.foundation_year} />}
                  {company.funding_stage && <InfoItem label="Estágio de Financiamento" value={company.funding_stage} />}
                  {company.target_market && <InfoItem label="Mercado Alvo" value={company.target_market} />}
                  {company.target_audience && <InfoItem label="Público Alvo" value={company.target_audience} />}
                  {company.business_model && <InfoItem label="Modelo de Negócio" value={company.business_model} />}
                  {company.revenue_estimate && <InfoItem label="Receita Estimada" value={company.revenue_estimate} />}
                  {company.owner_id && <InfoItem label="Proprietário (ID)" value={company.owner_id.slice(0, 8) + "..."} />}
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
                <CardContent className="space-y-4">
                  {company.strengths && company.strengths.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2 text-sm">Pontos Fortes</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {company.strengths.map((item: string, idx: number) => (
                          <li key={idx} className="text-xs text-text-secondary">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {company.weaknesses && company.weaknesses.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-red-700 mb-2 text-sm">Pontos Fracos</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {company.weaknesses.map((item: string, idx: number) => (
                          <li key={idx} className="text-xs text-text-secondary">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {company.competitors && company.competitors.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-text-primary mb-2 text-sm">Concorrentes</h4>
                      <div className="flex flex-wrap gap-1">
                        {company.competitors.map((competitor: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">{competitor}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {company.digital_maturity !== undefined && company.digital_maturity !== null && (
                    <div>
                      <h4 className="font-semibold text-text-primary mb-2 text-sm">Maturidade Digital</h4>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gold-500 rounded-full"
                            style={{ width: `${Math.min((company.digital_maturity / 10) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{Math.min(company.digital_maturity, 10)}/10</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrichment Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Status do Enriquecimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!enrichmentStatus ? (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3 text-gray-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">Nenhum enriquecimento realizado</span>
                    </div>
                  </div>
                ) : enrichmentStatus.status === 'pending' ? (
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-center gap-3 text-amber-700 mb-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm font-medium">Em processamento...</span>
                    </div>
                    <div className="text-xs text-amber-600">
                      {enrichmentStatus.current_step || 'Aguardando'}
                    </div>
                    <div className="mt-2 w-full bg-amber-200 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${enrichmentStatus.progress}%` }}
                      />
                    </div>
                  </div>
                ) : enrichmentStatus.status === 'completed' ? (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3 text-green-700 mb-1">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Completo</span>
                    </div>
                    {enrichmentStatus.completed_at && (
                      <p className="text-xs text-green-600">
                        {formatInSaoPaulo(enrichmentStatus.completed_at, "d 'de' MMM 'de' yyyy 'às' HH:mm")}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-3 text-red-700 mb-1">
                      <XCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Falhou</span>
                    </div>
                    {enrichmentStatus.error_message && (
                      <p className="text-xs text-red-600 truncate">
                        {enrichmentStatus.error_message}
                      </p>
                    )}
                    {enrichmentStatus.updated_at && (
                      <p className="text-xs text-red-500 mt-1">
                        {formatInSaoPaulo(enrichmentStatus.updated_at, "d 'de' MMM 'de' yyyy 'às' HH:mm")}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Enrichment History Card */}
            {enrichmentsHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Histórico de Enriquecimentos
                  </CardTitle>
                  <CardDescription>
                    Todos os enriquecimentos realizados
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {enrichmentsHistory.map((enrichment: EnrichmentStatusInfo, index: number) => {
                    const isPending = enrichment.status === 'pending';
                    const isCompleted = enrichment.status === 'completed';
                    const isFailed = enrichment.status === 'failed';

                    return (
                      <div
                        key={enrichment.enrichment_id}
                        onClick={() => router.push(`/admin/companies/${id}/enrichment/${enrichment.enrichment_id}`)}
                        className={`p-3 rounded-lg border cursor-pointer hover:opacity-80 transition-opacity ${
                          isPending
                            ? 'bg-amber-50 border-amber-200'
                            : isCompleted
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {isPending && (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin text-amber-600" />
                                <span className="text-xs text-amber-600 font-medium">Processando</span>
                              </>
                            )}
                            {isCompleted && (
                              <>
                                <CheckCircle className="w-3 h-3 text-green-600" />
                                <span className="text-xs text-green-600 font-medium">Completo</span>
                              </>
                            )}
                            {isFailed && (
                              <>
                                <XCircle className="w-3 h-3 text-red-600" />
                                <span className="text-xs text-red-600 font-medium">Falhou</span>
                              </>
                            )}
                          </div>
                          <span className={`text-xs ${
                            isPending ? 'text-amber-500' : isCompleted ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {formatInSaoPaulo(enrichment.created_at, "d MMM yyyy HH:mm")}
                          </span>
                        </div>
                        {isPending && enrichment.current_step && (
                          <div className="mt-2">
                            <p className="text-xs text-amber-600 mb-1">{enrichment.current_step}</p>
                            <div className="w-full bg-amber-200 rounded-full h-1.5">
                              <div
                                className="bg-amber-500 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${enrichment.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {isFailed && enrichment.error_message && (
                          <p className="text-xs text-red-600 mt-1 truncate">{enrichment.error_message}</p>
                        )}
                        {index === 0 && (
                          <Badge variant="outline" className="mt-2 text-[10px] bg-white">
                            Mais recente
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Analysis History - Combined with challenges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Análises por Desafio
                </CardTitle>
                <CardDescription>
                  Cada análise é feita para um desafio específico
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysesHistory.length === 0 ? (
                  <div className="text-center py-6">
                    <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <Text variant="small" className="text-text-tertiary">
                      Nenhuma análise realizada ainda.
                    </Text>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={handleNewChallengeClick}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Nova Análise
                    </Button>
                  </div>
                ) : (
                  analysesHistory.map((analysis: AnalysisHistoryItem) => {
                    const isPending = analysis.status === 'pending' || analysis.status === 'processing';
                    const isCompleted = analysis.status === 'completed';
                    const isFailed = analysis.status === 'failed';
                    const isGenerating = generatingCodeFor === analysis.analysis_id;

                    return (
                      <div
                        key={analysis.analysis_id}
                        className={`p-3 rounded-lg border transition-colors ${
                          isPending
                            ? 'bg-amber-50 border-amber-200'
                            : isCompleted
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                        } ${isGenerating ? 'opacity-70 pointer-events-none' : ''}`}
                      >
                        {/* Challenge Title */}
                        <p className={`text-sm font-medium mb-1 ${
                          isPending ? 'text-amber-800' : isCompleted ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {truncateText(analysis.business_challenge, 80)}
                        </p>

                        {/* Status Row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {isPending && (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin text-amber-600" />
                                <span className="text-xs text-amber-600">Processando...</span>
                              </>
                            )}
                            {isCompleted && (
                              <>
                                <CheckCircle className="w-3 h-3 text-green-600" />
                                <span className="text-xs text-green-600">
                                  {analysis.completed_at
                                    ? formatInSaoPaulo(analysis.completed_at, "d MMM yyyy HH:mm")
                                    : 'Concluído'}
                                </span>
                              </>
                            )}
                            {isFailed && (
                              <>
                                <XCircle className="w-3 h-3 text-red-600" />
                                <span className="text-xs text-red-600">Falhou</span>
                              </>
                            )}
                          </div>

                          {/* Action Badges */}
                          <div className="flex items-center gap-1">
                            {isCompleted && (
                              <>
                                {/* Blur Toggle - per analysis */}
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] px-1.5 py-0.5 cursor-pointer ${
                                    analysis.is_blurred
                                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                      : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleBlurMutation.mutate({
                                      analysisId: analysis.analysis_id,
                                      blurred: !analysis.is_blurred,
                                    });
                                  }}
                                >
                                  {analysis.is_blurred ? (
                                    <>
                                      <Eye className="w-2 h-2 mr-0.5" />
                                      Desborrar
                                    </>
                                  ) : (
                                    <>
                                      <EyeOff className="w-2 h-2 mr-0.5" />
                                      Borrar
                                    </>
                                  )}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-700 hover:bg-amber-100 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/admin/companies/${id}/analysis/${analysis.analysis_id}`);
                                  }}
                                >
                                  <Pencil className="w-2 h-2 mr-0.5" />
                                  Editar
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (!isGenerating) {
                                      handleViewReport(analysis);
                                    }
                                  }}
                                >
                                  {isGenerating ? (
                                    <Loader2 className="w-2 h-2 mr-0.5 animate-spin" />
                                  ) : (
                                    <FileText className="w-2 h-2 mr-0.5" />
                                  )}
                                  {isGenerating ? 'Abrindo...' : 'Ver'}
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        )}

        {/* Challenge Input Dialog */}
        <Dialog open={showChallengeDialog} onOpenChange={setShowChallengeDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Nova Análise Estratégica</DialogTitle>
              <DialogDescription>
                Descreva o desafio de negócio que será analisado. A análise será baseada nos dados enriquecidos da empresa.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                placeholder="Ex: Como expandir para o mercado internacional mantendo a qualidade do atendimento ao cliente?"
                value={newChallenge}
                onChange={(e) => setNewChallenge(e.target.value)}
                className="min-h-[120px]"
              />
              <p className="text-xs text-text-tertiary mt-2">
                Seja específico sobre o desafio. Isso ajuda a IA a focar a análise nos pontos mais relevantes.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowChallengeDialog(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleAnalyzeSubmit}
                disabled={analyzeNewChallengeMutation.isPending || !newChallenge.trim()}
              >
                {analyzeNewChallengeMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Iniciando...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Iniciar Análise
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Container>
    </Section>
  );
}
