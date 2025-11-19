'use client';

import { Quote } from 'lucide-react';

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Felipe Figueira",
      role: "Coordenador Geral das Comissões Temáticas",
      company: "Board Academy",
      quote: "Renato alia expertise em conselhos com IA estratégica — impulsionando o futuro da governança das empresas com clareza e impacto. Recomendo."
    },
    {
      name: "Rodolfo Villela Marino",
      role: "Presidente",
      company: "Associação Despertar",
      quote: "Renato combina profunda experiência com IA aplicada à estratégia — transformando decisões da Associação Despertar. Clareza, ritmo e resultados. Recomendo com convicção."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        {/* Title */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            💬 Depoimentos
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card text-card-foreground rounded-xl shadow-medium p-6 md:p-8 hover:shadow-strong transition-shadow duration-300"
            >
              <Quote className="w-8 h-8 md:w-10 md:h-10 text-accent mb-4" />
              <p className="text-base md:text-lg text-foreground mb-6 italic leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="border-t border-border pt-4">
                <p className="font-bold text-primary text-lg">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground mt-1">{testimonial.role}</p>
                <p className="text-sm text-muted-foreground">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
