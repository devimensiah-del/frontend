'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { usePublicReport } from '@/lib/hooks'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { cn, normalizeToArray } from '@/lib/utils'
import {
  FileText,
  Lightbulb,
  CheckCircle,
  Globe,
  Shield,
  Target,
  TrendingUp,
  BarChart,
  Zap,
  AlertTriangle,
  Eye,
  ChevronDown,
  ArrowRight,
  Compass,
  Award,
  Clock,
  DollarSign,
  Users,
  Rocket,
  AlertCircle,
  Minus,
  Plus,
  Sparkles,
  Building2,
  GraduationCap,
  Repeat,
  TrendingDown,
  Lock,
} from 'lucide-react'

export default function PublicReportPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const code = params.code as string
  const [activeSection, setActiveSection] = useState(0)
  const sectionsRef = useRef<(HTMLElement | null)[]>([])

  const previewParam = searchParams.get('preview') || undefined
  const isAdminPreview = previewParam === 'admin'

  const { data: report, isLoading, error } = usePublicReport(code, previewParam)

  // Scroll observer for active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionsRef.current.indexOf(entry.target as HTMLElement)
            if (index !== -1) setActiveSection(index)
          }
        })
      },
      { threshold: 0.5 }
    )

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [report])

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-28 h-28 mx-auto mb-6">
            <Logo variant="white" />
          </div>
          <div className="animate-spin w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400 text-sm uppercase tracking-widest">
            Carregando relatório...
          </p>
        </div>
      </div>
    )
  }

  // Check if error is authentication required
  const isAuthRequired = error &&
    ((error as any)?.message?.includes('autenticação') ||
    (error as any)?.message?.includes('Authentication required') ||
    (error as any)?.response?.status === 401)

  // Auth Required State
  if (isAuthRequired) {
    return (
      <div className="min-h-screen bg-surface-paper flex flex-col">
        <ReportHeader />
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-lg">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto rounded-full bg-blue-500/10 flex items-center justify-center">
                <Lock className="w-10 h-10 text-blue-500" />
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-medium text-navy-900 mb-4 tracking-tight">
              Login necessário
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Este relatório requer autenticação para ser acessado.
              Faça login para visualizar o conteúdo completo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-navy-900 hover:bg-gold-500 text-white px-8 py-4 text-xs uppercase tracking-widest font-medium">
                <Link href={`/login?redirect=/report/${code}`}>Fazer Login</Link>
              </Button>
              <Button asChild variant="outline" className="px-8 py-4 text-xs uppercase tracking-widest font-medium">
                <Link href="/">Ir para o início</Link>
              </Button>
            </div>
          </div>
        </main>
        <ReportFooter />
      </div>
    )
  }

  // 404 State
  if (error || !report) {
    return (
      <div className="min-h-screen bg-surface-paper flex flex-col">
        <ReportHeader />
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-lg">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto rounded-full bg-gold-500/10 flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-gold-500" />
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-medium text-navy-900 mb-4 tracking-tight">
              Relatório não encontrado
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              O código de acesso é inválido ou o relatório não está mais disponível.
              Verifique se o link está correto ou entre em contato com quem compartilhou.
            </p>
            <Button asChild className="bg-navy-900 hover:bg-gold-500 text-white px-8 py-4 text-xs uppercase tracking-widest font-medium">
              <Link href="/">Ir para o início</Link>
            </Button>
          </div>
        </main>
        <ReportFooter />
      </div>
    )
  }

  // Normalize analysis data - using framework_results from v2 API
  const rawAnalysis: any = report.framework_results || {}
  const synthesis = normalizeSynthesis(rawAnalysis.synthesis || {})
  const analysis = normalizeAnalysis(rawAnalysis)
  const isAdminPreviewMode = report?.is_admin_preview || isAdminPreview
  // Always show full content (blur feature removed)
  const isBlurred = false

  // Build sections array based on available data
  const sections = buildSections(synthesis, analysis, isBlurred)

  return (
    <div className="min-h-screen bg-surface-paper">
      {/* Fixed Header */}
      <ReportHeader isAdminPreview={isAdminPreviewMode} />

      {/* Navigation Dots */}
      <NavigationDots
        sections={sections}
        activeSection={activeSection}
        onNavigate={(index) => {
          sectionsRef.current[index]?.scrollIntoView({ behavior: 'smooth' })
        }}
      />

      {/* Hero Section */}
      <section
        ref={(el) => { sectionsRef.current[0] = el }}
        className="min-h-screen relative flex flex-col"
      >
        {/* Hero Background */}
        <div className="absolute inset-0 bg-navy-900">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
          {/* Gold accent bar */}
          <div className="absolute left-0 top-1/4 w-1.5 h-48 bg-gradient-to-b from-gold-500 to-gold-600" />
        </div>

        {/* Hero Content */}
        <div className="relative flex-1 flex flex-col justify-center px-6 lg:px-24 pt-24">
          <div className="max-w-5xl">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500 mb-6">
              Relatório de Análise Estratégica
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-medium text-white mb-6 tracking-tight leading-tight">
              {report.company_name || 'Empresa'}
            </h1>
            {report.business_challenge && (
              <p className="text-lg lg:text-xl text-gray-300 max-w-2xl mb-12 leading-relaxed font-light">
                {report.business_challenge}
              </p>
            )}

            {/* Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-12">
              <MetricBadge value="11" label="Frameworks" />
              <MetricBadge value="IA+IH" label="Inteligência Híbrida" highlight />
              <MetricBadge value="360°" label="Visão Completa" />
              <MetricBadge value="48h" label="Entrega Rápida" />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="relative pb-12 flex justify-center">
          <button
            onClick={() => sectionsRef.current[1]?.scrollIntoView({ behavior: 'smooth' })}
            className="flex flex-col items-center text-gray-400 hover:text-gold-500 transition-colors group"
          >
            <span className="text-[10px] uppercase tracking-widest mb-2">Explorar</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </button>
        </div>
      </section>

      {/* Dynamic Sections */}
      {sections.slice(1).map((section, index) => (
        <section
          key={section.id}
          ref={(el) => { sectionsRef.current[index + 1] = el }}
          id={section.id}
          className={cn(
            'min-h-screen relative',
            section.variant === 'dark' ? 'bg-navy-900 text-white' : 'bg-surface-paper'
          )}
        >
          {section.component}
        </section>
      ))}

      {/* CTA Section */}
      <section className="bg-navy-900 py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500 mb-4">
            Transforme sua estratégia
          </div>
          <h2 className="text-3xl lg:text-5xl font-medium text-white mb-6 tracking-tight">
            Quer uma análise estratégica<br />para sua empresa?
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            A IMENSIAH combina Inteligência Artificial com expertise humana para
            gerar insights estratégicos de alto impacto em 48 horas.
          </p>
          <Button asChild className="bg-gold-500 hover:bg-gold-600 text-navy-900 px-10 py-5 text-xs uppercase tracking-widest font-bold">
            <Link href="/#diagnostico" className="inline-flex items-center gap-3">
              Solicitar Análise
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      <ReportFooter />
    </div>
  )
}

