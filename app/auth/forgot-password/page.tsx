"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Card, CardBody } from "@/components/organisms/Card";
import { Stack } from "@/components/layouts/Stack";
import { FormField } from "@/components/molecules/FormField";
import { Button } from "@/components/atoms/Button";
import { AlertBox } from "@/components/molecules/AlertBox";
import { authApi } from "@/lib/api/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Por favor, insira um email válido");
      return;
    }

    setIsLoading(true);

    try {
      await authApi.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao enviar email";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-paper p-4">
      <Card variant="elevated" className="w-full max-w-md">
        <CardBody className="p-8">
          <Stack spacing="lg">
            {/* Header */}
            <div className="text-center">
              <h1 className="font-heading text-3xl font-bold text-navy-900 mb-2 uppercase tracking-wider">
                Recuperar Senha
              </h1>
              <p className="text-sm text-text-secondary">
                Insira seu email para receber instruções
              </p>
            </div>

            {/* Success Message */}
            {success ? (
              <Stack spacing="md">
                <AlertBox variant="success" title="Email Enviado">
                  Enviamos instruções para recuperação de senha para o seu email.
                  Verifique sua caixa de entrada e siga os passos indicados.
                </AlertBox>

                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    Voltar para Login
                  </Button>
                </Link>
              </Stack>
            ) : (
              <>
                {/* Error Message */}
                {error && (
                  <AlertBox variant="error" title="Erro">
                    {error}
                  </AlertBox>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  <Stack spacing="md">
                    <FormField
                      label="Email"
                      type="input"
                      required
                      inputProps={{
                        type: "email",
                        value: email,
                        onChange: (e) => setEmail(e.target.value),
                        placeholder: "seu@email.com",
                        disabled: isLoading,
                        autoComplete: "email",
                      }}
                    />

                    <Button
                      type="submit"
                      variant="architect"
                      size="lg"
                      loading={isLoading}
                      className="w-full"
                    >
                      Enviar Instruções
                    </Button>
                  </Stack>
                </form>

                {/* Back to Login */}
                <div className="text-center pt-4 border-t border-line">
                  <Link
                    href="/login"
                    className="text-sm text-gold-500 hover:text-gold-600 transition-colors"
                  >
                    ← Voltar para login
                  </Link>
                </div>
              </>
            )}
          </Stack>
        </CardBody>
      </Card>
    </div>
  );
}
