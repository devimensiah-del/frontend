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
import { Calendar, Mail, Building2, ChevronRight } from "lucide-react";
import type { Submission, Enrichment } from "@/types";

/* ============================================
   ADMIN ENRIQUECIMENTO - Enrichment List
   Stage 2 of 3-Stage Workflow
   ============================================ */

type EnrichmentStatus = "pending" | "approved" | "rejected";

interface SubmissionWithEnrichment extends Submission {
  enrichment?: Enrichment;
}

export default function EnrichmentListPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [submissions, setSubmissions] = useState<SubmissionWithEnrichment[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<SubmissionWithEnrichment[]>([]);
  const [statusFilter, setStatusFilter] = useState<EnrichmentStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch submissions with enrichment data
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        // Get all submissions
        const response = await adminApi.getAllSubmissions();
        const submissionsData = response.data;

        // Fetch enrichment data for each submission
        const submissionsWithEnrichment = await Promise.all(
          submissionsData.map(async (submission: Submission) => {
            try {
              const enrichment = await enrichmentApi.getBySubmissionId(submission.id);
              return { ...submission, enrichment };
            } catch (error) {
              // No enrichment data yet
              return { ...submission, enrichment: undefined };
            }
          })
        );

        setSubmissions(submissionsWithEnrichment);
        setFilteredSubmissions(submissionsWithEnrichment);
      } catch (error: any) {
        toast({
          title: "Erro ao carregar dados",
          description: error.message || "Não foi possível carregar as submissões.",
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
    const approved = submissions.filter(
      (s) => s.enrichment?.status === "approved"
    ).length;
    const rejected = submissions.filter(
      (s) => s.enrichment?.status === "rejected"
    ).length;

    return { pending, approved, rejected, total: submissions.length };
  };

  const stats = getEnrichmentStats();

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

            {/* Stats Cards - Responsive Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:flex">
              <StatsCard label="Total" value={stats.total} />
              <StatsCard
                label="Pendentes"
                value={stats.pending}
                variant="warning"
              />
              <StatsCard
                label="Aprovados"
                value={stats.approved}
                variant="success"
              />
            </div>
          </div>
        </div>
      </header>

      {/* --- FILTERS & SEARCH --- */}
      <div className="p-4 sm:p-8 pb-4">
        {/* Mobile: Stack filters vertically */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Status Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-sm font-medium text-text-secondary">
              Filtrar:
            </span>
            <div className="flex flex-wrap gap-2">
              <FilterButton
                active={statusFilter === "all"}
                onClick={() => setStatusFilter("all")}
              >
                Todos ({stats.total})
              </FilterButton>
              <FilterButton
                active={statusFilter === "pending"}
                onClick={() => setStatusFilter("pending")}
              >
                Pendentes ({stats.pending})
              </FilterButton>
              <FilterButton
                active={statusFilter === "approved"}
                onClick={() => setStatusFilter("approved")}
              >
                Aprovados ({stats.approved})
              </FilterButton>
              <FilterButton
                active={statusFilter === "rejected"}
                onClick={() => setStatusFilter("rejected")}
              >
                Rejeitados ({stats.rejected})
              </FilterButton>
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

        {/* Breadcrumb Link */}
        <div className="mt-4">
          <Link
            href="/admin/dashboard"
            className="text-sm text-gold-600 hover:text-gold-700 font-medium"
          >
            ← Voltar para Submissions
          </Link>
        </div>
      </div>

      {/* --- ENRICHMENT CONTENT --- */}
      <div className="px-4 sm:px-8 pb-8">
        {filteredSubmissions.length === 0 ? (
          <EmptyState searchQuery={searchQuery} statusFilter={statusFilter} />
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
                {filteredSubmissions.map((submission) => (
                  <Link
                    key={submission.id}
                    href={`/admin/enriquecimento/${submission.id}`}
                    className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-surface-paper transition-colors cursor-pointer group"
                  >
                    {/* Company Name */}
                    <div className="col-span-3 flex items-center">
                      <div className="font-medium text-navy-900 group-hover:text-gold-500 transition-colors">
                        {submission.companyName}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-span-3 flex items-center">
                      <div className="text-sm text-text-secondary">
                        {submission.email}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-2 flex items-center">
                      <EnrichmentStatusBadge
                        status={submission.enrichment?.status || "pending"}
                      />
                    </div>

                    {/* Last Updated */}
                    <div className="col-span-2 flex items-center">
                      <div className="text-sm text-text-secondary">
                        {submission.enrichment?.updatedAt
                          ? formatDate(submission.enrichment.updatedAt)
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
                ))}
              </div>
            </div>

            {/* Mobile Card View - Visible Only on Mobile */}
            <div className="lg:hidden space-y-4">
              {filteredSubmissions.map((submission) => (
                <EnrichmentCard
                  key={submission.id}
                  submission={submission}
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
   MOBILE ENRICHMENT CARD COMPONENT
   ============================================ */

interface EnrichmentCardProps {
  submission: SubmissionWithEnrichment;
}

function EnrichmentCard({ submission }: EnrichmentCardProps) {
  return (
    <Link href={`/admin/enriquecimento/${submission.id}`}>
      <div className="bg-white border border-line p-4 hover:shadow-md transition-shadow">
        {/* Header with Company Name and Status */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 mr-2">
            <h3 className="font-medium text-navy-900 truncate text-lg">
              {submission.companyName}
            </h3>
          </div>
          <EnrichmentStatusBadge
            status={submission.enrichment?.status || "pending"}
          />
        </div>

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
              {submission.enrichment?.updatedAt
                ? formatDate(submission.enrichment.updatedAt)
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
        <Button
          variant="architect"
          size="sm"
          className="w-full"
        >
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
  status: EnrichmentStatus;
}

function EnrichmentStatusBadge({ status }: EnrichmentStatusBadgeProps) {
  const variants: Record<
    EnrichmentStatus,
    { variant: "warning" | "success" | "error"; label: string }
  > = {
    pending: { variant: "warning", label: "Pendente" },
    approved: { variant: "success", label: "Aprovado" },
    rejected: { variant: "error", label: "Rejeitado" },
  };

  const config = variants[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}

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

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function FilterButton({ active, onClick, children }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors whitespace-nowrap",
        active
          ? "bg-navy-900 text-white"
          : "bg-white text-text-secondary border border-line hover:bg-surface-paper"
      )}
    >
      {children}
    </button>
  );
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
