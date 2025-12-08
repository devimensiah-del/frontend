import type { User } from './domain'

// Generic API response wrapper
export interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}

// Paginated response for list endpoints
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Authentication response
export interface AuthResponse {
  user: User
  access_token: string
  expires_in: number
}

// Error response from API
export interface ApiError {
  error: string
  code?: string
  details?: Record<string, string[]>
}

// Create submission request - matches backend CreateSubmissionRequest (camelCase)
export interface CreateSubmissionRequest {
  // Required fields
  companyName: string
  challengeCategory: 'growth' | 'transform' | 'transition' | 'compete' | 'funding'
  challengeType: string
  businessChallenge: string
  // Optional company fields
  cnpj?: string
  industry?: string
  companySize?: string
  website?: string
  // Additional contact and business context (JSON string)
  additionalInfo?: string
}

// Create submission response
export interface CreateSubmissionResponse {
  submission_id: string
  message: string
}

// Create company request
export interface CreateCompanyRequest {
  name: string
  cnpj?: string
  website?: string
  industry?: string
  company_size?: string
  location?: string
}

// Framework CRUD types
export interface CreateFrameworkRequest {
  code: string
  name: string
  description: string
  category: string
  dependencies?: string[]
  output_schema: Record<string, unknown>
  prompt_template: string
  is_active: boolean
}

// id is passed separately in the hook
export type UpdateFrameworkRequest = Partial<CreateFrameworkRequest>

// Challenge data for re-analysis (matches backend ReAnalyzeRequest)
export interface ChallengeData {
  challenge_category: 'growth' | 'transform' | 'transition' | 'compete' | 'funding'
  challenge_type: string
  business_challenge: string
}

// Macro indicators
export interface MacroIndicatorValue {
  value: number
  recorded_at: string
}

export interface MacroIndicators {
  selic?: MacroIndicatorValue
  ipca?: MacroIndicatorValue
  usd_brl?: MacroIndicatorValue
  last_updated?: string
}

export interface IndicatorHistory {
  indicator: string
  history?: Array<{
    value: number
    recorded_at: string
  }>
  values?: Array<{
    date: string
    value: number
  }>
}

// System metrics for admin dashboard
export interface SystemMetrics {
  system_health?: string
  analyses_24h?: number
  enrichment_success_rate?: number
  analysis_success_rate?: number
  average_analysis_time_seconds?: number
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
