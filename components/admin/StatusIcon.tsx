"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";
import {
  Clock,
  Loader,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
} from "lucide-react";
import type { EnrichmentStatus, AnalysisStatus } from "@/types";

/* ============================================
   STATUS ICON - Visual Status Indicator
   From Agent 1's requirements
   ============================================ */

interface StatusIconProps {
  status: EnrichmentStatus | AnalysisStatus | string;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export function StatusIcon({
  status,
  size = "md",
  animated = true,
}: StatusIconProps) {
  const sizeConfig = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const iconSize = sizeConfig[size];

  // Map status to icon and color
  const statusConfig: Record<
    string,
    { icon: typeof Clock; color: string; shouldAnimate?: boolean }
  > = {
    pending: {
      icon: Clock,
      color: "text-gray-500",
    },
    processing: {
      icon: Loader,
      color: "text-blue-600",
      shouldAnimate: true,
    },
    finished: {
      icon: CheckCircle,
      color: "text-green-600",
    },
    completed: {
      icon: CheckCircle,
      color: "text-green-600",
    },
    approved: {
      icon: CheckCircle,
      color: "text-teal-600",
    },
    sent: {
      icon: Send,
      color: "text-gold-600",
    },
    failed: {
      icon: XCircle,
      color: "text-red-600",
    },
    error: {
      icon: AlertCircle,
      color: "text-red-600",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Icon
      className={cn(
        iconSize,
        config.color,
        animated && config.shouldAnimate && "animate-spin"
      )}
    />
  );
}
