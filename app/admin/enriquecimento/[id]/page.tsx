"use client";

import React, { use, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEnrichment } from "@/lib/hooks/use-enrichment";
import { useAdminEnrichment } from "@/lib/hooks/use-admin-enrichment";
import { adminApi } from "@/lib/api/client";
import { toast } from "@/components/ui/use-toast";
import { EnrichmentEditorSkeleton } from "@/components/skeletons";
import { SubmissionSummary } from "./_components/SubmissionSummary";
import { EnrichmentForm } from "./_components/EnrichmentForm";
import { EnrichmentActions } from "./_components/EnrichmentActions";
import type { Submission } from "@/types";

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
    Partial<Record<string, any>>
  >({});
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const {
    enrichment,
    isLoading,
    refetch,
  } = useEnrichment(submissionId);

  const adminEnrichment = useAdminEnrichment();

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
    if ((enrichment as any)?.data) {
      setLocalEnrichmentData((enrichment as any).data);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const handleEnrichmentChange = (data: Partial<Record<string, any>>) => {
    setLocalEnrichmentData(data);
    scheduleAutoSave();
  };

  // Save draft
  const handleSaveDraft = async (isAutoSave = false) => {
    if (!enrichment?.id) {
      toast({
        title: "Erro",
        description: "ID do enriquecimento não encontrado.",
        variant: "destructive",
      });
      return;
    }

    try {
      await adminEnrichment.update({
        enrichmentId: enrichment.id,
        data: localEnrichmentData,
      });

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

  // Approve enrichment (triggers analysis job automatically)
  const handleApprove = async () => {
    if (!enrichment?.id) {
      toast({
        title: "Erro",
        description: "ID do enriquecimento não encontrado.",
        variant: "destructive",
      });
      return;
    }

    try {
      // First, save current changes
      await adminEnrichment.update({
        enrichmentId: enrichment.id,
        data: localEnrichmentData,
      });

      // Then approve (backend will auto-trigger analysis job)
      const response = await adminEnrichment.approve(enrichment.id);

      toast({
        title: "Enriquecimento aprovado",
        description: "Análise será gerada automaticamente. Aguarde...",
        variant: "default",
      });

      // Refetch to get updated status
      refetch();

      // Redirect to analysis list after a short delay
      setTimeout(() => {
        router.push("/admin/analise");
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Erro ao aprovar",
        description: error.message || "Não foi possível aprovar o enriquecimento.",
        variant: "destructive",
      });
    }
  };

  // Reject enrichment (deprecated - keeping for backward compatibility)
  const handleReject = async (reason: string) => {
    toast({
      title: "Funcionalidade removida",
      description: "Use 'Retry Enrichment' na lista de submissões para reiniciar o enriquecimento.",
      variant: "destructive",
    });
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
              enrichment={enrichment || null}
              onChange={handleEnrichmentChange}
              disabled={adminEnrichment.isUpdating || adminEnrichment.isApproving}
            />
          </div>
        </div>
      </div>

      {/* --- ACTION BUTTONS (Sticky Footer) --- */}
      <EnrichmentActions
        onSaveDraft={handleSaveDraft}
        onApprove={handleApprove}
        onReject={handleReject}
        onGenerateAnalysis={async () => {
          // Deprecated - approval now auto-triggers analysis
          toast({
            title: "Funcionalidade removida",
            description: "A aprovação do enriquecimento agora gera a análise automaticamente.",
            variant: "default",
          });
        }}
        isSaving={adminEnrichment.isUpdating}
        isApproving={adminEnrichment.isApproving}
        isRejecting={false}
        isGenerating={false}
        disabled={isLoading || (enrichment as any)?.status === 'approved'}
      />
    </div>
  );
}
