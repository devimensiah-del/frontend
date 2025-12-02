"use client"

import { useState, useCallback, useMemo } from "react"
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
import { useTranslations, useI18n } from "@/lib/i18n/context"

type FormValues = z.infer<ReturnType<typeof createFormSchema>>

function createFormSchema(t: (key: string) => string) {
  return z.object({
    // Company Information (5 fields)
    companyName: z.string().min(2, { message: t("form.validation.companyNameRequired") }),
    companyWebsite: z.string().url({ message: t("form.validation.urlInvalid") }).optional().or(z.literal("")),
    companyIndustry: z.string().optional(),
    companySize: z.string().optional(),
    companyLocation: z.string().optional(),

    // Contact Information (4 fields)
    contactName: z.string().min(2, { message: t("form.validation.contactNameRequired") }),
    contactEmail: z.string().email({ message: t("form.validation.emailInvalid") }),
    contactPhone: z.string().optional(),
    contactPosition: z.string().optional(),

    // Business Context (4 fields)
    targetMarket: z.string().optional(),
    annualRevenueMin: z.string().transform((val) => (val === "" ? undefined : Number(val))).optional(),
    annualRevenueMax: z.string().transform((val) => (val === "" ? undefined : Number(val))).optional(),
    fundingStage: z.string().optional(),

    // Submission Details (5 fields)
    businessChallenge: z.string().min(10, { message: t("form.validation.challengeRequired") }),
    additionalNotes: z.string().optional(),
    linkedinUrl: z.string().url({ message: t("form.validation.urlInvalid") }).optional().or(z.literal("")),
    twitterHandle: z.string().optional(),
    instagramUrl: z.string().url({ message: t("form.validation.urlInvalid") }).optional().or(z.literal("")),
  })
}

