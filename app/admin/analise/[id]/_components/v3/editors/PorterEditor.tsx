import { Plus, Trash2 } from "lucide-react";
import type { PorterAnalysis, PorterForce } from "@/types";

interface PorterEditorProps {
    data: PorterAnalysis;
    onChange: (data: PorterAnalysis) => void;
}

export function PorterEditor({ data, onChange }: PorterEditorProps) {

    const updateForce = (index: number, field: keyof PorterForce, value: string) => {
        const newForces = [...(data.forces || [])];
        newForces[index] = { ...newForces[index], [field]: value };
        onChange({ ...data, forces: newForces });
    };

    const addForce = () => {
        const newForce: PorterForce = {
            force: "New Force",
            intensity: "Média",
            description: ""
        };
        onChange({ ...data, forces: [...(data.forces || []), newForce] });
    };

    const removeForce = (index: number) => {
        const newForces = (data.forces || []).filter((_, i) => i !== index);
        onChange({ ...data, forces: newForces });
    };

    const updateSummary = (summary: string) => {
        onChange({ ...data, summary });
    };

    const updateAttractiveness = (overallAttractiveness: string) => {
        onChange({ ...data, overallAttractiveness });
    };

    const forces = data.forces || [];

    return (
        <div className="p-8">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Porter's 7 Forces (Extended Model)</h2>
                <p className="text-sm text-gray-500">Analysis of competitive environment including AI and Ecosystems disruption.</p>
            </div>

            {/* Summary Section */}
            <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Executive Summary</label>
                <textarea
                    value={data.summary || ''}
                    onChange={(e) => updateSummary(e.target.value)}
                    className="w-full h-20 p-3 bg-white border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Overall competitive environment summary..."
                />

                <div className="mt-4">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Overall Market Attractiveness</label>
                    <div className="flex gap-2">
                        {['Alta', 'Média', 'Baixa'].map((level) => (
                            <button
                                key={level}
                                onClick={() => updateAttractiveness(level)}
                                className={`px-6 py-2 rounded-lg font-medium transition-all border-2 ${
                                    data.overallAttractiveness === level
                                        ? level === 'Alta' ? 'bg-green-100 text-green-700 border-green-300 shadow-sm'
                                            : level === 'Média' ? 'bg-yellow-100 text-yellow-700 border-yellow-300 shadow-sm'
                                                : 'bg-red-100 text-red-700 border-red-300 shadow-sm'
                                        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Forces List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Competitive Forces ({forces.length})</h3>
                    <button
                        onClick={addForce}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium text-sm transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Force
                    </button>
                </div>

                {forces.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                        <p className="text-gray-500 mb-4">No forces defined yet</p>
                        <button
                            onClick={addForce}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                        >
                            Add First Force
                        </button>
                    </div>
                ) : (
                    forces.map((force, index) => (
                        <PorterForceCard
                            key={index}
                            force={force}
                            index={index}
                            onUpdate={updateForce}
                            onRemove={() => removeForce(index)}
                            isNew={index >= 5} // Forces 6+ are new (Partnerships, AI)
                        />
                    ))
                )}
            </div>

            {/* Suggested Forces Helper */}
            {forces.length < 7 && (
                <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <h4 className="text-sm font-bold text-blue-900 mb-2">💡 Suggested Porter Forces</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                        <div className="text-blue-700">1. Competitive Rivalry</div>
                        <div className="text-blue-700">2. Supplier Power</div>
                        <div className="text-blue-700">3. Buyer Power</div>
                        <div className="text-blue-700">4. Threat of New Entrants</div>
                        <div className="text-blue-700">5. Threat of Substitutes</div>
                        <div className="text-indigo-700 font-bold">6. Power of Ecosystems/Partnerships</div>
                        <div className="text-indigo-700 font-bold">7. AI & Data Disruption</div>
                    </div>
                </div>
            )}
        </div>
    );
}

function PorterForceCard({ force, index, onUpdate, onRemove, isNew }: {
    force: PorterForce;
    index: number;
    onUpdate: (index: number, field: keyof PorterForce, value: string) => void;
    onRemove: () => void;
    isNew?: boolean;
}) {
    return (
        <div className={`p-6 rounded-xl border-2 shadow-sm transition-all group hover:shadow-md ${
            isNew
                ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200'
                : 'bg-white border-gray-200'
        }`}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">
                            FORCE {index + 1}
                        </span>
                        {isNew && (
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                                NEW 2025+
                            </span>
                        )}
                    </div>
                    <input
                        type="text"
                        value={force.force}
                        onChange={(e) => onUpdate(index, 'force', e.target.value)}
                        className="w-full text-lg font-bold text-gray-900 bg-transparent border-none focus:ring-0 p-0 mb-1"
                        placeholder="Force name..."
                    />
                </div>
                <button
                    onClick={onRemove}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 ml-4"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

            {/* Intensity Selector */}
            <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Intensity</label>
                <div className="flex gap-2">
                    {['Alta', 'Média', 'Baixa'].map((level) => (
                        <button
                            key={level}
                            onClick={() => onUpdate(index, 'intensity', level)}
                            className={`flex-1 px-4 py-2 text-sm rounded-lg font-medium transition-all border-2 ${
                                force.intensity === level
                                    ? level === 'Alta' ? 'bg-red-100 text-red-700 border-red-300 shadow-sm'
                                        : level === 'Média' ? 'bg-yellow-100 text-yellow-700 border-yellow-300 shadow-sm'
                                            : 'bg-green-100 text-green-700 border-green-300 shadow-sm'
                                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                            }`}
                        >
                            {level}
                        </button>
                    ))}
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Analysis & Impact</label>
                <textarea
                    value={force.description || ''}
                    onChange={(e) => onUpdate(index, 'description', e.target.value)}
                    className="w-full h-32 p-3 bg-white/70 border-2 border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder={`Analyze the ${force.force} force and its impact on the competitive environment...`}
                />
            </div>
        </div>
    );
}
