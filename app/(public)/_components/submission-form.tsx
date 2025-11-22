"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowRight, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Select, SelectOption } from "@/components/ui/Select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useToast } from "@/components/ui/use-toast"

// --- Zod Schema for Validation ---
const formSchema = z.object({
  // Company Information (5 fields)
  companyName: z.string().min(2, { message: "Nome da empresa é obrigatório." }),
  companyWebsite: z.string().url({ message: "URL inválida." }).optional().or(z.literal("")),
  companyIndustry: z.string().optional(),
  companySize: z.string().optional(),
  companyLocation: z.string().optional(),

  // Contact Information (4 fields)
  contactName: z.string().min(2, { message: "Seu nome é obrigatório." }),
  contactEmail: z.string().email({ message: "Email inválido." }),
  contactPhone: z.string().optional(),
  contactPosition: z.string().optional(),

  // Business Context (4 fields)
  targetMarket: z.string().optional(),
  annualRevenueMin: z.string().transform((val) => (val === "" ? undefined : Number(val))).optional(),
  annualRevenueMax: z.string().transform((val) => (val === "" ? undefined : Number(val))).optional(),
  fundingStage: z.string().optional(),

  // Submission Details (4 fields)
  businessChallenge: z.string().min(10, { message: "Descreva seu desafio com mais detalhes (mín. 10 caracteres)." }),
  additionalNotes: z.string().optional(),
  linkedinUrl: z.string().url({ message: "URL inválida." }).optional().or(z.literal("")),
  twitterHandle: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function SubmissionForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 1. Define form with react-hook-form and zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      companyWebsite: "",
      companyIndustry: "",
      companySize: "",
      companyLocation: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      contactPosition: "",
      targetMarket: "",
      annualRevenueMin: undefined,
      annualRevenueMax: undefined,
      fundingStage: "",
      businessChallenge: "",
      additionalNotes: "",
      linkedinUrl: "",
      twitterHandle: "",
    },
  })

  // 2. Define submit handler
  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    try {
      // Bundle additional information into JSON string
      const additionalInfoData = {
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone || "",
        contactPosition: data.contactPosition || "",
        companyLocation: data.companyLocation || "",
        targetMarket: data.targetMarket || "",
        annualRevenueMin: data.annualRevenueMin ?? null,
        annualRevenueMax: data.annualRevenueMax ?? null,
        fundingStage: data.fundingStage || "",
        additionalNotes: data.additionalNotes || "",
        linkedinUrl: data.linkedinUrl || "",
        twitterHandle: data.twitterHandle || "",
      }

      // Prepare submission data for backend (camelCase format)
      const submissionData = {
        companyName: data.companyName,
        cnpj: "00.000.000/0000-00",
        industry: data.companyIndustry || "",
        companySize: data.companySize || "",
        website: data.companyWebsite || null,
        strategicGoal: data.businessChallenge,
        currentChallenges: data.businessChallenge,
        competitivePosition: "Em análise",
        additionalInfo: JSON.stringify(additionalInfoData),
      }

      // Call backend API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'
      const response = await fetch(`${apiUrl}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Falha no envio' }))
        throw new Error(errorData.message || 'Erro ao enviar formulário')
      }

      const result = await response.json()
      console.log("Submission successful:", result)

      toast({
        title: "Diagnóstico Solicitado!",
        description: "Recebemos seus dados. Em breve você receberá seu relatório.",
      })
      form.reset()
      // Optional: Redirect to a thank you page
      // router.push("/obrigado")

    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Erro no envio",
        description: "Ocorreu um erro ao processar sua solicitação. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 md:p-12 border border-line shadow-sm relative">
        {/* Gold Accent Top */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gold-500"></div>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-medium mb-2">Solicitar Diagnóstico Estratégico</h2>
          <p className="text-text-secondary text-sm">
            Preencha os dados abaixo para iniciar nossa análise híbrida (IA + IH).
          </p>
        </div>

        {/* --- MANDATORY FIELDS (Always Visible) --- */}
        <div className="space-y-6">
          <h3 className="font-heading text-lg font-medium text-navy-900 border-b border-line pb-2">
            Informações Obrigatórias
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Company Name */}
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Nome da Empresa*</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Corp" {...field} className="bg-surface-paper border-line h-12 focus:border-navy-900" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contact Name */}
            <FormField
              control={form.control}
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Seu Nome*</FormLabel>
                  <FormControl>
                    <Input placeholder="João Silva" {...field} className="bg-surface-paper border-line h-12 focus:border-navy-900" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contact Email */}
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Seu Email*</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="joao@acme.com" {...field} className="bg-surface-paper border-line h-12 focus:border-navy-900" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Business Challenge */}
            <FormField
              control={form.control}
              name="businessChallenge"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Desafio Principal*</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o principal desafio estratégico que sua empresa enfrenta hoje..."
                      className="bg-surface-paper border-line min-h-[120px] focus:border-navy-900 resize-none p-4"
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

        {/* --- OPTIONAL FIELDS (Single Accordion) --- */}
        <Accordion type="single" collapsible className="w-full border-t border-line">
          <AccordionItem value="optional" className="border-b-0">
            <AccordionTrigger className="font-heading text-lg font-medium text-navy-900 hover:text-gold-500 py-4">
              Informações Adicionais (Opcional)
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Company Website */}
                <FormField
                  control={form.control}
                  name="companyWebsite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Website</FormLabel>
                      <FormControl>
                        <Input placeholder="https://acme.com" {...field} className="bg-surface-paper border-line h-12 focus:border-navy-900" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Company Industry */}
                <FormField
                  control={form.control}
                  name="companyIndustry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Setor</FormLabel>
                      <FormControl>
                        <Input placeholder="Tecnologia, Saúde, Finanças..." {...field} className="bg-surface-paper border-line h-12 focus:border-navy-900" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Company Size */}
                <FormField
                  control={form.control}
                  name="companySize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Tamanho da Empresa</FormLabel>
                      <Select {...field} className="bg-surface-paper border-line h-12 focus:border-navy-900">
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
                <FormField
                  control={form.control}
                  name="companyLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Localização</FormLabel>
                      <FormControl>
                        <Input placeholder="São Paulo, SP" {...field} className="bg-surface-paper border-line h-12 focus:border-navy-900" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Contact Phone */}
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(11) 98765-4321" {...field} className="bg-surface-paper border-line h-12 focus:border-navy-900" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Contact Position */}
                <FormField
                  control={form.control}
                  name="contactPosition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Cargo</FormLabel>
                      <FormControl>
                        <Input placeholder="CEO, Diretor, Gerente..." {...field} className="bg-surface-paper border-line h-12 focus:border-navy-900" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Target Market */}
                <FormField
                  control={form.control}
                  name="targetMarket"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Mercado Alvo</FormLabel>
                      <FormControl>
                        <Input placeholder="B2B, B2C, B2B2C..." {...field} className="bg-surface-paper border-line h-12 focus:border-navy-900" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Funding Stage */}
                <FormField
                  control={form.control}
                  name="fundingStage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Estágio de Financiamento</FormLabel>
                      <Select {...field} className="bg-surface-paper border-line h-12 focus:border-navy-900">
                        <SelectOption value="">Selecione</SelectOption>
                        <SelectOption value="bootstrapped">Bootstrapped</SelectOption>
                        <SelectOption value="seed">Seed</SelectOption>
                        <SelectOption value="series-a">Series A</SelectOption>
                        <SelectOption value="series-b">Series B</SelectOption>
                        <SelectOption value="series-c+">Series C+</SelectOption>
                        <SelectOption value="public">Pública</SelectOption>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Annual Revenue Min */}
                <FormField
                  control={form.control}
                  name="annualRevenueMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Receita Anual Mín. (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1000000" {...field} className="bg-surface-paper border-line h-12 focus:border-navy-900" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Annual Revenue Max */}
                <FormField
                  control={form.control}
                  name="annualRevenueMax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Receita Anual Máx. (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="5000000" {...field} className="bg-surface-paper border-line h-12 focus:border-navy-900" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* LinkedIn URL */}
                <FormField
                  control={form.control}
                  name="linkedinUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">LinkedIn da Empresa</FormLabel>
                      <FormControl>
                        <Input placeholder="https://linkedin.com/company/..." {...field} className="bg-surface-paper border-line h-12 focus:border-navy-900" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Twitter Handle */}
                <FormField
                  control={form.control}
                  name="twitterHandle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Twitter/X</FormLabel>
                      <FormControl>
                        <Input placeholder="@acmecorp" {...field} className="bg-surface-paper border-line h-12 focus:border-navy-900" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Additional Notes */}
                <FormField
                  control={form.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Notas Adicionais</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Qualquer informação adicional que possa ser relevante..."
                          className="bg-surface-paper border-line min-h-[100px] focus:border-navy-900 resize-none p-4"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* --- Submit Button --- */}
        <div className="pt-6">
          <Button type="submit" className="btn-architect w-full flex items-center justify-center gap-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Processando...
              </>
            ) : (
              <>
                Enviar para Análise <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
          <p className="text-xs text-center text-text-secondary mt-4">
            Seus dados são tratados com estrita confidencialidade.
          </p>
        </div>
      </form>
    </Form>
  )
}