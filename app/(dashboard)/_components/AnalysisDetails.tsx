import React from 'react';
import { Analysis } from '@/lib/types';
import { AnalysisCard } from './AnalysisCard';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { AnalysisEditor } from './AnalysisEditor';
import { getAnalysisActions } from '@/lib/utils/workflow';
import { NoDataYet, ProcessingState, ErrorState } from '@/components/ui/state-components';

interface AnalysisDetailsProps {
  analysis?: Analysis;
  onUpdate: (data: Analysis['analysis']) => void;
  isAdmin: boolean;
}

export function AnalysisDetails({
  analysis,
  onUpdate,
  isAdmin,
}: AnalysisDetailsProps) {
  const [isEditing, setIsEditing] = React.useState(false);

  if (!analysis) {
    return (
      <NoDataYet
        dataType="Análise estratégica"
        expectedWhen="A análise será gerada automaticamente após a aprovação do enriquecimento. Aguarde alguns minutos."
      />
    );
  }

  // Handle pending status (analysis is being processed)
  if (analysis.status === 'pending') {
    return (
      <ProcessingState
        title="Análise Estratégica em Andamento"
        description="Aplicando frameworks estratégicos avançados (SWOT, PESTEL, 5 Forças de Porter) aos dados enriquecidos."
        estimatedTime="3-7 minutos"
      />
    );
  }

  if (isEditing && isAdmin) {
    return (
      <AnalysisEditor
        analysis={analysis}
        onSave={(data) => {
          onUpdate(data);
          setIsEditing(false);
        }}
      />
    );
  }

  const analysisActions = getAnalysisActions(analysis);

  return (
    <div className="space-y-6">
      {/* Admin edit button - Only show if analysis can be edited (status === completed) */}
      {isAdmin && analysisActions.canEdit && (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            title="Editar análise estratégica"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Editar Análise
          </Button>
        </div>
      )}
      <AnalysisCard analysis={analysis} isAdmin={isAdmin} />
    </div>
  );
}
