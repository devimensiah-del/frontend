"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, submissionsApi, enrichmentApi, analysisApi, authApi, reportApi } from "@/lib/api/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/Input";
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
import { ProgressBar } from "@/components/workflow";
import { computeAdminStage, computeUserStage, getStageTransition, type AdminStage } from "@/lib/utils/workflow-stages";
import { Download, Eye, EyeOff, Share2, ExternalLink, Copy } from "lucide-react";

export default function SubmissionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState("enrichment");
  const [showSendDialog, setShowSendDialog] = React.useState(false);
  const [showAccessCodeDialog, setShowAccessCodeDialog] = React.useState(false);
  const [accessCodeInput, setAccessCodeInput] = React.useState("");
  const [isNavigatingToReport, setIsNavigatingToReport] = React.useState(false);
  const [showShareDialog, setShowShareDialog] = React.useState(false);
  const [shareableUrl, setShareableUrl] = React.useState<string | null>(null);
  const [isGeneratingCode, setIsGeneratingCode] = React.useState(false);

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
    queryFn: () => isAdmin ? adminApi.getAnalysisBySubmissionId(id) : analysisApi.getBySubmissionId(id),
    enabled: !!submission,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'pending' ? 5000 : false;
    },
  });
  // PDF DISABLED - TEMPORARY
  // const { data: reportStatus } = useQuery({
  //   queryKey: ["report", id],
  //   queryFn: async () => {
  //     try {
  //       return await reportApi.downloadReport(id);
  //     } catch {
  //       // PDF not ready yet (404/202) - keep polling
  //       return null;
  //     }
  //   },
  //   enabled: !!submission && isAdmin && analysis?.status === 'approved',
  //   refetchInterval: (query) => {
  //     const ready = (query.state.data as any)?.pdf_url;
  //     return ready ? false : 5000;
  //   },
  //   retry: true,
  // });
  // const pdfReady = !!(reportStatus as any)?.pdf_url;
  const pdfReady = false; // PDF DISABLED - TEMPORARY

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

  // Stage change mutation - handles all stage transitions via the progress bar
  const stageChangeMutation = useMutation({
    mutationFn: async (targetStage: number) => {
      const currentStage = computeAdminStage(enrichment?.status, analysis?.status, isVisibleToUser);
      const transition = getStageTransition(currentStage as AdminStage, targetStage as AdminStage);

      if (!transition) return;

      switch (transition.action) {
        case 'approveEnrichment':
          await adminApi.approveEnrichment(enrichment!.id);
          break;
        case 'reopenEnrichment':
          await adminApi.reopenEnrichment(enrichment!.id);
          break;
        case 'approveAnalysis':
          await adminApi.approveAnalysis(analysis!.id);
          break;
        case 'reopenAnalysis':
          await adminApi.reopenAnalysis(analysis!.id);
          break;
        case 'toggleVisibility':
          await adminApi.toggleVisibility(analysis!.id, transition.params?.visible ?? false);
          break;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrichment", id] });
      queryClient.invalidateQueries({ queryKey: ["analysis", id] });
      toast({
        title: "Sucesso",
        description: "Estágio atualizado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível alterar o estágio.",
        variant: "destructive"
      });
      console.error("Error changing stage:", error);
    }
  });

  // Blur toggle mutation - controls premium content blur on report
  const blurToggleMutation = useMutation({
    mutationFn: async (blurred: boolean) => {
      return adminApi.toggleBlur(analysis!.id, blurred);
    },
    onSuccess: (_, blurred) => {
      queryClient.invalidateQueries({ queryKey: ["analysis", id] });
      toast({
        title: blurred ? "Premium bloqueado" : "Premium desbloqueado",
        description: blurred
          ? "As análises premium estão agora ocultas para o cliente."
          : "As análises premium estão agora visíveis para o cliente.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status de blur.",
        variant: "destructive"
      });
      console.error("Error toggling blur:", error);
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

  // Handle viewing the report
  const handleViewReport = async () => {
    if (!analysis) return;

    if (isAdmin) {
      // Admin: generate access code if needed, then navigate with preview=admin
      // This allows admins to see the report even if visibility is OFF
      setIsNavigatingToReport(true);
      try {
        // Check if analysis already has an access code
        const existingCode = (analysis as any).accessCode || (analysis as any).access_code;
        if (existingCode) {
          router.push(`/report/${existingCode}?preview=admin`);
          return;
        }

        // Generate new access code
        const response = await adminApi.generateAccessCode(analysis.id);
        router.push(`/report/${response.access_code}?preview=admin`);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível gerar o código de acesso.",
          variant: "destructive"
        });
        console.error("Error generating access code:", error);
      } finally {
        setIsNavigatingToReport(false);
      }
    } else {
      // Non-admin: show dialog to enter access code
      setShowAccessCodeDialog(true);
    }
  };

  // Handle access code submission from non-admin
  const handleAccessCodeSubmit = () => {
    if (!accessCodeInput.trim()) {
      toast({
        title: "Código inválido",
        description: "Por favor, insira um código de acesso válido.",
        variant: "destructive"
      });
      return;
    }
    router.push(`/report/${accessCodeInput.trim().toUpperCase()}`);
    setShowAccessCodeDialog(false);
    setAccessCodeInput("");
  };

  // Handle share link generation
  const handleShareLink = async () => {
    if (!analysis) return;

    // If we already have an access code, show it
    const existingCode = (analysis as any).accessCode || (analysis as any).access_code;
    if (existingCode) {
      const baseUrl = window.location.origin;
      setShareableUrl(`${baseUrl}/report/${existingCode}`);
      setShowShareDialog(true);
      return;
    }

    // Generate new access code
    setIsGeneratingCode(true);
    setShowShareDialog(true);

    try {
      const response = await adminApi.generateAccessCode(analysis.id);
      setShareableUrl(response.shareable_url);
      toast({
        title: "Link gerado",
        description: "Link de compartilhamento criado.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o link.",
        variant: "destructive"
      });
      setShowShareDialog(false);
    } finally {
      setIsGeneratingCode(false);
    }
  };

  // Handle copy link
  const handleCopyLink = async () => {
    if (!shareableUrl) return;
    try {
      await navigator.clipboard.writeText(shareableUrl);
      toast({ title: "Copiado!", description: "Link copiado." });
    } catch {
      toast({ title: "Erro", description: "Não foi possível copiar.", variant: "destructive" });
    }
  };

  // Get visibility status
  const isVisibleToUser = analysis && ((analysis as any).isVisibleToUser ?? (analysis as any).is_visible_to_user ?? false);

  // Get blur status (default to true = blurred)
  const isBlurred = analysis ? ((analysis as any).isBlurred ?? (analysis as any).is_blurred ?? true) : true;

  // Consolidated release state: analysis is approved AND visible
  const isReleased = analysis?.status === 'approved' && isVisibleToUser;

  // Can view report if analysis is completed, approved, or sent
  const canViewReport = analysis && ['completed', 'approved', 'sent'].includes(analysis.status);

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
            {/* Download JSON - Admin only */}
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={downloadJson}
              >
                <Download className="w-4 h-4 mr-1.5 flex-shrink-0" />
                Exportar JSON
              </Button>
            )}


            {/* Admin: Blur Toggle (Premium unlock) - Only when analysis is approved AND visible to user (stage 6) */}
            {isAdmin && analysis?.status === 'approved' && isVisibleToUser && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => blurToggleMutation.mutate(!isBlurred)}
                disabled={blurToggleMutation.isPending}
                className={isBlurred
                  ? "border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-100"
                  : "border-blue-400 bg-blue-50 text-blue-700 hover:bg-blue-100"
                }
                title={isBlurred ? 'Desbloquear análises premium' : 'Bloquear análises premium'}
              >
                {blurToggleMutation.isPending ? (
                  <span className="w-4 h-4 mr-1.5 opacity-50">...</span>
                ) : isBlurred ? (
                  <EyeOff className="w-4 h-4 mr-1.5 text-amber-600" />
                ) : (
                  <Eye className="w-4 h-4 mr-1.5 text-blue-600" />
                )}
                {isBlurred ? 'Premium Bloqueado' : 'Premium Liberado'}
              </Button>
            )}

            {/* Admin: Copy Link - Only when released */}
            {isAdmin && isReleased && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareLink}
              >
                <Share2 className="w-4 h-4 mr-1.5 flex-shrink-0" />
                Copiar Link
              </Button>
            )}

            {/* Admin: Visualizar - Only when analysis exists */}
            {isAdmin && canViewReport && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewReport}
                disabled={isNavigatingToReport}
              >
                <ExternalLink className="w-4 h-4 mr-1.5 flex-shrink-0" />
                Visualizar
              </Button>
            )}

            {/* Non-admin: View Report - Only when visible to user (stage 6) */}
            {!isAdmin && canViewReport && isVisibleToUser && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewReport}
                disabled={isNavigatingToReport}
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <Eye className="w-4 h-4 mr-1.5 flex-shrink-0" />
                Ver Relatório
              </Button>
            )}

            {/* Send to Client - DISABLED since PDF is disabled */}
            {/* {isAdmin && canSendToClient && (
              <Button
                size="sm"
                onClick={() => setShowSendDialog(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Send className="w-4 h-4 mr-1.5 flex-shrink-0" />
                Liberar para Cliente
              </Button>
            )} */}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <ProgressBar
            currentStage={
              isAdmin
                ? computeAdminStage(enrichment?.status, analysis?.status, isVisibleToUser)
                : computeUserStage(enrichment?.status, analysis?.status, isVisibleToUser)
            }
            isAdmin={isAdmin}
            enrichmentStatus={enrichment?.status}
            analysisStatus={analysis?.status}
            onStageChange={isAdmin ? (stage) => stageChangeMutation.mutateAsync(stage) : undefined}
            isLoading={stageChangeMutation.isPending}
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
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analysis" className="mt-0">
                {/* User: Show progress if not ready OR not visible to user yet */}
                {!isAdmin && (!analysis || !isVisibleToUser || (analysis.status !== 'approved' && analysis.status !== 'sent')) ? (
                  <Card className="border border-gray-200 shadow-sm">
                    <CardContent className="p-4 sm:p-6">
                      <WorkflowProgress
                        enrichmentStatus={enrichment?.status}
                        analysisStatus={analysis?.status}
                        isAdmin={false}
                      />
                    </CardContent>
                  </Card>
                ) : !isAdmin && isVisibleToUser && (analysis?.status === 'approved' || analysis?.status === 'sent') ? (
                  /* User: Show analysis when ready AND visible to user (stage 6) */
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

        {/* Share Link Dialog (for admins) */}
        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Link de Compartilhamento</DialogTitle>
            </DialogHeader>
            {isGeneratingCode ? (
              <div className="py-4 text-center">
                <p className="text-sm text-gray-500">Gerando link...</p>
              </div>
            ) : shareableUrl ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={shareableUrl}
                    readOnly
                    className="font-mono text-sm flex-1"
                  />
                  <Button onClick={handleCopyLink} size="icon" variant="outline">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => window.open(shareableUrl, '_blank')}
                  >
                    Abrir
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleCopyLink}
                  >
                    Copiar Link
                  </Button>
                </div>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>

        {/* Access Code Dialog (for non-admin users) */}
        <Dialog open={showAccessCodeDialog} onOpenChange={setShowAccessCodeDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Código de Acesso</DialogTitle>
              <DialogDescription>
                Para visualizar o relatório completo, insira o código de acesso fornecido pelo administrador.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="access-code" className="text-sm font-medium text-gray-700">
                  Código de Acesso
                </label>
                <Input
                  id="access-code"
                  placeholder="Ex: ABC12345"
                  value={accessCodeInput}
                  onChange={(e) => setAccessCodeInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAccessCodeSubmit();
                    }
                  }}
                  className="font-mono text-center text-lg tracking-wider"
                  maxLength={8}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAccessCodeDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAccessCodeSubmit}>
                Acessar Relatório
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Container>
    </Section>
  );
}
