import React from "react";
import { cn } from "@/lib/utils/cn";
import { SubmissionStatus, EnrichmentStatus, AnalysisStatusType } from "@/lib/types";

/* ============================================
   STATUS BADGE COMPONENT
   ============================================ */

type AnyStatus = SubmissionStatus | EnrichmentStatus | AnalysisStatusType | string;

interface StatusBadgeProps {
  status: AnyStatus;
  type?: "submission" | "enrichment" | "analysis";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = "submission", size = "md", className }) => {
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "received":
      case "pending":
        return "bg-gray-100 text-gray-600 border-gray-200";
      case "processing":
      case "started":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "completed":
      case "finished":
        return "bg-green-50 text-green-600 border-green-200";
      case "approved":
        return "bg-gold-50 text-gold-600 border-gold-200";
      case "sent":
        return "bg-navy-900 text-white border-navy-900";
      case "failed":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-gray-50 text-gray-500 border-gray-100";
    }
  };

  const getLabel = (status: string) => {
    const labels: Record<string, string> = {
      received: "Recebido",
      pending: "Pendente",
      processing: "Processando",
      started: "Iniciado",
      completed: "Concluído",
      finished: "Finalizado",
      approved: "Aprovado",
      sent: "Enviado",
      failed: "Falhou",
    };
    return labels[status.toLowerCase()] || status;
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider border",
        getStatusStyles(status as string),
        className
      )}
    >
      {type === "analysis" && status === "completed" ? "Aguardando Aprovação" : getLabel(status as string)}
    </span>
  );
};
