"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { AdminInboxSkeleton } from "@/components/skeletons";
import { toast } from "@/components/ui/use-toast";
import { adminApi } from "@/lib/api/client";
import type { SubmissionStatus, Submission } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, FileText, Calendar, Building2 } from "lucide-react";

/* ============================================
   ADMIN DASHBOARD - Caixa de Envios
   ============================================ */

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [startingEnrichment, setStartingEnrichment] = useState<string | null>(null);

  // Fetch submissions from API
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await adminApi.getAllSubmissions();
        setSubmissions(data.data || []); // Ensure always an array
      } catch (err) {
        console.error("Error fetching submissions:", err);
        setError("Erro ao carregar envios. Por favor, tente novamente.");
        toast({
          title: "Erro ao Carregar Dados",
          description: "Não foi possível carregar os envios. Verifique sua conexão.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const handleStartEnrichment = async (submission: Submission) => {
    // NEW ARCHITECTURE: All submissions are 'received', so we can always start enrichment
    // Just redirect to the enrichment page directly
    try {
      setStartingEnrichment(submission.id);

      toast({
        title: "Redirecionando para enriquecimento",
        description: "Abrindo editor de enriquecimento...",
        variant: "default",
      });

      // Redirect to enrichment editor
      router.push(`/admin/enriquecimento/${submission.id}`);
    } catch (_error: any) {
      toast({
        title: "Erro ao abrir enriquecimento",
        description: _error.message || "Não foi possível abrir o editor.",
        variant: "destructive",
      });
      setStartingEnrichment(null);
    }
  };

  if (isLoading) {
    return <AdminInboxSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-paper flex items-center justify-center p-4">
        <div className="bg-white border border-line p-8 max-w-md w-full">
          <h2 className="font-heading text-2xl font-medium text-navy-900 mb-4">
            Erro ao Carregar
          </h2>
          <p className="text-text-secondary mb-6">{error}</p>
          <Button onClick={() => window.location.reload()} variant="architect" className="w-full">
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  // NEW ARCHITECTURE: All submissions have status 'received'
  // Show total count for now (can be enhanced with enrichment/analysis status later)
  const pendingCount = 0; // All are received, none truly "pending"
  const completedCount = 0; // Would need to check analysis status = 'sent'

  return (
    <div className="min-h-screen bg-surface-paper">
      {/* --- PAGE HEADER --- */}
      <header className="bg-white border-b border-line">
        <div className="px-4 sm:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-medium tracking-tight text-navy-900">
                Caixa de Envios
              </h1>
              <p className="text-sm text-text-secondary mt-1">
                Gerencie e revise todos os envios de clientes
              </p>
            </div>

            {/* Stats Cards - Responsive Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:flex">
              <StatsCard label="Total" value={submissions.length} />
              <StatsCard
                label="Pendentes"
                value={pendingCount}
                variant="warning"
              />
              <StatsCard
                label="Concluídos"
                value={completedCount}
                variant="success"
              />
            </div>
          </div>
        </div>
      </header>

      {/* --- SUBMISSIONS CONTENT --- */}
      <div className="p-4 sm:p-8">
        {submissions.length === 0 ? (
          <div className="bg-white border border-line p-12 text-center">
            <p className="text-text-secondary">
              Nenhum envio encontrado.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View - Hidden on Mobile */}
            <div className="hidden lg:block bg-white border border-line shadow-sm overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-surface-paper border-b border-line">
                <div className="col-span-3">
                  <TableHeader>Empresa</TableHeader>
                </div>
                <div className="col-span-3">
                  <TableHeader>CNPJ</TableHeader>
                </div>
                <div className="col-span-2">
                  <TableHeader>Status</TableHeader>
                </div>
                <div className="col-span-2">
                  <TableHeader>Enviado</TableHeader>
                </div>
                <div className="col-span-2">
                  <TableHeader>Ações</TableHeader>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-line">
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-surface-paper transition-colors group"
                  >
                    {/* Company Name */}
                    <div className="col-span-3 flex items-center">
                      <div className="font-medium text-navy-900 group-hover:text-gold-500 transition-colors">
                        {submission.companyName}
                      </div>
                    </div>

                    {/* CNPJ */}
                    <div className="col-span-3 flex items-center">
                      <div className="text-sm text-text-secondary font-mono">
                        {submission.cnpj || "—"}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-2 flex items-center">
                      <StatusBadge status={submission.status} />
                    </div>

                    {/* Date */}
                    <div className="col-span-2 flex items-center">
                      <div className="text-sm text-text-secondary">
                        {formatDate(submission.createdAt)}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            disabled={startingEnrichment === submission.id}
                          >
                            {startingEnrichment === submission.id ? (
                              <span className="text-xs">...</span>
                            ) : (
                              <MoreVertical className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/submissions/${submission.id}`}>
                              Ver Detalhes
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStartEnrichment(submission)}
                            disabled={startingEnrichment === submission.id}
                          >
                            Iniciar Enriquecimento
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Card View - Visible Only on Mobile */}
            <div className="lg:hidden space-y-4">
              {submissions.map((submission) => (
                <SubmissionCard
                  key={submission.id}
                  submission={submission}
                  onStartEnrichment={handleStartEnrichment}
                  isStarting={startingEnrichment === submission.id}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ============================================
   MOBILE SUBMISSION CARD COMPONENT
   ============================================ */

interface SubmissionCardProps {
  submission: Submission;
  onStartEnrichment: (submission: Submission) => void;
  isStarting: boolean;
}

function SubmissionCard({ submission, onStartEnrichment, isStarting }: SubmissionCardProps) {
  return (
    <div className="bg-white border border-line p-4 hover:shadow-md transition-shadow">
      {/* Header with Company Name and Status */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-2">
          <h3 className="font-medium text-navy-900 truncate text-lg">
            {submission.companyName}
          </h3>
          {submission.cnpj && (
            <p className="text-xs text-text-secondary font-mono mt-1">
              {submission.cnpj}
            </p>
          )}
        </div>
        <StatusBadge status={submission.status} />
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-4 text-xs text-text-secondary mb-4">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(submission.createdAt)}</span>
        </div>
        {submission.industry && (
          <div className="flex items-center gap-1">
            <Building2 className="w-3 h-3" />
            <span>{submission.industry}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Link
          href={`/admin/submissions/${submission.id}`}
          className="flex-1"
        >
          <Button
            variant="outline"
            size="sm"
            className="w-full"
          >
            <FileText className="w-4 h-4 mr-2" />
            Ver Detalhes
          </Button>
        </Link>
        <Button
          variant="architect"
          size="sm"
          onClick={() => onStartEnrichment(submission)}
          disabled={isStarting}
          className="flex-1"
        >
          {isStarting ? "..." : "Enriquecer"}
        </Button>
      </div>
    </div>
  );
}

/* ============================================
   TABLE HEADER COMPONENT
   ============================================ */

function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs uppercase tracking-widest font-bold text-text-secondary">
      {children}
    </div>
  );
}

/* ============================================
   STATUS BADGE COMPONENT
   ============================================ */

interface StatusBadgeProps {
  status: SubmissionStatus;
}

function StatusBadge({ status }: StatusBadgeProps) {
  // NEW ARCHITECTURE: All submissions have status 'received'
  const variants: Record<string, { bg: string; text: string; label: string }> = {
    received: { bg: "bg-green-100", text: "text-green-600", label: "Recebido" },
  };
  const variantsOld = {
    pending: {
      bg: "bg-gray-100",
      text: "text-gray-600",
      label: "Pendente",
    },
    processing: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      label: "Processando",
    },
    enriching: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      label: "Em Enriquecimento",
    },
    enriched: {
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      label: "Enriquecimento Completo",
    },
    analyzing: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      label: "Em Análise",
    },
    analyzed: {
      bg: "bg-teal-50",
      text: "text-teal-600",
      label: "Análise Completa",
    },
    ready_for_review: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      label: "Revisão Final",
    },
    generating_report: {
      bg: "bg-cyan-50",
      text: "text-cyan-600",
      label: "Gerando Relatório",
    },
    completed: {
      bg: "bg-gold-500/10",
      text: "text-gold-600",
      label: "Concluído",
    },
    enrichment_failed: {
      bg: "bg-red-50",
      text: "text-red-600",
      label: "Erro no Enriquecimento",
    },
    analysis_failed: {
      bg: "bg-red-50",
      text: "text-red-600",
      label: "Erro na Análise",
    },
    report_failed: {
      bg: "bg-red-50",
      text: "text-red-600",
      label: "Erro no Relatório",
    },
    failed: {
      bg: "bg-red-50",
      text: "text-red-600",
      label: "Erro",
    },
  };

  const variant = variants[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 text-xs font-bold uppercase tracking-wider whitespace-nowrap",
        variant.bg,
        variant.text
      )}
    >
      {variant.label}
    </span>
  );
}

/* ============================================
   STATS CARD COMPONENT
   ============================================ */

interface StatsCardProps {
  label: string;
  value: number;
  variant?: "default" | "warning" | "success";
}

function StatsCard({ label, value, variant = "default" }: StatsCardProps) {
  const variants = {
    default: "border-line text-navy-900",
    warning: "border-gold-500 text-gold-600",
    success: "border-navy-900 text-navy-900",
  };

  return (
    <div className={cn("border px-3 py-2 bg-white", variants[variant])}>
      <div className="text-xl sm:text-2xl font-light font-heading">{value}</div>
      <div className="text-xs uppercase tracking-widest text-text-secondary mt-0.5">
        {label}
      </div>
    </div>
  );
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
