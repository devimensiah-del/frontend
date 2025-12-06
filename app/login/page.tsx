"use client";

import { FormEvent, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardBody } from "@/components/organisms/Card";
import { Stack } from "@/components/layouts/Stack";
import { FormField } from "@/components/molecules/FormField";
import { Button } from "@/components/atoms/Button";
import { AlertBox } from "@/components/molecules/AlertBox";
import { useAuthContext } from "@/lib/providers/AuthProvider";

function LoginForm() {
  const searchParams = useSearchParams();
  const { signIn } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signIn(email, password);

      // Redirect to intended page or dashboard
      const redirectPath = searchParams.get("redirect") || "/dashboard";
      window.location.href = redirectPath;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao fazer login";
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
                Entrar
              </h1>
              <p className="text-sm text-text-secondary">
                Acesse sua conta IMENSIAH
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <AlertBox variant="error" title="Erro de Autenticação">
                {error}
              </AlertBox>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin}>
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

                <FormField
                  label="Senha"
                  type="input"
                  required
                  inputProps={{
                    type: "password",
                    value: password,
                    onChange: (e) => setPassword(e.target.value),
                    placeholder: "••••••••",
                    disabled: isLoading,
                    autoComplete: "current-password",
                  }}
                />

                <div className="flex justify-end">
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-gold-500 hover:text-gold-600 transition-colors"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>

                <Button
                  type="submit"
                  variant="architect"
                  size="lg"
                  loading={isLoading}
                  className="w-full"
                >
                  Entrar
                </Button>
              </Stack>
            </form>

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-line">
              <p className="text-sm text-text-secondary">
                Não tem uma conta?{" "}
                <Link
                  href="/auth/signup"
                  className="text-gold-500 hover:text-gold-600 font-medium transition-colors"
                >
                  Criar conta
                </Link>
              </p>
            </div>
          </Stack>
        </CardBody>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
