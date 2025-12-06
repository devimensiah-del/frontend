// Challenge Types Configuration
// Matches backend domain/analysis/challenge_types.go

export type ChallengeCategory = 'growth' | 'transform' | 'transition' | 'compete' | 'funding';

export interface ChallengeType {
  code: string;
  category: ChallengeCategory;
  label: string;
  description: string;
  example: string;
}

export interface ChallengeCategoryInfo {
  code: ChallengeCategory;
  label: string;
  description: string;
}

// Challenge categories
export const CHALLENGE_CATEGORIES: ChallengeCategoryInfo[] = [
  { code: 'growth', label: 'Crescimento', description: 'Estratégias de expansão e crescimento' },
  { code: 'transform', label: 'Transformação', description: 'Mudanças estruturais e modernização' },
  { code: 'transition', label: 'Transição', description: 'Sucessão, M&A e mudanças de controle' },
  { code: 'compete', label: 'Competitividade', description: 'Posicionamento e diferenciação' },
  { code: 'funding', label: 'Funding', description: 'Captação e estrutura de capital' },
];

// Challenge types by category
export const CHALLENGE_TYPES: Record<ChallengeCategory, ChallengeType[]> = {
  growth: [
    { code: 'growth_organic', category: 'growth', label: 'Crescimento Orgânico', description: 'Crescer com recursos próprios', example: 'Aumentar faturamento 20% ao ano' },
    { code: 'growth_geographic', category: 'growth', label: 'Expansão Geográfica', description: 'Expandir para novas regiões', example: 'Entrar no Nordeste' },
    { code: 'growth_segment', category: 'growth', label: 'Novo Segmento', description: 'Entrar em novo segmento de mercado', example: 'Atender indústria além de agro' },
    { code: 'growth_product', category: 'growth', label: 'Novos Produtos', description: 'Lançar novos produtos/serviços', example: 'Criar linha de serviços' },
    { code: 'growth_channel', category: 'growth', label: 'Novos Canais', description: 'Novos canais de venda', example: 'Vender direto ao consumidor' },
  ],
  transform: [
    { code: 'transform_digital', category: 'transform', label: 'Transformação Digital', description: 'Digitalização de processos', example: 'Implementar ERP/CRM' },
    { code: 'transform_model', category: 'transform', label: 'Modelo de Negócio', description: 'Mudar modelo de negócio', example: 'De venda para assinatura' },
    { code: 'transform_culture', category: 'transform', label: 'Cultura Organizacional', description: 'Mudança cultural/organizacional', example: 'Profissionalizar gestão familiar' },
    { code: 'transform_operational', category: 'transform', label: 'Eficiência Operacional', description: 'Eficiência operacional', example: 'Reduzir custos em 15%' },
  ],
  transition: [
    { code: 'transition_succession', category: 'transition', label: 'Sucessão', description: 'Sucessão familiar/executiva', example: 'Preparar próxima geração' },
    { code: 'transition_exit', category: 'transition', label: 'Preparação para Venda', description: 'Preparar para venda', example: 'M&A em 3 anos' },
    { code: 'transition_merger', category: 'transition', label: 'Integração', description: 'Integrar aquisição', example: 'Compramos concorrente' },
    { code: 'transition_turnaround', category: 'transition', label: 'Turnaround', description: 'Recuperação de crise', example: 'Empresa em dificuldade' },
  ],
  compete: [
    { code: 'compete_differentiate', category: 'compete', label: 'Diferenciação', description: 'Criar diferenciação', example: 'Sair da guerra de preço' },
    { code: 'compete_defend', category: 'compete', label: 'Defender Posição', description: 'Defender posição de mercado', example: 'Novos entrantes ameaçando' },
    { code: 'compete_reposition', category: 'compete', label: 'Reposicionamento', description: 'Reposicionar marca', example: 'Subir de segmento' },
  ],
  funding: [
    { code: 'funding_raise', category: 'funding', label: 'Captação', description: 'Captar investimento', example: 'Buscar Series A' },
    { code: 'funding_debt', category: 'funding', label: 'Estruturação de Dívida', description: 'Estruturar dívida', example: 'Renegociar com bancos' },
    { code: 'funding_ipo', category: 'funding', label: 'Abertura de Capital', description: 'Preparar abertura', example: 'IPO em 5 anos' },
  ],
};

// Get all challenge types as flat array
export function getAllChallengeTypes(): ChallengeType[] {
  return Object.values(CHALLENGE_TYPES).flat();
}

// Get challenge type by code
export function getChallengeType(code: string): ChallengeType | undefined {
  return getAllChallengeTypes().find(t => t.code === code);
}

// Get category info by code
export function getCategoryInfo(code: ChallengeCategory): ChallengeCategoryInfo | undefined {
  return CHALLENGE_CATEGORIES.find(c => c.code === code);
}

// Get types for a category
export function getTypesForCategory(category: ChallengeCategory): ChallengeType[] {
  return CHALLENGE_TYPES[category] || [];
}
