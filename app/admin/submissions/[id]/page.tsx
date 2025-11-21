"use client";

import { use, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAnalysis } from "@/lib/hooks/use-analysis";
import { submissionsApi, adminApi } from "@/lib/api/client";
import { toast } from "@/components/ui/use-toast";
import { WarRoomShell } from "./_components/WarRoomShell";
import { WarRoomSkeleton } from "@/components/skeletons";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Analysis, Submission } from "@/types";

// Convert backend Analysis to WarRoom format
function convertAnalysisToWarRoomFormat(analysis: Analysis | null, submission?: Submission) {
  if (!analysis) {
    return {
      submissionId: submission?.id || "",
      companyName: submission?.companyName || "",
      lastUpdated: new Date().toISOString(),
      swot: {
        strengths: [],
        weaknesses: [],
        opportunities: [],
        threats: []
      },
      pestel: {
        political: [],
        economic: [],
        social: [],
        technological: [],
        environmental: [],
        legal: []
      },
      porter: {
        competitiveRivalry: { intensity: "", factors: [] },
        threatOfNewEntrants: { intensity: "", factors: [] },
        bargainingPowerOfSuppliers: { intensity: "", factors: [] },
        bargainingPowerOfBuyers: { intensity: "", factors: [] },
        threatOfSubstitutes: { intensity: "", factors: [] }
      }
    };
  }

  return {
    submissionId: analysis.submissionId,
    companyName: submission?.companyName || "",
    lastUpdated: analysis.updatedAt || new Date().toISOString(),
    swot: analysis.swot || {
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: []
    },
    pestel: analysis.pestel || {
      political: [],
      economic: [],
      social: [],
      technological: [],
      environmental: [],
      legal: []
    },
    porter: analysis.porter || {
      competitiveRivalry: { intensity: "", factors: [] },
      threatOfNewEntrants: { intensity: "", factors: [] },
      bargainingPowerOfSuppliers: { intensity: "", factors: [] },
      bargainingPowerOfBuyers: { intensity: "", factors: [] },
      threatOfSubstitutes: { intensity: "", factors: [] }
    }
  };
}

interface WarRoomPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function WarRoomPage({ params }: WarRoomPageProps) {
  const { id: submissionId } = use(params);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [localAnalysis, setLocalAnalysis] = useState<any>(null);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);

  const {
    analysis,
    isLoading,
    update,
    isUpdating,
    generate,
    isGenerating,
    generatePDF,
    isGeneratingPDF,
    sendToUser,
    isSending,
    refetch
  } = useAnalysis(submissionId);

  // Fetch submission data
  useEffect(() => {
    async function fetchSubmission() {
      try {
        const data = await adminApi.getSubmission(submissionId);
        setSubmission(data);
      } catch (error) {
        toast({
          title: "Erro ao carregar submissão",
          description: "Não foi possível carregar os dados da submissão.",
          variant: "destructive"
        });
      }
    }

    fetchSubmission();
  }, [submissionId]);

  // Initialize local analysis from backend data
  useEffect(() => {
    if (analysis && submission) {
      setLocalAnalysis(convertAnalysisToWarRoomFormat(analysis, submission));
    } else if (submission && !isLoading) {
      setLocalAnalysis(convertAnalysisToWarRoomFormat(null, submission));
    }
  }, [analysis, submission, isLoading]);

  // Auto-save functionality (debounced)
  const scheduleAutoSave = useCallback(() => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    const timer = setTimeout(() => {
      handleSaveDraft(true);
    }, 30000); // Auto-save after 30 seconds of inactivity

    setAutoSaveTimer(timer);
  }, [autoSaveTimer, localAnalysis]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [autoSaveTimer]);

  const handleAnalysisChange = (updatedAnalysis: any) => {
    setLocalAnalysis(updatedAnalysis);
    scheduleAutoSave();
  };

  const handleSaveDraft = async (isAutoSave = false) => {
    if (!localAnalysis) return;

    try {
      await update({
        swot: localAnalysis.swot,
        pestel: localAnalysis.pestel,
        porter: localAnalysis.porter
      });

      if (!isAutoSave) {
        toast({
          title: "Rascunho salvo",
          description: "As alterações foram salvas com sucesso.",
          variant: "default"
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar as alterações.",
        variant: "default"
      });
    }
  };

  const handleRetryAnalysis = async () => {
    try {
      toast({
        title: "Gerando análise",
        description: "Aguarde enquanto geramos uma nova análise...",
        variant: "default"
      });

      await generate();

      toast({
        title: "Análise gerada",
        description: "Nova análise gerada com sucesso.",
        variant: "default"
      });

      // Refetch to get latest data
      refetch();
    } catch (error: any) {
      toast({
        title: "Erro ao gerar análise",
        description: error.message || "Não foi possível gerar a análise.",
        variant: "default"
      });
    }
  };

  const handlePublishPDF = async () => {
    try {
      // First, save current changes
      await handleSaveDraft();

      // Generate PDF
      const pdfBlob = await generatePDF();

      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `analise-${submission?.companyName || submissionId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "PDF gerado",
        description: "O PDF foi baixado com sucesso.",
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Erro ao gerar PDF",
        description: error.message || "Não foi possível gerar o PDF.",
        variant: "default"
      });
    }
  };

  const handleSendEmail = async () => {
    try {
      // First, save current changes
      await handleSaveDraft();

      // Send email
      await sendToUser();

      toast({
        title: "Email enviado",
        description: "O relatório foi enviado para o usuário.",
        variant: "default"
      });

      // Update submission status
      await adminApi.updateSubmissionStatus(submissionId, "completed");
    } catch (error: any) {
      toast({
        title: "Erro ao enviar email",
        description: error.message || "Não foi possível enviar o email.",
        variant: "default"
      });
    }
  };

  if (!localAnalysis || !submission) {
    return <WarRoomSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[var(--surface-paper)]">
      {/* Breadcrumb Header */}
      <header className="bg-white border-b border-line sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/admin/enriquecimento/${submissionId}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar ao Enriquecimento
                </Button>
              </Link>
              <div className="h-4 w-px bg-line" />
              <div>
                <h1 className="font-heading text-xl font-medium tracking-tight text-navy-900">
                  War Room - {submission?.companyName}
                </h1>
                <p className="text-xs text-text-secondary">
                  Análise estratégica completa
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <WarRoomShell
        analysis={localAnalysis}
        onAnalysisChange={handleAnalysisChange}
        onSaveDraft={() => handleSaveDraft(false)}
        onRetryAnalysis={handleRetryAnalysis}
        onPublishPDF={handlePublishPDF}
        onSendEmail={handleSendEmail}
        isSaving={isUpdating}
        isGenerating={isGenerating}
        isGeneratingPDF={isGeneratingPDF}
        isSending={isSending}
        submissionId={submissionId}
        userEmail={submission.email}
      />
    </div>
  );
}
