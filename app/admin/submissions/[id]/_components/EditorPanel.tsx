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

type EditorTab = "swot" | "pestel" | "porter";

export function EditorPanel({ analysis, onAnalysisChange }: EditorPanelProps) {
  const [activeTab, setActiveTab] = useState<EditorTab>("swot");

  const handleArrayChange = (
    category: keyof AnalysisData,
    field: string,
    value: string
  ) => {
    const items = value
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    onAnalysisChange({
      ...analysis,
      [category]: {
        ...(analysis[category] as Record<string, any>),
        [field]: items,
      },
    });
  };

  const handlePorterChange = (
    force: string,
    field: "intensity" | "factors",
    value: string
  ) => {
    const porter = analysis.porter as any;
    const currentForce = porter[force];

    if (field === "intensity") {
      onAnalysisChange({
        ...analysis,
        porter: {
          ...analysis.porter,
          [force]: {
            ...currentForce,
            intensity: value,
          },
        },
      });
    } else {
      const factors = value
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      onAnalysisChange({
        ...analysis,
        porter: {
          ...analysis.porter,
          [force]: {
            ...currentForce,
            factors,
          },
        },
      });
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border border-[var(--line-color)] overflow-hidden">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--line-color)] bg-[var(--surface-paper)]">
        <button
          onClick={() => setActiveTab("swot")}
          className={`
            px-6 py-3 font-heading text-xs uppercase tracking-widest font-medium
            transition-all duration-200
            ${
              activeTab === "swot"
                ? "bg-white text-[var(--navy-900)] border-b-2 border-[var(--navy-900)]"
                : "bg-transparent text-[var(--text-secondary)] hover:bg-white"
            }
          `}
        >
          SWOT
        </button>
        <button
          onClick={() => setActiveTab("pestel")}
          className={`
            px-6 py-3 font-heading text-xs uppercase tracking-widest font-medium
            transition-all duration-200
            ${
              activeTab === "pestel"
                ? "bg-white text-[var(--navy-900)] border-b-2 border-[var(--navy-900)]"
                : "bg-transparent text-[var(--text-secondary)] hover:bg-white"
            }
          `}
        >
          PESTEL
        </button>
        <button
          onClick={() => setActiveTab("porter")}
          className={`
            px-6 py-3 font-heading text-xs uppercase tracking-widest font-medium
            transition-all duration-200
            ${
              activeTab === "porter"
                ? "bg-white text-[var(--navy-900)] border-b-2 border-[var(--navy-900)]"
                : "bg-transparent text-[var(--text-secondary)] hover:bg-white"
            }
          `}
        >
          Porter's 5 Forces
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "swot" && (
          <div className="space-y-6">
            {/* Strengths */}
            <div>
              <label className="label-editorial block mb-2">Strengths</label>
              <textarea
                value={analysis.swot.strengths.join("\n")}
                onChange={(e) =>
                  handleArrayChange("swot", "strengths", e.target.value)
                }
                className="input-editorial min-h-[120px] font-body text-sm leading-relaxed resize-none"
                placeholder="Enter each strength on a new line..."
              />
            </div>

            {/* Weaknesses */}
            <div>
              <label className="label-editorial block mb-2">Weaknesses</label>
              <textarea
                value={analysis.swot.weaknesses.join("\n")}
                onChange={(e) =>
                  handleArrayChange("swot", "weaknesses", e.target.value)
                }
                className="input-editorial min-h-[120px] font-body text-sm leading-relaxed resize-none"
                placeholder="Enter each weakness on a new line..."
              />
            </div>

            {/* Opportunities */}
            <div>
              <label className="label-editorial block mb-2">
                Opportunities
              </label>
              <textarea
                value={analysis.swot.opportunities.join("\n")}
                onChange={(e) =>
                  handleArrayChange("swot", "opportunities", e.target.value)
                }
                className="input-editorial min-h-[120px] font-body text-sm leading-relaxed resize-none"
                placeholder="Enter each opportunity on a new line..."
              />
            </div>

            {/* Threats */}
            <div>
              <label className="label-editorial block mb-2">Threats</label>
              <textarea
                value={analysis.swot.threats.join("\n")}
                onChange={(e) =>
                  handleArrayChange("swot", "threats", e.target.value)
                }
                className="input-editorial min-h-[120px] font-body text-sm leading-relaxed resize-none"
                placeholder="Enter each threat on a new line..."
              />
            </div>
          </div>
        )}

        {activeTab === "pestel" && (
          <div className="space-y-6">
            {/* Political */}
            <div>
              <label className="label-editorial block mb-2">Political</label>
              <textarea
                value={analysis.pestel.political.join("\n")}
                onChange={(e) =>
                  handleArrayChange("pestel", "political", e.target.value)
                }
                className="input-editorial min-h-[100px] font-body text-sm leading-relaxed resize-none"
                placeholder="Enter each political factor on a new line..."
              />
            </div>

            {/* Economic */}
            <div>
              <label className="label-editorial block mb-2">Economic</label>
              <textarea
                value={analysis.pestel.economic.join("\n")}
                onChange={(e) =>
                  handleArrayChange("pestel", "economic", e.target.value)
                }
                className="input-editorial min-h-[100px] font-body text-sm leading-relaxed resize-none"
                placeholder="Enter each economic factor on a new line..."
              />
            </div>

            {/* Social */}
            <div>
              <label className="label-editorial block mb-2">Social</label>
              <textarea
                value={analysis.pestel.social.join("\n")}
                onChange={(e) =>
                  handleArrayChange("pestel", "social", e.target.value)
                }
                className="input-editorial min-h-[100px] font-body text-sm leading-relaxed resize-none"
                placeholder="Enter each social factor on a new line..."
              />
            </div>

            {/* Technological */}
            <div>
              <label className="label-editorial block mb-2">
                Technological
              </label>
              <textarea
                value={analysis.pestel.technological.join("\n")}
                onChange={(e) =>
                  handleArrayChange("pestel", "technological", e.target.value)
                }
                className="input-editorial min-h-[100px] font-body text-sm leading-relaxed resize-none"
                placeholder="Enter each technological factor on a new line..."
              />
            </div>

            {/* Environmental */}
            <div>
              <label className="label-editorial block mb-2">
                Environmental
              </label>
              <textarea
                value={analysis.pestel.environmental.join("\n")}
                onChange={(e) =>
                  handleArrayChange("pestel", "environmental", e.target.value)
                }
                className="input-editorial min-h-[100px] font-body text-sm leading-relaxed resize-none"
                placeholder="Enter each environmental factor on a new line..."
              />
            </div>

            {/* Legal */}
            <div>
              <label className="label-editorial block mb-2">Legal</label>
              <textarea
                value={analysis.pestel.legal.join("\n")}
                onChange={(e) =>
                  handleArrayChange("pestel", "legal", e.target.value)
                }
                className="input-editorial min-h-[100px] font-body text-sm leading-relaxed resize-none"
                placeholder="Enter each legal factor on a new line..."
              />
            </div>
          </div>
        )}

        {activeTab === "porter" && (
          <div className="space-y-8">
            {/* Competitive Rivalry */}
            <div>
              <label className="label-editorial block mb-2">
                Competitive Rivalry
              </label>
              <input
                type="text"
                value={analysis.porter.competitiveRivalry.intensity}
                onChange={(e) =>
                  handlePorterChange(
                    "competitiveRivalry",
                    "intensity",
                    e.target.value
                  )
                }
                className="input-editorial mb-2"
                placeholder="Intensity (High/Medium/Low)"
              />
              <textarea
                value={analysis.porter.competitiveRivalry.factors.join("\n")}
                onChange={(e) =>
                  handlePorterChange(
                    "competitiveRivalry",
                    "factors",
                    e.target.value
                  )
                }
                className="input-editorial min-h-[100px] font-body text-sm leading-relaxed resize-none"
                placeholder="Enter each factor on a new line..."
              />
            </div>

            {/* Threat of New Entrants */}
            <div>
              <label className="label-editorial block mb-2">
                Threat of New Entrants
              </label>
              <input
                type="text"
                value={analysis.porter.threatOfNewEntrants.intensity}
                onChange={(e) =>
                  handlePorterChange(
                    "threatOfNewEntrants",
                    "intensity",
                    e.target.value
                  )
                }
                className="input-editorial mb-2"
                placeholder="Intensity (High/Medium/Low)"
              />
              <textarea
                value={analysis.porter.threatOfNewEntrants.factors.join("\n")}
                onChange={(e) =>
                  handlePorterChange(
                    "threatOfNewEntrants",
                    "factors",
                    e.target.value
                  )
                }
                className="input-editorial min-h-[100px] font-body text-sm leading-relaxed resize-none"
                placeholder="Enter each factor on a new line..."
              />
            </div>

            {/* Bargaining Power of Suppliers */}
            <div>
              <label className="label-editorial block mb-2">
                Bargaining Power of Suppliers
              </label>
              <input
                type="text"
                value={analysis.porter.bargainingPowerOfSuppliers.intensity}
                onChange={(e) =>
                  handlePorterChange(
                    "bargainingPowerOfSuppliers",
                    "intensity",
                    e.target.value
                  )
                }
                className="input-editorial mb-2"
                placeholder="Intensity (High/Medium/Low)"
              />
              <textarea
                value={analysis.porter.bargainingPowerOfSuppliers.factors.join(
                  "\n"
                )}
                onChange={(e) =>
                  handlePorterChange(
                    "bargainingPowerOfSuppliers",
                    "factors",
                    e.target.value
                  )
                }
                className="input-editorial min-h-[100px] font-body text-sm leading-relaxed resize-none"
                placeholder="Enter each factor on a new line..."
              />
            </div>

            {/* Bargaining Power of Buyers */}
            <div>
              <label className="label-editorial block mb-2">
                Bargaining Power of Buyers
              </label>
              <input
                type="text"
                value={analysis.porter.bargainingPowerOfBuyers.intensity}
                onChange={(e) =>
                  handlePorterChange(
                    "bargainingPowerOfBuyers",
                    "intensity",
                    e.target.value
                  )
                }
                className="input-editorial mb-2"
                placeholder="Intensity (High/Medium/Low)"
              />
              <textarea
                value={analysis.porter.bargainingPowerOfBuyers.factors.join(
                  "\n"
                )}
                onChange={(e) =>
                  handlePorterChange(
                    "bargainingPowerOfBuyers",
                    "factors",
                    e.target.value
                  )
                }
                className="input-editorial min-h-[100px] font-body text-sm leading-relaxed resize-none"
                placeholder="Enter each factor on a new line..."
              />
            </div>

            {/* Threat of Substitutes */}
            <div>
              <label className="label-editorial block mb-2">
                Threat of Substitutes
              </label>
              <input
                type="text"
                value={analysis.porter.threatOfSubstitutes.intensity}
                onChange={(e) =>
                  handlePorterChange(
                    "threatOfSubstitutes",
                    "intensity",
                    e.target.value
                  )
                }
                className="input-editorial mb-2"
                placeholder="Intensity (High/Medium/Low)"
              />
              <textarea
                value={analysis.porter.threatOfSubstitutes.factors.join("\n")}
                onChange={(e) =>
                  handlePorterChange(
                    "threatOfSubstitutes",
                    "factors",
                    e.target.value
                  )
                }
                className="input-editorial min-h-[100px] font-body text-sm leading-relaxed resize-none"
                placeholder="Enter each factor on a new line..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
