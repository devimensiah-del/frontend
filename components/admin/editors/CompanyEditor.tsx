"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, Save, X, AlertCircle } from "lucide-react";
import type { Company } from "@/lib/types";

// Field definitions with deprecation categories for display
const COMPANY_FIELDS = [
  // Static fields (never expire)
  { key: "name", label: "Nome", category: "static", placeholder: "Nome da empresa" },
  { key: "cnpj", label: "CNPJ", category: "static", placeholder: "00.000.000/0000-00" },
  { key: "legal_name", label: "Razão Social", category: "static", placeholder: "Razão social" },
  { key: "foundation_year", label: "Ano de Fundação", category: "static", placeholder: "2020" },
  { key: "headquarters", label: "Sede", category: "static", placeholder: "São Paulo, SP" },
  { key: "website", label: "Website", category: "static", placeholder: "https://exemplo.com" },
  { key: "linkedin_url", label: "LinkedIn", category: "static", placeholder: "https://linkedin.com/company/..." },
  { key: "twitter_handle", label: "Twitter", category: "static", placeholder: "@empresa" },
  { key: "location", label: "Localização", category: "static", placeholder: "Brasil" },
  { key: "company_size", label: "Porte", category: "static", placeholder: "Médio" },

  // Core fields (24 months)
  { key: "industry", label: "Indústria", category: "core", placeholder: "Tecnologia" },
  { key: "sector", label: "Setor", category: "core", placeholder: "Software" },
  { key: "business_model", label: "Modelo de Negócio", category: "core", placeholder: "SaaS B2B", multiline: true },
  { key: "target_audience", label: "Público Alvo", category: "core", placeholder: "Empresas de médio porte", multiline: true },
  { key: "target_market", label: "Mercado Alvo", category: "core", placeholder: "Brasil e LATAM" },

  // Strategic fields (12 months)
  { key: "value_proposition", label: "Proposta de Valor", category: "strategic", placeholder: "Descreva a proposta de valor", multiline: true },
  { key: "market_share_status", label: "Status Market Share", category: "strategic", placeholder: "Challenger" },

  // Financial fields (6 months)
  { key: "revenue_estimate", label: "Receita Estimada", category: "financial", placeholder: "R$ 1-5M" },
  { key: "funding_stage", label: "Estágio de Funding", category: "financial", placeholder: "Série A" },
  { key: "employees_range", label: "Funcionários", category: "financial", placeholder: "51-200" },
];

const CATEGORY_INFO = {
  static: { label: "Estático", color: "bg-gray-100 text-gray-700", description: "Nunca expira" },
  core: { label: "Core", color: "bg-purple-100 text-purple-700", description: "Expira em 2 anos" },
  strategic: { label: "Estratégico", color: "bg-blue-100 text-blue-700", description: "Expira em 1 ano" },
  financial: { label: "Financeiro", color: "bg-amber-100 text-amber-700", description: "Expira em 6 meses" },
};

