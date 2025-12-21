import { Quote } from 'lucide-react'

const testimonials = [
  {
    quote:
      'Renato combina profunda experiência com IA aplicada à estratégia — transformando decisões da Associação Despertar. Clareza, ritmo e resultados. Recomendo com convicção.',
    author: 'Rodolfo Villela Marino',
    role: 'Co-CEO & Diretor Executivo, Itaúsa',
    company: 'Presidente, Associação Comunitária Despertar',
  },
  {
    quote:
      'Com uma leitura precisa sobre o caos do ambiente de negócios atual e um domínio avançado do uso da Inteligência Artificial como alavanca de transformação, Renato tem a capacidade rara de transformar ameaças em oportunidades concretas. Sua presença acrescenta profundidade estratégica, clareza e provocação intelectual a qualquer conselho que busque inovação, resiliência e visão de longo prazo.',
    author: 'Farias Souza',
    role: 'CEO',
    company: 'Board Academy',
  },
  {
    quote:
      'O conceito de NeoGovernança que Renato propõe me motivou a convidá-lo para ser Diretor de Governança e implementar um conselho consultivo na Federação Assespro-SP. Juntos estamos trabalhando na visão de longo prazo com governança voltada para o futuro.',
    author: 'Marco Carvalho',
    role: 'Presidente do Conselho Consultivo',
    company: 'Federação ASSESPRO-SP',
  },
  {
    quote:
      'Renato alia expertise em conselhos com IA estratégica — impulsionando o futuro da governança das empresas com clareza e impacto. Recomendo.',
    author: 'Felipe Figueira',
    role: 'Coordenador das Comissões Temáticas',
    company: 'Board Academy',
  },
  {
    quote:
      'Renato está com a Vallen desde a construção de nosso planejamento estratégico 2025. Sua contribuição no conselho, para a manutenção do propósito e governança são sempre valiosas, baseadas em sua experiência e enriquecidas com o uso de inteligência artificial.',
    author: 'Thalita Mendes',
    role: 'Fundadora',
    company: 'Vallen Clinic',
  },
  {
    quote:
      'O aconselhamento do Renato foi fundamental para expandir a Autonomia do Movimento no mercado fitness. Suas orientações sobre o uso estratégico de IA me ajudaram a estruturar soluções inovadoras trazendo clareza e direção para o crescimento do negócio.',
    author: 'Gui Cintra',
    role: 'Fundador',
    company: 'Autonomia do Movimento',
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-surface-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-gold-500 mb-4 block">
            Quem confia na IMENSIAH
          </span>
          <h2 className="text-3xl lg:text-4xl font-medium text-navy-900">
            Empresas que já transformaram suas decisões estratégicas
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 border border-line relative"
            >
              <Quote className="absolute top-8 right-8 w-8 h-8 text-gold-500/20" />
              <p className="text-lg text-navy-900 mb-6 italic">
                {testimonial.quote}
              </p>
              <div className="border-t border-line pt-6">
                <p className="font-semibold text-navy-900">
                  {testimonial.author}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role}
                </p>
                <p className="text-sm text-gold-500">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
