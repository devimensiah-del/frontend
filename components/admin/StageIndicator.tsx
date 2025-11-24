"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";
import type { WorkflowStage } from "@/lib/utils/workflow";
import { getStageLabel } from "@/lib/utils/workflow";

/* ============================================
   STAGE INDICATOR - Visual Workflow Stage
   From Agent 1's requirements
   ============================================ */

interface StageIndicatorProps {
  currentStage: WorkflowStage;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function StageIndicator({
  currentStage,
  size = "md",
  showLabel = true,
}: StageIndicatorProps) {
  const stages: WorkflowStage[] = ["submission", "enrichment", "analysis", "complete"];

  const stageConfig = {
    submission: {
      label: "Submissão",
      color: "bg-gray-300",
      activeColor: "bg-navy-900",
    },
    enrichment: {
      label: "Enriquecimento",
      color: "bg-gray-300",
      activeColor: "bg-blue-600",
    },
    analysis: {
      label: "Análise",
      color: "bg-gray-300",
      activeColor: "bg-purple-600",
    },
    complete: {
      label: "Concluído",
      color: "bg-gray-300",
      activeColor: "bg-green-600",
    },
  };

  const sizeConfig = {
    sm: "w-16 h-1",
    md: "w-24 h-1.5",
    lg: "w-32 h-2",
  };

  const currentIndex = stages.indexOf(currentStage);

  return (
    <div className="flex flex-col gap-2">
      {/* Progress Bars */}
      <div className="flex gap-1">
        {stages.map((stage, index) => {
          const config = stageConfig[stage];
          const isActive = index <= currentIndex;

          return (
            <div
              key={stage}
              className={cn(
                sizeConfig[size],
                "transition-colors rounded-full",
                isActive ? config.activeColor : config.color
              )}
              title={config.label}
            />
          );
        })}
      </div>

      {/* Label */}
      {showLabel && (
        <div className="text-xs text-text-secondary">
          {getStageLabel(currentStage)}
        </div>
      )}
    </div>
  );
}
