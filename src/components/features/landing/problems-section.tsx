const problemCards = [
  {
    title: 'Decisões Reativas',
    desc: 'Sem dados em tempo real, a estratégia se torna apenas uma resposta a crises, nunca uma antecipação de oportunidades.',
  },
  {
    title: 'Priorização Deficiente',
    desc: 'Recursos escassos são diluídos em iniciativas de baixo impacto por falta de clareza sobre o que realmente move o ponteiro.',
  },
  {
    title: 'Cegueira Competitiva',
    desc: 'Enquanto você olha para dentro, o mercado muda lá fora. A falta de inteligência de mercado cria vulnerabilidades fatais.',
  },
]

export function ProblemsSection() {
  return (
    <section className="py-24 bg-surface-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-medium text-navy-900 mb-4">
            O Custo da Cegueira Estratégica
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Em um mercado volátil, decisões lentas são decisões ruins. PMEs e
            empresas Mid-Market enfrentam desafios estruturais invisíveis até que
            seja tarde demais.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {problemCards.map((card, index) => (
            <div
              key={index}
              className="p-6 lg:p-8 border border-line bg-white hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-navy-900 mb-3">
                {card.title}
              </h3>
              <p className="text-sm text-muted-foreground">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
