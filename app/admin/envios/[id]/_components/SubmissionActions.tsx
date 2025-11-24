"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileEdit, BarChart3, Download, Sparkles } from "lucide-react";
import type { Enrichment, Analysis } from "@/types";

interface SubmissionActionsProps {
  submissionId: string;
  enrichment?: Enrichment;
  analysis?: Analysis;
  pdfUrl?: string;
}

export function SubmissionActions({ submissionId, enrichment, analysis, pdfUrl }: SubmissionActionsProps) {
  const hasEnrichment = !!enrichment;
  const hasAnalysis = !!analysis;
  const hasPDF = !!pdfUrl;

  return (
    <Card className="p-6">
      <h2 className="font-heading text-xl font-medium text-navy-900 mb-6">
        Ações
      </h2>

      <div className="space-y-3">
        {/* Edit Enrichment */}
        <Link
          href={`/admin/enriquecimento/${submissionId}`}
          className={!hasEnrichment ? "pointer-events-none opacity-50" : ""}
        >
          <Button
            variant="outline"
            className="w-full justify-start"
            disabled={!hasEnrichment}
          >
            <FileEdit className="w-4 h-4 mr-2" />
            Editar Enriquecimento
            {enrichment?.status && (
              <span className="ml-auto text-xs text-text-tertiary">
                {enrichment.status === "approved" ? "Aprovado" : enrichment.status === "completed" ? "Pronto" : "Pendente"}
              </span>
            )}
          </Button>
        </Link>

        {/* Edit Analysis */}
        <Link
          href={`/admin/analise/${submissionId}`}
          className={!hasAnalysis ? "pointer-events-none opacity-50" : ""}
        >
          <Button
            variant="outline"
            className="w-full justify-start"
            disabled={!hasAnalysis}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Editar Análise
            {analysis?.status && (
              <span className="ml-auto text-xs text-text-tertiary">
                {analysis.status === "sent" ? "Enviado" : analysis.status === "approved" ? "Aprovado" : analysis.status === "completed" ? "Completo" : "Pendente"}
              </span>
            )}
          </Button>
        </Link>

        {/* War Room (Advanced Editor) */}
        <Link href={`/admin/submissions/${submissionId}`}>
          <Button
            variant="architect"
            className="w-full justify-start"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            War Room (Editor Avançado)
          </Button>
        </Link>

        {/* Download PDF */}
        {hasPDF && (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button
              variant="default"
              className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar Relatório PDF
            </Button>
          </a>
        )}
      </div>

      {/* Help Text */}
      <div className="mt-6 pt-6 border-t border-line">
        <p className="text-xs text-text-tertiary">
          <strong className="text-navy-900">Fluxo de Trabalho:</strong><br />
          1. Aguardar enriquecimento de dados<br />
          2. Revisar e aprovar enriquecimento<br />
          3. Análise será gerada automaticamente<br />
          4. Revisar e aprovar análise (gera PDF)<br />
          5. Enviar relatório para o usuário
        </p>
      </div>
    </Card>
  );
}
