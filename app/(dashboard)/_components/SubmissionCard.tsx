'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Globe, Target, Briefcase, Mail, Calendar } from 'lucide-react';
import { DataField, Section, StatusBadge } from '@/components/workflow';
import type { Submission } from '@/types';

interface SubmissionCardProps {
  submission: Submission;
}

export function SubmissionCard({ submission }: SubmissionCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-1">
            <Building2 className="w-5 h-5 text-gold-600 flex-shrink-0" />
            <div>
              <CardTitle className="text-navy-900">{submission.companyName}</CardTitle>
              <div className="flex items-center gap-2 mt-1 text-xs text-text-secondary">
                <Calendar className="w-3 h-3" />
                <span>Enviado em {formatDate(submission.createdAt)}</span>
              </div>
            </div>
          </div>
          <StatusBadge status={submission.status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Company Information */}
        <Section title="Informações da Empresa" icon={<Building2 />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DataField
              label="CNPJ"
              value={submission.cnpj}
              icon={<Briefcase className="w-4 h-4" />}
            />
            <DataField
              label="Indústria"
              value={submission.industry}
              icon={<Briefcase className="w-4 h-4" />}
            />
            <DataField
              label="Porte da Empresa"
              value={submission.companySize}
              icon={<Building2 className="w-4 h-4" />}
            />
            <DataField
              label="Website"
              value={submission.website}
              icon={<Globe className="w-4 h-4" />}
              link
            />
            {submission.email && (
              <DataField
                label="E-mail"
                value={submission.email}
                icon={<Mail className="w-4 h-4" />}
              />
            )}
          </div>
        </Section>

        {/* Strategic Context */}
        <Section title="Contexto Estratégico" icon={<Target />}>
          <div className="space-y-4">
            <DataField
              label="Objetivo Estratégico"
              value={submission.strategicGoal}
            />
            <DataField
              label="Desafios Atuais"
              value={submission.currentChallenges}
            />
            <DataField
              label="Posição Competitiva"
              value={submission.competitivePosition}
            />
          </div>
        </Section>

        {/* Additional Info */}
        {submission.additionalInfo && (
          <Section title="Informações Adicionais">
            <DataField value={submission.additionalInfo} label="" />
          </Section>
        )}
      </CardContent>
    </Card>
  );
}
