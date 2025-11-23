"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select, SelectOption } from "@/components/ui/Select";
import type { Enrichment } from "@/types";

/* ============================================
   ENRICHMENT FORM - Editable Enrichment Fields
   ============================================ */

interface EnrichmentFormProps {
  enrichment: Enrichment | null;
  onChange: (data: Partial<Record<string, any>>) => void;
  disabled?: boolean;
}

export function EnrichmentForm({
  enrichment,
  onChange,
  disabled = false,
}: EnrichmentFormProps) {
  // Helper to map backend nested structure to flat form data
  const mapBackendDataToForm = (data: any) => {
    if (!data) return {};

    // If data is already flat (legacy or edited), return it
    if (data.companyDescription || data.foundedYear) return data;

    // Map nested structure to flat form fields
    return {
      // Profile
      companyDescription: data.profile_overview?.legal_name || "", // Fallback as description isn't explicit
      foundedYear: data.profile_overview?.foundation_year || "",
      headquarters: data.profile_overview?.headquarters || "",
      websiteUrl: data.profile_overview?.website || "",

      // Financials
      employeeCount: data.financials?.employees_range || "",
      revenueEstimate: data.financials?.revenue_estimate || "",

      // Market Position
      industry: data.market_position?.sector || "",
      targetSegment: data.market_position?.target_audience || "",
      keyDifferentiator: data.market_position?.value_proposition || "",

      // Strategic Assessment
      digitalMaturityScore: data.strategic_assessment?.digital_maturity || 5,
      keyWeaknesses: Array.isArray(data.strategic_assessment?.weaknesses)
        ? data.strategic_assessment.weaknesses.join("\n")
        : (data.strategic_assessment?.weaknesses || ""),

      // Competitive Landscape
      competitors: Array.isArray(data.competitive_landscape?.competitors)
        ? data.competitive_landscape.competitors.join(", ")
        : (data.competitive_landscape?.competitors || ""),

      // Preserve other fields if they exist
      ...data
    };
  };

  const [formData, setFormData] = useState<Record<string, any>>(
    mapBackendDataToForm((enrichment as any)?.data)
  );

  useEffect(() => {
    if ((enrichment as any)?.data) {
      setFormData(mapBackendDataToForm((enrichment as any).data));
    }
  }, [enrichment]);

  const handleChange = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange(newData);
  };

  return (
    <div className="space-y-6">
      {/* Company Overview Section */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Visão Geral da Empresa</CardTitle>
          <p className="text-sm text-text-secondary mt-1">
            Informações básicas sobre a empresa
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField label="Descrição da Empresa">
            <Textarea
              value={(formData as any).companyDescription || ""}
              onChange={(e) =>
                handleChange("companyDescription", e.target.value)
              }
              placeholder="Descreva a empresa, sua missão, visão e valores..."
              rows={4}
              disabled={disabled}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Ano de Fundação">
              <Input
                type="number"
                value={(formData as any).foundedYear || ""}
                onChange={(e) => handleChange("foundedYear", e.target.value)}
                placeholder="ex: 2020"
                disabled={disabled}
              />
            </FormField>

            <FormField label="Localização da Sede">
              <Input
                type="text"
                value={(formData as any).headquarters || ""}
                onChange={(e) => handleChange("headquarters", e.target.value)}
                placeholder="ex: São Paulo, SP"
                disabled={disabled}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Número de Funcionários">
              <Input
                type="text"
                value={(formData as any).employeeCount || ""}
                onChange={(e) => handleChange("employeeCount", e.target.value)}
                placeholder="ex: 50-100"
                disabled={disabled}
              />
            </FormField>

            <FormField label="Estimativa de Receita">
              <Input
                type="text"
                value={(formData as any).revenueEstimate || ""}
                onChange={(e) =>
                  handleChange("revenueEstimate", e.target.value)
                }
                placeholder="ex: R$ 5M-10M/ano"
                disabled={disabled}
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Strategic Inference Section */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Inferência Estratégica</CardTitle>
          <p className="text-sm text-text-secondary mt-1">
            Análise estratégica e posicionamento
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField label="Arquétipo de Valor">
            <Select
              value={(formData as any).valueArchetype || ""}
              onChange={(e) => handleChange("valueArchetype", e.target.value)}
              disabled={disabled}
            >
              <SelectOption value="">Selecione o arquétipo</SelectOption>
              <SelectOption value="innovation">Inovação</SelectOption>
              <SelectOption value="quality">Qualidade</SelectOption>
              <SelectOption value="cost">Custo</SelectOption>
              <SelectOption value="service">Serviço</SelectOption>
            </Select>
          </FormField>

          <FormField label="Segmento Alvo">
            <Textarea
              value={(formData as any).targetSegment || ""}
              onChange={(e) => handleChange("targetSegment", e.target.value)}
              placeholder="Descreva o público-alvo e segmentos de mercado..."
              rows={3}
              disabled={disabled}
            />
          </FormField>

          <FormField label="Tom de Marca">
            <Input
              type="text"
              value={(formData as any).brandTone || ""}
              onChange={(e) => handleChange("brandTone", e.target.value)}
              placeholder="ex: Profissional, Amigável, Inovador"
              disabled={disabled}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Score de Maturidade Digital (1-10)">
              <div className="space-y-2">
                <Input
                  type="range"
                  min="1"
                  max="10"
                  value={(formData as any).digitalMaturityScore || 5}
                  onChange={(e) =>
                    handleChange("digitalMaturityScore", e.target.value)
                  }
                  disabled={disabled}
                  className="w-full"
                />
                <div className="text-center text-sm font-medium text-navy-900">
                  {(formData as any).digitalMaturityScore || 5}
                </div>
              </div>
            </FormField>

            <FormField label="Principais Fraquezas">
              <Textarea
                value={(formData as any).keyWeaknesses || ""}
                onChange={(e) => handleChange("keyWeaknesses", e.target.value)}
                placeholder="Liste as principais fraquezas identificadas..."
                rows={3}
                disabled={disabled}
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Market Position Section */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Posição de Mercado</CardTitle>
          <p className="text-sm text-text-secondary mt-1">
            Contexto competitivo e indústria
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField label="Indústria">
            <Input
              type="text"
              value={(formData as any).industry || ""}
              onChange={(e) => handleChange("industry", e.target.value)}
              placeholder="ex: Tecnologia, Varejo, Serviços Financeiros"
              disabled={disabled}
            />
          </FormField>

          <FormField label="Principais Concorrentes">
            <Textarea
              value={(formData as any).competitors || ""}
              onChange={(e) => handleChange("competitors", e.target.value)}
              placeholder="Liste os principais concorrentes (separados por vírgula)..."
              rows={3}
              disabled={disabled}
            />
          </FormField>

          <FormField label="Diferencial-Chave">
            <Textarea
              value={(formData as any).keyDifferentiator || ""}
              onChange={(e) =>
                handleChange("keyDifferentiator", e.target.value)
              }
              placeholder="Descreva o principal diferencial competitivo..."
              rows={3}
              disabled={disabled}
            />
          </FormField>
        </CardContent>
      </Card>

      {/* Digital Presence Section */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Presença Digital</CardTitle>
          <p className="text-sm text-text-secondary mt-1">
            Canais online e atividades recentes
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField label="Site">
            <Input
              type="url"
              value={(formData as any).websiteUrl || ""}
              onChange={(e) => handleChange("websiteUrl", e.target.value)}
              placeholder="https://exemplo.com"
              disabled={disabled}
            />
          </FormField>

          <FormField label="LinkedIn">
            <Input
              type="url"
              value={(formData as any).linkedinUrl || ""}
              onChange={(e) => handleChange("linkedinUrl", e.target.value)}
              placeholder="https://linkedin.com/company/exemplo"
              disabled={disabled}
            />
          </FormField>

          <FormField label="Notícias Recentes">
            <Textarea
              value={(formData as any).recentNews || ""}
              onChange={(e) => handleChange("recentNews", e.target.value)}
              placeholder="Liste notícias, lançamentos ou eventos recentes..."
              rows={4}
              disabled={disabled}
            />
          </FormField>
        </CardContent>
      </Card>
    </div>
  );
}

/* ============================================
   FORM FIELD COMPONENT
   ============================================ */

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}

function FormField({ label, children, required = false }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-wider font-medium text-text-secondary">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
