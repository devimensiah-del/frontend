"use client";

import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { Container } from "@/components/ui/Grid";
import { Heading, Text, Label } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";

export default function ThankYouPage() {
  useEffect(() => {
    // Optional: Add analytics tracking here
    console.log("Thank you page viewed");
  }, []);

  return (
    <Container className="flex-1 flex items-center justify-center py-24">
      <div className="max-w-2xl w-full text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <CheckCircle className="w-24 h-24 text-gold-500" strokeWidth={1.5} />
            {/* Decorative Ring */}
            <div className="absolute inset-0 border-2 border-gold-500/20 rounded-full animate-pulse" style={{ transform: "scale(1.3)" }} />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white p-12 border border-line shadow-sm relative">
          {/* Gold Accent Top */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gold-500" />

          <Heading as="h1" className="text-4xl md:text-5xl mb-6">
            Obrigado!
          </Heading>

          <Text variant="large" className="text-text-secondary mb-8 leading-relaxed">
            Seu pedido de diagnóstico foi recebido com sucesso. Nossa equipe de
            Inteligência Híbrida já começou a processar suas informações.
          </Text>

          <div className="bg-surface-paper p-8 border border-line mb-8">
            <Label className="text-gold-500 mb-4 block">Próximos Passos</Label>
            <div className="space-y-4 text-left">
              <div className="flex gap-4">
                <span className="text-gold-500 font-bold">01</span>
                <Text variant="small">
                  Verifique seu email para confirmar o recebimento
                </Text>
              </div>
              <div className="flex gap-4">
                <span className="text-gold-500 font-bold">02</span>
                <Text variant="small">
                  Nossa IA iniciará o enriquecimento automático de dados
                </Text>
              </div>
              <div className="flex gap-4">
                <span className="text-gold-500 font-bold">03</span>
                <Text variant="small">
                  Em até 24h, você receberá seu relatório preliminar
                </Text>
              </div>
            </div>
          </div>

          <Button
            variant="architect"
            onClick={() => window.location.href = "/"}
            className="mx-auto"
          >
            Voltar ao Início
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-8">
          <Text variant="small" className="text-text-tertiary">
            Dúvidas? Entre em contato:{" "}
            <a
              href="mailto:contato@imensiah.com"
              className="text-gold-500 hover:underline"
            >
              contato@imensiah.com
            </a>
          </Text>
        </div>
      </div>
    </Container>
  );
}
