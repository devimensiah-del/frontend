"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { toast } from "@/components/ui/use-toast";
import { adminApi } from "@/lib/api/client";
import type { SubmissionStatus, Submission } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/Typography";
import { Download, Edit, Check } from "lucide-react";

/* ============================================
   ADMIN ANÁLISE - Edit AI Analysis & Generate PDF
   ============================================ */

export default function AdminAnalise() {
  const [isLoading, setIsLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await adminApi.getAllSubmissions();
        // Filter submissions that are ready for analysis (enrichment complete or later stages)
        const analysisReadySubmissions = data.data.filter(
          (s: Submission) =>
            s.status === 'enriched' ||
            s.status === 'analyzing' ||
            s.status === 'analyzed' ||
            s.status === 'generating_report' ||
            s.status === 'completed'
        );
        setSubmissions(analysisReadySubmissions);
      } catch (err) {
        console.error("Error fetching submissions:", err);
        setError("Erro ao carregar envios.");
        toast({
          title: "Erro ao Carregar Dados",
          description: "Não foi possível carregar os envios.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const handleGeneratePdf = async (submissionId: string) => {
    try {
      setGeneratingPdf(submissionId);
      // Update submission status to trigger report generation
      await adminApi.updateSubmissionStatus(submissionId, 'generating_report');
      toast({
        title: "Gerando PDF",
        description: "O processo de geração do relatório foi iniciado.",
        variant: "success",
      });
      // Refresh submissions
      const data = await adminApi.getAllSubmissions();
      setSubmissions(data.data.filter(
        (s: Submission) =>
          s.status === 'enriched' ||
          s.status === 'analyzing' ||
          s.status === 'analyzed' ||
          s.status === 'generating_report' ||
          s.status === 'completed'
      ));
    } catch {
      toast({
        title: "Erro ao Iniciar Geração",
        description: "Não foi possível iniciar a geração do relatório.",
        variant: "destructive",
      });
    } finally {
      setGeneratingPdf(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-paper flex items-center justify-center">
        <div className="text-text-secondary">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-paper flex items-center justify-center p-4">
        <div className="bg-white border border-line p-8 max-w-md w-full">
          <h2 className="font-heading text-2xl font-medium text-navy-900 mb-4">Erro ao Carregar</h2>
          <p className="text-text-secondary mb-6">{error}</p>
          <Button onClick={() => window.location.reload()} variant="architect" className="w-full">
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-paper">
      {/* --- PAGE HEADER --- */}
      <header className="bg-white border-b border-line">
        <div className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <h1 className="font-heading text-2xl sm:text-3xl font-medium tracking-tight text-navy-900">
            Análise
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Editar análise gerada por IA e gerar PDF
          </p>
        </div>
      </header>

      {/* --- SUBMISSIONS CONTENT --- */}
      <div className="p-4 sm:p-6 lg:p-8">
        {submissions.length === 0 ? (
          <div className="bg-white border border-line p-8 sm:p-12 text-center">
            <p className="text-text-secondary">
              Nenhum envio pronto para análise.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View (lg and up) */}
            <div className="hidden lg:block bg-white border border-line shadow-sm overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-surface-paper border-b border-line">
                <div className="col-span-3">
                  <TableHeader>Empresa</TableHeader>
                </div>
                <div className="col-span-2">
                  <TableHeader>Status</TableHeader>
                </div>
                <div className="col-span-2">
                  <TableHeader>Análise</TableHeader>
                </div>
                <div className="col-span-2">
                  <TableHeader>Relatório</TableHeader>
                </div>
                <div className="col-span-3">
                  <TableHeader>Ações</TableHeader>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-line">
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-surface-paper transition-colors"
                  >
                    <div className="col-span-3 flex items-center">
                      <div className="font-medium text-navy-900">
                        {submission.companyName}
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <StatusBadge status={submission.status} />
                    </div>
                    <div className="col-span-2 flex items-center">
                      <AnalysisStatus status={submission.status} />
                    </div>
                    <div className="col-span-2 flex items-center">
                      <ReportStatus status={submission.status} />
                    </div>
                    <div className="col-span-3 flex items-center gap-2">
                      <Link href={`/admin/analise/${submission.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                      </Link>
                      <Button
                        variant="architect"
                        size="sm"
                        onClick={() => handleGeneratePdf(submission.id)}
                        disabled={
                          generatingPdf === submission.id ||
                          submission.status === 'completed'
                        }
                      >
                        {generatingPdf === submission.id ? (
                          "Gerando..."
                        ) : submission.status === 'completed' ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Gerado
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Gerar PDF
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Card View (below lg) */}
            <div className="lg:hidden space-y-4">
              {submissions.map((submission) => (
                <Card key={submission.id} className="p-4 border border-line hover:border-gold-500/30 transition-colors">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-semibold text-navy-900 text-base line-clamp-2 flex-1">
                      {submission.companyName}
                    </h3>
                    <StatusBadge status={submission.status} />
                  </div>

                  {/* Status Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <Text variant="small" className="text-text-tertiary mb-1">
                        Análise
                      </Text>
                      <AnalysisStatus status={submission.status} />
                    </div>
                    <div>
                      <Text variant="small" className="text-text-tertiary mb-1">
                        Relatório
                      </Text>
                      <ReportStatus status={submission.status} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link href={`/admin/analise/${submission.id}`} className="flex-1">
                      <Button variant="outline" className="w-full justify-center">
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    </Link>
                    <Button
                      variant="architect"
                      className="flex-1 justify-center"
                      onClick={() => handleGeneratePdf(submission.id)}
                      disabled={
                        generatingPdf === submission.id ||
                        submission.status === 'completed'
                      }
                    >
                      {generatingPdf === submission.id ? (
                        "Gerando..."
                      ) : submission.status === 'completed' ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Gerado
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          PDF
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ============================================
   COMPONENTS
   ============================================ */

function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs uppercase tracking-widest font-bold text-text-secondary">
      {children}
    </div>
  );
}

interface StatusBadgeProps {
  status: SubmissionStatus;
}

function StatusBadge({ status }: StatusBadgeProps) {
  const variants: Record<SubmissionStatus, { bg: string; text: string; label: string }> = {
    pending: { bg: "bg-gray-100", text: "text-gray-600", label: "Pendente" },
    processing: { bg: "bg-blue-50", text: "text-blue-600", label: "Processando" },
    enriching: { bg: "bg-blue-50", text: "text-blue-600", label: "Enriquecendo" },
    enriched: { bg: "bg-indigo-50", text: "text-indigo-600", label: "Enriq. Completo" },
    analyzing: { bg: "bg-purple-50", text: "text-purple-600", label: "Em Análise" },
    analyzed: { bg: "bg-teal-50", text: "text-teal-600", label: "Análise Completa" },
    ready_for_review: { bg: "bg-purple-50", text: "text-purple-600", label: "Revisão Final" },
    generating_report: { bg: "bg-cyan-50", text: "text-cyan-600", label: "Gerando PDF" },
    completed: { bg: "bg-gold-500/10", text: "text-gold-600", label: "Concluído" },
    enrichment_failed: { bg: "bg-red-50", text: "text-red-600", label: "Erro Enriq." },
    analysis_failed: { bg: "bg-red-50", text: "text-red-600", label: "Erro Análise" },
    report_failed: { bg: "bg-red-50", text: "text-red-600", label: "Erro PDF" },
    failed: { bg: "bg-red-50", text: "text-red-600", label: "Erro" },
  };

  const variant = variants[status];
  return <span className={cn("inline-flex items-center px-2 py-1 text-xs font-bold uppercase tracking-wider", variant.bg, variant.text)}>{variant.label}</span>;
}

function AnalysisStatus({ status }: { status: SubmissionStatus }) {
  if (status === 'analyzing' || status === 'analyzed' || status === 'ready_for_review' || status === 'generating_report' || status === 'completed') {
    return <span className="text-sm text-green-600 font-medium">✓ Completa</span>;
  }
  return <span className="text-sm text-gray-500">Pendente</span>;
}

function ReportStatus({ status }: { status: SubmissionStatus }) {
  if (status === 'completed') {
    return <span className="text-sm text-green-600 font-medium">✓ Disponível</span>;
  }
  if (status === 'generating_report') {
    return <span className="text-sm text-blue-600">Gerando...</span>;
  }
  return <span className="text-sm text-gray-500">Não gerado</span>;
}