// ============================================
// COMPONENTS
// ============================================

function ReportHeader({ isAdminPreview = false }: { isAdminPreview?: boolean }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50">
      {isAdminPreview && (
        <div className="bg-orange-100 border-b border-orange-200 py-2">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-2 text-orange-800">
            <Eye className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">
              Visualização Admin — Relatório oculto
            </span>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 -ml-2">
          <div className="w-16 h-16">
            <Logo />
          </div>
          <span className="font-medium text-navy-900 tracking-tight">IMENSIAH</span>
        </Link>
        <Button asChild variant="outline" size="sm" className="text-xs uppercase tracking-wider">
          <Link href="/">Ir para o site</Link>
        </Button>
      </div>
    </header>
  )
}

function ReportFooter() {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 -ml-2">
            <div className="w-14 h-14">
              <Logo />
            </div>
            <span className="text-sm text-gray-600">
              © {currentYear} IMENSIAH. Todos os direitos reservados.
            </span>
          </div>
          <div className="flex gap-8 text-sm text-gray-500">
            <Link href="/termos" className="hover:text-navy-900 transition-colors">Termos de Uso</Link>
            <Link href="/privacidade" className="hover:text-navy-900 transition-colors">Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function NavigationDots({
  sections,
  activeSection,
  onNavigate
}: {
  sections: any[]
  activeSection: number
  onNavigate: (index: number) => void
}) {
  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3">
      {sections.map((section, index) => (
        <button
          key={section.id}
          onClick={() => onNavigate(index)}
          className={cn(
            'w-3 h-3 rounded-full transition-all duration-300 group relative',
            activeSection === index
              ? 'bg-gold-500 scale-125'
              : 'bg-gray-300 hover:bg-gray-400'
          )}
          title={section.title}
        >
          <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded shadow-sm">
            {section.title}
          </span>
        </button>
      ))}
    </nav>
  )
}

function MetricBadge({ value, label, highlight = false }: { value: string; label: string; highlight?: boolean }) {
  return (
    <div className="border-l-2 border-gray-700 pl-4">
      <div className={cn(
        'text-3xl lg:text-4xl font-light mb-1',
        highlight ? 'text-gold-500' : 'text-white'
      )}>
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-widest text-gray-400">{label}</div>
    </div>
  )
}

// ============================================
// PREMIUM BLUR OVERLAY
// ============================================

function PremiumBlurOverlay({ children, isBlurred, isDark = false }: { children: React.ReactNode; isBlurred: boolean; isDark?: boolean }) {
  if (!isBlurred) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      <div className="blur-sm opacity-40 pointer-events-none select-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={cn(
          'text-center max-w-md mx-auto px-6',
          isDark ? 'text-white' : 'text-navy-900'
        )}>
          <div className={cn(
            'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6',
            isDark ? 'bg-gold-500/20' : 'bg-gold-500/10'
          )}>
            <Lock className="w-8 h-8 text-gold-500" />
          </div>
          <h3 className="text-xl lg:text-2xl font-medium mb-3 tracking-tight">
            Conteúdo Premium
          </h3>
          <p className={cn(
            'text-sm mb-6 leading-relaxed',
            isDark ? 'text-gray-300' : 'text-gray-600'
          )}>
            Esta análise estratégica avançada está disponível no plano completo.
          </p>
          <Button
            asChild
            className="bg-gold-500 hover:bg-gold-600 text-navy-900 px-8 py-4 text-xs uppercase tracking-widest font-bold"
          >
            <Link href="/#diagnostico" className="inline-flex items-center gap-2">
              Desbloquear Relatório
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// SECTION COMPONENTS
// ============================================

