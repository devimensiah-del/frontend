"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { adminApi, enrichmentApi } from "@/lib/api/client";
import { useAnalysis } from "@/lib/hooks/use-analysis";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { SubmissionDetails } from "./_components/SubmissionDetails";
import { WorkflowStatus } from "./_components/WorkflowStatus";
import { SubmissionActions } from "./_components/SubmissionActions";
import type { Submission, Enrichment } from "@/types";

interface SubmissionDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function SubmissionDetailPage({ params }: SubmissionDetailPageProps) {
  const { id: submissionId } = use(params);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [enrichment, setEnrichment] = useState<Enrichment | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const { analysis, isLoading: isLoadingAnalysis, refetch: refetchAnalysis } = useAnalysis(submissionId);

  // Fetch submission and enrichment data
  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Fetch submission
      const submissionData = await adminApi.getSubmission(submissionId);
      setSubmission(submissionData);

      // Fetch enrichment
      try {
        const enrichmentData = await enrichmentApi.getBySubmissionId(submissionId);
        setEnrichment(enrichmentData);
      } catch {
        // No enrichment data yet
        setEnrichment(undefined);
      }
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message || "Não foi possível carregar os dados da submissão.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [submissionId]);

  const handleRefresh = () => {
    fetchData();
    refetchAnalysis();
    toast({
      title: "Dados atualizados",
      description: "Os dados foram recarregados com sucesso.",
      variant: "default",
    });
  };

  if (isLoading || !submission) {
    return (
      <div className="min-h-screen bg-surface-paper">
        <header className="bg-white border-b border-line">
          <div className="px-8 py-4">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        </header>
        <div className="p-8">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-8 space-y-8">
              <div className="h-96 bg-white border border-line animate-pulse" />
            </div>
            <div className="col-span-4 space-y-8">
              <div className="h-64 bg-white border border-line animate-pulse" />
              <div className="h-48 bg-white border border-line animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pdfUrl = (submission as any).pdfUrl || (submission as any).pdf_url;

  return (
    <div className="min-h-screen bg-surface-paper">
      {/* --- BREADCRUMB HEADER --- */}
      <header className="bg-white border-b border-line">
        <div className="px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-text-secondary mb-3">
            <Link
              href="/admin/dashboard"
              className="hover:text-gold-600 transition-colors"
            >
              Dashboard
            </Link>
            <span>›</span>
            <Link
              href="/admin/envios"
              className="hover:text-gold-600 transition-colors"
            >
              Envios
            </Link>
            <span>›</span>
            <span className="text-navy-900 font-medium">
              {submission.companyName}
            </span>
          </nav>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-2xl font-medium tracking-tight text-navy-900">
                Detalhes da Submissão
              </h1>
              <p className="text-sm text-text-secondary mt-1">
                {submission.companyName}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/admin/envios">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <div className="p-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column: Submission Details & Workflow Status */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <SubmissionDetails submission={submission} />
            <WorkflowStatus
              enrichment={enrichment}
              analysis={analysis || undefined}
              hasPDF={!!pdfUrl}
            />
          </div>

          {/* Right Column: Actions */}
          <div className="col-span-12 lg:col-span-4">
            <div className="sticky top-8">
              <SubmissionActions
                submissionId={submissionId}
                enrichment={enrichment}
                analysis={analysis || undefined}
                pdfUrl={pdfUrl}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
