/**
 * Submission Form - Refactored
 *
 * Modular, guest-friendly submission form with:
 * - No authentication required (guest submissions enabled)
 * - Optional payment (controlled by feature flag)
 * - Reusable field components
 * - Comprehensive validation
 * - Design system compliance
 *
 * @module components/forms/submission-form-refactored
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { InputField, TextareaField, SelectField } from '@/components/forms/form-field';
import { useFormValidation, useCharacterCount } from '@/hooks/use-form-validation';
import { useCreateSubmission } from '@/hooks/use-submissions';
import { features } from '@/lib/config/features';
import {
  normalizeUrl,
  normalizePhone,
  normalizeSocialHandle,
} from '@/lib/utils/validators';
import { cn, colors } from '@/lib/design';
import type { SubmissionFormInput } from '@/types';

/**
 * Industry options for select field
 */
const INDUSTRY_OPTIONS = [
  { value: 'tecnologia', label: 'Tecnologia' },
  { value: 'varejo', label: 'Varejo' },
  { value: 'servicos', label: 'Serviços' },
  { value: 'saude', label: 'Saúde' },
  { value: 'educacao', label: 'Educação' },
  { value: 'financeiro', label: 'Financeiro' },
  { value: 'industria', label: 'Indústria' },
  { value: 'outro', label: 'Outro' },
];

/**
 * Employee count options
 */
const EMPLOYEE_COUNT_OPTIONS = [
  { value: '1-10', label: '1-10' },
  { value: '11-50', label: '11-50' },
  { value: '51-200', label: '51-200' },
  { value: '201-500', label: '201-500' },
  { value: '500+', label: '500+' },
];

/**
 * Review cycle options
 */
const REVIEW_CYCLE_OPTIONS = [
  { value: 'continuous', label: 'Contínuo' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'quarterly', label: 'Trimestral' },
  { value: 'biannual', label: 'Semestral' },
  { value: 'annual', label: 'Anual' },
];

/**
 * Submission Form Component
 *
 * Main form for collecting business information from users.
 * Supports both guest and authenticated submissions.
 *
 * Features:
 * - Guest user support (no login required)
 * - Optional payment (feature flag controlled)
 * - Real-time validation with helpful feedback
 * - Progressive disclosure (accordion for optional fields)
 * - Mobile-responsive design
 * - Accessibility compliant (ARIA labels, keyboard navigation)
 *
 * @example
 * ```tsx
 * <SubmissionFormRefactored />
 * ```
 */
