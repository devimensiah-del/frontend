"use client";

import { useState } from "react";
import { ActionToolbar } from "./ActionToolbar";
import { EditorPanel } from "./EditorPanel";
import { PreviewPanel } from "./PreviewPanel";

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

interface WarRoomShellProps {
  analysis: AnalysisData;
  onAnalysisChange: (analysis: AnalysisData) => void;
  onSaveDraft: () => void;
  onRetryAnalysis: () => void;
  onApproveAnalysis: () => void;
  onPublishPDF: () => void;
  onSendEmail: () => void;
  onCreateNewVersion: () => void;
  isSaving: boolean;
  isApproving: boolean;
  isGeneratingPDF: boolean;
  isSending: boolean;
  isCreatingVersion: boolean;
  submissionId: string;
  userEmail: string;
}

type ViewMode = "editor" | "preview";

export function WarRoomShell({
  analysis,
  onAnalysisChange,
  onSaveDraft,
  onRetryAnalysis,
  onApproveAnalysis,
  onPublishPDF,
  onSendEmail,
  onCreateNewVersion,
  isSaving,
  isApproving,
  isGeneratingPDF,
  isSending,
  isCreatingVersion,
  submissionId,
  userEmail,
}: WarRoomShellProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("editor");

  return (
    <div className="h-screen flex flex-col bg-[var(--surface-paper)]">
      {/* Header */}
      <div className="border-b border-[var(--line-color)] bg-white">
        <div className="container-editorial py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-heading font-medium tracking-tight text-[var(--navy-900)]">
                War Room
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                {analysis.companyName} • Submission #{submissionId}
              </p>
            </div>
            <ActionToolbar
              analysis={null}
              allVersions={[]}
              currentVersion={1}
              onVersionChange={() => { }}
              onSaveDraft={onSaveDraft}
              onRetryAnalysis={onRetryAnalysis}
              onApproveAnalysis={onApproveAnalysis}
              onPublishPDF={onPublishPDF}
              onSendToUser={onSendEmail}
              onCreateNewVersion={onCreateNewVersion}
              isSaving={isSaving}
              isApproving={isApproving}
              isGeneratingPDF={isGeneratingPDF}
              isSending={isSending}
              isCreatingVersion={isCreatingVersion}
              userEmail={userEmail}
            />
          </div>

          {/* View Mode Tabs */}
          <div className="flex gap-1 border-b border-[var(--line-color)]">
            <button
              onClick={() => setViewMode("editor")}
              className={`
                px-6 py-3 font-heading text-xs uppercase tracking-widest font-medium
                transition-all duration-200
                ${viewMode === "editor"
                  ? "bg-[var(--navy-900)] text-white"
                  : "bg-transparent text-[var(--text-secondary)] hover:bg-white"
                }
              `}
            >
              Editor
            </button>
            <button
              onClick={() => setViewMode("preview")}
              className={`
                px-6 py-3 font-heading text-xs uppercase tracking-widest font-medium
                transition-all duration-200
                ${viewMode === "preview"
                  ? "bg-[var(--navy-900)] text-white"
                  : "bg-transparent text-[var(--text-secondary)] hover:bg-white"
                }
              `}
            >
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full container-editorial py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            {/* Editor Panel */}
            <div
              className={`${viewMode === "preview" ? "hidden lg:block" : "block"
                }`}
            >
              <EditorPanel
                analysis={analysis}
                onAnalysisChange={onAnalysisChange}
              />
            </div>

            {/* Preview Panel */}
            <div
              className={`${viewMode === "editor" ? "hidden lg:block" : "block"
                }`}
            >
              <PreviewPanel analysis={analysis} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
