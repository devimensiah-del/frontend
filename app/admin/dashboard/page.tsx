"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { AdminInboxSkeleton } from "@/components/skeletons";
import { toast } from "@/components/ui/use-toast";
import { enrichmentApi, adminApi } from "@/lib/api/client";
import { canStartEnrichment } from "@/lib/utils/workflow";
import type { SubmissionStatus } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

/* ============================================
   ADMIN DASHBOARD - Submissions Inbox
   ============================================ */

// Mock Data - Matches new Submission type from lib/types
const MOCK_SUBMISSIONS = [
  {
    id: "uuid-1",
    userId: "admin-1",
    companyName: "Acme Corp",
    cnpj: "12.345.678/0001-90",
    industry: "Tecnologia",
    companySize: "Médio Porte (50-250)",
    website: "https://acmecorp.com",
    strategicGoal: "Expandir mercado internacional",
    currentChallenges: "Competição acirrada no setor",
    competitivePosition: "Líder regional",
    status: "concluido" as const,
    paymentStatus: "aprovado" as const,
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-15T14:00:00Z",
  },
  {
    id: "uuid-2",
    userId: "admin-1",
    companyName: "TechStart Inc",
    cnpj: "23.456.789/0001-01",
    industry: "Software",
    companySize: "Pequeno Porte (10-50)",
    website: "https://techstart.io",
    strategicGoal: "Crescer base de usuários",
    currentChallenges: "Falta de recursos de marketing",
    competitivePosition: "Entrante",
    status: "em_enriquecimento" as const,
    paymentStatus: "aprovado" as const,
    createdAt: "2025-01-18T10:00:00Z",
    updatedAt: "2025-01-18T12:00:00Z",
  },
  {
    id: "uuid-3",
    userId: "admin-1",
    companyName: "Global Solutions",
    cnpj: "34.567.890/0001-12",
    industry: "Consultoria",
    companySize: "Grande Porte (250+)",
    website: "https://globalsolutions.com",
    strategicGoal: "Diversificar serviços",
    currentChallenges: "Retenção de talentos",
    competitivePosition: "Desafiante",
    status: "pendente" as const,
    paymentStatus: "pendente" as const,
    createdAt: "2025-01-19T10:00:00Z",
    updatedAt: "2025-01-19T10:00:00Z",
  },
  {
    id: "uuid-4",
    userId: "admin-1",
    companyName: "Innovate Labs",
    cnpj: "45.678.901/0001-23",
    industry: "P&D",
    companySize: "Pequeno Porte (10-50)",
    strategicGoal: "Lançar produto inovador",
    currentChallenges: "Financiamento limitado",
    competitivePosition: "Nicho",
    status: "aguardando_pagamento" as const,
    paymentStatus: "pendente" as const,
    createdAt: "2025-01-20T10:00:00Z",
    updatedAt: "2025-01-20T10:00:00Z",
  },
  {
    id: "uuid-5",
    userId: "admin-1",
    companyName: "Future Dynamics",
    cnpj: "56.789.012/0001-34",
    industry: "Energia Renovável",
    companySize: "Médio Porte (50-250)",
    website: "https://futuredynamics.com",
    strategicGoal: "Sustentabilidade operacional",
    currentChallenges: "Regulação governamental",
    competitivePosition: "Inovador",
    status: "concluido" as const,
    paymentStatus: "aprovado" as const,
    createdAt: "2025-01-14T10:00:00Z",
    updatedAt: "2025-01-14T16:00:00Z",
  },
  {
    id: "uuid-6",
    userId: "admin-1",
    companyName: "Quantum Ventures",
    cnpj: "67.890.123/0001-45",
    industry: "Investimentos",
    companySize: "Pequeno Porte (10-50)",
    website: "https://quantumventures.io",
    strategicGoal: "Maximizar retornos",
    currentChallenges: "Volatilidade do mercado",
    competitivePosition: "Seguidor",
    status: "em_analise" as const,
    paymentStatus: "aprovado" as const,
    createdAt: "2025-01-21T10:00:00Z",
    updatedAt: "2025-01-21T11:00:00Z",
  },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [startingEnrichment, setStartingEnrichment] = useState<string | null>(null);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleStartEnrichment = async (submission: any) => {
    const { allowed, reason } = canStartEnrichment(submission);

    if (!allowed) {
      toast({
        title: "Não é possível iniciar enriquecimento",
        description: reason,
        variant: "destructive",
      });
      return;
    }

    try {
      setStartingEnrichment(submission.id);

      // Update submission status to 'enriching'
      await adminApi.updateSubmissionStatus(submission.id, "enriching");

      toast({
        title: "Enriquecimento iniciado",
        description: "Redirecionando para o editor...",
        variant: "default",
      });

      // Redirect to enrichment editor
      setTimeout(() => {
        router.push(`/admin/enriquecimento/${submission.id}`);
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Erro ao iniciar enriquecimento",
        description: error.message || "Não foi possível iniciar o enriquecimento.",
        variant: "destructive",
      });
      setStartingEnrichment(null);
    }
  };

  if (isLoading) {
    return <AdminInboxSkeleton />;
  }

  return (
    <div className="min-h-screen bg-surface-paper">
      {/* --- PAGE HEADER --- */}
      <header className="bg-white border-b border-line">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-3xl font-medium tracking-tight text-navy-900">
                Submissions Inbox
              </h1>
              <p className="text-sm text-text-secondary mt-1">
                Manage and review all client submissions
              </p>
            </div>

            <div className="flex items-center gap-4">
              <StatsCard label="Total" value={MOCK_SUBMISSIONS.length} />
              <StatsCard
                label="Pending"
                value={MOCK_SUBMISSIONS.filter(s => s.status === "pendente" || s.status === "aguardando_pagamento").length}
                variant="warning"
              />
              <StatsCard
                label="Completed"
                value={MOCK_SUBMISSIONS.filter(s => s.status === "concluido").length}
                variant="success"
              />
            </div>
          </div>
        </div>
      </header>

      {/* --- SUBMISSIONS TABLE --- */}
      <div className="p-8">
        <div className="bg-white border border-line shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-surface-paper border-b border-line">
            <div className="col-span-3">
              <TableHeader>Company Name</TableHeader>
            </div>
            <div className="col-span-3">
              <TableHeader>CNPJ</TableHeader>
            </div>
            <div className="col-span-2">
              <TableHeader>Status</TableHeader>
            </div>
            <div className="col-span-2">
              <TableHeader>Submitted</TableHeader>
            </div>
            <div className="col-span-2">
              <TableHeader>Actions</TableHeader>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-line">
            {MOCK_SUBMISSIONS.map((submission) => (
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
                    {submission.cnpj}
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
                        disabled={
                          !canStartEnrichment(submission).allowed ||
                          startingEnrichment === submission.id
                        }
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
  const variants: Record<SubmissionStatus, { bg: string; text: string; label: string }> = {
    pendente: {
      bg: "bg-gray-100",
      text: "text-gray-600",
      label: "Pendente",
    },
    aguardando_pagamento: {
      bg: "bg-yellow-50",
      text: "text-yellow-600",
      label: "Aguardando Pagamento",
    },
    em_enriquecimento: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      label: "Em Enriquecimento",
    },
    enriquecimento_completo: {
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      label: "Enriquecimento Completo",
    },
    em_analise: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      label: "Em Análise",
    },
    analise_completa: {
      bg: "bg-teal-50",
      text: "text-teal-600",
      label: "Análise Completa",
    },
    em_geracao_relatorio: {
      bg: "bg-cyan-50",
      text: "text-cyan-600",
      label: "Gerando Relatório",
    },
    concluido: {
      bg: "bg-gold-500/10",
      text: "text-gold-600",
      label: "Concluído",
    },
    cancelado: {
      bg: "bg-gray-200",
      text: "text-gray-500",
      label: "Cancelado",
    },
    erro: {
      bg: "bg-red-50",
      text: "text-red-600",
      label: "Erro",
    },
  };

  const variant = variants[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider",
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
    <div className={cn("border px-4 py-2 bg-white", variants[variant])}>
      <div className="text-2xl font-light font-heading">{value}</div>
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
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
