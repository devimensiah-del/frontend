"use client";

// Backend data structures (from types/index.ts)
interface SWOTItem {
  content: string;
  confidence: string;  // "Alta" | "Média" | "Baixa"
  source: string;
}

interface PorterForce {
  force: string;
  intensity: string;
  description: string;
}

interface AnalysisData {
  submissionId: string;
  companyName: string;
  lastUpdated: string;
  swot: {
    strengths: SWOTItem[] | string[];  // Support both new and legacy formats
    weaknesses: SWOTItem[] | string[];
    opportunities: SWOTItem[] | string[];
    threats: SWOTItem[] | string[];
    summary?: string;
  };
  pestel: {
    political: string[];
    economic: string[];
    social: string[];
    technological: string[];
    environmental: string[];
    legal: string[];
    summary?: string;
  };
  porter: {
    forces?: PorterForce[];
    summary?: string;
    overallAttractiveness?: string;
    // Legacy format (backward compatibility)
    competitiveRivalry?: {
      intensity: string;
      factors: string[];
    };
    threatOfNewEntrants?: {
      intensity: string;
      factors: string[];
    };
    bargainingPowerOfSuppliers?: {
      intensity: string;
      factors: string[];
    };
    bargainingPowerOfBuyers?: {
      intensity: string;
      factors: string[];
    };
    threatOfSubstitutes?: {
      intensity: string;
      factors: string[];
    };
  };
}

// Helper to check if item is SWOTItem object
function isSWOTItem(item: any): item is SWOTItem {
  return item && typeof item === 'object' && 'content' in item;
}

interface PreviewPanelProps {
  analysis: AnalysisData;
}

