import { z } from 'zod'

// Challenge categories and their corresponding types
export const challengeTypes = {
  growth: [
    { value: 'growth_organic', label: 'Crescimento Orgânico' },
    { value: 'growth_geographic', label: 'Expansão Geográfica' },
    { value: 'growth_segment', label: 'Novo Segmento' },
    { value: 'growth_product', label: 'Novo Produto/Serviço' },
    { value: 'growth_channel', label: 'Novo Canal' },
  ],
  transform: [
    { value: 'transform_digital', label: 'Transformação Digital' },
    { value: 'transform_model', label: 'Mudança de Modelo de Negócio' },
    { value: 'transform_culture', label: 'Mudança Cultural' },
    { value: 'transform_operational', label: 'Transformação Operacional' },
  ],
  transition: [
    { value: 'transition_succession', label: 'Sucessão' },
    { value: 'transition_exit', label: 'Preparação para Saída/Venda' },
    { value: 'transition_merger', label: 'Fusão/Aquisição' },
    { value: 'transition_turnaround', label: 'Recuperação/Turnaround' },
  ],
  compete: [
    { value: 'compete_differentiate', label: 'Diferenciação Competitiva' },
    { value: 'compete_defend', label: 'Defesa de Posicionamento' },
    { value: 'compete_reposition', label: 'Reposicionamento' },
  ],
  funding: [
    { value: 'funding_raise', label: 'Captação de Investimento' },
    { value: 'funding_debt', label: 'Financiamento/Dívida' },
    { value: 'funding_ipo', label: 'Preparação para IPO' },
  ],
} as const

export type ChallengeCategory = keyof typeof challengeTypes

// Company size options
export const companySizes = [
  { value: 'small', label: 'Pequena (1-50 funcionários)' },
  { value: 'medium', label: 'Média (51-200 funcionários)' },
  { value: 'large', label: 'Grande (201-1000 funcionários)' },
  { value: 'enterprise', label: 'Enterprise (1000+ funcionários)' },
] as const

// Submission form validation schema
export const submissionSchema = z.object({
  // Required fields
  companyName: z
    .string()
    .min(2, 'Nome da empresa deve ter pelo menos 2 caracteres')
    .max(200, 'Nome da empresa muito longo'),

  contactEmail: z
    .string()
    .email('E-mail inválido')
    .min(1, 'E-mail é obrigatório'),

  challengeCategory: z.enum(['growth', 'transform', 'transition', 'compete', 'funding'], {
    required_error: 'Selecione uma categoria de desafio',
  }),

  challengeType: z
    .string()
    .min(1, 'Selecione o tipo específico de desafio'),

  businessChallenge: z
    .string()
    .min(50, 'Descreva o desafio com pelo menos 50 caracteres')
    .max(5000, 'Descrição muito longa (máximo 5000 caracteres)'),

  // Optional company fields
  cnpj: z
    .string()
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ inválido (formato: 00.000.000/0000-00)')
    .optional()
    .or(z.literal('')),

  industry: z
    .string()
    .max(100, 'Setor muito longo')
    .optional()
    .or(z.literal('')),

  companySize: z
    .enum(['small', 'medium', 'large', 'enterprise'])
    .optional(),

  website: z
    .string()
    .url('URL inválida')
    .optional()
    .or(z.literal('')),

  // Contact information
  contactName: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo')
    .optional()
    .or(z.literal('')),

  contactPhone: z
    .string()
    .regex(/^\+?[\d\s\(\)-]+$/, 'Telefone inválido')
    .optional()
    .or(z.literal('')),

  contactPosition: z
    .string()
    .max(100, 'Cargo muito longo')
    .optional()
    .or(z.literal('')),

  // Additional business context
  companyLocation: z
    .string()
    .max(200, 'Localização muito longa')
    .optional()
    .or(z.literal('')),

  targetMarket: z
    .string()
    .max(200, 'Mercado-alvo muito longo')
    .optional()
    .or(z.literal('')),

  annualRevenueMin: z
    .number()
    .positive('Receita deve ser positiva')
    .optional(),

  annualRevenueMax: z
    .number()
    .positive('Receita deve ser positiva')
    .optional(),

  fundingStage: z
    .string()
    .max(100, 'Estágio de investimento muito longo')
    .optional()
    .or(z.literal('')),

  additionalNotes: z
    .string()
    .max(2000, 'Notas muito longas')
    .optional()
    .or(z.literal('')),

  linkedinUrl: z
    .string()
    .url('URL do LinkedIn inválida')
    .optional()
    .or(z.literal('')),

  twitterHandle: z
    .string()
    .regex(/^@?[\w]+$/, 'Handle do Twitter inválido')
    .optional()
    .or(z.literal('')),
}).refine(
  (data) => {
    // If both revenue fields are provided, min must be less than max
    if (data.annualRevenueMin && data.annualRevenueMax) {
      return data.annualRevenueMin <= data.annualRevenueMax
    }
    return true
  },
  {
    message: 'Receita mínima deve ser menor que a máxima',
    path: ['annualRevenueMax'],
  }
)

export type SubmissionFormData = z.infer<typeof submissionSchema>

// Helper to convert form data to API request format
export function formatSubmissionForAPI(data: SubmissionFormData) {
  // Build additionalInfo JSON string
  const additionalInfo = {
    contactName: data.contactName || undefined,
    contactEmail: data.contactEmail,
    contactPhone: data.contactPhone || undefined,
    contactPosition: data.contactPosition || undefined,
    companyLocation: data.companyLocation || undefined,
    targetMarket: data.targetMarket || undefined,
    annualRevenueMin: data.annualRevenueMin || undefined,
    annualRevenueMax: data.annualRevenueMax || undefined,
    fundingStage: data.fundingStage || undefined,
    additionalNotes: data.additionalNotes || undefined,
    linkedinUrl: data.linkedinUrl || undefined,
    twitterHandle: data.twitterHandle || undefined,
  }

  return {
    companyName: data.companyName,
    challengeCategory: data.challengeCategory,
    challengeType: data.challengeType,
    businessChallenge: data.businessChallenge,
    cnpj: data.cnpj || undefined,
    industry: data.industry || undefined,
    companySize: data.companySize || undefined,
    website: data.website || undefined,
    additionalInfo: JSON.stringify(additionalInfo),
  }
}
