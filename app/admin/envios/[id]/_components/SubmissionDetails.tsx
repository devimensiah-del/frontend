"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Building2, Mail, Globe, MapPin, Users, TrendingUp } from "lucide-react";
import type { Submission } from "@/types";

interface SubmissionDetailsProps {
  submission: Submission;
}

export function SubmissionDetails({ submission }: SubmissionDetailsProps) {
  return (
    <Card className="p-6">
      <h2 className="font-heading text-xl font-medium text-navy-900 mb-6">
        Informações da Submissão
      </h2>

      <div className="space-y-6">
        {/* Company Information */}
        <div>
          <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-3">
            Empresa
          </h3>
          <div className="space-y-3">
            <DetailRow
              icon={<Building2 className="w-4 h-4" />}
              label="Nome"
              value={submission.companyName}
            />
            {submission.cnpj && (
              <DetailRow
                icon={<Building2 className="w-4 h-4" />}
                label="CNPJ"
                value={submission.cnpj}
              />
            )}
            {submission.industry && (
              <DetailRow
                icon={<TrendingUp className="w-4 h-4" />}
                label="Setor"
                value={submission.industry}
              />
            )}
            {submission.companySize && (
              <DetailRow
                icon={<Users className="w-4 h-4" />}
                label="Tamanho"
                value={submission.companySize}
              />
            )}
            {submission.website && (
              <DetailRow
                icon={<Globe className="w-4 h-4" />}
                label="Website"
                value={submission.website}
                isLink
              />
            )}
            {submission.email && (
              <DetailRow
                icon={<Mail className="w-4 h-4" />}
                label="Email"
                value={submission.email}
              />
            )}
            {submission.location && (
              <DetailRow
                icon={<MapPin className="w-4 h-4" />}
                label="Localização"
                value={submission.location}
              />
            )}
          </div>
        </div>

        {/* Strategic Context */}
        {(submission.strategicGoal || submission.currentChallenges || submission.competitivePosition) && (
          <div className="border-t border-line pt-6">
            <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-3">
              Contexto Estratégico
            </h3>
            <div className="space-y-4">
              {submission.strategicGoal && (
                <div>
                  <p className="text-xs font-medium text-text-tertiary mb-1">
                    Objetivo Estratégico
                  </p>
                  <p className="text-sm text-navy-900">{submission.strategicGoal}</p>
                </div>
              )}
              {submission.currentChallenges && (
                <div>
                  <p className="text-xs font-medium text-text-tertiary mb-1">
                    Desafios Atuais
                  </p>
                  <p className="text-sm text-navy-900">{submission.currentChallenges}</p>
                </div>
              )}
              {submission.competitivePosition && (
                <div>
                  <p className="text-xs font-medium text-text-tertiary mb-1">
                    Posição Competitiva
                  </p>
                  <p className="text-sm text-navy-900">{submission.competitivePosition}</p>
                </div>
              )}
              {submission.additionalInfo && (
                <div>
                  <p className="text-xs font-medium text-text-tertiary mb-1">
                    Informações Adicionais
                  </p>
                  <p className="text-sm text-navy-900">{submission.additionalInfo}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="border-t border-line pt-6">
          <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-3">
            Metadados
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-tertiary">Status:</span>
              <span className="font-medium text-green-600">Recebido</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-tertiary">Enviado em:</span>
              <span className="text-navy-900">{formatDate(submission.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-tertiary">Última atualização:</span>
              <span className="text-navy-900">{formatDate(submission.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  isLink?: boolean;
}

function DetailRow({ icon, label, value, isLink = false }: DetailRowProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-text-tertiary mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-text-tertiary mb-0.5">{label}</p>
        {isLink ? (
          <a
            href={value.startsWith("http") ? value : `https://${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gold-600 hover:text-gold-700 hover:underline break-all"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm text-navy-900 break-words">{value}</p>
        )}
      </div>
    </div>
  );
}

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
