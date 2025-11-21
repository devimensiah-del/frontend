'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';

// Mock user data - in production, fetch from API
const mockUser = {
  id: 'user_001',
  email: 'maria@techinova.com.br',
  fullName: 'Maria Silva',
  jobTitle: 'CEO & Founder',
  organization: 'TechInova Solutions',
};

export default function PerfilPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: mockUser.fullName,
    jobTitle: mockUser.jobTitle,
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Mock API call - in production, send to backend
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate success
      toast({
        title: 'Sucesso!',
        description: 'Perfil atualizado com sucesso!',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao salvar perfil. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
        <p className="text-gray-600 mt-2">
          Gerencie suas informações pessoais e configurações de conta.
        </p>
      </div>

      {/* Profile Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Editable Fields */}
          <FormField
            id="fullName"
            label="Nome Completo"
            required
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="Seu nome completo"
            error={formData.fullName.length < 2 ? 'Nome muito curto' : undefined}
          />

          <FormField
            id="jobTitle"
            label="Cargo"
            required
            value={formData.jobTitle}
            onChange={(e) => handleChange('jobTitle', e.target.value)}
            placeholder="Seu cargo na organização"
            error={formData.jobTitle.length < 2 ? 'Cargo muito curto' : undefined}
          />

          {/* Read-only Fields */}
          <div className="pt-6 border-t border-gray-200 space-y-6">
            <FormField
              id="email"
              label="E-mail"
              value={mockUser.email}
              disabled
              className="bg-gray-50 text-gray-500 cursor-not-allowed"
              helperText="E-mail não pode ser alterado"
            />

            <FormField
              id="organization"
              label="Organização"
              value={mockUser.organization}
              disabled
              className="bg-gray-50 text-gray-500 cursor-not-allowed"
              helperText="Organização não pode ser alterada"
            />
          </div>

          {/* Save Button */}
          <div className="pt-6 border-t border-gray-200">
            <Button
              type="submit"
              disabled={
                saving ||
                formData.fullName.length < 2 ||
                formData.jobTitle.length < 2
              }
              className="w-full sm:w-auto bg-[#00a859] hover:bg-[#008a47] text-white"
            >
              {saving ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Account Management */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Gerenciamento de Conta
        </h2>
        <div className="space-y-4">
          <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Alterar Senha</p>
              <p className="text-sm text-gray-500 mt-1">
                Atualize sua senha para manter sua conta segura
              </p>
            </div>
            <Button variant="outline" className="flex-shrink-0">
              Alterar
            </Button>
          </div>

          <div className="flex items-start justify-between p-4 border border-red-200 rounded-lg bg-red-50">
            <div>
              <p className="font-medium text-red-900">Excluir Conta</p>
              <p className="text-sm text-red-600 mt-1">
                Ação permanente. Todos os seus dados serão removidos.
              </p>
            </div>
            <Button
              variant="outline"
              className="flex-shrink-0 border-red-300 text-red-700 hover:bg-red-100"
            >
              Excluir
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
