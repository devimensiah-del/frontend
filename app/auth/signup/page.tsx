"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Grid";
import { Heading, Text } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { Logo } from "@/components/ui/Logo";
import { useAuthContext } from "@/lib/providers/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { siteConfig, authRoutes, dashboardRoutes } from "@/lib/config/site";
import { Check, X } from "lucide-react";

interface PasswordRequirement {
  label: string;
  validator: (password: string) => boolean;
  met: boolean;
}

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
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  // Password requirements state
  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirement[]>([
    {
      label: "Mínimo de 8 caracteres",
      validator: (pwd) => pwd.length >= 8,
      met: false,
    },
    {
      label: "Pelo menos uma letra minúscula (a-z)",
      validator: (pwd) => /[a-z]/.test(pwd),
      met: false,
    },
    {
      label: "Pelo menos uma letra maiúscula (A-Z)",
      validator: (pwd) => /[A-Z]/.test(pwd),
      met: false,
    },
    {
      label: "Pelo menos um número (0-9)",
      validator: (pwd) => /[0-9]/.test(pwd),
      met: false,
    },
    {
      label: "Pelo menos um símbolo (!@#$%^&*)",
      validator: (pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
      met: false,
    },
  ]);

  // Update password requirements in real-time
  useEffect(() => {
    if (password) {
      setShowPasswordRequirements(true);
      setPasswordRequirements((prev) =>
        prev.map((req) => ({
          ...req,
          met: req.validator(password),
        }))
      );
    } else {
      setShowPasswordRequirements(false);
    }
  }, [password]);

  const isPasswordValid = (): boolean => {
    return passwordRequirements.every((req) => req.met);
  };

  const validateForm = (): boolean => {
    if (!name.trim()) {
      setError("Nome é obrigatório");
      return false;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email inválido");
      return false;
    }

    if (!isPasswordValid()) {
      setError("A senha não atende aos requisitos de segurança");
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
        title: "Conta Criada com Sucesso",
        description: "Você já pode fazer login e acessar sua conta.",
        variant: "success",
      });

      // Redirect to user dashboard (all new signups are regular users)
      router.push(dashboardRoutes.main);
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
    <Container className="min-h-screen flex items-center justify-center bg-surface-paper py-12">
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
            Criar Nova Conta
          </Text>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200">
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

          <div>
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

            {/* Password Requirements Checklist */}
            {showPasswordRequirements && (
              <div className="mt-3 p-4 bg-surface-paper border border-line">
                <Text variant="small" className="font-bold text-navy-900 mb-2 uppercase tracking-wider">
                  Requisitos de Senha:
                </Text>
                <div className="space-y-2">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-start gap-2">
                      {req.met ? (
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <Text
                        variant="small"
                        className={req.met ? "text-green-700" : "text-text-secondary"}
                      >
                        {req.label}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

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

          {confirmPassword && password !== confirmPassword && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200">
              <X className="w-4 h-4 text-yellow-600 flex-shrink-0" />
              <Text variant="small" className="text-yellow-700">
                As senhas não coincidem
              </Text>
            </div>
          )}

          <Button
            variant="architect"
            type="submit"
            className="w-full mt-8"
            isLoading={isLoading}
            disabled={isLoading || (!!password && !isPasswordValid())}
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
