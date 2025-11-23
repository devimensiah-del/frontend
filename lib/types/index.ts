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

// NEW ARCHITECTURE: Enrichment states: pending → processing → finished → approved
export type EnrichmentStatus =
  | 'pending'      // Initial state, waiting for worker
  | 'processing'   // Worker is enriching data
  | 'finished'     // Worker completed, waiting for admin review
  | 'approved'     // Admin approved, ready for analysis
  | 'rejected'     // Admin rejected, needs rework
  | 'failed';      // Worker failed

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

  // The JSONMap stored in Postgres
  data: {
    overview?: {
      description: string;
      sources: string[] | null;
    };
    digitalPresence?: {
      websiteUrl: string;
      recentNews: string[] | null;
    };
    marketPosition?: {
      industry: string;
      keyDifferentiator: string;
      competitors: string[];
    };
    strategicInference?: {
      brandTone: string;
      digitalMaturity: number;
      valueArchetype: string;
      customerSegment: string;
      strengths: string[];
      weaknesses: string[];
    };
    macro_context?: MacroContext; // NEW: Real-time macro-economic data
  };

  status: EnrichmentStatus;
  progress: number;  // Worker progress percentage (0-100)
  currentStep: string;  // Current step description
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
export interface TamSamSomAnalysis {
  tam: string;
  sam: string;
  som: string;
  assumptions: string[];
  cagr: string;
  summary: string;
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
export interface GrowthHackingAnalysis {
  hypotheses: string[];
  experiments: string[];
  keyMetrics: string[];
  summary: string;
}

// 8. Scenarios
export interface ScenariosAnalysis {
  optimistic: string;
  realist: string;
  pessimistic: string;
  earlyWarningSignals: string[];
  summary: string;
}

// 9. OKRs (Quarterly Model)
export interface KeyResult {
  description: string;
  target: string;
  measurement: string;
}

export interface QuarterlyOKR {
  quarter: string;              // "Q1", "Q2", "Q3"
  objective: string;
  key_results: KeyResult[];
  investment_estimate: string;
  timeline: string;
}

export interface OKRsAnalysis {
  quarters: QuarterlyOKR[];

  // Backward compatibility: old format (optional)
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
  internal: string[];
  learningGrowth: string[];
  summary: string;
}

// 11. Decision Matrix
export interface DecisionMatrixAnalysis {
  alternatives: string[];
  criteria: string[];
  finalRecommendation: string;
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

// NEW ARCHITECTURE: Analysis states: pending → completed → approved → sent
export type AnalysisStatus =
  | 'pending'      // Initial state, waiting for worker
  | 'processing'   // Worker is analyzing (optional transitional state)
  | 'completed'    // Worker completed, admin can edit
  | 'approved'     // Admin approved, ready to send
  | 'sent'         // Report sent to user
  | 'failed';      // Worker failed

// The Master Analysis Object (matches backend AnalysisResponse)
export interface Analysis {
  id: string;
  submissionId: string;
  version: number;                    // Version number (1, 2, 3, ...)
  parentId?: string | null;           // Reference to previous version (backend uses "parentId" not "parentAnalysisId")
  status: AnalysisStatus;

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
