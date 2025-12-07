'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useCreateSubmission } from '@/lib/hooks'
import type { CreateSubmissionRequest } from '@/lib/types'

// Challenge configuration
const CHALLENGE_CATEGORIES = [
  { code: 'growth', label: 'Crescimento', description: 'Estratégias de expansão e crescimento' },
  { code: 'transform', label: 'Transformação', description: 'Mudanças estruturais e modernização' },
  { code: 'transition', label: 'Transição', description: 'Sucessão, M&A e mudanças de controle' },
  { code: 'compete', label: 'Competitividade', description: 'Posicionamento e diferenciação' },
  { code: 'funding', label: 'Funding', description: 'Captação e estrutura de capital' },
] as const

type ChallengeCategory = typeof CHALLENGE_CATEGORIES[number]['code']

const CHALLENGE_TYPES: Record<ChallengeCategory, { code: string; label: string }[]> = {
  growth: [
    { code: 'growth_organic', label: 'Crescimento Orgânico' },
    { code: 'growth_geographic', label: 'Expansão Geográfica' },
    { code: 'growth_segment', label: 'Novo Segmento' },
    { code: 'growth_product', label: 'Novos Produtos' },
    { code: 'growth_channel', label: 'Novos Canais' },
  ],
  transform: [
    { code: 'transform_digital', label: 'Transformação Digital' },
    { code: 'transform_model', label: 'Modelo de Negócio' },
    { code: 'transform_culture', label: 'Cultura Organizacional' },
    { code: 'transform_operational', label: 'Eficiência Operacional' },
  ],
  transition: [
    { code: 'transition_succession', label: 'Sucessão' },
    { code: 'transition_exit', label: 'Preparação para Venda' },
    { code: 'transition_merger', label: 'Integração' },
    { code: 'transition_turnaround', label: 'Turnaround' },
  ],
  compete: [
    { code: 'compete_differentiate', label: 'Diferenciação' },
    { code: 'compete_defend', label: 'Defender Posição' },
    { code: 'compete_reposition', label: 'Reposicionamento' },
  ],
  funding: [
    { code: 'funding_raise', label: 'Captação' },
    { code: 'funding_debt', label: 'Estruturação de Dívida' },
    { code: 'funding_ipo', label: 'Abertura de Capital' },
  ],
}

