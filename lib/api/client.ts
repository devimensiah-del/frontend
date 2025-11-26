/**
 * API Client with Real HTTP Calls to Go Backend
 * All functions make real requests to the backend
 */

import type {
  User,
  Submission,
  Enrichment,
  Analysis,
  LoginFormData,
  SignupFormData,
  ResetPasswordFormData,
  SubmissionFormData,
  PaginatedResponse,
  PublicReportData,
  AccessCodeResponse,
} from '@/types';

import { handleApiError, handleNetworkError } from './error-handler';

// Get API base URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

/**
 * Get auth token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

/**
 * Set auth token in localStorage
 */
function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
}

/**
 * Remove auth token from localStorage
 */
function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
}

/**
 * Make authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // For 404 on enrichment/analysis endpoints, don't log as error
      // These are expected when data doesn't exist yet (only for GET requests)
      const is404NotFound = response.status === 404;
      const isEnrichmentOrAnalysis = endpoint.includes('/enrichment') || endpoint.includes('/analysis');
      const isGetRequest = !options.method || options.method === 'GET';

      // Only silently handle 404 for GET requests on enrichment/analysis
      // (indicates data not yet created, which is expected early in workflow)
      if (is404NotFound && isEnrichmentOrAnalysis && isGetRequest) {
        console.debug(`Expected 404: ${endpoint} - Data not yet created`);
        throw new Error('Not found');
      }

      // All other errors (including 404 on PUT/POST) should be logged
      await handleApiError(response);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    handleNetworkError(error);
  }
}

/**
 * Authentication API
 */
export const authApi = {
  /**
   * Login user
   * Backend returns access_token (not token)
   */
  async login(credentials: LoginFormData): Promise<{ user: User; access_token: string }> {
    const response = await apiRequest<{ user: User; access_token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Save token to localStorage (backend uses access_token)
    setAuthToken(response.access_token);

    return response;
  },

  /**
   * Signup new user
   * Backend returns access_token (not token)
   */
  async signup(data: SignupFormData): Promise<{ user: User; access_token: string }> {
    const response = await apiRequest<{ user: User; access_token: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Save token to localStorage (backend uses access_token)
    setAuthToken(response.access_token);

    return response;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
      });
    } finally {
      // Always remove token, even if request fails
      removeAuthToken();
    }
  },

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User | null> {
    const token = getAuthToken();
    if (!token) return null;

    try {
      const response = await apiRequest<{ user: User }>('/auth/me');
      return response.user;
    } catch {
      // If unauthorized, remove invalid token
      removeAuthToken();
      return null;
    }
  },

  /**
   * Send password reset email
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Reset password with token
   */
  async resetPassword(data: ResetPasswordFormData & { token: string }): Promise<{ message: string }> {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update password for authenticated user
   */
  async updatePassword(oldPassword: string, newPassword: string): Promise<{ message: string }> {
    return apiRequest('/auth/update-password', {
      method: 'PUT',
      body: JSON.stringify({
        currentPassword: oldPassword,
        newPassword,
      }),
    });
  },
};

/**
 * Submissions API
 */
