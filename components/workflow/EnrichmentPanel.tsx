'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { NoDataYet } from '@/components/ui/state-components';
import { EnrichmentDetails } from '@/app/(dashboard)/_components/EnrichmentDetails';
import type { Company, Enrichment } from '@/types';

export interface EnrichmentPanelProps {
  company?: Company | null;
  isAdmin: boolean;
  className?: string;
}

export function EnrichmentPanel({
  company,
  isAdmin,
  className,
}: EnrichmentPanelProps) {
  // Create a mock enrichment object from company data for EnrichmentDetails
  const mockEnrichment: Enrichment | null = company ? {
    id: company.id,
    submissionId: company.id,
    data: {
      profile_overview: {
        legal_name: company.legal_name || '',
        website: company.website || '',
        foundation_year: company.foundation_year || '',
        headquarters: company.headquarters || '',
      },
      financials: {
        employees_range: company.employees_range || '',
        revenue_estimate: company.revenue_estimate || '',
        business_model: company.business_model || '',
      },
      market_position: {
        sector: company.sector || '',
        target_audience: company.target_audience || '',
        value_proposition: company.value_proposition || '',
      },
      strategic_assessment: {
        digital_maturity: company.digital_maturity || 0,
        strengths: company.strengths || [],
        weaknesses: company.weaknesses || [],
      },
      competitive_landscape: {
        competitors: company.competitors || [],
        market_share_status: company.market_share_status || '',
      },
    },
    status: company.enrichment_status,
    progress: 100,
    currentStep: 'completed',
    createdAt: company.created_at,
    updatedAt: company.updated_at,
  } : null;

  return (
    <Card className={`border border-gray-200 shadow-sm ${className || ''}`}>
      <CardContent className="p-4 sm:p-6">
        {!mockEnrichment ? (
          <NoDataYet
            dataType="Enriquecimento"
            expectedWhen="Os dados serão gerados automaticamente quando a empresa for criada."
            className="py-6"
          />
        ) : (
          <EnrichmentDetails
            enrichment={mockEnrichment}
            company={company || undefined}
            isAdmin={isAdmin}
          />
        )}
      </CardContent>
    </Card>
  );
}
