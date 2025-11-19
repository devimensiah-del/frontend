import { apiFetch } from './base';
import { Report, ReportShare, Submission } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function getReport(submissionId: string, token?: string) {
  return apiFetch<Report>(`/api/v1/reports/${submissionId}`, {
    method: 'GET',
    token,
  });
}

export async function updateReportMarkdown(
  submissionId: string,
  markdown: string,
  token: string
) {
  return apiFetch<Report>(`/api/v1/reports/${submissionId}/markdown`, {
    method: 'PUT',
    body: JSON.stringify({ markdown }),
    token,
  });
}

export async function generatePDF(submissionId: string, token: string) {
  return apiFetch<{ pdf_url: string }>(`/api/v1/reports/${submissionId}/pdf`, {
    method: 'POST',
    token,
  });
}

export async function downloadPDF(submissionId: string, token?: string) {
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Note: accessing via full URL because we need blob, not json
  const response = await fetch(
    `${API_BASE_URL}/api/v1/reports/${submissionId}/pdf`,
    { headers }
  );

  if (!response.ok) {
    throw new Error('Erro ao baixar PDF');
  }

  const blob = await response.blob();
  return blob;
}

// ============================================
// REPORT SHARING
// ============================================

export async function shareReport(
  submissionId: string,
  emails: string[],
  expiryDays: number,
  token: string
) {
  return apiFetch<ReportShare>(`/api/v1/reports/${submissionId}/share`, {
    method: 'POST',
    body: JSON.stringify({ emails, expiry_days: expiryDays }),
    token,
  });
}

export async function getSharedReport(shareToken: string) {
  return apiFetch<{ submission: Submission; report: Report }>(
    `/api/v1/reports/shared/${shareToken}`,
    {
      method: 'GET',
    }
  );
}

export async function getReportShares(submissionId: string, token: string) {
  return apiFetch<ReportShare[]>(`/api/v1/reports/${submissionId}/shares`, {
    method: 'GET',
    token,
  });
}

export async function revokeReportShare(shareId: string, token: string) {
  return apiFetch(`/api/v1/reports/shares/${shareId}`, {
    method: 'DELETE',
    token,
  });
}
