"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, FileJson } from "lucide-react";

interface FrameworkOutputProps {
  frameworkCode: string;
  output: Record<string, unknown>;
}

export function FrameworkOutput({ frameworkCode, output }: FrameworkOutputProps) {
  const [showRaw, setShowRaw] = useState(false);

  // Render different visualizations based on framework type
  const renderOutput = () => {
    switch (frameworkCode) {
      case "challenge_refinement":
        return <ChallengeRefinementOutput data={output} />;
      case "pestel":
        return <PESTELOutput data={output} />;
      case "swot":
        return <SWOTOutput data={output} />;
      default:
        return <GenericOutput data={output} />;
    }
  };

  return (
    <div className="bg-surface-paper border border-line p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-navy-900">Resultado da Análise</h3>
        <button
          onClick={() => setShowRaw(!showRaw)}
          className="text-sm text-text-secondary hover:text-navy-600 flex items-center gap-1"
        >
          <FileJson className="w-4 h-4" />
          {showRaw ? "Ver formatado" : "Ver JSON"}
        </button>
      </div>

      {showRaw ? (
        <pre className="bg-gray-50 p-4 rounded text-xs overflow-x-auto">
          {JSON.stringify(output, null, 2)}
        </pre>
      ) : (
        renderOutput()
      )}
    </div>
  );
}

