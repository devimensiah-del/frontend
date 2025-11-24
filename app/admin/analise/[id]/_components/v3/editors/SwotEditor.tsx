import { Plus, Trash2 } from "lucide-react";
import type { SWOTAnalysis, SWOTItem } from "@/types";

interface SwotEditorProps {
    data: SWOTAnalysis;
    onChange: (data: SWOTAnalysis) => void;
}

export function SwotEditor({ data, onChange }: SwotEditorProps) {

    const updateQuadrant = (quadrant: keyof SWOTAnalysis, items: SWOTItem[]) => {
        onChange({ ...data, [quadrant]: items });
    };

    const updateSummary = (summary: string) => {
        onChange({ ...data, summary });
    };

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Análise SWOT (LIFT Model)</h2>
                    <p className="text-sm text-gray-500">Edit strategic factors, confidence levels, and sources.</p>
                </div>
            </div>

            <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Executive Summary</label>
                <textarea
                    value={data.summary || ''}
                    onChange={(e) => updateSummary(e.target.value)}
                    className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm"
                    placeholder="Strategic summary of the SWOT analysis..."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SwotQuadrant
                    title="Forças (Strengths)"
                    color="green"
                    items={data.strengths}
                    onChange={(items) => updateQuadrant('strengths', items)}
                />
                <SwotQuadrant
                    title="Fraquezas (Weaknesses)"
                    color="red"
                    items={data.weaknesses}
                    onChange={(items) => updateQuadrant('weaknesses', items)}
                />
                <SwotQuadrant
                    title="Oportunidades (Opportunities)"
                    color="blue"
                    items={data.opportunities}
                    onChange={(items) => updateQuadrant('opportunities', items)}
                />
                <SwotQuadrant
                    title="Ameaças (Threats)"
                    color="orange"
                    items={data.threats}
                    onChange={(items) => updateQuadrant('threats', items)}
                />
            </div>
        </div>
    );
}

// Sub-component for individual quadrants
function SwotQuadrant({ title, items, onChange, color }: {
    title: string;
    items: SWOTItem[];
    onChange: (items: SWOTItem[]) => void;
    color: 'green' | 'red' | 'blue' | 'orange';
}) {

    const colorStyles = {
        green: "bg-green-50 border-green-200 text-green-800",
        red: "bg-red-50 border-red-200 text-red-800",
        blue: "bg-blue-50 border-blue-200 text-blue-800",
        orange: "bg-orange-50 border-orange-200 text-orange-800",
    };

    const handleItemChange = (index: number, field: keyof SWOTItem, value: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        onChange(newItems);
    };

    const deleteItem = (index: number) => {
        onChange(items.filter((_, i) => i !== index));
    };

    const addItem = () => {
        onChange([...items, { content: "", confidence: "Média", source: "análise de mercado" }]);
    };

    return (
        <div className={`rounded-xl border ${colorStyles[color]} p-4`}>
            <h3 className="font-bold mb-4 flex items-center justify-between">
                {title}
                <span className="text-xs opacity-70 bg-white/50 px-2 py-1 rounded">{items.length} items</span>
            </h3>

            <div className="space-y-3">
                {items.map((item, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 group">
                        <div className="flex gap-2 mb-2">
                            <textarea
                                value={item.content}
                                onChange={(e) => handleItemChange(idx, 'content', e.target.value)}
                                className="flex-1 text-sm border-none focus:ring-0 p-0 resize-none h-12 text-gray-800 placeholder-gray-400"
                                placeholder="Describe the factor..."
                            />
                            <button onClick={() => deleteItem(idx)} className="text-gray-400 hover:text-red-500 self-start opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-gray-50">
                            <select
                                value={item.confidence}
                                onChange={(e) => handleItemChange(idx, 'confidence', e.target.value)}
                                className="text-xs bg-gray-50 border-none rounded px-2 py-1 text-gray-600 cursor-pointer hover:bg-gray-100"
                            >
                                <option value="Alta">Conf: Alta</option>
                                <option value="Média">Conf: Média</option>
                                <option value="Baixa">Conf: Baixa</option>
                            </select>
                            <select
                                value={item.source}
                                onChange={(e) => handleItemChange(idx, 'source', e.target.value)}
                                className="text-xs bg-gray-50 border-none rounded px-2 py-1 text-gray-600 cursor-pointer hover:bg-gray-100 flex-1"
                            >
                                <option value="fato">Fonte: Fato</option>
                                <option value="análise de mercado">Fonte: Mercado</option>
                                <option value="estimativa">Fonte: Estimativa</option>
                                <option value="feedback de clientes">Fonte: Clientes</option>
                            </select>
                        </div>
                    </div>
                ))}

                <button
                    onClick={addItem}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-all flex items-center justify-center gap-1 text-sm font-medium"
                >
                    <Plus className="w-4 h-4" /> Add Item
                </button>
            </div>
        </div>
    );
}
