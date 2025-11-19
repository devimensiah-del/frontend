// IMENSIAH TypeScript Types
// All types for the frontend application

// ============================================
// USER & AUTHENTICATION
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refresh_token?: string;
}

// ============================================
// SUBMISSION & FORM
// ============================================

export type SubmissionStatus =
  | 'pending_payment'
  | 'paid'
  | 'queued'
  | 'collecting_data'
  | 'analyzing'
  | 'in_review'
  | 'approved'
  | 'failed';

// Dual Status Tracking (Dad's feedback: separate AI work from admin review)
export type AIStatus =
  | 'queued'
  | 'collecting_data'
  | 'analyzing'
  | 'validation'
  | 'complete'
  | 'failed';

export type ReviewStatus =
  | 'analysis_complete'
  | 'in_review'
  | 'approved'
  | 'delivered'
  | 'archived';

export type ReviewCycle = 'continuo' | 'semanal' | 'trimestral' | 'semestral' | 'anual';

export type Industry =
  | 'tecnologia'
  | 'saude'
  | 'educacao'
  | 'varejo'
  | 'servicos'
  | 'industria'
  | 'consultoria'
  | 'financas'
  | 'outro';

export interface SubmissionFormData {
  // Basic fields
  website_url: string;
  email: string;
  company_name: string;
  industry: Industry;
  main_challenge: string;

  // Contact
  phone?: string;
  whatsapp?: string;

  // Social media
  instagram?: string;
  tiktok?: string;

  // LinkedIn
  company_linkedin?: string;
  founder_linkedin?: string;

  // Company details
  employee_count?: string;
  founded_year?: number;
  review_cycle?: ReviewCycle;
}

export interface Submission extends SubmissionFormData {
  id: string;
  user_id?: string;
  status: SubmissionStatus;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_intent_id?: string;

  // Dual status tracking (AI pipeline + Admin review)
  ai_status: AIStatus;
  review_status: ReviewStatus;

  // Enrichment data
  enrichment_data?: EnrichmentData;
  enrichment_completed_at?: string;

  // Quality metrics
  data_completeness_score: number; // 0-20 fields filled
  confidence_score: number; // Average confidence across all fields
  conflicts?: DataConflict[];
  red_flags?: string[];

  // Report
  report_markdown?: string;
  report_pdf_url?: string;
  report_version: number;

  // Timestamps
  created_at: string;
  updated_at: string;

  // AI pipeline timestamps
  ai_started_at?: string;
  ai_completed_at?: string;

  // Review workflow timestamps
  review_started_at?: string;
  approved_at?: string;
  delivered_at?: string;
}

// ============================================
// ENRICHMENT DATA
// ============================================

export interface EnrichmentData {
  website?: WebsiteData;
  linkedin_company?: LinkedInCompanyData;
  linkedin_founder?: LinkedInFounderData;
  social_media?: SocialMediaData;
  brazil_dbs?: BrazilDBData;
  raw_sessions?: EnrichmentSession[];
}

export interface WebsiteData {
  title?: string;
  description?: string;
  keywords?: string[];
  og_image?: string;
  domain?: string;
  language?: string;
  confidence: number;
  collected_at: string;
  source: string;
}

export interface LinkedInCompanyData {
  name?: string;
  description?: string;
  industry?: string;
  company_size?: string;
  headquarters?: string;
  founded?: number;
  specialties?: string[];
  followers?: number;
  confidence: number;
  collected_at: string;
  source: string;
}

export interface LinkedInFounderData {
  name?: string;
  title?: string;
  company?: string;
  location?: string;
  headline?: string;
  confidence: number;
  collected_at: string;
  source: string;
}

export interface SocialMediaData {
  instagram?: {
    handle?: string;
    followers?: number;
    posts?: number;
    bio?: string;
    confidence: number;
  };
  tiktok?: {
    handle?: string;
    followers?: number;
    likes?: number;
    bio?: string;
    confidence: number;
  };
  collected_at: string;
}

export interface BrazilDBData {
  cnpj?: string;
  razao_social?: string;
  nome_fantasia?: string;
  data_abertura?: string;
  situacao_cadastral?: string;
  capital_social?: number;
  porte?: string;
  natureza_juridica?: string;
  atividade_principal?: string;
  endereco?: {
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    municipio?: string;
    uf?: string;
    cep?: string;
  };
  confidence: number;
  collected_at: string;
  source: string;
}

export interface EnrichmentSession {
  id: string;
  submission_id: string;
  source: string;
  status: 'pending' | 'in_progress' | 'complete' | 'failed';
  data: Record<string, unknown>;
  confidence: number;
  cost?: number;
  latency?: number;
  error_message?: string;
  started_at: string;
  completed_at?: string;
}

// ============================================
// DATA CONFLICTS
// ============================================

