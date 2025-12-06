"use client";

import React from "react";
import { Company, Enrichment } from "@/lib/types";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Select, SelectOption } from "@/components/ui/Select";
import { NoDataYet, ProcessingState, ErrorState } from "@/components/ui/state-components";
import { Badge } from "@/components/ui/badge";

interface EnrichmentDetailsProps {
  enrichment: Enrichment;
  company?: Company;
  isAdmin: boolean;
  onUpdate?: (data: any) => void;
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
    } catch {
      return {};
    }
  }

  return {};
}

/**
 * Format currency value in Brazilian Real
 */
function formatCurrency(value: number | undefined): string {
  if (value === undefined || value === null) return '—';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function EnrichmentDetails({
  enrichment,
  company,
  isAdmin,
}: EnrichmentDetailsProps) {
  const [activeTab, setActiveTab] = React.useState("overview");

  // Handle pending/processing status
  if (enrichment.status === 'pending' || enrichment.status === 'processing') {
    return (
      <ProcessingState
        title="Enriquecimento em Andamento"
        description="Nossa IA está coletando e analisando informações adicionais sobre a empresa. Este processo pode levar alguns minutos."
        estimatedTime="2-5 minutos"
      />
    );
  }

  // Handle failed status
  if (enrichment.status === 'failed') {
    return (
      <ErrorState
        title="Erro no Enriquecimento"
        message="Ocorreu um erro durante o enriquecimento. Tente novamente."
        variant="error"
      />
    );
  }

  // Status is 'completed' - show enriched data
  const data = enrichment.data || {};
  const profile = (data.profile_overview || {}) as any;
  const financials = (data.financials || {}) as any;
  const marketPos = (data.market_position || {}) as any;
  const strategic = (data.strategic_assessment || {}) as any;
  const competitive = (data.competitive_landscape || {}) as any;

  /**
   * Normalize a value that might be a comma-separated string into an array
   * Handles: "item1, item2, item3" -> ["item1", "item2", "item3"]
   * Also handles already-array values
   */
  const normalizeToArray = (value: any): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map(v => String(v).trim()).filter(Boolean);
    if (typeof value === 'string') {
      // Split by common delimiters: comma, semicolon, or period followed by comma
      return value
        .split(/[,;]|(?<=\.)\s*,/)
        .map(item => item.trim())
        .filter(item => item.length > 0 && item !== '.');
    }
    return [String(value)];
  };

  // Helper components for read‑only fields
  const Field = ({ label, value, multiline }: { label: string; value: any; multiline?: boolean }) => (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
        {label}
      </label>
      <p className={`text-sm text-navy-900 leading-relaxed ${multiline ? "whitespace-pre-line" : ""}`} style={{ wordBreak: 'normal', overflowWrap: 'break-word' }}>
        {value ?? "—"}
      </p>
    </div>
  );

  // List field that renders items as a proper bullet list
  const ListField = ({ label, items }: { label: string; items?: any[] | string }) => {
    const normalizedItems = normalizeToArray(items);

    if (!normalizedItems.length) {
      return <Field label={label} value="—" />;
    }

    return (
      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
          {label}
        </label>
        <ul className="space-y-1.5">
          {normalizedItems.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-navy-900">
              <span className="text-gray-400 mt-1 flex-shrink-0">•</span>
              <span className="leading-relaxed" style={{ wordBreak: 'normal', overflowWrap: 'break-word' }}>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Status Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Badge
            variant={enrichment.status === 'completed' ? 'success' : 'default'}
            className="text-xs"
          >
            {enrichment.status === 'completed' ? 'Enriquecimento Concluído' : enrichment.status}
          </Badge>
          <span className="text-xs text-gray-500">
            {new Date(enrichment.updatedAt).toLocaleString('pt-BR')}
          </span>
        </div>
      </div>

      {/* Section Selector Dropdown */}
      <div className="mb-4">
        <Select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          className="w-full md:w-[300px]"
        >
          <SelectOption value="overview">Perfil da Empresa</SelectOption>
          <SelectOption value="strategic">Avaliação Estratégica</SelectOption>
          <SelectOption value="financial">Contexto Financeiro</SelectOption>
          <SelectOption value="market">Posição de Mercado</SelectOption>
        </Select>
      </div>

      {/* Tabbed view */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

        {/* Overview Tab - Company Profile */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Razão Social" value={profile.legal_name} />
            <Field label="Website" value={profile.website} />
            <Field label="Ano de Fundação" value={profile.foundation_year} />
            <Field label="Sede" value={profile.headquarters} />
            <Field label="Setor" value={marketPos.sector} />
            <div className="md:col-span-2">
              <Field label="Descrição" value={profile.description} multiline />
            </div>
            <div className="md:col-span-2">
              <Field label="Proposta de Valor" value={marketPos.value_proposition} multiline />
            </div>
            <div className="md:col-span-2">
              <Field label="Público Alvo" value={marketPos.target_audience} multiline />
            </div>
          </div>
        </TabsContent>

        {/* Strategic Tab - Assessment & Insights */}
        <TabsContent value="strategic" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Field label="Maturidade Digital (0‑10)" value={strategic.digital_maturity} />
          </div>
          <ListField label="Forças Identificadas" items={strategic.strengths} />
          <ListField label="Pontos de Atenção" items={strategic.weaknesses} />
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Faixa de Funcionários" value={financials.employees_range} />
            <Field label="Estimativa de Receita" value={financials.revenue_estimate} />
            <div className="md:col-span-2">
              <Field label="Modelo de Negócio" value={financials.business_model} multiline />
            </div>
          </div>
        </TabsContent>

        {/* Market Tab - Position & Competition */}
        <TabsContent value="market" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6 mb-6 border-b pb-6">
            <Field label="Status de Market Share" value={competitive.market_share_status} />
          </div>
          <ListField label="Principais Concorrentes" items={competitive.competitors} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
