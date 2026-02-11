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
  passwordSet: boolean // false for auto-created users who need to set password
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

// 3-Step Enrichment Status Response
// Step 1: Basic Info (automatic at company creation)
// Step 2: Business Model (human-triggered)
// Step 3: Competitive Intelligence (human-triggered)
export interface CompanyEnrichmentStatus {
  company_id: string
  step1_status: EnrichmentStatus
  step1_completed_at?: string
  step1_error?: string
  step2_status: EnrichmentStatus
  step2_completed_at?: string
  step2_error?: string
  step3_status: EnrichmentStatus
  step3_completed_at?: string
  step3_error?: string
  can_trigger_step2: boolean
  can_trigger_step3: boolean
}

// Response from triggering enrichment step
export interface TriggerEnrichmentResponse {
  message: string
  data: {
    company_id: string
    company_name: string
    step: string
    status: string
  }
}

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
  trade_name?: string                 // Nome fantasia
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
  // CNPJ Registry data (from casadosdados.com.br)
  phone?: string                      // Corporate phone
  email?: string                      // Corporate email
  cnae_primary?: string               // Primary CNAE (code + description)
  cnae_codes?: string[]               // All CNAE codes
  capital_social?: string             // Registered capital (e.g., "R$ 1.000,00")
  partners?: string[]                 // Partners with roles
  cnpj_verified?: boolean             // True if data from official CNPJ registry
  // Geographic context (from Step 2 enrichment)
  geographic_regions?: string[]       // e.g., ["Brasil", "LATAM"]
  service_areas?: string[]            // e.g., ["SP", "RJ", "MG"]
  // Industry context (from enrichment)
  industry_growth_rate?: string       // e.g., "+12% CAGR"
  industry_trends?: string[]          // e.g., ["AI adoption", "Sustainability"]
  regulatory_context?: string         // Key regulatory information
  market_concentration?: string       // e.g., "Fragmentado", "Concentrado"
  enrichment_sources?: string[]       // URLs of sources used
  // Enrichment v3 fields
  main_products?: string[]
  customer_segments?: string[]
  pricing_model?: string
  unique_selling_points?: string[]
  recent_news?: string[]
  key_executives?: string[]
  company_history?: string
  opportunities?: string[]
  threats?: string[]
  strategic_challenges?: string[]
  competitor_details?: string[]
  competitive_advantage?: string
  market_share?: string
  tam_estimate?: string
  sam_estimate?: string
  som_estimate?: string
  // Social links
  linkedin_url?: string
  twitter_handle?: string
  instagram_url?: string
  facebook_url?: string
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

// Framework metadata for step-by-step analysis (IAH-2)
export interface FrameworkMeta {
  code: string
  name: string
  guidance_text: string
}

// ============================================================================
// Framework V2 Types (Database-driven frameworks)
// ============================================================================

export type FrameworkResultStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface ModelConfig {
  model: string
  temperature: number
  max_tokens: number
  fallback_model: string
}

// Framework V2 - database-driven framework configuration
export interface FrameworkV2 {
  id: string
  code: string
  name: string
  description?: string
  layer: number
  is_base: boolean
  is_active: boolean
  prompt_system?: string
  prompt_user: string
  prompt_json_template?: string
  model_config: ModelConfig
  created_at: string
  updated_at: string
}

// Framework result for a company
export interface FrameworkResult {
  id: string
  company_id: string
  framework_id: string
  challenge_id?: string
  result?: Record<string, unknown>
  status: FrameworkResultStatus
  error_message?: string
  version: number
  is_current: boolean
  context_hash?: string
  generated_at?: string
  is_stale?: boolean
  stale_reason?: string
  created_at: string
  updated_at: string
}

// Framework result with framework details
export interface FrameworkResultWithDetails {
  result: FrameworkResult
  framework: FrameworkV2
}

// Execution plan layer
export interface ExecutionLayer {
  layer_number: number
  frameworks: FrameworkV2[]
}

