'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Save, Trash2, Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/FormField';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { authApi } from '@/lib/api/client';

export default function ConfiguracoesPage() {
  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    analysisComplete: true,
    weeklyDigest: false,
  });
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  // Delete account dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  // Toast state
  const [toast, setToast] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    show: false,
    type: 'success',
    message: '',
  });

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: 'success', message: '' });
    }, 3000);
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    // Validation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('As senhas não coincidem.');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('A nova senha deve ter pelo menos 8 caracteres.');
      return;
    }

    setPasswordLoading(true);

    try {
      await authApi.updatePassword(passwordForm.currentPassword, passwordForm.newPassword);

      showToast('success', 'Senha alterada com sucesso!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      setPasswordError(error.message || 'Erro ao alterar senha. Verifique sua senha atual.');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle notification preferences save
  const handleNotificationsSave = async () => {
    setNotificationsLoading(true);

    try {
      // TODO: Call API to save notification preferences
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showToast('success', 'Preferências salvas com sucesso!');
    } catch (error) {
      showToast('error', 'Erro ao salvar preferências. Tente novamente.');
    } finally {
      setNotificationsLoading(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'EXCLUIR') {
      return;
    }

    try {
      // TODO: Call API to delete account
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Logout and redirect
      await authApi.logout();
      window.location.href = '/';
    } catch (error) {
      showToast('error', 'Erro ao excluir conta. Tente novamente.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Link href="/painel" className="hover:text-[#00a859]">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Configurações</span>
      </div>

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-2">
          Gerencie sua conta, senha e preferências de notificações.
        </p>
      </div>

      {/* Change Password Section */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Alterar Senha</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          {/* Current Password */}
          <FormField
            label="Senha Atual"
            id="currentPassword"
            required
            error={passwordError && passwordForm.currentPassword === '' ? 'Campo obrigatório' : undefined}
          >
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPasswords.current ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                }
                placeholder="Digite sua senha atual"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords({ ...showPasswords, current: !showPasswords.current })
                }
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.current ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </FormField>

          {/* New Password */}
          <FormField
            label="Nova Senha"
            id="newPassword"
            required
            helperText="Mínimo de 8 caracteres"
          >
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="Digite sua nova senha"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </FormField>

          {/* Confirm Password */}
          <FormField
            label="Confirmar Nova Senha"
            id="confirmPassword"
            required
            error={
              passwordForm.confirmPassword &&
              passwordForm.newPassword !== passwordForm.confirmPassword
                ? 'As senhas não coincidem'
                : undefined
            }
          >
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                }
                placeholder="Confirme sua nova senha"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })
                }
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </FormField>

          {/* Error Message */}
          {passwordError && (
            <Alert variant="error">
              <AlertDescription>{passwordError}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={
              passwordLoading ||
              !passwordForm.currentPassword ||
              !passwordForm.newPassword ||
              !passwordForm.confirmPassword
            }
            className="w-full sm:w-auto bg-[#00a859] hover:bg-[#008a47] text-white"
          >
            {passwordLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Nova Senha
              </>
            )}
          </Button>
        </form>
      </Card>

      {/* Notification Preferences Section */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferências de Notificações</h2>
        <div className="space-y-4">
          {/* Email Updates */}
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium text-gray-900">Atualizações por Email</p>
              <p className="text-sm text-gray-500 mt-1">
                Receba emails sobre atualizações importantes da plataforma.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.emailUpdates}
                onChange={(e) =>
                  setNotifications({ ...notifications, emailUpdates: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00a859]"></div>
            </label>
          </div>

          {/* Analysis Complete */}
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium text-gray-900">Análise Concluída</p>
              <p className="text-sm text-gray-500 mt-1">
                Seja notificado quando sua análise estiver pronta.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.analysisComplete}
                onChange={(e) =>
                  setNotifications({ ...notifications, analysisComplete: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00a859]"></div>
            </label>
          </div>

          {/* Weekly Digest */}
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium text-gray-900">Resumo Semanal</p>
              <p className="text-sm text-gray-500 mt-1">
                Receba um resumo semanal de suas análises e estatísticas.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.weeklyDigest}
                onChange={(e) =>
                  setNotifications({ ...notifications, weeklyDigest: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00a859]"></div>
            </label>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleNotificationsSave}
            disabled={notificationsLoading}
            className="w-full sm:w-auto bg-[#00a859] hover:bg-[#008a47] text-white"
          >
            {notificationsLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Preferências
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Delete Account Section */}
      <Card className="p-6 border-red-200 bg-red-50">
        <h2 className="text-lg font-semibold text-red-900 mb-4">Zona de Perigo</h2>
        <div className="space-y-4">
          <div>
            <p className="font-medium text-red-900">Excluir Conta</p>
            <p className="text-sm text-red-700 mt-1">
              Ação permanente. Todos os seus dados, análises e histórico serão removidos
              definitivamente.
            </p>
          </div>

          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir Minha Conta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tem certeza absoluta?</DialogTitle>
                <DialogDescription>
                  Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta e
                  removerá todos os seus dados de nossos servidores.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-gray-700 mb-3">
                  Por favor, digite <strong>EXCLUIR</strong> para confirmar:
                </p>
                <Input
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="EXCLUIR"
                  className="font-mono"
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDeleteDialogOpen(false);
                    setDeleteConfirmation('');
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmation !== 'EXCLUIR'}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Excluir Permanentemente
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed bottom-4 right-4 max-w-md p-4 rounded-lg shadow-lg border ${
            toast.type === 'success'
              ? 'bg-green-50 border-green-300'
              : 'bg-red-50 border-red-300'
          } animate-in slide-in-from-bottom-5 duration-300`}
        >
          <div className="flex items-start space-x-3">
            <div>
              <p
                className={`text-sm font-medium ${
                  toast.type === 'success' ? 'text-green-900' : 'text-red-900'
                }`}
              >
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => setToast({ show: false, type: 'success', message: '' })}
              className={`flex-shrink-0 ${
                toast.type === 'success' ? 'text-green-600' : 'text-red-600'
              } hover:opacity-75`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
