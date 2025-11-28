/**
 * TypeScript Types matching Go Backend Models
 * All types mirror the backend structs exactly
 */

// ============================================================================
// Enums and Status Types
// ============================================================================

// NEW ARCHITECTURE: Submission status is ONLY 'received'
// All workflow state is tracked in Enrichment and Analysis entities
export type SubmissionStatus = 'received';

export type UserRole = 'admin' | 'user';

// ============================================================================
// User Types
// ============================================================================

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}
// ============================================================================
// Submission Types
// ============================================================================

export interface Submission {
  id: string;
  userId?: string;

  // Company Information (from backend_v3/domain/submission/model.go)
  companyName: string;
  cnpj?: string;
  website?: string;
  email?: string;
  industry?: string;
  companySize?: string;

  // Strategic Context
  strategicGoal?: string;
  currentChallenges?: string;
  competitivePosition?: string;
  additionalInfo?: string;

  // Legacy fields (for backward compatibility)
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactPosition?: string;
  targetMarket?: string;
  annualRevenueMin?: number;
  annualRevenueMax?: number;
  fundingStage?: string;
  businessChallenge?: string;
  additionalNotes?: string;
  linkedinUrl?: string;
  twitterHandle?: string;
  location?: string;

  // Metadata
  status: SubmissionStatus;
  paymentStatus?: string;
  createdAt: string;
  updatedAt: string;

  // Relationships
  enrichmentId?: string;
  analysisId?: string;
  reportId?: string;

  // PDF URL (Only present if status === 'completed')
  pdfUrl?: string;
  pdf_url?: string; // Backend uses snake_case
}

// ============================================================================
// Enrichment Types (The Researcher Agent)
// ============================================================================

// Enrichment workflow: pending -> completed -> approved
export type EnrichmentStatus =
  | 'pending'      // Initial state, waiting for worker
  | 'completed'     // Worker completed, waiting for admin review
  | 'approved';    // Admin approved, ready for analysis

// =================================================================
// SUBMITTED DATA (User form input - preserved exactly as submitted)
// Mirrors backend_v3/domain/enrichment/model.go SubmittedData struct
// =================================================================
export interface SubmittedData {
  // Required fields (always present)
  company_name: string;
  contact_name: string;
  contact_email: string;
  business_challenge: string;

  // Optional fields (may be empty)
  cnpj?: string;
  website?: string;
  industry?: string;
  company_size?: string;
  location?: string;
  contact_phone?: string;
  contact_position?: string;
  target_market?: string;
  funding_stage?: string;
  annual_revenue_min?: number;
  annual_revenue_max?: number;
  additional_notes?: string;
  linkedin_url?: string;
  twitter_handle?: string;
}

// =================================================================
// DISCOVERED DATA (AI-enriched public information not provided by user)
// Mirrors backend_v3/domain/enrichment/model.go DiscoveredData struct
// =================================================================
export interface DiscoveredData {
  cnpj?: string;
  website?: string;
  linkedin_url?: string;
  twitter_handle?: string;
  industry?: string;
  company_size?: string;
  location?: string;
  foundation_year?: string;
  funding_stage?: string;
  annual_revenue_estimate?: string;
  target_market?: string;
}

// Macro-Economic & Industry Context (Addresses "Brazil blind spot")
export interface EconomicIndicators {
  country: string;
  gdp_growth: string;
  inflation_rate: string;
  interest_rate: string;
  exchange_rate: string;
  unemployment_rate: string;
  political_stability: string;
  economic_outlook: string;
  recent_policy_changes: string[];
}

export interface IndustryTrends {
  industry_sector: string;
  growth_rate: string;
  market_maturity: string;
  technology_adoption: string;
  competitive_intensity: string;
  regulatory_environment: string;
  key_innovations: string[];
  disruptive_forces: string[];
}

export interface RegulatoryLandscape {
  recent_changes: string[];
  upcoming_regulations: string[];
  compliance_requirements: string[];
  industry_standards: string[];
}

export interface MarketSignals {
  consumer_trends: string[];
  investment_climate: string;
  talent_availability: string;
  infrastructure_development: string;
}

export interface MacroContext {
  economic_indicators: EconomicIndicators;
  industry_trends: IndustryTrends;
  regulatory_landscape: RegulatoryLandscape;
  market_signals: MarketSignals;
  data_sources: string[];
  last_updated: string;
}

export interface Enrichment {
  id: string;
  submissionId: string;