export interface DataConflict {
  field: string;
  submitted_value: string;
  enriched_value: string;
  source: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

// ============================================
// REPORT
// ============================================

export interface Report {
  id: string;
  submission_id: string;
  markdown_content: string;
  pdf_url?: string;
  version: number;
  data_sources: DataSource[];
  generated_at: string;
  reviewed_at?: string;
  approved_at?: string;
  reviewer_notes?: string;
}

export interface DataSource {
  name: string;
  type: 'website' | 'linkedin' | 'social' | 'brazil_db' | 'manual';
  url?: string;
  collected_at: string;
  confidence: number;
}

// ============================================
// REPORT SHARING
// ============================================

export interface ReportShare {
  id: string;
  submission_id: string;
  token: string;
  shared_by: string;
  shared_with: string[];
  expires_at: string;
  created_at: string;
  accessed_count: number;
  last_accessed_at?: string;
}

// ============================================
// ANALYTICS
// ============================================

export interface DashboardStats {
  total_submissions: number;
  pending_payment: number;
  in_progress: number;
  completed: number;
  failed: number;
  total_revenue: number;
  revenue_this_month: number;
  avg_completion_time_hours: number;
}

export interface AdminAnalytics {
  submissions_over_time: TimeSeriesData[];
  revenue_over_time: TimeSeriesData[];
  completion_rate: number;
  avg_analysis_time_hours: number;
  top_industries: IndustryData[];
  conversion_funnel: ConversionFunnelData;
  enrichment_performance: EnrichmentPerformanceData[];
}

export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

export interface IndustryData {
  industry: Industry;
  count: number;
  percentage: number;
}

export interface ConversionFunnelData {
  visits: number;
  form_started: number;
  form_submitted: number;
  payment_completed: number;
  report_delivered: number;
}

export interface EnrichmentPerformanceData {
  source: string;
  success_rate: number;
  avg_latency_ms: number;
  total_cost: number;
  total_calls: number;
  last_used_at: string;
}

// ============================================
// API RESPONSES
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface SubmissionsFilters {
  status?: SubmissionStatus[];
  payment_status?: ('pending' | 'paid' | 'failed' | 'refunded')[];
  date_from?: string;
  date_to?: string;
  search?: string;
  industry?: Industry[];
  page?: number;
  per_page?: number;
  sort_by?: 'created_at' | 'updated_at' | 'company_name';
  sort_order?: 'asc' | 'desc';
}

// ============================================
// FORM VALIDATION SCHEMAS (Zod)
// ============================================

import { z } from 'zod';

export const submissionFormSchema = z.object({
  // Basic (required)
  website_url: z
    .string()
    .url('URL inválida')
    .refine((url) => {
      try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
      } catch {
        return false;
      }
    }, 'URL deve começar com http:// ou https://'),

  email: z
    .string()
    .email('Email inválido')
    .refine((email) => {
      // Corporate email validation (not gmail, hotmail, etc.)
      const personalDomains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com'];
      const domain = email.split('@')[1];
      return !personalDomains.includes(domain);
    }, 'Use um email corporativo'),

  company_name: z
    .string()
    .min(2, 'Nome muito curto')
    .max(100, 'Nome muito longo'),

  industry: z.enum([
    'tecnologia',
    'saude',
    'educacao',
    'varejo',
    'servicos',
    'industria',
    'consultoria',
    'financas',
    'outro',
  ]),

  main_challenge: z
    .string()
    .min(100, 'Descreva com mais detalhes (mínimo 100 caracteres)')
    .max(800, 'Máximo 800 caracteres')
    .refine((text) => {
      // Prevent generic responses
      const genericPhrases = ['crescer', 'vender mais', 'melhorar', 'aumentar'];
      const lowerText = text.toLowerCase();
      const hasGeneric = genericPhrases.some((phrase) =>
        lowerText === phrase || lowerText.split(' ').length < 10
      );
      return !hasGeneric;
    }, 'Seja mais específico sobre o desafio da sua empresa'),

  // Optional fields
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  company_linkedin: z.string().url('URL inválida').optional().or(z.literal('')),
  founder_linkedin: z.string().url('URL inválida').optional().or(z.literal('')),
  employee_count: z.string().optional(),
  founded_year: z
    .number()
    .min(1900, 'Ano inválido')
    .max(new Date().getFullYear(), 'Ano não pode ser no futuro')
    .optional(),
  review_cycle: z.enum(['continuo', 'semanal', 'trimestral', 'semestral', 'anual']).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
});

export const signupSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  confirm_password: z.string(),
  terms_accepted: z.boolean().refine((val) => val === true, 'Você deve aceitar os termos'),
}).refine((data) => data.password === data.confirm_password, {
  message: 'As senhas não coincidem',
  path: ['confirm_password'],
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

export const shareReportSchema = z.object({
  emails: z
    .string()
    .refine((val) => {
      const emails = val.split(',').map((e) => e.trim());
      return emails.every((e) => z.string().email().safeParse(e).success);
    }, 'Um ou mais emails são inválidos'),
  expiry_days: z.number().min(1).max(90),
});

export type SubmissionFormInput = z.infer<typeof submissionFormSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ShareReportInput = z.infer<typeof shareReportSchema>;
