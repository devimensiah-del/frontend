"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";
import {
  Clock,
  Loader,
  CheckCircle,
  Send,
  AlertCircle,
  BadgeCheck,
  Mail,
  FileText,
  BarChart,
} from "lucide-react";
import { EnrichmentStatus, AnalysisStatus } from "@/lib/types";

/**
 * StatusIcon - Status icon library with consistent sizing
 *
 * Maps status values to appropriate Lucide icons with consistent styling.
 * Supports enrichment, analysis, and general status types.
 *
 * @example
 * ```tsx
 * <StatusIcon status="processing" size="md" />
 * <StatusIcon status="completed" size="lg" />
 * ```
 */

type GeneralStatus = "pending" | "processing" | "completed" | "completed" | "approved" | "sent" | "failed";
type AllStatus = GeneralStatus | EnrichmentStatus | AnalysisStatus;

export interface StatusIconProps {
  /** Status value (supports enrichment, analysis, or general statuses) */
  status: AllStatus;
  /** Icon size variant */
  size?: "sm" | "md" | "lg";
  /** Additional CSS classes */
  className?: string;
}

export const StatusIcon: React.FC<StatusIconProps> = ({ status, size = "md", className }) => {
  /**
   * Get icon component and color for status
   */
  const getIconConfig = (status: AllStatus) => {
    switch (status) {
      case "pending":
        return { Icon: Clock, color: "text-gray-400" };
      case "processing":
        return { Icon: Loader, color: "text-[var(--gold-600)]", animated: true };
      case "completed":
        return { Icon: CheckCircle, color: "text-green-600" };
      case "completed":
        return { Icon: CheckCircle, color: "text-green-600" };
      case "approved":
        return { Icon: BadgeCheck, color: "text-green-600" };
      case "sent":
        return { Icon: Send, color: "text-blue-600" };
      case "failed":
        return { Icon: AlertCircle, color: "text-red-600" };
      default:
        return { Icon: Clock, color: "text-gray-400" };
    }
  };

  /**
   * Get size classes
   */
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-4 h-4";
      case "md":
        return "w-5 h-5";
      case "lg":
        return "w-6 h-6";
      default:
        return "w-5 h-5";
    }
  };

  const { Icon, color, animated } = getIconConfig(status);
  const sizeClass = getSizeClasses();

  return (
    <Icon
      className={cn(
        sizeClass,
        color,
        animated && "animate-spin",
        "transition-colors duration-300",
        className
      )}
      aria-label={`Status: ${status}`}
      role="img"
    />
  );
};

StatusIcon.displayName = "StatusIcon";

/**
 * Specialized status icons for specific workflows
 */

export const EnrichmentIcon: React.FC<Omit<StatusIconProps, "status"> & { status: EnrichmentStatus }> = (props) => {
  return <StatusIcon {...props} />;
};

export const AnalysisIcon: React.FC<Omit<StatusIconProps, "status"> & { status: AnalysisStatus }> = (props) => {
  return <StatusIcon {...props} />;
};

/**
 * Export individual icons for direct use
 */
export const Icons = {
  Pending: Clock,
  Processing: Loader,
  Completed: CheckCircle,
  Approved: BadgeCheck,
  Sent: Send,
  Failed: AlertCircle,
  Email: Mail,
  Document: FileText,
  Analysis: BarChart,
};
