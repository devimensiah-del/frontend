"use client";

import React, { useState, useEffect } from "react";
import { useAuthContext } from "@/lib/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { toast } from "@/components/ui/use-toast";
import { userApi } from "@/lib/api/client";

/* ============================================
   ADMIN CONFIGURAÇÕES - Profile Settings
   ============================================ */

export default function AdminConfiguracoes() {
  const { user } = useAuthContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setName(user.fullName || "");
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Update user profile (name only)
      await userApi.updateProfile({ fullName: name });

      toast({
        title: "Perfil Atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Erro ao Atualizar",
        description: "Não foi possível atualizar o perfil.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-paper">
      {/* --- PAGE HEADER --- */}
      <header className="bg-white border-b border-line">
        <div className="px-8 py-6">
          <h1 className="font-heading text-3xl font-medium tracking-tight text-navy-900">
            Configurações
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Gerencie suas informações de perfil
          </p>
        </div>
      </header>

      {/* --- CONTENT --- */}
      <div className="p-8">
        <div className="max-w-2xl bg-white border border-line p-8">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Name Field */}
            <FormField
              label="Nome"
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSaving}
            />

            {/* Email Field (Read-only) */}
            <FormField
              label="Email"
              id="email"
              type="email"
              value={email}
              onChange={() => {}} // Read-only
              disabled
              helpText="O email não pode ser alterado"
            />

            {/* Save Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="architect"
                isLoading={isSaving}
                disabled={isSaving}
              >
                Salvar Alterações
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (user) {
                    setName(user.fullName || "");
                  }
                }}
                disabled={isSaving}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
