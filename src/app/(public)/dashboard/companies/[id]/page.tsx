'use client'

import { use, useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useQueryClient } from '@tanstack/react-query'
import { useCompany, useMe, useChallenges, useGenerateAccessCode, useUpdateCompany } from '@/lib/hooks'
import { useEnrichmentStatus } from '@/lib/hooks/use-companies'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Step1Card, Step2Card, Step3Card } from '@/components/features/company'
import {
  getChallengeType,
  getCategoryInfo,
} from '@/lib/config/challenges'
import {
  ArrowLeft,
  Building2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  Globe,
  MapPin,
  Users,
  Calendar,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Target,
  TrendingUp,
  Briefcase,
  Shield,
  Zap,
  FileText,
  ExternalLink,
  Phone,
  Mail,
  BadgeCheck,
  Building,
  Banknote,
  Sparkles,
  Pencil,
  X,
  Save,
  Plus,
} from 'lucide-react'
import type { EnrichmentStatus, Challenge, AnalysisStatus } from '@/lib/types'

function getEnrichmentBadge(status: EnrichmentStatus) {
  switch (status) {
    case 'completed':
      return (
        <Badge variant="outline" className="text-success border-success/30 bg-success/10">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Enriquecida
        </Badge>
      )
    case 'processing':
      return (
        <Badge variant="outline" className="text-info border-info/30 bg-info/10">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Processando
        </Badge>
      )
    case 'failed':
      return (
        <Badge variant="outline" className="text-error border-error/30 bg-error/10">
          <AlertCircle className="w-3 h-3 mr-1" />
          Falhou
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="text-warning border-warning/30 bg-warning/10">
          <Clock className="w-3 h-3 mr-1" />
          Pendente
        </Badge>
      )
  }
}

function getAnalysisStatusBadge(status: AnalysisStatus | undefined) {
  if (!status) {
    return (
      <Badge variant="outline" className="text-muted-foreground border-muted-foreground/30 bg-muted/30">
        <Clock className="w-3 h-3 mr-1" />
        Sem analise
      </Badge>
    )
  }
  switch (status) {
    case 'completed':
      return (
        <Badge variant="outline" className="text-success border-success/30 bg-success/10">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Concluida
        </Badge>
      )
    case 'processing':
      return (
        <Badge variant="outline" className="text-info border-info/30 bg-info/10">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Processando
        </Badge>
      )
    case 'failed':
      return (
        <Badge variant="outline" className="text-error border-error/30 bg-error/10">
          <AlertCircle className="w-3 h-3 mr-1" />
          Falhou
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="text-warning border-warning/30 bg-warning/10">
          <Clock className="w-3 h-3 mr-1" />
          Pendente
        </Badge>
      )
  }
}

interface ChallengeCardProps {
  challenge: Challenge
  onViewReport?: (analysisId: string, accessCode?: string | null) => void
  isGeneratingCode?: boolean
}

