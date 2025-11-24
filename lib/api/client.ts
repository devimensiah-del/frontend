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
} from '@/types';

import { handleApiError, handleNetworkError } from './error-handler';

// Get API base URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// --- MOCK DATA FOR DEVELOPMENT ---
const MOCK_DATA = {
  submission: {
    id: 'mock-id-1',
    userId: 'mock-admin-id',
    companyName: 'TechNova Solutions',
    website: 'https://technova.example.com',
    industry: 'SaaS / Artificial Intelligence',
    companySize: '51-200',
    businessChallenge: 'Estamos buscando expandir nossa operação para o mercado corporativo brasileiro, mas enfrentamos resistência devido à complexidade regulatória e concorrentes locais bem estabelecidos.',
    contactName: 'Ana Souza',
    contactEmail: 'ana@technova.example.com',
    status: 'received',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  enrichment: {
    id: 'mock-enrichment-1',
    submissionId: 'mock-id-1',
    status: 'approved',
    progress: 100,
    currentStep: 'Completed',
    data: {
      profile_overview: {
        legal_name: 'TechNova Solutions Ltda.',
        founded: '2018',
        headquarters: 'São Paulo, SP',
        description: 'Provider of AI-driven analytics for retail.'
      },
      market_context: {
        segment: 'B2B Enterprise',
        growth_rate: '15% YoY'
      }
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  analysis: {
    id: 'mock-analysis-1',
    submissionId: 'mock-id-1',
    status: 'approved',
    version: "v1",
    pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    analysis: {
      synthesis: {
        executiveSummary: 'A TechNova possui uma forte vantagem tecnológica, mas precisa navegar cuidadosamente o cenário regulatório brasileiro. Recomendamos uma estratégia de parcerias locais para mitigar riscos.',
        keyFindings: [
          'Tecnologia superior aos concorrentes locais.',
          'Marca ainda pouco conhecida no setor Enterprise.',
          'Alta demanda por analytics no varejo brasileiro.'
        ],
        strategicPriorities: [
          'Estabelecer parcerias com consultorias locais.',
          'Adequação total à LGPD.',
          'Campanha de brand awareness focada em casos de uso.'
        ],
        roadmap: [
          'Q1: Auditoria Legal e Compliance',
          'Q2: Programa de Canais e Parcerias',
          'Q3: Lançamento da suíte Enterprise V2'
        ],
        overallRecommendation: 'Expandir com cautela.'
      },
      swot: {
        summary: 'Posição tecnológica forte, mas vulnerável legalmente.',
        strengths: [{ content: 'Algoritmos proprietários de IA' }, { content: 'Equipe técnica ágil' }],
        weaknesses: [{ content: 'Fluxo de caixa limitado' }, { content: 'Falta de networking local' }],
        opportunities: [{ content: 'Digitalização do varejo pós-pandemia' }, { content: 'Incentivos fiscais para inovação' }],
        threats: [{ content: 'Entrada de players globais (Google, MS)' }, { content: 'Mudanças na legislação de dados' }]
      },
      pestel: {
        summary: 'Ambiente regulatório é o fator crítico.',
        political: ['Instabilidade política afeta investimentos'],
        economic: ['Taxa de juros alta encarece capital'],
        social: ['Adoção massiva de canais digitais'],
        technological: ['Infraestrutura de nuvem em expansão'],
        environmental: ['Pressão por TI verde'],
        legal: ['LGPD rigorosa e complexidade tributária']
      },
      porter: {
        summary: 'Rivalidade moderada, mas barreiras de entrada altas.',
        forces: [
          { force: 'Rivalidade entre Concorrentes', intensity: 'Alta', description: 'Muitas startups de nicho.' },
          { force: 'Poder de Permuta dos Clientes', intensity: 'Médio', description: 'Clientes Enterprise exigem customização.' },
          { force: 'Poder de Permuta dos Fornecedores', intensity: 'Baixo', description: 'Dependência de cloud commodity.' },
          { force: 'Ameaça de Novos Entrantes', intensity: 'Média', description: 'Barreiras tecnológicas existem.' },
          { force: 'Ameaça de Produtos Substitutos', intensity: 'Alta', description: 'Excel e BI tradicional.' }
        ]
      },
      // Add empty placeholders for other required fields to satisfy TS
      tamSamSom: { tam: '', sam: '', som: '', assumptions: [], cagr: '', summary: '' },
      benchmarking: { competitorsAnalyzed: [], performanceGaps: [], bestPractices: [], summary: '' },
      blueOcean: { eliminate: [], reduce: [], raise: [], create: [], newValueCurve: '', summary: '' },
      growthHacking: { hypotheses: [], experiments: [], keyMetrics: [], summary: '' },
      scenarios: { optimistic: '', realist: '', pessimistic: '', earlyWarningSignals: [], summary: '' },
      okrs: { quarters: [], summary: '' },
      bsc: { financial: [], customer: [], internal: [], learningGrowth: [], summary: '' },
      decisionMatrix: { alternatives: [], criteria: [], finalRecommendation: '', summary: '' }
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
};

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
    // Bypass auth in development mode if configured
    if (process.env.NODE_ENV === 'development') {
      console.log('[DEV] Bypassing auth - returning mock admin user');
      return {
        id: 'mock-admin-id',
        email: 'admin@imensiah.com',
        fullName: 'Admin Dev',
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

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
    if (process.env.NODE_ENV === 'development') {
      return MOCK_DATA.submission as unknown as Submission;
    }
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
    if (process.env.NODE_ENV === 'development') {
      return { submissions: [MOCK_DATA.submission as unknown as Submission], total: 1 };
    }
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
    if (process.env.NODE_ENV === 'development') {
      return MOCK_DATA.enrichment as unknown as Enrichment;
    }
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
   * Get analysis for submission (latest version)
   */
  async getBySubmissionId(submissionId: string): Promise<Analysis> {
    if (process.env.NODE_ENV === 'development') {
      return MOCK_DATA.analysis as unknown as Analysis;
    }
    const response = await apiRequest<{ analysis: Analysis }>(`/submissions/${submissionId}/analysis`);
    return response.analysis;
  },

  /**
   * Publish report and generate PDF
   * Returns JSON response with report_id and pdf_url (Supabase Storage link)
   */
  async publishReport(submissionId: string): Promise<{ report_id: string; pdf_url: string }> {
    if (process.env.NODE_ENV === 'development') {
      return { report_id: 'mock-report-id', pdf_url: MOCK_DATA.analysis.pdf_url };
    }
    return apiRequest(`/submissions/${submissionId}/report/publish`, {
      method: 'POST',
    });
  },

  /**
   * Download report PDF
   * Returns PDF URL with metadata when report is ready
   */
  async downloadReport(submissionId: string): Promise<{ pdf_url: string; report_id: string; created_at: string }> {
    if (process.env.NODE_ENV === 'development') {
      return { pdf_url: MOCK_DATA.analysis.pdf_url, report_id: 'mock-report-id', created_at: new Date().toISOString() };
    }
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
    if (process.env.NODE_ENV === 'development') {
      return {
        data: [MOCK_DATA.submission as unknown as Submission],
        total: 1,
        page: 1,
        pageSize: 10,
        totalPages: 1
      };
    }
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
    if (process.env.NODE_ENV === 'development') {
      return MOCK_DATA.submission as unknown as Submission;
    }
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
    if (process.env.NODE_ENV === 'development') {
      return {
        totalSubmissions: 12,
        activeSubmissions: 3,
        completedSubmissions: 9,
        revenue: 45000
      };
    }
    return apiRequest('/admin/analytics');
  },

  /**
 * Get enrichment by submission ID (admin only)
 */
  async getEnrichmentBySubmissionId(submissionId: string): Promise<Enrichment> {
    if (process.env.NODE_ENV === 'development') {
      return MOCK_DATA.enrichment as unknown as Enrichment;
    }
    const response = await apiRequest<{ enrichment: Enrichment }>(
      `/admin/submissions/${submissionId}/enrichment`
    );
    return response.enrichment;
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

  /**
   * Create new analysis version (admin only)
   */
  async createAnalysisVersion(analysisId: string, edits?: Record<string, any>): Promise<Analysis> {
    const response = await apiRequest<{ analysis: Analysis }>(
      `/admin/analysis/${analysisId}/version`,
      {
        method: 'POST',
        body: JSON.stringify({ edits }),
      }
    );
    return response.analysis;
  },

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

