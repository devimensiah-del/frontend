"use client";

import React from "react";
import { Enrichment } from "@/lib/types";
import { EnrichmentEditor } from "./EnrichmentEditor";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectOption } from "@/components/ui/Select";

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
      <div className="text-center py-12 text-gray-500">
        <p>Nenhum dado de enriquecimento disponível ainda.</p>
      </div>
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

  return (
    <div className="space-y-6">
      {/* Admin actions */}
      {isAdmin && (
        <div className="flex justify-end gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Editar Dados
          </Button>
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
