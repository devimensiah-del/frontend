/**
 * Domain Types for frontend_v2
 * These types mirror the backend Go structs exactly
 */

// ============================================================================
// User Types
// ============================================================================

export type UserRole = 'admin' | 'user' | 'super_admin' | 'service_role'

export interface User {
  id: string
  email: string
  fullName: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

// ============================================================================
// Submission Types
// ============================================================================

// Submission status - derived from related entities
export type SubmissionStatus = 'pending' | 'enriching' | 'enriched' | 'analyzing' | 'completed' | 'failed'

export interface Submission {
  id: string
  userId?: string
  companyName: string
  cnpj?: string
  companyWebsite?: string
  companyIndustry?: string
  companySize?: string
  companyLocation?: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  contactPosition?: string
  targetMarket?: string
  annualRevenueMin?: number
  annualRevenueMax?: number
  fundingStage?: string
  additionalNotes?: string
  linkedinUrl?: string
  twitterHandle?: string
  challengeCategory?: 'growth' | 'transform' | 'compete'
  challengeType?: string
  businessChallenge?: string
  status: SubmissionStatus
  createdAt: string
  updatedAt: string
  companyId?: string
  challengeId?: string
  analysisId?: string
  analysisStatus?: AnalysisStatus
  pdfUrl?: string
}

export interface SubmissionListItem {
  id: string
  companyName: string
  status: SubmissionStatus
  companyId?: string
  challengeId?: string
  analysisId?: string
  createdAt: string
}

// ============================================================================
// Company Types
// ============================================================================

export type EnrichmentStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface Company {
  id: string
  name: string
  cnpj?: string
  website?: string
  // Business context
  industry?: string
  company_size?: string
  location?: string
  target_market?: string
  funding_stage?: string
  annual_revenue_min?: number
  annual_revenue_max?: number
  // Enriched data
  foundation_year?: string
  legal_name?: string
  headquarters?: string
  sector?: string
  target_audience?: string
  value_proposition?: string
  employees_range?: string
  revenue_estimate?: string
  business_model?: string
  market_share_status?: string
  digital_maturity?: number
  competitors?: string[]
  strengths?: string[]
  weaknesses?: string[]
  // Industry context (from enrichment)
  industry_growth_rate?: string       // e.g., "+12% CAGR"
  industry_trends?: string[]          // e.g., ["AI adoption", "Sustainability"]
  regulatory_context?: string         // Key regulatory information
  market_concentration?: string       // e.g., "Fragmentado", "Concentrado"
  enrichment_sources?: string[]       // URLs of sources used
  // Social links
  linkedin_url?: string
  twitter_handle?: string
  // Enrichment status
  enrichment_status: EnrichmentStatus
  enrichment_completed_at?: string
  enrichment_error?: string
  // Access control
  allowed_users: string[]
  owner_id?: string
  // Timestamps
  created_at: string
  updated_at: string
  // Derived
  challenges?: Challenge[]
}

// ============================================================================
// Challenge Types
// ============================================================================

export type ChallengeCategory = 'growth' | 'transform' | 'compete'

export type ChallengeType =
  // Growth
  | 'growth_organic'
  | 'growth_geographic'
  | 'growth_segment'
  | 'growth_product'
  | 'growth_channel'
  // Transform
  | 'transform_digital'
  | 'transform_model'
  // Compete
  | 'compete_differentiate'
  | 'compete_defend'
  | 'compete_reposition'

export interface Challenge {
  id: string
  company_id: string
  challenge_category: ChallengeCategory
  challenge_type: ChallengeType
  business_challenge: string
  created_at: string
  updated_at: string
  // Derived from related analyses (populated by API)
  latest_analysis?: Analysis
  analysis_count?: number
}

// ============================================================================
// Analysis Types
// ============================================================================

export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed'

// PESTEL Framework
export interface PESTELAnalysis {
  political: string[]
  economic: string[]
  social: string[]
  technological: string[]
  environmental: string[]
  legal: string[]
  summary: string
}

// Porter's 7 Forces
export interface PorterForce {
  force: string
  intensity: string
  description: string
}

export interface PorterAnalysis {
  forces: PorterForce[]
  overallAttractiveness: string
  summary: string
}

// TAM SAM SOM
export interface TamSamSomAnalysis {
  tam: string
  sam: string
  som: string
  assumptions: string[]
  cagr: string
  summary: string
  confidence_level?: number
  estimation_method?: string
  calculation_notes?: string
  caveat_message?: string
}

// SWOT with Confidence
export interface SWOTItem {
  content: string
  confidence: string
  source: string
}

export interface SWOTAnalysis {
  strengths: SWOTItem[]
  weaknesses: SWOTItem[]
  opportunities: SWOTItem[]
  threats: SWOTItem[]
  summary: string
}

// Benchmarking
export interface BenchmarkingAnalysis {
  competitorsAnalyzed: string[]
  performanceGaps: string[]
  bestPractices: string[]
  summary: string
}

// Blue Ocean
export interface BlueOceanAnalysis {
  eliminate: string[]
  reduce: string[]
  raise: string[]
  create: string[]
  newValueCurve: string
  summary: string
}

// Growth Loops
export interface GrowthLoop {
  name: string
  type: string
  steps: string[]
  metrics: string[]
  bottleneck: string
}

export interface GrowthHackingAnalysis {
  leap_loop: GrowthLoop
  scale_loop: GrowthLoop
  summary: string
}

// Scenarios
export interface Scenario {
  name: string
  probability: number
  description: string
  required_actions: string[]
}

export interface ScenariosAnalysis {
  optimistic: Scenario
  realist: Scenario
  pessimistic: Scenario
  mitigation_tactics: string[]
  early_warning_signals: string[]
  summary: string
}

// OKRs
export interface MonthlyOKR {
  month: string
  focus: string
  objective: string
  key_results: string[]
  investment: string
  aligned_recommendation: string
}

export interface OKRsAnalysis {
  plan_90_days?: MonthlyOKR[]
  total_investment?: string
  success_metrics?: string[]
  summary: string
}

// BSC
export interface BSCAnalysis {
  financial: string[]
  customer: string[]
  internal_processes: string[]
  learning_growth: string[]
  summary: string
}

// Decision Matrix
export interface PriorityRecommendation {
  priority: number
  title: string
  description: string
  timeline: string
  budget: string
}

export interface ReviewCycle {
  frequency: string
  extraordinary_triggers: string[]
}

export interface DecisionMatrixAnalysis {
  alternatives: string[]
  criteria: string[]
  final_recommendation: string
  recommended_option: string
  score: string
  score_comparison: string
  priority_recommendations: PriorityRecommendation[]
  review_cycle: ReviewCycle
  monitoring_metrics: string[]
  summary: string
}

// Synthesis
export interface Synthesis {
  executiveSummary: string
  keyFindings: string[]
  strategicPriorities: string[]
  roadmap: string[]
  overallRecommendation: string
}

// Framework Results container
export interface FrameworkResults {
  pestel: PESTELAnalysis
  porter: PorterAnalysis
  tamSamSom: TamSamSomAnalysis
  swot: SWOTAnalysis
  benchmarking: BenchmarkingAnalysis
  blueOcean: BlueOceanAnalysis
  growthHacking: GrowthHackingAnalysis
  scenarios: ScenariosAnalysis
  okrs: OKRsAnalysis
  bsc: BSCAnalysis
  decisionMatrix: DecisionMatrixAnalysis
  synthesis: Synthesis
}

// Full Analysis object (snake_case to match API response)
export interface Analysis {
  id: string
  submission_id: string
  challenge_id?: string
  company_id?: string
  status: AnalysisStatus
  pdf_url?: string
  is_visible_to_user?: boolean
  is_public?: boolean
  access_code?: string
  access_code_created_at?: string
  framework_results?: FrameworkResults
  error_message?: string
  created_at: string
  updated_at: string
  completed_at?: string
}

// ============================================================================
// Wizard Types
// ============================================================================

export interface ClarifyingQuestion {
  id: string
  question: string
}

export interface FrameworkStep {
  step: number
  code: string
  name: string
  description: string
  questions: ClarifyingQuestion[]
}

export interface WizardStepSummary {
  step: number
  framework_code: string
  framework_name: string
  status: string
  approved_at?: string
}

export interface WizardState {
  analysis_id: string
  current_step: number
  total_steps: number
  framework: FrameworkStep | null
  step_status: 'pending' | 'generating' | 'generated' | 'approved' | 'failed'
  output?: Record<string, unknown>
  human_context?: string
  human_answers?: Record<string, string>
  previous_steps: WizardStepSummary[]
  iteration_count: number
  error_message?: string
}

export interface WizardSummary {
  analysis_id: string
  total_steps: number
  completed_steps: number
  frameworks: Array<{
    code: string
    name: string
    status: string
  }>
}

// ============================================================================
// Framework Configuration Types
// ============================================================================

export interface Framework {
  id: string
  code: string
  name: string
  description: string
  category: string
  dependencies: string[]
  output_schema: Record<string, unknown>
  prompt_template: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// ============================================================================
// Public Report Types
// ============================================================================

export interface PublicReportData {
  id: string
  company_id?: string
  challenge_id?: string
  status: AnalysisStatus
  // Company information for display
  company_name?: string
  industry?: string
  business_challenge?: string
  // Framework results (using snake_case from API)
  framework_results: Record<string, unknown>
  // Visibility flags
  is_admin_preview?: boolean
  is_public?: boolean
  created_at: string
}