function SynthesisSection({ synthesis, sectionNumber }: { synthesis: any; sectionNumber: string }) {
  return (
    <div className="min-h-screen flex flex-col justify-center px-6 lg:px-24 py-24">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-16">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500 mb-4">
            {sectionNumber} — Sumário Executivo
          </div>
          <h2 className="text-3xl lg:text-5xl font-medium text-navy-900 tracking-tight mb-6">
            Visão Estratégica
          </h2>
        </div>

        {synthesis.executiveSummary && (
          <div className="relative mb-12">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold-500" />
            <div className="pl-8 pr-4 py-6 bg-navy-50 border border-navy-100">
              <div className="flex items-start gap-4">
                <FileText className="w-6 h-6 text-navy-600 flex-shrink-0 mt-1" />
                <p className="text-lg text-navy-900 leading-relaxed">
                  {synthesis.executiveSummary}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {synthesis.keyFindings?.length > 0 && (
            <div className="bg-white border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="w-5 h-5 text-gold-500" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900">
                  Principais Descobertas
                </h3>
              </div>
              <ul className="space-y-4">
                {synthesis.keyFindings.map((finding: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-gold-500 font-bold mt-0.5">→</span>
                    <span className="text-gray-700 leading-relaxed">{finding}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {synthesis.strategicPriorities?.length > 0 && (
            <div className="bg-white border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-5 h-5 text-gold-500" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900">
                  Prioridades Estratégicas
                </h3>
              </div>
              <div className="space-y-4">
                {synthesis.strategicPriorities.map((priority: string, index: number) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gold-50 border border-gold-200">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-500 text-white flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="text-navy-900">{priority}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {synthesis.overallRecommendation && (
          <div className="bg-navy-900 text-white p-8 lg:p-12">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-5 h-5 text-gold-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-gold-500">
                Recomendação Final
              </h3>
            </div>
            <p className="text-lg lg:text-xl leading-relaxed text-gray-200">
              {synthesis.overallRecommendation}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function SWOTSection({ swot, sectionNumber }: { swot: any; sectionNumber: string }) {
  const quadrants = [
    { key: 'strengths', title: 'Forças', items: swot.strengths, color: 'green', icon: CheckCircle },
    { key: 'weaknesses', title: 'Fraquezas', items: swot.weaknesses, color: 'red', icon: AlertCircle },
    { key: 'opportunities', title: 'Oportunidades', items: swot.opportunities, color: 'blue', icon: Rocket },
    { key: 'threats', title: 'Ameaças', items: swot.threats, color: 'amber', icon: Shield },
  ]

  const colorStyles: Record<string, { bg: string; border: string; header: string; bullet: string }> = {
    green: { bg: 'bg-green-50', border: 'border-green-200', header: 'bg-green-600', bullet: 'text-green-600' },
    red: { bg: 'bg-red-50', border: 'border-red-200', header: 'bg-navy-900', bullet: 'text-navy-900' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', header: 'bg-gold-500', bullet: 'text-gold-500' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', header: 'bg-gray-500', bullet: 'text-gray-500' },
  }

  const normalizeSWOTItems = (items: any): Array<{ content: string; confidence?: string }> => {
    if (!items) return []
    if (!Array.isArray(items)) return []
    return items.map((item: any) => {
      if (typeof item === 'string') return { content: item }
      if (typeof item === 'object' && item !== null) {
        return { content: item.content || String(item), confidence: item.confidence }
      }
      return { content: String(item) }
    })
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 lg:px-24 py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-12">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500 mb-4">
            {sectionNumber} — Análise SWOT
          </div>
          <h2 className="text-3xl lg:text-5xl font-medium text-navy-900 tracking-tight mb-4">
            Posicionamento Estratégico
          </h2>
          {swot.summary && (
            <p className="text-lg text-gray-600 max-w-3xl">{swot.summary}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {quadrants.map((q) => {
            const styles = colorStyles[q.color]
            const items = normalizeSWOTItems(q.items)
            const Icon = q.icon

            return (
              <div key={q.key} className={cn('border overflow-hidden', styles.border, styles.bg)}>
                <div className={cn('px-6 py-4 flex items-center gap-3', styles.header)}>
                  <Icon className="w-5 h-5 text-white" />
                  <h3 className="font-bold uppercase tracking-wider text-white text-sm">{q.title}</h3>
                </div>
                <ul className="p-6 space-y-4">
                  {items.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className={cn('font-bold mt-0.5', styles.bullet)}>•</span>
                      <div className="flex-1">
                        <span className="text-gray-700 leading-relaxed">{item.content}</span>
                        {item.confidence && (
                          <span className={cn(
                            'ml-2 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-bold',
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
    </div>
  )
}

function PESTELSection({ pestel, sectionNumber }: { pestel: any; sectionNumber: string }) {
  const factors = [
    { key: 'political', title: 'Político', icon: Globe, items: pestel.political },
    { key: 'economic', title: 'Econômico', icon: DollarSign, items: pestel.economic },
    { key: 'social', title: 'Social', icon: Users, items: pestel.social },
    { key: 'technological', title: 'Tecnológico', icon: Zap, items: pestel.technological },
    { key: 'environmental', title: 'Ambiental', icon: Compass, items: pestel.environmental },
    { key: 'legal', title: 'Legal', icon: Shield, items: pestel.legal },
  ]

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 lg:px-24 py-24">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-12">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500 mb-4">
            {sectionNumber} — Análise PESTEL
          </div>
          <h2 className="text-3xl lg:text-5xl font-medium text-navy-900 tracking-tight mb-4">
            Ambiente Macro
          </h2>
          {pestel.summary && (
            <p className="text-lg text-gray-600 max-w-3xl">{pestel.summary}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {factors.map((factor) => {
            const items = normalizeToArray(factor.items)
            const Icon = factor.icon

            return (
              <div key={factor.key} className="bg-white border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gold-600" />
                  </div>
                  <h3 className="font-bold uppercase tracking-wider text-navy-900 text-sm">
                    {factor.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {items.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-gold-500 mt-1">→</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function PorterSection({ porter, sectionNumber }: { porter: any; sectionNumber: string }) {
  const forces = [
    { key: 'competitive_rivalry', title: 'Rivalidade Competitiva', content: porter.competitive_rivalry || porter.competitiveRivalry, intensity: porter.competitive_rivalry_intensity || porter.competitiveRivalryIntensity },
    { key: 'threat_new_entrants', title: 'Novos Entrantes', content: porter.threat_new_entrants || porter.threatNewEntrants, intensity: porter.threat_new_entrants_intensity || porter.threatNewEntrantsIntensity },
    { key: 'threat_substitutes', title: 'Substitutos', content: porter.threat_substitutes || porter.threatSubstitutes, intensity: porter.threat_substitutes_intensity || porter.threatSubstitutesIntensity },
    { key: 'buyer_power', title: 'Poder dos Compradores', content: porter.buyer_power || porter.buyerPower, intensity: porter.buyer_power_intensity || porter.buyerPowerIntensity },
    { key: 'supplier_power', title: 'Poder dos Fornecedores', content: porter.supplier_power || porter.supplierPower, intensity: porter.supplier_power_intensity || porter.supplierPowerIntensity },
    { key: 'disruption_ai', title: 'Disrupção IA/Dados', content: porter.disruption_ai_data || porter.disruptionAiData, intensity: porter.disruption_ai_data_intensity || porter.disruptionAiDataIntensity },
    { key: 'partnerships', title: 'Parcerias/Ecossistemas', content: porter.power_partnerships_ecosystems || porter.powerPartnershipsEcosystems, intensity: porter.power_partnerships_ecosystems_intensity || porter.powerPartnershipsEcosystemsIntensity },
  ].filter(f => f.content)

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 lg:px-24 py-24 bg-navy-900 text-white">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-12">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500 mb-4">
            {sectionNumber} — 5 Forças de Porter+
          </div>
          <h2 className="text-3xl lg:text-5xl font-medium text-white tracking-tight mb-4">
            Dinâmica Competitiva
          </h2>
          {porter.summary && (
            <p className="text-lg text-gray-300 max-w-3xl">{porter.summary}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {forces.map((force) => (
            <div key={force.key} className="bg-white/5 border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold uppercase tracking-wider text-white text-sm">
                  {force.title}
                </h3>
                {force.intensity && (
                  <span className={cn(
                    'text-[10px] uppercase tracking-wider px-3 py-1 rounded-full font-bold',
                    force.intensity.toLowerCase() === 'alta' ? 'bg-red-500/20 text-red-300' :
                    force.intensity.toLowerCase() === 'média' ? 'bg-amber-500/20 text-amber-300' :
                    'bg-green-500/20 text-green-300'
                  )}>
                    {force.intensity}
                  </span>
                )}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{force.content}</p>
            </div>
          ))}
        </div>

        {porter.strategic_implications?.length > 0 && (
          <div className="mt-12 bg-gold-500/10 border border-gold-500/20 p-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gold-500 mb-6">
              Implicações Estratégicas
            </h3>
            <ul className="grid md:grid-cols-2 gap-4">
              {porter.strategic_implications.map((implication: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <ArrowRight className="w-4 h-4 text-gold-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-200 text-sm leading-relaxed">{implication}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

function TamSamSomSection({ tamSamSom, sectionNumber }: { tamSamSom: any; sectionNumber: string }) {
  const marketSizes = [
    { key: 'tam', label: 'TAM', sublabel: 'Total Addressable Market', value: tamSamSom.tam, color: 'navy' },
    { key: 'sam', label: 'SAM', sublabel: 'Serviceable Addressable Market', value: tamSamSom.sam, color: 'gold' },
    { key: 'som', label: 'SOM', sublabel: 'Serviceable Obtainable Market', value: tamSamSom.som, color: 'green' },
  ]

  const assumptions = normalizeToArray(tamSamSom.assumptions)
  const nextSteps = normalizeToArray(tamSamSom.next_steps || tamSamSom.nextSteps)

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 lg:px-24 py-24">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-12">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500 mb-4">
            {sectionNumber} — TAM SAM SOM
          </div>
          <h2 className="text-3xl lg:text-5xl font-medium text-navy-900 tracking-tight mb-4">
            Dimensionamento de Mercado
          </h2>
          {tamSamSom.summary && (
            <p className="text-lg text-gray-600 max-w-3xl">{tamSamSom.summary}</p>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {marketSizes.map((market, index) => (
            <div
              key={market.key}
              className={cn(
                'relative p-8 border-2 transition-all',
                market.color === 'navy' && 'bg-navy-900 border-navy-800 text-white',
                market.color === 'gold' && 'bg-gold-50 border-gold-300',
                market.color === 'green' && 'bg-green-50 border-green-300'
              )}
            >
              <div className={cn(
                'text-[10px] font-bold uppercase tracking-widest mb-2',
                market.color === 'navy' ? 'text-gold-500' : 'text-gray-500'
              )}>
                {market.sublabel}
              </div>
              <div className={cn(
                'text-4xl lg:text-5xl font-light mb-2',
                market.color === 'navy' ? 'text-white' : 'text-navy-900'
              )}>
                {market.label}
              </div>
              <div className={cn(
                'text-lg font-medium',
                market.color === 'navy' ? 'text-gray-300' : 'text-navy-900'
              )}>
                {market.value || '—'}
              </div>
              <div className={cn(
                'absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold',
                market.color === 'navy' && 'bg-white/10 text-white',
                market.color === 'gold' && 'bg-gold-500 text-white',
                market.color === 'green' && 'bg-green-500 text-white'
              )}>
                {index + 1}
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {tamSamSom.cagr && (
            <div className="bg-white border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-5 h-5 text-gold-500" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900">
                  CAGR Projetado
                </h3>
              </div>
              <div className="text-3xl font-light text-navy-900">{tamSamSom.cagr}</div>
            </div>
          )}

          {tamSamSom.data_quality && (
            <div className="bg-white border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <BarChart className="w-5 h-5 text-gold-500" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900">
                  Qualidade dos Dados
                </h3>
              </div>
              <span className={cn(
                'inline-block px-3 py-1 rounded-full text-sm font-medium',
                tamSamSom.data_quality === 'complete' && 'bg-green-100 text-green-700',
                tamSamSom.data_quality === 'partial' && 'bg-amber-100 text-amber-700',
                tamSamSom.data_quality === 'insufficient' && 'bg-red-100 text-red-700'
              )}>
                {tamSamSom.data_quality === 'complete' ? 'Completo' :
                 tamSamSom.data_quality === 'partial' ? 'Parcial' : 'Insuficiente'}
              </span>
            </div>
          )}
        </div>

        {assumptions.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 p-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900 mb-6">
              Premissas & Metodologia
            </h3>
            <ul className="grid md:grid-cols-2 gap-4">
              {assumptions.map((assumption: string, index: number) => (
                <li key={index} className="flex items-start gap-3 text-gray-700">
                  <span className="text-gold-500 font-bold mt-0.5">→</span>
                  <span className="leading-relaxed">{assumption}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {nextSteps.length > 0 && (
          <div className="mt-6 bg-amber-50 border border-amber-200 p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-800 mb-4">
              Próximos Passos para Validação
            </h3>
            <ul className="space-y-2">
              {nextSteps.map((step: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-sm text-amber-900">
                  <CheckCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

function BenchmarkingSection({ benchmarking, sectionNumber }: { benchmarking: any; sectionNumber: string }) {
  const competitors = normalizeToArray(benchmarking.competitors_analyzed || benchmarking.competitors)
  const gaps = normalizeToArray(benchmarking.performance_gaps || benchmarking.performanceGaps)
  const bestPractices = normalizeToArray(benchmarking.best_practices || benchmarking.bestPractices)

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 lg:px-24 py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-12">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500 mb-4">
            {sectionNumber} — Benchmarking
          </div>
          <h2 className="text-3xl lg:text-5xl font-medium text-navy-900 tracking-tight mb-4">
            Análise Competitiva
          </h2>
          {benchmarking.summary && (
            <p className="text-lg text-gray-600 max-w-3xl">{benchmarking.summary}</p>
          )}
        </div>

        {competitors.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900 mb-4">
              Concorrentes Analisados
            </h3>
            <div className="flex flex-wrap gap-3">
              {competitors.map((competitor: string, index: number) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-navy-900 text-white text-sm font-medium rounded-full"
                >
                  {competitor}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {gaps.length > 0 && (
            <div className="bg-white border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <TrendingDown className="w-5 h-5 text-red-500" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900">
                  Gaps de Performance
                </h3>
              </div>
              <ul className="space-y-4">
                {gaps.map((gap: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="text-gray-700 leading-relaxed">{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {bestPractices.length > 0 && (
            <div className="bg-white border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-5 h-5 text-green-500" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900">
                  Melhores Práticas
                </h3>
              </div>
              <ul className="space-y-4">
                {bestPractices.map((practice: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">
                      ✓
                    </div>
                    <span className="text-gray-700 leading-relaxed">{practice}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function BlueOceanSection({ blueOcean, sectionNumber }: { blueOcean: any; sectionNumber: string }) {
  const quadrants = [
    { key: 'eliminate', title: 'Eliminar', items: blueOcean.eliminate, icon: Minus, color: 'red', description: 'Fatores que a indústria compete mas que devem ser eliminados' },
    { key: 'reduce', title: 'Reduzir', items: blueOcean.reduce, icon: TrendingDown, color: 'amber', description: 'Fatores que devem ser reduzidos abaixo do padrão' },
    { key: 'raise', title: 'Elevar', items: blueOcean.raise, icon: TrendingUp, color: 'blue', description: 'Fatores que devem ser elevados acima do padrão' },
    { key: 'create', title: 'Criar', items: blueOcean.create, icon: Plus, color: 'green', description: 'Fatores que a indústria nunca ofereceu' },
  ]

  const colorStyles: Record<string, { bg: string; border: string; icon: string; badge: string }> = {
    red: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-500', badge: 'bg-red-500' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-500', badge: 'bg-amber-500' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-500', badge: 'bg-blue-500' },
    green: { bg: 'bg-green-50', border: 'border-green-200', icon: 'text-green-500', badge: 'bg-green-500' },
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 lg:px-24 py-24">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-12">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500 mb-4">
            {sectionNumber} — Blue Ocean
          </div>
          <h2 className="text-3xl lg:text-5xl font-medium text-navy-900 tracking-tight mb-4">
            Estratégia do Oceano Azul
          </h2>
          {blueOcean.summary && (
            <p className="text-lg text-gray-600 max-w-3xl">{blueOcean.summary}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {quadrants.map((q) => {
            const styles = colorStyles[q.color]
            const items = normalizeToArray(q.items)
            const Icon = q.icon

            return (
              <div key={q.key} className={cn('border overflow-hidden', styles.border, styles.bg)}>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', styles.badge)}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold uppercase tracking-wider text-navy-900">{q.title}</h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">{q.description}</p>
                  <ul className="space-y-3">
                    {items.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className={cn('font-bold mt-0.5', styles.icon)}>•</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>

        {blueOcean.new_value_curve && (
          <div className="bg-navy-900 text-white p-8 lg:p-12">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-5 h-5 text-gold-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-gold-500">
                Nova Curva de Valor
              </h3>
            </div>
            <p className="text-lg lg:text-xl leading-relaxed text-gray-200">
              {blueOcean.new_value_curve}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function GrowthHackingSection({ growthHacking, sectionNumber }: { growthHacking: any; sectionNumber: string }) {
  const leapLoop = growthHacking.leap_loop || growthHacking.leapLoop || {}
  const scaleLoop = growthHacking.scale_loop || growthHacking.scaleLoop || {}

  const loops = [
    { data: leapLoop, label: 'LEAP Loop', type: 'Aquisição', color: 'blue' },
    { data: scaleLoop, label: 'SCALE Loop', type: 'Monetização', color: 'green' },
  ].filter(l => l.data.steps?.length > 0 || l.data.name)

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 lg:px-24 py-24 bg-navy-900 text-white">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-12">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500 mb-4">
            {sectionNumber} — Growth Hacking
          </div>
          <h2 className="text-3xl lg:text-5xl font-medium text-white tracking-tight mb-4">
            Loops de Crescimento
          </h2>
          {growthHacking.summary && (
            <p className="text-lg text-gray-300 max-w-3xl">{growthHacking.summary}</p>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {loops.map((loop, loopIndex) => {
            const steps = normalizeToArray(loop.data.steps)
            const metrics = normalizeToArray(loop.data.metrics)

            return (
              <div key={loopIndex} className="bg-white/5 border border-white/10 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-white text-lg">{loop.data.name || loop.label}</h3>
                    <span className={cn(
                      'text-xs uppercase tracking-wider px-2 py-1 rounded mt-1 inline-block',
                      loop.color === 'blue' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'
                    )}>
                      {loop.type}
                    </span>
                  </div>
                  <Repeat className="w-8 h-8 text-gold-500" />
                </div>

                {steps.length > 0 && (
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {steps.map((step: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-gold-500 text-navy-900 flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </span>
                          <span className="text-gray-200 text-sm">{step}</span>
                          {index < steps.length - 1 && (
                            <ArrowRight className="w-4 h-4 text-gray-500 mx-1" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {metrics.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                      Métricas-Chave
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {metrics.map((metric: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-white/10 text-gray-200 text-xs rounded-full">
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {loop.data.bottleneck && (
                  <div className="pt-4 border-t border-white/10">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-2">
                      Gargalo Identificado
                    </h4>
                    <p className="text-gray-300 text-sm">{loop.data.bottleneck}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ScenariosSection({ scenarios, sectionNumber }: { scenarios: any; sectionNumber: string }) {
  const scenarioList = [
    { key: 'optimistic', data: scenarios.optimistic, color: 'green', label: 'Otimista' },
    { key: 'realist', data: scenarios.realist, color: 'blue', label: 'Realista' },
    { key: 'pessimistic', data: scenarios.pessimistic, color: 'red', label: 'Pessimista' },
  ].filter(s => s.data)

  const colorStyles: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-900', badge: 'bg-green-500' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', badge: 'bg-blue-500' },
    red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-900', badge: 'bg-red-500' },
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 lg:px-24 py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-12">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500 mb-4">
            {sectionNumber} — Cenários
          </div>
          <h2 className="text-3xl lg:text-5xl font-medium text-navy-900 tracking-tight mb-4">
            Análise de Cenários
          </h2>
          {scenarios.summary && (
            <p className="text-lg text-gray-600 max-w-3xl">{scenarios.summary}</p>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {scenarioList.map((scenario) => {
            const styles = colorStyles[scenario.color]
            const actions = scenario.data.required_actions || scenario.data.requiredActions || []

            return (
              <div key={scenario.key} className={cn('border overflow-hidden', styles.border, styles.bg)}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={cn('font-bold', styles.text)}>{scenario.label}</h3>
                    <span className={cn('text-white text-xs font-bold px-2 py-1 rounded', styles.badge)}>
                      {scenario.data.probability}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {scenario.data.description}
                  </p>

                  {actions.length > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-3">
                        Ações Necessárias
                      </h4>
                      <ul className="space-y-2">
                        {actions.slice(0, 3).map((action: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-xs text-gray-600">
                            <ArrowRight className="w-3 h-3 text-gold-500 mt-0.5 flex-shrink-0" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function OKRsSection({ okrs, sectionNumber }: { okrs: any; sectionNumber: string }) {
  const plan90Days = okrs.plan_90_days || okrs.plan90Days || []
  const quarters = okrs.quarters || []
  const totalInvestment = okrs.total_investment || okrs.totalInvestment
  const successMetrics = normalizeToArray(okrs.success_metrics || okrs.successMetrics)
  const useNewFormat = plan90Days.length > 0

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 lg:px-24 py-24">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-12">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500 mb-4">
            {sectionNumber} — {useNewFormat ? 'Plano 90 Dias' : 'OKRs'}
          </div>
          <h2 className="text-3xl lg:text-5xl font-medium text-navy-900 tracking-tight mb-4">
            {useNewFormat ? 'Plano Estratégico 90 Dias' : 'Objectives & Key Results'}
          </h2>
          {okrs.summary && (
            <p className="text-lg text-gray-600 max-w-3xl">{okrs.summary}</p>
          )}
        </div>

        {useNewFormat && (
          <>
            {totalInvestment && (
              <div className="mb-8 p-6 bg-gold-50 border border-gold-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-gold-800 mb-1">
                      Investimento Total (90 dias)
                    </div>
                    <div className="text-2xl font-light text-navy-900">{totalInvestment}</div>
                  </div>
                  <DollarSign className="w-10 h-10 text-gold-500" />
                </div>
              </div>
            )}

            <div className="space-y-8">
              {plan90Days.map((month: any, index: number) => (
                <div key={index} className="relative">
                  {index < plan90Days.length - 1 && (
                    <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gray-200" />
                  )}

                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold-500 text-white flex items-center justify-center font-bold text-sm z-10">
                      M{index + 1}
                    </div>

                    <div className="flex-1 bg-white border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-navy-900">{month.month}</h3>
                          <span className="px-2 py-1 bg-navy-100 text-navy-800 text-xs font-bold uppercase tracking-wider rounded">
                            {month.focus}
                          </span>
                        </div>
                        {month.investment && (
                          <span className="flex items-center gap-1 text-sm text-gray-500">
                            <DollarSign className="w-4 h-4" />
                            {month.investment}
                          </span>
                        )}
                      </div>

                      <p className="text-navy-900 font-medium mb-4">{month.objective}</p>

                      {(month.key_results || month.keyResults)?.length > 0 && (
                        <div className="bg-gray-50 p-4">
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-3">
                            Key Results
                          </h4>
                          <ul className="space-y-2">
                            {(month.key_results || month.keyResults).map((kr: string, krIndex: number) => (
                              <li key={krIndex} className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                                <span>{kr}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {(month.aligned_recommendation || month.alignedRecommendation) && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <span className="text-xs text-gray-500 italic">
                            Alinhado com: {month.aligned_recommendation || month.alignedRecommendation}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {successMetrics.length > 0 && (
              <div className="mt-8 bg-navy-900 text-white p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-5 h-5 text-gold-500" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gold-500">
                    Métricas de Sucesso (90 dias)
                  </h3>
                </div>
                <ul className="grid md:grid-cols-3 gap-4">
                  {successMetrics.map((metric: string, index: number) => (
                    <li key={index} className="flex items-center gap-2 text-gray-200 text-sm">
                      <CheckCircle className="w-4 h-4 text-gold-500 flex-shrink-0" />
                      <span>{metric}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {!useNewFormat && quarters.length > 0 && (
          <div className="space-y-8">
            {quarters.map((quarter: any, index: number) => (
              <div key={index} className="relative">
                {index < quarters.length - 1 && (
                  <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gray-200" />
                )}

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold-500 text-white flex items-center justify-center font-bold text-sm z-10">
                    Q{quarter.quarter?.match(/Q?(\d+)/)?.[1] || index + 1}
                  </div>

                  <div className="flex-1 bg-white border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-navy-900">{quarter.quarter}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {quarter.timeline}
                        </span>
                        {quarter.investment && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {quarter.investment}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-navy-900 font-medium mb-4">{quarter.objective}</p>

                    {(quarter.key_results || quarter.keyResults)?.length > 0 && (
                      <div className="bg-gray-50 p-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-3">
                          Key Results
                        </h4>
                        <ul className="space-y-2">
                          {(quarter.key_results || quarter.keyResults).map((kr: string, krIndex: number) => (
                            <li key={krIndex} className="flex items-start gap-2 text-sm text-gray-700">
                              <CheckCircle className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                              <span>{kr}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function BSCSection({ bsc, sectionNumber }: { bsc: any; sectionNumber: string }) {
  const perspectives = [
    { key: 'financial', title: 'Financeira', items: bsc.financial, icon: DollarSign, color: 'green' },
    { key: 'customer', title: 'Cliente', items: bsc.customer, icon: Users, color: 'blue' },
    { key: 'internal', title: 'Processos Internos', items: bsc.internal_processes || bsc.internal, icon: Building2, color: 'amber' },
    { key: 'learning', title: 'Aprendizado & Crescimento', items: bsc.learning_growth || bsc.learningGrowth, icon: GraduationCap, color: 'purple' },
  ]

  const colorStyles: Record<string, { bg: string; border: string; icon: string; header: string }> = {
    green: { bg: 'bg-green-50', border: 'border-green-200', icon: 'text-green-600', header: 'bg-green-600' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600', header: 'bg-blue-600' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-600', header: 'bg-amber-600' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'text-purple-600', header: 'bg-purple-600' },
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 lg:px-24 py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-12">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500 mb-4">
            {sectionNumber} — BSC
          </div>
          <h2 className="text-3xl lg:text-5xl font-medium text-navy-900 tracking-tight mb-4">
            Balanced Scorecard
          </h2>
          {bsc.summary && (
            <p className="text-lg text-gray-600 max-w-3xl">{bsc.summary}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {perspectives.map((p) => {
            const styles = colorStyles[p.color]
            const items = normalizeToArray(p.items)
            const Icon = p.icon

            return (
              <div key={p.key} className={cn('border overflow-hidden', styles.border, styles.bg)}>
                <div className={cn('px-6 py-4 flex items-center gap-3', styles.header)}>
                  <Icon className="w-5 h-5 text-white" />
                  <h3 className="font-bold uppercase tracking-wider text-white text-sm">{p.title}</h3>
                </div>
                <ul className="p-6 space-y-3">
                  {items.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className={cn('w-4 h-4 mt-0.5 flex-shrink-0', styles.icon)} />
                      <span className="text-gray-700 leading-relaxed text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function DecisionMatrixSection({ matrix, sectionNumber }: { matrix: any; sectionNumber: string }) {
  const recommendations = matrix.priority_recommendations || matrix.priorityRecommendations || []

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 lg:px-24 py-24">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-12">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500 mb-4">
            {sectionNumber} — Matriz de Decisão
          </div>
          <h2 className="text-3xl lg:text-5xl font-medium text-navy-900 tracking-tight mb-4">
            Recomendações Prioritárias
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1 bg-navy-900 text-white p-8 flex flex-col justify-center">
            <div className="text-[10px] font-bold uppercase tracking-widest text-gold-500 mb-2">
              Score Final
            </div>
            <div className="text-5xl font-light text-gold-500 mb-4">{matrix.score}</div>
            <div className="text-sm text-gray-400">{matrix.score_comparison}</div>
          </div>

          <div className="lg:col-span-2 bg-gold-50 border border-gold-200 p-8">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-5 h-5 text-gold-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-gold-800">
                Opção Recomendada
              </h3>
            </div>
            <p className="text-navy-900 text-lg font-medium mb-4">
              {matrix.recommended_option || matrix.recommendedOption}
            </p>
            <p className="text-gray-600 leading-relaxed">
              {matrix.final_recommendation || matrix.finalRecommendation}
            </p>
          </div>
        </div>

        {recommendations.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">
              Plano de Ação
            </h3>
            {recommendations.map((rec: any, index: number) => (
              <div key={index} className="bg-white border border-gray-200 p-6 flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-navy-900 text-white flex items-center justify-center font-bold">
                  {rec.priority}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-navy-900 mb-2">{rec.title}</h4>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{rec.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center gap-2 text-gray-500">
                      <Clock className="w-4 h-4" />
                      {rec.timeline}
                    </span>
                    <span className="flex items-center gap-2 text-gray-500">
                      <DollarSign className="w-4 h-4" />
                      {rec.budget}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// UTILITIES
// ============================================

function normalizeSynthesis(raw: any) {
  return {
    executiveSummary: raw.executiveSummary || raw.executive_summary,
    keyFindings: raw.keyFindings || raw.key_findings,
    strategicPriorities: raw.strategicPriorities || raw.strategic_priorities,
    overallRecommendation: raw.overallRecommendation || raw.overall_recommendation,
    roadmap: raw.roadmap,
    centralChallenge: raw.centralChallenge || raw.central_challenge,
    mainFindings: raw.mainFindings || raw.main_findings,
    importantNotes: raw.importantNotes || raw.important_notes,
  }
}

function normalizeAnalysis(raw: any) {
  // Normalize benchmarking
  const benchmarking = raw.benchmarking
  if (benchmarking) {
    benchmarking.competitors = benchmarking.competitors_analyzed || benchmarking.competitors || []
    benchmarking.performanceGaps = benchmarking.performance_gaps || benchmarking.performanceGaps || []
    benchmarking.bestPractices = benchmarking.best_practices || benchmarking.bestPractices || []
  }

  // Normalize growth hacking
  const growthHacking = raw.growthHacking || raw.growth_hacking
  if (growthHacking) {
    growthHacking.leapLoop = growthHacking.leap_loop || growthHacking.leapLoop
    growthHacking.scaleLoop = growthHacking.scale_loop || growthHacking.scaleLoop
  }

  // Normalize BSC
  const bsc = raw.bsc
  if (bsc) {
    bsc.internalProcesses = bsc.internal_processes || bsc.internalProcesses || bsc.internal || []
    bsc.learningGrowth = bsc.learning_growth || bsc.learningGrowth || []
  }

  return {
    pestel: raw.pestel,
    porter: raw.porter,
    swot: raw.swot,
    tamSamSom: raw.tamSamSom || raw.tam_sam_som,
    benchmarking: benchmarking,
    blueOcean: raw.blueOcean || raw.blue_ocean,
    growthHacking: growthHacking,
    scenarios: raw.scenarios,
    okrs: raw.okrs,
    bsc: bsc,
    decisionMatrix: raw.decisionMatrix || raw.decision_matrix,
  }
}

function buildSections(synthesis: any, analysis: any, isBlurred: boolean = true) {
  const sections: { id: string; title: string; variant?: 'dark' | 'light'; component: React.ReactNode }[] = [
    { id: 'hero', title: 'Início', component: null },
  ]

  let sectionNum = 1

  // 01 - Synthesis (FREE)
  if (synthesis.executiveSummary || synthesis.keyFindings?.length > 0) {
    const num = String(sectionNum++).padStart(2, '0')
    sections.push({
      id: 'synthesis',
      title: 'Sumário Executivo',
      component: <SynthesisSection synthesis={synthesis} sectionNumber={num} />,
    })
  }

  // 02 - SWOT (FREE)
  if (analysis.swot) {
    const num = String(sectionNum++).padStart(2, '0')
    sections.push({
      id: 'swot',
      title: 'SWOT',
      component: <SWOTSection swot={analysis.swot} sectionNumber={num} />,
    })
  }

  // 03 - PESTEL
  if (analysis.pestel) {
    const num = String(sectionNum++).padStart(2, '0')
    sections.push({
      id: 'pestel',
      title: 'PESTEL',
      component: (
        <PremiumBlurOverlay isBlurred={isBlurred}>
          <PESTELSection pestel={analysis.pestel} sectionNumber={num} />
        </PremiumBlurOverlay>
      ),
    })
  }

  // 04 - Porter (dark)
  if (analysis.porter) {
    const num = String(sectionNum++).padStart(2, '0')
    sections.push({
      id: 'porter',
      title: 'Porter',
      variant: 'dark',
      component: (
        <PremiumBlurOverlay isBlurred={isBlurred} isDark>
          <PorterSection porter={analysis.porter} sectionNumber={num} />
        </PremiumBlurOverlay>
      ),
    })
  }

  // 05 - TAM SAM SOM (FREE)
  if (analysis.tamSamSom?.tam || analysis.tamSamSom?.sam || analysis.tamSamSom?.som) {
    const num = String(sectionNum++).padStart(2, '0')
    sections.push({
      id: 'tam-sam-som',
      title: 'TAM SAM SOM',
      component: <TamSamSomSection tamSamSom={analysis.tamSamSom} sectionNumber={num} />,
    })
  }

  // 06 - Benchmarking
  if (analysis.benchmarking?.competitors?.length > 0 || analysis.benchmarking?.performance_gaps?.length > 0) {
    const num = String(sectionNum++).padStart(2, '0')
    sections.push({
      id: 'benchmarking',
      title: 'Benchmarking',
      component: (
        <PremiumBlurOverlay isBlurred={isBlurred}>
          <BenchmarkingSection benchmarking={analysis.benchmarking} sectionNumber={num} />
        </PremiumBlurOverlay>
      ),
    })
  }

  // 07 - Blue Ocean
  if (analysis.blueOcean?.eliminate?.length > 0 || analysis.blueOcean?.create?.length > 0) {
    const num = String(sectionNum++).padStart(2, '0')
    sections.push({
      id: 'blue-ocean',
      title: 'Blue Ocean',
      component: (
        <PremiumBlurOverlay isBlurred={isBlurred}>
          <BlueOceanSection blueOcean={analysis.blueOcean} sectionNumber={num} />
        </PremiumBlurOverlay>
      ),
    })
  }

  // 08 - Growth Hacking (dark)
  if (analysis.growthHacking?.leap_loop || analysis.growthHacking?.scale_loop) {
    const num = String(sectionNum++).padStart(2, '0')
    sections.push({
      id: 'growth-hacking',
      title: 'Growth Hacking',
      variant: 'dark',
      component: (
        <PremiumBlurOverlay isBlurred={isBlurred} isDark>
          <GrowthHackingSection growthHacking={analysis.growthHacking} sectionNumber={num} />
        </PremiumBlurOverlay>
      ),
    })
  }

  // 09 - Scenarios
  if (analysis.scenarios) {
    const num = String(sectionNum++).padStart(2, '0')
    sections.push({
      id: 'scenarios',
      title: 'Cenários',
      component: (
        <PremiumBlurOverlay isBlurred={isBlurred}>
          <ScenariosSection scenarios={analysis.scenarios} sectionNumber={num} />
        </PremiumBlurOverlay>
      ),
    })
  }

  // 10 - OKRs
  const hasPlan90Days = (analysis.okrs?.plan_90_days?.length > 0 || analysis.okrs?.plan90Days?.length > 0)
  const hasQuarters = analysis.okrs?.quarters?.length > 0
  if (hasPlan90Days || hasQuarters) {
    const num = String(sectionNum++).padStart(2, '0')
    sections.push({
      id: 'okrs',
      title: hasPlan90Days ? 'Plano 90 Dias' : 'OKRs',
      component: (
        <PremiumBlurOverlay isBlurred={isBlurred}>
          <OKRsSection okrs={analysis.okrs} sectionNumber={num} />
        </PremiumBlurOverlay>
      ),
    })
  }

  // 11 - BSC
  if (analysis.bsc?.financial?.length > 0 || analysis.bsc?.customer?.length > 0) {
    const num = String(sectionNum++).padStart(2, '0')
    sections.push({
      id: 'bsc',
      title: 'BSC',
      component: (
        <PremiumBlurOverlay isBlurred={isBlurred}>
          <BSCSection bsc={analysis.bsc} sectionNumber={num} />
        </PremiumBlurOverlay>
      ),
    })
  }

  // 12 - Decision Matrix
  if (analysis.decisionMatrix) {
    const num = String(sectionNum++).padStart(2, '0')
    sections.push({
      id: 'decision',
      title: 'Decisão',
      component: (
        <PremiumBlurOverlay isBlurred={isBlurred}>
          <DecisionMatrixSection matrix={analysis.decisionMatrix} sectionNumber={num} />
        </PremiumBlurOverlay>
      ),
    })
  }

  return sections
}
