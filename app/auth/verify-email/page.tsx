"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Grid";
import { Heading, Text } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";

export default function VerifyEmailPage() {
  return (
    <Container className="min-h-screen flex items-center justify-center bg-surface-paper">
      <div className="max-w-md w-full bg-white p-12 border border-line shadow-sm relative">
        {/* Gold Accent Top */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gold-500" />

        {/* Logo and Branding */}
        <div className="flex flex-col items-center mb-10">
          <Logo className="w-12 h-12 mb-4" />
          <Heading as="h1" className="text-2xl font-heading font-bold tracking-widest text-navy-900 text-center">
            IMENSIAH
          </Heading>
          <Text variant="small" className="text-center mt-2 text-text-secondary">
            Verificar Email
          </Text>
        </div>

        {/* Success Message */}
        <div className="space-y-6">
          <div className="p-6 bg-green-50 border border-green-200 rounded">
            <Heading as="h2" className="text-lg text-green-900 text-center mb-2">
              Conta Criada com Sucesso!
            </Heading>
            <Text className="text-green-800 text-center">
              Um email de confirmação foi enviado para você. Por favor, verifique sua caixa de entrada e clique no link de confirmação.
            </Text>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <Text variant="small" className="text-blue-800">
              <strong>Importante:</strong> Você precisa confirmar seu email antes de fazer login. Verifique também a pasta de spam.
            </Text>
          </div>

          <Link href="/login" className="block">
            <Button variant="architect" className="w-full">
              Ir para Login
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}
