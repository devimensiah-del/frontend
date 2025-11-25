// Analysis Framework Access Configuration
// Defines which frameworks are free, partially visible, or locked for non-paying users

export type AccessLevel = 'free' | 'partial' | 'locked';

export interface FrameworkAccessConfig {
  id: string;
  name: string;
  accessLevel: AccessLevel;
  // For partial access, which fields to show
  visibleFields?: string[];
  // Teaser message shown on locked content
  teaserMessage?: string;
}

// Framework access configuration
// - free: 100% visible to all users
// - partial: structure visible, details blurred
// - locked: completely blurred with teaser
export const frameworkAccessConfig: Record<string, FrameworkAccessConfig> = {
  // FREE - Generate desire, show quality
  synthesis: {
    id: 'synthesis',
    name: 'Síntese Executiva',
    accessLevel: 'free',
  },
  swot: {
    id: 'swot',
    name: 'SWOT',
    accessLevel: 'free',
  },
  pestel: {
    id: 'pestel',
    name: 'PESTEL',
    accessLevel: 'partial',
    visibleFields: ['summary'],
    teaserMessage: 'Desbloqueie para ver a análise detalhada de cada fator político, econômico, social, tecnológico, ambiental e legal.',
  },

  // PARTIAL - Show structure, hide details
  porter: {
    id: 'porter',
    name: '5 Forças de Porter',
    accessLevel: 'partial',
    visibleFields: ['summary', 'overall_attractiveness'],
    teaserMessage: 'Desbloqueie para ver a análise completa das forças competitivas e implicações estratégicas.',
  },
  tam_sam_som: {
    id: 'tam_sam_som',
    name: 'TAM/SAM/SOM',
    accessLevel: 'partial',
    visibleFields: ['tam', 'sam', 'som'],
    teaserMessage: 'Desbloqueie para ver premissas, metodologia e próximos passos de dimensionamento.',
  },
  benchmarking: {
    id: 'benchmarking',
    name: 'Benchmarking',
    accessLevel: 'partial',
    visibleFields: ['competitors_analyzed'],
    teaserMessage: 'Desbloqueie para ver gaps de performance e melhores práticas dos concorrentes.',
  },

  // LOCKED - The strategic gold
  blue_ocean: {
    id: 'blue_ocean',
    name: 'Blue Ocean Strategy',
    accessLevel: 'locked',
    teaserMessage: 'Desbloqueie para descobrir ações concretas de diferenciação: o que eliminar, reduzir, elevar e criar.',
  },
  growth_hacking: {
    id: 'growth_hacking',
    name: 'Growth Hacking',
    accessLevel: 'locked',
    teaserMessage: 'Desbloqueie para ver táticas de aquisição (LEAP) e monetização (SCALE) específicas para seu negócio.',
  },
  okrs: {
    id: 'okrs',
    name: 'OKRs Trimestrais',
    accessLevel: 'locked',
    teaserMessage: 'Desbloqueie para ver o roadmap executável com objetivos, metas e investimentos por trimestre.',
  },
  scenarios: {
    id: 'scenarios',
    name: 'Análise de Cenários',
    accessLevel: 'locked',
    teaserMessage: 'Desbloqueie para ver cenários otimista, realista e pessimista com ações de mitigação.',
  },
  bsc: {
    id: 'bsc',
    name: 'Balanced Scorecard',
    accessLevel: 'locked',
    teaserMessage: 'Desbloqueie para ver métricas balanceadas nas perspectivas financeira, cliente, processos e aprendizado.',
  },
  decision_matrix: {
    id: 'decision_matrix',
    name: 'Matriz de Decisão',
    accessLevel: 'locked',
    teaserMessage: 'Desbloqueie para ver recomendações priorizadas com timeline, budget e métricas de monitoramento.',
  },
};

// Helper to check if a framework is accessible
export function getFrameworkAccess(frameworkId: string, isAdmin: boolean, hasPaid: boolean = false): AccessLevel {
  // Admin always has full access
  if (isAdmin) return 'free';

  // Paid users have full access
  if (hasPaid) return 'free';

  // Return configured access level for non-paying users
  return frameworkAccessConfig[frameworkId]?.accessLevel || 'locked';
}

// Helper to get teaser message
export function getTeaserMessage(frameworkId: string): string {
  return frameworkAccessConfig[frameworkId]?.teaserMessage ||
    'Desbloqueie a análise completa para ver este conteúdo estratégico.';
}

// Helper to check if field is visible in partial access
export function isFieldVisible(frameworkId: string, fieldName: string, isAdmin: boolean, hasPaid: boolean = false): boolean {
  if (isAdmin || hasPaid) return true;

  const config = frameworkAccessConfig[frameworkId];
  if (!config) return false;

  if (config.accessLevel === 'free') return true;
  if (config.accessLevel === 'locked') return false;

  // Partial access - check visible fields
  return config.visibleFields?.includes(fieldName) || false;
}

// Count free vs locked frameworks for UI messaging
export function getAccessStats() {
  const configs = Object.values(frameworkAccessConfig);
  return {
    total: configs.length,
    free: configs.filter(c => c.accessLevel === 'free').length,
    partial: configs.filter(c => c.accessLevel === 'partial').length,
    locked: configs.filter(c => c.accessLevel === 'locked').length,
  };
}
