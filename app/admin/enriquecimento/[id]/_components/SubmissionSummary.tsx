"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Submission } from "@/types";

/* ============================================
   SUBMISSION SUMMARY - Read-only Submission Data
   ============================================ */

interface SubmissionSummaryProps {
  submission: Submission;
}

export function SubmissionSummary({ submission }: SubmissionSummaryProps) {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Dados da Submissão</CardTitle>
        <p className="text-sm text-text-secondary mt-1">
          Informações originais fornecidas pelo cliente
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Company Information */}
        <div>
          <SectionTitle>Informações da Empresa</SectionTitle>
          <div className="space-y-3 mt-3">
            <DataRow label="Nome da Empresa" value={submission.companyName} />
            <DataRow label="CNPJ" value={submission.cnpj} />
            <DataRow label="Setor" value={submission.industry} />
            <DataRow label="Tamanho" value={submission.companySize} />
            {submission.website && (
              <DataRow label="Website" value={
                <a href={submission.website} target="_blank" rel="noopener noreferrer" className="text-gold-500 hover:underline">
                  {submission.website}
                </a>
              } />
            )}
          </div>
        </div>

        {/* Strategic Context */}
        <div>
          <SectionTitle>Contexto Estratégico</SectionTitle>
          <div className="space-y-3 mt-3">
            <DataRow label="Objetivo Estratégico" value={submission.strategicGoal} />
            <DataRow label="Posição Competitiva" value={submission.competitivePosition} />
          </div>
        </div>

        {/* Current Challenges */}
        {submission.currentChallenges && (
          <div>
            <SectionTitle>Desafios Atuais</SectionTitle>
            <p className="text-sm text-text-primary mt-2 whitespace-pre-wrap">
              {submission.currentChallenges}
            </p>
          </div>
        )}

        {/* Additional Information */}
        {submission.additionalInfo && (
          <div>
            <SectionTitle>Informações Adicionais</SectionTitle>
            <p className="text-sm text-text-secondary mt-2 whitespace-pre-wrap">
              {submission.additionalInfo}
            </p>
          </div>
        )}

        {/* Metadata */}
        <div>
          <SectionTitle>Metadata</SectionTitle>
          <div className="space-y-3 mt-3">
            <DataRow
              label="Status"
              value={
                <span className="uppercase text-xs font-medium">
                  {submission.status}
                </span>
              }
            />
            <DataRow
              label="Criado em"
              value={formatDate(submission.createdAt)}
            />
            <DataRow
              label="Atualizado em"
              value={formatDate(submission.updatedAt)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ============================================
   HELPER COMPONENTS
   ============================================ */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-xs uppercase tracking-widest font-bold text-text-secondary">
      {children}
    </h4>
  );
}

interface DataRowProps {
  label: string;
  value: React.ReactNode;
}

function DataRow({ label, value }: DataRowProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-32 flex-shrink-0">
        <span className="text-xs uppercase tracking-wider font-medium text-text-secondary">
          {label}
        </span>
      </div>
      <div className="flex-1">
        <span className="text-sm text-text-primary">{value || "—"}</span>
      </div>
    </div>
  );
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
