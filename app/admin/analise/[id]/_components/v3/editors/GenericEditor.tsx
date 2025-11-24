import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface GenericEditorProps {
    title: string;
    data: any;
    onChange: (data: any) => void;
}

export function GenericEditor({ title, data, onChange }: GenericEditorProps) {

    if (!data) {
        return (
            <div className="p-8 flex flex-col items-center justify-center text-gray-500">
                <p>No data available for {title}</p>
                <button
                    onClick={() => onChange({})}
                    className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                >
                    Initialize Framework
                </button>
            </div>
        );
    }

    const formatTitle = (str: string) => str.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

    const renderField = (key: string, value: any) => {

        // CASE D: Array of Objects (e.g., earlyWarningSignals with {description, name, probability, required_actions})
        // THIS MUST COME BEFORE CASE A (string arrays) to avoid incorrect rendering
        if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
            return (
                <div key={key} className="mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">{formatTitle(key)}</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {value.map((itemObj: any, idx: number) => (
                            <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative group">
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => {
                                            const newArr = value.filter((_, i) => i !== idx);
                                            onChange({ ...data, [key]: newArr });
                                        }}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-4">Item {idx + 1}</h4>
                                {Object.entries(itemObj).map(([subKey, subValue]) => (
                                    <div key={subKey} className="mb-3">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{formatTitle(subKey)}</label>
                                        {typeof subValue === 'string' || typeof subValue === 'number' ? (
                                            <textarea
                                                value={subValue as string}
                                                onChange={(e) => {
                                                    const newArr = [...value];
                                                    newArr[idx] = { ...newArr[idx], [subKey]: e.target.value };
                                                    onChange({ ...data, [key]: newArr });
                                                }}
                                                className="w-full p-2 text-sm border border-gray-200 rounded h-20"
                                            />
                                        ) : Array.isArray(subValue) ? (
                                            <div className="space-y-2">
                                                {(subValue as any[]).map((arrItem: any, arrIdx: number) => (
                                                    <input
                                                        key={arrIdx}
                                                        value={arrItem}
                                                        onChange={(e) => {
                                                            const newArr = [...value];
                                                            const newSubArr = [...(newArr[idx][subKey] as any[])];
                                                            newSubArr[arrIdx] = e.target.value;
                                                            newArr[idx] = { ...newArr[idx], [subKey]: newSubArr };
                                                            onChange({ ...data, [key]: newArr });
                                                        }}
                                                        className="w-full p-2 text-sm border border-gray-200 rounded"
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-xs text-gray-400">Complex object - not editable</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                        <button
                            onClick={() => {
                                // Clone the structure of the first item but empty values
                                const template = value.length > 0 ? JSON.parse(JSON.stringify(value[0])) : {};
                                Object.keys(template).forEach(k => template[k] = Array.isArray(template[k]) ? [] : "");
                                onChange({ ...data, [key]: [...value, template] });
                            }}
                            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-all flex items-center justify-center gap-1 text-sm font-medium"
                        >
                            <Plus className="w-4 h-4" /> Add Entry
                        </button>
                    </div>
                </div>
            );
        }

        // CASE A: Array of Strings (e.g., "Opportunities", "Weaknesses")
        if (Array.isArray(value) && (value.length === 0 || typeof value[0] === 'string')) {
            return (
                <div key={key} className="mb-8 border-l-2 border-gray-200 pl-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">{formatTitle(key)}</h3>
                    <div className="space-y-3">
                        {value.map((item: string, idx: number) => (
                            <div key={idx} className="flex gap-2">
                                <textarea
                                    value={item}
                                    onChange={(e) => {
                                        const newArr = [...value];
                                        newArr[idx] = e.target.value;
                                        onChange({ ...data, [key]: newArr });
                                    }}
                                    className="flex-1 min-h-[60px] p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                />
                                <button
                                    onClick={() => {
                                        const newArr = value.filter((_, i) => i !== idx);
                                        onChange({ ...data, [key]: newArr });
                                    }}
                                    className="text-gray-400 hover:text-red-500 self-center"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={() => onChange({ ...data, [key]: [...value, ""] })}
                            className="text-xs flex items-center gap-1 text-blue-600 font-medium hover:text-blue-700"
                        >
                            <Plus className="w-3 h-3" /> Add Item
                        </button>
                    </div>
                </div>
            );
        }

        // CASE B: Simple String (e.g., "Summary", "Objective")
        if (typeof value === 'string' || value === null || typeof value === 'number') {
            return (
                <div key={key} className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">{formatTitle(key)}</label>
                    <textarea
                        value={value || ''}
                        onChange={(e) => onChange({ ...data, [key]: e.target.value })}
                        className="w-full min-h-[80px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm"
                    />
                </div>
            );
        }

        // CASE C: Nested Object (e.g., Growth Hacking Loops, Scenarios)
        if (typeof value === 'object' && !Array.isArray(value)) {
            return (
                <div key={key} className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">{formatTitle(key)}</h3>
                    {Object.entries(value).map(([subKey, subValue]) => (
                        <GenericNestedField
                            key={subKey}
                            parentKey={key}
                            fieldKey={subKey}
                            value={subValue}
                            allData={data}
                            onMainChange={onChange}
                        />
                    ))}
                </div>
            )
        }

        return null;
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">{formatTitle(title)}</h2>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Generic Editor Mode</p>
            </div>

            <div className="max-w-3xl">
                {Object.entries(data).map(([key, value]) => renderField(key, value))}
            </div>
        </div>
    );
}

// Helper for recursion
function GenericNestedField({ parentKey, fieldKey, value, allData, onMainChange, directValueCallback }: any) {

    const handleChange = (newValue: any) => {
        if (directValueCallback) {
            onMainChange(newValue);
        } else {
            const parentObj = { ...allData[parentKey] };
            parentObj[fieldKey] = newValue;
            onMainChange({ ...allData, [parentKey]: parentObj });
        }
    };

    if (Array.isArray(value)) {
        return (
            <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{fieldKey}</label>
                <div className="space-y-2">
                    {value.map((item: string, idx: number) => (
                        <div key={idx} className="flex gap-2">
                            <input
                                value={item}
                                onChange={(e) => {
                                    const newArr = [...value];
                                    newArr[idx] = e.target.value;
                                    handleChange(newArr);
                                }}
                                className="w-full p-2 text-sm border border-gray-200 rounded"
                            />
                            <button
                                onClick={() => {
                                    const newArr = value.filter((_: any, i: number) => i !== idx);
                                    handleChange(newArr);
                                }}
                                className="text-gray-400 hover:text-red-500"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={() => handleChange([...value, ""])}
                        className="text-xs flex items-center gap-1 text-blue-600 font-medium hover:text-blue-700 mt-1"
                    >
                        <Plus className="w-3 h-3" /> Add
                    </button>
                </div>
            </div>
        )
    }

    if (typeof value === 'string' || typeof value === 'number') {
        return (
            <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{fieldKey}</label>
                <textarea
                    value={value}
                    onChange={(e) => handleChange(e.target.value)}
                    className="w-full p-2 text-sm border border-gray-200 rounded h-20"
                />
            </div>
        )
    }

    return null;
}
