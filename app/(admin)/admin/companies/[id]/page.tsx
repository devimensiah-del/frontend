"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminCompaniesApi, adminApi } from "@/lib/api/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingState, ErrorState } from "@/components/ui/state-components";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanyActions } from "@/components/admin/CompanyActions";
import { ReportVisibilityControls } from "@/components/admin/ReportVisibilityControls";
import { AnalysisHistoryItem } from "@/lib/types";
import {
  ArrowLeft,
  Building2,
  Sparkles,
  BarChart3,
  CheckCircle,
  Loader2,
  XCircle,
  AlertCircle,
  FileText,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AdminCompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [updatingVisibilityFor, setUpdatingVisibilityFor] = React.useState<string | null>(null);
  const [generatingCodeFor, setGeneratingCodeFor] = React.useState<string | null>(null);

  // Fetch company details
  const { data: companyData, isLoading, error } = useQuery({
    queryKey: ["adminCompany", id],
    queryFn: () => adminCompaniesApi.getById(id),
    refetchInterval: (query) => {
      const analyses = query.state.data?.analyses_history || [];
      const hasPending = analyses.some((a: AnalysisHistoryItem) =>
        a.status === "pending" || a.status === "processing"
      );
      return hasPending ? 5000 : false;
    },
  });

  const company = companyData?.company;
  const submissions = companyData?.submissions || [];
  const enrichmentStatus = companyData?.enrichment_status;
  const analysesHistory = companyData?.analyses_history || [];

  // Handle visibility toggles
  const handleVisibilityToggle = async (analysisId: string, visible: boolean) => {
    setUpdatingVisibilityFor(analysisId);
    try {
      await adminApi.toggleVisibility(analysisId, visible);
      queryClient.invalidateQueries({ queryKey: ["adminCompany", id] });
      toast({
        title: visible ? "Relatório visível" : "Relatório oculto",
        description: visible
          ? "O relatório agora está visível para o usuário."
          : "O relatório não está mais visível para o usuário.",
      });
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível alterar a visibilidade.", variant: "destructive" });
    } finally {
      setUpdatingVisibilityFor(null);
    }
  };

  const handlePublicToggle = async (analysisId: string, isPublic: boolean) => {
    setUpdatingVisibilityFor(analysisId);
    try {
      await adminApi.togglePublic(analysisId, isPublic);
      queryClient.invalidateQueries({ queryKey: ["adminCompany", id] });
      toast({
        title: isPublic ? "Acesso público" : "Acesso privado",
        description: isPublic
          ? "Qualquer pessoa com o link pode acessar o relatório."
          : "O relatório requer login para acesso.",
      });
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível alterar o acesso público.", variant: "destructive" });
    } finally {
      setUpdatingVisibilityFor(null);
    }
  };

  const handleBlurToggle = async (analysisId: string, blurred: boolean) => {
    setUpdatingVisibilityFor(analysisId);
    try {
      await adminApi.toggleBlur(analysisId, blurred);
      queryClient.invalidateQueries({ queryKey: ["adminCompany", id] });
      toast({
        title: blurred ? "Premium bloqueado" : "Premium liberado",
        description: blurred
          ? "As seções premium estão com blur (paywall)."
          : "Todas as seções estão totalmente visíveis.",
      });
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível alterar o blur.", variant: "destructive" });
    } finally {
      setUpdatingVisibilityFor(null);
    }
  };

  const handleViewReport = async (analysis: AnalysisHistoryItem) => {
    if (analysis.access_code) {
      router.push(`/report/${analysis.access_code}?preview=admin`);
      return;
    }

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

  if (isLoading) {
    return <LoadingState message="Carregando detalhes da empresa..." size="lg" />;
  }

  if (error || !company) {
    return (
      <ErrorState
        title="Empresa não encontrada"
        message="A empresa solicitada não existe."
        retryLabel="Voltar"
        onRetry={() => router.push("/admin/companies")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/companies")}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{company.name}</h1>
        {company.legal_name && company.legal_name !== company.name && (
          <p className="text-gray-400">{company.legal_name}</p>
        )}
      </div>

      <CompanyActions companyId={id} />

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="bg-gray-900 border-gray-800">
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="enrichment">Enriquecimento</TabsTrigger>
          <TabsTrigger value="analyses">Análises</TabsTrigger>
          <TabsTrigger value="submissions">Submissões</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Informações da Empresa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {company.cnpj && (
                  <div>
                    <div className="text-sm text-gray-400">CNPJ</div>
                    <div className="text-white">{company.cnpj}</div>
                  </div>
                )}
                {company.industry && (
                  <div>
                    <div className="text-sm text-gray-400">Indústria</div>
                    <div className="text-white">{company.industry}</div>
                  </div>
                )}
                {company.company_size && (
                  <div>
                    <div className="text-sm text-gray-400">Porte</div>
                    <div className="text-white">{company.company_size}</div>
                  </div>
                )}
                {company.location && (
                  <div>
                    <div className="text-sm text-gray-400">Localização</div>
                    <div className="text-white">{company.location}</div>
                  </div>
                )}
                {company.website && (
                  <div>
                    <div className="text-sm text-gray-400">Website</div>
                    <a
                      href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold-500 hover:text-gold-400 flex items-center gap-1"
                    >
                      {company.website}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enrichment">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Status do Enriquecimento</CardTitle>
            </CardHeader>
            <CardContent>
              {!enrichmentStatus ? (
                <div className="p-4 bg-gray-800 rounded-lg text-gray-400">
                  Nenhum enriquecimento realizado
                </div>
              ) : enrichmentStatus.status === "pending" ? (
                <div className="p-4 bg-amber-950 border border-amber-800 rounded-lg">
                  <div className="flex items-center gap-3 text-amber-500 mb-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="font-medium">Em processamento...</span>
                  </div>
                  <div className="text-sm text-amber-400">{enrichmentStatus.current_step || "Aguardando"}</div>
                </div>
              ) : enrichmentStatus.status === "completed" ? (
                <div className="p-4 bg-green-950 border border-green-800 rounded-lg">
                  <div className="flex items-center gap-3 text-green-500">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Completo</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-red-950 border border-red-800 rounded-lg">
                  <div className="flex items-center gap-3 text-red-500 mb-2">
                    <XCircle className="w-5 h-5" />
                    <span className="font-medium">Falhou</span>
                  </div>
                  {enrichmentStatus.error_message && (
                    <div className="text-sm text-red-400">{enrichmentStatus.error_message}</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analyses">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Histórico de Análises</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysesHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  Nenhuma análise realizada ainda.
                </div>
              ) : (
                analysesHistory.map((analysis: AnalysisHistoryItem) => {
                  const isCompleted = analysis.status === "completed";
                  const isPending = analysis.status === "pending" || analysis.status === "processing";
                  const isGenerating = generatingCodeFor === analysis.analysis_id;

                  return (
                    <div
                      key={analysis.analysis_id}
                      className="p-4 bg-gray-800 border border-gray-700 rounded-lg space-y-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="text-white font-medium mb-1">
                            {analysis.business_challenge}
                          </div>
                          <div className="flex items-center gap-2">
                            {isPending && (
                              <Badge variant="outline" className="text-xs bg-amber-950 text-amber-400 border-amber-800">
                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                Processando
                              </Badge>
                            )}
                            {isCompleted && (
                              <Badge variant="default" className="text-xs bg-green-600 text-white">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Completo
                              </Badge>
                            )}
                            {analysis.status === "failed" && (
                              <Badge variant="error" className="text-xs">
                                <XCircle className="w-3 h-3 mr-1" />
                                Falhou
                              </Badge>
                            )}
                          </div>
                        </div>

                        {isCompleted && (
                          <div className="flex items-center gap-2">
                            <ReportVisibilityControls
                              isVisibleToUser={analysis.is_visible_to_user ?? false}
                              isPublic={analysis.is_public ?? false}
                              isBlurred={analysis.is_blurred ?? true}
                              isLoading={updatingVisibilityFor === analysis.analysis_id}
                              onVisibilityChange={(visible) => handleVisibilityToggle(analysis.analysis_id, visible)}
                              onPublicChange={(isPublic) => handlePublicToggle(analysis.analysis_id, isPublic)}
                              onBlurChange={(blurred) => handleBlurToggle(analysis.analysis_id, blurred)}
                              variant="compact"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewReport(analysis)}
                              disabled={isGenerating}
                              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                            >
                              {isGenerating ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <FileText className="w-4 h-4 mr-2" />
                              )}
                              Ver
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Submissões</CardTitle>
            </CardHeader>
            <CardContent>
              {submissions.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  Nenhuma submissão encontrada.
                </div>
              ) : (
                <div className="space-y-3">
                  {submissions.map((sub) => (
                    <div
                      key={sub.submission_id}
                      className="p-4 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-750 transition-colors"
                      onClick={() => router.push(`/admin/submissions/${sub.submission_id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">
                            Submissão #{sub.submission_id.slice(0, 8)}
                          </div>
                          <div className="text-sm text-gray-400">
                            {format(new Date(sub.linked_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </div>
                        </div>
                        {sub.is_primary && (
                          <Badge variant="outline" className="text-xs bg-gold-950 text-gold-400 border-gold-800">
                            Primária
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
