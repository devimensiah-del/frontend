"use client";

import { useState } from "react";
import {
    Save, Eye, FileEdit, Download
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { FrameworkNavigation } from "./FrameworkNavigation";
import { ReportPreview } from "./ReportPreview";
import { SwotEditor } from "./editors/SwotEditor";
import { PorterEditor } from "./editors/PorterEditor";
import { PestelEditor } from "./editors/PestelEditor";
import { GenericEditor } from "./editors/GenericEditor";
import type { Analysis } from "@/types";

interface WarRoomEditorProps {
    analysis: Analysis;
    onSave: (data: Analysis) => Promise<void>;
    onApprove: () => Promise<void>;
    isSaving: boolean;
}

export type FrameworkKey =
    | 'pestel' | 'porter' | 'swot' | 'tamSamSom'
    | 'benchmarking' | 'blueOcean' | 'growthHacking'
    | 'scenarios' | 'okrs' | 'bsc' | 'decisionMatrix'
    | 'synthesis';

export function WarRoomEditor({ analysis: initialAnalysis, onSave, onApprove, isSaving }: WarRoomEditorProps) {
    const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
    const [currentFramework, setCurrentFramework] = useState<FrameworkKey>('swot');
    const [localData, setLocalData] = useState<Analysis>(initialAnalysis);
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    const updateFrameworkData = (framework: FrameworkKey, data: any) => {
        setLocalData(prev => ({
            ...prev,
            analysis: {
                ...prev.analysis,
                [framework]: data
            }
        }));
        setUnsavedChanges(true);
    };

    const handleSave = async () => {
        await onSave(localData);
        setUnsavedChanges(false);
    };

    const handleDownloadJSON = () => {
        const dataStr = JSON.stringify(localData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `analysis_${localData.submissionId}_v${localData.version}_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);

        toast({
            title: "JSON Downloaded",
            description: "Analysis JSON file saved successfully.",
        });
    };

    return (
        <div className="flex h-screen bg-[#F0F2F5] overflow-hidden">
            {/* LEFT SIDEBAR */}
            <aside className="w-64 bg-[#0F172A] text-white flex flex-col border-r border-gray-800 shrink-0">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="font-heading text-lg font-bold tracking-wider text-white">WAR ROOM</h1>
                    <p className="text-xs text-gray-400 mt-1">Strategic Command Center</p>
                </div>

                <FrameworkNavigation
                    activeFramework={currentFramework}
                    onSelect={setCurrentFramework}
                    validationStatus={localData.analysis}
                />

                <div className="p-4 border-t border-gray-800 text-xs text-gray-500 text-center">
                    v{localData.version} • {new Date(localData.updatedAt).toLocaleDateString()}
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* TOOLBAR */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="bg-gray-100 p-1 rounded-lg flex items-center">
                            <button
                                onClick={() => setActiveTab('editor')}
                                className={cn(
                                    "px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                                    activeTab === 'editor' ? "bg-white text-navy-900 shadow-sm" : "text-gray-500 hover:text-navy-900"
                                )}
                            >
                                <FileEdit className="w-4 h-4" />
                                Editor
                            </button>
                            <button
                                onClick={() => setActiveTab('preview')}
                                className={cn(
                                    "px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                                    activeTab === 'preview' ? "bg-white text-navy-900 shadow-sm" : "text-gray-500 hover:text-navy-900"
                                )}
                            >
                                <Eye className="w-4 h-4" />
                                Preview PDF (24p)
                            </button>
                        </div>
                        {unsavedChanges && (
                            <span className="text-xs text-amber-600 font-medium animate-pulse">● Unsaved changes</span>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={handleDownloadJSON}
                            className="gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Download JSON
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setLocalData(initialAnalysis)}
                            disabled={!unsavedChanges}
                        >
                            Reset
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving || !unsavedChanges}
                            className="bg-navy-900 text-white hover:bg-navy-800"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isSaving ? "Saving..." : "Save Draft"}
                        </Button>
                    </div>
                </header>

                {/* WORKSPACE */}
                <div className="flex-1 overflow-hidden relative">
                    {/* EDITOR VIEW */}
                    {activeTab === 'editor' && (
                        <div className="h-full overflow-y-auto p-8">
                            <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 min-h-[calc(100vh-10rem)]">
                                {currentFramework === 'swot' && (
                                    <SwotEditor
                                        data={localData.analysis.swot}
                                        onChange={(data) => updateFrameworkData('swot', data)}
                                    />
                                )}

                                {currentFramework === 'porter' && (
                                    <PorterEditor
                                        data={localData.analysis.porter}
                                        onChange={(data) => updateFrameworkData('porter', data)}
                                    />
                                )}

                                {currentFramework === 'pestel' && (
                                    <PestelEditor
                                        data={localData.analysis.pestel}
                                        onChange={(data) => updateFrameworkData('pestel', data)}
                                    />
                                )}

                                {!['swot', 'porter', 'pestel'].includes(currentFramework) && (
                                    <GenericEditor
                                        title={currentFramework}
                                        data={localData.analysis[currentFramework]}
                                        onChange={(data) => updateFrameworkData(currentFramework, data)}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {/* PREVIEW VIEW */}
                    {activeTab === 'preview' && (
                        <div className="h-full bg-gray-100 overflow-y-auto overflow-x-hidden">
                            <ReportPreview data={localData.analysis} analysis={localData} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
