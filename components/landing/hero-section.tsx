'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  const handleCTAClick = () => {
    const formElement = document.getElementById('submission-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20 bg-gradient-to-br from-primary via-primary/95 to-accent overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/imensiah-logo.png"
            alt="IMENSIAH"
            width={200}
            height={200}
            className="w-48 h-48 object-contain drop-shadow-2xl"
            priority
          />
        </div>

        {/* Main Headline */}
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-primary-foreground mb-6">
          <span className="block mb-2">IMENSIAH — Torne sua empresa</span>
          <span className="block text-accent">imensa</span>
          <span className="block">com IA + IH</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed mb-8">
          Estratégia inteligente em 24h
        </p>

        {/* Pricing Box */}
        <div className="inline-block bg-card/10 backdrop-blur-sm border-2 border-accent/30 rounded-xl p-6 mb-8">
          <p className="text-sm text-primary-foreground/70 mb-2">Relatório Estratégico Completo</p>
          <div className="flex items-baseline justify-center gap-3">
            <span className="text-primary-foreground/60 line-through text-2xl">R$ 1.490</span>
            <span className="text-5xl md:text-6xl font-bold text-accent">R$ 890</span>
          </div>
          <p className="text-sm text-primary-foreground/70 mt-2">Promoção de lançamento</p>
        </div>

        {/* Key Points */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm md:text-base text-primary-foreground/80 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span>Feito por IA e revisado por humanos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span>Entrega em até 24h úteis</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span>Garantia de 7 dias</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          <Button
            onClick={handleCTAClick}
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg px-8 py-6 h-auto rounded-lg shadow-strong hover:shadow-medium transition-all duration-300 transform hover:scale-105"
          >
            Gerar meu Relatório Estratégico
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
