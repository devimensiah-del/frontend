'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Select, SelectOption } from '@/components/ui/Select';
import { NoDataYet } from '@/components/ui/state-components';
import { ProgressBar } from './ProgressBar';
import { WorkflowHeader } from './WorkflowHeader';
import { EnrichmentPanel } from './EnrichmentPanel';
import { AnalysisPanel } from './AnalysisPanel';
import { AdminActions } from './AdminActions';
import { ShareDialog } from './ShareDialog';
import { computeAdminStage, computeUserStage } from '@/lib/utils/workflow-stages';
import type { Company, Submission, Enrichment, Analysis } from '@/types';

export interface CompanyWorkflowPanelProps {
  company: Company;
  submission?: Submission | null;
  enrichment?: Enrichment | null;
  analysis?: Analysis | null;
  isAdmin: boolean;
  // Admin-only callbacks (undefined for users)
  onUpdateEnrichment?: (data: any) => void;
  onUpdateAnalysis?: (data: any) => void;
  onStageChange?: (stage: number) => Promise<void>;
  onToggleVisibility?: (visible: boolean) => Promise<void>;
  onToggleBlur?: (blurred: boolean) => Promise<void>;
  onGenerateAccessCode?: () => Promise<string>;
  // Loading states
  isStageChanging?: boolean;
  isUpdatingEnrichment?: boolean;
  isUpdatingAnalysis?: boolean;
  isTogglingBlur?: boolean;
  // Optional: Show header
  showHeader?: boolean;
  className?: string;
}

export function CompanyWorkflowPanel({
  company,
  submission,
  enrichment,
  analysis,
  isAdmin,
  onUpdateEnrichment,
  onUpdateAnalysis,
  onStageChange,
  onToggleVisibility,
  onToggleBlur,
  onGenerateAccessCode,
  isStageChanging = false,
  isUpdatingEnrichment = false,
  isUpdatingAnalysis = false,
  isTogglingBlur = false,
  showHeader = true,
  className,
}: CompanyWorkflowPanelProps) {
  const [activeTab, setActiveTab] = useState('enrichment');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareableUrl, setShareableUrl] = useState<string | null>(null);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);

  // Get visibility status
  const isVisibleToUser = analysis && ((analysis as any).isVisibleToUser ?? (analysis as any).is_visible_to_user ?? false);

  // Get blur status (default to true = blurred)
  const isBlurred = analysis ? ((analysis as any).isBlurred ?? (analysis as any).is_blurred ?? true) : true;

  // Compute current stage
  const currentStage = isAdmin
    ? computeAdminStage(enrichment?.status, analysis?.status, isVisibleToUser)
    : computeUserStage(enrichment?.status, analysis?.status, isVisibleToUser);

  // Handle share link generation
  const handleShareLink = async () => {
    if (!analysis || !onGenerateAccessCode) return;

    // If we already have an access code, show it
    const existingCode = (analysis as any).accessCode || (analysis as any).access_code;
    if (existingCode) {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      setShareableUrl(`${baseUrl}/report/${existingCode}`);
      setShowShareDialog(true);
      return;
    }

    // Generate new access code
    setIsGeneratingCode(true);
    setShowShareDialog(true);

    try {
      const code = await onGenerateAccessCode();
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      setShareableUrl(`${baseUrl}/report/${code}`);
    } catch {
      setShowShareDialog(false);
    } finally {
      setIsGeneratingCode(false);
    }
  };

  // Handle blur toggle
  const handleBlurToggle = async () => {
    if (onToggleBlur) {
      await onToggleBlur(!isBlurred);
    }
  };

  // No submission yet
  if (!submission) {
    return (
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <NoDataYet
            dataType="Workflow"
            expectedWhen="O workflow será iniciado quando a empresa tiver uma submissão associada."
            className="py-6"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* Header with company info and actions */}
      {showHeader && (
        <WorkflowHeader
          companyName={company.name}
          submissionId={submission.id}
          createdAt={submission.createdAt}
          isAdmin={isAdmin}
          submission={submission}
          enrichment={enrichment}
          analysis={analysis}
          isReleased={analysis?.status === 'approved' && isVisibleToUser}
          onShareLink={isAdmin && onGenerateAccessCode ? handleShareLink : undefined}
        />
      )}

      {/* Progress Bar */}
      <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
        <ProgressBar
          currentStage={currentStage}
          isAdmin={isAdmin}
          enrichmentStatus={enrichment?.status}
          analysisStatus={analysis?.status}
          onStageChange={isAdmin && onStageChange ? onStageChange : undefined}
          isLoading={isStageChanging}
        />
      </div>

      {/* Admin Actions (blur toggle, etc.) */}
      {isAdmin && analysis && (
        <AdminActions
          analysis={analysis}
          isVisibleToUser={isVisibleToUser}
          isBlurred={isBlurred}
          isTogglingBlur={isTogglingBlur}
          onToggleBlur={onToggleBlur ? handleBlurToggle : undefined}
          onShareLink={onGenerateAccessCode ? handleShareLink : undefined}
          className="mb-4"
        />
      )}

      {/* Tab Selector + Content */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Dropdown Selector */}
        <div className="lg:w-[200px] flex-shrink-0">
          <Select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full"
          >
            <SelectOption value="enrichment">Enriquecimento</SelectOption>
            <SelectOption value="analysis">Análise</SelectOption>
          </Select>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="enrichment" className="mt-0">
              <EnrichmentPanel
                enrichment={enrichment}
                isAdmin={isAdmin}
                onUpdate={isAdmin ? onUpdateEnrichment : undefined}
                isUpdating={isUpdatingEnrichment}
              />
            </TabsContent>

            <TabsContent value="analysis" className="mt-0">
              <AnalysisPanel
                analysis={analysis}
                enrichment={enrichment}
                isAdmin={isAdmin}
                isVisibleToUser={isVisibleToUser}
                onUpdate={isAdmin ? onUpdateAnalysis : undefined}
                isUpdating={isUpdatingAnalysis}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Share Dialog */}
      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        shareableUrl={shareableUrl}
        isGenerating={isGeneratingCode}
      />
    </div>
  );
}
