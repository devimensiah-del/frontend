/**
 * Core TypeScript types for the application
 *
 * This file re-exports types from lib/types/index.ts which contains
 * the correct type definitions matching the Go backend models.
 *
 * @deprecated Direct imports from '@/types' are maintained for backward compatibility.
 * New code should import from '@/lib/types' instead.
 */

// Re-export all types from lib/types (correct Go backend types)
export type {
  // Status and enum types
  SubmissionStatus,
  UserRole,

  // User types
  User,

  // Submission types
  Submission,

  // Enrichment types
  Enrichment,

  // Analysis types
  Analysis,
  PESTELAnalysis,
  PorterAnalysis,
  TamSamSomAnalysis,
  SWOTAnalysis,
  BenchmarkingAnalysis,
  BlueOceanAnalysis,
  GrowthHackingAnalysis,
  ScenariosAnalysis,
  OKRsAnalysis,
  OKRItem,
  BSCAnalysis,
  DecisionMatrixAnalysis,
  Synthesis,

  // Report types
  Report,

  // API response types
  ApiResponse,
  AuthResponse,
  PaginatedResponse,

  // Form types
  SubmissionFormData,
  LoginFormData,
  SignupFormData,
  ResetPasswordFormData,
  UpdatePasswordFormData,
} from '@/lib/types';

// Legacy type aliases for backward compatibility
export type { Enrichment as EnrichmentData, Analysis as AnalysisData } from '@/lib/types';

// ============================================================================
// Legacy Personal Data Enrichment Types (Deprecated)
// ============================================================================
// These types were used in the old system for personal data enrichment.
// They are kept for backward compatibility with existing UI components.
// New code should use the strategic Enrichment types from lib/types instead.

/**
 * @deprecated Legacy type for personal data enrichment UI components.
 * The new system uses strategic company analysis (Enrichment from lib/types).
 */
export interface PersonalEnrichmentData {
  id: string;
  submissionId: string;
  status: 'pending' | 'approved' | 'rejected';
  data: {
    fullName?: string;
    cpf?: string;
    birthDate?: string;
    motherName?: string;
    addresses?: Array<{
      street: string;
      city: string;
      state: string;
      zipCode: string;
      type: 'residential' | 'commercial';
    }>;
    phones?: Array<{
      number: string;
      type: 'mobile' | 'landline';
    }>;
    emails?: Array<{
      email: string;
      verified: boolean;
    }>;
    financialInfo?: {
      creditScore?: number;
      monthlyIncome?: number;
      employmentStatus?: string;
    };
  };
  sources: string[];
  confidence: number;
  verifiedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}
