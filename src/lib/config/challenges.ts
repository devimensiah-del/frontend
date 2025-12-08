// Challenge Types Configuration
// Matches backend domain/analysis/challenge_types.go

export type ChallengeCategory = 'growth' | 'transform' | 'compete'

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
  { code: 'compete', label: 'Competitividade', emoji: '⚔️' },
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
  ],
  compete: [
    { code: 'compete_differentiate', category: 'compete', label: 'Diferenciação', description: 'Criar diferenciação', emoji: '⭐' },
    { code: 'compete_defend', category: 'compete', label: 'Defender Posição', description: 'Defender posição de mercado', emoji: '🛡️' },
    { code: 'compete_reposition', category: 'compete', label: 'Reposicionamento', description: 'Reposicionar marca', emoji: '📍' },
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
