import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="grid lg:grid-cols-12 min-h-[calc(100vh-4rem)] border-b border-line">
      {/* Left: The Promise */}
      <div className="lg:col-span-7 p-8 lg:p-16 xl:p-24 flex flex-col justify-center lg:border-r border-line bg-white/50">
        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-medium text-navy-900 leading-tight mb-6">
          Tome decisões estratégicas difíceis
          <br />
          com <span className="text-gold-500 italic">clareza</span>.
        </h1>

        <p className="text-lg lg:text-xl text-muted-foreground max-w-xl mb-8">
          A ImensIAH ajuda líderes de PMEs a decidir melhor quando há risco
          real, pouco tempo e mais de um caminho possível.
        </p>

        <div>
          <Button asChild size="lg">
            <a href="#diagnostico">
              Experimente agora
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      {/* Right: Velocidade + Sabedoria */}
      <div className="lg:col-span-5 flex flex-col relative overflow-hidden">
        {/* Velocidade - dark bg, white text */}
        <div className="flex-1 flex flex-col justify-end p-8 lg:p-12 bg-navy-900 relative">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          <div className="relative z-10">
            <span className="text-sm uppercase tracking-[0.2em] text-white/40 block mb-2">
              inteligência artificial
            </span>
            <span className="text-4xl lg:text-5xl xl:text-6xl font-medium text-white">
              Velocidade
            </span>
          </div>
        </div>

        {/* Sabedoria - gold bg, dark text */}
        <div className="flex-1 flex flex-col justify-end p-8 lg:p-12 bg-gold-500">
          <span className="text-sm uppercase tracking-[0.2em] text-navy-900/50 block mb-2">
            experiência humana
          </span>
          <span className="text-4xl lg:text-5xl xl:text-6xl font-medium text-navy-900">
            Sabedoria
          </span>
        </div>
      </div>
    </section>
  )
}
