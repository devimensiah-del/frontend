"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";
import { CheckCircle, Clock, Pause } from "lucide-react";

/**
 * ProgressStepper - Horizontal 3-stage workflow indicator
 *
 * Displays workflow stages with icons and labels, showing current progress.
 * Responsive: horizontal on desktop, vertical on mobile.
 *
 * @example
 * ```tsx
 * <ProgressStepper
 *   currentStage={2}
 *   stages={[
 *     { label: "Dados", description: "Recebido" },
 *     { label: "Análise", description: "Em andamento" },
 *     { label: "Entrega", description: "Pendente" }
 *   ]}
 *   estimatedCompletion="2-3 dias"
 * />
 * ```
 */

export interface WorkflowStage {
  /** Stage label (e.g., "Dados", "Análise") */
  label: string;
  /** Stage description (e.g., "Recebido", "Em andamento") */
  description: string;
  /** Optional custom icon */
  icon?: React.ComponentType<{ className?: string }>;
}

export interface ProgressStepperProps {
  /** Current active stage (1-based index) */
  currentStage: number;
  /** Array of workflow stages */
  stages: WorkflowStage[];
  /** Estimated completion time (e.g., "2-3 dias") */
  estimatedCompletion?: string;
  /** Additional CSS classes */
  className?: string;
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({
  currentStage,
  stages,
  estimatedCompletion,
  className,
}) => {
  /**
   * Get icon and color for stage status
   */
  const getStageIcon = (stageIndex: number) => {
    if (stageIndex < currentStage) {
      return { Icon: CheckCircle, color: "text-green-600" };
    } else if (stageIndex === currentStage) {
      return { Icon: Clock, color: "text-[var(--gold-600)]" };
    } else {
      return { Icon: Pause, color: "text-gray-400" };
    }
  };

  const getStageStatus = (stageIndex: number): string => {
    if (stageIndex < currentStage) return "completed";
    if (stageIndex === currentStage) return "active";
    return "pending";
  };

  return (
    <div className={cn("w-full", className)} role="navigation" aria-label="Progresso do fluxo">
      {/* Desktop: Horizontal Layout */}
      <div className="hidden md:flex items-center justify-between max-w-2xl mx-auto">
        {stages.map((stage, index) => {
          const stageNumber = index + 1;
          const { Icon, color } = getStageIcon(stageNumber);
          const status = getStageStatus(stageNumber);
          const isLast = index === stages.length - 1;

          return (
            <React.Fragment key={index}>
              {/* Stage Node */}
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                {/* Icon */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-[var(--radius-full)] flex items-center justify-center",
                    "border-2 transition-all duration-300",
                    status === "completed" && "bg-green-50 border-green-600",
                    status === "active" && "bg-[var(--gold-light)] border-[var(--gold-600)]",
                    status === "pending" && "bg-gray-50 border-gray-300"
                  )}
                  role="img"
                  aria-label={`${stage.label}: ${stage.description}`}
                >
                  <Icon className={cn("w-6 h-6", color)} aria-hidden="true" />
                </div>

                {/* Label */}
                <div className="text-center">
                  <div
                    className={cn(
                      "font-heading font-bold uppercase text-[var(--text-xs)]",
                      "tracking-[var(--tracking-widest)]",
                      status === "active" ? "text-[var(--navy-900)]" : "text-[var(--text-secondary)]"
                    )}
                  >
                    {stage.label}
                  </div>
                  <div className="text-[var(--text-xs)] text-[var(--text-tertiary)] mt-1">
                    {stage.description}
                  </div>
                </div>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-4 transition-colors duration-300",
                    stageNumber < currentStage ? "bg-green-600" : "bg-gray-300"
                  )}
                  role="presentation"
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile: Vertical Layout */}
      <div className="md:hidden space-y-4">
        {stages.map((stage, index) => {
          const stageNumber = index + 1;
          const { Icon, color } = getStageIcon(stageNumber);
          const status = getStageStatus(stageNumber);
          const isLast = index === stages.length - 1;

          return (
            <div key={index} className="relative">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-[var(--radius-full)] flex items-center justify-center flex-shrink-0",
                    "border-2 transition-all duration-300",
                    status === "completed" && "bg-green-50 border-green-600",
                    status === "active" && "bg-[var(--gold-light)] border-[var(--gold-600)]",
                    status === "pending" && "bg-gray-50 border-gray-300"
                  )}
                  role="img"
                  aria-label={`${stage.label}: ${stage.description}`}
                >
                  <Icon className={cn("w-5 h-5", color)} aria-hidden="true" />
                </div>

                {/* Content */}
                <div className="flex-1 pb-4">
                  <div
                    className={cn(
                      "font-heading font-bold uppercase text-[var(--text-sm)]",
                      "tracking-[var(--tracking-wide)]",
                      status === "active" ? "text-[var(--navy-900)]" : "text-[var(--text-secondary)]"
                    )}
                  >
                    {stage.label}
                  </div>
                  <div className="text-[var(--text-sm)] text-[var(--text-tertiary)] mt-1">
                    {stage.description}
                  </div>
                </div>
              </div>

              {/* Vertical Connector */}
              {!isLast && (
                <div
                  className={cn(
                    "absolute left-5 top-10 w-0.5 h-full transition-colors duration-300",
                    stageNumber < currentStage ? "bg-green-600" : "bg-gray-300"
                  )}
                  role="presentation"
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Estimated Completion */}
      {estimatedCompletion && (
        <div className="mt-6 text-center">
          <p className="text-[var(--text-sm)] text-[var(--text-tertiary)]">
            <span className="font-heading font-medium uppercase tracking-[var(--tracking-wide)]">
              Estimativa:{" "}
            </span>
            {estimatedCompletion}
          </p>
        </div>
      )}
    </div>
  );
};

ProgressStepper.displayName = "ProgressStepper";