// Execution plan for frameworks
export interface ExecutionPlan {
  layers: ExecutionLayer[]
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

// ============================================================================
// 5-Step Analysis Types (Dependency Chain with Stale Tracking)
// ============================================================================

/**
 * Step definitions for the 5-step strategic analysis flow
 * Each step can have subtabs (e.g., Ambiente has Mercado/PESTEL/Porter)
 */
export interface AnalysisStepDefinition {
  number: number
  code: string
  name: string
  description: string
  frameworks: string[] // Framework codes in this step
  subtabs?: SubtabDefinition[]
}

export interface SubtabDefinition {
  code: string
  name: string
  frameworks: string[] // Framework codes for this subtab
}

// 5-Step structure with Portuguese labels
export const ANALYSIS_STEPS: AnalysisStepDefinition[] = [
  {
    number: 1,
    code: 'empresa',
    name: 'Empresa',
    description: 'Dados da empresa e contexto do negócio',
    frameworks: ['EMPRESA'],
  },
  {
    number: 2,
    code: 'negocio',
    name: 'Negócio',
    description: 'Modelo de negócios e proposta de valor',
    frameworks: ['NEGOCIO'],
  },
  {
    number: 3,
    code: 'ambiente',
    name: 'Ambiente',
    description: 'Análise do ambiente externo e competitivo',
    frameworks: ['MERCADO', 'PESTEL', 'PORTER'],
    subtabs: [
      { code: 'mercado', name: 'Mercado', frameworks: ['MERCADO'] },
      { code: 'pestel', name: 'PESTEL', frameworks: ['PESTEL'] },
      { code: 'porter', name: 'Porter', frameworks: ['PORTER'] },
    ],
  },
  {
    number: 4,
    code: 'diagnostico',
    name: 'Diagnóstico',
    description: 'Análise interna e cruzamento estratégico',
    frameworks: ['SWOT', 'SWOTCROSS'],
    subtabs: [
      { code: 'swot', name: 'SWOT', frameworks: ['SWOT'] },
      { code: 'swotcross', name: 'SWOT Cross', frameworks: ['SWOTCROSS'] },
    ],
  },
  {
    number: 5,
    code: 'desafios',
    name: 'Desafios',
    description: 'Definição de desafios estratégicos e prioridades',
    frameworks: ['DESAFIOS'],
  },
]

/**
 * Analysis state for a company - returned by GET /companies/:id/analysis-state
 */
export interface AnalysisState {
  company_id: string
  challenge_id?: string
  steps: StepState[]
  overall_progress: number // 0-100
  has_stale_frameworks: boolean
  can_generate_report: boolean
}

export interface StepState {
  step_number: number
  step_code: string
  step_name: string
  is_completed: boolean
  is_unlocked: boolean // true if previous step is complete
  frameworks: FrameworkState[]
}

export interface FrameworkState {
  code: string
  name: string
  status: FrameworkResultStatus
  result_id?: string
  is_stale: boolean
  stale_reason?: string
  stale_acknowledged_at?: string
  stale_acknowledged_by?: string
  version: number
  generated_at?: string
  can_execute: boolean
  missing_dependencies: string[]
}

/**
 * Stale frameworks response - GET /companies/:id/stale-frameworks
 */
export interface StaleFrameworksResponse {
  stale_results: StaleResultInfo[]
  total: number
}

export interface StaleResultInfo {
  result_id: string
  framework_code: string
  framework_name: string
  stale_reason: string
  stale_since?: string
  upstream_changes: UpstreamChange[]
  can_acknowledge: boolean
  can_rerun: boolean
}

export interface UpstreamChange {
  framework_code: string
  framework_name: string
  change_type: 'updated' | 'rerun' | 'new_version'
  changed_at: string
}

/**
 * Acknowledge stale request - POST /companies/:id/acknowledge-stale
 */
export interface AcknowledgeStaleRequest {
  result_ids: string[]
  action: 'acknowledge' | 'rerun' | 'rerun_cascade'
}

export interface AcknowledgeStaleResponse {
  acknowledged: number
  rerun_started: number
  message: string
}

/**
 * Framework readiness - GET /companies/:id/frameworks/:code/readiness
 */
export interface FrameworkReadinessResponse {
  framework_code: string
  is_ready: boolean
  mode: 'initial' | 'update'
  missing_dependencies: string[]
  dependency_status: DependencyStatus[]
  current_result?: {
    id: string
    version: number
    status: FrameworkResultStatus
    is_stale: boolean
  }
}

export interface DependencyStatus {
  code: string
  name: string
  is_completed: boolean
  is_stale: boolean
}

/**
 * Execute framework request - POST /companies/:id/frameworks/:code/execute
 */
export interface ExecuteFrameworkRequest {
  user_refinement?: string // User feedback for update mode
  force_rerun?: boolean // Force initial mode even if result exists
}

export interface ExecuteFrameworkResponse {
  message: string
  result_id: string
  mode: 'initial' | 'update'
  status: string
  framework: string
  previous_version?: number
  new_version: number
}

/**
 * Dependency chain info - GET /frameworks/:code/dependencies
 */
export interface DependencyChainResponse {
  framework_code: string
  dependencies: DependencyInfo[]
  dependents: DependencyInfo[]
  total_dependencies: number
  total_dependents: number
}

export interface DependencyInfo {
  code: string
  name: string
  layer: number
  is_required: boolean
}

/**
 * Update suggestion from comparing old/new results
 */
export interface UpdateSuggestion {
  previous_version: number
  new_version: number
  changes_summary: string
  field_changes: FieldChange[]
  recommendation: 'accept' | 'review' | 'reject'
}

export interface FieldChange {
  field: string
  change_type: 'added' | 'removed' | 'modified'
  old_value?: unknown
  new_value?: unknown
}
