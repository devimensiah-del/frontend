export function DeliverablesSection() {
  return (
    <section className="py-20 lg:py-32 bg-surface-paper">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-gold-500 mb-8 block">
          O que entregamos
        </span>

        <div className="space-y-6 mb-12">
          <p className="text-2xl lg:text-3xl font-medium text-navy-900 leading-snug">
            Clareza em horas, não semanas.
          </p>
          <p className="text-2xl lg:text-3xl font-medium text-navy-900 leading-snug">
            Alternativas reais, com trade-offs explícitos.
          </p>
          <p className="text-2xl lg:text-3xl font-medium text-navy-900 leading-snug">
            Uma síntese direta, pronta para decidir e defender.
          </p>
        </div>

        <div className="w-12 h-px bg-navy-900/20 mb-8" />

        <div className="space-y-1">
          <p className="text-base text-muted-foreground">Sem relatórios longos.</p>
          <p className="text-base text-muted-foreground">Sem jargão.</p>
          <p className="text-base text-muted-foreground">Sem enrolação.</p>
        </div>
      </div>
    </section>
  )
}
