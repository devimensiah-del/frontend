"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { StageIndicator } from "./StageIndicator";
import { NextActionBadge, type NextAction } from "./NextActionBadge";
import { Calendar, Building2, ChevronRight } from "lucide-react";
import type { Submission, Enrichment, Analysis } from "@/types";
import { getWorkflowStage } from "@/lib/utils/workflow";

/* ============================================
   ADMIN SUBMISSION CARD - Mobile View
   With batch selection and workflow indicators
   ============================================ */

interface AdminSubmissionCardProps {
  submission: Submission;
  enrichment?: Enrichment | null;
  analysis?: Analysis | null;
  selected?: boolean;
  onToggleSelect?: () => void;
  nextAction?: NextAction;
}

export function AdminSubmissionCard({
  submission,
  enrichment,
  analysis,
  selected = false,
  onToggleSelect,
  nextAction,
}: AdminSubmissionCardProps) {
  const stage = getWorkflowStage(enrichment, analysis);

  return (
    <div
      className={cn(
        "bg-white border p-4 hover:shadow-md transition-all",
        selected && "border-gold-500 bg-gold-500/5"
      )}
    >
      {/* Header with Checkbox and Company Name */}
      <div className="flex items-start gap-3 mb-3">
        {/* Batch Selection Checkbox */}
        {onToggleSelect && (
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggleSelect}
            className="mt-1 w-4 h-4 text-gold-600 focus:ring-gold-500 border-gray-300 rounded"
          />
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-navy-900 truncate text-lg">
            {submission.companyName}
          </h3>
          {submission.cnpj && (
            <p className="text-xs text-text-secondary font-mono mt-1">
              {submission.cnpj}
            </p>
          )}
        </div>
      </div>

      {/* Workflow Stage Indicator */}
      <div className="mb-3">
        <StageIndicator currentStage={stage} size="sm" />
      </div>

      {/* Next Action Badge */}
      {nextAction && (
        <div className="mb-4">
          <NextActionBadge {...nextAction} size="sm" />
        </div>
      )}

      {/* Metadata */}
      <div className="flex items-center gap-4 text-xs text-text-secondary mb-4">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(submission.updatedAt)}</span>
        </div>
        {submission.industry && (
          <div className="flex items-center gap-1">
            <Building2 className="w-3 h-3" />
            <span>{submission.industry}</span>
          </div>
        )}
      </div>

      {/* Action Button */}
      <Link href={`/admin/dashboard/${submission.id}`}>
        <Button variant="architect" size="sm" className="w-full">
          <span>Ver Detalhes</span>
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
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
