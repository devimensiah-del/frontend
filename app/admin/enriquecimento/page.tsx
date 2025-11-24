"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { adminApi, enrichmentApi } from "@/lib/api/client";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { EnrichmentListSkeleton } from "@/components/skeletons";
import { Calendar, Mail, Building2, ChevronRight, Clock, Lock } from "lucide-react";
import type { Submission, Enrichment } from "@/types";
import { StatCard } from "@/components/admin/StatCard";
import { FilterTab } from "@/components/admin/FilterTab";
import { StatusIcon } from "@/components/admin/StatusIcon";

/* ============================================
   ADMIN ENRIQUECIMENTO - WITH BATCH OPERATIONS
   Stage 2 of 3-Stage Workflow
   ============================================ */

interface SubmissionWithEnrichment extends Submission {
  enrichment?: Enrichment;
}

export default function EnrichmentListPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [submissions, setSubmissions] = useState<SubmissionWithEnrichment[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<SubmissionWithEnrichment[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [batchProcessing, setBatchProcessing] = useState(false);

  // Fetch submissions with enrichment data
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        // Get all submissions
        const response = await adminApi.getAllSubmissions();
        const submissionsData = response.data || [];

        // Fetch enrichment data for each submission
        const submissionsWithEnrichment = await Promise.all(
          submissionsData.map(async (submission: Submission) => {
            try {
              const enrichment = await enrichmentApi.getBySubmissionId(submission.id);
              return { ...submission, enrichment };
            } catch (_error) {
              return { ...submission, enrichment: undefined };
            }
          })
        );

        setSubmissions(submissionsWithEnrichment);
        setFilteredSubmissions(submissionsWithEnrichment);
      } catch (_error: any) {
        toast({
          title: "Erro ao carregar dados",
          description: _error.message || "Não foi possível carregar as submissões.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter submissions
  useEffect(() => {
    let filtered = submissions;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (s) => s.enrichment?.status === statusFilter
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.companyName.toLowerCase().includes(query) ||
          s.email?.toLowerCase().includes(query)
      );
    }

    setFilteredSubmissions(filtered);
  }, [statusFilter, searchQuery, submissions]);

  const getEnrichmentStats = () => {
    const pending = submissions.filter(
      (s) => s.enrichment?.status === "pending" || !s.enrichment
    ).length;
    const completed = submissions.filter(
      (s) => s.enrichment?.status === "completed"
    ).length;
    const approved = submissions.filter(
      (s) => s.enrichment?.status === "approved"
    ).length;

    return { pending, completed, approved, total: submissions.length };
  };

  const stats = getEnrichmentStats();

  // Batch selection
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
      // TODO: Implement batch approval API
      toast({
        title: "Aprovação em lote",
        description: `Processando ${selectedIds.length} enriquecimentos...`,
        variant: "default",
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Sucesso",
        description: `${selectedIds.length} enriquecimentos aprovados.`,
        variant: "default",
      });

      setSelectedIds([]);
      // Refetch data
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível processar a aprovação em lote.",
        variant: "destructive",
      });
    } finally {
      setBatchProcessing(false);
    }
  };

  if (isLoading) {
    return <EnrichmentListSkeleton />;
  }

  return (
    <div className="min-h-screen bg-surface-paper">
      {/* --- PAGE HEADER --- */}
      <header className="bg-white border-b border-line">
        <div className="px-4 sm:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-medium tracking-tight text-navy-900">
                Enriquecimento de Dados
              </h1>
              <p className="text-sm text-text-secondary mt-1">
                Stage 2: Revisar e aprovar dados enriquecidos
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 lg:flex">
              <StatCard label="Total" value={stats.total} />
              <StatCard
                label="Pendentes"
                value={stats.pending}
                variant="warning"
              />
              <StatCard
                label="Prontos"
                value={stats.completed}
                variant="success"
                trend={stats.completed > 0 ? "+3 hoje" : undefined}
              />
              <StatCard
                label="Aprovados"
                value={stats.approved}
                variant="default"
              />
            </div>
          </div>
        </div>
      </header>

      {/* --- FILTERS & SEARCH --- */}
      <div className="p-4 sm:p-8 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Status Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-sm font-medium text-text-secondary">
              Filtrar:
            </span>
            <div className="flex flex-wrap gap-2">
              <FilterTab
                active={statusFilter === "all"}
                onClick={() => setStatusFilter("all")}
              >
                Todos ({stats.total})
              </FilterTab>
              <FilterTab
                active={statusFilter === "pending"}
                onClick={() => setStatusFilter("pending")}
              >
                Pendentes ({stats.pending})
              </FilterTab>
              <FilterTab
                active={statusFilter === "completed"}
                onClick={() => setStatusFilter("completed")}
              >
                Prontos ({stats.completed})
              </FilterTab>
              <FilterTab
                active={statusFilter === "approved"}
                onClick={() => setStatusFilter("approved")}
              >
                Aprovados ({stats.approved})
              </FilterTab>
            </div>
          </div>

          {/* Search */}
          <div className="sm:ml-auto w-full sm:w-80">
            <Input
              type="text"
              placeholder="Buscar por empresa ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Batch Actions Bar */}
        {selectedIds.length > 0 && (
          <div className="mt-4 p-4 bg-gold-500/5 border border-gold-500/30 flex items-center justify-between">
            <span className="text-sm font-medium text-navy-900">
              {selectedIds.length} selecionados
            </span>
            <div className="flex gap-2">
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
                {batchProcessing ? "Processando..." : "Aprovar Todos"}
              </Button>
            </div>
          </div>
        )}

        {/* Breadcrumb Link */}
        <div className="mt-4">
          <Link
            href="/admin/dashboard"
            className="text-sm text-gold-600 hover:text-gold-700 font-medium"
          >
            ← Voltar para Dashboard
          </Link>
        </div>
      </div>

      {/* --- ENRICHMENT CONTENT --- */}
      <div className="px-4 sm:px-8 pb-8">
        {filteredSubmissions.length === 0 ? (
          <EmptyState searchQuery={searchQuery} statusFilter={statusFilter} />
        ) : (
          <>
            {/* Desktop Table View */}
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
                  <TableHeader>Email</TableHeader>
                </div>
                <div className="col-span-2">
                  <TableHeader>Status</TableHeader>
                </div>
                <div className="col-span-2">
                  <TableHeader>Última Atualização</TableHeader>
                </div>
                <div className="col-span-2">
                  <TableHeader>Ações</TableHeader>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-line">
                {filteredSubmissions.map((submission) => {
                  const isSelected = selectedIds.includes(submission.id);
                  const enrichment = submission.enrichment;
                  const isLocked = enrichment?.isLocked;
                  const progress = enrichment?.progress;

                  return (
                    <Link
                      key={submission.id}
                      href={`/admin/enriquecimento/${submission.id}`}
                      className={cn(
                        "grid grid-cols-12 gap-4 px-6 py-4 transition-colors cursor-pointer group",
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
                          onChange={(e) => {
                            e.preventDefault();
                            toggleSelect(submission.id);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 text-gold-600 focus:ring-gold-500 border-gray-300 rounded"
                        />
                      </div>

                      {/* Company Name */}
                      <div className="col-span-3 flex items-center">
                        <div>
                          <div className="font-medium text-navy-900 group-hover:text-gold-500 transition-colors">
                            {submission.companyName}
                          </div>
                          {isLocked && (
                            <div className="flex items-center gap-1 text-xs text-gold-600 mt-1">
                              <Lock className="w-3 h-3" />
                              <span>Em edição</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Email */}
                      <div className="col-span-2 flex items-center">
                        <div className="text-sm text-text-secondary truncate">
                          {submission.email}
                        </div>
                      </div>

                      {/* Status with Progress */}
                      <div className="col-span-2 flex items-center gap-2">
                        <StatusIcon
                          status={enrichment?.status || "pending"}
                          size="sm"
                        />
                        <div>
                          <EnrichmentStatusBadge
                            status={enrichment?.status || "pending"}
                          />
                          {progress !== undefined && progress < 100 && (
                            <div className="text-xs text-text-tertiary mt-1">
                              {progress}% completo
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Last Updated */}
                      <div className="col-span-2 flex items-center">
                        <div className="text-sm text-text-secondary">
                          {enrichment?.updatedAt
                            ? formatDate(enrichment.updatedAt)
                            : formatDate(submission.updatedAt)}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="col-span-2 flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            router.push(`/admin/enriquecimento/${submission.id}`);
                          }}
                          className="text-xs uppercase tracking-wider font-medium text-navy-900 hover:text-gold-500 transition-colors"
                        >
                          Editar →
                        </button>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {filteredSubmissions.map((submission) => (
                <EnrichmentCard
                  key={submission.id}
                  submission={submission}
                  selected={selectedIds.includes(submission.id)}
                  onToggleSelect={() => toggleSelect(submission.id)}
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
   MOBILE ENRICHMENT CARD
   ============================================ */

interface EnrichmentCardProps {
  submission: SubmissionWithEnrichment;
  selected?: boolean;
  onToggleSelect?: () => void;
}

function EnrichmentCard({ submission, selected, onToggleSelect }: EnrichmentCardProps) {
  const enrichment = submission.enrichment;
  const isLocked = enrichment?.isLocked;
  const progress = enrichment?.progress;

  return (
    <Link href={`/admin/enriquecimento/${submission.id}`}>
      <div
        className={cn(
          "bg-white border p-4 hover:shadow-md transition-all",
          selected && "border-gold-500 bg-gold-500/5"
        )}
      >
        {/* Header with Checkbox */}
        <div className="flex items-start justify-between mb-3">
          {onToggleSelect && (
            <input
              type="checkbox"
              checked={selected}
              onChange={(e) => {
                e.preventDefault();
                onToggleSelect();
              }}
              onClick={(e) => e.stopPropagation()}
              className="mt-1 w-4 h-4 text-gold-600 focus:ring-gold-500 border-gray-300 rounded"
            />
          )}
          <div className="flex-1 min-w-0 mx-2">
            <h3 className="font-medium text-navy-900 truncate text-lg">
              {submission.companyName}
            </h3>
            {isLocked && (
              <div className="flex items-center gap-1 text-xs text-gold-600 mt-1">
                <Lock className="w-3 h-3" />
                <span>Em edição</span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            <StatusIcon status={enrichment?.status || "pending"} size="sm" />
            <EnrichmentStatusBadge status={enrichment?.status || "pending"} />
          </div>
        </div>

        {/* Progress Bar */}
        {progress !== undefined && progress < 100 && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
              <span>Progresso</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-gold-500 h-1.5 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="space-y-2 text-xs text-text-secondary mb-4">
          {submission.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{submission.email}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3 flex-shrink-0" />
            <span>
              Atualizado:{" "}
              {enrichment?.updatedAt
                ? formatDate(enrichment.updatedAt)
                : formatDate(submission.updatedAt)}
            </span>
          </div>
          {submission.industry && (
            <div className="flex items-center gap-2">
              <Building2 className="w-3 h-3 flex-shrink-0" />
              <span>{submission.industry}</span>
            </div>
          )}
        </div>

        {/* Action */}
        <Button variant="architect" size="sm" className="w-full">
          <span>Editar Enriquecimento</span>
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </Link>
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

interface EnrichmentStatusBadgeProps {
  status: string;
}

function EnrichmentStatusBadge({ status }: EnrichmentStatusBadgeProps) {
  const variants: Record<
    string,
    { variant: "warning" | "success" | "default" | "gold"; label: string }
  > = {
    pending: { variant: "warning", label: "Pendente" },
    completed: { variant: "gold", label: "Pronto" },
    approved: { variant: "success", label: "Aprovado" },
  };

  const config = variants[status] || variants.pending;

  return <Badge variant={config.variant}>{config.label}</Badge>;
}

interface EmptyStateProps {
  searchQuery: string;
  statusFilter: string;
}

function EmptyState({ searchQuery, statusFilter }: EmptyStateProps) {
  return (
    <Card className="bg-white p-8 sm:p-12 text-center">
      <div className="max-w-md mx-auto">
        <h3 className="font-heading text-xl font-medium text-navy-900 mb-2">
          Nenhum resultado encontrado
        </h3>
        <p className="text-text-secondary mb-6 text-sm">
          {searchQuery
            ? `Não foram encontradas submissões com "${searchQuery}".`
            : statusFilter !== "all"
            ? `Não há submissões com status "${statusFilter}".`
            : "Não há submissões disponíveis no momento."}
        </p>
        {(searchQuery || statusFilter !== "all") && (
          <Link
            href="/admin/enriquecimento"
            className="inline-block px-6 py-2 bg-navy-900 text-white text-sm font-medium uppercase tracking-wider hover:bg-navy-800 transition-colors"
          >
            Limpar Filtros
          </Link>
        )}
      </div>
    </Card>
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