export function PreviewPanel({ analysis }: PreviewPanelProps) {
  return (
    <div className="h-full flex flex-col bg-white border border-[var(--line-color)] overflow-y-auto">
      <div className="border-b border-[var(--line-color)] px-6 py-4 bg-[var(--navy-900)]">
        <h2 className="font-heading text-lg font-medium text-white">
          Preview do Relatório
        </h2>
        <p className="text-sm text-gray-300 mt-1">{analysis.companyName}</p>
      </div>

      <div className="flex-1 p-6 space-y-8">
        {/* SWOT Analysis */}
        <section>
          <h3 className="font-heading text-xl font-medium mb-4 text-[var(--navy-900)]">
            Análise SWOT
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <SWOTSection
              title="Forças"
              items={analysis.swot.strengths}
              color="green"
            />
            <SWOTSection
              title="Fraquezas"
              items={analysis.swot.weaknesses}
              color="red"
            />
            <SWOTSection
              title="Oportunidades"
              items={analysis.swot.opportunities}
              color="blue"
            />
            <SWOTSection
              title="Ameaças"
              items={analysis.swot.threats}
              color="orange"
            />
          </div>
          {analysis.swot.summary && (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200">
              <p className="text-sm"><strong>Resumo:</strong> {analysis.swot.summary}</p>
            </div>
          )}
        </section>

        {/* PESTEL Analysis */}
        <section>
          <h3 className="font-heading text-xl font-medium mb-4 text-[var(--navy-900)]">
            Análise PESTEL
          </h3>
          <div className="space-y-4">
            <PreviewSection
              title="Político"
              items={analysis.pestel.political}
            />
            <PreviewSection
              title="Econômico"
              items={analysis.pestel.economic}
            />
            <PreviewSection title="Social" items={analysis.pestel.social} />
            <PreviewSection
              title="Tecnológico"
              items={analysis.pestel.technological}
            />
            <PreviewSection
              title="Ambiental"
              items={analysis.pestel.environmental}
            />
            <PreviewSection title="Legal" items={analysis.pestel.legal} />
          </div>
          {analysis.pestel.summary && (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200">
              <p className="text-sm"><strong>Resumo:</strong> {analysis.pestel.summary}</p>
            </div>
          )}
        </section>

        {/* Porter's Five Forces */}
        <section>
          <h3 className="font-heading text-xl font-medium mb-4 text-[var(--navy-900)]">
            Forças de Porter
          </h3>
          <div className="space-y-4">
            {/* NEW FORMAT: forces array */}
            {analysis.porter.forces && analysis.porter.forces.length > 0 ? (
              analysis.porter.forces.map((force, index) => (
                <div key={index} className="border border-[var(--line-color)] p-4">
                  <h4 className="font-medium mb-2">{force.force}</h4>
                  <p className="text-sm text-[var(--text-secondary)] mb-3">
                    Intensidade: {force.intensity}
                  </p>
                  <p className="text-sm">{force.description}</p>
                </div>
              ))
            ) : (
              /* LEGACY FORMAT: individual force objects */
              <>
                {analysis.porter.competitiveRivalry && (
                  <div className="border border-[var(--line-color)] p-4">
                    <h4 className="font-medium mb-2">Rivalidade Competitiva</h4>
                    <p className="text-sm text-[var(--text-secondary)] mb-3">
                      Intensidade: {analysis.porter.competitiveRivalry.intensity}
                    </p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {analysis.porter.competitiveRivalry.factors?.map((factor, i) => (
                        <li key={i}>{factor}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Other forces... (only shown if legacy format exists) */}
              </>
            )}
            {analysis.porter.summary && (
              <div className="border-t border-[var(--line-color)] pt-4 mt-4">
                <p className="text-sm text-[var(--text-secondary)]">
                  <strong>Resumo:</strong> {analysis.porter.summary}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

// SWOT Section - handles both SWOTItem objects and string arrays
interface SWOTSectionProps {
  title: string;
  items: SWOTItem[] | string[];
  color?: "green" | "red" | "blue" | "orange";
}

function SWOTSection({ title, items, color }: SWOTSectionProps) {
  const colorClasses = {
    green: "border-green-500 bg-green-50",
    red: "border-red-500 bg-red-50",
    blue: "border-blue-500 bg-blue-50",
    orange: "border-orange-500 bg-orange-50",
  };

  return (
    <div
      className={`border-l-4 p-4 ${
        color ? colorClasses[color] : "border-[var(--navy-900)] bg-[var(--surface-paper)]"
      }`}
    >
      <h4 className="font-heading font-medium mb-2">{title}</h4>
      {items.length === 0 ? (
        <p className="text-sm text-[var(--text-secondary)] italic">
          Nenhum item adicionado
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => {
            // Check if item is SWOTItem object with confidence/source
            if (isSWOTItem(item)) {
              return (
                <li key={index} className="text-sm">
                  <div className="font-medium">{item.content}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    <span className="font-semibold">Confiança:</span> {item.confidence} |
                    <span className="font-semibold ml-2">Fonte:</span> {item.source}
                  </div>
                </li>
              );
            }
            // Legacy format: simple string
            return (
              <li key={index} className="text-sm list-disc list-inside">
                {item}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// Regular Preview Section - for simple string arrays
interface PreviewSectionProps {
  title: string;
  items: string[];
  color?: "green" | "red" | "blue" | "orange";
}

function PreviewSection({ title, items, color }: PreviewSectionProps) {
  const colorClasses = {
    green: "border-green-500 bg-green-50",
    red: "border-red-500 bg-red-50",
    blue: "border-blue-500 bg-blue-50",
    orange: "border-orange-500 bg-orange-50",
  };

  return (
    <div
      className={`border-l-4 p-4 ${
        color ? colorClasses[color] : "border-[var(--navy-900)] bg-[var(--surface-paper)]"
      }`}
    >
      <h4 className="font-heading font-medium mb-2">{title}</h4>
      {items.length === 0 ? (
        <p className="text-sm text-[var(--text-secondary)] italic">
          Nenhum item adicionado
        </p>
      ) : (
        <ul className="list-disc list-inside text-sm space-y-1">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
