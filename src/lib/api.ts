import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import type {
  Company,
  Challenge,
  ChallengeCategory,
  ChallengeType,
  Analysis,
  WizardState,
  WizardSummary,
  Submission,
  User,
} from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

// Create axios instance with base configuration
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 - unauthorized
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        // Redirect to login if not already there
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

// ============================================================================
// Auth API
// ============================================================================

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  fullName: string
}

export interface AuthResponse {
  user: User
  access_token: string
  expires_in: number
}

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/auth/login', data),

  signup: (data: SignupRequest) =>
    api.post<AuthResponse>('/auth/signup', data),

  logout: () =>
    api.post('/auth/logout'),

  getMe: () =>
    api.get<{ user: User }>('/auth/me'),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),

  updatePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/update-password', { current_password: currentPassword, new_password: newPassword }),
}

// ============================================================================
// Companies API
// ============================================================================

export interface CompanyListResponse {
  companies: Company[]
  total: number
  page: number
  pageSize: number
}

export const companiesApi = {
  // Get user's companies (owned or allowed)
  getMyCompanies: () =>
    api.get<CompanyListResponse>('/companies'),

  // Get single company by ID
  getCompany: (id: string) =>
    api.get<{ company: Company }>(`/companies/${id}`),

  // Create a new company
  createCompany: (data: Partial<Company>) =>
    api.post<{ company: Company }>('/companies', data),

  // Update company
  updateCompany: (id: string, data: Partial<Company>) =>
    api.put<{ company: Company }>(`/companies/${id}`, data),

  // Delete company
  deleteCompany: (id: string) =>
    api.delete(`/companies/${id}`),

  // Re-enrich company data
  reEnrichCompany: (id: string) =>
    api.post(`/companies/${id}/re-enrich`),

  // Get company with challenges included
  getWithChallenges: (id: string) =>
    api.get<{ company: Company & { challenges: Challenge[] } }>(`/companies/${id}?include=challenges`),
}

// ============================================================================
// Challenges API
// ============================================================================

export interface CreateChallengeRequest {
  company_id: string
  challenge_category: ChallengeCategory
  challenge_type: ChallengeType
  business_challenge: string
}

export interface ChallengeTypesResponse {
  categories: string[]
  types: Array<{
    code: string
    name: string
    description: string
    category: string
    emoji: string
  }>
}

export const challengesApi = {
  // Get challenge types (for forms)
  getTypes: () =>
    api.get<ChallengeTypesResponse>('/challenges/types'),

  // Create a new challenge for a company
  create: (data: CreateChallengeRequest) =>
    api.post<{ challenge: Challenge }>('/challenges', data),

  // Update challenge
  update: (id: string, data: Partial<Challenge>) =>
    api.put<{ challenge: Challenge }>(`/challenges/${id}`, data),

  // Delete challenge
  delete: (id: string) =>
    api.delete(`/challenges/${id}`),

  // Get challenges for a company
  getByCompany: (companyId: string) =>
    api.get<{ challenges: Challenge[] }>(`/companies/${companyId}/challenges`),
}

// ============================================================================
// Wizard API
// ============================================================================

export interface StartWizardRequest {
  company_id: string
  challenge_id: string
}

export interface StartWizardResponse {
  analysis_id: string
  message: string
}

export interface GenerateStepRequest {
  human_context?: string
  human_answers?: Record<string, string>
}

export interface RefineStepRequest {
  feedback: string
}

export const wizardApi = {
  // Start a new wizard (creates analysis)
  start: (data: StartWizardRequest) =>
    api.post<StartWizardResponse>('/wizard/start', data),

  // Get current wizard state
  getState: (analysisId: string) =>
    api.get<WizardState>(`/analyses/${analysisId}/wizard`),

  // Generate current step
  generate: (analysisId: string, data?: GenerateStepRequest) =>
    api.post<WizardState>(`/analyses/${analysisId}/wizard/generate`, data || {}),

  // Approve current step
  approve: (analysisId: string) =>
    api.post<WizardState>(`/analyses/${analysisId}/wizard/approve`),

  // Refine current step with feedback
  refine: (analysisId: string, data: RefineStepRequest) =>
    api.post<WizardState>(`/analyses/${analysisId}/wizard/refine`, data),

  // Get wizard summary (all steps status)
  getSummary: (analysisId: string) =>
    api.get<WizardSummary>(`/analyses/${analysisId}/wizard/summary`),

  // Admin: Generate all frameworks at once
  generateAll: (analysisId: string) =>
    api.post(`/admin/analyses/${analysisId}/wizard/generate-all`),
}

