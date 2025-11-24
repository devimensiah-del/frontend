"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { AdminInboxSkeleton } from "@/components/skeletons";
import { toast } from "@/components/ui/use-toast";
import { adminApi } from "@/lib/api/client";
import type { SubmissionStatus, Submission } from "@/types";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Building2 } from "lucide-react";

/* ============================================
   ADMIN ENVIOS - Lista de Envios com Dados do Formulário
   ============================================ */

export default function AdminEnvios() {
  const [isLoading, setIsLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [error, setError] = useState<string | null>(null);

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
      {/* --- PAGE HEADER --- */}
      <header className="bg-white border-b border-line">
        <div className="px-4 sm:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-medium tracking-tight text-navy-900">
                Envios
              </h1>
              <p className="text-sm text-text-secondary mt-1">
                Lista de envios com dados do formulário
              </p>
            </div>

            {/* Stats Card - Only Total */}
            <div className="flex justify-end">
              <StatsCard label="Total" value={submissions.length} />
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
                    className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-surface-paper transition-colors"
                  >
                    <div className="col-span-3 flex items-center">
                      <div className="font-medium text-navy-900">
                        {submission.companyName}
                      </div>
                    </div>
                    <div className="col-span-3 flex items-center">
                      <div className="text-sm text-text-secondary font-mono">
                        {submission.cnpj || "—"}
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <StatusBadge status={submission.status} />
                    </div>
                    <div className="col-span-2 flex items-center">
                      <div className="text-sm text-text-secondary">
                        {formatDate(submission.createdAt)}
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center justify-end">
                      <Link href={`/admin/envios/${submission.id}`}>
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </Link>
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
}

function SubmissionCard({ submission }: SubmissionCardProps) {
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
          href={`/admin/envios/${submission.id}`}
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
  // NEW ARCHITECTURE: All submissions have status 'received'
  const variants: Record<string, { bg: string; text: string; label: string }> = {
    received: { bg: "bg-green-100", text: "text-green-600", label: "Recebido" },
  };

  const variant = variants[status] || variants.received;

  return (
    <span className={cn("inline-flex items-center px-2 py-1 text-xs font-bold uppercase tracking-wider whitespace-nowrap", variant.bg, variant.text)}>
      {variant.label}
    </span>
  );
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
    <div className={cn("border px-4 py-3 bg-white", variants[variant])}>
      <div className="text-xl sm:text-2xl font-light font-heading">{value}</div>
      <div className="text-xs uppercase tracking-widest text-text-secondary mt-0.5">{label}</div>
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
