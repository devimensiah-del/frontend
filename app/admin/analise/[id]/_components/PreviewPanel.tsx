"use client";

interface AnalysisData {
  submissionId: string;
  companyName: string;
  lastUpdated: string;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  pestel: {
    political: string[];
    economic: string[];
    social: string[];
    technological: string[];
    environmental: string[];
    legal: string[];
  };
  porter: {
    competitiveRivalry: {
      intensity: string;
      factors: string[];
    };
    threatOfNewEntrants: {
      intensity: string;
      factors: string[];
    };
    bargainingPowerOfSuppliers: {
      intensity: string;
      factors: string[];
    };
    bargainingPowerOfBuyers: {
      intensity: string;
      factors: string[];
    };
    threatOfSubstitutes: {
      intensity: string;
      factors: string[];
    };
  };
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
            <PreviewSection
              title="Forças"
              items={analysis.swot.strengths}
              color="green"
            />
            <PreviewSection
              title="Fraquezas"
              items={analysis.swot.weaknesses}
              color="red"
            />
            <PreviewSection
              title="Oportunidades"
              items={analysis.swot.opportunities}
              color="blue"
            />
            <PreviewSection
              title="Ameaças"
              items={analysis.swot.threats}
              color="orange"
            />
          </div>
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
        </section>

        {/* Porter's Five Forces */}
        <section>
          <h3 className="font-heading text-xl font-medium mb-4 text-[var(--navy-900)]">
            5 Forças de Porter
          </h3>
          <div className="space-y-4">
            <div className="border border-[var(--line-color)] p-4">
              <h4 className="font-medium mb-2">Rivalidade Competitiva</h4>
              <p className="text-sm text-[var(--text-secondary)] mb-3">
                Intensidade: {analysis.porter.competitiveRivalry.intensity}
              </p>
              <ul className="list-disc list-inside text-sm space-y-1">
                {analysis.porter.competitiveRivalry.factors.map((factor, i) => (
                  <li key={i}>{factor}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

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
