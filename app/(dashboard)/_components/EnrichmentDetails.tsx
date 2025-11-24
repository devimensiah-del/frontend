import React from 'react';
import { Enrichment } from '@/lib/types';
import { EnrichmentCard } from './EnrichmentCard';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

import { EnrichmentEditor } from './EnrichmentEditor';

interface EnrichmentDetailsProps {
  enrichment?: Enrichment;
  isAdmin: boolean;
  onUpdate: (data: any) => void;
}

export function EnrichmentDetails({ enrichment, isAdmin, onUpdate }: EnrichmentDetailsProps) {
  const [isEditing, setIsEditing] = React.useState(false);

  if (!enrichment) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Nenhum dado de enriquecimento disponível ainda.</p>
      </div>
    );
  }

  if (isEditing && isAdmin) {
    return (
      <EnrichmentEditor 
        enrichment={enrichment} 
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
          <>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <RefreshCcw className="w-4 h-4 mr-2" />
              Editar Dados
            </Button>
            <Button variant="outline" size="sm" onClick={() => onUpdate({ action: 'refresh' })}>
              <RefreshCcw className="w-4 h-4 mr-2" />
              Regenerar com IA
            </Button>
          </>
        )}
      </div>
      <EnrichmentCard enrichment={enrichment} />
    </div>
  );
}
