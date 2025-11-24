/**
 * Icons Utility - Status to Icon Mapping
 *
 * Provides centralized icon mapping for status values.
 * Uses Lucide React icons for consistent design.
 */

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
  Building,
  TrendingUp,
  Zap,
  Target,
  Award,
  AlertTriangle,
  Info,
  XCircle,
} from "lucide-react";
import { EnrichmentStatus, AnalysisStatus } from "@/lib/types";

/**
 * Icon component type
 */
export type IconComponent = React.ComponentType<{ className?: string }>;

/**
 * Status icon mapping
 */
export const STATUS_ICONS: Record<string, IconComponent> = {
  // Workflow status
  pending: Clock,
  processing: Loader,
  completed: CheckCircle,
  approved: BadgeCheck,
  sent: Send,
  failed: AlertCircle,

  // Entity types
  submission: FileText,
  enrichment: TrendingUp,
  analysis: BarChart,
  report: Award,

  // Actions
  email: Mail,
  download: FileText,
  view: Info,
  edit: Zap,
  delete: XCircle,

  // Notifications
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
};

/**
 * Get icon for enrichment status
 */
export const getEnrichmentIcon = (status: EnrichmentStatus): IconComponent => {
  const iconMap: Record<EnrichmentStatus, IconComponent> = {
    pending: Loader,
    completed: CheckCircle,
    approved: BadgeCheck,
  };

  return iconMap[status] || Clock;
};

/**
 * Get icon for analysis status
 */
export const getAnalysisIcon = (status: AnalysisStatus): IconComponent => {
  const iconMap: Record<AnalysisStatus, IconComponent> = {
    pending: Clock,
    completed: CheckCircle,
    approved: BadgeCheck,
    sent: Send,
  };

  return iconMap[status] || Clock;
};

/**
 * Get icon by key with fallback
 */
export const getStatusIcon = (key: string): IconComponent => {
  return STATUS_ICONS[key.toLowerCase()] || Info;
};

/**
 * Check if icon should be animated
 */
export const isIconAnimated = (status: string): boolean => {
  return status === "processing" || status === "pending";
};

/**
 * Get icon color class for status
 */
export const getIconColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    pending: "text-gray-400",
    processing: "text-[var(--gold-600)]",
    completed: "text-green-600",
    approved: "text-green-600",
    sent: "text-blue-600",
    failed: "text-red-600",
    warning: "text-yellow-600",
    info: "text-blue-500",
    success: "text-green-600",
    error: "text-red-600",
  };

  return colorMap[status.toLowerCase()] || "text-gray-400";
};

/**
 * Export all icons for direct use
 */
export const Icons = {
  // Status
  Pending: Clock,
  Processing: Loader,
  Completed: CheckCircle,
  Approved: BadgeCheck,
  Sent: Send,
  Failed: AlertCircle,

  // Entities
  Submission: FileText,
  Enrichment: TrendingUp,
  Analysis: BarChart,
  Report: Award,
  Company: Building,

  // Actions
  Email: Mail,
  Document: FileText,
  Chart: BarChart,
  Target: Target,
  Zap: Zap,

  // Notifications
  Info: Info,
  Success: CheckCircle,
  Warning: AlertTriangle,
  Error: AlertCircle,
};
