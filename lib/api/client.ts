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
  Company,
  CompanyListResponse,
  AdminCompanyListResponse,
  CompanyDetailResponse,
  AdminCompanyDetailResponse,
  CompanySubmission,
  DataHistoryEntry,
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
   * Get enrichment by ID (admin only)
   */
  async getEnrichmentById(enrichmentId: string): Promise<Enrichment> {
    const response = await apiRequest<{ enrichment: Enrichment }>(
      `/admin/enrichment/${enrichmentId}`
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
   * Get analysis by ID (admin only)
   */
  async getAnalysisById(analysisId: string): Promise<Analysis> {
    const response = await apiRequest<{ analysis: Analysis }>(
      `/admin/analysis/${analysisId}`
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
   * Send analysis to client (deprecated - use toggleVisibility)
   */
  async sendAnalysis(analysisId: string, _email: string): Promise<{ analysis: Analysis; message: string }> {
    // In the new architecture, "sending" is the same as making visible
    return apiRequest(`/admin/analysis/${analysisId}/visibility`, {
      method: 'POST',
      body: JSON.stringify({ visible: true }),
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
   * Toggle blur status for premium frameworks (admin only)
   * When blurred=true, premium frameworks are hidden behind a paywall blur
   */
  async toggleBlur(analysisId: string, blurred: boolean): Promise<{ analysis: Analysis; message: string }> {
    return apiRequest(`/admin/analysis/${analysisId}/blur`, {
      method: 'POST',
      body: JSON.stringify({ blurred }),
    });
  },
};

/**
 * Macroeconomics API (Admin only)
 * Manages ALL economic indicators dynamically from database
 */
export interface MacroIndicator {
  code: string;
  name: string;
  category: string;
  value: number;
  unit: string;
  effective_date: string;
  reference_period?: string;
  source_code: string;
  fetched_at: string;
}

export interface MacroSnapshot {
  indicators: Record<string, MacroIndicator>;
  as_of: string;
}

export interface MacroHistoryValue {
  id: string;
  value: number;
  effective_date: string;
  reference_period?: string;
  source_code: string;
  fetched_at: string;
}

// Category configuration for display
export const MACRO_CATEGORIES: Record<string, { label: string; order: number }> = {
  interest_rate: { label: 'Taxa de Juros', order: 1 },
  inflation: { label: 'Inflação', order: 2 },
  exchange_rate: { label: 'Câmbio', order: 3 },
  gdp: { label: 'PIB', order: 4 },
  production: { label: 'Produção e Serviços', order: 5 },
  employment: { label: 'Emprego', order: 6 },
  construction: { label: 'Construção', order: 7 },
};

export const macroApi = {
  /**
   * Get latest snapshot of ALL macro indicators
   */
  async getLatestSnapshot(): Promise<{ snapshot: MacroSnapshot | null; message?: string }> {
    return apiRequest('/admin/macro/latest');
  },

  /**
   * Refresh all macro indicators
   */
  async refreshAll(): Promise<{ message: string; snapshot: MacroSnapshot }> {
    return apiRequest('/admin/macro/refresh', {
      method: 'POST',
    });
  },

  /**
   * Refresh a specific indicator by code
   * @param code - Indicator code (e.g., 'selic', 'ipca', 'gdp_growth')
   */
  async refreshIndicator(code: string): Promise<{ message: string; indicator: string; snapshot: MacroSnapshot }> {
    return apiRequest(`/admin/macro/refresh/${code}`, {
      method: 'POST',
    });
  },

  /**
   * Get historical values for an indicator
   * @param code - Indicator code
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getHistory(
    code: string,
    from?: string,
    to?: string
  ): Promise<{ indicator: string; count: number; from: string; to: string; history: MacroHistoryValue[] }> {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    const query = params.toString();
    const endpoint = query ? `/admin/macro/history/${code}?${query}` : `/admin/macro/history/${code}`;
    return apiRequest(endpoint);
  },
};

/**
 * Companies API (User endpoints)
 * Company-centric model for viewing user's companies
 */
export const companiesApi = {
  /**
   * Get all companies where the user is owner or in allowed_users
   */
  async getMyCompanies(): Promise<CompanyListResponse> {
    return apiRequest('/companies');
  },

  /**
   * Get company details by ID (user must have access)
   */
  async getById(id: string): Promise<CompanyDetailResponse> {
    return apiRequest(`/companies/${id}`);
  },

  /**
   * Add a user to company's allowed_users (owner or admin only)
   */
  async addUser(companyId: string, userId: string): Promise<{ message: string }> {
    return apiRequest(`/companies/${companyId}/users`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
  },

  /**
   * Remove a user from company's allowed_users (owner or admin only)
   */
  async removeUser(companyId: string, userId: string): Promise<{ message: string }> {
    return apiRequest(`/companies/${companyId}/users/${userId}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Admin Companies API
 * Company management for administrators
 */
export const adminCompaniesApi = {
  /**
   * List all companies with pagination (admin only)
   */
  async listAll(params?: { limit?: number; offset?: number }): Promise<AdminCompanyListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const query = queryParams.toString();
    const endpoint = query ? `/admin/companies?${query}` : '/admin/companies';

    return apiRequest(endpoint);
  },

  /**
   * Get company details with submissions and history (admin only)
   */
  async getById(id: string): Promise<AdminCompanyDetailResponse> {
    return apiRequest(`/admin/companies/${id}`);
  },

  /**
   * Verify a company (locks CNPJ uniqueness)
   */
  async verify(companyId: string): Promise<{ message: string; data: { company_id: string; is_verified: boolean; cnpj?: string } }> {
    return apiRequest(`/admin/companies/${companyId}/verify`, {
      method: 'POST',
    });
  },

  /**
   * Unverify a company
   */
  async unverify(companyId: string): Promise<{ message: string; data: { company_id: string; is_verified: boolean } }> {
    return apiRequest(`/admin/companies/${companyId}/unverify`, {
      method: 'POST',
    });
  },

  /**
   * Add a user to company's allowed_users (admin)
   */
  async addUser(companyId: string, userId: string): Promise<{ message: string }> {
    return apiRequest(`/admin/companies/${companyId}/users`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
  },

  /**
   * Remove a user from company's allowed_users (admin)
   */
  async removeUser(companyId: string, userId: string): Promise<{ message: string }> {
    return apiRequest(`/admin/companies/${companyId}/users/${userId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Transfer company ownership to a new user
   */
  async transferOwnership(companyId: string, newOwnerId: string): Promise<{ message: string; data: { company_id: string; new_owner_id: string } }> {
    return apiRequest(`/admin/companies/${companyId}/transfer-ownership`, {
      method: 'POST',
      body: JSON.stringify({ new_owner_id: newOwnerId }),
    });
  },

  /**
   * Update company fields (admin only)
   * Updated fields become auto-verified
   */
  async updateCompany(companyId: string, fields: Record<string, unknown>): Promise<{ company: Company; message: string }> {
    return apiRequest(`/admin/companies/${companyId}`, {
      method: 'PUT',
      body: JSON.stringify({ fields }),
    });
  },

  /**
   * Re-enrich company (create new submission + enrichment)
   */
  async reEnrich(companyId: string): Promise<{ message: string; data: { submission_id: string; enrichment_id: string; company_id: string } }> {
    return apiRequest(`/admin/companies/${companyId}/re-enrich`, {
      method: 'POST',
    });
  },

  /**
   * Re-analyze company using the last submission's challenge
   * (create new submission, copy enrichment, trigger analysis)
   */
  async reAnalyze(companyId: string): Promise<{ message: string; data: { submission_id: string; enrichment_id: string; company_id: string } }> {
    return apiRequest(`/admin/companies/${companyId}/re-analyze`, {
      method: 'POST',
    });
  },

  /**
   * Analyze company with a NEW challenge (create new submission, copy enrichment, trigger analysis)
   * @param companyId - The company ID
   * @param newChallenge - The business challenge to analyze (required)
   */
  async analyzeWithNewChallenge(companyId: string, newChallenge: string): Promise<{ message: string; data: { submission_id: string; enrichment_id: string; company_id: string } }> {
    return apiRequest(`/admin/companies/${companyId}/re-analyze`, {
      method: 'POST',
      body: JSON.stringify({ new_challenge: newChallenge }),
    });
  },

  /**
   * Enrich and analyze company (create new submission, enrich, then auto-analyze)
   */
  async enrichAndAnalyze(companyId: string): Promise<{ message: string; data: { submission_id: string; enrichment_id: string; company_id: string } }> {
    return apiRequest(`/admin/companies/${companyId}/enrich-and-analyze`, {
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
  macro: macroApi,
  companies: companiesApi,
  adminCompanies: adminCompaniesApi,
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

