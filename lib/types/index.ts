/**
 * TypeScript Types matching Go Backend Models
 * All types mirror the backend structs exactly
 */

// ============================================================================
// Enums and Status Types
// ============================================================================

export type SubmissionStatus =
  | 'pendente'           // Pending initial review
  | 'aguardando_pagamento' // Awaiting payment
  | 'em_enriquecimento'  // Being enriched with data
  | 'enriquecimento_completo' // Enrichment completed
  | 'em_analise'         // Being analyzed
  | 'analise_completa'   // Analysis completed
  | 'em_geracao_relatorio' // Report generation in progress
  | 'concluido'          // Completed
  | 'cancelado'          // Cancelled
  | 'erro';              // Error occurred

export type UserRole = 'admin' | 'user';

export type PaymentStatus =
  | 'pendente'
  | 'processando'
  | 'aprovado'
  | 'rejeitado'
  | 'reembolsado';

// ============================================================================
// User Types
// ============================================================================

export interface User {
  id: string;
  email: string;
  fullName: string;
  jobTitle?: string;
  role: UserRole;
  organizationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ============================================================================
// Submission Types (17 fields matching Go struct)
// ============================================================================

export interface Submission {
  id: string;
  userId: string;

  // Company Information
  companyName: string;
  cnpj: string;
  industry: string;
  companySize: string;
  website?: string;
  email?: string; // Contact email for the submission

  // Strategic Context
  strategicGoal: string;
  currentChallenges: string;
  competitivePosition: string;

  // Additional Data
  additionalInfo?: string;

  // Status and Workflow
  status: SubmissionStatus;
  paymentStatus: PaymentStatus;

  // Relationships
  enrichmentId?: string;
  analysisId?: string;
  reportId?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Enrichment Types
// ============================================================================

export interface StrategicProfile {
  mission?: string;
  vision?: string;
  coreValues: string[];
  keyCompetencies: string[];
  strategicPriorities: string[];
  organizationalCulture?: string;
}

export interface CompanyOverview {
  legalName: string;
  tradeName: string;
  cnpj: string;
  foundedYear?: number;
  headquarters: string;
  numberOfEmployees?: number;
  annualRevenue?: string;
  mainProducts: string[];
  mainServices: string[];
  targetMarkets: string[];
  geographicPresence: string[];
  corporateStructure?: string;
  keyExecutives: Array<{
    name: string;
    position: string;
    background?: string;
  }>;
}

export interface MarketIntelligence {
  industryOverview: string;
  marketSize?: string;
  growthRate?: string;
  keyTrends: string[];
  regulatoryEnvironment: string[];
  technologyDisruptions: string[];
}

export interface CompetitiveLandscape {
  mainCompetitors: Array<{
    name: string;
    marketShare?: string;
    strengths: string[];
    weaknesses: string[];
  }>;
  competitiveAdvantages: string[];
  competitiveDisadvantages: string[];
  marketPosition: string;
  differentiationFactors: string[];
}

export interface FinancialMetrics {
  revenue: string;
  revenueGrowth?: string;
  profitMargin?: string;
  ebitda?: string;
  debtLevel?: string;
  liquidityPosition?: string;
  investmentCapacity?: string;
  financialHealth: string;
}

export interface OperationalCapabilities {
  productionCapacity?: string;
  technologyInfrastructure: string[];
  supplyChainMaturity: string;
  qualityCertifications: string[];
  innovationCapabilities: string[];
  digitalMaturity: string;
}

export interface RiskAssessment {
  strategicRisks: Array<{
    risk: string;
    severity: 'baixa' | 'média' | 'alta' | 'crítica';
    mitigation?: string;
  }>;
  operationalRisks: Array<{
    risk: string;
    severity: 'baixa' | 'média' | 'alta' | 'crítica';
    mitigation?: string;
  }>;
  financialRisks: Array<{
    risk: string;
    severity: 'baixa' | 'média' | 'alta' | 'crítica';
    mitigation?: string;
  }>;
  complianceRisks: Array<{
    risk: string;
    severity: 'baixa' | 'média' | 'alta' | 'crítica';
    mitigation?: string;
  }>;
}

export interface Enrichment {
  id: string;
  submissionId: string;

  // Core enrichment data structures
  strategicProfile: StrategicProfile;
  companyOverview: CompanyOverview;
  marketIntelligence: MarketIntelligence;
  competitiveLandscape: CompetitiveLandscape;
  financialMetrics: FinancialMetrics;
  operationalCapabilities: OperationalCapabilities;
  riskAssessment: RiskAssessment;

  // Status (for UI workflows)
  status?: 'pending' | 'approved' | 'rejected';

