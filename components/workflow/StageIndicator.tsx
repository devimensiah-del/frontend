"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

/**
 * StageIndicator - Mini workflow stage visual for table rows
 *
 * Compact 3-dot indicator showing workflow progress.
 * Perfect for table cells with hover tooltip.
 *
 * @example
 * ```tsx
 * <StageIndicator currentStage={2} totalStages={3} />
 * // Renders: ●━●━○
 * ```
 */

export interface StageIndicatorProps {
  /** Current active stage (1-based index) */
  currentStage: number;
  /** Total number of stages (default: 3) */
  totalStages?: number;
  /** Optional tooltip text */
  tooltip?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Additional CSS classes */
  className?: string;
}

export const StageIndicator: React.FC<StageIndicatorProps> = ({
  currentStage,
  totalStages = 3,
  tooltip,
  size = "md",
  className,
}) => {
  const stages = Array.from({ length: totalStages }, (_, i) => i + 1);

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return { dot: "w-2 h-2", gap: "gap-1" };
      case "md":
        return { dot: "w-3 h-3", gap: "gap-1.5" };
      case "lg":
        return { dot: "w-4 h-4", gap: "gap-2" };
      default:
        return { dot: "w-3 h-3", gap: "gap-1.5" };
    }
  };

  const { dot, gap } = getSizeClasses();

  return (
    <div
      className={cn("inline-flex items-center", gap, className)}
      role="img"
      aria-label={tooltip || `Etapa ${currentStage} de ${totalStages}`}
      title={tooltip || `Etapa ${currentStage} de ${totalStages}`}
    >
      {stages.map((stage) => {
        const isCompleted = stage < currentStage;
        const isActive = stage === currentStage;
        const isPending = stage > currentStage;

        return (
          <div
            key={stage}
            className={cn(
              "rounded-[var(--radius-full)] transition-colors duration-300",
              dot,
              isCompleted && "bg-green-600",
              isActive && "bg-[var(--gold-600)]",
              isPending && "bg-gray-300"
            )}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
};

StageIndicator.displayName = "StageIndicator";