export const submissionsApi = {
  /**
   * Get single submission
   */
  async getById(id: string): Promise<Submission> {
    const response = await apiRequest<{ submission: Submission }>(`/submissions/${id}`);
    return response.submission;
  },

  /**
   * Get all submissions (alias for listSubmissions)
   */
  async getAll(params?: {
    status?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ submissions: Submission[]; total: number }> {
    return this.listSubmissions(params);
  },

  /**
   * List submissions with optional filters
   */
  async listSubmissions(params?: {
    status?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ submissions: Submission[]; total: number }> {
    const queryParams = new URLSearchParams();

    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());

    const query = queryParams.toString();
    const endpoint = query ? `/submissions?${query}` : '/submissions';

    const response = await apiRequest<PaginatedResponse<Submission>>(endpoint);

    return {
      submissions: response.data,
      total: response.total,
    };
  },

  /**
   * Create new submission
   */
  async create(data: SubmissionFormData): Promise<Submission> {
    const response = await apiRequest<{ submission: Submission }>('/submissions', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return response.submission;
  },

  /**
   * Update submission
   */
  async update(id: string, data: Partial<Submission>): Promise<Submission> {
    const response = await apiRequest<{ submission: Submission }>(`/submissions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    return response.submission;
  },

  /**
   * Delete submission
   */
  async delete(id: string): Promise<{ message: string }> {
    return apiRequest(`/submissions/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Enrichment API
 * Note: Admin operations (update, approve) are in adminApi
 */
export const enrichmentApi = {
  /**
   * Get enrichment data for submission
   */
  async getBySubmissionId(submissionId: string): Promise<Enrichment> {
    const response = await apiRequest<{ enrichment: Enrichment }>(`/submissions/${submissionId}/enrichment`);
    return response.enrichment;
  },
};

/**
 * Analysis API
 * Note: Admin operations (update, approve, send, versioning) are in adminApi
 * Analysis is automatically created after enrichment approval
 */
export const analysisApi = {
  /**
   * Get analysis for submission
   */
  async getBySubmissionId(submissionId: string): Promise<Analysis> {
    const response = await apiRequest<{ analysis: Analysis }>(`/submissions/${submissionId}/analysis`);
    return response.analysis;
  },

  /**
   * Publish report and generate PDF
   * Returns JSON response with report_id and pdf_url (Supabase Storage link)
   */
  async publishReport(submissionId: string): Promise<{ report_id: string; pdf_url: string }> {
    return apiRequest(`/submissions/${submissionId}/report/publish`, {
      method: 'POST',
    });
  },

  /**
   * Download report PDF
   * Returns PDF URL with metadata when report is ready
   */
  async downloadReport(submissionId: string): Promise<{ pdf_url: string; report_id: string; created_at: string }> {
    return apiRequest(`/submissions/${submissionId}/report/download`);
  },
};

/**
 * User Profile API
 */
export const userApi = {
  /**
   * Get user profile
   */
  async getProfile(): Promise<User> {
    const response = await apiRequest<{ user: User }>('/user/profile');
    return response.user;
  },

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiRequest<{ user: User }>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    return response.user;
  },

  /**
   * Delete (deactivate) current user account
   */
  async deleteAccount(): Promise<{ message: string }> {
    return apiRequest('/user', {
      method: 'DELETE',
    });
  },
};

/**
 * Admin API
 */
export const adminApi = {
  /**
   * Get all submissions (admin view)
   */
  async getAllSubmissions(params?: {
    status?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<Submission>> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());

    const query = queryParams.toString();
    const endpoint = query ? `/admin/submissions?${query}` : '/admin/submissions';

    return apiRequest<PaginatedResponse<Submission>>(endpoint);
  },

  /**
   * Get submission by ID (admin view)
   */
  async getSubmission(id: string): Promise<Submission> {
    const response = await apiRequest<{ submission: Submission }>(`/admin/submissions/${id}`);
    return response.submission;
  },

  /**
   * Get analytics data
   */
  async getAnalytics(): Promise<{
    totalSubmissions: number;
    activeSubmissions: number;
    completedSubmissions: number;
    revenue: number;
  }> {
    return apiRequest('/admin/analytics');
  },

  /**
   * Get enrichment by submission ID (admin only)
   */
  async getEnrichmentBySubmissionId(submissionId: string): Promise<Enrichment> {
    const response = await apiRequest<{ enrichment: Enrichment }>(
      `/admin/submissions/${submissionId}/enrichment`
    );
    return response.enrichment;
  },

  /**
   * Get analysis by submission ID (admin only)
   */
  async getAnalysisBySubmissionId(submissionId: string): Promise<Analysis> {
    const response = await apiRequest<{ analysis: Analysis }>(
      `/admin/submissions/${submissionId}/analysis`
    );
    return response.analysis;
  },

  /**
   * Update enrichment fields (admin only) - status remains unchanged
   */
  async updateEnrichment(enrichmentId: string, data: Record<string, any>): Promise<Enrichment> {
    const response = await apiRequest<{ enrichment: Enrichment }>(
      `/admin/enrichment/${enrichmentId}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
    return response.enrichment;
  },

  /**
   * Approve enrichment (admin only) - changes status to 'approved' and triggers analysis
   */
  async approveEnrichment(enrichmentId: string): Promise<{ enrichment: Enrichment; message: string }> {
    return apiRequest(`/admin/enrichment/${enrichmentId}/approve`, {
      method: 'POST',
    });
  },

  /**
   * Update analysis fields (admin only) - status remains unchanged
   */
  async updateAnalysis(analysisId: string, data: Record<string, any>): Promise<Analysis> {
    const response = await apiRequest<{ analysis: Analysis }>(
      `/admin/analysis/${analysisId}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
    return response.analysis;
  },

  // NOTE: createAnalysisVersion removed - no versioning in new architecture
  // Each submission has exactly one analysis record

  /**
   * Approve analysis (admin only) - changes status to 'approved' and triggers PDF generation
   */
  async approveAnalysis(analysisId: string): Promise<{ analysis: Analysis; message: string }> {
    return apiRequest(`/admin/analysis/${analysisId}/approve`, {
      method: 'POST',
    });
  },

  /**
   * Send analysis to user (admin only) - changes status to 'sent'
   */
  async sendAnalysis(analysisId: string, userEmail: string): Promise<{ analysis: Analysis; message: string }> {
    return apiRequest(`/admin/analysis/${analysisId}/send`, {
      method: 'POST',
      body: JSON.stringify({ userEmail }),
    });
  },

  /**
   * Retry enrichment for a submission
   */
  async retryEnrichment(submissionId: string): Promise<{ message: string }> {
    return apiRequest(`/admin/submissions/${submissionId}/retry-enrichment`, {
      method: 'POST',
    });
  },

  /**
   * Retry analysis for a submission
   */
  async retryAnalysis(submissionId: string): Promise<{ message: string }> {
    return apiRequest(`/admin/submissions/${submissionId}/retry-analysis`, {
      method: 'POST',
    });
  },

  /**
   * Toggle analysis visibility to end user (admin only)
   */
  async toggleVisibility(analysisId: string, visible: boolean): Promise<{ analysis: Analysis; message: string }> {
    return apiRequest(`/admin/analysis/${analysisId}/visibility`, {
      method: 'POST',
      body: JSON.stringify({ visible }),
    });
  },

  /**
   * Generate access code for public sharing (admin only)
   */
  async generateAccessCode(analysisId: string): Promise<AccessCodeResponse> {
    return apiRequest(`/admin/analysis/${analysisId}/access-code`, {
      method: 'POST',
    });
  },

  /**
   * Reopen analysis for editing (admin only) - reverts approved → completed
   */
  async reopenAnalysis(analysisId: string): Promise<{ analysis: Analysis; message: string }> {
    return apiRequest(`/admin/analysis/${analysisId}/reopen`, {
      method: 'POST',
    });
  },

  /**
   * Toggle blur status for premium frameworks (admin only)
   * When blurred=true, premium frameworks are hidden behind a paywall blur
   */
  async toggleBlur(analysisId: string, blurred: boolean): Promise<{ analysis: Analysis; message: string }> {
    return apiRequest(`/admin/analysis/${analysisId}/blur`, {
      method: 'POST',
      body: JSON.stringify({ blurred }),
    });
  },

  /**
   * Reopen enrichment for editing (admin only) - reverts approved → completed
   */
  async reopenEnrichment(enrichmentId: string): Promise<{ enrichment: Enrichment; message: string }> {
    return apiRequest(`/admin/enrichment/${enrichmentId}/reopen`, {
      method: 'POST',
    });
  },
};

// Export all APIs as a single client
export const apiClient = {
  auth: authApi,
  submissions: submissionsApi,
  enrichment: enrichmentApi,
  analysis: analysisApi,
  user: userApi,
  admin: adminApi,
};

export default apiClient;

export const reportApi = {
  publishReport: analysisApi.publishReport,
  downloadReport: analysisApi.downloadReport,
};

/**
 * Public API - No authentication required (unless admin preview)
 */
export const publicApi = {
  /**
   * Get report by access code (public, no auth required)
   * Returns 404 if code is invalid or report is not visible
   *
   * @param code - The access code for the report
   * @param adminPreview - If true, sends auth token and bypasses visibility check (admin only)
   */
  async getReportByAccessCode(code: string, adminPreview: boolean = false): Promise<PublicReportData> {
    const baseUrl = `${API_BASE_URL}/public/report/${code}`;
    const url = adminPreview ? `${baseUrl}?preview=admin` : baseUrl;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // For admin preview, include the auth token
    if (adminPreview) {
      const token = getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Report not found');
        }
        await handleApiError(response);
      }

      return await response.json();
    } catch (error) {
      handleNetworkError(error);
    }
  },
};