  // The JSONMap stored in Postgres - matches backend UnifiedProfile structure
  data: {
    // NEW: User form input preserved exactly as submitted
    submitted_data?: SubmittedData;
    // NEW: AI-discovered public data not provided by user
    discovered_data?: DiscoveredData;
    // Existing enrichment fields (profile intelligence)
    profile_overview?: {
      legal_name: string;
      website: string;
      foundation_year: string;
      headquarters: string;
      description?: string; // Added optional description field
    };
    financials?: {
      employees_range: string;
      revenue_estimate: string;
      business_model: string;
    };
    market_position?: {
      sector: string;
      target_audience: string;
      value_proposition: string;
    };
    strategic_assessment?: {
      digital_maturity: number;
      strengths: string[];
      weaknesses: string[];
    };
    competitive_landscape?: {
      competitors: string[];
      market_share_status: string;
    };
    macro_context?: MacroContext; // Real-time macro-economic data
    // Allow any additional fields from AI
    [key: string]: any;
  };

  status: EnrichmentStatus;
  progress: number;  // Worker progress percentage (0-100)
  currentStep: string;  // Current step description
  isLocked?: boolean; // Admin lock flag
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Analysis Types (The 11 Frameworks from Go Backend)
// ============================================================================

// 1. PESTEL
export interface PESTELAnalysis {
  political: string[];
  economic: string[];
  social: string[];
  technological: string[];
  environmental: string[];
  legal: string[];
  summary: string;
}

// 2. Porter's 7 Forces (Extended Model)
export interface PorterForce {
  force: string;
  intensity: string;
  description: string;
}

export interface PorterAnalysis {
  // Extended 7 Forces Model
  forces: PorterForce[];

  // Backward compatibility: individual fields (optional)
  competitiveRivalry?: string;
  supplierPower?: string;
  buyerPower?: string;
  threatNewEntrants?: string;
  threatSubstitutes?: string;
  powerOfPartnerships?: string;
  aiDataDisruption?: string;

  overallAttractiveness: string;
  summary: string;
}

// 3. TAM SAM SOM
export interface DataSourcesUsed {
  government_data?: string[];
  industry_reports?: string[];
  company_data?: string[];
  web_search?: string[];
}

export interface TamSamSomAnalysis {
  tam: string;
  sam: string;
  som: string;
  assumptions: string[];
  cagr: string;
  summary: string;

  // V2: Estimation transparency fields (optional for backwards compatibility)
  confidence_level?: number;          // 0-100 scale
  estimation_method?: string;         // e.g., "Top-down with sector benchmarks"
  calculation_notes?: string;         // Detailed calculation explanation
  data_sources_used?: DataSourcesUsed;
  caveat_message?: string;            // Warning for low-confidence estimates

  // Legacy fields (kept for backwards compatibility)
  data_quality?: string;
}

// 4. SWOT with Confidence & Source Attribution
export interface SWOTItem {
  content: string;
  confidence: string;  // "Alta" | "Média" | "Baixa"
  source: string;       // e.g., "análise de mercado", "dados financeiros"
}

export interface SWOTAnalysis {
  strengths: SWOTItem[];
  weaknesses: SWOTItem[];
  opportunities: SWOTItem[];
  threats: SWOTItem[];
  summary: string;
}

// 5. Benchmarking
export interface BenchmarkingAnalysis {
  competitorsAnalyzed: string[];
  performanceGaps: string[];
  bestPractices: string[];
  summary: string;
}

// 6. Blue Ocean
export interface BlueOceanAnalysis {
  eliminate: string[];
  reduce: string[];
  raise: string[];
  create: string[];
  newValueCurve: string;
  summary: string;
}

// 7. Growth Hacking
// 7. Growth Loop
export interface GrowthLoop {
  name: string;
  type: string;
  steps: string[];
  metrics: string[];
  bottleneck: string;
}

export interface GrowthHackingAnalysis {
  leap_loop: GrowthLoop;
  scale_loop: GrowthLoop;
  summary: string;
}

// 8. Scenarios
export interface Scenario {
  name: string;
  probability: number;
  description: string;
  required_actions: string[];
}

export interface ScenariosAnalysis {
  optimistic: Scenario;
  realist: Scenario;
  pessimistic: Scenario;
  mitigation_tactics: string[];
  early_warning_signals: string[];
  summary: string;
}

// 9. OKRs (Quarterly Model + 90-Day Plan)
export interface KeyResult {
  description: string;
  target: string;
  measurement: string;
}

// V1 Legacy: Quarterly format (Q1 2025, Q2 2025, etc.)
export interface QuarterlyOKR {
  quarter: string;              // "Q1 2025", "Q2 2025", "Q3 2025"
  objective: string;
  key_results: string[];        // Simple strings
  keyResults?: string[];        // Alternative casing
  investment: string;
  investment_estimate?: string; // Alternative field name
  timeline: string;
}

// V2: Monthly format (Mês 1, Mês 2, Mês 3) for 90-Day Plans
export interface MonthlyOKR {
  month: string;                // "Mês 1", "Mês 2", "Mês 3"
  focus: string;                // "Fundação", "Crescimento", "Consolidação"
  objective: string;
  key_results: string[];
  keyResults?: string[];        // Alternative casing
  investment: string;
  aligned_recommendation: string;  // Links to Decision Matrix
  alignedRecommendation?: string;  // Alternative casing
}

export interface OKRsAnalysis {
  // V2: 90-Day Plan format with monthly milestones (preferred)
  plan_90_days?: MonthlyOKR[];
  plan90Days?: MonthlyOKR[];    // Alternative casing
  total_investment?: string;
  totalInvestment?: string;     // Alternative casing
  success_metrics?: string[];
  successMetrics?: string[];    // Alternative casing

