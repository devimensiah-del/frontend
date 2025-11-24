import { Plus, Trash2, Globe } from "lucide-react";

interface PestelEditorProps {
    data: any;
    onChange: (data: any) => void;
}

export function PestelEditor({ data, onChange }: PestelEditorProps) {

    const updateCategory = (category: string, items: string[]) => {
        onChange({ ...data, [category]: items });
    };

    const updateSummary = (summary: string) => {
        onChange({ ...data, summary });
    };

    const categories = [
        { id: 'political', label: 'Political', color: 'bg-red-50 border-red-100 text-red-900' },
        { id: 'economic', label: 'Economic', color: 'bg-blue-50 border-blue-100 text-blue-900' },
        { id: 'social', label: 'Social', color: 'bg-yellow-50 border-yellow-100 text-yellow-900' },
        { id: 'technological', label: 'Technological', color: 'bg-purple-50 border-purple-100 text-purple-900' },
        { id: 'environmental', label: 'Environmental', color: 'bg-green-50 border-green-100 text-green-900' },
        { id: 'legal', label: 'Legal', color: 'bg-gray-50 border-gray-200 text-gray-900' },
    ];

    return (
        <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-600 rounded-lg text-white">
                    <Globe className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">PESTEL Analysis</h2>
                    <p className="text-sm text-gray-500">Macro-environmental factors analysis (SCAN Model).</p>
                </div>
            </div>

            <div className="mb-8 bg-white p-4 border border-gray-200 rounded-xl shadow-sm">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Executive Summary</label>
                <textarea
                    value={data.summary || ''}
                    onChange={(e) => updateSummary(e.target.value)}
                    className="w-full h-24 p-0 border-none focus:ring-0 outline-none resize-none text-sm text-gray-800 placeholder-gray-400"
                    placeholder="Summarize the PESTEL findings..."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                    <div key={cat.id} className={`rounded-xl border ${cat.color} p-4 flex flex-col h-full`}>
                        <h3 className="font-bold mb-4">{cat.label}</h3>
                        <div className="space-y-3 flex-1">
                            {(data[cat.id] || []).map((item: string, idx: number) => (
                                <div key={idx} className="bg-white/60 p-2 rounded-lg backdrop-blur-sm border border-black/5 flex gap-2">
                                    <textarea
                                        value={item}
                                        onChange={(e) => {
                                            const newItems = [...(data[cat.id] || [])];
                                            newItems[idx] = e.target.value;
                                            updateCategory(cat.id, newItems);
                                        }}
                                        rows={3}
                                        className="flex-1 bg-transparent border-none text-sm p-0 resize-none focus:ring-0"
                                    />
                                    <button
                                        onClick={() => {
                                            const newItems = (data[cat.id] || []).filter((_: any, i: number) => i !== idx);
                                            updateCategory(cat.id, newItems);
                                        }}
                                        className="text-black/20 hover:text-red-500"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => updateCategory(cat.id, [...(data[cat.id] || []), ""])}
                            className="mt-4 w-full py-2 bg-white/50 hover:bg-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                            <Plus className="w-3 h-3" /> Add Factor
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
