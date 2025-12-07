const processSteps = [
  {
    num: '01',
    title: 'Ingestão',
    desc: 'Compartilhe links e documentos. Nossa IA enriquece e estrutura os dados automaticamente.',
  },
  {
    num: '02',
    title: 'Processamento Híbrido',
    desc: 'Algoritmos aplicam Porter e PESTEL. Consultores seniores validam a intuição estratégica.',
  },
  {
    num: '03',
    title: 'Decisão',
    desc: 'Receba um relatório executivo pragmático. Insights claros, prontos para o conselho.',
  },
]

export function ProcessSection() {
  return (
    <section id="processo" className="grid lg:grid-cols-3 border-b border-line">
      {processSteps.map((step, i) => (
        <div
          key={i}
          className="p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-line last:border-b-0 last:lg:border-r-0 hover:bg-gold-500/5 transition-colors"
        >
          <span className="text-6xl font-bold text-gold-500/20">{step.num}</span>
          <h3 className="text-xl font-semibold text-navy-900 mt-4 mb-3">
            {step.title}
          </h3>
          <p className="text-muted-foreground">{step.desc}</p>
        </div>
      ))}
    </section>
  )
}
