import React from 'react';
import { Enrichment } from '@/lib/types';
import { EnrichmentCard } from './EnrichmentCard';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

interface EnrichmentDetailsProps {
  enrichment?: Enrichment;
  isAdmin: boolean;
  onUpdate: (data: any) => void;
}

export function EnrichmentDetails({ enrichment, isAdmin, onUpdate }: EnrichmentDetailsProps) {
  if (!enrichment) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Nenhum dado de enriquecimento disponível ainda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        {isAdmin && (
          <Button variant="outline" size="sm" onClick={() => onUpdate({ action: 'refresh' })}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Atualizar Dados
          </Button>
        )}
      </div>
      <EnrichmentCard enrichment={enrichment} />
    </div>
  );
}
