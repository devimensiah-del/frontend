"use client";

import React, { useState } from "react";
import { useRef, useEffect } from "react";

// ... imports

export default function SubmissionPage() {
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();

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

  const { data: enrichment, isLoading: isLoadingEnrichment } = useQuery({
    queryKey: ["enrichment", id],
    queryFn: () => isAdmin ? adminApi.getEnrichmentBySubmissionId(id) : enrichmentApi.getBySubmissionId(id),
    enabled: !!submission,
    refetchInterval: (data) => {
        if (data?.status === 'pending') return 5000;
        return false;
    },
  });

  const { data: analysis, isLoading: isLoadingAnalysis } = useQuery({
    queryKey: ["analysis", id],
    queryFn: () => analysisApi.getBySubmissionId(id), // User/Admin both use this to get latest
    enabled: !!submission,
    refetchInterval: (data) => {
        if (data?.status === 'pending' || data?.status === 'processing') return 5000;
        return false;
    },
  });
  const approveEnrichmentMutation = useMutation({
    mutationFn: () => adminApi.approveEnrichment(enrichment!.id),
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Enriquecimento aprovado. Análise iniciada." });
      queryClient.invalidateQueries({ queryKey: ["enrichment", id] });
      queryClient.invalidateQueries({ queryKey: ["analysis", id] }); // Analysis should be created
    }
  });

  const approveAnalysisMutation = useMutation({
    mutationFn: () => adminApi.approveAnalysis(analysis!.id),
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Análise aprovada. PDF gerado." });
      queryClient.invalidateQueries({ queryKey: ["analysis", id] });
    }
  });

  const sendAnalysisMutation = useMutation({
    mutationFn: () => adminApi.sendAnalysis(analysis!.id, submission!.contactEmail || ""), // Use submission email
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Análise enviada para o cliente." });
      queryClient.invalidateQueries({ queryKey: ["analysis", id] });
    }
  });

  const updateEnrichmentMutation = useMutation({
    mutationFn: (data: any) => adminApi.updateEnrichment(enrichment!.id, { data }),
    onSuccess: () => {
      toast({ title: "Atualizado", description: "Dados de enriquecimento salvos." });
      queryClient.invalidateQueries({ queryKey: ["enrichment", id] });
    }
  });

  const updateAnalysisMutation = useMutation({
    mutationFn: (edits: any) => adminApi.createAnalysisVersion(analysis!.id, edits),
    onSuccess: () => {
      toast({ title: "Nova Versão", description: "Nova versão da análise criada." });
      queryClient.invalidateQueries({ queryKey: ["analysis", id] });
    }
  });

  const downloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ submission, enrichment, analysis }, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
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
              onDownload={downloadJson}
              onApprove={() => {
                if (analysis && analysis.status === 'completed') approveAnalysisMutation.mutate();
                else if (enrichment && enrichment.status === 'completed') approveEnrichmentMutation.mutate();
              }}
              onSend={() => {
                 if (analysis && analysis.status === 'approved') sendAnalysisMutation.mutate();
              }}
              isLoading={approveEnrichmentMutation.isPending || approveAnalysisMutation.isPending}
            />
          )}
          
          {!isAdmin && analysis?.status === 'sent' && (
             <Button variant="architect" onClick={() => window.open(analysis.pdf_url || '#', '_blank')}>
               Baixar Relatório PDF
             </Button>
          )}
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="submission" className="w-full space-y-6">
          <TabsList className="grid w-full md:w-[400px] grid-cols-3 bg-white p-1 border border-gray-200 rounded-none">
            <TabsTrigger value="submission">Envio</TabsTrigger>
            <TabsTrigger value="enrichment">Enriquecimento</TabsTrigger>
            <TabsTrigger value="analysis">Análise</TabsTrigger>
          </TabsList>

          <TabsContent value="submission" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card>
              <CardHeader><CardTitle>Dados do Envio</CardTitle></CardHeader>
              <CardContent>
                <SubmissionDetails 
                    submission={submission} 
                    isAdmin={isAdmin}
                    onUpdate={(data) => {
                        // Implement submission update mutation if needed
                        // For now, just a placeholder as actual API might differ
                        // submissionsApi.update(submission.id, data);
                        console.log("Update submission", data);
                        toast({ title: "Info", description: "Atualização de envio ainda não implementada na API." });
                    }}
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
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Only show Analysis tab content if Admin or Approved */ }
          <TabsContent value="analysis" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             {(!isAdmin && analysis?.status !== 'approved' && analysis?.status !== 'sent') ? (
                 <Card className="border-dashed">
                     <CardContent className="py-12 text-center">
                         <div className="mb-4 bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                             <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                         </div>
                         <Heading variant="subtitle" className="mb-2">Análise em Andamento</Heading>
                         <Text variant="small">Nossa equipe e IA estão processando seus dados. Você será notificado assim que estiver pronto.</Text>
                     </CardContent>
                 </Card>
             ) : (!isAdmin && (analysis?.status === 'approved' || analysis?.status === 'sent')) ? (
                 <Card className="border-gold-200 bg-gold-50/10">
                     <CardContent className="py-12 text-center">
                         <div className="mb-6">
                             <Heading variant="title" className="text-2xl mb-2">Seu Relatório de Inteligência Estratégica está pronto.</Heading>
                             <Text className="max-w-lg mx-auto mb-8">
                                 Acesse a análise completa, incluindo SWOT, PESTEL, Forças de Porter e recomendações executivas.
                             </Text>
                             <Button 
                                variant="architect" 
                                size="lg" 
                                onClick={() => window.open(`/report/${analysis.id}`, '_blank')}
                                className="shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                             >
                                 Visualizar Relatório Completo <ArrowRight className="ml-2 w-4 h-4" />
                             </Button>
                         </div>
                     </CardContent>
                 </Card>
             ) : (
                 // Admin View
                 <AnalysisDetails 
                    analysis={analysis} 
                    isAdmin={isAdmin}
                    onUpdate={updateAnalysisMutation.mutate}
                 />
             )}
          </TabsContent>
        </Tabs>

      </Container>
    </Section>
  );
}
