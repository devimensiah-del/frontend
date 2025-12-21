const processSteps = [
  {
    num: '1',
    title: 'Contexto essencial',
    desc: 'Analisamos apenas o que realmente influencia a decisão.',
  },
  {
    num: '2',
    title: 'Opções claras',
    desc: 'Colocamos os caminhos possíveis lado a lado, com riscos e implicações.',
  },
  {
    num: '3',
    title: 'Síntese para decidir',
    desc: 'Você recebe um raciocínio estruturado, utilizável e responsável.',
  },
]

export function ProcessSection() {
  return (
    <section id="processo" className="border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-8">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-gold-500 mb-8 block lg:hidden">
          Como funciona
        </span>
      </div>
      <div className="grid lg:grid-cols-3">
        {processSteps.map((step, i) => (
          <div
            key={i}
            className="p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-line last:border-b-0 last:lg:border-r-0 group"
          >
            <span className="text-5xl lg:text-6xl font-bold text-gold-500/20 group-hover:text-gold-500/30 transition-colors">
              {step.num}
            </span>
            <h3 className="text-xl font-medium text-navy-900 mt-4 mb-3">
              {step.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
