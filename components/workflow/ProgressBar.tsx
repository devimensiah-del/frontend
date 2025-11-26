'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ProgressDot, type DotState } from './ProgressDot';
import { ProgressConnector } from './ProgressConnector';
import { StageChangeDialog } from './StageChangeDialog';
import {
  ADMIN_STAGES,
  USER_STAGES,
  type AdminStage,
  type UserStage,
  getStageTransition,
  canMoveToStage,
} from '@/lib/utils/workflow-stages';
import type { EnrichmentStatus, AnalysisStatus } from '@/types';
import { Button } from '@/components/ui/button';

interface ProgressBarProps {
  currentStage: number;
  isAdmin: boolean;
  enrichmentStatus?: EnrichmentStatus | null;
  analysisStatus?: AnalysisStatus | null;
  onStageChange?: (targetStage: number) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

export function ProgressBar({
  currentStage,
  isAdmin,
  enrichmentStatus,
  analysisStatus,
  onStageChange,
  isLoading = false,
  className,
}: ProgressBarProps) {
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingTransition, setPendingTransition] = useState<{
    from: number;
    to: number;
    action: string;
    description: string;
  } | null>(null);

  const stages = isAdmin ? ADMIN_STAGES : USER_STAGES;

  // Get dot state based on current and selected stages
  const getDotState = (stage: number): DotState => {
    if (stage < currentStage) return 'completed';
    if (stage === currentStage) return 'current';
    return 'future';
  };

  // Handle stage click (admin only)
  const handleStageClick = (stage: number) => {
    if (!isAdmin || stage === currentStage) return;

    // Check if move is allowed
    const error = canMoveToStage(
      currentStage as AdminStage,
      stage as AdminStage,
      enrichmentStatus,
      analysisStatus
    );

    if (error) {
      // Could show a toast here
      console.warn('Cannot move to stage:', error);
      return;
    }

    setSelectedStage(stage);
  };

  // Handle apply button click
  const handleApply = () => {
    if (!selectedStage || selectedStage === currentStage) return;

    const transition = getStageTransition(
      currentStage as AdminStage,
      selectedStage as AdminStage
    );

    if (transition) {
      setPendingTransition({
        from: currentStage,
        to: selectedStage,
        action: transition.action,
        description: transition.description,
      });
      setDialogOpen(true);
    } else {
      // Automatic transitions (worker-driven) - just show message
      console.info('This stage change will happen automatically when processing completes');
      setSelectedStage(null);
    }
  };

  // Handle dialog confirm
  const handleConfirm = async () => {
    if (!pendingTransition || !onStageChange) return;

    try {
      await onStageChange(pendingTransition.to);
      setSelectedStage(null);
    } finally {
      setDialogOpen(false);
      setPendingTransition(null);
    }
  };

  // Handle dialog cancel
  const handleCancel = () => {
    setDialogOpen(false);
    setPendingTransition(null);
  };

  const isBackwardMove = pendingTransition && pendingTransition.to < pendingTransition.from;

  return (
    <div className={cn('w-full', className)}>
      {/* Progress dots and connectors */}
      <div className="flex items-center justify-center gap-1 md:gap-2">
        {stages.map((stage, index) => (
          <div key={stage.stage} className="flex items-center">
            <ProgressDot
              stage={stage.stage}
              label={stage.label}
              description={stage.description}
              icon={stage.icon}
              state={getDotState(stage.stage)}
              isSelected={selectedStage === stage.stage}
              isClickable={isAdmin && stage.stage !== currentStage && !isLoading}
              onClick={() => handleStageClick(stage.stage)}
            />
            {index < stages.length - 1 && (
              <ProgressConnector
                isCompleted={stage.stage < currentStage}
                className="mx-1 md:mx-2"
              />
            )}
          </div>
        ))}
      </div>

      {/* Apply button (admin only, when selection differs) */}
      {isAdmin && selectedStage && selectedStage !== currentStage && (
        <div className="mt-4 flex justify-center">
          <Button
            onClick={handleApply}
            disabled={isLoading}
            variant={selectedStage < currentStage ? 'outline' : 'default'}
            size="sm"
            className={selectedStage < currentStage ? 'border-amber-500 text-amber-600 hover:bg-amber-50' : ''}
          >
            {isLoading ? 'Aplicando...' : 'Aplicar Mudança'}
          </Button>
          <Button
            onClick={() => setSelectedStage(null)}
            variant="ghost"
            size="sm"
            className="ml-2"
            disabled={isLoading}
          >
            Cancelar
          </Button>
        </div>
      )}

      {/* Stage change confirmation dialog */}
      <StageChangeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        fromStage={pendingTransition?.from ?? currentStage}
        toStage={pendingTransition?.to ?? currentStage}
        description={pendingTransition?.description ?? ''}
        isBackward={isBackwardMove ?? false}
        isLoading={isLoading}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        stages={stages}
      />
    </div>
  );
}