// ============================================================================
// Analysis API
// ============================================================================

export const analysisApi = {
  // Get analysis by ID (user route)
  getById: (id: string) =>
    api.get<{ analysis: Analysis }>(`/analyses/${id}`),

  // Get analysis by submission (legacy)
  getBySubmission: (submissionId: string) =>
    api.get<{ analysis: Analysis }>(`/submissions/${submissionId}/analysis`),
}

// ============================================================================
// Submissions API (for legacy flows and admin)
// ============================================================================

export interface CreateSubmissionRequest {
  companyName: string
  challengeCategory: ChallengeCategory
  challengeType: ChallengeType
  businessChallenge: string
  cnpj?: string
  industry?: string
  companySize?: string
  website?: string
  additionalInfo?: string
}

export interface CreateSubmissionResponse {
  submission: {
    id: string
    companyId: string
    challengeId: string
    createdAt: string
    updatedAt: string
  }
}

export const submissionsApi = {
  // Create submission (public endpoint)
  create: (data: CreateSubmissionRequest) =>
    api.post<CreateSubmissionResponse>('/submissions', data),

  // Get submission by ID
  getById: (id: string) =>
    api.get<{ submission: Submission }>(`/submissions/${id}`),

  // List user's submissions
  list: (params?: { page?: number; pageSize?: number; status?: string }) =>
    api.get<{ data: Submission[]; total: number; page: number; pageSize: number; totalPages: number }>('/submissions', { params }),
}

// ============================================================================
// Admin API
// ============================================================================

export interface SystemMetrics {
  system_health?: string
  analyses_24h?: number
  enrichment_success_rate?: number
  analysis_success_rate?: number
  avg_analysis_time_ms?: number
  total_llm_cost_24h?: number
  total_tokens_24h?: number
  recent_errors?: Array<{
    id: string
    type: string
    message: string
    timestamp: string
  }>
}

export const adminApi = {
  // Submissions
  listSubmissions: (params?: { page?: number; pageSize?: number }) =>
    api.get<{ submissions: Submission[]; total: number }>('/admin/submissions', { params }),

  getSubmission: (id: string) =>
    api.get<{ submission: Submission }>(`/admin/submissions/${id}`),

  // Companies
  listCompanies: (params?: { page?: number; pageSize?: number }) =>
    api.get<{ companies: Company[]; total: number }>('/admin/companies', { params }),

  getCompany: (id: string) =>
    api.get<{ company: Company }>(`/admin/companies/${id}`),

  retryEnrichment: (companyId: string) =>
    api.post(`/admin/companies/${companyId}/retry-enrichment`),

  reAnalyzeCompany: (companyId: string) =>
    api.post(`/admin/companies/${companyId}/re-analyze`),

  // Analysis
  getAnalysis: (id: string) =>
    api.get<{ analysis: Analysis }>(`/admin/analysis/${id}`),

  toggleVisibility: (id: string) =>
    api.post(`/admin/analysis/${id}/visibility`),

  togglePublic: (id: string) =>
    api.post(`/admin/analysis/${id}/public`),

  generateAccessCode: (id: string) =>
    api.post<{ access_code: string }>(`/admin/analysis/${id}/access-code`),

  generateAllSteps: (id: string) =>
    api.post(`/admin/analysis/${id}/wizard/generate-all`),

  // Metrics
  getMetrics: () =>
    api.get<SystemMetrics>('/admin/metrics'),
}

// ============================================================================
// Public API (no auth required)
// ============================================================================

export interface PublicReportResponse {
  id: string
  status: string
  company_name: string
  industry?: string
  business_challenge?: string
  framework_results: Record<string, unknown>
  is_public: boolean
  created_at: string
}

export const publicApi = {
  // Get public report by access code
  getReport: (code: string) =>
    api.get<PublicReportResponse>(`/public/report/${code}`),
}

// Export typed API methods
export default api
