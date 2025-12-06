"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardBody } from "@/components/organisms/Card";
import { Stack } from "@/components/layouts/Stack";
import { FormField } from "@/components/molecules/FormField";
import { Button } from "@/components/atoms/Button";
import { Checkbox } from "@/components/atoms/Checkbox";
import { Label } from "@/components/atoms/Label";
import { AlertBox } from "@/components/molecules/AlertBox";
import { useAuthContext } from "@/lib/providers/AuthProvider";

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuthContext();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateForm = (): boolean => {
    if (!fullName.trim()) {
      setError("Nome completo é obrigatório");
      return false;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email inválido");
      return false;
    }

    if (password.length < 8) {
      setError("A senha deve ter no mínimo 8 caracteres");
      return false;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return false;
    }

    if (!acceptedTerms) {
      setError("Você deve aceitar os termos de serviço");
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
      await signUp(email, password, fullName);
      router.push("/dashboard");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar conta";
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
                Criar Conta
              </h1>
              <p className="text-sm text-text-secondary">
                Comece sua análise estratégica
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <AlertBox variant="error" title="Erro no Cadastro">
                {error}
              </AlertBox>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSignup}>
              <Stack spacing="md">
                <FormField
                  label="Nome Completo"
                  type="input"
                  required
                  inputProps={{
                    value: fullName,
                    onChange: (e) => setFullName(e.target.value),
                    placeholder: "João Silva",
                    disabled: isLoading,
                    autoComplete: "name",
                  }}
                />

                <FormField
                  label="Email"
                  type="input"
                  required
                  inputProps={{
                    type: "email",
                    value: email,
                    onChange: (e) => setEmail(e.target.value),
                    placeholder: "joao@exemplo.com",
                    disabled: isLoading,
                    autoComplete: "email",
                  }}
                />

                <FormField
                  label="Senha"
                  type="input"
                  required
                  hint="Mínimo de 8 caracteres"
                  inputProps={{
                    type: "password",
                    value: password,
                    onChange: (e) => setPassword(e.target.value),
                    placeholder: "••••••••",
                    disabled: isLoading,
                    autoComplete: "new-password",
                  }}
                />

                <FormField
                  label="Confirmar Senha"
                  type="input"
                  required
                  error={confirmPassword && password !== confirmPassword ? "As senhas não coincidem" : undefined}
                  inputProps={{
                    type: "password",
                    value: confirmPassword,
                    onChange: (e) => setConfirmPassword(e.target.value),
                    placeholder: "••••••••",
                    disabled: isLoading,
                    autoComplete: "new-password",
                  }}
                />

                {/* Terms Checkbox */}
                <div className="flex items-start gap-2">
                  <Checkbox
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    disabled={isLoading}
                  />
                  <Label className="text-sm text-text-secondary cursor-pointer">
                    Aceito os{" "}
                    <Link href="/termos" className="text-gold-500 hover:text-gold-600">
                      Termos de Serviço
                    </Link>{" "}
                    e{" "}
                    <Link href="/privacidade" className="text-gold-500 hover:text-gold-600">
                      Política de Privacidade
                    </Link>
                  </Label>
                </div>

                <Button
                  type="submit"
                  variant="architect"
                  size="lg"
                  loading={isLoading}
                  className="w-full"
                >
                  Criar Conta
                </Button>
              </Stack>
            </form>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-line">
              <p className="text-sm text-text-secondary">
                Já tem uma conta?{" "}
                <Link
                  href="/login"
                  className="text-gold-500 hover:text-gold-600 font-medium transition-colors"
                >
                  Fazer login
                </Link>
              </p>
            </div>
          </Stack>
        </CardBody>
      </Card>
    </div>
  );
}
