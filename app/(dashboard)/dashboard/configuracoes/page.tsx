"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, userApi } from "@/lib/api/client";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/organisms/Card";
import { AlertBox } from "@/components/molecules/AlertBox";
import { Skeleton } from "@/components/atoms/Skeleton";
import { Settings, User, Lock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Form states
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");

  // Fetch current user
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: authApi.getCurrentUser,
  });

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: () => authApi.updatePassword(currentPassword, newPassword),
    onSuccess: () => {
      toast.success("Senha atualizada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao atualizar senha");
    },
  });

  // Delete account mutation (placeholder)
  const deleteAccountMutation = useMutation({
    mutationFn: userApi.deleteAccount,
    onSuccess: () => {
      toast.success("Conta desativada com sucesso");
      localStorage.removeItem("auth_token");
      router.push("/login");
    },
    onError: () => {
      toast.error("Erro ao desativar conta");
    },
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Todos os campos são obrigatórios");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("A nova senha deve ter pelo menos 8 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("As senhas não coincidem");
      return;
    }

    updatePasswordMutation.mutate();
  };

  const handleDeleteAccount = () => {
    if (confirm("Tem certeza que deseja desativar sua conta? Esta ação não pode ser desfeita.")) {
      deleteAccountMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <Skeleton variant="text" width={200} height={32} />
          <Skeleton variant="text" width={400} height={20} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardBody>
              <Skeleton variant="rectangular" height={200} />
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Skeleton variant="rectangular" height={250} />
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2 flex items-center gap-3">
          <Settings className="w-8 h-8 text-gold-600" />
          Configurações
        </h1>
        <p className="text-base text-text-secondary">
          Gerencie suas informações pessoais e preferências da conta.
        </p>
      </div>

      {/* Profile Section */}
      <Card variant="bordered">
        <CardHeader>
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <User className="w-5 h-5" />
            Perfil
          </h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                type="text"
                value={user?.fullName || ""}
                disabled
                className="bg-surface-paper"
              />
              <p className="text-xs text-text-tertiary mt-1">
                Entre em contato com o suporte para alterar seu nome
              </p>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
                className="bg-surface-paper"
              />
              <p className="text-xs text-text-tertiary mt-1">
                Entre em contato com o suporte para alterar seu email
              </p>
            </div>

            <div>
              <Label htmlFor="role">Função</Label>
              <Input
                id="role"
                type="text"
                value={user?.role === "admin" || user?.role === "super_admin" ? "Administrador" : "Usuário"}
                disabled
                className="bg-surface-paper"
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Security Section */}
      <Card variant="bordered">
        <CardHeader>
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Segurança
          </h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <Label htmlFor="current-password">Senha atual</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Digite sua senha atual"
                disabled={updatePasswordMutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="new-password">Nova senha</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite sua nova senha (mín. 8 caracteres)"
                disabled={updatePasswordMutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="confirm-password">Confirmar nova senha</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Digite novamente sua nova senha"
                disabled={updatePasswordMutation.isPending}
              />
            </div>

            {passwordError && (
              <AlertBox variant="error">
                {passwordError}
              </AlertBox>
            )}

            <Button
              type="submit"
              disabled={updatePasswordMutation.isPending}
              className="w-full sm:w-auto"
            >
              {updatePasswordMutation.isPending ? "Atualizando..." : "Atualizar Senha"}
            </Button>
          </form>
        </CardBody>
      </Card>

      {/* Preferences Section (Placeholder) */}
      <Card variant="bordered">
        <CardHeader>
          <h2 className="text-xl font-bold text-text-primary">Preferências</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div>
              <Label htmlFor="language">Idioma</Label>
              <select
                id="language"
                className="w-full px-3 py-2 border border-line rounded-sm bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-gold-500"
                disabled
              >
                <option value="pt">Português (Brasil)</option>
                <option value="en">English</option>
              </select>
              <p className="text-xs text-text-tertiary mt-1">
                Configurações de idioma em breve
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Danger Zone */}
      <Card variant="bordered" className="border-semantic-error">
        <CardHeader>
          <h2 className="text-xl font-bold text-semantic-error flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Zona de Perigo
          </h2>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-text-secondary mb-4">
            Desativar sua conta irá remover o acesso a todas as empresas e análises. Esta ação não pode ser desfeita.
          </p>
          <Button
            variant="outline"
            onClick={handleDeleteAccount}
            disabled={deleteAccountMutation.isPending}
            className="border-semantic-error text-semantic-error hover:bg-semantic-error-light"
          >
            {deleteAccountMutation.isPending ? "Desativando..." : "Desativar Conta"}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