export function SubmissionFormRefactored() {
  const router = useRouter();
  const { toast } = useToast();
  const createMutation = useCreateSubmission();
  const { validateField, getFieldError, getFieldWarning } = useFormValidation();
  const { count: challengeCount, setCount: setChallengeCount, getColorClass, getMessage } =
    useCharacterCount(100, 800);

  // Form state
  const [formData, setFormData] = useState<Partial<SubmissionFormInput>>({
    company_name: '',
    website_url: '',
    email: '',
    industry: '',
    main_challenge: '',
    phone: '',
    whatsapp: '',
    instagram: '',
    tiktok: '',
    company_linkedin: '',
    founder_linkedin: '',
    employee_count: '',
    founded_year: undefined,
    review_cycle: '',
  });

  /**
   * Update form field value
   */
  const updateField = <K extends keyof SubmissionFormInput>(
    field: K,
    value: SubmissionFormInput[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Handle form submission
   *
   * Process:
   * 1. Normalize data (URLs, phone numbers, handles)
   * 2. Submit to API
   * 3. Redirect based on feature flags:
   *    - If payment required: redirect to Stripe checkout
   *    - If no payment: show success message and optionally create account
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Normalize data
    const normalizedData: SubmissionFormInput = {
      company_name: formData.company_name || '',
      website_url: normalizeUrl(formData.website_url || ''),
      email: formData.email || '',
      industry: formData.industry as any,
      main_challenge: formData.main_challenge || '',
      phone: formData.phone ? normalizePhone(formData.phone) : undefined,
      whatsapp: formData.whatsapp ? normalizePhone(formData.whatsapp) : undefined,
      instagram: formData.instagram ? normalizeSocialHandle(formData.instagram) : undefined,
      tiktok: formData.tiktok ? normalizeSocialHandle(formData.tiktok) : undefined,
      company_linkedin: formData.company_linkedin ? normalizeUrl(formData.company_linkedin) : undefined,
      founder_linkedin: formData.founder_linkedin ? normalizeUrl(formData.founder_linkedin) : undefined,
      employee_count: formData.employee_count,
      founded_year: formData.founded_year,
      review_cycle: formData.review_cycle as any,
    };

    // Submit
    createMutation.mutate(normalizedData, {
      onSuccess: (data) => {
        toast({
          title: 'Submissão criada com sucesso!',
          description: features.requirePayment
            ? 'Redirecionando para pagamento...'
            : 'Sua análise será processada em breve.',
        });

        // Redirect based on feature flags
        if (features.requirePayment && data.checkout_url) {
          window.location.href = data.checkout_url;
        } else {
          // No payment required - show success and optionally create account
          router.push(`/reports/${data.submission.id}?guest=true`);
        }
      },
      onError: (error) => {
        toast({
          variant: 'destructive',
          title: 'Erro ao enviar',
          description: error instanceof Error ? error.message : 'Tente novamente',
        });
      },
    });
  };

  const isSubmitting = createMutation.isPending;

  return (
    <section id="submission-form" className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Solicite Seu Diagnóstico
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              {features.guestSubmissions
                ? 'Preencha os dados abaixo - sem necessidade de cadastro'
                : 'Preencha os dados abaixo e receba seu relatório em 24h'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>Dados essenciais para análise</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Nome da Empresa"
                    name="company_name"
                    value={formData.company_name || ''}
                    onChange={(e) => updateField('company_name', e.target.value)}
                    placeholder="Minha Empresa Ltda"
                    required
                  />
                  <InputField
                    label="Website"
                    name="website_url"
                    type="url"
                    value={formData.website_url || ''}
                    onChange={(e) => {
                      updateField('website_url', e.target.value);
                      validateField('website_url', e.target.value, 'url');
                    }}
                    placeholder="minhaempresa.com.br"
                    error={getFieldError('website_url')}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Email Corporativo"
                    name="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => {
                      updateField('email', e.target.value);
                      validateField('email', e.target.value, 'email', {
                        website: formData.website_url,
                      });
                    }}
                    placeholder="seu@empresa.com.br"
                    error={getFieldError('email')}
                    warning={getFieldWarning('email')}
                    required
                  />
                  <SelectField
                    label="Setor"
                    name="industry"
                    value={formData.industry || ''}
                    onValueChange={(value) => updateField('industry', value)}
                    options={INDUSTRY_OPTIONS}
                    required
                  />
                </div>

                <TextareaField
                  label="Principal Desafio do Negócio"
                  name="main_challenge"
                  value={formData.main_challenge || ''}
                  onChange={(e) => {
                    updateField('main_challenge', e.target.value);
                    setChallengeCount(e.target.value.length);
                    validateField('main_challenge', e.target.value, 'text', {
                      minLength: 100,
                      maxLength: 800,
                    });
                  }}
                  placeholder="Descreva seu maior desafio atual (100-800 caracteres)"
                  rows={5}
                  minLength={100}
                  maxLength={800}
                  showCharCount
                  error={getFieldError('main_challenge')}
                  required
                />
              </CardContent>
            </Card>

            {/* Optional Fields - Accordion */}
            <Accordion type="multiple" className="space-y-4">
              {/* Contact Information */}
              <AccordionItem value="contact" className="border rounded-lg px-6">
                <AccordionTrigger className="hover:no-underline">
                  <div className="text-left">
                    <div className="font-semibold">Informações de Contato</div>
                    <div className="text-sm text-muted-foreground">
                      <span className={cn('inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full mr-2')}>
                        Opcional
                      </span>
                      Melhora qualidade da análise em 40%
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Telefone"
                      name="phone"
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="(11) 98765-4321"
                    />
                    <InputField
                      label="WhatsApp"
                      name="whatsapp"
                      type="tel"
                      value={formData.whatsapp || ''}
                      onChange={(e) => updateField('whatsapp', e.target.value)}
                      placeholder="(11) 98765-4321"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Social Media */}
              <AccordionItem value="social" className="border rounded-lg px-6">
                <AccordionTrigger className="hover:no-underline">
                  <div className="text-left">
                    <div className="font-semibold">Redes Sociais</div>
                    <div className="text-sm text-gray-500">Opcional - Para análise de presença digital</div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Instagram"
                      name="instagram"
                      value={formData.instagram || ''}
                      onChange={(e) => updateField('instagram', e.target.value)}
                      placeholder="minhaempresa ou @minhaempresa"
                    />
                    <InputField
                      label="TikTok"
                      name="tiktok"
                      value={formData.tiktok || ''}
                      onChange={(e) => updateField('tiktok', e.target.value)}
                      placeholder="minhaempresa ou @minhaempresa"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* LinkedIn */}
              <AccordionItem value="linkedin" className="border rounded-lg px-6">
                <AccordionTrigger className="hover:no-underline">
                  <div className="text-left">
                    <div className="font-semibold">LinkedIn</div>
                    <div className="text-sm text-gray-500">Opcional - Para análise profissional</div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-4">
                  <InputField
                    label="LinkedIn da Empresa"
                    name="company_linkedin"
                    type="url"
                    value={formData.company_linkedin || ''}
                    onChange={(e) => updateField('company_linkedin', e.target.value)}
                    placeholder="linkedin.com/company/minhaempresa"
                  />
                  <InputField
                    label="LinkedIn do Fundador"
                    name="founder_linkedin"
                    type="url"
                    value={formData.founder_linkedin || ''}
                    onChange={(e) => updateField('founder_linkedin', e.target.value)}
                    placeholder="linkedin.com/in/fundador"
                  />
                </AccordionContent>
              </AccordionItem>

              {/* Company Details */}
              <AccordionItem value="details" className="border rounded-lg px-6">
                <AccordionTrigger className="hover:no-underline">
                  <div className="text-left">
                    <div className="font-semibold">Detalhes da Empresa</div>
                    <div className="text-sm text-gray-500">Opcional - Para contexto adicional</div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SelectField
                      label="Funcionários"
                      name="employee_count"
                      value={formData.employee_count || ''}
                      onValueChange={(value) => updateField('employee_count', value)}
                      options={EMPLOYEE_COUNT_OPTIONS}
                    />
                    <InputField
                      label="Ano de Fundação"
                      name="founded_year"
                      type="number"
                      value={formData.founded_year?.toString() || ''}
                      onChange={(e) =>
                        updateField('founded_year', parseInt(e.target.value) || undefined)
                      }
                      placeholder="2020"
                    />
                    <SelectField
                      label="Ciclo de Revisão"
                      name="review_cycle"
                      value={formData.review_cycle || ''}
                      onValueChange={(value) => updateField('review_cycle', value)}
                      options={REVIEW_CYCLE_OPTIONS}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Submit Button */}
            <Card className="bg-primary/10 border-primary/20">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    {features.requirePayment ? (
                      <div>
                        <div className="text-2xl font-bold text-primary">R$ 890</div>
                        <div className="text-sm text-muted-foreground">Pagamento único</div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-2xl font-bold text-green-600">Gratuito</div>
                        <div className="text-sm text-muted-foreground">
                          Análise completa sem custo inicial
                        </div>
                      </div>
                    )}
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting || challengeCount < 100 || challengeCount > 800}
                      className="px-8"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processando...
                        </>
                      ) : features.requirePayment ? (
                        'Enviar e Prosseguir para Pagamento'
                      ) : (
                        'Enviar Análise'
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    {features.guestSubmissions
                      ? 'Sem necessidade de cadastro ou login'
                      : features.requirePayment
                      ? 'Ao enviar, você será redirecionado para o pagamento seguro via Stripe'
                      : 'Sua análise será processada automaticamente'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </section>
  );
}
