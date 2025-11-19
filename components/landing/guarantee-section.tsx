'use client';

import { Shield, RefreshCw, Headphones } from 'lucide-react';

export function GuaranteeSection() {
  const guarantees = [
    {
      icon: Shield,
      title: "Garantia de 7 dias",
      description: "Devolvemos 100% do valor se você não estiver satisfeito"
    },
    {
      icon: RefreshCw,
      title: "2 revisões incluídas",
      description: "Mediante feedback objetivo"
    },
    {
      icon: Headphones,
      title: "Suporte humano real",
      description: "Durante todo o processo"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        {/* Title */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            🛡️ Garantia e revisões
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Sem risco, com garantia total.
          </p>
        </div>

        {/* Guarantees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {guarantees.map((guarantee, index) => {
            const Icon = guarantee.icon;
            return (
              <div
                key={index}
                className="bg-card text-card-foreground rounded-xl shadow-medium p-6 md:p-8 text-center hover:shadow-strong transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-accent/10 p-4 rounded-full">
                    <Icon className="w-6 h-6 md:w-8 md:h-8 text-accent" />
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-3">
                  {guarantee.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  {guarantee.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
