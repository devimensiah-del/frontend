/**
 * WorkflowProgress Component
 *
 * Visual progress indicator for submission workflow:
 * Submitted → Enriched → Analyzed → Report Ready
 */

import React from "react";
import { cn } from "@/lib/utils/cn";
import { Check, Loader2, AlertCircle } from "lucide-react";

// ============================================
// TYPES
// ============================================

type WorkflowStage = "submitted" | "enriched" | "analyzed" | "ready";

export interface WorkflowProgressProps {
  currentStage: WorkflowStage;
  enrichmentStatus?: "pending" | "processing" | "completed" | "failed";
  analysisStatus?: "pending" | "processing" | "completed" | "failed";
  className?: string;
}

// ============================================
// STAGES
// ============================================

const STAGES: Array<{
  key: WorkflowStage;
  label: string;
  description: string;
}> = [
  {
    key: "submitted",
    label: "Submetido",
    description: "Dados recebidos",
  },
  {
    key: "enriched",
    label: "Enriquecido",
    description: "IA analisou dados públicos",
  },
  {
    key: "analyzed",
    label: "Analisado",
    description: "11 frameworks aplicados",
  },
  {
    key: "ready",
    label: "Relatório Pronto",
    description: "Disponível para visualização",
  },
];

// ============================================
// COMPONENT
// ============================================

export const WorkflowProgress: React.FC<WorkflowProgressProps> = ({
  currentStage,
  enrichmentStatus,
  analysisStatus,
  className,
}) => {
  const currentIndex = STAGES.findIndex((s) => s.key === currentStage);

  const getStageStatus = (index: number) => {
    if (index < currentIndex) return "completed";
    if (index === currentIndex) {
      // Check for processing or error states
      if (index === 1 && enrichmentStatus === "processing") return "processing";
      if (index === 1 && enrichmentStatus === "failed") return "error";
      if (index === 2 && analysisStatus === "processing") return "processing";
      if (index === 2 && analysisStatus === "failed") return "error";
      return "current";
    }
    return "pending";
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Desktop: Horizontal */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {STAGES.map((stage, index) => {
            const status = getStageStatus(index);
            const isLast = index === STAGES.length - 1;

            return (
              <React.Fragment key={stage.key}>
                {/* Stage Circle */}
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all",
                      status === "completed" && "bg-semantic-success border-semantic-success text-white",
                      status === "current" && "bg-gold-500 border-gold-500 text-white animate-pulse",
                      status === "processing" && "bg-semantic-info border-semantic-info text-white",
                      status === "error" && "bg-semantic-error border-semantic-error text-white",
                      status === "pending" && "bg-white border-line text-text-tertiary"
                    )}
                  >
                    {status === "completed" && <Check className="w-6 h-6" />}
                    {status === "processing" && <Loader2 className="w-6 h-6 animate-spin" />}
                    {status === "error" && <AlertCircle className="w-6 h-6" />}
                    {(status === "current" || status === "pending") && (
                      <span className="text-sm font-bold">{index + 1}</span>
                    )}
                  </div>

                  {/* Label */}
                  <div className="text-center max-w-32">
                    <p
                      className={cn(
                        "text-sm font-medium mb-1",
                        status !== "pending" ? "text-text-primary" : "text-text-tertiary"
                      )}
                    >
                      {stage.label}
                    </p>
                    <p className="text-xs text-text-tertiary">
                      {stage.description}
                    </p>
                  </div>
                </div>

                {/* Connector Line */}
                {!isLast && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mx-4 transition-all",
                      status === "completed" ? "bg-semantic-success" : "bg-line"
                    )}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Mobile: Vertical */}
      <div className="md:hidden space-y-4">
        {STAGES.map((stage, index) => {
          const status = getStageStatus(index);
          const isLast = index === STAGES.length - 1;

          return (
            <div key={stage.key} className="flex gap-4">
              {/* Left: Circle + Line */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                    status === "completed" && "bg-semantic-success border-semantic-success text-white",
                    status === "current" && "bg-gold-500 border-gold-500 text-white animate-pulse",
                    status === "processing" && "bg-semantic-info border-semantic-info text-white",
                    status === "error" && "bg-semantic-error border-semantic-error text-white",
                    status === "pending" && "bg-white border-line text-text-tertiary"
                  )}
                >
                  {status === "completed" && <Check className="w-5 h-5" />}
                  {status === "processing" && <Loader2 className="w-5 h-5 animate-spin" />}
                  {status === "error" && <AlertCircle className="w-5 h-5" />}
                  {(status === "current" || status === "pending") && (
                    <span className="text-sm font-bold">{index + 1}</span>
                  )}
                </div>

                {/* Connector */}
                {!isLast && (
                  <div
                    className={cn(
                      "w-0.5 flex-1 min-h-8 transition-all",
                      status === "completed" ? "bg-semantic-success" : "bg-line"
                    )}
                  />
                )}
              </div>

              {/* Right: Content */}
              <div className="flex-1 pb-4">
                <p
                  className={cn(
                    "text-sm font-medium mb-1",
                    status !== "pending" ? "text-text-primary" : "text-text-tertiary"
                  )}
                >
                  {stage.label}
                </p>
                <p className="text-xs text-text-tertiary">
                  {stage.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