function ChallengeCard({ challenge, onViewReport, isGeneratingCode }: ChallengeCardProps) {
  const typeInfo = getChallengeType(challenge.challenge_type)
  const categoryInfo = getCategoryInfo(challenge.challenge_category)
  const analysis = challenge.latest_analysis
  const hasAnalysis = analysis && analysis.status === 'completed' && analysis.is_visible_to_user
  const isProcessing = analysis?.status === 'processing' || analysis?.status === 'pending'
  const isFailed = analysis?.status === 'failed'
  const accessCode = analysis?.access_code

  return (
    <div className={`bg-white border p-4 transition-colors ${
      isProcessing ? 'border-info/50 bg-info/5' :
      isFailed ? 'border-error/30' :
      'border-line hover:border-gold-300'
    }`}>
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg">{categoryInfo?.emoji || ''}</span>
            <span className="text-xs font-medium uppercase tracking-wide text-gold-600">
              {categoryInfo?.label || challenge.challenge_category}
            </span>
            <span className="text-muted-foreground">-</span>
            <span className="text-xs text-muted-foreground">
              {typeInfo?.label || challenge.challenge_type}
            </span>
          </div>
          {getAnalysisStatusBadge(analysis?.status)}
        </div>

        <p className="text-sm text-navy-800 line-clamp-3">
          {challenge.business_challenge}
        </p>

        {hasAnalysis && (
          <div className="flex items-center gap-2 pt-2 border-t border-line">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() => onViewReport?.(analysis!.id, accessCode)}
              disabled={isGeneratingCode}
            >
              {isGeneratingCode ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileText className="w-3.5 h-3.5" />
              )}
              Ver Analise
            </Button>
          </div>
        )}

        {isProcessing && (
          <div className="flex items-center gap-2 pt-2 border-t border-line">
            <span className="text-xs text-info flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              Analise em processamento...
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

interface EditableFieldProps {
  label: string
  field: string
  value: string | number | null | undefined
  editMode: boolean
  formData: Record<string, unknown>
  onChange: (field: string, value: string | number | null) => void
  icon?: React.ReactNode
  type?: 'text' | 'number' | 'url' | 'email' | 'textarea'
  placeholder?: string
}

function EditableField({
  label,
  field,
  value,
  editMode,
  formData,
  onChange,
  icon,
  type = 'text',
  placeholder,
}: EditableFieldProps) {
  const currentValue = formData[field] !== undefined ? formData[field] : value
  const displayValue = currentValue ?? ''

  if (!editMode && !value) return null

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
      {editMode ? (
        type === 'textarea' ? (
          <Textarea
            value={displayValue as string}
            onChange={(e) => onChange(field, e.target.value || null)}
            placeholder={placeholder || label}
            className="min-h-[80px] text-sm"
          />
        ) : (
          <Input
            type={type === 'url' || type === 'email' ? 'text' : type}
            value={displayValue as string}
            onChange={(e) => {
              const val = type === 'number'
                ? (e.target.value ? Number(e.target.value) : null)
                : (e.target.value || null)
              onChange(field, val)
            }}
            placeholder={placeholder || label}
            className="text-sm"
          />
        )
      ) : (
        <div className="flex items-start gap-2">
          {icon && <span className="text-muted-foreground flex-shrink-0 mt-0.5">{icon}</span>}
          {type === 'url' && value ? (
            <a
              href={value.toString().startsWith('http') ? value.toString() : `https://${value}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-600 hover:underline break-all"
            >
              {value}
            </a>
          ) : type === 'email' && value ? (
            <a
              href={`mailto:${value}`}
              className="text-gold-600 hover:underline break-all"
            >
              {value}
            </a>
          ) : (
            <span className="text-navy-900">{value}</span>
          )}
        </div>
      )}
    </div>
  )
}

interface SectionProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  columns?: 2 | 3
}

function Section({ title, icon, children, columns = 3 }: SectionProps) {
  const colClass = columns === 2
    ? 'grid-cols-1 lg:grid-cols-2'
    : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'

  return (
    <div className="bg-white border border-line p-4 lg:p-6">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-line">
        <span className="text-gold-500">{icon}</span>
        <h2 className="text-sm font-medium uppercase tracking-wide text-navy-900">{title}</h2>
      </div>
      <div className={`grid ${colClass} gap-4 lg:gap-6`}>
        {children}
      </div>
    </div>
  )
}

interface EditableListProps {
  title: string
  icon: React.ReactNode
  field: string
  items: string[] | null | undefined
  editMode: boolean
  formData: Record<string, unknown>
  onChange: (field: string, value: string[]) => void
  emptyMessage: string
  variant?: 'default' | 'success' | 'warning'
}

function EditableList({
  title,
  icon,
  field,
  items,
  editMode,
  formData,
  onChange,
  emptyMessage,
  variant = 'default',
}: EditableListProps) {
  const currentItems = (formData[field] as string[] | undefined) ?? items ?? []
  const [newItem, setNewItem] = useState('')

  const variantClasses = {
    default: 'bg-navy-900/5 text-navy-900',
    success: 'bg-success/10 text-success-dark',
    warning: 'bg-warning/10 text-warning-dark',
  }

  const addItem = () => {
    if (newItem.trim()) {
      onChange(field, [...currentItems, newItem.trim()])
      setNewItem('')
    }
  }

  const removeItem = (index: number) => {
    onChange(field, currentItems.filter((_, i) => i !== index))
  }

  return (
    <div className="bg-white border border-line p-4 lg:p-6">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-line">
        <span className="text-gold-500">{icon}</span>
        <h2 className="text-sm font-medium uppercase tracking-wide text-navy-900">{title}</h2>
      </div>

      {editMode && (
        <div className="flex gap-2 mb-3">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Adicionar item..."
            className="text-sm"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
          />
          <Button type="button" size="sm" variant="outline" onClick={addItem}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      )}

      {currentItems.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {currentItems.map((item, index) => (
            <span
              key={index}
              className={`px-3 py-1.5 text-sm rounded flex items-center gap-2 ${variantClasses[variant]}`}
            >
              {item}
              {editMode && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="hover:text-error transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      )}
    </div>
  )
}

function PageSkeleton() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface-paper py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="w-8 h-8" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    </div>
  )
}

type TabType = 'empresa' | 'negocio' | 'mercado' | 'analises'

export default function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const searchParams = useSearchParams()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: userData, isError: isUserError } = useMe()
  const { data: company, isLoading, error } = useCompany(id)
  const { data: enrichmentStatus } = useEnrichmentStatus(id)
  const { data: challenges = [], isLoading: challengesLoading } = useChallenges(id)
  const updateCompany = useUpdateCompany()
  const generateAccessCode = useGenerateAccessCode()

  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const [generatingCodeForId, setGeneratingCodeForId] = useState<string | null>(null)

  // Tab state from URL search params
  const tabFromUrl = searchParams.get('tab') as TabType | null
  const [activeTab, setActiveTab] = useState<TabType>(tabFromUrl || 'empresa')

  // Track previous enrichment statuses to detect completion
  const prevStatusRef = useRef<{
    step1?: string
    step2?: string
    step3?: string
  }>({})

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isUserError) {
      router.push('/login')
    }
  }, [isUserError, router])

  // Redirect admins to admin dashboard
  useEffect(() => {
    const role = userData?.user?.role
    if (role === 'admin' || role === 'super_admin') {
      router.push(`/admin/companies/${id}`)
    }
  }, [userData, router, id])

  // Check if user needs to set password
  useEffect(() => {
    if (userData?.user && userData.user.passwordSet === false) {
      router.push('/set-password')
    }
  }, [userData, router])

  // Update URL when tab changes
  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab)
    setEditMode(false)
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set('tab', tab)
    router.replace(`?${newParams.toString()}`, { scroll: false })
  }, [router, searchParams])

  // Sync tab from URL on mount
  useEffect(() => {
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl)
    }
  }, [tabFromUrl])

  // Reset form data when edit mode is disabled
  useEffect(() => {
    if (!editMode) {
      setFormData({})
    }
  }, [editMode])

  // Auto-refresh company data when enrichment step completes
  useEffect(() => {
    if (!enrichmentStatus) return

    const prev = prevStatusRef.current
    const { step1_status, step2_status, step3_status } = enrichmentStatus

    const step1JustCompleted = prev.step1 === 'processing' && step1_status === 'completed'
    const step2JustCompleted = prev.step2 === 'processing' && step2_status === 'completed'
    const step3JustCompleted = prev.step3 === 'processing' && step3_status === 'completed'

    if (step1JustCompleted || step2JustCompleted || step3JustCompleted) {
      queryClient.invalidateQueries({ queryKey: ['company', id] })
    }

    prevStatusRef.current = {
      step1: step1_status,
      step2: step2_status,
      step3: step3_status,
    }
  }, [enrichmentStatus, id, queryClient])

  const handleFieldChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (Object.keys(formData).length === 0) {
      setEditMode(false)
      return
    }
    try {
      await updateCompany.mutateAsync({ id, data: formData })
      setEditMode(false)
      setFormData({})
    } catch {
      // Error handled by hook
    }
  }

  const handleCancel = () => {
    setEditMode(false)
    setFormData({})
  }

  const handleViewReport = async (analysisId: string, accessCode?: string | null) => {
    if (accessCode) {
      window.open(`/report/${accessCode}`, '_blank')
      return
    }
    setGeneratingCodeForId(analysisId)
    try {
      const response = await generateAccessCode.mutateAsync(analysisId)
      if (response?.access_code) {
        window.open(`/report/${response.access_code}`, '_blank')
      }
    } finally {
      setGeneratingCodeForId(null)
    }
  }

  if (isLoading) {
    return <PageSkeleton />
  }

  if (error || !company) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-surface-paper py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <AlertCircle className="w-12 h-12 text-error mb-4" />
            <h1 className="text-xl font-medium text-navy-900 mb-2">
              Empresa nao encontrada
            </h1>
            <p className="text-muted-foreground mb-4">
              A empresa solicitada nao existe ou voce nao tem permissao para visualiza-la.
            </p>
            <Link
              href="/dashboard"
              className="text-gold-600 hover:underline flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para a lista
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Filter challenges to only show those with visible analyses
  const visibleChallenges = challenges.filter(c =>
    c.latest_analysis?.is_visible_to_user ||
    c.latest_analysis?.status === 'processing' ||
    c.latest_analysis?.status === 'pending'
  )

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface-paper py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-gold-600 flex items-center gap-1 w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>

            {activeTab !== 'analises' && (
              <div className="flex items-center gap-2">
                {editMode ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      disabled={updateCompany.isPending}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={updateCompany.isPending}
                    >
                      {updateCompany.isPending ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-1" />
                      )}
                      Salvar
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                    <Pencil className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="w-12 h-12 bg-navy-900/5 rounded flex items-center justify-center flex-shrink-0">
              <Building2 className="w-6 h-6 text-navy-700" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                {editMode && activeTab === 'empresa' ? (
                  <Input
                    value={(formData.name as string) ?? company.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    className="text-2xl lg:text-3xl font-medium h-auto py-1 max-w-md"
                    placeholder="Nome da empresa"
                  />
                ) : (
                  <h1 className="text-2xl lg:text-3xl font-medium text-navy-900">
                    {company.name}
                  </h1>
                )}
                {getEnrichmentBadge(company.enrichment_status)}
              </div>
              {(company.legal_name || (editMode && activeTab === 'empresa')) && (
                editMode && activeTab === 'empresa' ? (
                  <Input
                    value={(formData.legal_name as string) ?? company.legal_name ?? ''}
                    onChange={(e) => handleFieldChange('legal_name', e.target.value || null)}
                    className="text-sm mt-2 max-w-md"
                    placeholder="Razao Social"
                  />
                ) : (
                  company.legal_name && company.legal_name !== company.name && (
                    <p className="text-sm text-muted-foreground mt-1">{company.legal_name}</p>
                  )
                )
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-line">
          <div className="flex gap-0 overflow-x-auto">
            <button
              onClick={() => handleTabChange('empresa')}
              className={`px-4 sm:px-6 py-3 text-sm font-medium uppercase tracking-wide border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'empresa'
                  ? 'border-gold-500 text-navy-900'
                  : 'border-transparent text-muted-foreground hover:text-navy-700'
              }`}
            >
              <Building2 className="w-4 h-4 inline-block mr-2" />
              Empresa
            </button>
            <button
              onClick={() => handleTabChange('negocio')}
              className={`px-4 sm:px-6 py-3 text-sm font-medium uppercase tracking-wide border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'negocio'
                  ? 'border-gold-500 text-navy-900'
                  : 'border-transparent text-muted-foreground hover:text-navy-700'
              }`}
            >
              <Briefcase className="w-4 h-4 inline-block mr-2" />
              Negocio
            </button>
            <button
              onClick={() => handleTabChange('mercado')}
              className={`px-4 sm:px-6 py-3 text-sm font-medium uppercase tracking-wide border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'mercado'
                  ? 'border-gold-500 text-navy-900'
                  : 'border-transparent text-muted-foreground hover:text-navy-700'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline-block mr-2" />
              Mercado
            </button>
            <button
              onClick={() => handleTabChange('analises')}
              className={`px-4 sm:px-6 py-3 text-sm font-medium uppercase tracking-wide border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'analises'
                  ? 'border-gold-500 text-navy-900'
                  : 'border-transparent text-muted-foreground hover:text-navy-700'
              }`}
            >
              <Zap className="w-4 h-4 inline-block mr-2" />
              Analises
              {visibleChallenges.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-navy-900/10 rounded-full">
                  {visibleChallenges.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* TAB: EMPRESA (Step 1 - Basic Info) */}
        {activeTab === 'empresa' && (
          <div className="space-y-6">
            {/* Step 1 Enrichment Status */}
            <Step1Card companyId={company.id} legacyStatus={company.enrichment_status} />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {/* Informacoes Basicas */}
              <Section title="Informacoes Basicas" icon={<Building2 className="w-4 h-4" />}>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">CNPJ</span>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    {editMode ? (
                      <Input
                        value={(formData.cnpj as string) ?? company.cnpj ?? ''}
                        onChange={(e) => handleFieldChange('cnpj', e.target.value || null)}
                        placeholder="CNPJ"
                        className="text-sm"
                      />
                    ) : company.cnpj ? (
                      <>
                        <span className="text-navy-900">{company.cnpj}</span>
                        {company.cnpj_verified && (
                          <span className="inline-flex items-center gap-1 text-xs text-success bg-success/10 px-2 py-0.5 rounded whitespace-nowrap flex-shrink-0">
                            <BadgeCheck className="w-3 h-3" />
                            Verificado
                          </span>
                        )}
                      </>
                    ) : null}
                  </div>
                </div>
                <EditableField
                  label="Nome Fantasia"
                  field="trade_name"
                  value={company.trade_name}
                  editMode={editMode}
                  formData={formData}
                  onChange={handleFieldChange}
                />
                <EditableField
                  label="Ano de Fundacao"
                  field="foundation_year"
                  value={company.foundation_year}
                  editMode={editMode}
                  formData={formData}
                  onChange={handleFieldChange}
                  icon={<Calendar className="w-4 h-4" />}
                />
                <div className="col-span-full">
                  <EditableField
                    label="Website"
                    field="website"
                    value={company.website}
                    editMode={editMode}
                    formData={formData}
                    onChange={handleFieldChange}
                    icon={<Globe className="w-4 h-4" />}
                    type="url"
                  />
                </div>
              </Section>

              {/* Localizacao & Tamanho */}
              <Section title="Localizacao & Tamanho" icon={<MapPin className="w-4 h-4" />} columns={2}>
                <EditableField
                  label="Sede"
                  field="headquarters"
                  value={company.headquarters}
                  editMode={editMode}
                  formData={formData}
                  onChange={handleFieldChange}
                />
                <EditableField
                  label="Faixa de Funcionarios"
                  field="employees_range"
                  value={company.employees_range}
                  editMode={editMode}
                  formData={formData}
                  onChange={handleFieldChange}
                  icon={<Users className="w-4 h-4" />}
                />
              </Section>

              {/* Contato Corporativo */}
              {(company.phone || company.email || editMode) && (
                <Section title="Contato Corporativo" icon={<Phone className="w-4 h-4" />} columns={2}>
                  <EditableField
                    label="Telefone"
                    field="phone"
                    value={company.phone}
                    editMode={editMode}
                    formData={formData}
                    onChange={handleFieldChange}
                    icon={<Phone className="w-4 h-4" />}
                  />
                  <div className="col-span-full">
                    <EditableField
                      label="Email"
                      field="email"
                      value={company.email}
                      editMode={editMode}
                      formData={formData}
                      onChange={handleFieldChange}
                      icon={<Mail className="w-4 h-4" />}
                      type="email"
                    />
                  </div>
                </Section>
              )}

              {/* Dados Oficiais CNPJ */}
              {(company.cnae_primary || company.capital_social || editMode) && (
                <Section title="Dados Oficiais" icon={<Building className="w-4 h-4" />} columns={2}>
                  <EditableField
                    label="Atividade Principal (CNAE)"
                    field="cnae_primary"
                    value={company.cnae_primary}
                    editMode={editMode}
                    formData={formData}
                    onChange={handleFieldChange}
                    type="textarea"
                  />
                  <EditableField
                    label="Capital Social"
                    field="capital_social"
                    value={company.capital_social}
                    editMode={editMode}
                    formData={formData}
                    onChange={handleFieldChange}
                    icon={<Banknote className="w-4 h-4" />}
                  />
                </Section>
              )}

              {/* CNAE Codes */}
              {(company.cnae_codes?.length || editMode) && (
                <div>
                  <EditableList
                    title="Codigos CNAE"
                    icon={<Building className="w-4 h-4" />}
                    field="cnae_codes"
                    items={company.cnae_codes}
                    editMode={editMode}
                    formData={formData}
                    onChange={handleFieldChange}
                    emptyMessage="Nenhum codigo CNAE registrado"
                  />
                </div>
              )}

              {/* Redes Sociais */}
              <Section title="Redes Sociais" icon={<Globe className="w-4 h-4" />} columns={2}>
                <div className="col-span-full">
                  <EditableField
                    label="LinkedIn"
                    field="linkedin_url"
                    value={company.linkedin_url}
                    editMode={editMode}
                    formData={formData}
                    onChange={handleFieldChange}
                    icon={<Linkedin className="w-4 h-4" />}
                    type="url"
                  />
                </div>
                <div className="col-span-full">
                  <EditableField
                    label="Twitter"
                    field="twitter_handle"
                    value={company.twitter_handle}
                    editMode={editMode}
                    formData={formData}
                    onChange={handleFieldChange}
                    icon={<Twitter className="w-4 h-4" />}
                  />
                </div>
                <div className="col-span-full">
                  <EditableField
                    label="Instagram"
                    field="instagram_url"
                    value={company.instagram_url}
                    editMode={editMode}
                    formData={formData}
                    onChange={handleFieldChange}
                    icon={<Instagram className="w-4 h-4" />}
                    type="url"
                  />
                </div>
                <div className="col-span-full">
                  <EditableField
                    label="Facebook"
                    field="facebook_url"
                    value={company.facebook_url}
                    editMode={editMode}
                    formData={formData}
                    onChange={handleFieldChange}
                    icon={<Facebook className="w-4 h-4" />}
                    type="url"
                  />
                </div>
              </Section>

              {/* Socios */}
              {(company.partners?.length || editMode) && (
                <div>
                  <EditableList
                    title="Socios / Administradores"
                    icon={<Users className="w-4 h-4" />}
                    field="partners"
                    items={company.partners}
                    editMode={editMode}
                    formData={formData}
                    onChange={handleFieldChange}
                    emptyMessage="Nenhum socio registrado"
                  />
                </div>
              )}

              {/* Executivos */}
              <div>
                <EditableList
                  title="Executivos-Chave"
                  icon={<Users className="w-4 h-4" />}
                  field="key_executives"
                  items={company.key_executives}
                  editMode={editMode}
                  formData={formData}
                  onChange={handleFieldChange}
                  emptyMessage="Nenhum executivo identificado"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB: NEGOCIO (Step 2 - Business Model) */}
        {activeTab === 'negocio' && (
          <div className="space-y-6">
            {/* Step 2 Enrichment Status */}
            <Step2Card companyId={company.id} />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {/* Modelo de Negocio */}
              <Section title="Modelo de Negocio" icon={<Briefcase className="w-4 h-4" />} columns={2}>
                <EditableField
                  label="Modelo de Negocio"
                  field="business_model"
                  value={company.business_model}
                  editMode={editMode}
                  formData={formData}
                  onChange={handleFieldChange}
                  type="textarea"
                />
                <EditableField
                  label="Modelo de Precificacao"
                  field="pricing_model"
                  value={company.pricing_model}
                  editMode={editMode}
                  formData={formData}
                  onChange={handleFieldChange}
                  type="textarea"
                />
              </Section>

              {/* Setor */}
              <Section title="Setor" icon={<Target className="w-4 h-4" />} columns={2}>
                <EditableField
                  label="Industria"
                  field="industry"
                  value={company.industry}
                  editMode={editMode}
                  formData={formData}
                  onChange={handleFieldChange}
                />
                <EditableField
                  label="Setor"
                  field="sector"
                  value={company.sector}
                  editMode={editMode}
                  formData={formData}
                  onChange={handleFieldChange}
                />
              </Section>
            </div>

            {/* Produtos/Servicos */}
            <EditableList
              title="Principais Produtos/Servicos"
              icon={<Briefcase className="w-4 h-4" />}
              field="main_products"
              items={company.main_products}
              editMode={editMode}
              formData={formData}
              onChange={handleFieldChange}
              emptyMessage="Nenhum produto identificado"
            />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {/* Publico-Alvo */}
              <Section title="Publico-Alvo" icon={<Users className="w-4 h-4" />} columns={2}>
                <EditableField
                  label="Mercado-Alvo"
                  field="target_market"
                  value={company.target_market}
                  editMode={editMode}
                  formData={formData}
                  onChange={handleFieldChange}
                  placeholder="B2B, B2C, B2B2C"
                />
                <EditableField
                  label="Publico-Alvo"
                  field="target_audience"
                  value={company.target_audience}
                  editMode={editMode}
                  formData={formData}
                  onChange={handleFieldChange}
                  type="textarea"
                />
              </Section>

              <div>
                <EditableList
                  title="Segmentos de Clientes"
                  icon={<Users className="w-4 h-4" />}
                  field="customer_segments"
                  items={company.customer_segments}
                  editMode={editMode}
                  formData={formData}
                  onChange={handleFieldChange}
                  emptyMessage="Nenhum segmento identificado"
                />
              </div>
            </div>

            {/* Proposta de Valor */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <Section title="Proposta de Valor" icon={<Sparkles className="w-4 h-4" />}>
                <EditableField
                  label="Proposta de Valor"
                  field="value_proposition"
                  value={company.value_proposition}
                  editMode={editMode}
                  formData={formData}
                  onChange={handleFieldChange}
                  type="textarea"
                />
              </Section>

              <div>
                <EditableList
                  title="Diferenciais (USPs)"
                  icon={<Sparkles className="w-4 h-4" />}
                  field="unique_selling_points"
                  items={company.unique_selling_points}
                  editMode={editMode}
                  formData={formData}
                  onChange={handleFieldChange}
                  emptyMessage="Nenhum diferencial identificado"
                />
              </div>
            </div>

            {/* Atuacao Geografica */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <EditableList
                title="Regioes de Atuacao"
                icon={<MapPin className="w-4 h-4" />}
                field="geographic_regions"
                items={company.geographic_regions}
                editMode={editMode}
                formData={formData}
                onChange={handleFieldChange}
                emptyMessage="Nenhuma regiao identificada"
              />
              <EditableList
                title="Areas de Servico"
                icon={<MapPin className="w-4 h-4" />}
                field="service_areas"
                items={company.service_areas}
                editMode={editMode}
                formData={formData}
                onChange={handleFieldChange}
                emptyMessage="Nenhuma area identificada"
              />
            </div>
          </div>
        )}

        {/* TAB: MERCADO (Step 3 - Competitive Intelligence) */}
        {activeTab === 'mercado' && (
          <div className="space-y-6">
            {/* Step 3 Enrichment Status */}
            <Step3Card companyId={company.id} />

            {/* Concorrentes */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <EditableList
                title="Concorrentes"
                icon={<Target className="w-4 h-4" />}
                field="competitors"
                items={company.competitors}
                editMode={editMode}
                formData={formData}
                onChange={handleFieldChange}
                emptyMessage="Nenhum concorrente identificado"
              />
              <EditableList
                title="Detalhes dos Concorrentes"
                icon={<Target className="w-4 h-4" />}
                field="competitor_details"
                items={company.competitor_details}
                editMode={editMode}
                formData={formData}
                onChange={handleFieldChange}
                emptyMessage="Nenhum detalhe de concorrente"
              />
            </div>

            {/* Contexto do Setor */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <Section title="Contexto do Setor" icon={<TrendingUp className="w-4 h-4" />}>
                <EditableField
                  label="Crescimento do Setor"
                  field="industry_growth_rate"
                  value={company.industry_growth_rate}
                  editMode={editMode}
                  formData={formData}
                  onChange={handleFieldChange}
                  placeholder="Ex: +12% CAGR"
                />
                <EditableField
                  label="Concentracao de Mercado"
                  field="market_concentration"
                  value={company.market_concentration}
                  editMode={editMode}
                  formData={formData}
                  onChange={handleFieldChange}
                  placeholder="Ex: Fragmentado, Concentrado"
                />
                <EditableField
                  label="Posicao no Mercado"
                  field="market_share_status"
                  value={company.market_share_status}
                  editMode={editMode}
                  formData={formData}
                  onChange={handleFieldChange}
                  placeholder="Ex: Lider, Desafiador, Nicho"
                />
              </Section>

              <Section title="Contexto Regulatorio" icon={<Shield className="w-4 h-4" />}>
                <EditableField
                  label="Contexto Regulatorio"
                  field="regulatory_context"
                  value={company.regulatory_context}
                  editMode={editMode}
                  formData={formData}
                  onChange={handleFieldChange}
                  type="textarea"
                  placeholder="Marco regulatorio relevante"
                />
              </Section>
            </div>

            {/* Tendencias */}
            <EditableList
              title="Tendencias do Setor"
              icon={<TrendingUp className="w-4 h-4" />}
              field="industry_trends"
              items={company.industry_trends}
              editMode={editMode}
              formData={formData}
              onChange={handleFieldChange}
              emptyMessage="Nenhuma tendencia identificada"
            />

            {/* Noticias Recentes */}
            <EditableList
              title="Noticias Recentes"
              icon={<FileText className="w-4 h-4" />}
              field="recent_news"
              items={company.recent_news}
              editMode={editMode}
              formData={formData}
              onChange={handleFieldChange}
              emptyMessage="Nenhuma noticia recente"
            />

            {/* Fontes */}
            <EditableList
              title="Fontes do Enriquecimento"
              icon={<ExternalLink className="w-4 h-4" />}
              field="enrichment_sources"
              items={company.enrichment_sources}
              editMode={editMode}
              formData={formData}
              onChange={handleFieldChange}
              emptyMessage="Nenhuma fonte registrada"
            />
          </div>
        )}

        {/* TAB: ANALISES (Challenges) */}
        {activeTab === 'analises' && (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Visualize os desafios de negocio e suas analises estrategicas.
            </p>

            {challengesLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-40" />
                ))}
              </div>
            ) : visibleChallenges.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {visibleChallenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onViewReport={handleViewReport}
                    isGeneratingCode={generatingCodeForId === challenge.latest_analysis?.id}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-line rounded">
                <FileText className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium text-navy-900 mb-2">
                  Nenhuma analise disponivel
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  As analises estrategicas aparecerão aqui quando estiverem concluidas.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
