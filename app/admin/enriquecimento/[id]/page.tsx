"use client";

import React, { use, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminEnrichmentQuery } from "@/lib/hooks/use-admin-enrichment-query";
import { useAdminEnrichment } from "@/lib/hooks/use-admin-enrichment";
import { adminApi } from "@/lib/api/client";
import { toast } from "@/components/ui/use-toast";
import { EnrichmentEditorSkeleton } from "@/components/skeletons";
import { SubmissionSummary } from "./_components/SubmissionSummary";
import { EnrichmentForm } from "./_components/EnrichmentForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import { StatusIcon } from "@/components/admin/StatusIcon";
import { StatusTimeline } from "@/components/admin/StatusTimeline";
import { CheckCircle, AlertCircle } from "lucide-react";
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
  } = useAdminEnrichmentQuery(submissionId);

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


  if (isLoading || !submission) {
    return <EnrichmentEditorSkeleton />;
  }

  // Calculate data quality score (simple heuristic)
  const calculateQualityScore = (): number => {
    if (!localEnrichmentData) return 0;

    const fields = Object.values(localEnrichmentData).filter(
      (val) => val !== null && val !== undefined && val !== ""
    );

    const totalFields = Object.keys(localEnrichmentData).length;
    if (totalFields === 0) return 0;

    return (fields.length / totalFields) * 100;
  };

  const qualityScore = calculateQualityScore();

  // Get score variant
  const getScoreVariant = (score: number): "error" | "warning" | "success" => {
    if (score >= 80) return "success";
    if (score >= 50) return "warning";
    return "error";
  };

  // Validation warnings
  const getValidationWarnings = (): string[] => {
    const warnings: string[] = [];

    if (!localEnrichmentData || Object.keys(localEnrichmentData).length === 0) {
      warnings.push("Nenhum dado enriquecido disponível.");
    }

    if (qualityScore < 50) {
      warnings.push(
        "Qualidade dos dados abaixo de 50%. Considere adicionar mais informações."
      );
    }

    return warnings;
  };

  const validationWarnings = getValidationWarnings();
  const canApprove = qualityScore >= 50 && enrichment?.status !== "approved";

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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Editor (3/4 width) */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Dados Enriquecidos</CardTitle>
                  {enrichment && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-text-secondary">
                        Qualidade:
                      </span>
                      <Badge variant={getScoreVariant(qualityScore)}>
                        {qualityScore.toFixed(0)}%
                      </Badge>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <EnrichmentForm
                  enrichment={enrichment || null}
                  onChange={handleEnrichmentChange}
                  disabled={
                    adminEnrichment.isUpdating || adminEnrichment.isApproving
                  }
                />
              </CardContent>

              <CardFooter>
                <div className="flex items-center justify-between w-full">
                  <Button
                    variant="outline"
                    onClick={() => handleSaveDraft(false)}
                    disabled={adminEnrichment.isUpdating}
                  >
                    Salvar Rascunho
                  </Button>
                  <Button
                    onClick={handleApprove}
                    disabled={!canApprove || adminEnrichment.isApproving}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Aprovar e Iniciar Análise
                  </Button>
                </div>
              </CardFooter>
            </Card>

            {/* Validation Warnings */}
            {validationWarnings.length > 0 && (
              <Alert variant="warning" className="mt-4">
                <AlertCircle className="w-4 h-4" />
                <AlertTitle>Avisos de Validação</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1">
                    {validationWarnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Sidebar (1/4 width) */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <StatusIcon
                    status={enrichment?.status || "pending"}
                    size="md"
                  />
                  <Badge
                    variant={
                      enrichment?.status === "approved"
                        ? "success"
                        : enrichment?.status === "completed"
                        ? "gold"
                        : "warning"
                    }
                  >
                    {enrichment?.status === "approved"
                      ? "Aprovado"
                      : enrichment?.status === "completed"
                      ? "Pronto"
                      : "Pendente"}
                  </Badge>
                </div>
                {enrichment?.progress !== undefined && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
                      <span>Progresso</span>
                      <span>{enrichment.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gold-500 h-2 rounded-full transition-all"
                        style={{ width: `${enrichment.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Processing Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <StatusTimeline
                  events={[
                    {
                      type: "created",
                      timestamp: enrichment?.createdAt,
                      label: "Criado",
                    },
                    {
                      type: "processing",
                      timestamp:
                        enrichment?.status === "pending"
                          ? undefined
                          : enrichment?.updatedAt,
                      label: "Processado",
                    },
                    {
                      type: "completed",
                      timestamp:
                        enrichment?.status === "completed" ||
                        enrichment?.status === "approved"
                          ? enrichment?.updatedAt
                          : undefined,
                      label: "Concluído",
                    },
                    {
                      type: "approved",
                      timestamp:
                        enrichment?.status === "approved"
                          ? enrichment?.updatedAt
                          : undefined,
                      label: "Aprovado",
                    },
                  ]}
                />
              </CardContent>
            </Card>

            {/* Submission Summary */}
            <SubmissionSummary submission={submission} />
          </div>
        </div>
      </div>
    </div>
  );
}