  // V1 Legacy: Quarterly format (for backwards compatibility)
  quarters?: QuarterlyOKR[];

  // Very old format (optional)
  objectives?: Array<{
    title: string;
    keyResults: string[];
  }>;

  summary: string;
}

// 10. Balanced Scorecard (BSC)
export interface BSCAnalysis {
  financial: string[];
  customer: string[];
  internal_processes: string[];
  learning_growth: string[];
  summary: string;
}

// 11. Decision Matrix
export interface PriorityRecommendation {
  priority: number;
  title: string;
  description: string;
  timeline: string;
  budget: string;
}

export interface ReviewCycle {
  frequency: string;
  extraordinary_triggers: string[];
}

export interface DecisionMatrixAnalysis {
  alternatives: string[];
  criteria: string[];
  final_recommendation: string;
  recommended_option: string;
  score: string;
  score_comparison: string;
  priority_recommendations: PriorityRecommendation[];
  review_cycle: ReviewCycle;
  monitoring_metrics: string[];
  summary: string;
}

// Synthesis (Executive Summary)
export interface Synthesis {
  executiveSummary: string;
  keyFindings: string[];
  strategicPriorities: string[];
  roadmap: string[];
  overallRecommendation: string;
}

// Analysis workflow: pending → completed → approved → sent
export type AnalysisStatus =
  | 'pending'      // Initial state, waiting for worker
  | 'completed'    // Worker completed, admin can edit
  | 'approved'     // Admin approved, PDF generated, ready to send
  | 'sent';        // Report sent to user

// Export for use in components
export { type AnalysisStatus as AnalysisStatusType };

// The Master Analysis Object (matches backend AnalysisResponse)
// NOTE: No versioning - each submission has exactly one analysis record
export interface Analysis {
  id: string;
  submissionId: string;
  status: AnalysisStatus;
  pdfUrl?: string;
  pdf_url?: string;

  // Tracking fields (from backend)
  sentAt?: string;
  sentTo?: string;
  errorMessage?: string;
  completedAt?: string;

  // Visibility control - Admin must explicitly make analysis visible to user
  // Even after approval and PDF generation, analysis is NOT visible until toggled
  isVisibleToUser?: boolean;
  is_visible_to_user?: boolean; // Backend uses snake_case

  // Blur control for premium frameworks (paywall)
  // When true, premium frameworks are blurred until admin unblurs
  isBlurred?: boolean;
  is_blurred?: boolean; // Backend uses snake_case

  // Public sharing via access code
  accessCode?: string;
  access_code?: string; // Backend uses snake_case
  accessCodeCreatedAt?: string;
  access_code_created_at?: string; // Backend uses snake_case

  // ALL FRAMEWORKS NESTED IN "analysis" OBJECT (matches backend response structure)
  analysis: {
    pestel: PESTELAnalysis;
    porter: PorterAnalysis;
    tamSamSom: TamSamSomAnalysis;
    swot: SWOTAnalysis;
    benchmarking: BenchmarkingAnalysis;
    blueOcean: BlueOceanAnalysis;
    growthHacking: GrowthHackingAnalysis;
    scenarios: ScenariosAnalysis;
    okrs: OKRsAnalysis;
    bsc: BSCAnalysis;
    decisionMatrix: DecisionMatrixAnalysis;
    synthesis: Synthesis;
  };