// Challenge Refinement specific output
function ChallengeRefinementOutput({ data }: { data: Record<string, unknown> }) {
  const analysis = data.challenge_analysis as Record<string, unknown> | undefined;
  const measurement = data.measurement as Record<string, unknown> | undefined;
  const timeline = data.timeline as Record<string, unknown> | undefined;
  const financial = data.financial_impact as Record<string, unknown> | undefined;

  return (
    <div className="space-y-6">
      {analysis && (
        <Section title="Análise do Desafio">
          <div className="space-y-3">
            <InfoRow label="Desafio Declarado" value={String(analysis.declared_challenge || '')} />
            <InfoRow
              label="É Problema Real?"
              value={analysis.is_real_problem ? "Sim" : "Não (pode ser sintoma)"}
              highlight={!analysis.is_real_problem}
            />
            <InfoRow label="Diagnóstico" value={String(analysis.diagnosis || '')} />
            {analysis.root_cause_hypothesis ? (
              <InfoRow label="Hipótese de Causa Raiz" value={String(analysis.root_cause_hypothesis)} />
            ) : null}
            <InfoRow label="Desafio Refinado" value={String(analysis.refined_challenge || '')} highlight />
          </div>
        </Section>
      )}

      {measurement && (
        <Section title="Mensuração">
          <div className="grid grid-cols-2 gap-4">
            <InfoRow label="Métrica Principal" value={String(measurement.primary_metric || '')} />
            <InfoRow label="Valor Atual" value={String(measurement.current_value || '')} />
            <InfoRow label="Meta" value={String(measurement.target_value || '')} />
            <InfoRow label="Como Medir" value={String(measurement.measurement_method || '')} />
          </div>
        </Section>
      )}

      {timeline && (
        <Section title="Timeline">
          <div className="grid grid-cols-2 gap-4">
            <InfoRow label="Urgência" value={String(timeline.urgency_level || '')} />
            <InfoRow label="Horizonte" value={String(timeline.recommended_horizon || '')} />
          </div>
          {timeline.key_milestones && Array.isArray(timeline.key_milestones) ? (
            <div className="mt-2">
              <span className="text-sm font-medium text-text-secondary">Marcos:</span>
              <ul className="list-disc list-inside ml-2 text-sm">
                {timeline.key_milestones.map((m, i) => (
                  <li key={i}>{String(m)}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </Section>
      )}

      {financial && (
        <Section title="Impacto Financeiro">
          <div className="space-y-2">
            <InfoRow label="Custo da Inação" value={String(financial.cost_of_inaction || '')} />
            <InfoRow label="Potencial de Ganho" value={String(financial.potential_upside || '')} />
            <InfoRow label="Investimento Estimado" value={String(financial.investment_estimate || '')} />
          </div>
        </Section>
      )}

      {data.summary ? (
        <div className="bg-navy-50 p-4 rounded border-l-4 border-navy-600">
          <p className="text-sm font-medium text-navy-900">{String(data.summary)}</p>
        </div>
      ) : null}
    </div>
  );
}

// PESTEL specific output
function PESTELOutput({ data }: { data: Record<string, unknown> }) {
  const dimensions = ["political", "economic", "social", "technological", "environmental", "legal"];
  const labels: Record<string, string> = {
    political: "Político",
    economic: "Econômico",
    social: "Social",
    technological: "Tecnológico",
    environmental: "Ambiental",
    legal: "Legal",
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {dimensions.map((dim) => {
          const factors = data[dim] as string[] | undefined;
          return (
            <div key={dim} className="bg-gray-50 p-4 rounded">
              <h4 className="font-medium text-navy-900 mb-2">{labels[dim]}</h4>
              {factors && factors.length > 0 ? (
                <ul className="text-sm space-y-1">
                  {factors.map((f, i) => (
                    <li key={i} className="text-text-secondary">
                      • {f}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">Sem dados</p>
              )}
            </div>
          );
        })}
      </div>
      {data.summary ? (
        <div className="bg-navy-50 p-4 rounded border-l-4 border-navy-600">
          <p className="text-sm">{String(data.summary)}</p>
        </div>
      ) : null}
    </div>
  );
}

// SWOT specific output
function SWOTOutput({ data }: { data: Record<string, unknown> }) {
  const quadrants = [
    { key: "strengths", label: "Forças", color: "bg-green-50 border-green-200" },
    { key: "weaknesses", label: "Fraquezas", color: "bg-red-50 border-red-200" },
    { key: "opportunities", label: "Oportunidades", color: "bg-blue-50 border-blue-200" },
    { key: "threats", label: "Ameaças", color: "bg-orange-50 border-orange-200" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {quadrants.map(({ key, label, color }) => {
        const items = data[key] as string[] | undefined;
        return (
          <div key={key} className={`p-4 rounded border ${color}`}>
            <h4 className="font-medium mb-2">{label}</h4>
            {items && items.length > 0 ? (
              <ul className="text-sm space-y-1">
                {items.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">Sem dados</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Generic output for other frameworks
function GenericOutput({ data }: { data: Record<string, unknown> }) {
  const renderValue = (value: unknown): React.ReactNode => {
    if (value === null || value === undefined) return <span className="text-gray-400">-</span>;
    if (typeof value === "boolean") return value ? "Sim" : "Não";
    if (typeof value === "string" || typeof value === "number") return String(value);
    if (Array.isArray(value)) {
      return (
        <ul className="list-disc list-inside">
          {value.map((item, i) => (
            <li key={i} className="text-sm">
              {typeof item === "object" ? JSON.stringify(item) : String(item)}
            </li>
          ))}
        </ul>
      );
    }
    if (typeof value === "object") {
      return (
        <div className="pl-4 border-l-2 border-gray-200 space-y-1">
          {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
            <div key={k}>
              <span className="text-sm font-medium text-text-secondary">{k}: </span>
              {renderValue(v)}
            </div>
          ))}
        </div>
      );
    }
    return String(value);
  };

  return (
    <div className="space-y-4">
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <h4 className="font-medium text-navy-900 capitalize mb-1">
            {key.replace(/_/g, " ")}
          </h4>
          <div className="text-sm text-text-secondary">{renderValue(value)}</div>
        </div>
      ))}
    </div>
  );
}

// Helper components
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-line rounded">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100"
      >
        <span className="font-medium text-navy-900">{title}</span>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {open && <div className="p-4">{children}</div>}
    </div>
  );
}

function InfoRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value?: string;
  highlight?: boolean;
}) {
  if (!value) return null;
  return (
    <div className={`${highlight ? "bg-gold-50 p-2 rounded" : ""}`}>
      <span className="text-sm font-medium text-text-secondary">{label}: </span>
      <span className={`text-sm ${highlight ? "text-navy-900 font-medium" : ""}`}>{value}</span>
    </div>
  );
}
