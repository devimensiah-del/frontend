'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { Submission } from '@/types';

interface SubmissionCardProps {
  submission: Submission;
}

const STATUS_LABELS: Record<string, string> = {
  pendente: 'Pendente',
  aguardando_pagamento: 'Aguardando Pagamento',
  em_enriquecimento: 'Em Enriquecimento',
  enriquecimento_completo: 'Enriquecimento Completo',
  em_analise: 'Em Análise',
  analise_completa: 'Análise Completa',
  em_geracao_relatorio: 'Gerando Relatório',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
  erro: 'Erro',
};

const STATUS_COLORS: Record<string, string> = {
  pendente: 'bg-gray-100 text-gray-800 border-gray-300',
  aguardando_pagamento: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  em_enriquecimento: 'bg-blue-100 text-blue-800 border-blue-300',
  enriquecimento_completo: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  em_analise: 'bg-purple-100 text-purple-800 border-purple-300',
  analise_completa: 'bg-teal-100 text-teal-800 border-teal-300',
  em_geracao_relatorio: 'bg-cyan-100 text-cyan-800 border-cyan-300',
  concluido: 'bg-green-100 text-green-800 border-green-300',
  cancelado: 'bg-gray-200 text-gray-600 border-gray-400',
  erro: 'bg-red-100 text-red-800 border-red-300',
};

export function SubmissionCard({ submission }: SubmissionCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {submission.companyName}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Enviado em {formatDate(submission.createdAt)}
            </p>
          </div>
          <Badge
            className={`${STATUS_COLORS[submission.status] || 'bg-gray-100 text-gray-800'} border`}
          >
            {STATUS_LABELS[submission.status] || submission.status}
          </Badge>
        </div>

        {/* Company Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700">CNPJ</p>
            <p className="text-sm text-gray-900 mt-1 font-mono">{submission.cnpj || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Indústria</p>
            <p className="text-sm text-gray-900 mt-1">{submission.industry}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Porte da Empresa</p>
            <p className="text-sm text-gray-900 mt-1">{submission.companySize}</p>
          </div>
          {submission.email && (
            <div>
              <p className="text-sm font-medium text-gray-700">E-mail</p>
              <p className="text-sm text-gray-900 mt-1">{submission.email}</p>
            </div>
          )}
          {submission.website && (
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-gray-700">Website</p>
              <a
                href={submission.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#00a859] hover:underline mt-1 block"
              >
                {submission.website}
              </a>
            </div>
          )}
        </div>

        {/* Strategic Context */}
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-sm font-medium text-gray-700">Objetivo Estratégico</p>
            <p className="text-sm text-gray-900 mt-2 leading-relaxed">
              {submission.strategicGoal}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">Desafios Atuais</p>
            <p className="text-sm text-gray-900 mt-2 leading-relaxed">
              {submission.currentChallenges}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">Posição Competitiva</p>
            <p className="text-sm text-gray-900 mt-2 leading-relaxed">
              {submission.competitivePosition}
            </p>
          </div>
        </div>

        {/* Additional Info */}
        {submission.additionalInfo && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700">Informações Adicionais</p>
            <p className="text-sm text-gray-900 mt-2 leading-relaxed">
              {submission.additionalInfo}
            </p>
          </div>
        )}

        {/* Payment Status */}
        {submission.paymentStatus && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">Status do Pagamento</p>
              <Badge
                className={`${
                  submission.paymentStatus === 'aprovado'
                    ? 'bg-green-100 text-green-800 border-green-300'
                    : submission.paymentStatus === 'pendente'
                    ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                    : 'bg-red-100 text-red-800 border-red-300'
                } border`}
              >
                {submission.paymentStatus === 'aprovado' ? 'Aprovado' :
                 submission.paymentStatus === 'pendente' ? 'Pendente' :
                 submission.paymentStatus === 'rejeitado' ? 'Rejeitado' : submission.paymentStatus}
              </Badge>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
