"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, submissionsApi, enrichmentApi, analysisApi, authApi, reportApi } from "@/lib/api/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Section, Container } from "@/components/editorial/Section";
import { LoadingState, ErrorState, NoDataYet } from "@/components/ui/state-components";
import { EnrichmentDetails } from "@/app/(dashboard)/_components/EnrichmentDetails";
import { AnalysisDetails } from "@/app/(dashboard)/_components/AnalysisDetails";
import { Select, SelectOption } from "@/components/ui/Select";
import { SendAnalysisDialog } from "@/app/(dashboard)/_components/SendAnalysisDialog";
import { WorkflowProgress } from "@/app/(dashboard)/_components/WorkflowProgress";
import { WorkflowStatusBanner } from "@/app/(dashboard)/_components/WorkflowStatusBanner";
import { Download, CheckCircle, Send, FileText } from "lucide-react";

export default function SubmissionPage() {
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState("enrichment");
  const [showSendDialog, setShowSendDialog] = React.useState(false);

  // 1. Fetch User Role
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: authApi.getCurrentUser,
  });
  const isAdmin = user?.role === "admin";

  // 2. Fetch Data
  const { data: submission, isLoading: isLoadingSubmission } = useQuery({
    queryKey: ["submission", id],
    queryFn: () => isAdmin ? adminApi.getSubmission(id) : submissionsApi.getById(id),
  });

  const { data: enrichment } = useQuery({
    queryKey: ["enrichment", id],
    queryFn: () => isAdmin ? adminApi.getEnrichmentBySubmissionId(id) : enrichmentApi.getBySubmissionId(id),
    enabled: !!submission,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'pending' ? 5000 : false;
    },
  });

  const { data: analysis } = useQuery({
    queryKey: ["analysis", id],
    queryFn: () => analysisApi.getBySubmissionId(id), // User/Admin both use this to get latest
    enabled: !!submission,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'pending' ? 5000 : false;
    },
  });
  const { data: reportStatus } = useQuery({
    queryKey: ["report", id],
    queryFn: async () => {
      try {
        return await reportApi.downloadReport(id);
      } catch {
        // PDF not ready yet (404/202) - keep polling
        return null;
      }
    },
    enabled: !!submission && isAdmin && analysis?.status === 'approved',
    refetchInterval: (query) => {
      const ready = (query.state.data as any)?.pdf_url;
      return ready ? false : 5000;
    },
    retry: true,
  });
  const pdfReady = !!(reportStatus as any)?.pdf_url;
  const approveEnrichmentMutation = useMutation({
    mutationFn: () => adminApi.approveEnrichment(enrichment!.id),
    onSuccess: async () => {
      toast({ title: "Sucesso", description: "Enriquecimento aprovado. Análise será iniciada em breve." });
      // Immediately refetch to update UI
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["enrichment", id] }),
        queryClient.invalidateQueries({ queryKey: ["analysis", id] }),
      ]);
      // Auto-switch to Analysis tab
      setActiveTab("analysis");
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível aprovar o enriquecimento.",
        variant: "destructive"
      });
      console.error("Error approving enrichment:", error);
    }
  });

  const approveAnalysisMutation = useMutation({
    mutationFn: () => adminApi.approveAnalysis(analysis!.id),
    onSuccess: async () => {
      toast({ title: "Sucesso", description: "Análise aprovada. Gerando PDF..." });
      // Immediately refetch to update UI
      await queryClient.invalidateQueries({ queryKey: ["analysis", id] });
      // Start polling for report/PDF
      await queryClient.invalidateQueries({ queryKey: ["report", id] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível aprovar a análise.",
        variant: "destructive"
      });
      console.error("Error approving analysis:", error);
    }
  });

  const sendAnalysisMutation = useMutation({
    mutationFn: () => adminApi.sendAnalysis(analysis!.id, submission!.contactEmail || ""), // Use submission email
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Análise liberada para o cliente." });
      queryClient.invalidateQueries({ queryKey: ["analysis", id] });
      setShowSendDialog(false);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível liberar a análise.",
        variant: "destructive"
      });
      console.error("Error sending analysis:", error);
    }
  });

  const updateEnrichmentMutation = useMutation({
    mutationFn: (data: any) => adminApi.updateEnrichment(enrichment!.id, data),
    onSuccess: () => {
      toast({ title: "Atualizado", description: "Dados de enriquecimento salvos." });
      queryClient.invalidateQueries({ queryKey: ["enrichment", id] });
    }
  });

  const updateAnalysisMutation = useMutation({
    mutationFn: (data: any) => adminApi.updateAnalysis(analysis!.id, data),
    onSuccess: () => {
      toast({ title: "Atualizado", description: "Análise salva." });
      queryClient.invalidateQueries({ queryKey: ["analysis", id] });
    }
  });

  // Direct update mutation - no versioning in new architecture
  // Only allowed when analysis.status === 'completed'
  const saveAnalysisEditsMutation = useMutation({
    mutationFn: async (data: any) => {
      return adminApi.updateAnalysis(analysis!.id, data);
    },
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Análise atualizada com sucesso." });
      queryClient.invalidateQueries({ queryKey: ["analysis", id] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as alterações. Verifique se a análise está no status 'completed'.",
        variant: "destructive"
      });
      console.error("Error saving analysis edits:", error);
    }
  });

  const retryEnrichmentMutation = useMutation({
    mutationFn: () => adminApi.retryEnrichment(submission!.id),
    onSuccess: () => {
      toast({ title: "Solicitado", description: "Enriquecimento reiniciado." });
      queryClient.invalidateQueries({ queryKey: ["enrichment", id] });
    }
  });

  const downloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ submission, enrichment, analysis }, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `project_${id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // Determine if we can approve something
  const canApproveEnrichment = enrichment?.status === 'completed';
  const canApproveAnalysis = analysis?.status === 'completed';
  const canSendToClient = analysis?.status === 'approved' && pdfReady;

  if (isLoadingSubmission) {
    return (
      <Section className="bg-gray-50 min-h-screen border-0">
        <Container>
          <LoadingState
            message="Carregando detalhes do projeto..."
            size="lg"
          />
        </Container>
      </Section>
    );
  }

  if (!submission) {
    return (
      <Section className="bg-gray-50 min-h-screen border-0">
        <Container className="py-12">
          <ErrorState
            title="Projeto não encontrado"
            message="O projeto que você está procurando não existe ou você não tem permissão para visualizá-lo."
            variant="warning"
          />
        </Container>
      </Section>
    );
  }

  return (
    <Section className="bg-gray-50 min-h-screen border-0">
      <Container className="px-4 py-4 sm:px-6 sm:py-6 lg:px-12 lg:py-8">
        {/* Compact Header - Horizontal Layout */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
          {/* Left: Company Info */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Projeto
            </p>
            <h1 className="text-xl md:text-2xl font-bold text-navy-900 truncate">
              {submission.companyName}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              ID: {submission.id.slice(0, 8)}
            </p>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Download JSON - Always available for admin */}
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={downloadJson}
                className="h-9 text-sm whitespace-nowrap"
              >
                <Download className="w-4 h-4 mr-1.5 flex-shrink-0" />
                Exportar JSON
              </Button>
            )}

            {/* Approve Enrichment */}
            {isAdmin && canApproveEnrichment && (
              <Button
                variant="default"
                size="sm"
                onClick={() => approveEnrichmentMutation.mutate()}
                disabled={approveEnrichmentMutation.isPending}
                className="h-9 text-sm bg-amber-600 hover:bg-amber-700 whitespace-nowrap"
              >
                <CheckCircle className="w-4 h-4 mr-1.5 flex-shrink-0" />
                Aprovar Enriquecimento
              </Button>
            )}

            {/* Approve Analysis */}
            {isAdmin && canApproveAnalysis && (
              <Button
                variant="default"
                size="sm"
                onClick={() => approveAnalysisMutation.mutate()}
                disabled={approveAnalysisMutation.isPending}
                className="h-9 text-sm bg-amber-600 hover:bg-amber-700 whitespace-nowrap"
              >
                <CheckCircle className="w-4 h-4 mr-1.5 flex-shrink-0" />
                Aprovar Análise
              </Button>
            )}

            {/* Send to Client */}
            {isAdmin && canSendToClient && (
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowSendDialog(true)}
                className="h-9 text-sm bg-green-600 hover:bg-green-700 whitespace-nowrap"
              >
                <Send className="w-4 h-4 mr-1.5 flex-shrink-0" />
                Liberar para Cliente
              </Button>
            )}

            {/* User: Download PDF */}
            {!isAdmin && analysis?.status === 'sent' && (
              <Button
                variant="default"
                size="sm"
                onClick={() => window.open(analysis.pdf_url || analysis.pdfUrl || '#', '_blank')}
                className="h-9 text-sm bg-green-600 hover:bg-green-700 whitespace-nowrap"
              >
                <FileText className="w-4 h-4 mr-1.5 flex-shrink-0" />
                Baixar Relatório PDF
              </Button>
            )}
          </div>
        </div>

        {/* Status Banner */}
        <div className="mb-4">
          <WorkflowStatusBanner
            enrichmentStatus={enrichment?.status}
            analysisStatus={analysis?.status}
            pdfReady={pdfReady}
            isAdmin={isAdmin}
          />
        </div>

        {/* Section Selector + Content */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Dropdown Selector */}
          <div className="lg:w-[200px] flex-shrink-0">
            <Select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full"
            >
              <SelectOption value="enrichment">Enriquecimento</SelectOption>
              <SelectOption value="analysis">Análise</SelectOption>
            </Select>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsContent value="enrichment" className="mt-0">
                <Card className="border border-gray-200 shadow-sm">
                  <CardContent className="p-4 sm:p-6">
                    {!enrichment ? (
                      <NoDataYet
                        dataType="Enriquecimento"
                        expectedWhen="Os dados serão gerados automaticamente. Aguarde alguns minutos."
                        className="py-6"
                      />
                    ) : (
                      <EnrichmentDetails
                        enrichment={enrichment}
                        isAdmin={isAdmin}
                        onUpdate={updateEnrichmentMutation.mutate}
                        onRetry={retryEnrichmentMutation.mutate}
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analysis" className="mt-0">
                {/* User: Show progress if not ready */}
                {!isAdmin && (!analysis || (analysis.status !== 'approved' && analysis.status !== 'sent')) ? (
                  <Card className="border border-gray-200 shadow-sm">
                    <CardContent className="p-4 sm:p-6">
                      <WorkflowProgress
                        enrichmentStatus={enrichment?.status}
                        analysisStatus={analysis?.status}
                        isAdmin={false}
                      />
                    </CardContent>
                  </Card>
                ) : !isAdmin && (analysis?.status === 'approved' || analysis?.status === 'sent') ? (
                  /* User: Show analysis when ready */
                  <Card className="border border-gray-200 shadow-sm">
                    <CardContent className="p-4 sm:p-6">
                      <AnalysisDetails
                        analysis={analysis}
                        isAdmin={false}
                        onUpdate={() => {}}
                      />
                    </CardContent>
                  </Card>
                ) : (
                  /* Admin: Always show analysis details */
                  <Card className="border border-gray-200 shadow-sm">
                    <CardContent className="p-4 sm:p-6">
                      {!analysis ? (
                        <NoDataYet
                          dataType="Análise"
                          expectedWhen="A análise será iniciada automaticamente após aprovação do enriquecimento."
                          className="py-6"
                        />
                      ) : (
                        <AnalysisDetails
                          analysis={analysis}
                          isAdmin={isAdmin}
                          onUpdate={saveAnalysisEditsMutation.mutate}
                        />
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Send Analysis Confirmation Dialog */}
        {showSendDialog && submission && (
          <SendAnalysisDialog
            open={showSendDialog}
            onOpenChange={setShowSendDialog}
            onConfirm={() => sendAnalysisMutation.mutate()}
            userEmail={submission.contactEmail || ""}
            companyName={submission.companyName}
            isLoading={sendAnalysisMutation.isPending}
          />
        )}
      </Container>
    </Section>
  );
}
