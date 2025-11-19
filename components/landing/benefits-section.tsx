'use client';

import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import {
  Zap,
  Shield,
  TrendingUp,
  Users,
  Database,
  FileCheck
} from 'lucide-react';

const benefits = [
  {
    icon: Zap,
    title: 'Rápido e Eficiente',
    description: 'Receba insights completos em 24h. Economia de semanas de pesquisa manual.',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    icon: Shield,
    title: 'Dados Públicos Seguros',
    description: 'Utilizamos apenas fontes públicas e legais. Transparência total no processo.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: TrendingUp,
    title: 'Insights Acionáveis',
    description: 'Não apenas dados brutos. Análise estratégica com recomendações práticas.',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    icon: Users,
    title: 'Revisão Humana',
    description: 'IA coleta dados, humano analisa e entrega. O melhor dos dois mundos.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Database,
    title: '15+ Fontes de Dados',
    description: 'Website, redes sociais, LinkedIn, dados públicos do Brasil e muito mais.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: FileCheck,
    title: 'Garantia de Qualidade',
    description: '7 dias de garantia. Se não ficar satisfeito, devolvemos seu dinheiro.',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
];

export function BenefitsSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/20">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            💼 O que está incluído no seu relatório
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Solução completa que combina tecnologia de ponta com análise humana especializada
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card
                key={index}
                className="p-6 h-full bg-card text-card-foreground hover:shadow-medium transition-all duration-300 border-2 hover:border-accent"
              >
                <CardContent className="pt-6 pb-6">
                  <div className="space-y-4">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl ${benefit.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-7 h-7 ${benefit.color}`} />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-foreground">
                      {benefit.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {benefit.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Social proof section */}
        <div className="mt-16 md:mt-20">
          <div className="bg-gradient-to-r from-primary to-primary/90 rounded-2xl p-8 md:p-12 text-primary-foreground">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
                <div className="text-accent/80">Empresas Atendidas</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">4.9/5</div>
                <div className="text-accent/80">Avaliação Média</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
                <div className="text-accent/80">Taxa de Satisfação</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
