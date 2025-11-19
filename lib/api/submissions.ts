/**
 * API Client - Submissions Module
 *
 * Handles all submission-related API calls.
 * Extracted from main client for better modularity.
 *
 * @module lib/api/submissions
 */

import { apiFetch } from './base';
import type {
  Submission,
  SubmissionFormInput,
  SubmissionsFilters,
  PaginatedResponse,
} from '@/types';

/**
 * Create a new submission (guest or authenticated)
 *
 * Guest users can create submissions without authentication.
 * Payment requirement controlled by feature flag.
 *
 * @param data - Submission form data
 * @param token - Optional auth token for logged-in users
 * @returns Created submission and checkout URL (if payment enabled)
 */
export async function createSubmission(
  data: SubmissionFormInput,
  token?: string
) {
  return apiFetch<{ submission: Submission; checkout_url?: string }>(
    '/api/v1/submissions',
    {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }
  );
}

/**
 * Get paginated list of submissions
 *
 * @param filters - Query filters (status, date range, etc.)
 * @param token - Auth token
 */
export async function getSubmissions(
  filters?: SubmissionsFilters,
  token?: string
) {
  const params = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v.toString()));
        } else {
          params.append(key, value.toString());
        }
      }
    });
  }

  const query = params.toString();
  const endpoint = `/api/v1/submissions${query ? `?${query}` : ''}`;

  return apiFetch<PaginatedResponse<Submission>>(endpoint, {
    method: 'GET',
    token,
  });
}

/**
 * Get single submission by ID
 *
 * @param id - Submission ID
 * @param token - Auth token
 */
export async function getSubmission(id: string, token?: string) {
  return apiFetch<Submission>(`/api/v1/submissions/${id}`, {
    method: 'GET',
    token,
  });
}

/**
 * Update submission data (partial update)
 *
 * @param id - Submission ID
 * @param data - Fields to update
 * @param token - Auth token (required)
 */
export async function updateSubmission(
  id: string,
  data: Partial<Submission>,
  token: string
) {
  return apiFetch<Submission>(`/api/v1/submissions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    token,
  });
}

/**
 * Update submission status
 *
 * @param id - Submission ID
 * @param status - New status
 * @param token - Auth token (required)
 */
export async function updateSubmissionStatus(
  id: string,
  status: Submission['status'],
  token: string
) {
  return apiFetch<Submission>(`/api/v1/submissions/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
    token,
  });
}

/**
 * Approve submission (admin only)
 *
 * Moves submission to 'approved' status and triggers report delivery.
 *
 * @param id - Submission ID
 * @param token - Admin auth token (required)
 */
export async function approveSubmission(id: string, token: string) {
  return apiFetch<Submission>(`/api/v1/admin/submissions/${id}/approve`, {
    method: 'POST',
    token,
  });
}

/**
 * Trigger manual enrichment for submission (admin only)
 *
 * @param id - Submission ID
 * @param token - Admin auth token (required)
 */
export async function triggerEnrichment(id: string, token: string) {
  return apiFetch(`/api/v1/admin/submissions/${id}/enrich`, {
    method: 'POST',
    token,
  });
}

/**
 * Regenerate AI analysis for submission (admin only)
 *
 * @param id - Submission ID
 * @param token - Admin auth token (required)
 */
export async function regenerateAnalysis(id: string, token: string) {
  return apiFetch(`/api/v1/admin/submissions/${id}/regenerate`, {
    method: 'POST',
    token,
  });
}

/**
 * Get submission status updates (polling endpoint)
 *
 * Used for real-time status tracking without WebSocket.
 *
 * @param id - Submission ID
 * @param token - Auth token
 */
export async function getSubmissionStatus(id: string, token?: string) {
  return apiFetch<{
    status: Submission['status'];
    ai_status: Submission['ai_status'];
    review_status: Submission['review_status'];
    updated_at: string;
  }>(`/api/v1/submissions/${id}/status`, {
    method: 'GET',
    token,
  });
}
