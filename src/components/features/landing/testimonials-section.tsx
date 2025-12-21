const testimonials = [
  {
    quote:
      'Renato combina profunda experiência com IA aplicada à estratégia — transformando decisões da Associação Despertar. Clareza, ritmo e resultados.',
    author: 'Rodolfo Villela Marino',
    role: 'Co-CEO & Diretor Executivo, Itaúsa',
  },
  {
    quote:
      'Com uma leitura precisa sobre o caos do ambiente de negócios atual e um domínio avançado do uso da Inteligência Artificial como alavanca de transformação, Renato tem a capacidade rara de transformar ameaças em oportunidades concretas.',
    author: 'Farias Souza',
    role: 'CEO, Board Academy',
  },
  {
    quote:
      'Renato está com a Vallen desde a construção de nosso planejamento estratégico 2025. Sua contribuição para a manutenção do propósito e governança são sempre valiosas.',
    author: 'Thalita Mendes',
    role: 'Fundadora, Vallen Clinic',
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-24 bg-surface-paper border-t border-line">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-gold-500 mb-12 block">
          Quem confia
        </span>

        <div className="space-y-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="border-l-2 border-gold-500/30 pl-6 lg:pl-8"
            >
              <p className="text-lg lg:text-xl text-navy-900 mb-4 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-navy-900">
                  {testimonial.author}
                </span>
                {' · '}
                {testimonial.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