  createdAt: string;
  updatedAt: string;
}

// Public Report Data returned by the public endpoint
export interface PublicReportData {
  id: string;
  submission_id: string;
  status: AnalysisStatus;
  analysis: {
    pestel: PESTELAnalysis;
    porter: PorterAnalysis;
    tam_sam_som: TamSamSomAnalysis;
    swot: SWOTAnalysis;
    benchmarking: BenchmarkingAnalysis;
    blue_ocean: BlueOceanAnalysis;
    growth_hacking: GrowthHackingAnalysis;
    scenarios: ScenariosAnalysis;
    okrs: OKRsAnalysis;
    bsc: BSCAnalysis;
    decision_matrix: DecisionMatrixAnalysis;
    synthesis: Synthesis;
  };
  created_at: string;
  // Optional field added by admin preview mode
  is_admin_preview?: boolean;
  // When true, premium frameworks are blurred (paywall)
  is_blurred?: boolean;
}

// Access Code Generation Response
export interface AccessCodeResponse {
  access_code: string;
  shareable_url: string;
  message: string;
}

// ============================================================================
// Report Types
// ============================================================================

export interface Report {
  id: string;
  submissionId: string;
  pdfUrl: string;
  createdAt: string;
}

// ============================================================================
// Company Types (Company-centric model)
// ============================================================================

export interface Company {
  id: string;

  // Core identifiers (from submission)
  name: string;
  cnpj?: string;
  website?: string;

  // Business context (from submission)
  industry?: string;
  company_size?: string;
  location?: string;
  target_market?: string;
  funding_stage?: string;
  annual_revenue_min?: number;
  annual_revenue_max?: number;

  // Enriched data (from AI enrichment)
  foundation_year?: string;
  legal_name?: string;
  headquarters?: string;
  sector?: string;
  target_audience?: string;
  value_proposition?: string;
  employees_range?: string;
  revenue_estimate?: string;
  business_model?: string;
  competitors?: string[];
  market_share_status?: string;
  digital_maturity?: number;
  strengths?: string[];
  weaknesses?: string[];

  // Social links
  linkedin_url?: string;
  twitter_handle?: string;

  // Verification & Access Control
  is_verified: boolean;
  allowed_users: string[]; // User IDs
  owner_id?: string;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface CompanySubmission {
  company_id: string;
  submission_id: string;
  is_primary: boolean;
  linked_at: string;
  linked_by?: string;
}

export interface DataHistoryEntry {
  id: string;
  company_id: string;
  field_name: string;
  old_value?: string;
  new_value?: string;
  source: 'submission' | 'enrichment' | 'manual';
  source_id?: string;
  changed_by?: string;
  changed_at: string;
}

export interface CompanyListResponse {
  companies: Company[];
  count: number;
}

export interface AdminCompanyListResponse {
  companies: Company[];
  total: number;
  limit: number;
  offset: number;
}

export interface CompanyDetailResponse {
  company: Company;
  primary_submission_id?: string; // Will be populated after backend enhancement
}

// EnrichmentStatusInfo contains current enrichment status for admin dashboard
export interface EnrichmentStatusInfo {
  enrichment_id: string;
  submission_id: string;
  status: 'pending' | 'completed' | 'failed';
  progress: number;
  current_step: string;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

// AnalysisHistoryItem represents a single analysis with its associated challenge
export interface AnalysisHistoryItem {
  analysis_id: string;
  submission_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  business_challenge: string;
  is_blurred: boolean;
  is_visible_to_user: boolean;
  access_code?: string;
  pdf_url?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminCompanyDetailResponse {
  company: Company;
  submissions: CompanySubmission[];
  history: DataHistoryEntry[];
  enrichment_status?: EnrichmentStatusInfo;
  enrichments_history?: EnrichmentStatusInfo[];
  analyses_history?: AnalysisHistoryItem[];
}

// ============================================================================
// API Response Wrappers
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  expires_in: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================================================
// Form Types
// ============================================================================

export interface SubmissionFormData {
  companyName: string;
  cnpj: string;
  industry: string;
  companySize: string;
  website?: string;
  strategicGoal: string;
  currentChallenges: string;
  competitivePosition: string;
  additionalInfo?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  fullName: string;
  jobTitle?: string;
}

export interface ResetPasswordFormData {
  email: string;
}

export interface UpdatePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
