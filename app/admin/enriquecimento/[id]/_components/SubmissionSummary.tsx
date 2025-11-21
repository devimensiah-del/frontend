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
            <DataRow label="Email" value={submission.email} />
            {submission.phone && (
              <DataRow label="Telefone" value={submission.phone} />
            )}
            {submission.industry && (
              <DataRow label="Setor" value={submission.industry} />
            )}
          </div>
        </div>

        {/* Description */}
        {submission.description && (
          <div>
            <SectionTitle>Descrição</SectionTitle>
            <p className="text-sm text-text-primary mt-2 whitespace-pre-wrap">
              {submission.description}
            </p>
          </div>
        )}

        {/* Personal Info (if available) */}
        {submission.personalInfo && (
          <div>
            <SectionTitle>Informações Pessoais</SectionTitle>
            <div className="space-y-3 mt-3">
              <DataRow
                label="Nome Completo"
                value={submission.personalInfo?.fullName || 'N/A'}
              />
              <DataRow
                label="Documento"
                value={submission.personalInfo?.document || 'N/A'}
              />
              <DataRow label="Email" value={submission.personalInfo?.email || 'N/A'} />
              <DataRow
                label="Telefone"
                value={submission.personalInfo?.phone || 'N/A'}
              />
            </div>
          </div>
        )}

        {/* Address (if available) */}
        {submission.address && (
          <div>
            <SectionTitle>Endereço</SectionTitle>
            <div className="space-y-3 mt-3">
              <DataRow label="Rua" value={submission.address.street} />
              <DataRow label="Cidade" value={submission.address.city} />
              <DataRow label="Estado" value={submission.address.state} />
              <DataRow label="CEP" value={submission.address.zipCode} />
            </div>
          </div>
        )}

        {/* Notes */}
        {submission.notes && (
          <div>
            <SectionTitle>Notas</SectionTitle>
            <p className="text-sm text-text-secondary mt-2 whitespace-pre-wrap">
              {submission.notes}
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
