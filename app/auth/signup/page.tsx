"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Grid";
import { Heading, Text } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { Logo } from "@/components/ui/Logo";
import { useAuthContext } from "@/lib/providers/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { siteConfig, authRoutes } from "@/lib/config/site";

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuthContext();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateForm = (): boolean => {
    if (!name.trim()) {
      setError("Nome é obrigatório");
      return false;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email inválido");
      return false;
    }

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

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password, name);

      toast({
        title: "Conta Criada",
        description: "Verifique seu email para confirmar.",
        variant: "success",
      });

      router.push(authRoutes.verifyEmail);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar conta";
      setError(errorMessage);

      toast({
        title: "Erro ao Criar Conta",
        description: errorMessage,
        variant: "destructive",
      });
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
            {siteConfig.brand.name}
          </Heading>
          <Text variant="small" className="text-center mt-2 text-text-secondary">
            Criar Nova Conta
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

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-6">
          <FormField
            label="Nome Completo"
            id="name"
            type="text"
            placeholder="João Silva"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />

          <FormField
            label="Email"
            id="email"
            type="email"
            placeholder="joao@exemplo.com"
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

          <FormField
            label="Confirmar Senha"
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
            Criar Conta
          </Button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-2">
          <Text variant="small" className="text-text-tertiary">
            Já tem uma conta?{" "}
            <Link href={authRoutes.login} className="text-gold-600 hover:text-gold-700 font-medium">
              Fazer login
            </Link>
          </Text>
        </div>
      </div>
    </Container>
  );
}
