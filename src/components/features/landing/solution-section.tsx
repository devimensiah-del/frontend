import { CheckCircle2, Layers, Shield, Zap, Users } from 'lucide-react'

const solutionFeatures = [
  'Modelos de IA Generativa Avançados',
  'Frameworks Clássicos de Gestão (Porter, SWOT, PESTEL)',
  'Validação por Especialistas Humanos (Human-in-the-loop)',
  'Insights Estratégicos Acionáveis em 48h',
]

const solutionCards = [
  {
    icon: Layers,
    title: 'Frameworks',
    value: '11+',
    desc: 'Análise multidimensional automática.',
  },
  {
    icon: Shield,
    title: 'Nível Enterprise',
    value: '',
    desc: 'Segurança e compliance corporativo.',
  },
  {
    icon: Zap,
    title: 'Velocidade',
    value: '',
    desc: 'De semanas para 48 horas.',
  },
  {
    icon: Users,
    title: 'IA + Humano',
    value: '',
    desc: 'O melhor dos dois mundos.',
  },
]

export function SolutionSection() {
  return (
    <section id="metodologia" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-gold-500 mb-4 block">
              A SOLUÇÃO
            </span>
            <h2 className="text-3xl lg:text-4xl font-medium text-navy-900 mb-4">
              Um Sistema de Decisão Estratégica
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Não apenas analytics. Não apenas IA. Um sistema operacional
              completo para decisões de alto nível.
            </p>

            <ul className="space-y-3">
              {solutionFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-navy-900/5 border border-line p-12 rounded-lg">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gold-500/20 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <h4 className="font-medium text-navy-900">
                    Política Zero-Training
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Seus dados nunca são usados para treinar modelos públicos.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gold-500/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <h4 className="font-medium text-navy-900">Human-in-the-Loop</h4>
                  <p className="text-sm text-muted-foreground">
                    Validação humana é firewall contra alucinações e riscos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutionCards.map((card, index) => {
            const Icon = card.icon
            return (
              <div
                key={index}
                className="p-6 border border-line bg-white hover:shadow-lg transition-shadow text-center"
              >
                <div className="text-gold-500 mb-4 flex justify-center">
                  <Icon className="w-8 h-8" />
                </div>
                {card.value && (
                  <div className="text-3xl font-bold text-navy-900 mb-2">
                    {card.value}
                  </div>
                )}
                <h4 className="font-semibold text-navy-900 mb-2">{card.title}</h4>
                <p className="text-sm text-muted-foreground">{card.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
