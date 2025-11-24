"use client";

import React from "react";
import { Enrichment } from "@/lib/types";
import { EnrichmentEditor } from "./EnrichmentEditor";
import { Button } from "@/components/ui/button";
import { RefreshCcw, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectOption } from "@/components/ui/Select";
import { getEnrichmentActions } from "@/lib/utils/workflow";
import { NoDataYet, ProcessingState, ErrorState } from "@/components/ui/state-components";

interface EnrichmentDetailsProps {
  enrichment?: Enrichment;
  isAdmin: boolean;
  onUpdate: (data: any) => void;
  onRetry?: () => void;
  onEdit?: () => void; // optional external edit handler
}

/**
 * Parse enrichment data - handles double-encoded JSON from backend
 * The database sometimes stores JSON as a string, so we need to parse it
 */
function parseEnrichmentData(data: any): Record<string, any> {
  if (!data) return {};

  // If data is already an object, return it
  if (typeof data === 'object' && data !== null) {
    return data;
  }

  // If data is a string, try to parse it as JSON
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return typeof parsed === 'object' ? parsed : {};
    } catch (e) {
      console.warn('Failed to parse enrichment data string:', e);
      return {};
    }
  }

  return {};
}

export function EnrichmentDetails({
  enrichment,
  isAdmin,
  onUpdate,
  onRetry: _onRetry,
  onEdit: _onEdit,
}: EnrichmentDetailsProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("overview");

  if (!enrichment) {
    return (
      <NoDataYet
        dataType="Dados de enriquecimento"
        expectedWhen="Os dados serão gerados automaticamente após o envio inicial. Aguarde alguns minutos."
      />
    );
  }

  // Handle pending status (enrichment is being processed)
  if (enrichment.status === 'pending') {
    return (
      <ProcessingState
        title="Enriquecimento em Andamento"
        description="Nossa IA está coletando e analisando informações adicionais sobre a empresa. Este processo pode levar alguns minutos."
        progress={enrichment.progress}
        estimatedTime="2-5 minutos"
      />
    );
  }

  // Edit mode – show the rich editor
  if (isEditing && isAdmin) {
    return (
      <EnrichmentEditor
        enrichment={enrichment}
        onSave={(data) => {
          onUpdate(data);
          setIsEditing(false);
        }}
      />
    );
  }

  // Parse data - handle double-encoded JSON from backend
  const parsedData = parseEnrichmentData(enrichment.data);
  const { status, progress, updatedAt } = enrichment;

  // Helper components for read‑only fields
  const Field = ({ label, value, multiline }: { label: string; value: any; multiline?: boolean }) => (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
        {label}
      </label>
      <p className={`text-sm text-navy-900 ${multiline ? "whitespace-pre-line leading-relaxed" : "break-all"}`}>
        {value ?? "—"}
      </p>
    </div>
  );

  const ListField = ({ label, items }: { label: string; items?: any[] }) => (
    <Field label={label} value={items && items.length ? items.join(", ") : "—"} />
  );

  const enrichmentActions = getEnrichmentActions(enrichment);

  return (
    <div className="space-y-6">
      {/* Admin actions */}
      {isAdmin && (
        <div className="mb-4">
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              disabled={!enrichmentActions.canEdit}
              title={!enrichmentActions.canEdit ? `Edição não permitida: ${enrichmentActions.message}` : 'Editar dados de enriquecimento'}
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Editar Dados
            </Button>
          </div>
          {!enrichmentActions.canEdit && (
            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-900">
                <p className="font-medium">Edição não permitida</p>
                <p className="text-xs mt-1">{enrichmentActions.message}</p>
                <p className="text-xs mt-1">Só é possível editar quando status é 'pending' ou 'completed'</p>
              </div>
            </div>
          )}
        </div>
      )}

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
          <SelectOption value="market">Mercado & Competição</SelectOption>
          <SelectOption value="metadata">Metadados</SelectOption>
        </Select>
      </div>

      {/* Tabbed view - matches SubmissionDetails structure */}
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
          <TabsTrigger value="market" className="min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
            Mercado
          </TabsTrigger>
          <TabsTrigger value="metadata" className="min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
            Metadados
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab - Company Profile */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Razão Social" value={parsedData.profile_overview?.legal_name} />
            <Field label="Website" value={parsedData.profile_overview?.website} />
            <Field label="Ano de Fundação" value={parsedData.profile_overview?.foundation_year} />
            <Field label="Sede" value={parsedData.profile_overview?.headquarters} />
            <div className="md:col-span-2">
              <Field label="Proposta de Valor" value={parsedData.market_position?.value_proposition} multiline />
            </div>
          </div>
        </TabsContent>

        {/* Strategic Tab - Assessment & Insights */}
        <TabsContent value="strategic" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Field label="Maturidade Digital (0‑10)" value={parsedData.strategic_assessment?.digital_maturity} />
            <Field label="Setor de Atuação" value={parsedData.market_position?.sector} />
          </div>
          <ListField label="Forças Identificadas" items={parsedData.strategic_assessment?.strengths} />
          <ListField label="Pontos de Atenção" items={parsedData.strategic_assessment?.weaknesses} />
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Faixa de Funcionários" value={parsedData.financials?.employees_range} />
            <Field label="Estimativa de Receita" value={parsedData.financials?.revenue_estimate} />
            <div className="md:col-span-2">
              <Field label="Modelo de Negócio" value={parsedData.financials?.business_model} multiline />
            </div>
          </div>
        </TabsContent>

        {/* Market Tab - Position & Competition */}
        <TabsContent value="market" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6 mb-6 border-b pb-6">
            <Field label="Público Alvo" value={parsedData.market_position?.target_audience} />
            <Field label="Status de Market Share" value={parsedData.competitive_landscape?.market_share_status} />
          </div>
          <ListField label="Principais Concorrentes" items={parsedData.competitive_landscape?.competitors} />
        </TabsContent>

        {/* Metadata Tab - Status & Raw Data */}
        <TabsContent value="metadata" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6 mb-6 border-b pb-6">
            <Field label="Status" value={status} />
            <Field label="Progresso" value={progress !== undefined ? `${progress}%` : "—"} />
            <Field label="Aprovado" value={status === "approved" ? "Sim" : "Não"} />
            <Field label="Atualizado em" value={updatedAt ? new Date(updatedAt).toLocaleString('pt-BR') : "—"} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
              Dados Brutos (JSON)
            </label>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm text-navy-900 max-h-[400px]">
              {JSON.stringify(parsedData, null, 2)}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
