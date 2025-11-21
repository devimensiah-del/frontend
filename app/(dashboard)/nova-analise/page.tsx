'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField as FormFieldWrapper,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectOption } from '@/components/ui/Select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useSubmissions } from '@/lib/hooks/use-submissions';

// Form validation schema
const formSchema = z.object({
  // Company Information (mandatory)
  companyName: z.string().min(2, { message: 'Nome da empresa é obrigatório.' }),
  contactName: z.string().min(2, { message: 'Seu nome é obrigatório.' }),
  contactEmail: z.string().email({ message: 'Email inválido.' }),
  businessChallenge: z.string().min(10, {
    message: 'Descreva seu desafio com mais detalhes (mín. 10 caracteres).',
  }),

  // Optional fields
  companyWebsite: z.string().url({ message: 'URL inválida.' }).optional().or(z.literal('')),
  companyIndustry: z.string().optional(),
  companySize: z.string().optional(),
  companyLocation: z.string().optional(),
  contactPhone: z.string().optional(),
  contactPosition: z.string().optional(),
  targetMarket: z.string().optional(),
  annualRevenueMin: z
    .string()
    .transform((val) => (val === '' ? undefined : Number(val)))
    .optional(),
  annualRevenueMax: z
    .string()
    .transform((val) => (val === '' ? undefined : Number(val)))
    .optional(),
  fundingStage: z.string().optional(),
  additionalNotes: z.string().optional(),
  linkedinUrl: z.string().url({ message: 'URL inválida.' }).optional().or(z.literal('')),
  twitterHandle: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function NovaAnalisePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { create, isCreating } = useSubmissions();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      companyWebsite: '',
      companyIndustry: '',
      companySize: '',
      companyLocation: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      contactPosition: '',
      targetMarket: '',
      annualRevenueMin: undefined,
      annualRevenueMax: undefined,
      fundingStage: '',
      businessChallenge: '',
      additionalNotes: '',
      linkedinUrl: '',
      twitterHandle: '',
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      // Map form data to API format
      const submissionData = {
        personalInfo: {
          fullName: data.contactName,
          email: data.contactEmail,
          phone: data.contactPhone || '',
          document: '', // Not collected in this form
        },
        address: {
          street: '',
          city: data.companyLocation || '',
          state: '',
          zipCode: '',
        },
        notes: JSON.stringify({
          companyName: data.companyName,
          companyWebsite: data.companyWebsite,
          companyIndustry: data.companyIndustry,
          companySize: data.companySize,
          contactPosition: data.contactPosition,
          targetMarket: data.targetMarket,
          annualRevenueMin: data.annualRevenueMin,
          annualRevenueMax: data.annualRevenueMax,
          fundingStage: data.fundingStage,
          businessChallenge: data.businessChallenge,
          additionalNotes: data.additionalNotes,
          linkedinUrl: data.linkedinUrl,
          twitterHandle: data.twitterHandle,
        }),
      };

      await create(submissionData);

      toast({
        title: 'Análise Solicitada!',
        description: 'Sua análise foi enviada com sucesso. Você será notificado quando estiver pronta.',
      });

      // Redirect to dashboard
      router.push('/painel');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Erro no envio',
        description: 'Ocorreu um erro ao processar sua solicitação. Tente novamente.',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Link href="/painel" className="hover:text-[#00a859]">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Nova Análise</span>
      </div>

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Nova Análise</h1>
        <p className="text-gray-600 mt-2">
          Preencha as informações abaixo para solicitar uma nova análise estratégica.
        </p>
      </div>

      {/* Form */}
      <Card className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Mandatory Fields */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Informações Obrigatórias
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Company Name */}
                <FormFieldWrapper
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Empresa*</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Corp" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Contact Name */}
                <FormFieldWrapper
                  control={form.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seu Nome*</FormLabel>
                      <FormControl>
                        <Input placeholder="João Silva" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Contact Email */}
                <FormFieldWrapper
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Seu Email*</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="joao@acme.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Business Challenge */}
                <FormFieldWrapper
                  control={form.control}
                  name="businessChallenge"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Desafio Principal*</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva o principal desafio estratégico que sua empresa enfrenta hoje..."
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Seja o mais específico possível. Isso guiará nossa análise.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Optional Fields (Accordion) */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="optional">
                <AccordionTrigger className="text-lg font-semibold text-gray-900 hover:text-[#00a859]">
                  Informações Adicionais (Opcional)
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Company Website */}
                    <FormFieldWrapper
                      control={form.control}
                      name="companyWebsite"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input placeholder="https://acme.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Company Industry */}
                    <FormFieldWrapper
                      control={form.control}
                      name="companyIndustry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Setor</FormLabel>
                          <FormControl>
                            <Input placeholder="Tecnologia, Saúde, Finanças..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Company Size */}
                    <FormFieldWrapper
                      control={form.control}
                      name="companySize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tamanho da Empresa</FormLabel>
                          <Select {...field}>
                            <SelectOption value="">Selecione</SelectOption>
                            <SelectOption value="1-10">1-10 funcionários</SelectOption>
                            <SelectOption value="11-50">11-50 funcionários</SelectOption>
                            <SelectOption value="51-200">51-200 funcionários</SelectOption>
                            <SelectOption value="201-500">201-500 funcionários</SelectOption>
                            <SelectOption value="501+">501+ funcionários</SelectOption>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Company Location */}
                    <FormFieldWrapper
                      control={form.control}
                      name="companyLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Localização</FormLabel>
                          <FormControl>
                            <Input placeholder="São Paulo, SP" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Contact Phone */}
                    <FormFieldWrapper
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input placeholder="(11) 98765-4321" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Contact Position */}
                    <FormFieldWrapper
                      control={form.control}
                      name="contactPosition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cargo</FormLabel>
                          <FormControl>
                            <Input placeholder="CEO, Diretor, Gerente..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Additional fields would go here... */}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <Link href="/painel">
                <Button type="button" variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </Link>

              <Button
                type="submit"
                disabled={isCreating}
                className="bg-[#00a859] hover:bg-[#008a47] text-white"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    Enviar para Análise
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
