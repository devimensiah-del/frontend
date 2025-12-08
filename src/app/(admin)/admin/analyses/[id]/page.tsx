'use client'

import { use, useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/lib/services'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  getChallengeType,
  getCategoryInfo,
} from '@/lib/config/challenges'
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  Globe,
  Users,
  DollarSign,
  Target,
  TrendingUp,
  Briefcase,
  Shield,
  AlertTriangle,
  FileText,
  Eye,
  EyeOff,
  ExternalLink,
  Download,
  Lightbulb,
  Award,
  Compass,
  Zap,
  ChevronDown,
  ArrowRight,
  Rocket,
  Lock,
  Building2,
  GraduationCap,
  Minus,
  Plus,
  TrendingDown,
  BarChart,
  Repeat,
  Sparkles,
  PieChart,
} from 'lucide-react'
import type { AnalysisStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

// Utility functions
function normalizeToArray(data: unknown): string[] {
  if (!data) return []
  if (Array.isArray(data)) return data.map(item => String(item))
  return []
}

function getStatusBadge(status: AnalysisStatus) {
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

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

// Section Components
function SectionHeader({ number, title, subtitle }: { number: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500 mb-3">
        {number} — {subtitle || title}
      </div>
      <h2 className="text-2xl lg:text-4xl font-medium text-navy-900 tracking-tight">
        {title}
      </h2>
    </div>
  )
}

function SynthesisSection({ data, number }: { data: any; number: string }) {
  if (!data) return null

  const executiveSummary = data.executiveSummary || data.executive_summary
  const keyFindings = normalizeToArray(data.keyFindings || data.key_findings)
  const strategicPriorities = normalizeToArray(data.strategicPriorities || data.strategic_priorities)
  const overallRecommendation = data.overallRecommendation || data.overall_recommendation

  return (
    <div className="py-12 px-6 lg:px-12">
      <SectionHeader number={number} title="Visão Estratégica" subtitle="Sumário Executivo" />

      {executiveSummary && (
        <div className="relative mb-8">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold-500" />
          <div className="pl-6 pr-4 py-4 bg-navy-50 border border-navy-100">
            <div className="flex items-start gap-4">
              <FileText className="w-5 h-5 text-navy-600 flex-shrink-0 mt-1" />
              <p className="text-navy-900 leading-relaxed">{executiveSummary}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {keyFindings.length > 0 && (
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-5 h-5 text-gold-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900">
                Principais Descobertas
              </h3>
            </div>
            <ul className="space-y-3">
              {keyFindings.map((finding, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-gold-500 font-bold">→</span>
                  <span className="text-gray-700 leading-relaxed text-sm">{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {strategicPriorities.length > 0 && (
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-5 h-5 text-gold-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900">
                Prioridades Estratégicas
              </h3>
            </div>
            <div className="space-y-3">
              {strategicPriorities.map((priority, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gold-50 border border-gold-200">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gold-500 text-white flex items-center justify-center font-bold text-xs">
                    {index + 1}
                  </div>
                  <span className="text-navy-900 text-sm">{priority}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {overallRecommendation && (
        <div className="bg-navy-900 text-white p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-3">
            <Award className="w-5 h-5 text-gold-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-gold-500">
              Recomendação Final
            </h3>
          </div>
          <p className="text-gray-200 leading-relaxed">{overallRecommendation}</p>
        </div>
      )}
    </div>
  )
}

function SWOTSection({ data, number }: { data: any; number: string }) {
  if (!data) return null

  const normalizeSWOTItems = (items: any): Array<{ content: string; confidence?: string }> => {
    if (!items || !Array.isArray(items)) return []
    return items.map((item: any) => {
      if (typeof item === 'string') return { content: item }
      if (typeof item === 'object' && item !== null) {
        return { content: item.content || String(item), confidence: item.confidence }
      }
      return { content: String(item) }
    })
  }

  const quadrants = [
    { key: 'strengths', title: 'Forças', items: normalizeSWOTItems(data.strengths), color: 'green', icon: CheckCircle2 },
    { key: 'weaknesses', title: 'Fraquezas', items: normalizeSWOTItems(data.weaknesses), color: 'red', icon: AlertCircle },
    { key: 'opportunities', title: 'Oportunidades', items: normalizeSWOTItems(data.opportunities), color: 'blue', icon: Rocket },
    { key: 'threats', title: 'Ameaças', items: normalizeSWOTItems(data.threats), color: 'amber', icon: Shield },
  ]

  const colorStyles: Record<string, { bg: string; border: string; header: string; bullet: string }> = {
    green: { bg: 'bg-green-50', border: 'border-green-200', header: 'bg-green-600', bullet: 'text-green-600' },
    red: { bg: 'bg-red-50', border: 'border-red-200', header: 'bg-navy-900', bullet: 'text-navy-900' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', header: 'bg-gold-500', bullet: 'text-gold-500' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', header: 'bg-gray-500', bullet: 'text-gray-500' },
  }

  return (
    <div className="py-12 px-6 lg:px-12 bg-gray-50">
      <SectionHeader number={number} title="Posicionamento Estratégico" subtitle="Análise SWOT" />

      {data.summary && <p className="text-gray-600 max-w-3xl mb-8">{data.summary}</p>}

      <div className="grid md:grid-cols-2 gap-4">
        {quadrants.map((q) => {
          const styles = colorStyles[q.color]
          const Icon = q.icon

          return (
            <div key={q.key} className={cn("border overflow-hidden", styles.border, styles.bg)}>
              <div className={cn("px-4 py-3 flex items-center gap-2", styles.header)}>
                <Icon className="w-4 h-4 text-white" />
                <h3 className="font-bold uppercase tracking-wider text-white text-xs">{q.title}</h3>
              </div>
              <ul className="p-4 space-y-3">
                {q.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className={cn("font-bold mt-0.5 text-sm", styles.bullet)}>•</span>
                    <div className="flex-1">
                      <span className="text-gray-700 leading-relaxed text-sm">{item.content}</span>
                      {item.confidence && (
                        <span className={cn(
                          "ml-2 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-bold",
                          item.confidence.toLowerCase() === 'alta' ? 'bg-green-100 text-green-700' :
                          item.confidence.toLowerCase() === 'média' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        )}>
                          {item.confidence}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PESTELSection({ data, number }: { data: any; number: string }) {
  if (!data) return null

  const factors = [
    { key: 'political', title: 'Político', icon: Globe, items: normalizeToArray(data.political) },
    { key: 'economic', title: 'Econômico', icon: DollarSign, items: normalizeToArray(data.economic) },
    { key: 'social', title: 'Social', icon: Users, items: normalizeToArray(data.social) },
    { key: 'technological', title: 'Tecnológico', icon: Zap, items: normalizeToArray(data.technological) },
    { key: 'environmental', title: 'Ambiental', icon: Compass, items: normalizeToArray(data.environmental) },
    { key: 'legal', title: 'Legal', icon: Shield, items: normalizeToArray(data.legal) },
  ]

  return (
    <div className="py-12 px-6 lg:px-12">
      <SectionHeader number={number} title="Ambiente Macro" subtitle="Análise PESTEL" />

      {data.summary && <p className="text-gray-600 max-w-3xl mb-8">{data.summary}</p>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {factors.map((factor) => {
          const Icon = factor.icon
          return (
            <div key={factor.key} className="bg-white border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                <div className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-gold-600" />
                </div>
                <h3 className="font-bold uppercase tracking-wider text-navy-900 text-xs">
                  {factor.title}
                </h3>
              </div>
              <ul className="space-y-2">
                {factor.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="text-gold-500 mt-0.5">→</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TamSamSomSection({ data, number }: { data: any; number: string }) {
  if (!data) return null

  const marketSizes = [
    { key: 'tam', label: 'TAM', sublabel: 'Total Addressable Market', value: data.tam, color: 'navy' },
    { key: 'sam', label: 'SAM', sublabel: 'Serviceable Addressable Market', value: data.sam, color: 'gold' },
    { key: 'som', label: 'SOM', sublabel: 'Serviceable Obtainable Market', value: data.som, color: 'green' },
  ]

  const assumptions = normalizeToArray(data.assumptions)

  return (
    <div className="py-12 px-6 lg:px-12">
      <SectionHeader number={number} title="Dimensionamento de Mercado" subtitle="TAM SAM SOM" />

      {data.summary && <p className="text-gray-600 max-w-3xl mb-8">{data.summary}</p>}

      <div className="grid lg:grid-cols-3 gap-4 mb-8">
        {marketSizes.map((market, index) => (
          <div
            key={market.key}
            className={cn(
              "relative p-6 border-2 transition-all",
              market.color === 'navy' && "bg-navy-900 border-navy-800 text-white",
              market.color === 'gold' && "bg-gold-50 border-gold-300",
              market.color === 'green' && "bg-green-50 border-green-300"
            )}
          >
            <div className={cn(
              "text-[9px] font-bold uppercase tracking-widest mb-1",
              market.color === 'navy' ? "text-gold-500" : "text-gray-500"
            )}>
              {market.sublabel}
            </div>
            <div className={cn(
              "text-3xl font-light mb-1",
              market.color === 'navy' ? "text-white" : "text-navy-900"
            )}>
              {market.label}
            </div>
            <div className={cn(
              "text-sm font-medium",
              market.color === 'navy' ? "text-gray-300" : "text-navy-900"
            )}>
              {market.value || '—'}
            </div>
            <div className={cn(
              "absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
              market.color === 'navy' && "bg-white/10 text-white",
              market.color === 'gold' && "bg-gold-500 text-white",
              market.color === 'green' && "bg-green-500 text-white"
            )}>
              {index + 1}
            </div>
          </div>
        ))}
      </div>

      {data.cagr && (
        <div className="bg-white border border-gray-200 p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-gold-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900">CAGR Projetado</h3>
          </div>
          <div className="text-2xl font-light text-navy-900">{data.cagr}</div>
        </div>
      )}

      {assumptions.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 mb-4">
            Premissas & Metodologia
          </h3>
          <ul className="grid md:grid-cols-2 gap-2">
            {assumptions.map((assumption, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                <span className="text-gold-500 font-bold">→</span>
                <span className="leading-relaxed">{assumption}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function DecisionMatrixSection({ data, number }: { data: any; number: string }) {
  if (!data) return null

  const recommendations = data.priority_recommendations || data.priorityRecommendations || []

  return (
    <div className="py-12 px-6 lg:px-12">
      <SectionHeader number={number} title="Recomendações Prioritárias" subtitle="Matriz de Decisão" />

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 bg-navy-900 text-white p-6 flex flex-col justify-center">
          <div className="text-[9px] font-bold uppercase tracking-widest text-gold-500 mb-1">
            Score Final
          </div>
          <div className="text-4xl font-light text-gold-500 mb-2">{data.score}</div>
          <div className="text-xs text-gray-400">{data.score_comparison}</div>
        </div>

        <div className="lg:col-span-2 bg-gold-50 border border-gold-200 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-gold-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-gold-800">
              Opção Recomendada
            </h3>
          </div>
          <p className="text-navy-900 font-medium mb-2">
            {data.recommended_option || data.recommendedOption}
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            {data.final_recommendation || data.finalRecommendation}
          </p>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Plano de Ação
          </h3>
          {recommendations.map((rec: any, index: number) => (
            <div key={index} className="bg-white border border-gray-200 p-4 flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-navy-900 text-white flex items-center justify-center font-bold text-sm">
                {rec.priority}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-navy-900 mb-1 text-sm">{rec.title}</h4>
                <p className="text-gray-600 text-xs mb-3 leading-relaxed">{rec.description}</p>
                <div className="flex flex-wrap gap-3 text-xs">
                  <span className="flex items-center gap-1 text-gray-500">
                    <Clock className="w-3 h-3" />
                    {rec.timeline}
                  </span>
                  <span className="flex items-center gap-1 text-gray-500">
                    <DollarSign className="w-3 h-3" />
                    {rec.budget}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function GenericFrameworkSection({
  number,
  title,
  subtitle,
  summary,
  content
}: {
  number: string
  title: string
  subtitle: string
  summary?: string
  content: Record<string, any>
}) {
  return (
    <div className="py-12 px-6 lg:px-12 bg-gray-50">
      <SectionHeader number={number} title={title} subtitle={subtitle} />
      {summary && <p className="text-gray-600 max-w-3xl mb-6">{summary}</p>}
      <pre className="bg-white border border-gray-200 p-4 overflow-auto text-xs text-gray-700 rounded">
        {JSON.stringify(content, null, 2)}
      </pre>
    </div>
  )
}

export default function AnalysisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const { data: analysis, isLoading, error } = useQuery({
    queryKey: ['admin', 'analysis', id],
    queryFn: () => adminService.getAnalysis(id),
    enabled: !!id,
  })

  if (isLoading) {
    return <PageSkeleton />
  }

  if (error || !analysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <AlertCircle className="w-12 h-12 text-error mb-4" />
        <h1 className="text-xl font-medium text-navy-900 mb-2">
          Análise não encontrada
        </h1>
        <p className="text-muted-foreground mb-4">
          A análise solicitada não existe ou você não tem permissão para visualizá-la.
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

  // Cast to any to handle API response variations (snake_case vs camelCase)
  const results: any = (analysis as any).framework_results || (analysis as any).analysis || {}
  const synthesis = results.synthesis
  const swot = results.swot
  const pestel = results.pestel
  const tamSamSom = results.tamSamSom || results.tam_sam_som
  const decisionMatrix = results.decisionMatrix || results.decision_matrix
  const porter = results.porter
  const blueOcean = results.blueOcean || results.blue_ocean
  const benchmarking = results.benchmarking
  const growthHacking = results.growthHacking || results.growth_hacking
  const scenarios = results.scenarios
  const okrs = results.okrs
  const bsc = results.bsc

  let sectionNum = 0

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="bg-navy-900 text-white p-6 lg:p-12">
        <Link
          href="/admin"
          className="text-sm text-gray-400 hover:text-gold-500 flex items-center gap-1 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500 mb-2">
              Relatório de Análise Estratégica
            </div>
            <h1 className="text-3xl lg:text-4xl font-medium tracking-tight mb-3">
              Análise #{analysis.id.slice(0, 8)}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              {getStatusBadge(analysis.status)}
              {analysis.is_visible_to_user ? (
                <Badge variant="outline" className="text-green-400 border-green-400/30 bg-green-400/10">
                  <Eye className="w-3 h-3 mr-1" />
                  Visível
                </Badge>
              ) : (
                <Badge variant="outline" className="text-gray-400 border-gray-400/30 bg-gray-400/10">
                  <EyeOff className="w-3 h-3 mr-1" />
                  Oculta
                </Badge>
              )}
              {analysis.is_public && (
                <Badge variant="outline" className="text-blue-400 border-blue-400/30 bg-blue-400/10">
                  <Globe className="w-3 h-3 mr-1" />
                  Pública
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {analysis.access_code && (
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10" asChild>
                <a href={`/report/${analysis.access_code}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ver Relatório
                </a>
              </Button>
            )}
            {analysis.pdf_url && (
              <Button variant="outline" size="sm" className="border-gold-500 text-gold-500 hover:bg-gold-500/10" asChild>
                <a href={analysis.pdf_url} target="_blank" rel="noopener noreferrer" download>
                  <Download className="w-4 h-4 mr-2" />
                  Baixar PDF
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Metadata Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
          <div className="border-l-2 border-gray-700 pl-3">
            <div className="text-2xl font-light text-white">11</div>
            <div className="text-[9px] uppercase tracking-widest text-gray-400">Frameworks</div>
          </div>
          <div className="border-l-2 border-gray-700 pl-3">
            <div className="text-2xl font-light text-gold-500">IA+IH</div>
            <div className="text-[9px] uppercase tracking-widest text-gray-400">Inteligência Híbrida</div>
          </div>
          <div className="border-l-2 border-gray-700 pl-3">
            <div className="text-2xl font-light text-white">360°</div>
            <div className="text-[9px] uppercase tracking-widest text-gray-400">Visão Completa</div>
          </div>
          <div className="border-l-2 border-gray-700 pl-3">
            <div className="text-2xl font-light text-white">
              {new Date(analysis.created_at).toLocaleDateString('pt-BR')}
            </div>
            <div className="text-[9px] uppercase tracking-widest text-gray-400">Data de Criação</div>
          </div>
        </div>
      </div>

      {/* Framework Sections */}
      <div className="divide-y divide-gray-200">
        {synthesis && (
          <SynthesisSection data={synthesis} number={String(++sectionNum).padStart(2, '0')} />
        )}

        {swot && (
          <SWOTSection data={swot} number={String(++sectionNum).padStart(2, '0')} />
        )}

        {pestel && (
          <PESTELSection data={pestel} number={String(++sectionNum).padStart(2, '0')} />
        )}

        {tamSamSom && (
          <TamSamSomSection data={tamSamSom} number={String(++sectionNum).padStart(2, '0')} />
        )}

        {porter && (
          <GenericFrameworkSection
            number={String(++sectionNum).padStart(2, '0')}
            title="Dinâmica Competitiva"
            subtitle="5 Forças de Porter+"
            summary={porter.summary}
            content={porter}
          />
        )}

        {benchmarking && (
          <GenericFrameworkSection
            number={String(++sectionNum).padStart(2, '0')}
            title="Análise Competitiva"
            subtitle="Benchmarking"
            summary={benchmarking.summary}
            content={benchmarking}
          />
        )}

        {blueOcean && (
          <GenericFrameworkSection
            number={String(++sectionNum).padStart(2, '0')}
            title="Estratégia do Oceano Azul"
            subtitle="Blue Ocean"
            summary={blueOcean.summary}
            content={blueOcean}
          />
        )}

        {growthHacking && (
          <GenericFrameworkSection
            number={String(++sectionNum).padStart(2, '0')}
            title="Loops de Crescimento"
            subtitle="Growth Hacking"
            summary={growthHacking.summary}
            content={growthHacking}
          />
        )}

        {scenarios && (
          <GenericFrameworkSection
            number={String(++sectionNum).padStart(2, '0')}
            title="Análise de Cenários"
            subtitle="Cenários"
            summary={scenarios.summary}
            content={scenarios}
          />
        )}

        {okrs && (
          <GenericFrameworkSection
            number={String(++sectionNum).padStart(2, '0')}
            title="Objectives & Key Results"
            subtitle="OKRs"
            summary={okrs.summary}
            content={okrs}
          />
        )}

        {bsc && (
          <GenericFrameworkSection
            number={String(++sectionNum).padStart(2, '0')}
            title="Balanced Scorecard"
            subtitle="BSC"
            summary={bsc.summary}
            content={bsc}
          />
        )}

        {decisionMatrix && (
          <DecisionMatrixSection data={decisionMatrix} number={String(++sectionNum).padStart(2, '0')} />
        )}
      </div>

      {/* Empty State */}
      {Object.keys(results).length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h2 className="text-lg font-medium text-navy-900 mb-2">
            Análise em processamento
          </h2>
          <p className="text-muted-foreground max-w-md">
            Os frameworks ainda estão sendo processados. Aguarde alguns minutos e atualize a página.
          </p>
        </div>
      )}
    </div>
  )
}
