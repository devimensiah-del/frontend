/**
 * Site Configuration
 * Centralized configuration for navigation, routes, colors, and app settings
 */

import { SubmissionStatus } from '../types';

// ============================================================================
// Site Metadata
// ============================================================================

export const siteConfig = {
  brand: {
    name: "IMENSIAH",
    logoPath: "/imensiah_logo.png",
    tagline: "Inteligência Estratégica Contínua",
    description: "Consultoria de alto nível amplificada por inteligência artificial.",
  },

  navigation: {
    logoSize: "w-20 h-20", // Tailwind classes for logo size
    items: [] as { label: string; href: string }[], // No middle nav items
    cta: {
      text: "Login",
      href: "/login",
    },
  },

  footer: {
    year: new Date().getFullYear(),
    logoSize: "w-6 h-6", // Footer logo is smaller
    links: [
      { label: "Privacidade", href: "/privacidade" },
      { label: "Termos", href: "/termos" },
    ],
  },

  layout: {
    maxWidth: "max-w-[1400px]",
    navHeight: "h-24",
  },

  contact: {
    email: 'contato@imensiah.com.br',
    phone: '+55 11 9999-9999',
    address: 'São Paulo, SP',
    supportEmail: 'suporte@imensiah.com.br',
    salesEmail: 'vendas@imensiah.com.br',
  },

  social: {
    twitter: 'https://twitter.com/imensiah',
    linkedin: 'https://linkedin.com/company/imensiah',
    instagram: 'https://instagram.com/imensiah',
    youtube: 'https://youtube.com/@imensiah',
  },
} as const;

export type SiteConfig = typeof siteConfig;

// ============================================================================
// Navigation Configuration
// ============================================================================

export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  description?: string;
  disabled?: boolean;
  external?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

// Dashboard Navigation (User Area)
export const dashboardNav: NavSection[] = [
  {
    title: 'Principal',
    items: [
      {
        title: 'Painel',
        href: '/dashboard',
        icon: 'LayoutDashboard',
        description: 'Visão geral dos seus envios',
      },
      {
        title: 'Configurações',
        href: '/configuracoes',
        icon: 'Settings',
        description: 'Configurações do perfil',
      },
    ],
  },
] as const;

// Admin Navigation
export const adminNav: NavSection[] = [
  {
    title: 'Principal',
    items: [
      {
        title: 'Envios',
        href: '/admin/envios',
        icon: 'FileText',
        description: 'Ver envios com dados do formulário',
      },
      {
        title: 'Enriquecimento',
        href: '/admin/enriquecimento',
        icon: 'Database',
        description: 'Aprovar dados enriquecidos',
      },
      {
        title: 'Análise',
        href: '/admin/analise',
        icon: 'BarChart',
        description: 'Editar análise e gerar PDF',
      },
      {
        title: 'Configurações',
        href: '/admin/configuracoes',
        icon: 'Settings',
        description: 'Configurações do perfil',
      },
    ],
  },
] as const;

// ============================================================================
// Workflow Stages Configuration
// ============================================================================

export interface WorkflowStage {
  stage: number;
  name: string;
  href: string;
  icon: string;
  description: string;
}

export const workflowStages: WorkflowStage[] = [
  {
    stage: 1,
    name: 'Envios',
    href: '/admin/dashboard',
    icon: 'FileText',
    description: 'Revisar envios de clientes',
  },
  {
    stage: 2,
    name: 'Enriquecimento',
    href: '/admin/enriquecimento',
    icon: 'Database',
    description: 'Editar dados enriquecidos',
  },
  {
    stage: 3,
    name: 'Análise',
    href: '/admin/submissions',
    icon: 'BarChart',
    description: 'Criar relatórios estratégicos',
  },
] as const;

// ============================================================================
// Routes Configuration
// ============================================================================

export const authRoutes = {
  login: '/login',
  signup: '/auth/signup',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  updatePassword: '/auth/update-password',
  verifyEmail: '/auth/verify-email',
  logout: '/api/auth/logout',
} as const;

export const dashboardRoutes = {
  main: '/dashboard',
  configuracoes: '/configuracoes',
} as const;

export const adminRoutes = {
  dashboard: '/admin/envios', // Default admin landing page
  envios: '/admin/envios',
  enriquecimento: '/admin/enriquecimento',
  analise: '/admin/analise',
  configuracoes: '/admin/configuracoes',
} as const;

export const protectedRoutes = {
  dashboard: '/dashboard',
  admin: '/admin',
} as const;

export const publicRoutes = {
  home: '/',
  terms: '/termos',
  privacy: '/privacidade',
  obrigado: '/obrigado',
} as const;

// ============================================================================
// Status Configuration (FIXED: Matches Go Backend)
// ============================================================================

export interface StatusConfig {
  label: string;
  color: 'gray' | 'yellow' | 'blue' | 'green' | 'red' | 'purple' | 'orange';
  bgColor: string;
  textColor: string;
  borderColor: string;
  icon?: string;
  description: string;
}

