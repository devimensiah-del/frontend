"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Grid";
import { Heading, Text } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { Logo } from "@/components/ui/Logo";
import { useAuthContext } from "@/lib/providers/AuthProvider";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuthContext();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email inválido");
      return;
    }

    setIsLoading(true);

    try {
      await sendPasswordReset(email);
      setIsSuccess(true);
      toast.success("Email de recuperação enviado!");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao enviar email";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
            Recuperar Senha
          </Text>
        </div>

        {isSuccess ? (
          <div className="space-y-6">
            <div className="p-6 bg-green-50 border border-green-200 rounded">
              <Text className="text-green-800 text-center">
                Um email com instruções para redefinir sua senha foi enviado para <strong>{email}</strong>.
              </Text>
            </div>
            <Text variant="small" className="text-center text-text-tertiary">
              Verifique sua caixa de entrada e spam. O link expira em 1 hora.
            </Text>
            <Link href="/login" className="block">
              <Button variant="architect" className="w-full">
                Voltar ao Login
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Instructions */}
            <div className="mb-6">
              <Text variant="small" className="text-center text-text-secondary">
                Digite seu email para receber um link de recuperação de senha.
              </Text>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
                <Text variant="small" className="text-red-600">
                  {error}
                </Text>
              </div>
            )}

            {/* Forgot Password Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField
                label="Email"
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />

              <Button
                variant="architect"
                type="submit"
                className="w-full mt-8"
                disabled={isLoading}
              >
                {isLoading ? "Enviando..." : "Enviar Link de Recuperação"}
              </Button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 text-center space-y-2">
              <Text variant="small" className="text-text-tertiary">
                Lembrou sua senha?{" "}
                <Link href="/login" className="text-gold-600 hover:text-gold-700 font-medium">
                  Fazer login
                </Link>
              </Text>
            </div>
          </>
        )}
      </div>
    </Container>
  );
}
