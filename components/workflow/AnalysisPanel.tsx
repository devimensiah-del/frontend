'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { NoDataYet } from '@/components/ui/state-components';
import { AnalysisDetails } from '@/app/(dashboard)/_components/AnalysisDetails';
import { WorkflowProgress } from '@/app/(dashboard)/_components/WorkflowProgress';
import type { Enrichment, Analysis } from '@/types';

export interface AnalysisPanelProps {
  analysis?: Analysis | null;
  enrichment?: Enrichment | null;
  isAdmin: boolean;
  isVisibleToUser?: boolean;
  onUpdate?: (data: any) => void;
  isUpdating?: boolean;
  className?: string;
}

export function AnalysisPanel({
  analysis,
  enrichment,
  isAdmin,
  isVisibleToUser = false,
  onUpdate,
  isUpdating = false,
  className,
}: AnalysisPanelProps) {
  // Handle update with loading state awareness
  const handleUpdate = (data: any) => {
    if (onUpdate && !isUpdating) {
      onUpdate(data);
    }
  };

  // User: Show progress if not ready OR not visible to user yet
  if (!isAdmin && (!analysis || !isVisibleToUser || (analysis.status !== 'approved' && analysis.status !== 'sent'))) {
    return (
      <Card className={`border border-gray-200 shadow-sm ${className || ''}`}>
        <CardContent className="p-4 sm:p-6">
          <WorkflowProgress
            enrichmentStatus={enrichment?.status}
            analysisStatus={analysis?.status}
            isAdmin={false}
          />
        </CardContent>
      </Card>
    );
  }

  // User: Show analysis when ready AND visible to user (stage 6)
  if (!isAdmin && isVisibleToUser && (analysis?.status === 'approved' || analysis?.status === 'sent')) {
    return (
      <Card className={`border border-gray-200 shadow-sm ${className || ''}`}>
        <CardContent className="p-4 sm:p-6">
          <AnalysisDetails
            analysis={analysis}
            isAdmin={false}
            onUpdate={() => {}}
          />
        </CardContent>
      </Card>
    );
  }

  // Admin: Always show analysis details
  return (
    <Card className={`border border-gray-200 shadow-sm ${className || ''}`}>
      <CardContent className="p-4 sm:p-6">
        {!analysis ? (
          <NoDataYet
            dataType="Análise"
            expectedWhen="A análise será iniciada automaticamente após aprovação do enriquecimento."
            className="py-6"
          />
        ) : (
          <AnalysisDetails
            analysis={analysis}
            isAdmin={isAdmin}
            onUpdate={handleUpdate}
          />
        )}
      </CardContent>
    </Card>
  );
}