interface CompanyEditorProps {
  company: Company;
  verifiedFields?: string[];
  onSave: (fields: Record<string, string>) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export function CompanyEditor({
  company,
  verifiedFields = [],
  onSave,
  onCancel,
  isSaving = false,
}: CompanyEditorProps) {
  const [editedFields, setEditedFields] = React.useState<Record<string, string>>({});
  const [showOnlyChanged, setShowOnlyChanged] = React.useState(false);

  // Get current value for a field
  const getValue = (key: string): string => {
    if (editedFields[key] !== undefined) {
      return editedFields[key];
    }
    const value = (company as unknown as Record<string, unknown>)[key];
    if (value === null || value === undefined) return "";
    if (Array.isArray(value)) return value.join(", ");
    return String(value);
  };

  // Handle field change
  const handleChange = (key: string, value: string) => {
    const originalValue = (company as unknown as Record<string, unknown>)[key];
    const originalStr = originalValue === null || originalValue === undefined ? "" : String(originalValue);

    if (value === originalStr) {
      // Remove from edited if same as original
      const newEdited = { ...editedFields };
      delete newEdited[key];
      setEditedFields(newEdited);
    } else {
      setEditedFields({ ...editedFields, [key]: value });
    }
  };

  // Check if a field is verified
  const isVerified = (key: string): boolean => {
    return verifiedFields.includes(key);
  };

  // Check if a field has changes
  const hasChanges = (key: string): boolean => {
    return editedFields[key] !== undefined;
  };

  // Get total changes
  const changedCount = Object.keys(editedFields).length;

  // Handle save
  const handleSave = () => {
    if (changedCount === 0) return;
    onSave(editedFields);
  };

  // Group fields by category
  const groupedFields = COMPANY_FIELDS.reduce((acc, field) => {
    if (!acc[field.category]) {
      acc[field.category] = [];
    }
    acc[field.category].push(field);
    return acc;
  }, {} as Record<string, typeof COMPANY_FIELDS>);

  // Filter fields if showing only changed
  const filterFields = (fields: typeof COMPANY_FIELDS) => {
    if (!showOnlyChanged) return fields;
    return fields.filter((f) => hasChanges(f.key));
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between sticky top-0 bg-surface-paper z-10 py-2">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-lg">Editar Empresa</h3>
          {changedCount > 0 && (
            <Badge variant="outline" className="bg-amber-100 text-amber-700">
              {changedCount} campo(s) alterado(s)
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {changedCount > 0 && (
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyChanged}
                onChange={(e) => setShowOnlyChanged(e.target.checked)}
                className="rounded"
              />
              Mostrar apenas alterados
            </label>
          )}
          <Button variant="ghost" onClick={onCancel} disabled={isSaving}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={changedCount === 0 || isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Salvando..." : `Salvar ${changedCount > 0 ? `(${changedCount})` : ""}`}
          </Button>
        </div>
      </div>

      {/* Info about auto-verification */}
      <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <strong>Auto-verificação:</strong> Campos editados serão automaticamente marcados como verificados,
          protegendo-os de serem sobrescritos por futuros enriquecimentos. A verificação expira baseada na
          categoria do campo.
        </div>
      </div>

      {/* Field categories */}
      {Object.entries(groupedFields).map(([category, fields]) => {
        const filteredFields = filterFields(fields);
        if (filteredFields.length === 0) return null;

        const categoryInfo = CATEGORY_INFO[category as keyof typeof CATEGORY_INFO];

        return (
          <Card key={category}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">{categoryInfo.label}</CardTitle>
                <Badge variant="outline" className={categoryInfo.color}>
                  {categoryInfo.description}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredFields.map((field) => (
                  <div key={field.key} className={field.multiline ? "md:col-span-2" : ""}>
                    <div className="flex items-center gap-2 mb-1">
                      <label htmlFor={field.key} className="text-sm font-medium">
                        {field.label}
                      </label>
                      {isVerified(field.key) && (
                        <span title="Campo verificado"><CheckCircle className="w-3 h-3 text-green-600" /></span>
                      )}
                      {hasChanges(field.key) && (
                        <Badge variant="outline" className="text-[10px] px-1 py-0 bg-amber-50 text-amber-700">
                          alterado
                        </Badge>
                      )}
                    </div>
                    {field.multiline ? (
                      <Textarea
                        id={field.key}
                        value={getValue(field.key)}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className={`min-h-[80px] ${hasChanges(field.key) ? "border-amber-400 bg-amber-50/50" : ""}`}
                      />
                    ) : (
                      <Input
                        id={field.key}
                        value={getValue(field.key)}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className={hasChanges(field.key) ? "border-amber-400 bg-amber-50/50" : ""}
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Bottom save bar for long forms */}
      {changedCount > 0 && (
        <div className="sticky bottom-0 bg-surface-paper py-4 border-t border-line flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Salvando..." : `Salvar ${changedCount} alteração(ões)`}
          </Button>
        </div>
      )}
    </div>
  );
}
