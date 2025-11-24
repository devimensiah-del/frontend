/**
 * Admin-specific enrichment API functions
 * Separate file to avoid conflicts with auto-formatting
 */

import type { Enrichment } from '@/types';

/**
 * Get enrichment by submission ID (admin endpoint)
 */
export async function getAdminEnrichmentBySubmissionId(
  submissionId: string,
  token: string
): Promise<Enrichment> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/admin/submissions/${submissionId}/enrichment`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Enrichment not found');
    }
    throw new Error('Failed to fetch enrichment');
  }

  const data = await response.json();
  return data.enrichment;
}
