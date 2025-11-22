/**
 * TypeScript Types matching Go Backend Models
 * All types mirror the backend structs exactly
 */

// ============================================================================
// Enums and Status Types
// ============================================================================

export type SubmissionStatus =
  | 'pending'            // Initial submission
  | 'processing'         // Generic processing state
  | 'enriching'          // Worker 1 Active
  | 'enriched'           // Worker 1 Done
  | 'analyzing'          // Worker 2 Active
  | 'analyzed'           // Worker 2 Done (Internal)
  | 'ready_for_review'   // Waiting for Admin Publish
  | 'generating_report'  // PDF generation in progress
  | 'completed'          // PDF Generated & Email Sent
  | 'failed'             // Generic Failure
  | 'enrichment_failed'
  | 'analysis_failed'
  | 'report_failed';

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
  };

  status: 'pending' | 'approved' | 'rejected';
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

// 2. Porter's 5 Forces
export interface PorterAnalysis {
  competitiveRivalry: string;
  supplierPower: string;
  buyerPower: string;
  threatNewEntrants: string;
  threatSubstitutes: string;
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

// 4. SWOT
export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
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

// 9. OKRs
export interface OKRItem {
  title: string;
  keyResults: string[];
}

export interface OKRsAnalysis {
  objectives: OKRItem[];
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

// The Master Analysis Object
export interface Analysis {
  id: string;
  submissionId: string;
  enrichmentId: string;

  // Frameworks
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

  // Synthesis
  synthesis: Synthesis;

  status: 'processing' | 'completed' | 'failed';
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
