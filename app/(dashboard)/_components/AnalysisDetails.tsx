import React from 'react';
import { Analysis } from '@/lib/types';
import { AnalysisCard } from './AnalysisCard';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

interface AnalysisDetailsProps {
  analysis?: Analysis;
  isAdmin: boolean;
  onUpdate: (data: any) => void;
}

export function AnalysisDetails({ analysis, isAdmin, onUpdate }: AnalysisDetailsProps) {
  if (!analysis) {
     return (
      <div className="text-center py-12 text-gray-500">
        <p>Nenhuma análise gerada ainda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        {isAdmin && (
           <Button variant="outline" size="sm" onClick={() => onUpdate({ action: 'regenerate' })}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Gerar Nova Versão
          </Button>
        )}
      </div>
      <AnalysisCard analysis={analysis} />
    </div>
  );
}
