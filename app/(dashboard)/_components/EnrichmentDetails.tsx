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

  const { data, status, progress, updatedAt } = enrichment;

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
          <SelectOption value="financial">Financeiro</SelectOption>
          <SelectOption value="market">Mercado</SelectOption>
          <SelectOption value="strategic">Estratégico</SelectOption>
          <SelectOption value="competitive">Competitivo</SelectOption>
          <SelectOption value="raw">Dados Brutos</SelectOption>
        </Select>
      </div>

      {/* Tabbed view */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="hidden md:flex w-full overflow-x-auto flex-nowrap justify-start bg-white p-2 border border-gray-200 rounded-none text-[13px] md:text-sm font-semibold uppercase tracking-wide scrollbar-hide">
          <TabsTrigger value="overview" className="min-w-[120px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="financial" className="min-w-[100px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
            Financeiro
          </TabsTrigger>
          <TabsTrigger value="market" className="min-w-[100px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
            Mercado
          </TabsTrigger>
          <TabsTrigger value="strategic" className="min-w-[110px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
            Estratégico
          </TabsTrigger>
          <TabsTrigger value="competitive" className="min-w-[110px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
            Competitivo
          </TabsTrigger>
          <TabsTrigger value="raw" className="min-w-[110px] flex-shrink-0 min-h-[48px] leading-tight data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
            Dados Brutos
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Razão Social" value={data.profile_overview?.legal_name} />
            <Field label="Website" value={data.profile_overview?.website} />
            <Field label="Ano de Fundação" value={data.profile_overview?.foundation_year} />
            <Field label="Sede" value={data.profile_overview?.headquarters} />
            <div className="col-span-2">
              <Field label="Descrição" value={data.profile_overview?.description} multiline />
            </div>
          </div>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Faixa de Funcionários" value={data.financials?.employees_range} />
            <Field label="Estimativa de Receita" value={data.financials?.revenue_estimate} />
            <Field label="Modelo de Negócio" value={data.financials?.business_model} />
          </div>
        </TabsContent>

        {/* Market Tab */}
        <TabsContent value="market" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6 mb-6 border-b pb-6">
            <Field label="Status" value={status} />
            <Field label="Atualizado em" value={updatedAt} />
            <Field label="Aprovado" value={status === "approved" ? "Sim" : "Não"} />
            <Field label="Progresso" value={progress !== undefined ? `${progress}%` : "—"} />
            <Field label="Qualidade dos Dados" value={data?.quality ?? "—"} />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Setor" value={data.market_position?.sector} />
            <Field label="Público Alvo" value={data.market_position?.target_audience} />
            <Field label="Proposta de Valor" value={data.market_position?.value_proposition} />
          </div>
        </TabsContent>

        {/* Strategic Tab */}
        <TabsContent value="strategic" className="space-y-4">
          <Field label="Maturidade Digital (0‑10)" value={data.strategic_assessment?.digital_maturity} />
          <ListField label="Forças Identificadas" items={data.strategic_assessment?.strengths} />
          <ListField label="Pontos de Atenção" items={data.strategic_assessment?.weaknesses} />
        </TabsContent>

        {/* Competitive Tab */}
        <TabsContent value="competitive" className="space-y-4">
          <ListField label="Concorrentes" items={data.competitive_landscape?.competitors} />
          <Field label="Status de Share de Mercado" value={data.competitive_landscape?.market_share_status} />
        </TabsContent>

        {/* Raw JSON Tab */}
        <TabsContent value="raw" className="space-y-4">
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm text-navy-900">
            {JSON.stringify(data, null, 2)}
          </pre>
        </TabsContent>
      </Tabs>
    </div>
  );
}