  // Metadata
  dataQualityScore: number; // 0-100
  sourceReliability: 'baixa' | 'média' | 'alta';
  lastVerified: string;
  dataSources: string[];

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Analysis Types (11 Strategic Frameworks)
// ============================================================================

export interface PESTELAnalysis {
  political: {
    factors: string[];
    impact: 'positivo' | 'neutro' | 'negativo';
    opportunities: string[];
    threats: string[];
  };
  economic: {
    factors: string[];
    impact: 'positivo' | 'neutro' | 'negativo';
    opportunities: string[];
    threats: string[];
  };
  social: {
    factors: string[];
    impact: 'positivo' | 'neutro' | 'negativo';
    opportunities: string[];
    threats: string[];
  };
  technological: {
    factors: string[];
    impact: 'positivo' | 'neutro' | 'negativo';
    opportunities: string[];
    threats: string[];
  };
  environmental: {
    factors: string[];
    impact: 'positivo' | 'neutro' | 'negativo';
    opportunities: string[];
    threats: string[];
  };
  legal: {
    factors: string[];
    impact: 'positivo' | 'neutro' | 'negativo';
    opportunities: string[];
    threats: string[];
  };
}

export interface PorterFiveForcesAnalysis {
  threatOfNewEntrants: {
    level: 'baixa' | 'média' | 'alta';
    factors: string[];
    analysis: string;
  };
  bargainingPowerOfSuppliers: {
    level: 'baixa' | 'média' | 'alta';
    factors: string[];
    analysis: string;
  };
  bargainingPowerOfBuyers: {
    level: 'baixa' | 'média' | 'alta';
    factors: string[];
    analysis: string;
  };
  threatOfSubstitutes: {
    level: 'baixa' | 'média' | 'alta';
    factors: string[];
    analysis: string;
  };
  competitiveRivalry: {
    level: 'baixa' | 'média' | 'alta';
    factors: string[];
    analysis: string;
  };
  overallIndustryAttractiveness: 'baixa' | 'média' | 'alta';
}

export interface SWOTAnalysis {
  strengths: Array<{
    item: string;
    impact: 'baixo' | 'médio' | 'alto';
    description: string;
  }>;
  weaknesses: Array<{
    item: string;
    impact: 'baixo' | 'médio' | 'alto';
    description: string;
  }>;
  opportunities: Array<{
    item: string;
    potential: 'baixo' | 'médio' | 'alto';
    description: string;
  }>;
  threats: Array<{
    item: string;
    severity: 'baixa' | 'média' | 'alta';
    description: string;
  }>;
  strategicImplications: string;
}

export interface VRIOAnalysis {
  resources: Array<{
    resource: string;
    valuable: boolean;
    rare: boolean;
    inimitable: boolean;
    organized: boolean;
    competitiveImplication: 'desvantagem' | 'paridade' | 'vantagem_temporária' | 'vantagem_sustentável';
    analysis: string;
  }>;
}

export interface ValueChainAnalysis {
  primaryActivities: {
    inboundLogistics: {
      activities: string[];
      valueCreation: 'baixa' | 'média' | 'alta';
      improvements: string[];
    };
    operations: {
      activities: string[];
      valueCreation: 'baixa' | 'média' | 'alta';
      improvements: string[];
    };
    outboundLogistics: {
      activities: string[];
      valueCreation: 'baixa' | 'média' | 'alta';
      improvements: string[];
    };
    marketingAndSales: {
      activities: string[];
      valueCreation: 'baixa' | 'média' | 'alta';
      improvements: string[];
    };
    service: {
      activities: string[];
      valueCreation: 'baixa' | 'média' | 'alta';
      improvements: string[];
    };
  };
  supportActivities: {
    firmInfrastructure: {
      activities: string[];
      valueCreation: 'baixa' | 'média' | 'alta';
      improvements: string[];
    };
    hrManagement: {
      activities: string[];
      valueCreation: 'baixa' | 'média' | 'alta';
      improvements: string[];
    };
    technologyDevelopment: {
      activities: string[];
      valueCreation: 'baixa' | 'média' | 'alta';
      improvements: string[];
    };
    procurement: {
      activities: string[];
      valueCreation: 'baixa' | 'média' | 'alta';
      improvements: string[];
    };
  };
}

export interface BCGMatrixAnalysis {
  businessUnits: Array<{
    name: string;
    category: 'estrela' | 'vaca_leiteira' | 'ponto_interrogacao' | 'abacaxi';
    marketGrowthRate: number;
    relativeMarketShare: number;
    strategicRecommendation: string;
  }>;
}

export interface AnsoffMatrixAnalysis {
  marketPenetration: {
    feasibility: 'baixa' | 'média' | 'alta';
    strategies: string[];
    risks: string[];
  };
  marketDevelopment: {
    feasibility: 'baixa' | 'média' | 'alta';
    strategies: string[];
    risks: string[];
  };
  productDevelopment: {
    feasibility: 'baixa' | 'média' | 'alta';
    strategies: string[];
    risks: string[];
  };
  diversification: {
    feasibility: 'baixa' | 'média' | 'alta';
    strategies: string[];
    risks: string[];
  };
  recommendedStrategy: string;
}

export interface BalancedScorecardAnalysis {
  financial: {
    objectives: string[];
    measures: string[];
    targets: string[];
    initiatives: string[];
  };
  customer: {
    objectives: string[];
    measures: string[];
    targets: string[];
    initiatives: string[];
  };
  internalProcesses: {
    objectives: string[];
    measures: string[];
    targets: string[];
    initiatives: string[];
  };
  learningAndGrowth: {
    objectives: string[];
    measures: string[];
    targets: string[];
    initiatives: string[];
  };
}

export interface McKinsey7SAnalysis {
  strategy: {
    description: string;
    alignment: 'baixo' | 'médio' | 'alto';
    gaps: string[];
  };
  structure: {
    description: string;
    alignment: 'baixo' | 'médio' | 'alto';
    gaps: string[];
  };
  systems: {
    description: string;
    alignment: 'baixo' | 'médio' | 'alto';
    gaps: string[];
  };
  sharedValues: {
    description: string;
    alignment: 'baixo' | 'médio' | 'alto';
    gaps: string[];
  };
  style: {
    description: string;
    alignment: 'baixo' | 'médio' | 'alto';
    gaps: string[];
  };
  staff: {
    description: string;
    alignment: 'baixo' | 'médio' | 'alto';
    gaps: string[];
  };
  skills: {
    description: string;
    alignment: 'baixo' | 'médio' | 'alto';
    gaps: string[];
  };
  overallAlignment: 'baixo' | 'médio' | 'alto';
}

export interface BlueOceanAnalysis {
  currentMarketSpace: {
    competingFactors: string[];
    industryNorms: string[];
  };
  blueOceanOpportunities: Array<{
    factor: string;
    action: 'eliminar' | 'reduzir' | 'elevar' | 'criar';
    rationale: string;
    expectedImpact: string;
  }>;
  valueInnovation: string;
  strategicMove: string;
}

export interface CoreCompetenciesAnalysis {
  competencies: Array<{
    competency: string;
    providesCustomerValue: boolean;
    difficultToImitate: boolean;
    broadMarketApplicability: boolean;
    isCoreCompetency: boolean;
    analysis: string;
    developmentRecommendations: string[];
  }>;
}

export interface Analysis {
  id: string;
  submissionId: string;
  enrichmentId: string;

