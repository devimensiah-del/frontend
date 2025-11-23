"use client";

import { useState } from "react";

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

interface EditorPanelProps {
  analysis: AnalysisData;
  onAnalysisChange: (analysis: AnalysisData) => void;
}

type Framework = "swot" | "pestel" | "porter";

export function EditorPanel({ analysis, onAnalysisChange }: EditorPanelProps) {
  const [activeFramework, setActiveFramework] = useState<Framework>("swot");

  const handleSwotChange = (category: keyof typeof analysis.swot, value: string[]) => {
    const updated = {
      ...analysis,
      swot: {
        ...analysis.swot,
        [category]: value,
      },
    };
    onAnalysisChange(updated);
  };

  const handlePestelChange = (category: keyof typeof analysis.pestel, value: string[]) => {
    const updated = {
      ...analysis,
      pestel: {
        ...analysis.pestel,
        [category]: value,
      },
    };
    onAnalysisChange(updated);
  };

  return (
    <div className="h-full flex flex-col bg-white border border-[var(--line-color)]">
      {/* Framework Tabs */}
      <div className="flex border-b border-[var(--line-color)]">
        <button
          onClick={() => setActiveFramework("swot")}
          className={`px-6 py-3 font-heading text-xs uppercase tracking-widest font-medium transition-colors ${
            activeFramework === "swot"
              ? "bg-[var(--navy-900)] text-white"
              : "bg-white text-[var(--text-secondary)] hover:bg-[var(--surface-paper)]"
          }`}
        >
          SWOT
        </button>
        <button
          onClick={() => setActiveFramework("pestel")}
          className={`px-6 py-3 font-heading text-xs uppercase tracking-widest font-medium transition-colors ${
            activeFramework === "pestel"
              ? "bg-[var(--navy-900)] text-white"
              : "bg-white text-[var(--text-secondary)] hover:bg-[var(--surface-paper)]"
          }`}
        >
          PESTEL
        </button>
        <button
          onClick={() => setActiveFramework("porter")}
          className={`px-6 py-3 font-heading text-xs uppercase tracking-widest font-medium transition-colors ${
            activeFramework === "porter"
              ? "bg-[var(--navy-900)] text-white"
              : "bg-white text-[var(--text-secondary)] hover:bg-[var(--surface-paper)]"
          }`}
        >
          Porter
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeFramework === "swot" && (
          <div className="space-y-6">
            <SectionEditor
              title="Forças (Strengths)"
              items={analysis.swot.strengths}
              onChange={(items) => handleSwotChange("strengths", items)}
              color="green"
            />
            <SectionEditor
              title="Fraquezas (Weaknesses)"
              items={analysis.swot.weaknesses}
              onChange={(items) => handleSwotChange("weaknesses", items)}
              color="red"
            />
            <SectionEditor
              title="Oportunidades (Opportunities)"
              items={analysis.swot.opportunities}
              onChange={(items) => handleSwotChange("opportunities", items)}
              color="blue"
            />
            <SectionEditor
              title="Ameaças (Threats)"
              items={analysis.swot.threats}
              onChange={(items) => handleSwotChange("threats", items)}
              color="orange"
            />
          </div>
        )}

        {activeFramework === "pestel" && (
          <div className="space-y-6">
            <SectionEditor
              title="Político (Political)"
              items={analysis.pestel.political}
              onChange={(items) => handlePestelChange("political", items)}
            />
            <SectionEditor
              title="Econômico (Economic)"
              items={analysis.pestel.economic}
              onChange={(items) => handlePestelChange("economic", items)}
            />
            <SectionEditor
              title="Social"
              items={analysis.pestel.social}
              onChange={(items) => handlePestelChange("social", items)}
            />
            <SectionEditor
              title="Tecnológico (Technological)"
              items={analysis.pestel.technological}
              onChange={(items) => handlePestelChange("technological", items)}
            />
            <SectionEditor
              title="Ambiental (Environmental)"
              items={analysis.pestel.environmental}
              onChange={(items) => handlePestelChange("environmental", items)}
            />
            <SectionEditor
              title="Legal"
              items={analysis.pestel.legal}
              onChange={(items) => handlePestelChange("legal", items)}
            />
          </div>
        )}

        {activeFramework === "porter" && (
          <div className="space-y-6">
            <div className="bg-[var(--surface-paper)] p-4 rounded">
              <h3 className="font-heading font-medium mb-2">
                Rivalidade Competitiva
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Intensidade: {analysis.porter.competitiveRivalry.intensity || "Média"}
              </p>
              <SectionEditor
                title="Fatores"
                items={analysis.porter.competitiveRivalry.factors}
                onChange={(items) => {}}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface SectionEditorProps {
  title: string;
  items: string[];
  onChange: (items: string[]) => void;
  color?: "green" | "red" | "blue" | "orange";
}

function SectionEditor({ title, items, onChange, color }: SectionEditorProps) {
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    if (newItem.trim()) {
      onChange([...items, newItem.trim()]);
      setNewItem("");
    }
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, value: string) => {
    const updated = [...items];
    updated[index] = value;
    onChange(updated);
  };

  const colorClasses = {
    green: "border-green-500 bg-green-50",
    red: "border-red-500 bg-red-50",
    blue: "border-blue-500 bg-blue-50",
    orange: "border-orange-500 bg-orange-50",
  };

  return (
    <div className={`border-l-4 pl-4 ${color ? colorClasses[color] : "border-[var(--navy-900)]"}`}>
      <h3 className="font-heading font-medium mb-3">{title}</h3>
      <div className="space-y-2 mb-3">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <textarea
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              className="flex-1 px-3 py-2 border border-[var(--line-color)] rounded text-sm resize-none"
              rows={2}
            />
            <button
              onClick={() => removeItem(index)}
              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addItem()}
          placeholder="Adicionar novo item..."
          className="flex-1 px-3 py-2 border border-[var(--line-color)] rounded text-sm"
        />
        <button
          onClick={addItem}
          className="px-4 py-2 bg-[var(--navy-900)] text-white rounded text-sm hover:bg-[var(--navy-800)]"
        >
          +
        </button>
      </div>
    </div>
  );
}
