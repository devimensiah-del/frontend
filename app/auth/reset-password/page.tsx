"use client";

import { FormEvent, useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Grid";
import { Heading, Text } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { Logo } from "@/components/ui/Logo";
import { useAuthContext } from "@/lib/providers/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { siteConfig, authRoutes } from "@/lib/config/site";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updatePassword } = useAuthContext();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // Check if we have the necessary token/code from the URL
    const token = searchParams.get("token") || searchParams.get("access_token");
    setHasToken(!!token);
  }, [searchParams]);

  const validateForm = (): boolean => {
    if (password.length < 6) {
      setError("Senha deve ter pelo menos 6 caracteres");
      return false;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await updatePassword(password);
      setIsSuccess(true);

      toast({
        title: "Senha Redefinida",
        description: "Você será redirecionado para o login.",
        variant: "success",
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push(authRoutes.login);
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao redefinir senha";
      setError(errorMessage);

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasToken) {
    return (
      <Container className="min-h-screen flex items-center justify-center bg-surface-paper">
        <div className="max-w-md w-full bg-white p-12 border border-line shadow-sm relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gold-500" />

          <div className="flex flex-col items-center mb-10">
            <Logo className="w-20 h-20 mb-4" />
            <Heading as="h1" className="text-2xl font-heading font-bold tracking-widest text-navy-900 text-center">
              {siteConfig.brand.name}
            </Heading>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-red-50 border border-red-200 rounded">
              <Text className="text-red-800 text-center">
                Link inválido ou expirado. Por favor, solicite um novo link de recuperação.
              </Text>
            </div>
            <Link href={authRoutes.forgotPassword} className="block">
              <Button variant="architect" className="w-full">
                Solicitar Novo Link
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="min-h-screen flex items-center justify-center bg-surface-paper">
      <div className="max-w-md w-full bg-white p-12 border border-line shadow-sm relative">
        {/* Gold Accent Top */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gold-500" />

        {/* Logo and Branding */}
        <div className="flex flex-col items-center mb-10">
          <Logo className="w-20 h-20 mb-4" />
          <Heading as="h1" className="text-2xl font-heading font-bold tracking-widest text-navy-900 text-center">
            {siteConfig.brand.name}
          </Heading>
          <Text variant="small" className="text-center mt-2 text-text-secondary">
            Redefinir Senha
          </Text>
        </div>

        {isSuccess ? (
          <div className="space-y-6">
            <div className="p-6 bg-green-50 border border-green-200 rounded">
              <Text className="text-green-800 text-center">
                Senha redefinida com sucesso! Você será redirecionado para o login.
              </Text>
            </div>
          </div>
        ) : (
          <>
            {/* Instructions */}
            <div className="mb-6">
              <Text variant="small" className="text-center text-text-secondary">
                Digite sua nova senha abaixo.
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

            {/* Reset Password Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField
                label="Nova Senha"
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />

              <FormField
                label="Confirmar Nova Senha"
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />

              <Button
                variant="architect"
                type="submit"
                className="w-full mt-8"
                isLoading={isLoading}
              >
                Redefinir Senha
              </Button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 text-center">
              <Text variant="small" className="text-text-tertiary">
                Lembrou sua senha?{" "}
                <Link href={authRoutes.login} className="text-gold-600 hover:text-gold-700 font-medium">
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <Container className="min-h-screen flex items-center justify-center bg-surface-paper">
          <div className="max-w-md w-full bg-white p-12 border border-line shadow-sm relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gold-500" />
            <div className="flex flex-col items-center mb-10">
              <Logo className="w-20 h-20 mb-4" />
              <Heading as="h1" className="text-2xl font-heading font-bold tracking-widest text-navy-900 text-center">
                {siteConfig.brand.name}
              </Heading>
            </div>
            <div className="text-center">
              <Text className="text-text-secondary">Carregando...</Text>
            </div>
          </div>
        </Container>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
