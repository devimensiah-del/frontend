/**
 * Core TypeScript types for the application
 */

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

// Form data types for API calls
export type LoginFormData = LoginCredentials;
export type SignupFormData = SignupData;
export type ResetPasswordFormData = Omit<ResetPasswordData, 'token'>;

export interface SubmissionFormData {
  companyName: string;
  email: string;
  phone?: string;
  description?: string;
  industry?: string;
}

// Submission types
export interface Submission {
  id: string;
  userId: string;
  companyName: string;
  email: string;
  phone?: string;
  description?: string;
  industry?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  personalInfo?: {
    fullName: string;
    email: string;
    phone: string;
    document: string;
  };
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  notes?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

// Enrichment types
export interface Enrichment {
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

// Legacy type alias for backward compatibility
export type EnrichmentData = Enrichment;

// Analysis types
export interface Analysis {
  id: string;
  submissionId: string;
  status: 'pending' | 'completed' | 'failed';
  swot?: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  pestel?: {
    political: string[];
    economic: string[];
    social: string[];
    technological: string[];
    environmental: string[];
    legal: string[];
  };
  porter?: {
    competitiveRivalry: {
      intensity: string;
      factors: string[];
    };
    threatOfNewEntrants: {
      intensity: string;
      factors: string[];
    };
    bargainingPowerOfSuppliers: {
      intensity: string;
      factors: string[];
    };
    bargainingPowerOfBuyers: {
      intensity: string;
      factors: string[];
    };
    threatOfSubstitutes: {
      intensity: string;
      factors: string[];
    };
  };
  summary?: string;
  findings?: string[];
  recommendations?: string[];
  riskLevel?: 'low' | 'medium' | 'high';
  confidenceScore?: number;
  generatedAt?: string;
  sentToUserAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Legacy type alias for backward compatibility
export type AnalysisData = Analysis;

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  total?: number; // Legacy support
  page?: number; // Legacy support
  limit?: number; // Legacy support
  hasNext?: boolean; // Legacy support
  hasPrev?: boolean; // Legacy support
}
