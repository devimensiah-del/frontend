"use client";

import React from 'react';
import { Submission } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectOption } from '@/components/ui/Select';

interface SubmissionDetailsProps {
  submission: Submission;
  isAdmin: boolean;
  onEdit?: () => void; // optional edit handler
}

export function SubmissionDetails({ submission, isAdmin: _isAdmin, onEdit: _onEdit }: SubmissionDetailsProps) {
  const [activeTab, setActiveTab] = React.useState("overview");

  const Field = ({ label, value, multiline }: { label: string; value: any; multiline?: boolean }) => (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
        {label}
      </label>
      <p className={`text-sm text-navy-900 ${multiline ? 'whitespace-pre-line leading-relaxed' : ''}`}>
        {value ?? '—'}
      </p>
    </div>
  );

  const ListField = ({ label, items }: { label: string; items?: any[] }) => (
    <Field label={label} value={items && items.length ? items.join(', ') : '—'} />
  );

  return (
    <div className="space-y-6">

      {/* Mobile Tab Selector */}
      <div className="md:hidden mb-4">
        <Select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          className="w-full"
        >
          <SelectOption value="overview">Visão Geral</SelectOption>
          <SelectOption value="strategic">Estratégico</SelectOption>
          <SelectOption value="financial">Financeiro</SelectOption>
          <SelectOption value="social">Social & Local</SelectOption>
          <SelectOption value="metadata">Metadados</SelectOption>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="hidden md:grid w-full grid-cols-5 bg-white p-2 border border-gray-200 rounded-none text-[13px] md:text-sm font-semibold uppercase tracking-wide">
          <TabsTrigger value="overview" className="min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="strategic" className="min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
            Estratégico
          </TabsTrigger>
          <TabsTrigger value="financial" className="min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
            Financeiro
          </TabsTrigger>
          <TabsTrigger value="social" className="min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
            Social & Local
          </TabsTrigger>
          <TabsTrigger value="metadata" className="min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
            Metadados
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Nome da Empresa" value={submission.companyName} />
            <Field label="CNPJ" value={submission.cnpj} />
            <Field label="Website" value={submission.website} />
            <Field label="Indústria" value={submission.industry} />
            <Field label="Tamanho da Empresa" value={submission.companySize} />
            <Field label="Email de Contato" value={submission.contactEmail} />
            <Field label="Nome do Contato" value={submission.contactName} />
            <Field label="Telefone do Contato" value={submission.contactPhone} />
            <Field label="Cargo do Contato" value={submission.contactPosition} />
            <Field label="Mercado Alvo" value={submission.targetMarket} />
          </div>
        </TabsContent>

        {/* Strategic Context Tab */}
        <TabsContent value="strategic" className="space-y-4">
          <Field label="Objetivo Estratégico" value={submission.strategicGoal} multiline />
          <Field label="Desafios Atuais" value={submission.currentChallenges} multiline />
          <Field label="Posição Competitiva" value={submission.competitivePosition} multiline />
          <Field label="Informações Adicionais" value={submission.additionalInfo} multiline />
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Receita Anual (Mín)" value={submission.annualRevenueMin !== undefined ? `$${submission.annualRevenueMin}` : '—'} />
            <Field label="Receita Anual (Máx)" value={submission.annualRevenueMax !== undefined ? `$${submission.annualRevenueMax}` : '—'} />
            <Field label="Estágio de Financiamento" value={submission.fundingStage} />
            <Field label="Desafio de Negócio" value={submission.businessChallenge} multiline />
            <Field label="Notas Adicionais" value={submission.additionalNotes} multiline />
          </div>
        </TabsContent>

        {/* Social & Location Tab */}
        <TabsContent value="social" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="LinkedIn" value={submission.linkedinUrl} />
            <Field label="Twitter" value={submission.twitterHandle} />
            <Field label="Localização" value={submission.location} />
          </div>
        </TabsContent>

        {/* Metadata Tab */}
        <TabsContent value="metadata" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Status" value={submission.status} />
            <Field label="Status de Pagamento" value={submission.paymentStatus} />
            <Field label="Criado em" value={submission.createdAt} />
            <Field label="Atualizado em" value={submission.updatedAt} />
            <Field label="Enrichment ID" value={submission.enrichmentId} />
            <Field label="Analysis ID" value={submission.analysisId} />
            <Field label="Report ID" value={submission.reportId} />
            <Field label="PDF URL" value={submission.pdfUrl || submission.pdf_url} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: any;
  multiline?: boolean;
}

function Field({ label, value, multiline }: FieldProps) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
        {label}
      </label>
      <p className={`text-sm text-navy-900 ${multiline ? 'whitespace-pre-line leading-relaxed' : ''}`}>
        {value ?? '—'}
      </p>
    </div>
  );
}
