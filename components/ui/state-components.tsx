"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";
import { Spinner } from "@/components/ui/loading-indicator";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  AlertCircle,
  FileQuestion,
  Inbox,
  Search,
  RefreshCcw,
  Zap,
  Clock
} from "lucide-react";

/* ============================================
   STATE COMPONENTS - Consistent UI States
   ============================================

   Provides consistent loading, empty, and error
   states throughout the dashboard with Portuguese
   messages and proper animations.
   ============================================ */

// ============================================
// LOADING STATE
// ============================================

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "processing";
  className?: string;
}

export function LoadingState({
  message = "Carregando...",
  size = "md",
  variant = "default",
  className
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "py-8",
    md: "py-12",
    lg: "py-20"
  };

  const spinnerSizes = {
    sm: 24,
    md: 32,
    lg: 40
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center",
      sizeClasses[size],
      className
    )}>
      {variant === "processing" ? (
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      ) : (
        <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center">
          <Loader2 className="w-5 h-5 text-gold-500" />
        </div>
      )}
      <p className="mt-4 text-sm text-gray-500 font-medium">{message}</p>
    </div>
  );
}

// ============================================
// PROCESSING STATE (for workflows)
// ============================================

interface ProcessingStateProps {
  title: string;
  description?: string;
  progress?: number;
  estimatedTime?: string;
  className?: string;
}

export function ProcessingState({
  title,
  description,
  progress,
  estimatedTime,
  className
}: ProcessingStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-6",
      "bg-gradient-to-br from-blue-50/50 to-purple-50/50",
      "border border-blue-100 rounded-lg",
      className
    )}>
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
          <Zap className="w-8 h-8 text-blue-500" />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-navy-900 mb-2">{title}</h3>

      {description && (
        <p className="text-sm text-gray-600 text-center max-w-md mb-4">{description}</p>
      )}

      {progress !== undefined && (
        <div className="w-full max-w-xs mb-3">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">{progress}% concluído</p>
        </div>
      )}

      {estimatedTime && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>Tempo estimado: {estimatedTime}</span>
        </div>
      )}
    </div>
  );
}

// ============================================
// EMPTY STATE
// ============================================

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: "default" | "search" | "inbox";
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = "default",
  className
}: EmptyStateProps) {
  const defaultIcons = {
    default: FileQuestion,
    search: Search,
    inbox: Inbox
  };

  const IconComponent = Icon || defaultIcons[variant];

  return (
    <div className={cn(
      "flex flex-col items-center justify-center",
      "py-16 px-6 text-center",
      "bg-white border border-dashed border-gray-300 rounded-lg",
      className
    )}>
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <IconComponent className="w-8 h-8 text-gray-400" />
      </div>

      <h3 className="text-lg font-semibold text-navy-900 mb-2">{title}</h3>

      {description && (
        <p className="text-sm text-gray-500 max-w-md mb-6">{description}</p>
      )}

      {action && (
        <Button
          variant="architect"
          onClick={action.onClick}
          className="mt-2"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

// ============================================
// ERROR STATE
// ============================================

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  details?: string;
  variant?: "error" | "warning";
  className?: string;
}

export function ErrorState({
  title = "Algo deu errado",
  message,
  onRetry,
  retryLabel = "Tentar Novamente",
  details,
  variant = "error",
  className
}: ErrorStateProps) {
  const [showDetails, setShowDetails] = React.useState(false);

  const colors = {
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: "text-red-500",
      iconBg: "bg-red-100"
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      icon: "text-yellow-500",
      iconBg: "bg-yellow-100"
    }
  };

  const style = colors[variant];

  return (
    <div className={cn(
      "flex flex-col items-center justify-center",
      "py-12 px-6 text-center rounded-lg border",
      style.bg,
      style.border,
      className
    )}>
      <div className={cn(
        "w-16 h-16 rounded-full flex items-center justify-center mb-4",
        style.iconBg
      )}>
        <AlertCircle className={cn("w-8 h-8", style.icon)} />
      </div>

      <h3 className="text-lg font-semibold text-navy-900 mb-2">{title}</h3>

      <p className="text-sm text-gray-600 max-w-md mb-6">{message}</p>

      <div className="flex gap-3">
        {onRetry && (
          <Button
            variant="architect"
            onClick={onRetry}
            className="gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            {retryLabel}
          </Button>
        )}
      </div>

      {details && (
        <div className="mt-6 w-full max-w-2xl">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            {showDetails ? "Ocultar detalhes" : "Ver detalhes do erro"}
          </button>

          {showDetails && (
            <div className="mt-3 p-4 bg-white border border-gray-200 rounded text-left">
              <pre className="text-xs text-gray-600 whitespace-pre-wrap break-words">
                {details}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// WORKFLOW PENDING STATE (for specific stages)
// ============================================

interface WorkflowPendingProps {
  stage: "enrichment" | "analysis" | "report";
  className?: string;
}

export function WorkflowPending({ stage, className }: WorkflowPendingProps) {
  const stageInfo = {
    enrichment: {
      title: "Enriquecimento em Andamento",
      description: "Nossa IA está coletando e analisando informações adicionais sobre a empresa. Este processo pode levar alguns minutos.",
      estimatedTime: "2-5 minutos"
    },
    analysis: {
      title: "Análise Estratégica em Andamento",
      description: "Aplicando frameworks estratégicos avançados (SWOT, PESTEL, 5 Forças de Porter) aos dados enriquecidos.",
      estimatedTime: "3-7 minutos"
    },
    report: {
      title: "Gerando Relatório Final",
      description: "Compilando todas as análises em um relatório profissional em PDF.",
      estimatedTime: "1-2 minutos"
    }
  };

  const info = stageInfo[stage];

  return (
    <ProcessingState
      title={info.title}
      description={info.description}
      estimatedTime={info.estimatedTime}
      className={className}
    />
  );
}

// ============================================
// NO DATA YET STATE (for tabs with no content)
// ============================================

interface NoDataYetProps {
  dataType: string;
  expectedWhen?: string;
  className?: string;
}

export function NoDataYet({ dataType, expectedWhen, className }: NoDataYetProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 text-center",
      className
    )}>
      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
        <Clock className="w-8 h-8 text-blue-400" />
      </div>

      <h3 className="text-lg font-semibold text-navy-900 mb-2">
        {dataType} ainda não disponível
      </h3>

      {expectedWhen && (
        <p className="text-sm text-gray-500 max-w-md">
          {expectedWhen}
        </p>
      )}
    </div>
  );
}
