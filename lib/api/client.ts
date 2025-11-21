/**
 * API Client with Real HTTP Calls to Go Backend
 * All functions make real requests to http://localhost:8080/api/v1
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
  ApiResponse,
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

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
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
   */
  async login(credentials: LoginFormData): Promise<{ user: User; token: string }> {
    const response = await apiRequest<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Save token to localStorage
    setAuthToken(response.token);

    return response;
  },

  /**
   * Signup new user
   */
  async signup(data: SignupFormData): Promise<{ user: User; token: string }> {
    const response = await apiRequest<{ user: User; token: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Save token to localStorage
    setAuthToken(response.token);

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
    } catch (error) {
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
      total: response.pagination.totalItems,
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
 */
export const enrichmentApi = {
  /**
   * Get enrichment data for submission
   */
  async getBySubmissionId(submissionId: string): Promise<Enrichment> {
    const response = await apiRequest<{ enrichment: Enrichment }>(`/submissions/${submissionId}/enrichment`);
    return response.enrichment;
  },

  /**
   * Approve enrichment data
   */
  async approve(submissionId: string): Promise<Enrichment> {
    const response = await apiRequest<{ enrichment: Enrichment }>(
      `/submissions/${submissionId}/enrichment/approve`,
      {
        method: 'PUT',
      }
    );

    return response.enrichment;
  },

  /**
   * Reject enrichment data
   */
  async reject(submissionId: string, reason: string): Promise<Enrichment> {
    const response = await apiRequest<{ enrichment: Enrichment }>(
      `/submissions/${submissionId}/enrichment/reject`,
      {
        method: 'PUT',
        body: JSON.stringify({ reason }),
      }
    );

    return response.enrichment;
  },

  /**
   * Update enrichment data (admin only)
   */
  async update(submissionId: string, data: Partial<Enrichment>): Promise<Enrichment> {
    const response = await apiRequest<{ enrichment: Enrichment }>(
      `/submissions/${submissionId}/enrichment`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );

    return response.enrichment;
  },
};

/**
 * Analysis API
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
   * Generate analysis for submission
   */
  async generate(submissionId: string): Promise<Analysis> {
    const response = await apiRequest<{ analysis: Analysis }>(
      `/submissions/${submissionId}/analysis`,
      {
        method: 'POST',
      }
    );

    return response.analysis;
  },

  /**
   * Update analysis
   */
  async update(submissionId: string, data: Partial<Analysis>): Promise<Analysis> {
    const response = await apiRequest<{ analysis: Analysis }>(
      `/submissions/${submissionId}/analysis`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );

    return response.analysis;
  },

  /**
   * Generate PDF report
   */
  async getPdf(submissionId: string): Promise<Blob> {
    const token = getAuthToken();
    const url = `${API_BASE_URL}/submissions/${submissionId}/analysis/pdf`;

    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, { headers });

      if (!response.ok) {
        await handleApiError(response);
      }

      return await response.blob();
    } catch (error) {
      handleNetworkError(error);
    }
  },

  /**
   * Send report to user email
   */
  async send(submissionId: string): Promise<{ message: string }> {
    return apiRequest(`/submissions/${submissionId}/analysis/send`, {
      method: 'POST',
    });
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
   * Update submission status
   */
  async updateSubmissionStatus(id: string, status: string): Promise<Submission> {
    const response = await apiRequest<{ submission: Submission }>(
      `/admin/submissions/${id}/status`,
      {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }
    );

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
