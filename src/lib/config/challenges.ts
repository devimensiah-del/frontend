// Challenge Types Configuration
// Matches backend domain/analysis/challenge_types.go

export type ChallengeCategory = 'growth' | 'transform' | 'transition' | 'compete' | 'funding'

export interface ChallengeTypeInfo {
  code: string
  category: ChallengeCategory
  label: string
  description: string
  emoji: string
}

export interface ChallengeCategoryInfo {
  code: ChallengeCategory
  label: string
  emoji: string
}

// Challenge categories
export const CHALLENGE_CATEGORIES: ChallengeCategoryInfo[] = [
  { code: 'growth', label: 'Crescimento', emoji: '🚀' },
  { code: 'transform', label: 'Transformação', emoji: '🔄' },
  { code: 'transition', label: 'Transição', emoji: '🔀' },
  { code: 'compete', label: 'Competitividade', emoji: '⚔️' },
  { code: 'funding', label: 'Funding', emoji: '💰' },
]

// Challenge types by category
export const CHALLENGE_TYPES: Record<ChallengeCategory, ChallengeTypeInfo[]> = {
  growth: [
    { code: 'growth_organic', category: 'growth', label: 'Crescimento Orgânico', description: 'Crescer com recursos próprios', emoji: '🌱' },
    { code: 'growth_geographic', category: 'growth', label: 'Expansão Geográfica', description: 'Expandir para novas regiões', emoji: '🗺️' },
    { code: 'growth_segment', category: 'growth', label: 'Novo Segmento', description: 'Entrar em novo segmento de mercado', emoji: '🎯' },
    { code: 'growth_product', category: 'growth', label: 'Novos Produtos', description: 'Lançar novos produtos/serviços', emoji: '📦' },
    { code: 'growth_channel', category: 'growth', label: 'Novos Canais', description: 'Novos canais de venda', emoji: '🛒' },
  ],
  transform: [
    { code: 'transform_digital', category: 'transform', label: 'Transformação Digital', description: 'Digitalização de processos', emoji: '💻' },
    { code: 'transform_model', category: 'transform', label: 'Modelo de Negócio', description: 'Mudar modelo de negócio', emoji: '🔧' },
    { code: 'transform_culture', category: 'transform', label: 'Cultura Organizacional', description: 'Mudança cultural/organizacional', emoji: '👥' },
    { code: 'transform_operational', category: 'transform', label: 'Eficiência Operacional', description: 'Eficiência operacional', emoji: '⚙️' },
  ],
  transition: [
    { code: 'transition_succession', category: 'transition', label: 'Sucessão', description: 'Sucessão familiar/executiva', emoji: '👨‍👦' },
    { code: 'transition_exit', category: 'transition', label: 'Preparação para Venda', description: 'Preparar para venda', emoji: '🏷️' },
    { code: 'transition_merger', category: 'transition', label: 'Integração', description: 'Integrar aquisição', emoji: '🤝' },
    { code: 'transition_turnaround', category: 'transition', label: 'Turnaround', description: 'Recuperação de crise', emoji: '🔃' },
  ],
  compete: [
    { code: 'compete_differentiate', category: 'compete', label: 'Diferenciação', description: 'Criar diferenciação', emoji: '⭐' },
    { code: 'compete_defend', category: 'compete', label: 'Defender Posição', description: 'Defender posição de mercado', emoji: '🛡️' },
    { code: 'compete_reposition', category: 'compete', label: 'Reposicionamento', description: 'Reposicionar marca', emoji: '📍' },
  ],
  funding: [
    { code: 'funding_raise', category: 'funding', label: 'Captação', description: 'Captar investimento', emoji: '📈' },
    { code: 'funding_debt', category: 'funding', label: 'Estruturação de Dívida', description: 'Estruturar dívida', emoji: '📊' },
    { code: 'funding_ipo', category: 'funding', label: 'Abertura de Capital', description: 'Preparar abertura', emoji: '🏛️' },
  ],
}

// Get all challenge types as flat array
export function getAllChallengeTypes(): ChallengeTypeInfo[] {
  return Object.values(CHALLENGE_TYPES).flat()
}

// Get challenge type by code
export function getChallengeType(code: string): ChallengeTypeInfo | undefined {
  return getAllChallengeTypes().find((t) => t.code === code)
}

// Get category info by code
export function getCategoryInfo(code: ChallengeCategory): ChallengeCategoryInfo | undefined {
  return CHALLENGE_CATEGORIES.find((c) => c.code === code)
}

// Get types for a category
export function getTypesForCategory(category: ChallengeCategory): ChallengeTypeInfo[] {
  return CHALLENGE_TYPES[category] || []
}
