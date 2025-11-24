import React from 'react';
import { Analysis } from '@/lib/types';
import { AnalysisCard } from './AnalysisCard';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { AnalysisEditor } from './AnalysisEditor';

interface AnalysisDetailsProps {
  analysis: Analysis;
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
      <div className="text-center py-12 text-gray-500">
        <p>Nenhuma análise gerada ainda.</p>
      </div>
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

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        {isAdmin && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Editar Análise
          </Button>
        )}
      </div>
      <AnalysisCard analysis={analysis} isAdmin={isAdmin} />
    </div>
  );
}
