'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { ArrowRight, Loader2, AlertCircle, LogIn } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useCreateSubmission } from '@/lib/hooks'
import type { CreateSubmissionRequest } from '@/lib/types'

// Website URL regex - matches domain patterns with optional protocol
// Accepts: example.com, www.example.com, https://example.com, etc.
const websiteRegex = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/

const formSchema = z.object({
  // Required fields
  company_name: z.string().min(1, 'Nome da empresa é obrigatório'),
  contact_name: z.string().min(1, 'Seu nome é obrigatório'),
  contact_email: z.string().email('Email inválido'),
  // Website: required unless has_no_website is true
  website: z.string().optional(),
  has_no_website: z.boolean().default(false),
  // Optional
  cnpj: z.string().optional(),
}).refine(
  (data) => {
    // If has_no_website is checked, website is not required
    if (data.has_no_website) return true
    // Otherwise, website must be provided and match the regex
    if (!data.website || data.website.trim() === '') return false
    return websiteRegex.test(data.website)
  },
  {
    message: 'Informe um website válido (ex: empresa.com.br)',
    path: ['website'],
  }
)

type FormData = z.infer<typeof formSchema>

export function SubmitSection() {
  const router = useRouter()
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
      website: '',
      has_no_website: false,
      cnpj: '',
    },
  })

  const hasNoWebsite = watch('has_no_website')

  // State for duplicate company error
  const [duplicateError, setDuplicateError] = useState<{
    companyName?: string
    message?: string
  } | null>(null)

  const onSubmit = async (data: FormData) => {
    // Clear previous duplicate error
    setDuplicateError(null)

    try {
      // Map form data to API request format (camelCase to match backend)
      const requestData: CreateSubmissionRequest = {
        companyName: data.company_name,
        contactName: data.contact_name,
        contactEmail: data.contact_email,
        website: data.has_no_website ? undefined : (data.website || undefined),
        hasNoWebsite: data.has_no_website,
        cnpj: data.cnpj || undefined,
      }

      // Clear any existing auth before submission (fresh start for new user)
      localStorage.removeItem('auth_token')

      const response = await createSubmission.mutateAsync(requestData)

      // If auth is provided, user was auto-created - save token and go to set-password
      if (response.auth) {
        localStorage.setItem('auth_token', response.auth.access_token)
        // Set cookie for Next.js middleware auth check
        document.cookie = `sb-access-token=${response.auth.access_token}; path=/; max-age=${response.auth.expires_in}`
        // Store email for set-password page (read-only display)
        sessionStorage.setItem('set_password_email', response.auth.user.email)
        router.push('/set-password')
      } else {
        // No auth returned - this shouldn't happen for new submissions
        // Redirect to login as fallback
        router.push('/login')
      }
    } catch (error) {
      // Check for duplicate submitter error
      if (error instanceof AxiosError && error.response?.data?.code === 'DUPLICATE_SUBMITTER') {
        const details = error.response.data.details
        setDuplicateError({
          companyName: details?.company_name,
          message: error.response.data.error,
        })
        return
      }

      // Check for user already exists error
      if (error instanceof AxiosError && error.response?.data?.code === 'USER_EXISTS') {
        setDuplicateError({
          message: error.response.data.message || 'Este email já está cadastrado. Faça login para continuar.',
        })
        return
      }

      toast.error('Erro ao enviar', {
        description: 'Ocorreu um erro ao processar sua solicitação. Tente novamente.',
      })
    }
  }

  return (
    <section id="diagnostico" className="py-24 bg-surface-paper">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 lg:p-12 border border-line shadow-sm relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gold-500" />

          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-medium text-navy-900 mb-2">
              Experimente Agora
            </h2>
            <p className="text-muted-foreground">
              Comece a usar nossa plataforma em minutos com dados mínimos.
            </p>
          </div>

          {/* Duplicate company error alert */}
          {duplicateError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Empresa já cadastrada</AlertTitle>
              <AlertDescription className="space-y-3">
                <p>
                  {duplicateError.companyName
                    ? `A empresa "${duplicateError.companyName}" já foi submetida com este email.`
                    : duplicateError.message || 'Esta empresa já foi cadastrada com este email.'}
                </p>
                <p className="text-sm">
                  Para acompanhar sua análise, faça login na sua conta.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm font-medium text-gold-600 hover:text-gold-700 hover:underline"
                >
                  <LogIn className="w-4 h-4" />
                  Fazer login
                </Link>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Company Name */}
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

            {/* Contact Name */}
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

            {/* Contact Email */}
            <div>
              <Label htmlFor="contact_email">Email *</Label>
              <Input
                id="contact_email"
                type="email"
                placeholder="joao@empresa.com.br"
                {...register('contact_email')}
                className="mt-1"
              />
              {errors.contact_email && (
                <p className="text-sm text-destructive mt-1">
                  {errors.contact_email.message}
                </p>
              )}
            </div>

            {/* Website */}
            <div>
              <Label htmlFor="website">Website da Empresa {!hasNoWebsite && '*'}</Label>
              <Input
                id="website"
                placeholder="empresa.com.br"
                disabled={hasNoWebsite}
                {...register('website')}
                className="mt-1"
              />
              {errors.website && !hasNoWebsite && (
                <p className="text-sm text-destructive mt-1">
                  {errors.website.message}
                </p>
              )}
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="has_no_website"
                  checked={hasNoWebsite}
                  onCheckedChange={(checked) => {
                    setValue('has_no_website', checked === true)
                    if (checked) {
                      setValue('website', '')
                    }
                  }}
                />
                <label
                  htmlFor="has_no_website"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Empresa não possui website
                </label>
              </div>
            </div>

            {/* CNPJ - Optional */}
            <div>
              <Label htmlFor="cnpj">CNPJ (opcional)</Label>
              <Input
                id="cnpj"
                placeholder="00.000.000/0001-00"
                {...register('cnpj')}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                O CNPJ ajuda a enriquecer a análise com dados públicos
              </p>
            </div>

            {/* Submit */}
            <div className="pt-4">
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
                    Iniciar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
