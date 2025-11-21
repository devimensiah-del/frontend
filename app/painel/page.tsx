"use client";

import React, { useState, useEffect } from "react";
import { useAuthContext } from "@/lib/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils/cn";
import type { Submission, SubmissionStatus } from "@/types";
import { ChevronDown, ChevronUp, Download, FileText } from "lucide-react";

/* ============================================
   USER DASHBOARD - Single Page View
   Shows: Status, Form Data (collapsed), Enrichment Data, Analysis Status
   ============================================ */

export default function UserDashboard() {
  const { user } = useAuthContext();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedFormData, setExpandedFormData] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setIsLoading(true);
        // Mock data for now - replace with real API call
        const mockSubmissions: Submission[] = [];
        setSubmissions(mockSubmissions);
      } catch (error) {
        toast({
          title: "Erro ao Carregar",
          description: "Não foi possível carregar seus envios.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const toggleFormData = (submissionId: string) => {
    setExpandedFormData(prev => ({
      ...prev,
      [submissionId]: !prev[submissionId]
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- PAGE HEADER --- */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-6">
          <h1 className="font-heading text-3xl font-medium tracking-tight text-navy-900">
            Painel
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Acompanhe o status dos seus envios
          </p>
        </div>
      </header>

      {/* --- CONTENT --- */}
      <div className="p-6">
        {submissions.length === 0 ? (
          <div className="bg-white border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="font-heading text-xl font-medium text-navy-900 mb-2">
              Nenhum envio ainda
            </h2>
            <p className="text-gray-600 mb-6">
              Você ainda não tem nenhum envio. Comece criando uma nova análise.
            </p>
            <Button variant="architect">
              Nova Análise
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {submissions.map((submission) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
                isExpanded={expandedFormData[submission.id] || false}
                onToggleFormData={() => toggleFormData(submission.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================
   SUBMISSION CARD COMPONENT
   ============================================ */

interface SubmissionCardProps {
  submission: Submission;
  isExpanded: boolean;
  onToggleFormData: () => void;
}

function SubmissionCard({ submission, isExpanded, onToggleFormData }: SubmissionCardProps) {
  return (
    <div className="bg-white border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-xl font-medium text-navy-900">
              {submission.companyName}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Enviado em {formatDate(submission.createdAt)}
            </p>
          </div>
          <StatusBadge status={submission.status} />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Form Data (Collapsed by default) */}
        <div className="border border-gray-200">
          <button
            onClick={onToggleFormData}
            className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
          >
            <span className="font-medium text-navy-900">Dados do Formulário</span>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>
          {isExpanded && (
            <div className="px-4 py-4 space-y-3 border-t border-gray-200">
              <DataRow label="CNPJ" value={submission.cnpj || "—"} />
              <DataRow label="Indústria" value={submission.industry || "—"} />
              <DataRow label="Tamanho" value={submission.companySize || "—"} />
            </div>
          )}
        </div>

        {/* Enrichment Section */}
        <div>
          <h4 className="font-medium text-navy-900 mb-3">Status do Enriquecimento</h4>
          <EnrichmentStatus status={submission.status} />
        </div>

        {/* Analysis Section */}
        <div>
          <h4 className="font-medium text-navy-900 mb-3">Status da Análise</h4>
          <AnalysisStatus status={submission.status} />
        </div>

        {/* Download PDF (if available) */}
        {submission.status === 'concluido' && (
          <div className="pt-4 border-t border-gray-200">
            <Button variant="architect" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Baixar Relatório PDF
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================
   COMPONENTS
   ============================================ */

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-sm text-gray-600">{label}:</span>
      <span className="text-sm font-medium text-navy-900">{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: SubmissionStatus }) {
  const variants: Record<SubmissionStatus, { bg: string; text: string; label: string }> = {
    pendente: { bg: "bg-gray-100", text: "text-gray-700", label: "Pendente" },
    aguardando_pagamento: { bg: "bg-yellow-50", text: "text-yellow-700", label: "Aguardando Pagamento" },
    em_enriquecimento: { bg: "bg-blue-50", text: "text-blue-700", label: "Em Enriquecimento" },
    enriquecimento_completo: { bg: "bg-indigo-50", text: "text-indigo-700", label: "Enriquecimento Completo" },
    em_analise: { bg: "bg-purple-50", text: "text-purple-700", label: "Em Análise" },
    analise_completa: { bg: "bg-teal-50", text: "text-teal-700", label: "Análise Completa" },
    em_geracao_relatorio: { bg: "bg-cyan-50", text: "text-cyan-700", label: "Gerando Relatório" },
    concluido: { bg: "bg-green-50", text: "text-green-700", label: "Concluído" },
    cancelado: { bg: "bg-gray-200", text: "text-gray-600", label: "Cancelado" },
    erro: { bg: "bg-red-50", text: "text-red-700", label: "Erro" },
  };

  const variant = variants[status];
  return (
    <span className={cn("inline-flex items-center px-3 py-1 text-sm font-medium", variant.bg, variant.text)}>
      {variant.label}
    </span>
  );
}

function EnrichmentStatus({ status }: { status: SubmissionStatus }) {
  if (status === 'enriquecimento_completo' || status === 'em_analise' || status === 'analise_completa' || status === 'em_geracao_relatorio' || status === 'concluido') {
    return (
      <div className="p-4 bg-green-50 border border-green-200">
        <p className="text-sm text-green-700 font-medium">✓ Enriquecimento completo</p>
        <p className="text-sm text-green-600 mt-1">Os dados foram coletados e enriquecidos com sucesso.</p>
      </div>
    );
  }
  if (status === 'em_enriquecimento') {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200">
        <p className="text-sm text-blue-700 font-medium">Em andamento...</p>
        <p className="text-sm text-blue-600 mt-1">Coletando e enriquecendo dados da empresa.</p>
      </div>
    );
  }
  return (
    <div className="p-4 bg-gray-50 border border-gray-200">
      <p className="text-sm text-gray-700">Aguardando início</p>
    </div>
  );
}

function AnalysisStatus({ status }: { status: SubmissionStatus }) {
  if (status === 'concluido') {
    return (
      <div className="p-4 bg-green-50 border border-green-200">
        <p className="text-sm text-green-700 font-medium">✓ Análise aprovada pelo admin</p>
        <p className="text-sm text-green-600 mt-1">Seu relatório está disponível para download.</p>
      </div>
    );
  }
  if (status === 'em_geracao_relatorio') {
    return (
      <div className="p-4 bg-cyan-50 border border-cyan-200">
        <p className="text-sm text-cyan-700 font-medium">Gerando relatório...</p>
        <p className="text-sm text-cyan-600 mt-1">O PDF está sendo compilado.</p>
      </div>
    );
  }
  if (status === 'analise_completa') {
    return (
      <div className="p-4 bg-teal-50 border border-teal-200">
        <p className="text-sm text-teal-700 font-medium">Análise completa</p>
        <p className="text-sm text-teal-600 mt-1">Aguardando aprovação do administrador.</p>
      </div>
    );
  }
  if (status === 'em_analise') {
    return (
      <div className="p-4 bg-purple-50 border border-purple-200">
        <p className="text-sm text-purple-700 font-medium">Em andamento...</p>
        <p className="text-sm text-purple-600 mt-1">A IA está gerando a análise estratégica.</p>
      </div>
    );
  }
  return (
    <div className="p-4 bg-gray-50 border border-gray-200">
      <p className="text-sm text-gray-700">Aguardando enriquecimento</p>
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