export function SubmissionForm() {
  const { toast } = useToast()
  const t = useTranslations()
  const { locale } = useI18n()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [accordionValue, setAccordionValue] = useState<string>("")

  const handleAccordionChange = useCallback((value: string) => {
    setAccordionValue(value)
  }, [])

  // Create schema with translations - memoized to prevent unnecessary re-renders
  const formSchema = useMemo(() => createFormSchema(t), [locale, t])

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
      instagramUrl: "",
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
        instagramUrl: data.instagramUrl || "",
      }

      // Prepare submission data for backend (camelCase format)
      const submissionData = {
        companyName: data.companyName,
        cnpj: "00.000.000/0000-00",
        industry: data.companyIndustry || "",
        companySize: data.companySize || "",
        website: data.companyWebsite || null,
        strategicGoal: data.businessChallenge,  // User's strategic goal/challenge
        currentChallenges: "",  // Leave empty - will be filled during enrichment
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
        const errorData = await response.json().catch(() => ({ message: t("form.errorMessage") }))
        throw new Error(errorData.message || t("form.errorMessage"))
      }

      await response.json()

      toast({
        title: t("form.successTitle"),
        description: t("form.successMessage"),
      })
      form.reset()
      // Optional: Redirect to a thank you page
      // router.push("/obrigado")

    } catch {
      toast({
        title: t("form.errorTitle"),
        description: t("form.errorMessage"),
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
          <h2 className="text-3xl font-medium mb-2">{t("form.title")}</h2>
          <p className="text-text-secondary text-sm">
            {t("form.subtitle")}
          </p>
        </div>

        {/* --- MANDATORY FIELDS (Always Visible) --- */}
        <div className="space-y-6">
          <h3 className="font-heading text-lg font-medium text-navy-900 border-b border-line pb-2">
            {t("form.mandatory")}
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Company Name */}
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("form.companyName")}*</FormLabel>
                  <FormControl>
                    <Input placeholder={t("form.companyNamePlaceholder")} {...field} className="bg-surface-paper border-line h-12 focus:border-navy-900" />
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
                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("form.contactName")}*</FormLabel>
                  <FormControl>
                    <Input placeholder={t("form.contactNamePlaceholder")} {...field} className="bg-surface-paper border-line h-12 focus:border-navy-900" />
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
                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("form.contactEmail")}*</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder={t("form.contactEmailPlaceholder")} {...field} className="bg-surface-paper border-line h-12 focus:border-navy-900" />
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
                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("form.businessChallenge")}*</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("form.businessChallengePlaceholder")}
                      className="bg-surface-paper border-line min-h-[120px] focus:border-navy-900 resize-none p-4"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("form.businessChallengeHint")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* --- OPTIONAL FIELDS (Single Accordion) --- */}
        <Accordion
          type="single"
          collapsible
          value={accordionValue}
          onValueChange={handleAccordionChange}
          className="w-full border-t border-line"
        >
          <AccordionItem value="optional" className="border-b-0">
            <AccordionTrigger className="font-heading text-lg font-medium text-navy-900 hover:text-gold-500 py-4">
              {t("form.optional")}
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Company Website */}
                <FormField
                  control={form.control}
                  name="companyWebsite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("form.website")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("form.websitePlaceholder")} {...field} className="bg-surface-paper border-line h-12 focus:border-navy-900" />
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
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("form.industry")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("form.industryPlaceholder")} {...field} className="bg-surface-paper border-line h-12 focus:border-navy-900" />
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
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("form.companySize")}</FormLabel>
                      <Select {...field} className="bg-surface-paper border-line h-12 focus:border-navy-900">
                        <SelectOption value="">{t("form.companySizeSelect")}</SelectOption>
                        <SelectOption value="1-10">{t("form.companySizeOptions.1-10")}</SelectOption>
                        <SelectOption value="11-50">{t("form.companySizeOptions.11-50")}</SelectOption>
                        <SelectOption value="51-200">{t("form.companySizeOptions.51-200")}</SelectOption>
                        <SelectOption value="201-500">{t("form.companySizeOptions.201-500")}</SelectOption>
                        <SelectOption value="501+">{t("form.companySizeOptions.501+")}</SelectOption>
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
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("form.location")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("form.locationPlaceholder")} {...field} className="bg-surface-paper border-line h-12 focus:border-navy-900" />
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
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("form.phone")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("form.phonePlaceholder")} {...field} className="bg-surface-paper border-line h-12 focus:border-navy-900" />
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
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("form.position")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("form.positionPlaceholder")} {...field} className="bg-surface-paper border-line h-12 focus:border-navy-900" />
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
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("form.targetMarket")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("form.targetMarketPlaceholder")} {...field} className="bg-surface-paper border-line h-12 focus:border-navy-900" />
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
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("form.fundingStage")}</FormLabel>
                      <Select {...field} className="bg-surface-paper border-line h-12 focus:border-navy-900">
                        <SelectOption value="">{t("form.fundingStageSelect")}</SelectOption>
                        <SelectOption value="bootstrapped">{t("form.fundingStageOptions.bootstrapped")}</SelectOption>
                        <SelectOption value="seed">{t("form.fundingStageOptions.seed")}</SelectOption>
                        <SelectOption value="series-a">{t("form.fundingStageOptions.series-a")}</SelectOption>
                        <SelectOption value="series-b">{t("form.fundingStageOptions.series-b")}</SelectOption>
                        <SelectOption value="series-c+">{t("form.fundingStageOptions.series-c+")}</SelectOption>
                        <SelectOption value="public">{t("form.fundingStageOptions.public")}</SelectOption>
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
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("form.revenueMin")}</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder={t("form.revenueMinPlaceholder")} {...field} className="bg-surface-paper border-line h-12 focus:border-navy-900" />
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
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("form.revenueMax")}</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder={t("form.revenueMaxPlaceholder")} {...field} className="bg-surface-paper border-line h-12 focus:border-navy-900" />
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
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("form.linkedin")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("form.linkedinPlaceholder")} {...field} className="bg-surface-paper border-line h-12 focus:border-navy-900" />
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
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("form.twitter")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("form.twitterPlaceholder")} {...field} className="bg-surface-paper border-line h-12 focus:border-navy-900" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Instagram URL */}
                <FormField
                  control={form.control}
                  name="instagramUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("form.instagram")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("form.instagramPlaceholder")} {...field} className="bg-surface-paper border-line h-12 focus:border-navy-900" />
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
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("form.additionalNotes")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("form.additionalNotesPlaceholder")}
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
                <Loader2 className="w-4 h-4 animate-spin" /> {t("form.submitting")}
              </>
            ) : (
              <>
                {t("form.submit")} <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
          <p className="text-xs text-center text-text-secondary mt-4">
            {t("form.disclaimer")}
          </p>
        </div>
      </form>
    </Form>
  )
}
