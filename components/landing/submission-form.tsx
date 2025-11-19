'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/design';

interface SubmissionFormData {
  website: string;
  email: string;
  company: string;
  industry: string;
  challenge: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  tiktok: string;
  linkedin_company: string;
  linkedin_founder: string;
  employee_count: string;
  founded_year: string;
  review_cycle: string;
}

export function SubmissionForm() {
  const router = useRouter();
  const { toast } = useToast();
  const paymentsEnabled = (process.env.NEXT_PUBLIC_ENABLE_PAYMENTS || 'true') === 'true';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<SubmissionFormData>({
    website: '',
    email: '',
    company: '',
    industry: '',
    challenge: '',
    phone: '',
    whatsapp: '',
    instagram: '',
    tiktok: '',
    linkedin_company: '',
    linkedin_founder: '',
    employee_count: '',
    founded_year: '',
    review_cycle: '',
  });

  const updateField = (field: keyof SubmissionFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const normalizeUrl = (url: string): string => {
    if (!url) return '';
    // Remove leading/trailing whitespace
    url = url.trim();
    // If already has protocol, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Add https:// prefix
    return `https://${url}`;
  };

  const normalizeSocialHandle = (handle: string): string => {
    if (!handle) return '';
    // Remove leading/trailing whitespace
    handle = handle.trim();
    // Remove @ if present
    if (handle.startsWith('@')) {
      return handle.substring(1);
    }
    return handle;
  };

  const normalizePhone = (phone: string): string => {
    if (!phone) return '';
    // Remove all non-numeric characters (parentheses, hyphens, spaces)
    return phone.replace(/\D/g, '');
  };

  const validateCorporateEmail = (email: string): boolean => {
    const freeEmailDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    return !freeEmailDomains.includes(domain);
  };

  const validateEmailDomainMatchesWebsite = (email: string, website: string): { matches: boolean; message?: string } => {
    if (!email || !website) return { matches: true };

    try {
      const emailDomain = email.split('@')[1]?.toLowerCase();
      const websiteUrl = website.startsWith('http') ? website : `https://${website}`;
      const websiteDomain = new URL(websiteUrl).hostname.replace('www.', '').toLowerCase();

      if (emailDomain !== websiteDomain) {
        return {
          matches: false,
          message: `Email e website têm domínios diferentes (${emailDomain} vs ${websiteDomain}). Confirmar?`
        };
      }
      return { matches: true };
    } catch {
      return { matches: true };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.challenge.length < 100 || formData.challenge.length > 800) {
      toast({
        variant: 'destructive',
        title: 'Erro de validação',
        description: 'O desafio deve ter entre 100 e 800 caracteres',
      });
      return;
    }

    if (!validateCorporateEmail(formData.email)) {
      toast({
        variant: 'destructive',
        title: 'Email corporativo necessário',
        description: 'Por favor, use um email corporativo (não Gmail, Hotmail, etc)',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Normalize URLs and social handles
      const normalizedData = {
        ...formData,
        company_name: formData.company, // Backend expects company_name
        website: normalizeUrl(formData.website),
        linkedin_company: normalizeUrl(formData.linkedin_company),
        linkedin_founder: normalizeUrl(formData.linkedin_founder),
        instagram: normalizeSocialHandle(formData.instagram),
        tiktok: normalizeSocialHandle(formData.tiktok),
        phone: normalizePhone(formData.phone),
        whatsapp: normalizePhone(formData.whatsapp),
      };

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
      const response = await fetch(`${API_URL}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalizedData),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar submissão');
      }

      const { submission, checkout_url } = await response.json();

      toast({
        title: 'Submissão criada com sucesso!',
        description: 'Redirecionando para o dashboard...',
      });

      // Redirect to Stripe checkout
      if (checkout_url) {
        window.location.href = checkout_url;
      } else {
        router.push(`/dashboard?submission=${submission.id}`);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao enviar',
        description: error instanceof Error ? error.message : 'Tente novamente',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const characterCount = formData.challenge.length;
  const isCharCountValid = characterCount >= 100 && characterCount <= 800;

  const getCharCountColor = (): string => {
    if (characterCount < 100) return 'text-red-500';
    if (characterCount < 200) return 'text-yellow-600';
    if (characterCount <= 800) return 'text-green-600';
    return 'text-red-500';
  };

  const domainValidation = validateEmailDomainMatchesWebsite(formData.email, formData.website);

  return (
    <section id="submission-form" className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Solicite Seu Diagnóstico
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              Preencha os dados abaixo e receba seu relatório em 24h
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>Dados essenciais para análise</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Nome da Empresa *</Label>
                    <Input
                      id="company"
                      placeholder="Minha Empresa Ltda"
                      value={formData.company}
                      onChange={(e) => updateField('company', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="text"
                      placeholder="minhaempresa.com.br"
                      value={formData.website}
                      onChange={(e) => updateField('website', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Corporativo *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@empresa.com.br"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      required
                    />
                    {!domainValidation.matches && domainValidation.message && (
                      <p className="text-xs text-yellow-600 flex items-center gap-1">
                        <span>⚠️</span>
                        {domainValidation.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Setor</Label>
                    <Select value={formData.industry} onValueChange={(v) => updateField('industry', v)}>
                      <SelectTrigger id="industry">
                        <SelectValue placeholder="Selecione o setor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tecnologia">Tecnologia</SelectItem>
                        <SelectItem value="varejo">Varejo</SelectItem>
                        <SelectItem value="servicos">Serviços</SelectItem>
                        <SelectItem value="saude">Saúde</SelectItem>
                        <SelectItem value="educacao">Educação</SelectItem>
                        <SelectItem value="financas">Financas</SelectItem>
                        <SelectItem value="industria">Indústria</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="challenge">Principal Desafio do Negócio *</Label>
                  <Textarea
                    id="challenge"
                    placeholder="Descreva seu maior desafio atual (100-800 caracteres)"
                    value={formData.challenge}
                    onChange={(e) => updateField('challenge', e.target.value)}
                    className="min-h-[120px]"
                    required
                  />
                  <div className={`text-sm text-right font-medium ${getCharCountColor()}`}>
                    {characterCount}/800 caracteres
                    {characterCount < 100 && ` (faltam ${100 - characterCount} para o mínimo)`}
                    {characterCount >= 100 && characterCount < 200 && ' ✓'}
                    {characterCount >= 200 && characterCount <= 800 && ' ✓✓ Ótimo!'}
                    {characterCount > 800 && ` (${characterCount - 800} acima do limite)`}
                  </div>
                </div>
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
                      <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full mr-2">Opcional</span>
                      Campos opcionais melhoram qualidade da análise em 40%
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(11) 98765-4321"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input
                        id="whatsapp"
                        type="tel"
                        placeholder="(11) 98765-4321"
                        value={formData.whatsapp}
                        onChange={(e) => updateField('whatsapp', e.target.value)}
                      />
                    </div>
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
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        placeholder="minhaempresa ou @minhaempresa"
                        value={formData.instagram}
                        onChange={(e) => updateField('instagram', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tiktok">TikTok</Label>
                      <Input
                        id="tiktok"
                        placeholder="minhaempresa ou @minhaempresa"
                        value={formData.tiktok}
                        onChange={(e) => updateField('tiktok', e.target.value)}
                      />
                    </div>
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
                  <div className="space-y-2">
                    <Label htmlFor="linkedin_company">LinkedIn da Empresa</Label>
                    <Input
                      id="linkedin_company"
                      placeholder="linkedin.com/company/minhaempresa"
                      value={formData.linkedin_company}
                      onChange={(e) => updateField('linkedin_company', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin_founder">LinkedIn do Fundador</Label>
                    <Input
                      id="linkedin_founder"
                      placeholder="linkedin.com/in/fundador"
                      value={formData.linkedin_founder}
                      onChange={(e) => updateField('linkedin_founder', e.target.value)}
                    />
                  </div>
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
                    <div className="space-y-2">
                      <Label htmlFor="employee_count">Número de Funcionários</Label>
                      <Select value={formData.employee_count} onValueChange={(v) => updateField('employee_count', v)}>
                        <SelectTrigger id="employee_count">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10</SelectItem>
                          <SelectItem value="11-50">11-50</SelectItem>
                          <SelectItem value="51-200">51-200</SelectItem>
                          <SelectItem value="201-500">201-500</SelectItem>
                          <SelectItem value="500+">500+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="founded_year">Ano de Fundação</Label>
                      <Input
                        id="founded_year"
                        type="number"
                        placeholder="2020"
                        min="1900"
                        max={new Date().getFullYear()}
                        value={formData.founded_year}
                        onChange={(e) => updateField('founded_year', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="review_cycle">Ciclo de Revisão</Label>
                      <Select value={formData.review_cycle} onValueChange={(v) => updateField('review_cycle', v)}>
                        <SelectTrigger id="review_cycle">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="continuous">Contínuo</SelectItem>
                          <SelectItem value="weekly">Semanal</SelectItem>
                          <SelectItem value="quarterly">Trimestral</SelectItem>
                          <SelectItem value="biannual">Semestral</SelectItem>
                          <SelectItem value="annual">Anual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Submit Button */}
            <Card className="bg-primary/10 border-primary/20">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground">Envie os dados para iniciar a análise</div>
                      <div className="text-sm text-muted-foreground">Pagamento único</div>
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting || !isCharCountValid}
                      className="px-8"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        'Enviar Solicitação'
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Ao enviar, você será redirecionado para o pagamento seguro via Stripe
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