  // 11 Strategic Analysis Frameworks
  pestel: PESTELAnalysis;
  porterFiveForces: PorterFiveForcesAnalysis;
  porter?: PorterFiveForcesAnalysis; // Alias for backward compatibility
  swot: SWOTAnalysis;
  vrio: VRIOAnalysis;
  valueChain: ValueChainAnalysis;
  bcgMatrix: BCGMatrixAnalysis;
  ansoffMatrix: AnsoffMatrixAnalysis;
  balancedScorecard: BalancedScorecardAnalysis;
  mckinsey7S: McKinsey7SAnalysis;
  blueOcean: BlueOceanAnalysis;
  coreCompetencies: CoreCompetenciesAnalysis;

  // Status (for UI workflows)
  status?: 'pending' | 'completed' | 'in_progress';

  // Overall Strategic Assessment
  strategicRecommendations: string[];
  priorityActions: Array<{
    action: string;
    priority: 'baixa' | 'média' | 'alta' | 'crítica';
    timeframe: 'curto_prazo' | 'médio_prazo' | 'longo_prazo';
    expectedImpact: string;
  }>;

  // Metadata
  analysisQualityScore: number; // 0-100
  confidenceLevel: 'baixa' | 'média' | 'alta';

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Report Types (13 HTML Pages)
// ============================================================================

export interface ReportPage {
  title: string;
  content: string; // HTML content
  pageNumber: number;
}

export interface Report {
  id: string;
  submissionId: string;
  analysisId: string;

  // 13 Report Pages
  executiveSummary: ReportPage;           // Page 1: Sumário Executivo
  companyOverview: ReportPage;            // Page 2: Visão Geral da Empresa
  marketAnalysis: ReportPage;             // Page 3: Análise de Mercado
  competitiveAnalysis: ReportPage;        // Page 4: Análise Competitiva
  swotAnalysis: ReportPage;               // Page 5: Análise SWOT
  strategicFrameworks: ReportPage;        // Page 6: Frameworks Estratégicos
  valueChainAnalysis: ReportPage;         // Page 7: Análise da Cadeia de Valor
  portfolioAnalysis: ReportPage;          // Page 8: Análise de Portfólio
  balancedScorecard: ReportPage;          // Page 9: Balanced Scorecard
  organizationalAlignment: ReportPage;    // Page 10: Alinhamento Organizacional
  strategicOpportunities: ReportPage;     // Page 11: Oportunidades Estratégicas
  implementationRoadmap: ReportPage;      // Page 12: Roadmap de Implementação
  appendices: ReportPage;                 // Page 13: Apêndices e Referências

  // Report Metadata
  generatedAt: string;
  version: string;
  format: 'html' | 'pdf';
  sharingToken?: string;
  expiresAt?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
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
