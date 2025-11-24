"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { submissionsApi, enrichmentApi, analysisApi, adminApi, authApi } from "@/lib/api/client";
import { Section, Container, SplitLayout } from "@/components/editorial/Section";
import { Heading, Eyebrow, Text, Label } from "@/components/ui/Typography";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ActionToolbar } from "@/components/dashboard/ActionToolbar";
import { Spinner } from "@/components/ui/loading-indicator";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Enrichment, Analysis, Submission } from "@/lib/types";
import { ArrowRight, Loader2 } from "lucide-react";

/* ============================================
   SUBMISSION DETAILS COMPONENT (Editable by Admin)
   ============================================ */
const SubmissionDetails = ({ 
  submission, 
  isAdmin, 
  onUpdate 
}: { 
  submission: Submission; 
  isAdmin: boolean;
  onUpdate?: (data: Partial<Submission>) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(submission);

  const handleSave = () => {
    if (onUpdate) {
        onUpdate(formData);
    }
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <Heading variant="subtitle">Informações da Empresa</Heading>
        {isAdmin && (
          <Button variant="outline" size="sm" onClick={isEditing ? handleSave : () => setIsEditing(true)}>
            {isEditing ? "Salvar Alterações" : "Editar Dados"}
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label className="block mb-2">Empresa</Label>
          {isEditing ? (
            <Input 
              value={formData.companyName} 
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
            />
          ) : (
            <div className="p-4 bg-gray-50 border border-gray-200 text-sm">{submission.companyName}</div>
          )}
        </div>
        <div>
          <Label className="block mb-2">Website</Label>
          {isEditing ? (
            <Input 
              value={formData.website || ""} 
              onChange={(e) => setFormData({...formData, website: e.target.value})}
            />
          ) : (
            <div className="p-4 bg-gray-50 border border-gray-200 text-sm">{submission.website || "N/A"}</div>
          )}
        </div>
        <div>
          <Label className="block mb-2">Indústria</Label>
          {isEditing ? (
            <Input 
              value={formData.industry || ""} 
              onChange={(e) => setFormData({...formData, industry: e.target.value})}
            />
          ) : (
            <div className="p-4 bg-gray-50 border border-gray-200 text-sm">{submission.industry || "N/A"}</div>
          )}
        </div>
        <div>
          <Label className="block mb-2">Tamanho</Label>
          {isEditing ? (
            <Input 
              value={formData.companySize || ""} 
              onChange={(e) => setFormData({...formData, companySize: e.target.value})}
            />
          ) : (
            <div className="p-4 bg-gray-50 border border-gray-200 text-sm">{submission.companySize || "N/A"}</div>
          )}
        </div>
      </div>
      <div>
        <Label className="block mb-2">Desafio de Negócio</Label>
        {isEditing ? (
            <Textarea 
              className="min-h-[100px]"
              value={formData.businessChallenge || ""} 
              onChange={(e) => setFormData({...formData, businessChallenge: e.target.value})}
            />
          ) : (
            <div className="p-4 bg-gray-50 border border-gray-200 text-sm leading-relaxed">{submission.businessChallenge}</div>
          )}
      </div>
    </div>
  );
};

/* ============================================
   ENRICHMENT DETAILS COMPONENT (Editable by Admin)
   ============================================ */
const EnrichmentDetails = ({ 
  enrichment, 
  isAdmin, 
  onUpdate 
}: { 
  enrichment?: Enrichment; 
  isAdmin: boolean;
  onUpdate: (data: any) => void;
}) => {
  if (!enrichment) {
    return <div className="text-center py-10 text-gray-500">Enriquecimento ainda não iniciado.</div>;
  }

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(enrichment.data);

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <StatusBadge status={enrichment.status} type="enrichment" />
        {isAdmin && (
          <Button variant="outline" size="sm" onClick={isEditing ? handleSave : () => setIsEditing(true)}>
            {isEditing ? "Salvar Alterações" : "Editar Dados"}
          </Button>
        )}
      </div>

      {/* Render a simplified view of nested JSON data */}
      <div className="space-y-6">
        {Object.entries(formData || {}).map(([key, value]) => {
           if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
             return (
               <Card key={key} className="border-gray-200">
                 <CardHeader className="bg-gray-50 py-3 border-b border-gray-200">
                   <CardTitle className="text-sm font-bold uppercase text-gray-600">{key.replace(/_/g, ' ')}</CardTitle>
                 </CardHeader>
                 <CardContent className="p-4 space-y-4">
                   {Object.entries(value).map(([subKey, subValue]) => (
                     <div key={subKey}>
                       <Label className="mb-1 capitalize">{subKey.replace(/_/g, ' ')}</Label>
                       {isEditing ? (
                         <Input 
                           value={subValue as string} 
                           onChange={(e) => {
                             const newData = { ...formData };
                             // @ts-ignore
                             newData[key][subKey] = e.target.value;
                             setFormData(newData);
                           }}
                         />
                       ) : (
                         <div className="text-sm text-gray-700">{String(subValue)}</div>
                       )}
                     </div>
                   ))}
                 </CardContent>
               </Card>
             )
           }
           return null;
        })}
      </div>
    </div>
  );
};

/* ============================================
   ANALYSIS DETAILS COMPONENT (Editable & Versioned)
   ============================================ */
const AnalysisDetails = ({ 
  analysis, 
  isAdmin, 
  onUpdate 
}: { 
  analysis?: Analysis; 
  isAdmin: boolean;
  onUpdate: (data: any) => void;
}) => {
  if (!analysis) {
    return <div className="text-center py-10 text-gray-500">Análise aguardando aprovação do enriquecimento.</div>;
  }

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(analysis.analysis);

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <StatusBadge status={analysis.status} type="analysis" />
          <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">v{analysis.version}</span>
        </div>
        {isAdmin && (
          <Button variant="outline" size="sm" onClick={isEditing ? handleSave : () => setIsEditing(true)}>
            {isEditing ? "Salvar Nova Versão" : "Editar & Criar Versão"}
          </Button>
        )}
      </div>

      {/* Synthesis / Executive Summary */}
      <Card className="border-gold-200 bg-gold-50/30">
        <CardHeader>
          <CardTitle>Síntese Executiva</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea 
              className="min-h-[150px]"
              value={formData.synthesis.executiveSummary}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  synthesis: { ...formData.synthesis, executiveSummary: e.target.value }
                });
              }}
            />
          ) : (
            <Text className="whitespace-pre-wrap">{formData.synthesis.executiveSummary}</Text>
          )}
        </CardContent>
      </Card>

      {/* Render Frameworks (Simplified for brevity - ideally components per framework) */}
      <div className="grid gap-6">
        {/* SWOT */}
        <Card>
           <CardHeader><CardTitle>SWOT Analysis</CardTitle></CardHeader>
           <CardContent>
             <Text className="text-sm text-gray-600 mb-2">{formData.swot.summary}</Text>
           </CardContent>
        </Card>
        {/* PESTEL */}
        <Card>
           <CardHeader><CardTitle>PESTEL Analysis</CardTitle></CardHeader>
           <CardContent>
             <Text className="text-sm text-gray-600 mb-2">{formData.pestel.summary}</Text>
           </CardContent>
        </Card>
      </div>
    </div>
  );
};


/* ============================================
   MAIN PAGE COMPONENT
   ============================================ */
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
  });

  const { data: analysis, isLoading: isLoadingAnalysis } = useQuery({
    queryKey: ["analysis", id],
    queryFn: () => analysisApi.getBySubmissionId(id), // User/Admin both use this to get latest
    enabled: !!submission,
  });

  // 3. Mutations
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
                                onClick={() => window.location.href = `/report/${analysis.id}`}
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
