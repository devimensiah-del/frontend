const futureIntegrations = [
  'Integração DRE',
  'Fluxo de Caixa',
  'Performance Comercial',
  'Mix de Clientes',
]

const phases = [
  { phase: 'Fase 1', title: 'Diagnóstico Estratégico (Atual)', current: true },
  { phase: 'Fase 2', title: 'Inteligência Operacional', current: false },
  { phase: 'Fase 3', title: 'Estratégia Contínua', current: false },
  { phase: 'Fase 4', title: 'Plataforma de Gestão (SaaS Full)', current: false },
]

export function RoadmapSection() {
  return (
    <section id="roadmap" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-gold-500 mb-6 block">
            EM BREVE
          </span>

          <div className="flex flex-wrap gap-3 mb-8">
            {futureIntegrations.map((integration, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-navy-900/5 text-navy-900 text-sm font-medium rounded-full"
              >
                {integration}
              </span>
            ))}
          </div>

          <h2 className="text-3xl lg:text-4xl font-medium text-navy-900 mb-4">
            O Futuro: Sistema Operacional Estratégico
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Estamos construindo o &ldquo;Executive Decision Engine&rdquo; definitivo. Com a
            integração de seus dados internos (DRE, CRM, ERP), o ImensIAH evolui
            de um diagnóstico pontual para um sistema operacional contínuo.
          </p>
          <p className="text-gold-500 font-medium text-lg mb-8">
            Previsão de CFO + Clareza de CEO.
          </p>

          {/* Roadmap Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-12">
            {phases.map((item, index) => (
              <div
                key={index}
                className={`p-4 border ${
                  item.current
                    ? 'border-gold-500 bg-gold-500/5'
                    : 'border-line'
                }`}
              >
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-gold-500 mb-2">
                  {item.phase}
                </p>
                <h4 className="text-sm font-semibold text-navy-900 leading-snug">
                  {item.title}
                </h4>
                {item.current && (
                  <div className="mt-3 pt-3 border-t border-gold-500/30">
                    <span className="text-xs uppercase tracking-[0.15em] text-gold-500">
                      Atual
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