const formSchema = z.object({
  // Required
  company_name: z.string().min(1, 'Nome da empresa é obrigatório'),
  contact_name: z.string().min(1, 'Seu nome é obrigatório'),
  contact_email: z.string().email('Email inválido'),
  challenge_category: z.enum(['growth', 'transform', 'transition', 'compete', 'funding'], {
    required_error: 'Selecione uma categoria',
  }),
  challenge_type: z.string().min(1, 'Selecione o tipo'),
  business_challenge: z.string().min(10, 'Descreva seu desafio com mais detalhes'),
  // Optional
  cnpj: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  industry: z.string().optional(),
  company_size: z.string().optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  position: z.string().optional(),
  target_market: z.string().optional(),
  funding_stage: z.string().optional(),
  linkedin_url: z.string().url().optional().or(z.literal('')),
  twitter_handle: z.string().optional(),
  additional_notes: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

const companySizeOptions = [
  { value: '1-10', label: '1-10 funcionários' },
  { value: '11-50', label: '11-50 funcionários' },
  { value: '51-200', label: '51-200 funcionários' },
  { value: '201-500', label: '201-500 funcionários' },
  { value: '501+', label: '501+ funcionários' },
]

const fundingStageOptions = [
  { value: 'bootstrapped', label: 'Bootstrapped' },
  { value: 'seed', label: 'Seed' },
  { value: 'series-a', label: 'Series A' },
  { value: 'series-b', label: 'Series B' },
  { value: 'series-c+', label: 'Series C+' },
  { value: 'public', label: 'Pública' },
]

export function SubmitSection() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory | ''>('')
  const createSubmission = useCreateSubmission()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: '',
      contact_name: '',
      contact_email: '',
      challenge_type: '',
      business_challenge: '',
    },
  })

  const challengeCategory = watch('challenge_category')

  const onSubmit = async (data: FormData) => {
    try {
      // Build additionalInfo JSON string for contact details
      const additionalInfoData = {
        contactName: data.contact_name,
        contactEmail: data.contact_email,
        contactPhone: data.phone || '',
        contactPosition: data.position || '',
        companyLocation: data.location || '',
        targetMarket: data.target_market || '',
        fundingStage: data.funding_stage || '',
        linkedinUrl: data.linkedin_url || '',
        twitterHandle: data.twitter_handle || '',
        additionalNotes: data.additional_notes || '',
      }

      // Map form data to API request format (camelCase to match backend)
      const requestData: CreateSubmissionRequest = {
        companyName: data.company_name,
        challengeCategory: data.challenge_category,
        challengeType: data.challenge_type,
        businessChallenge: data.business_challenge,
        cnpj: data.cnpj || undefined,
        industry: data.industry || undefined,
        companySize: data.company_size || undefined,
        website: data.website || undefined,
        additionalInfo: JSON.stringify(additionalInfoData),
      }

      await createSubmission.mutateAsync(requestData)
      router.push('/obrigado')
    } catch {
      toast.error('Erro ao enviar', {
        description: 'Ocorreu um erro ao processar sua solicitação. Tente novamente.',
      })
    }
  }

  return (
    <section id="diagnostico" className="py-24 bg-surface-paper">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 lg:p-12 border border-line shadow-sm relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gold-500" />

          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-medium text-navy-900 mb-2">
              Solicitar Diagnóstico Estratégico
            </h2>
            <p className="text-muted-foreground">
              Preencha os dados abaixo para iniciar nossa análise híbrida (IA + IH).
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Required Fields */}
            <div className="space-y-6">
              <h3 className="text-sm font-medium uppercase tracking-wider text-gold-500 border-b border-line pb-2">
                Informações Obrigatórias
              </h3>

              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="company_name">Nome da Empresa *</Label>
                  <Input
                    id="company_name"
                    placeholder="Acme Corp"
                    {...register('company_name')}
                    className="mt-1"
                  />
                  {errors.company_name && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.company_name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="contact_name">Seu Nome *</Label>
                  <Input
                    id="contact_name"
                    placeholder="João Silva"
                    {...register('contact_name')}
                    className="mt-1"
                  />
                  {errors.contact_name && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.contact_name.message}
                    </p>
                  )}
                </div>
                <div className="lg:col-span-2">
                  <Label htmlFor="contact_email">Seu Email *</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    placeholder="joao@acme.com"
                    {...register('contact_email')}
                    className="mt-1"
                  />
                  {errors.contact_email && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.contact_email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Challenge Definition */}
              <div className="bg-surface-paper border border-line p-6 rounded-lg space-y-4">
                <h4 className="font-medium text-navy-900">Definição do Desafio</h4>

                <div className="grid lg:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="challenge_category">Categoria do Desafio *</Label>
                    <Select
                      value={challengeCategory}
                      onValueChange={(value: ChallengeCategory) => {
                        setValue('challenge_category', value)
                        setSelectedCategory(value)
                        setValue('challenge_type', '') // Reset type when category changes
                      }}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {CHALLENGE_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.code} value={cat.code}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.challenge_category && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.challenge_category.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="challenge_type">Tipo do Desafio *</Label>
                    <Select
                      value={watch('challenge_type')}
                      onValueChange={(value) => setValue('challenge_type', value)}
                      disabled={!selectedCategory}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder={selectedCategory ? "Selecione o tipo" : "Selecione a categoria primeiro"} />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedCategory && CHALLENGE_TYPES[selectedCategory]?.map((type) => (
                          <SelectItem key={type.code} value={type.code}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.challenge_type && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.challenge_type.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="business_challenge">Descreva o Desafio *</Label>
                  <Textarea
                    id="business_challenge"
                    placeholder="Descreva em detalhes o principal desafio estratégico que sua empresa enfrenta hoje..."
                    rows={4}
                    {...register('business_challenge')}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Seja o mais específico possível. Isso guiará nossa análise.
                  </p>
                  {errors.business_challenge && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.business_challenge.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Optional Fields - Accordion */}
            <Accordion type="single" collapsible className="border-t border-line">
              <AccordionItem value="optional" className="border-b-0">
                <AccordionTrigger className="text-sm font-medium uppercase tracking-wider text-navy-900 hover:text-gold-500 py-4">
                  Informações Opcionais (Clique para expandir)
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-6 space-y-6">
                  <div className="grid lg:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cnpj">CNPJ</Label>
                      <Input
                        id="cnpj"
                        placeholder="00.000.000/0001-00"
                        {...register('cnpj')}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        placeholder="https://acme.com"
                        {...register('website')}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="industry">Setor</Label>
                      <Input
                        id="industry"
                        placeholder="Tecnologia, Saúde, Finanças..."
                        {...register('industry')}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company_size">Tamanho da Empresa</Label>
                      <Select onValueChange={(value) => setValue('company_size', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {companySizeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="location">Localização</Label>
                      <Input
                        id="location"
                        placeholder="São Paulo, SP"
                        {...register('location')}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        placeholder="(11) 98765-4321"
                        {...register('phone')}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="position">Cargo</Label>
                      <Input
                        id="position"
                        placeholder="CEO, Diretor..."
                        {...register('position')}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="target_market">Mercado Alvo</Label>
                      <Input
                        id="target_market"
                        placeholder="B2B, B2C, B2B2C..."
                        {...register('target_market')}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="funding_stage">Estágio de Financiamento</Label>
                      <Select onValueChange={(value) => setValue('funding_stage', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {fundingStageOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="linkedin_url">LinkedIn</Label>
                      <Input
                        id="linkedin_url"
                        placeholder="https://linkedin.com/company/..."
                        {...register('linkedin_url')}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="twitter_handle">Twitter/X</Label>
                      <Input
                        id="twitter_handle"
                        placeholder="@acmecorp"
                        {...register('twitter_handle')}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="additional_notes">Notas Adicionais</Label>
                    <Textarea
                      id="additional_notes"
                      placeholder="Qualquer informação adicional que possa ser relevante..."
                      rows={3}
                      {...register('additional_notes')}
                      className="mt-1"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Submit */}
            <div className="pt-6">
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={createSubmission.isPending}
              >
                {createSubmission.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    Enviar para Análise
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-4">
                Seus dados são tratados com estrita confidencialidade.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
