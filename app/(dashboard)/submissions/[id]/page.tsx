"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, submissionsApi, enrichmentApi, analysisApi, authApi, reportApi } from "@/lib/api/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ActionToolbar } from "@/components/dashboard/ActionToolbar";
import { Section, Container } from "@/components/editorial/Section";
import { Heading, Eyebrow } from "@/components/ui/Typography";
import { Spinner } from "@/components/ui/loading-indicator";
import { SubmissionDetails } from "@/app/(dashboard)/_components/SubmissionDetails";
import { EnrichmentDetails } from "@/app/(dashboard)/_components/EnrichmentDetails";
import { AnalysisDetails } from "@/app/(dashboard)/_components/AnalysisDetails";
import { Select, SelectOption } from "@/components/ui/Select";
import { SendAnalysisDialog } from "@/app/(dashboard)/_components/SendAnalysisDialog";
import { WorkflowProgress } from "@/app/(dashboard)/_components/WorkflowProgress";

export default function SubmissionPage() {
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState("submission");
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
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Enriquecimento aprovado. Análise iniciada." });
      queryClient.invalidateQueries({ queryKey: ["enrichment", id] });
      queryClient.invalidateQueries({ queryKey: ["analysis", id] }); // Analysis should be created
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
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Análise aprovada. PDF gerado." });
      queryClient.invalidateQueries({ queryKey: ["analysis", id] });
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

  // Combined mutation: create new version, then update it with edited data
  const saveAnalysisEditsMutation = useMutation({
    mutationFn: async (data: any) => {
      // First, create a new version (clones previous)
      await adminApi.createAnalysisVersion(analysis!.id);
      // Then update the new version with the edited data
      return adminApi.updateAnalysis(analysis!.id, data);
    },
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Nova versão criada com sucesso." });
      queryClient.invalidateQueries({ queryKey: ["analysis", id] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as alterações.",
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

  if (isLoadingSubmission) {
    return <Container className="flex justify-center py-20"><Spinner size={40} /></Container>;
  }

  if (!submission) return <Container>Submission not found</Container>;

  return (
    <Section className="bg-gray-50 min-h-screen border-0">
      <Container className="py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <Eyebrow className="mb-2">Detalhes do Projeto</Eyebrow>
            <Heading variant="title" className="text-3xl">{submission.companyName}</Heading>
            <div className="flex items-center gap-2 mt-2">
              <StatusBadge status={submission.status} />
              <span className="text-sm text-gray-400">|</span>
              <span className="text-sm text-gray-500">ID: {submission.id.slice(0, 8)}</span>
            </div>
          </div>

          {isAdmin && (
            <ActionToolbar
              type={analysis ? "analysis" : "enrichment"}
              status={analysis?.status || enrichment?.status}
              isAdmin={isAdmin}
              disableSend={!pdfReady}
              onDownload={downloadJson}
              onApprove={() => {
                if (analysis && analysis.status === 'completed') approveAnalysisMutation.mutate();
                else if (enrichment && enrichment.status === 'completed') approveEnrichmentMutation.mutate();
              }}
              onSend={() => {
                if (analysis && analysis.status === 'approved' && pdfReady) setShowSendDialog(true);
              }}
              isLoading={approveEnrichmentMutation.isPending || approveAnalysisMutation.isPending}
            />
          )}

          {!isAdmin && analysis?.status === 'sent' && (
            <Button variant="architect" onClick={() => window.open(analysis.pdf_url || analysis.pdfUrl || '#', '_blank')}>
              Baixar Relatório PDF
            </Button>
          )}
        </div>

        {/* Mobile Tab Selector */}
        <div className="md:hidden mb-6">
          <Select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full"
          >
            <SelectOption value="submission">Envio</SelectOption>
            <SelectOption value="enrichment">Enriquecimento</SelectOption>
            <SelectOption value="analysis">Análise</SelectOption>
          </Select>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <TabsList className="hidden md:grid w-full md:w-[600px] md:grid-cols-3 bg-white p-2 gap-2 border border-gray-200 rounded-none text-[13px] md:text-sm font-semibold uppercase tracking-wide">
            <TabsTrigger value="submission" className="min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
              Envio
            </TabsTrigger>
            <TabsTrigger value="enrichment" className="min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
              Enriquecimento
            </TabsTrigger>
            <TabsTrigger value="analysis" className="min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
              Análise
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submission" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card>
              <CardHeader><CardTitle>Dados do Envio</CardTitle></CardHeader>
              <CardContent>
                <SubmissionDetails
                  submission={submission}
                  isAdmin={isAdmin}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="enrichment" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card>
              <CardHeader><CardTitle>Dados Enriquecidos (IA)</CardTitle></CardHeader>
              <CardContent>
                <EnrichmentDetails
                  enrichment={enrichment}
                  isAdmin={isAdmin}
                  onUpdate={updateEnrichmentMutation.mutate}
                  onRetry={retryEnrichmentMutation.mutate}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Only show Analysis tab content if Admin or Approved */}
          <TabsContent value="analysis" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {(!isAdmin && (!analysis || (analysis.status !== 'approved' && analysis.status !== 'sent'))) ? (
              <WorkflowProgress
                enrichmentStatus={enrichment?.status}
                analysisStatus={analysis?.status}
                isAdmin={false}
              />
            ) : (!isAdmin && (analysis?.status === 'approved' || analysis?.status === 'sent')) ? (
              // User view when analysis is ready
              <AnalysisDetails
                analysis={analysis}
                isAdmin={false}
                onUpdate={() => { }}
                onCreateVersion={() => { }}
              />
            ) : (
              // Admin View
              <AnalysisDetails
                analysis={analysis}
                isAdmin={isAdmin}
                onUpdate={saveAnalysisEditsMutation.mutate}
                onCreateVersion={() => { }} // Deprecated, keeping for type compatibility but not used
              />
            )}
          </TabsContent>
        </Tabs>

        {/* Send Analysis Confirmation Dialog */}
        {showSendDialog && submission && (
          <SendAnalysisDialog
            open={showSendDialog}
            onOpenChange={setShowSendDialog}
            onConfirm={() => sendAnalysisMutation.mutate()}
            userEmail={submission.contactEmail}
            companyName={submission.companyName}
            isLoading={sendAnalysisMutation.isPending}
          />
        )}

      </Container>
    </Section>
  );
}
