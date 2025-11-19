'use client';

import { Card, CardContent } from '@/components/ui/card';
import { FileText, Brain, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    title: 'Você Envia os Dados',
    description: 'Preencha o formulário com informações da sua empresa. Quanto mais dados, melhor a análise.',
    details: ['Website e informações básicas', 'Redes sociais (opcional)', 'Contexto do desafio'],
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Brain,
    title: 'IA Coleta e Analisa',
    description: 'Nossa IA busca dados públicos de 15+ fontes e processa tudo em minutos.',
    details: ['Análise de website e SEO', 'Dados de redes sociais', 'Informações públicas do Brasil'],
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    icon: CheckCircle2,
    title: 'Humano Revisa e Entrega',
    description: 'Analista experiente revisa, enriquece e entrega insights práticos em 24h.',
    details: ['Revisão humana completa', 'Insights estratégicos', 'Relatório PDF + Dashboard'],
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Como Funciona
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Processo simples e transparente que combina o melhor da tecnologia com experiência humana
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card
                key={index}
                className="relative overflow-hidden hover:shadow-strong transition-all duration-300 group bg-card text-card-foreground"
              >
                {/* Step number */}
                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  {index + 1}
                </div>

                <CardContent className="pt-8 pb-8">
                  <div className="space-y-4">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-lg ${step.bgColor} flex items-center justify-center mb-4`}>
                      <Icon className={`w-8 h-8 ${step.color}`} />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-bold text-foreground">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>

                    {/* Details list */}
                    <ul className="space-y-2 pt-4">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                          <div className={`w-1.5 h-1.5 rounded-full ${step.color.replace('text', 'bg')} mt-2 flex-shrink-0`} />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>

                {/* Bottom accent */}
                <div className={`h-1 ${step.color.replace('text', 'bg')}`} />
              </Card>
            );
          })}
        </div>

        {/* Timeline connector for desktop */}
        <div className="hidden lg:block relative -mt-[22rem] max-w-6xl mx-auto px-8 pointer-events-none">
          <div className="flex justify-between">
            <div className="w-1/3" />
            <div className="w-1/3 flex justify-center">
              <svg className="h-8" viewBox="0 0 200 40" fill="none">
                <path
                  d="M 0 20 L 200 20"
                  stroke="hsl(var(--border))"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              </svg>
            </div>
            <div className="w-1/3 flex justify-center">
              <svg className="h-8" viewBox="0 0 200 40" fill="none">
                <path
                  d="M 0 20 L 200 20"
                  stroke="hsl(var(--border))"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-12 md:mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 md:p-8">
            <div className="text-sm md:text-base text-muted-foreground mb-2">Tempo Total</div>
            <div className="text-4xl md:text-5xl font-bold text-foreground">24 Horas</div>
            <div className="text-sm md:text-base text-muted-foreground mt-2">Da submissão até a entrega</div>
          </div>
        </div>
      </div>
    </section>
  );
}
