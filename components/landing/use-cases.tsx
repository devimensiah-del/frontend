'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Store,
  Laptop,
  Heart,
  GraduationCap,
  Building2,
  Utensils
} from 'lucide-react';

const useCases = [
  {
    icon: Store,
    industry: 'Varejo',
    title: 'Análise de Concorrência',
    scenario: 'Uma loja de roupas descobriu que seus concorrentes estavam dominando o Instagram com conteúdo de bastidores.',
    result: 'Implementaram a estratégia e aumentaram engajamento em 180% em 2 meses.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Laptop,
    industry: 'Tecnologia',
    title: 'Posicionamento de Marca',
    scenario: 'Startup de SaaS não sabia como se diferenciar em mercado saturado.',
    result: 'Relatório identificou nicho inexplorado. Pivotaram messaging e dobraram conversões.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Heart,
    industry: 'Saúde',
    title: 'Presença Digital',
    scenario: 'Clínica médica tinha site mas zero pacientes online.',
    result: 'Descobriram problemas de SEO e ausência no Google Meu Negócio. Corrigiram e triplicaram agendamentos.',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  {
    icon: GraduationCap,
    industry: 'Educação',
    title: 'Estratégia de Conteúdo',
    scenario: 'Escola de idiomas gastava R$ 10k/mês em ads sem retorno.',
    result: 'Relatório mostrou que público estava no TikTok. Migraram budget e reduziram CAC em 60%.',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    icon: Building2,
    industry: 'Serviços B2B',
    title: 'LinkedIn Optimization',
    scenario: 'Consultoria B2B tinha perfil fraco no LinkedIn.',
    result: 'Implementaram recomendações do relatório. Leads inbound cresceram 250% em 3 meses.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Utensils,
    industry: 'Alimentação',
    title: 'Expansão Geográfica',
    scenario: 'Restaurante queria abrir segunda unidade mas não sabia onde.',
    result: 'Análise de dados públicos identificou bairro ideal com demanda não atendida. Nova unidade já é lucrativa.',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
];

export function UseCases() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Casos de Sucesso
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Empresas reais que transformaram seu negócio com insights do IMENSIAH
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <Card
                key={index}
                className="hover:shadow-strong transition-all duration-300 hover:-translate-y-1 group bg-card text-card-foreground"
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-12 h-12 rounded-lg ${useCase.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${useCase.color}`} />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground uppercase tracking-wide">
                        {useCase.industry}
                      </div>
                      <CardTitle className="text-lg text-foreground">
                        {useCase.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Scenario */}
                  <div>
                    <div className="text-sm font-semibold text-foreground mb-1">Desafio:</div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {useCase.scenario}
                    </p>
                  </div>

                  {/* Result */}
                  <div className="pt-4 border-t border-border">
                    <div className="text-sm font-semibold text-green-700 mb-1">Resultado:</div>
                    <p className="text-sm text-foreground leading-relaxed font-medium">
                      {useCase.result}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 md:mt-20 text-center">
          <div className="bg-gradient-to-r from-primary to-primary/90 rounded-2xl p-8 md:p-12 text-primary-foreground max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Pronto para Transformar Seu Negócio?
            </h3>
            <p className="text-lg md:text-xl mb-8 text-accent/80">
              Descubra insights que podem mudar a trajetória da sua empresa
            </p>
            <button
              onClick={() => {
                const formElement = document.getElementById('submission-form');
                if (formElement) {
                  formElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-accent text-accent-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-accent/90 transition-colors shadow-strong"
            >
              Solicitar Meu Diagnóstico Agora
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
