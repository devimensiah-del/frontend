'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { useAdminCompany, useUpdateAdminCompany, useAnalyzeChallenge, useChallenges, useUpdateVisibility, useGenerateAccessCode } from '@/lib/hooks'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { ReAnalyzeDialog } from '@/components/features/admin/re-analyze-dialog'
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
  DollarSign,
  Calendar,
  Linkedin,
  Twitter,
  Target,
  TrendingUp,
  Briefcase,
  Shield,
  AlertTriangle,
  Pencil,
  X,
  Save,
  Plus,
  Zap,
  FileText,
  Play,
  Eye,
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
        Sem análise
      </Badge>
    )
  }
  switch (status) {
    case 'completed':
      return (
        <Badge variant="outline" className="text-success border-success/30 bg-success/10">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Concluída
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
  onAnalyze: (challengeId: string) => void
  isAnalyzing: boolean
  onToggleVisibility?: (analysisId: string, visible: boolean) => void
  onTogglePublic?: (analysisId: string, isPublic: boolean) => void
  onViewReport?: (analysisId: string, accessCode?: string | null) => void
  isUpdating?: boolean
  isGeneratingCode?: boolean
}

function ChallengeCard({ challenge, onAnalyze, isAnalyzing, onToggleVisibility, onTogglePublic, onViewReport, isUpdating, isGeneratingCode }: ChallengeCardProps) {
  const typeInfo = getChallengeType(challenge.challenge_type)
  const categoryInfo = getCategoryInfo(challenge.challenge_category)
  const analysis = challenge.latest_analysis
  const hasAnalysis = analysis && analysis.status === 'completed'
  const isProcessing = analysis?.status === 'processing' || analysis?.status === 'pending'
  const isFailed = analysis?.status === 'failed'
  const accessCode = analysis?.access_code

  // Derive display status - include local "isAnalyzing" state
  const displayStatus = isAnalyzing ? 'processing' : analysis?.status

  return (
    <div className={`bg-white border p-4 transition-colors ${
      isProcessing || isAnalyzing ? 'border-info/50 bg-info/5' :
      isFailed ? 'border-error/30' :
      'border-line hover:border-gold-300'
    }`}>
      <div className="flex flex-col gap-3">
        {/* Header with category and type */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg">{categoryInfo?.emoji || '📋'}</span>
            <span className="text-xs font-medium uppercase tracking-wide text-gold-600">
              {categoryInfo?.label || challenge.challenge_category}
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">
              {typeInfo?.label || challenge.challenge_type}
            </span>
          </div>
          {getAnalysisStatusBadge(displayStatus as AnalysisStatus | undefined)}
        </div>

        {/* Challenge description */}
        <p className="text-sm text-navy-800 line-clamp-3">
          {challenge.business_challenge}
        </p>

        {/* Visibility Controls - Only show when analysis is completed */}
        {hasAnalysis && analysis && (
          <div className="flex items-center gap-3 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={analysis.is_visible_to_user ?? false}
                onChange={(e) => onToggleVisibility?.(analysis.id, e.target.checked)}
                disabled={isUpdating}
                className="w-3.5 h-3.5 accent-gold-500"
              />
              <span className="text-muted-foreground">Visível</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={analysis.is_public ?? false}
                onChange={(e) => onTogglePublic?.(analysis.id, e.target.checked)}
                disabled={isUpdating}
                className="w-3.5 h-3.5 accent-gold-500"
              />
              <span className="text-muted-foreground">Público</span>
            </label>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-line">
          {hasAnalysis ? (
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
              Ver Análise
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() => onAnalyze(challenge.id)}
              disabled={isAnalyzing || isProcessing}
            >
              {(isAnalyzing || isProcessing) ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
              Analisar
            </Button>
          )}

          {/* Re-analyze button when completed */}
          {hasAnalysis && (
            <Button
              size="sm"
              variant="ghost"
              className="gap-1.5 text-muted-foreground hover:text-navy-900"
              onClick={() => onAnalyze(challenge.id)}
              disabled={isAnalyzing || isProcessing}
            >
              {(isAnalyzing || isProcessing) ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
              Reanalisar
            </Button>
          )}

          {challenge.analysis_count && challenge.analysis_count > 1 && (
            <span className="text-xs text-muted-foreground ml-auto">
              {challenge.analysis_count} análises
            </span>
          )}
        </div>
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
  type?: 'text' | 'number' | 'url' | 'textarea'
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
            type={type}
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
        <div className="flex items-center gap-2">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          {type === 'url' && value ? (
            <a
              href={value.toString().startsWith('http') ? value.toString() : `https://${value}`}
              target="_blank"
              rel="noopener noreferrer"
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
    <div className="space-y-6">
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
  )
}

export default function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: company, isLoading, error } = useAdminCompany(id)
  const { data: challenges = [], isLoading: challengesLoading } = useChallenges(id)
  const updateCompany = useUpdateAdminCompany()
  const analyzeChallenge = useAnalyzeChallenge()
  const updateVisibility = useUpdateVisibility()
  const generateAccessCode = useGenerateAccessCode()

  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const [reAnalyzeOpen, setReAnalyzeOpen] = useState(false)
  const [analyzingChallengeId, setAnalyzingChallengeId] = useState<string | null>(null)
  const [generatingCodeForId, setGeneratingCodeForId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'dados' | 'desafios'>('dados')

  // Reset form data when company loads or edit mode changes
  useEffect(() => {
    if (!editMode) {
      setFormData({})
    }
  }, [editMode])

  const handleAnalyzeChallenge = async (challengeId: string) => {
    setAnalyzingChallengeId(challengeId)
    try {
      await analyzeChallenge.mutateAsync(challengeId)
    } finally {
      setAnalyzingChallengeId(null)
    }
  }

  const handleToggleVisibility = (analysisId: string, visible: boolean) => {
    updateVisibility.mutate({ analysisId, field: 'is_visible_to_user', value: visible })
  }

  const handleTogglePublic = (analysisId: string, isPublic: boolean) => {
    updateVisibility.mutate({ analysisId, field: 'is_public', value: isPublic })
  }

  const handleViewReport = async (analysisId: string, accessCode?: string | null) => {
    // Admin preview URL - bypasses visibility checks on backend
    const adminPreviewParam = '?preview=admin'

    // If access code exists, navigate directly
    if (accessCode) {
      window.open(`/report/${accessCode}${adminPreviewParam}`, '_blank')
      return
    }

    // Otherwise, generate an access code first
    setGeneratingCodeForId(analysisId)
    try {
      const response = await generateAccessCode.mutateAsync(analysisId)
      if (response?.access_code) {
        window.open(`/report/${response.access_code}${adminPreviewParam}`, '_blank')
      }
    } finally {
      setGeneratingCodeForId(null)
    }
  }

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

  if (isLoading) {
    return <PageSkeleton />
  }

  if (error || !company) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <AlertCircle className="w-12 h-12 text-error mb-4" />
        <h1 className="text-xl font-medium text-navy-900 mb-2">
          Empresa não encontrada
        </h1>
        <p className="text-muted-foreground mb-4">
          A empresa solicitada não existe ou você não tem permissão para visualizá-la.
        </p>
        <Link
          href="/admin"
          className="text-gold-600 hover:underline flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para a lista
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Link
            href="/admin"
            className="text-sm text-muted-foreground hover:text-gold-600 flex items-center gap-1 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>

          {/* Edit Controls - Only show on Dados tab */}
          {activeTab === 'dados' && (
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
              {editMode && activeTab === 'dados' ? (
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
            {(company.legal_name || (editMode && activeTab === 'dados')) && (
              editMode && activeTab === 'dados' ? (
                <Input
                  value={(formData.legal_name as string) ?? company.legal_name ?? ''}
                  onChange={(e) => handleFieldChange('legal_name', e.target.value || null)}
                  className="text-sm mt-2 max-w-md"
                  placeholder="Razão Social"
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

      {/* Enrichment Error Alert */}
      {company.enrichment_error && (
        <div className="bg-error/10 border border-error/30 p-4 rounded flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-error">Erro no Enriquecimento</p>
            <p className="text-sm text-error/80 mt-1">{company.enrichment_error}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-line">
        <div className="flex gap-0">
          <button
            onClick={() => { setActiveTab('dados'); setEditMode(false); }}
            className={`px-6 py-3 text-sm font-medium uppercase tracking-wide border-b-2 transition-colors ${
              activeTab === 'dados'
                ? 'border-gold-500 text-navy-900'
                : 'border-transparent text-muted-foreground hover:text-navy-700'
            }`}
          >
            <Building2 className="w-4 h-4 inline-block mr-2" />
            Dados
          </button>
          <button
            onClick={() => { setActiveTab('desafios'); setEditMode(false); }}
            className={`px-6 py-3 text-sm font-medium uppercase tracking-wide border-b-2 transition-colors ${
              activeTab === 'desafios'
                ? 'border-gold-500 text-navy-900'
                : 'border-transparent text-muted-foreground hover:text-navy-700'
            }`}
          >
            <Zap className="w-4 h-4 inline-block mr-2" />
            Desafios
            {challenges.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-navy-900/10 rounded-full">
                {challenges.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tab Content: Dados */}
      {activeTab === 'dados' && (
        <>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Informações Básicas */}
        <Section title="Informações Básicas" icon={<Building2 className="w-4 h-4" />}>
          <EditableField
            label="CNPJ"
            field="cnpj"
            value={company.cnpj}
            editMode={editMode}
            formData={formData}
            onChange={handleFieldChange}
          />
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
          <EditableField
            label="Ano de Fundação"
            field="foundation_year"
            value={company.foundation_year}
            editMode={editMode}
            formData={formData}
            onChange={handleFieldChange}
            icon={<Calendar className="w-4 h-4" />}
          />
        </Section>

        {/* Localização */}
        <Section title="Localização" icon={<MapPin className="w-4 h-4" />} columns={2}>
          <EditableField
            label="Localização"
            field="location"
            value={company.location}
            editMode={editMode}
            formData={formData}
            onChange={handleFieldChange}
          />
          <EditableField
            label="Sede"
            field="headquarters"
            value={company.headquarters}
            editMode={editMode}
            formData={formData}
            onChange={handleFieldChange}
          />
        </Section>

        {/* Setor e Mercado */}
        <Section title="Setor e Mercado" icon={<Target className="w-4 h-4" />}>
          <EditableField
            label="Indústria"
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
          <EditableField
            label="Mercado-Alvo"
            field="target_market"
            value={company.target_market}
            editMode={editMode}
            formData={formData}
            onChange={handleFieldChange}
          />
          <EditableField
            label="Público-Alvo"
            field="target_audience"
            value={company.target_audience}
            editMode={editMode}
            formData={formData}
            onChange={handleFieldChange}
          />
        </Section>

        {/* Tamanho e Receita */}
        <Section title="Tamanho e Receita" icon={<DollarSign className="w-4 h-4" />}>
          <EditableField
            label="Porte"
            field="company_size"
            value={company.company_size}
            editMode={editMode}
            formData={formData}
            onChange={handleFieldChange}
            icon={<Users className="w-4 h-4" />}
          />
          <EditableField
            label="Faixa de Funcionários"
            field="employees_range"
            value={company.employees_range}
            editMode={editMode}
            formData={formData}
            onChange={handleFieldChange}
          />
          <EditableField
            label="Receita Mínima (R$)"
            field="annual_revenue_min"
            value={company.annual_revenue_min}
            editMode={editMode}
            formData={formData}
            onChange={handleFieldChange}
            type="number"
          />
          <EditableField
            label="Receita Máxima (R$)"
            field="annual_revenue_max"
            value={company.annual_revenue_max}
            editMode={editMode}
            formData={formData}
            onChange={handleFieldChange}
            type="number"
          />
          <EditableField
            label="Estimativa de Receita"
            field="revenue_estimate"
            value={company.revenue_estimate}
            editMode={editMode}
            formData={formData}
            onChange={handleFieldChange}
          />
          <EditableField
            label="Estágio de Funding"
            field="funding_stage"
            value={company.funding_stage}
            editMode={editMode}
            formData={formData}
            onChange={handleFieldChange}
          />
        </Section>

        {/* Modelo de Negócio - Full Width */}
        <div className="xl:col-span-2">
          <Section title="Modelo de Negócio" icon={<Briefcase className="w-4 h-4" />} columns={2}>
            <EditableField
              label="Modelo de Negócio"
              field="business_model"
              value={company.business_model}
              editMode={editMode}
              formData={formData}
              onChange={handleFieldChange}
              type="textarea"
            />
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
        </div>

        {/* Posição no Mercado */}
        <Section title="Posição no Mercado" icon={<TrendingUp className="w-4 h-4" />} columns={2}>
          <EditableField
            label="Status de Market Share"
            field="market_share_status"
            value={company.market_share_status}
            editMode={editMode}
            formData={formData}
            onChange={handleFieldChange}
          />
          <EditableField
            label="Maturidade Digital (1-10)"
            field="digital_maturity"
            value={company.digital_maturity}
            editMode={editMode}
            formData={formData}
            onChange={handleFieldChange}
            type="number"
          />
        </Section>

        {/* Redes Sociais */}
        <Section title="Redes Sociais" icon={<Globe className="w-4 h-4" />} columns={2}>
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
          <EditableField
            label="Twitter"
            field="twitter_handle"
            value={company.twitter_handle}
            editMode={editMode}
            formData={formData}
            onChange={handleFieldChange}
            icon={<Twitter className="w-4 h-4" />}
          />
        </Section>
      </div>

      {/* Editable Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
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
          title="Pontos Fortes"
          icon={<CheckCircle2 className="w-4 h-4" />}
          field="strengths"
          items={company.strengths}
          editMode={editMode}
          formData={formData}
          onChange={handleFieldChange}
          emptyMessage="Nenhum ponto forte identificado"
          variant="success"
        />
        <EditableList
          title="Pontos Fracos"
          icon={<AlertCircle className="w-4 h-4" />}
          field="weaknesses"
          items={company.weaknesses}
          editMode={editMode}
          formData={formData}
          onChange={handleFieldChange}
          emptyMessage="Nenhum ponto fraco identificado"
          variant="warning"
        />
      </div>
        </>
      )}

      {/* Tab Content: Desafios */}
      {activeTab === 'desafios' && (
        <div className="space-y-6">
          {/* Header with New Challenge button */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Gerencie os desafios de negócio e suas análises estratégicas.
            </p>
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => setReAnalyzeOpen(true)}
            >
              <Plus className="w-3.5 h-3.5" />
              Novo Desafio
            </Button>
          </div>

          {/* Challenges Grid */}
          {challengesLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-40" />
              ))}
            </div>
          ) : challenges.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {challenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onAnalyze={handleAnalyzeChallenge}
                  isAnalyzing={analyzingChallengeId === challenge.id}
                  onToggleVisibility={handleToggleVisibility}
                  onTogglePublic={handleTogglePublic}
                  onViewReport={handleViewReport}
                  isUpdating={updateVisibility.isPending}
                  isGeneratingCode={generatingCodeForId === challenge.latest_analysis?.id}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-line rounded">
              <FileText className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium text-navy-900 mb-2">
                Nenhum desafio cadastrado
              </h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md">
                Crie um desafio de negócio para iniciar uma análise estratégica completa para esta empresa.
              </p>
              <Button
                className="gap-1.5"
                onClick={() => setReAnalyzeOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Criar Primeiro Desafio
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Re-Analyze Dialog */}
      <ReAnalyzeDialog
        companyId={company.id}
        companyName={company.name}
        open={reAnalyzeOpen}
        onOpenChange={setReAnalyzeOpen}
      />
    </div>
  )
}
