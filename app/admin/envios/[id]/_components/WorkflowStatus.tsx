"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock, Send } from "lucide-react";
import type { Enrichment, Analysis } from "@/types";

interface WorkflowStatusProps {
  enrichment?: Enrichment;
  analysis?: Analysis;
  hasPDF: boolean;
}

export function WorkflowStatus({ enrichment, analysis, hasPDF }: WorkflowStatusProps) {
  const enrichmentStatus = enrichment?.status || "pending";
  const analysisStatus = analysis?.status || "pending";

  return (
    <Card className="p-6">
      <h2 className="font-heading text-xl font-medium text-navy-900 mb-6">
        Status do Fluxo de Trabalho
      </h2>

      <div className="space-y-6">
        {/* Timeline */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-line" />

          {/* Step 1: Submission */}
          <WorkflowStep
            icon={<CheckCircle2 className="w-5 h-5" />}
            title="Submissão Recebida"
            status="completed"
            timestamp="Concluído"
            iconColor="text-green-600"
          />

          {/* Step 2: Enrichment */}
          <WorkflowStep
            icon={getStepIcon(enrichmentStatus)}
            title="Enriquecimento de Dados"
            status={enrichmentStatus}
            timestamp={getStepTimestamp(enrichmentStatus, enrichment?.updatedAt)}
            iconColor={getStepColor(enrichmentStatus)}
            badge={<EnrichmentBadge status={enrichmentStatus} />}
          />

          {/* Step 3: Analysis */}
          <WorkflowStep
            icon={getStepIcon(analysisStatus)}
            title="Análise Estratégica"
            status={analysisStatus}
            timestamp={getStepTimestamp(analysisStatus, analysis?.updatedAt)}
            iconColor={getStepColor(analysisStatus)}
            badge={<AnalysisBadge status={analysisStatus} />}
            version={analysis?.version}
          />

          {/* Step 4: PDF Generation */}
          <WorkflowStep
            icon={hasPDF ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
            title="Relatório PDF"
            status={hasPDF ? "completed" : "pending"}
            timestamp={hasPDF ? "Disponível" : "Aguardando"}
            iconColor={hasPDF ? "text-green-600" : "text-gray-400"}
            isLast
          />
        </div>

        {/* Quick Stats */}
        <div className="border-t border-line pt-6">
          <div className="grid grid-cols-2 gap-4">
            <StatItem
              label="Enriquecimento"
              value={enrichmentStatus === "approved" ? "Aprovado" : enrichmentStatus === "completed" ? "Pronto" : "Pendente"}
              variant={enrichmentStatus === "approved" ? "success" : enrichmentStatus === "completed" ? "warning" : "default"}
            />
            <StatItem
              label="Análise"
              value={analysisStatus === "sent" ? "Enviado" : analysisStatus === "approved" ? "Aprovado" : analysisStatus === "completed" ? "Completo" : "Pendente"}
              variant={analysisStatus === "sent" || analysisStatus === "approved" ? "success" : analysisStatus === "completed" ? "warning" : "default"}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

interface WorkflowStepProps {
  icon: React.ReactNode;
  title: string;
  status: string;
  timestamp: string;
  iconColor: string;
  badge?: React.ReactNode;
  version?: number;
  isLast?: boolean;
}

function WorkflowStep({ icon, title, status, timestamp, iconColor, badge, version, isLast = false }: WorkflowStepProps) {
  return (
    <div className={`relative flex items-start gap-4 ${!isLast ? "pb-8" : ""}`}>
      {/* Icon */}
      <div className={`relative z-10 flex-shrink-0 ${iconColor}`}>
        <div className="bg-white p-1">{icon}</div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium text-navy-900 text-sm">{title}</h3>
          {badge}
          {version && version > 1 && (
            <span className="text-xs text-text-tertiary">v{version}</span>
          )}
        </div>
        <p className="text-xs text-text-tertiary">{timestamp}</p>
      </div>
    </div>
  );
}

function getStepIcon(status: string) {
  switch (status) {
    case "approved":
    case "sent":
    case "completed":
      return <CheckCircle2 className="w-5 h-5" />;
    case "completed":
    case "pending":
      return <Clock className="w-5 h-5" />;
    default:
      return <Circle className="w-5 h-5" />;
  }
}

function getStepColor(status: string) {
  switch (status) {
    case "approved":
    case "sent":
      return "text-green-600";
    case "completed":
    case "completed":
      return "text-gold-500";
    case "pending":
      return "text-orange-500";
    default:
      return "text-gray-400";
  }
}

function getStepTimestamp(status: string, updatedAt?: string): string {
  if (!updatedAt) {
    return status === "pending" ? "Aguardando" : "Em processamento";
  }
  const date = new Date(updatedAt);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function EnrichmentBadge({ status }: { status: string }) {
  const variants: Record<string, { variant: "warning" | "success" | "default" | "gold"; label: string }> = {
    pending: { variant: "warning", label: "Pendente" },
    finished: { variant: "gold", label: "Pronto" },
    approved: { variant: "success", label: "Aprovado" },
  };

  const config = variants[status] || variants.pending;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

function AnalysisBadge({ status }: { status: string }) {
  const variants: Record<string, { variant: "warning" | "success" | "default" | "gold" | "primary"; label: string }> = {
    pending: { variant: "warning", label: "Pendente" },
    completed: { variant: "gold", label: "Completo" },
    approved: { variant: "success", label: "Aprovado" },
    sent: { variant: "primary", label: "Enviado" },
  };

  const config = variants[status] || variants.pending;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

interface StatItemProps {
  label: string;
  value: string;
  variant?: "default" | "warning" | "success";
}

function StatItem({ label, value, variant = "default" }: StatItemProps) {
  const colors = {
    default: "text-gray-600",
    warning: "text-gold-600",
    success: "text-green-600",
  };

  return (
    <div>
      <p className="text-xs text-text-tertiary mb-1">{label}</p>
      <p className={`text-sm font-medium ${colors[variant]}`}>{value}</p>
    </div>
  );
}
