import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="grid lg:grid-cols-12 min-h-[calc(100vh-4rem)] border-b border-line">
      {/* Left: The Promise */}
      <div className="lg:col-span-7 p-8 lg:p-24 flex flex-col justify-center lg:border-r border-line relative bg-white/50">
        <div className="absolute top-8 left-8 lg:top-12 lg:left-12">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-gold-500">
            Inteligência Estratégica
          </span>
        </div>

        <h1 className="mt-12 lg:mt-0 mb-6 text-4xl lg:text-5xl xl:text-6xl font-medium text-navy-900 leading-tight">
          Torne sua empresa <br />
          <span className="text-gold-500 italic">imensa</span> com IA + IH.
        </h1>

        <p className="text-lg text-muted-foreground max-w-lg mb-8">
          Unimos a velocidade da Inteligência Artificial com a sabedoria da
          Inteligência Humana. Transformamos dados em decisões estratégicas em
          48 horas.
        </p>

        <div className="flex flex-wrap gap-4 mb-8">
          <Button asChild size="lg">
            <a href="#diagnostico">
              Iniciar Análise
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>

        <div className="flex flex-wrap gap-3">
          {['Diagnóstico em 48h', 'Validação Humana', 'Segurança Enterprise'].map(
            (badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-2 px-3 py-1 bg-navy-900/5 text-navy-900 text-xs font-medium rounded-full"
              >
                <CheckCircle2 className="w-3 h-3" />
                {badge}
              </span>
            )
          )}
        </div>
      </div>

      {/* Right: The Metrics Visual */}
      <div className="lg:col-span-5 bg-navy-900 text-white flex flex-col relative overflow-hidden">
        {/* Decorative Background Grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Top Statistic */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 border-b border-white/10 relative z-10">
          <span className="text-7xl lg:text-8xl font-bold text-gold-500">11</span>
          <span className="text-sm uppercase tracking-[0.2em] text-white/70 mt-2">
            Frameworks de Análise
          </span>
        </div>

        {/* Bottom Statistic */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gold-500/10 relative z-10">
          <span className="text-7xl lg:text-8xl font-bold text-gold-500">48h</span>
          <span className="text-sm uppercase tracking-[0.2em] text-white/70 mt-2">
            Tempo de Entrega
          </span>
        </div>
      </div>
    </section>
  )
}