// NEW ARCHITECTURE: Submission status is always 'received'
// These configs are for Enrichment and Analysis statuses
export const statusConfig: Record<string, StatusConfig> = {
  // Submission Status (NEW ARCHITECTURE)
  received: {
    label: 'Recebido',
    color: 'green',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    icon: 'CheckCircle',
    description: 'Submissão recebida',
  },

  // 1. Pending
  pending: {
    label: 'Pendente',
    color: 'yellow',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-200',
    icon: 'Clock',
    description: 'Aguardando processamento inicial',
  },

  // 2. Processing (Generic)
  processing: {
    label: 'Processando',
    color: 'blue',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    icon: 'Loader2',
    description: 'Sistema em operação',
  },

  // 3. Enrichment Phase
  enriching: {
    label: 'Enriquecendo',
    color: 'blue',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    icon: 'Database',
    description: 'Coletando dados públicos',
  },
  enriched: {
    label: 'Enriquecido',
    color: 'purple',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    icon: 'CheckCircle',
    description: 'Dados coletados, aguardando análise',
  },

  // 4. Analysis Phase
  analyzing: {
    label: 'Em Análise',
    color: 'orange',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
    icon: 'BarChart',
    description: 'IA gerando frameworks estratégicos',
  },
  analyzed: {
    label: 'Análise Pronta',
    color: 'purple',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    icon: 'FileText',
    description: 'Análise concluída internamente',
  },
  ready_for_review: {
    label: 'Revisão Final',
    color: 'purple',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    icon: 'Eye',
    description: 'Aguardando aprovação do consultor',
  },
  generating_report: {
    label: 'Gerando Relatório',
    color: 'orange',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
    icon: 'FileText',
    description: 'Compilando relatório final',
  },

  // 5. Completed
  completed: {
    label: 'ConcluA-do',
    color: 'green',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    icon: 'CheckCircle',
    description: 'RelatA3rio disponA-vel para download',
  },

  // 6. Errors
  failed: {
    label: 'Falhou',
    color: 'red',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    icon: 'AlertCircle',
    description: 'Erro genérico no processamento',
  },
  enrichment_failed: {
    label: 'Erro no Enriquecimento',
    color: 'red',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    icon: 'AlertTriangle',
    description: 'Falha ao coletar dados externos',
  },
  analysis_failed: {
    label: 'Erro na Análise',
    color: 'red',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    icon: 'AlertTriangle',
    description: 'Falha na geração de insights',
  },
  report_failed: {
    label: 'Erro no Relatório',
    color: 'red',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    icon: 'FileWarning',
    description: 'Falha na geração do PDF',
  },
};

// ============================================================================
// Industry & Company Size Options
// ============================================================================

export const industryOptions = [
  'Tecnologia e Software',
  'Serviços Financeiros',
  'Varejo e E-commerce',
  'Saúde e Farmacêutico',
  'Indústria e Manufatura',
  'Energia e Petróleo',
  'Alimentos e Bebidas',
  'Educação',
  'Construção Civil',
  'Agronegócio',
  'Logística e Transporte',
  'Telecomunicações',
  'Cosméticos e Beleza',
  'Automotivo',
  'Mídia e Entretenimento',
  'Consultoria',
  'Hotelaria e Turismo',
  'Outro',
] as const;

export const companySizeOptions = [
  'Pequena (1-50 funcionários)',
  'Média (51-500 funcionários)',
  'Grande (>500 funcionários)',
] as const;

// ============================================================================
// Pricing Configuration
// ============================================================================

export const pricingConfig = {
  basicReport: {
    name: 'Relatório Básico',
    price: 49900, // R$ 499,00 in cents
    currency: 'BRL',
    features: [
      'Análise PESTEL',
      '5 Forças de Porter',
      'Análise SWOT',
      'Entrega em 5 dias úteis',
    ],
  },
  professionalReport: {
    name: 'Relatório Profissional',
    price: 99900, // R$ 999,00 in cents
    currency: 'BRL',
    features: [
      'Todos frameworks (11 análises)',
      'Dados enriquecidos',
      'Relatório completo (13 páginas)',
      'Entrega em 3 dias úteis',
      'Suporte prioritário',
    ],
  },
} as const;

// ============================================================================
// Feature Flags
// ============================================================================

export const features = {
  enablePayments: true,
  enableSharing: true,
  enablePdfExport: true,
  enableEmailReports: true,
  enableApiAccess: false,
  maxSubmissionsPerUser: 10,
  reportExpirationDays: 365,
} as const;

// ============================================================================
// Helper Functions
// ============================================================================

export function getStatusConfig(status: string): StatusConfig {
  // Normalize to lowercase and handle unknown statuses
  // NEW ARCHITECTURE: Default to 'received' for submissions
  const s = status?.toLowerCase() || 'received';
  return statusConfig[s] || statusConfig.received;
}

export function getStatusLabel(status: string): string {
  return getStatusConfig(status).label;
}

export function isCompletedStatus(status: string): boolean {
  return status === 'completed';
}

export function isProcessingStatus(status: string): boolean {
  return [
    'enriching',
    'analyzing',
    'analyzed',
    'ready_for_review',
    'processing'
  ].includes(status || '');
}

/**
 * Get default route based on user role
 * @param role - User role ('admin', 'user', 'super_admin')
 * @returns Default landing page for the role
 */
export function getDefaultRouteByRole(role: string | undefined): string {
  if (!role) return dashboardRoutes.main;

  switch (role) {
    case 'admin':
    case 'super_admin':
      return adminRoutes.dashboard; // /admin/envios
    case 'user':
    default:
      return dashboardRoutes.main; // /dashboard
  }
}


