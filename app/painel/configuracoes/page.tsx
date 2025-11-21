"use client";

import React, { useState, useEffect } from "react";
import { useAuthContext } from "@/lib/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { toast } from "@/components/ui/use-toast";

/* ============================================
   USER CONFIGURAÇÕES - Profile Settings
   ============================================ */

export default function UserConfiguracoes() {
  const { user } = useAuthContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setName(user.user_metadata?.name || "");
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Update user profile (name only)
      // Replace with real API call
      await new Promise(resolve => setTimeout(resolve, 1000));

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
    <div className="min-h-screen bg-gray-50">
      {/* --- PAGE HEADER --- */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-6">
          <h1 className="font-heading text-3xl font-medium tracking-tight text-navy-900">
            Configurações
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Gerencie suas informações de perfil
          </p>
        </div>
      </header>

      {/* --- CONTENT --- */}
      <div className="p-6">
        <div className="max-w-2xl bg-white border border-gray-200 p-8">
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
                    setName(user.user_metadata?.name || "");
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
