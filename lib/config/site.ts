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
        title: 'Dashboard',
        href: '/dashboard',
        icon: 'LayoutDashboard',
        description: 'Visão geral dos seus envios',
      },
      {
        title: 'Nova Análise',
        href: '/dashboard/nova-analise',
        icon: 'PlusCircle',
        description: 'Solicitar novo relatório estratégico',
      },
    ],
  },
  {
    title: 'Envios',
    items: [
      {
        title: 'Todos os Envios',
        href: '/dashboard/envios',
        icon: 'FileText',
        description: 'Ver histórico completo',
      },
      {
        title: 'Em Andamento',
        href: '/dashboard/envios?status=em_andamento',
        icon: 'Clock',
        description: 'Análises em processamento',
      },
      {
        title: 'Concluídos',
        href: '/dashboard/envios?status=concluido',
        icon: 'CheckCircle',
        description: 'Relatórios finalizados',
      },
    ],
  },
  {
    title: 'Conta',
    items: [
      {
        title: 'Configurações',
        href: '/account/settings',
        icon: 'Settings',
        description: 'Gerenciar sua conta',
      },
      {
        title: 'Pagamentos',
        href: '/account/payments',
        icon: 'CreditCard',
        description: 'Histórico e métodos de pagamento',
      },
    ],
  },
] as const;

// Admin Navigation
export const adminNav: NavSection[] = [
  {
    title: 'Administração',
    items: [
      {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: 'LayoutDashboard',
        description: 'Visão geral do sistema',
      },
    ],
  },
  {
    title: 'Gestão',
    items: [
      {
        title: 'Envios',
        href: '/admin/dashboard',
        icon: 'FileText',
        description: 'Gerenciar todos os envios',
      },
      {
        title: 'Enriquecimento',
        href: '/admin/enriquecimento',
        icon: 'Database',
        description: 'Aprovação de dados enriquecidos',
      },
      {
        title: 'Perfil',
        href: '/admin/profile',
        icon: 'User',
        description: 'Gerenciar perfil admin',
      },
    ],
  },
  {
    title: 'Sistema',
    items: [
      {
        title: 'Usuários',
        href: '/admin/users',
        icon: 'Users',
        description: 'Gerenciar usuários',
      },
      {
        title: 'Analytics',
        href: '/admin/analytics',
        icon: 'TrendingUp',
        description: 'Métricas e relatórios',
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
  novaAnalise: '/dashboard/nova-analise',
  envios: '/dashboard/envios',
  perfil: '/dashboard/perfil',
  configuracoes: '/account/settings',
  payments: '/account/payments',
} as const;

export const adminRoutes = {
  dashboard: '/admin/dashboard',
  submissions: '/admin/submissions',
  enriquecimento: '/admin/enriquecimento',
  enrichment: '/admin/enrichment',
  analysis: '/admin/analysis',
  analytics: '/admin/analytics',
  users: '/admin/users',
  profile: '/admin/profile',
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
// Status Configuration
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

export const statusConfig: Record<SubmissionStatus, StatusConfig> = {
  pendente: {
    label: 'Pendente',
    color: 'gray',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-200',
    icon: 'Clock',
    description: 'Aguardando revisão inicial',
  },
  aguardando_pagamento: {
    label: 'Aguardando Pagamento',
    color: 'yellow',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-200',
    icon: 'CreditCard',
    description: 'Pagamento pendente',
  },
  em_enriquecimento: {
    label: 'Em Enriquecimento',
    color: 'blue',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    icon: 'Database',
    description: 'Coletando e enriquecendo dados',
  },
  enriquecimento_completo: {
    label: 'Enriquecimento Completo',
    color: 'purple',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    icon: 'CheckCircle',
    description: 'Dados enriquecidos, pronto para análise',
  },
  em_analise: {
    label: 'Em Análise',
    color: 'blue',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    icon: 'BarChart',
    description: 'Análise estratégica em andamento',
  },
  analise_completa: {
    label: 'Análise Completa',
    color: 'purple',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    icon: 'CheckCircle',
    description: 'Análise concluída, gerando relatório',
  },
  em_geracao_relatorio: {
    label: 'Gerando Relatório',
    color: 'orange',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
    icon: 'FileText',
    description: 'Compilando relatório final',
  },
  concluido: {
    label: 'Concluído',
    color: 'green',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    icon: 'CheckCircle',
    description: 'Relatório disponível',
  },
  cancelado: {
    label: 'Cancelado',
    color: 'gray',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-200',
    icon: 'XCircle',
    description: 'Envio cancelado',
  },
  erro: {
    label: 'Erro',
    color: 'red',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    icon: 'AlertCircle',
    description: 'Erro no processamento',
  },
} as const;

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

export function getStatusConfig(status: SubmissionStatus): StatusConfig {
  return statusConfig[status];
}

export function getStatusLabel(status: SubmissionStatus): string {
  return statusConfig[status].label;
}

export function getStatusColor(status: SubmissionStatus): string {
  return statusConfig[status].color;
}

export function isCompletedStatus(status: SubmissionStatus): boolean {
  return status === 'concluido';
}

export function isErrorStatus(status: SubmissionStatus): boolean {
  return status === 'erro' || status === 'cancelado';
}

export function isProcessingStatus(status: SubmissionStatus): boolean {
  return [
    'em_enriquecimento',
    'em_analise',
    'em_geracao_relatorio',
  ].includes(status);
}

export function isPendingPayment(status: SubmissionStatus): boolean {
  return status === 'aguardando_pagamento';
}
