"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Heading, Text } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { Logo } from "@/components/ui/Logo";
import { useAuthContext } from "@/lib/providers/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { siteConfig, authRoutes, adminRoutes, dashboardRoutes } from "@/lib/config/site";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuthContext();
  const { toast } = useToast();
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

      toast({
        title: "Bem-vindo de volta",
        description: "Login realizado com sucesso.",
        variant: "success",
      });

      // Wait for auth context to update with user profile from backend
      // The AuthProvider will fetch the user profile automatically
      setTimeout(() => {
        // Redirect based on user role (will be available from useAuthContext after update)
        const redirectPath = searchParams.get("redirect") || dashboardRoutes.main;
        router.push(redirectPath);
      }, 100);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao fazer login";
      setError(errorMessage);

      toast({
        title: "Erro de Acesso",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-12 border border-line shadow-sm relative">
      {/* Gold Accent Top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gold-500" />

      {/* Logo and Branding */}
      <div className="flex flex-col items-center mb-10">
        <Logo className="w-12 h-12 mb-4" />
        <Heading as="h1" className="text-2xl font-heading font-bold tracking-widest text-navy-900 text-center">
          {siteConfig.brand.name}
        </Heading>
        <Text variant="small" className="text-center mt-2 text-text-secondary">
          Acesso Administrativo
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

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-6">
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

        <FormField
          label="Senha"
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />

        <div className="flex justify-end">
          <Link href={authRoutes.forgotPassword} className="text-sm text-gold-600 hover:text-gold-700">
            Esqueceu sua senha?
          </Link>
        </div>

        <Button
          variant="architect"
          type="submit"
          className="w-full mt-8"
          isLoading={isLoading}
        >
          Entrar
        </Button>
      </form>

      {/* Footer Links */}
      <div className="mt-8 text-center space-y-2">
        <Text variant="small" className="text-text-tertiary">
          Não tem uma conta?{" "}
          <Link href={authRoutes.signup} className="text-gold-600 hover:text-gold-700 font-medium">
            Criar conta
          </Link>
        </Text>
        <Text variant="small" className="text-text-tertiary mt-4">
          Sistema interno de gerenciamento
        </Text>
      </div>
    </div>
  );
}
