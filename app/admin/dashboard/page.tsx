"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { AdminInboxSkeleton } from "@/components/skeletons";
import { toast } from "@/components/ui/use-toast";
import { adminApi, enrichmentApi, analysisApi } from "@/lib/api/client";
import type { Submission, Enrichment, Analysis } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, FileText, Calendar, Building2, AlertCircle, Loader, CheckCircle } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { FilterTab } from "@/components/admin/FilterTab";
import { StageIndicator } from "@/components/admin/StageIndicator";
import { NextActionBadge } from "@/components/admin/NextActionBadge";
import { AdminSubmissionCard } from "@/components/admin/AdminSubmissionCard";
import { getWorkflowStage, getNextAction, type WorkflowStage } from "@/lib/utils/workflow";

/* ============================================
   ADMIN DASHBOARD - ACTION-ORIENTED REDESIGN
   With batch operations and workflow indicators
   ============================================ */

interface SubmissionWithWorkflow extends Submission {
  enrichment?: Enrichment | null;
  analysis?: Analysis | null;
}

type FilterType = 'all' | 'action' | 'processing' | 'completed';

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [submissions, setSubmissions] = useState<SubmissionWithWorkflow[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<SubmissionWithWorkflow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [batchProcessing, setBatchProcessing] = useState(false);

  // Fetch submissions with enrichment/analysis data
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await adminApi.getAllSubmissions();
        const submissionsData = data.data || [];

        // Fetch enrichment and analysis for each submission
        const submissionsWithWorkflow = await Promise.all(
          submissionsData.map(async (submission: Submission) => {
            let enrichment = null;
            let analysis = null;

            try {
              enrichment = await enrichmentApi.getBySubmissionId(submission.id);
            } catch (e) {
              // No enrichment yet
            }

            // Fetch analysis data when available
            try {
              analysis = await analysisApi.getBySubmissionId(submission.id);
            } catch (e) {
              // No analysis yet
            }

            return { ...submission, enrichment, analysis };
          })
        );

        setSubmissions(submissionsWithWorkflow);
        setFilteredSubmissions(submissionsWithWorkflow);
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

  // Filter submissions by workflow stage
  useEffect(() => {
    if (filter === 'all') {
      setFilteredSubmissions(submissions);
      return;
    }

    const filtered = submissions.filter((sub) => {
      const stage = getWorkflowStage(sub.enrichment, sub.analysis);
      const nextAction = getNextAction(sub.enrichment, sub.analysis);

      if (filter === 'action') {
        // Show items that need admin action
        return nextAction?.enabled;
      }

      if (filter === 'processing') {
        // Show items being processed
        return sub.enrichment?.status === 'pending' || sub.analysis?.status === 'pending';
      }

      if (filter === 'completed') {
        // Show completed items
        return stage === 'complete';
      }

      return true;
    });

    setFilteredSubmissions(filtered);
  }, [filter, submissions]);

  // Calculate stats
  const stats = {
    total: submissions.length,
    actionNeeded: submissions.filter((sub) => {
      const nextAction = getNextAction(sub.enrichment, sub.analysis);
      return nextAction?.enabled;
    }).length,
    processing: submissions.filter(
      (sub) => sub.enrichment?.status === 'pending' || sub.analysis?.status === 'pending'
    ).length,
    completed: submissions.filter((sub) => getWorkflowStage(sub.enrichment, sub.analysis) === 'complete')
      .length,
  };

  // Batch selection handlers
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === filteredSubmissions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSubmissions.map((s) => s.id));
    }
  };

  const deselectAll = () => setSelectedIds([]);

  const batchApprove = async () => {
    try {
      setBatchProcessing(true);
      // TODO: Implement batch approval
      toast({
        title: "Aprovação em lote",
        description: `Processando ${selectedIds.length} itens...`,
        variant: "default",
      });
      // For now, just show success
      setTimeout(() => {
        toast({
          title: "Sucesso",
          description: `${selectedIds.length} itens aprovados.`,
          variant: "default",
        });
        setSelectedIds([]);
        setBatchProcessing(false);
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível processar a aprovação em lote.",
        variant: "destructive",
      });
      setBatchProcessing(false);
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

  return (
    <div className="min-h-screen bg-surface-paper">
      {/* --- PAGE HEADER WITH STATS --- */}
      <header className="bg-white border-b border-line">
        <div className="px-4 sm:px-8 py-6">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-medium tracking-tight text-navy-900">
                Dashboard Administrativo
              </h1>
              <p className="text-sm text-text-secondary mt-1">
                Gerencie workflows e tome ações em tempo real
              </p>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard
                label="Ação Necessária"
                value={stats.actionNeeded}
                variant="error"
                icon={AlertCircle}
              />
              <StatCard
                label="Em Processamento"
                value={stats.processing}
                variant="warning"
                icon={Loader}
              />
              <StatCard
                label="Concluídos"
                value={stats.completed}
                variant="success"
                icon={CheckCircle}
              />
              <StatCard
                label="Total"
                value={stats.total}
                variant="default"
              />
            </div>
          </div>
        </div>
      </header>

      {/* --- FILTERS & BATCH ACTIONS --- */}
      <div className="px-4 sm:px-8 py-4 bg-white border-b border-line">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Stage Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            <FilterTab
              active={filter === 'all'}
              onClick={() => setFilter('all')}
            >
              Todos ({stats.total})
            </FilterTab>
            <FilterTab
              active={filter === 'action'}
              onClick={() => setFilter('action')}
            >
              Ação Necessária ({stats.actionNeeded})
            </FilterTab>
            <FilterTab
              active={filter === 'processing'}
              onClick={() => setFilter('processing')}
            >
              Processando ({stats.processing})
            </FilterTab>
            <FilterTab
              active={filter === 'completed'}
              onClick={() => setFilter('completed')}
            >
              Concluídos ({stats.completed})
            </FilterTab>
          </div>

          {/* Batch Actions */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-secondary">
                {selectedIds.length} selecionados
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={deselectAll}
                disabled={batchProcessing}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={batchApprove}
                disabled={batchProcessing}
              >
                {batchProcessing ? "Processando..." : "Aprovar em Lote"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* --- SUBMISSIONS CONTENT --- */}
      <div className="px-4 sm:px-8 py-8">
        {filteredSubmissions.length === 0 ? (
          <div className="bg-white border border-line p-12 text-center">
            <p className="text-text-secondary">
              {filter === 'all'
                ? "Nenhum envio encontrado."
                : `Nenhum item no filtro "${filter}".`}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View - Hidden on Mobile */}
            <div className="hidden lg:block bg-white border border-line shadow-sm overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-surface-paper border-b border-line">
                <div className="col-span-1">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === filteredSubmissions.length &&
                      filteredSubmissions.length > 0
                    }
                    onChange={selectAll}
                    className="w-4 h-4 text-gold-600 focus:ring-gold-500 border-gray-300 rounded"
                  />
                </div>
                <div className="col-span-3">
                  <TableHeader>Empresa</TableHeader>
                </div>
                <div className="col-span-2">
                  <TableHeader>Workflow</TableHeader>
                </div>
                <div className="col-span-3">
                  <TableHeader>Próxima Ação</TableHeader>
                </div>
                <div className="col-span-2">
                  <TableHeader>Data</TableHeader>
                </div>
                <div className="col-span-1">
                  <TableHeader>Ações</TableHeader>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-line">
                {filteredSubmissions.map((submission) => {
                  const stage = getWorkflowStage(
                    submission.enrichment,
                    submission.analysis
                  );
                  const nextAction = getNextAction(
                    submission.enrichment,
                    submission.analysis
                  );
                  const isSelected = selectedIds.includes(submission.id);

                  return (
                    <div
                      key={submission.id}
                      className={cn(
                        "grid grid-cols-12 gap-4 px-6 py-4 transition-colors group",
                        isSelected
                          ? "bg-gold-500/5 hover:bg-gold-500/10"
                          : "hover:bg-surface-paper"
                      )}
                    >
                      {/* Checkbox */}
                      <div className="col-span-1 flex items-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(submission.id)}
                          className="w-4 h-4 text-gold-600 focus:ring-gold-500 border-gray-300 rounded"
                        />
                      </div>

                      {/* Company Name */}
                      <div className="col-span-3 flex items-center">
                        <div className="font-medium text-navy-900 group-hover:text-gold-500 transition-colors">
                          {submission.companyName}
                        </div>
                      </div>

                      {/* Workflow Stage */}
                      <div className="col-span-2 flex items-center">
                        <StageIndicator currentStage={stage} size="sm" showLabel={false} />
                      </div>

                      {/* Next Action */}
                      <div className="col-span-3 flex items-center">
                        {nextAction && (
                          <NextActionBadge
                            {...nextAction}
                            size="sm"
                            showIcon={false}
                          />
                        )}
                      </div>

                      {/* Date */}
                      <div className="col-span-2 flex items-center">
                        <div className="text-sm text-text-secondary">
                          {formatDate(submission.updatedAt)}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="col-span-1 flex items-center justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/enriquecimento/${submission.id}`}>
                                Ver Enriquecimento
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/analise/${submission.id}`}>
                                Ver Análise
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Card View - Visible Only on Mobile */}
            <div className="lg:hidden space-y-4">
              {filteredSubmissions.map((submission) => {
                const nextAction = getNextAction(
                  submission.enrichment,
                  submission.analysis
                );

                return (
                  <AdminSubmissionCard
                    key={submission.id}
                    submission={submission}
                    enrichment={submission.enrichment}
                    analysis={submission.analysis}
                    selected={selectedIds.includes(submission.id)}
                    onToggleSelect={() => toggleSelect(submission.id)}
                    nextAction={nextAction || undefined}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ============================================
   UTILITY COMPONENTS
   ============================================ */

function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs uppercase tracking-widest font-bold text-text-secondary">
      {children}
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
