'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { NoDataYet } from '@/components/ui/state-components';
import { EnrichmentDetails } from '@/app/(dashboard)/_components/EnrichmentDetails';
import type { Enrichment } from '@/types';

export interface EnrichmentPanelProps {
  enrichment?: Enrichment | null;
  isAdmin: boolean;
  onUpdate?: (data: any) => void;
  onRetry?: () => void;
  isUpdating?: boolean;
  className?: string;
}

export function EnrichmentPanel({
  enrichment,
  isAdmin,
  onUpdate,
  onRetry,
  isUpdating = false,
  className,
}: EnrichmentPanelProps) {
  // Handle update with loading state awareness
  const handleUpdate = (data: any) => {
    if (onUpdate && !isUpdating) {
      onUpdate(data);
    }
  };

  return (
    <Card className={`border border-gray-200 shadow-sm ${className || ''}`}>
      <CardContent className="p-4 sm:p-6">
        {!enrichment ? (
          <NoDataYet
            dataType="Enriquecimento"
            expectedWhen="Os dados serão gerados automaticamente. Aguarde alguns minutos."
            className="py-6"
          />
        ) : (
          <EnrichmentDetails
            enrichment={enrichment}
            isAdmin={isAdmin}
            onUpdate={handleUpdate}
            onRetry={onRetry}
          />
        )}
      </CardContent>
    </Card>
  );
}
