/**
 * SubmissionCard Component
 *
 * Card for displaying submission in list views
 */

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/organisms/Card";
import { Badge } from "@/components/atoms/Badge";
import { cn } from "@/lib/utils/cn";
import { ArrowRight, Calendar, Building2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Submission } from "@/lib/types";

// ============================================
// TYPES
// ============================================

export interface SubmissionCardProps {
  submission: Submission;
  enrichmentStatus?: "pending" | "processing" | "completed" | "failed";
  analysisStatus?: "pending" | "processing" | "completed" | "failed";
  isVisibleToUser?: boolean;
  className?: string;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

const getOverallStatus = (
  enrichmentStatus?: string,
  analysisStatus?: string,
  isVisibleToUser?: boolean
): { label: string; variant: "default" | "success" | "warning" | "error" | "info" } => {
  // No enrichment yet
  if (!enrichmentStatus || enrichmentStatus === "pending") {
    return { label: "Processando", variant: "info" };
  }

  // Enrichment failed
  if (enrichmentStatus === "failed") {
    return { label: "Erro no enriquecimento", variant: "error" };
  }

  // Enrichment in progress
  if (enrichmentStatus === "processing") {
    return { label: "Enriquecendo dados", variant: "info" };
  }

  // Enrichment completed, no analysis yet
  if (!analysisStatus || analysisStatus === "pending") {
    return { label: "Aguardando análise", variant: "warning" };
  }

  // Analysis failed
  if (analysisStatus === "failed") {
    return { label: "Erro na análise", variant: "error" };
  }

  // Analysis in progress
  if (analysisStatus === "processing") {
    return { label: "Analisando", variant: "info" };
  }

  // Analysis completed but not visible to user yet
  if (analysisStatus === "completed" && !isVisibleToUser) {
    return { label: "Em revisão", variant: "warning" };
  }

  // Report ready and visible
  if (isVisibleToUser) {
    return { label: "Relatório disponível", variant: "success" };
  }

  return { label: "Em processamento", variant: "info" };
};

// ============================================
// COMPONENT
// ============================================

export const SubmissionCard: React.FC<SubmissionCardProps> = ({
  submission,
  enrichmentStatus,
  analysisStatus,
  isVisibleToUser,
  className,
}) => {
  const status = getOverallStatus(enrichmentStatus, analysisStatus, isVisibleToUser);

  return (
    <Link href={`/dashboard/submissions/${submission.id}`}>
      <Card
        variant="bordered"
        className={cn(
          "h-full hover:shadow-md transition-all duration-300 hover:border-gold-500/30 cursor-pointer group",
          className
        )}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-2 text-xs text-text-tertiary">
              <Calendar className="w-3 h-3" />
              {format(new Date(submission.createdAt), "d 'de' MMM, yyyy", { locale: ptBR })}
            </div>
            <Badge variant={status.variant} size="sm">
              {status.label}
            </Badge>
          </div>

          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-text-tertiary flex-shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-text-primary group-hover:text-gold-600 transition-colors truncate mb-1">
                {submission.companyName}
              </h3>
              {submission.cnpj && (
                <p className="text-xs text-text-tertiary font-mono">
                  CNPJ: {submission.cnpj}
                </p>
              )}
            </div>
          </div>
        </CardHeader>

        <CardBody className="pt-0">
          {/* Business Challenge */}
          {submission.currentChallenges && (
            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-wider text-text-tertiary mb-2">
                Desafio
              </p>
              <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
                {submission.currentChallenges}
              </p>
            </div>
          )}

          {/* Industry & Size */}
          <div className="flex flex-wrap gap-2 text-xs">
            {submission.industry && (
              <span className="px-2 py-1 bg-surface-paper text-text-secondary rounded-sm">
                {submission.industry}
              </span>
            )}
            {submission.companySize && (
              <span className="px-2 py-1 bg-surface-paper text-text-secondary rounded-sm">
                {submission.companySize}
              </span>
            )}
          </div>
        </CardBody>

        <CardFooter>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500 group-hover:gap-3 transition-all">
              Ver Detalhes
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>

            {/* Error indicator */}
            {(enrichmentStatus === "failed" || analysisStatus === "failed") && (
              <AlertCircle className="w-4 h-4 text-semantic-error" />
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
