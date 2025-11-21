"use client";

import React, { use, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEnrichment } from "@/lib/hooks/use-enrichment";
import { adminApi, analysisApi } from "@/lib/api/client";
import { toast } from "@/components/ui/use-toast";
import { EnrichmentEditorSkeleton } from "@/components/skeletons";
import { SubmissionSummary } from "./_components/SubmissionSummary";
import { EnrichmentForm } from "./_components/EnrichmentForm";
import { EnrichmentActions } from "./_components/EnrichmentActions";
import type { Submission, Enrichment } from "@/types";

/* ============================================
   ENRICHMENT EDITOR PAGE - Stage 2 Editor
   Edit and approve enrichment data
   ============================================ */

interface EnrichmentEditorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EnrichmentEditorPage({
  params,
}: EnrichmentEditorPageProps) {
  const { id: submissionId } = use(params);
  const router = useRouter();

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [localEnrichmentData, setLocalEnrichmentData] = useState<
    Partial<Enrichment["data"]>
  >({});
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);

  const {
    enrichment,
    isLoading,
    update,
    isUpdating,
    approve,
    isApproving,
    reject,
    isRejecting,
    refetch,
  } = useEnrichment(submissionId);

  // Fetch submission data
  useEffect(() => {
    async function fetchSubmission() {
      try {
        const data = await adminApi.getSubmission(submissionId);
        setSubmission(data);
      } catch (error: any) {
        toast({
          title: "Erro ao carregar submissão",
          description: error.message || "Não foi possível carregar os dados.",
          variant: "destructive",
        });
      }
    }

    fetchSubmission();
  }, [submissionId]);

  // Initialize local enrichment data
  useEffect(() => {
    if (enrichment?.data) {
      setLocalEnrichmentData(enrichment.data);
    }
  }, [enrichment]);

  // Auto-save functionality (debounced)
  const scheduleAutoSave = useCallback(() => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    const timer = setTimeout(() => {
      handleSaveDraft(true);
    }, 30000); // Auto-save after 30 seconds of inactivity

    setAutoSaveTimer(timer);
  }, [autoSaveTimer, localEnrichmentData]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [autoSaveTimer]);

  // Handle enrichment data change
  const handleEnrichmentChange = (data: Partial<Enrichment["data"]>) => {
    setLocalEnrichmentData(data);
    scheduleAutoSave();
  };

  // Save draft
  const handleSaveDraft = async (isAutoSave = false) => {
    try {
      await update({ data: localEnrichmentData });

      if (!isAutoSave) {
        toast({
          title: "Rascunho salvo",
          description: "As alterações foram salvas com sucesso.",
          variant: "default",
        });
      }
    } catch (error: any) {
      if (!isAutoSave) {
        toast({
          title: "Erro ao salvar",
          description: error.message || "Não foi possível salvar as alterações.",
          variant: "destructive",
        });
      }
    }
  };

  // Approve enrichment
  const handleApprove = async () => {
    try {
      // First, save current changes
      await update({ data: localEnrichmentData });

      // Then approve
      await approve();

      toast({
        title: "Enriquecimento aprovado",
        description: "O enriquecimento foi aprovado com sucesso.",
        variant: "default",
      });

      // Refetch to get updated status
      refetch();
    } catch (error: any) {
      toast({
        title: "Erro ao aprovar",
        description: error.message || "Não foi possível aprovar o enriquecimento.",
        variant: "destructive",
      });
    }
  };

  // Reject enrichment
  const handleReject = async (reason: string) => {
    try {
      await reject(reason);

      toast({
        title: "Enriquecimento rejeitado",
        description: "O enriquecimento foi rejeitado.",
        variant: "default",
      });

      // Redirect back to list
      router.push("/admin/enriquecimento");
    } catch (error: any) {
      toast({
        title: "Erro ao rejeitar",
        description: error.message || "Não foi possível rejeitar o enriquecimento.",
        variant: "destructive",
      });
    }
  };

  // Generate analysis (moves to Stage 3)
  const handleGenerateAnalysis = async () => {
    try {
      setIsGeneratingAnalysis(true);

      // First, save current enrichment changes
      await update({ data: localEnrichmentData });

      // Then generate analysis
      await analysisApi.generate(submissionId);

      toast({
        title: "Análise gerada",
        description: "Análise criada com sucesso. Redirecionando para War Room...",
        variant: "default",
      });

      // Redirect to War Room (Stage 3)
      setTimeout(() => {
        router.push(`/admin/submissions/${submissionId}`);
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Erro ao gerar análise",
        description: error.message || "Não foi possível gerar a análise.",
        variant: "destructive",
      });
      setIsGeneratingAnalysis(false);
    }
  };

  if (isLoading || !submission) {
    return <EnrichmentEditorSkeleton />;
  }

  return (
    <div className="min-h-screen bg-surface-paper pb-20">
      {/* --- BREADCRUMB HEADER --- */}
      <header className="bg-white border-b border-line">
        <div className="px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-text-secondary">
            <Link
              href="/admin/dashboard"
              className="hover:text-gold-600 transition-colors"
            >
              Dashboard
            </Link>
            <span>›</span>
            <Link
              href="/admin/enriquecimento"
              className="hover:text-gold-600 transition-colors"
            >
              Enriquecimento
            </Link>
            <span>›</span>
            <span className="text-navy-900 font-medium">
              {submission.companyName}
            </span>
          </nav>

          <div className="mt-3">
            <h1 className="font-heading text-2xl font-medium tracking-tight text-navy-900">
              Editar Enriquecimento
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Revise e edite os dados enriquecidos antes de aprovar
            </p>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <div className="px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Panel: Submission Data (Read-only) */}
          <div className="col-span-4">
            <div className="sticky top-8">
              <SubmissionSummary submission={submission} />
            </div>
          </div>

          {/* Right Panel: Enrichment Editor */}
          <div className="col-span-8">
            <EnrichmentForm
              enrichment={enrichment}
              onChange={handleEnrichmentChange}
              disabled={isUpdating || isApproving || isRejecting || isGeneratingAnalysis}
            />
          </div>
        </div>
      </div>

      {/* --- ACTION BUTTONS (Sticky Footer) --- */}
      <EnrichmentActions
        onSaveDraft={handleSaveDraft}
        onApprove={handleApprove}
        onReject={handleReject}
        onGenerateAnalysis={handleGenerateAnalysis}
        isSaving={isUpdating}
        isApproving={isApproving}
        isRejecting={isRejecting}
        isGenerating={isGeneratingAnalysis}
        disabled={isLoading}
      />
    </div>
  );
}
