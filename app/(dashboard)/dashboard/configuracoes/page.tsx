'use client';

import { useEffect, useState } from 'react';
import { Save, Eye, EyeOff, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { FormFieldWrapper } from '@/components/ui/FormFieldWrapper';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { authApi, userApi } from '@/lib/api/client';
import { useToast } from '@/components/ui/use-toast';
import { Section, Container } from '@/components/editorial/Section';
import { Heading, Eyebrow, Text } from '@/components/ui/Typography';
import { useProfile } from '@/lib/hooks/use-profile';

export default function ConfiguracoesPage() {
  const { toast } = useToast();

  const { profile, isLoading: profileLoading, update, isUpdating: isUpdatingProfile, updateError } =
    useProfile(undefined, { enabled: true });

  const [profileForm, setProfileForm] = useState({
    fullName: '',
  });

  const normalizedFullName = profile?.fullName?.trim() || '';
  const isProfileDirty = profile ? profileForm.fullName.trim() !== normalizedFullName : false;

  useEffect(() => {
    if (profile?.fullName) {
      setProfileForm({ fullName: profile.fullName });
    }
  }, [profile]);

  // Profile form state
  const [profileError, setProfileError] = useState('');

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');

    if (!profile) {
      setProfileError('Usuário não autenticado.');
      return;
    }

    try {
      await update({ fullName: profileForm.fullName.trim() });
      toast({
        title: 'Perfil atualizado',
        description: 'Seu nome foi salvo com sucesso.',
        variant: 'success',
      });
    } catch (error: any) {
      setProfileError(error?.message || 'Erro ao salvar perfil.');
    }
  };

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

  // Delete account dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

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

    // Require at least one special character for stronger passwords
    if (!/[!@#$%^&*()_+[\]{};':"\\|,.<>/?~-]/.test(passwordForm.newPassword)) {
      setPasswordError('Use pelo menos um caractere especial.');
      return;
    }

    setPasswordLoading(true);

    try {
      await authApi.updatePassword(passwordForm.currentPassword, passwordForm.newPassword);

      toast({
        title: 'Senha alterada',
        description: 'Sua senha foi alterada com sucesso!',
        variant: 'success',
      });

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

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'EXCLUIR') return;

    setDeleteLoading(true);
    try {
      await userApi.deleteAccount();
      await authApi.logout();
      window.location.href = '/';
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error?.message || 'Erro ao excluir conta. Tente novamente.',
        variant: 'error',
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Section className="bg-gray-50 min-h-screen border-0">
      <Container className="py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Page Header */}
          <div>
            <Eyebrow className="mb-2">Sua Conta</Eyebrow>
            <Heading variant="section">Configurações</Heading>
            <Text className="mt-2 text-text-secondary">
              Gerencie sua conta, senha e preferências.
            </Text>
          </div>

          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle>Meu Perfil</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSave} className="space-y-4">
                {(!profile && profileLoading) ? (
                  <p className="text-sm text-text-secondary">Carregando seus dados...</p>
                ) : (
                  <div className="space-y-4">
                    <FormFieldWrapper
                      label="Nome Completo"
                      id="fullName"
                      required
                    >
                      <Input
                        id="fullName"
                        value={profileForm.fullName}
                        onChange={(e) => setProfileForm({ fullName: e.target.value })}
                        placeholder="Seu nome completo"
                        className="pr-10"
                      />
                    </FormFieldWrapper>

                    <FormFieldWrapper label="E-mail" id="email">
                      <Input
                        id="email"
                        value={profile?.email || ''}
                        disabled
                        className="bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                    </FormFieldWrapper>

                    {profile?.role && (
                      <Text className="text-sm text-text-secondary">
                        Perfil: {profile.role === 'admin' ? 'Administrador' : 'Usuário'}
                      </Text>
                    )}
                  </div>
                )}

                {(profileError || updateError) && (
                  <Alert variant="error">
                    <AlertDescription>{profileError || updateError?.message}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="architect"
                  disabled={
                    profileLoading ||
                    isUpdatingProfile ||
                    !profile ||
                    profileForm.fullName.trim().length < 2 ||
                    !isProfileDirty
                  }
                  className="w-full sm:w-auto"
                >
                  {isUpdatingProfile ? (
                    <>Salvando...</>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Change Password Section */}
          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                {/* Current Password */}
                <FormFieldWrapper
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
                </FormFieldWrapper>

                {/* New Password */}
                <FormFieldWrapper
                  label="Nova Senha"
                  id="newPassword"
                  required
                  helperText="Mínimo de 8 caracteres e 1 caractere especial"
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
                </FormFieldWrapper>

                {/* Confirm Password */}
                <FormFieldWrapper
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
                </FormFieldWrapper>

                {/* Error Message */}
                {passwordError && (
                  <Alert variant="error">
                    <AlertDescription>{passwordError}</AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="architect"
                  disabled={
                    passwordLoading ||
                    !passwordForm.currentPassword ||
                    !passwordForm.newPassword ||
                    !passwordForm.confirmPassword
                  }
                  className="w-full sm:w-auto"
                >
                  {passwordLoading ? (
                    <>Salvando...</>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Nova Senha
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Delete Account Section */}
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-900">Zona de Perigo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-red-900">Excluir Conta</p>
                  <p className="text-sm text-red-700 mt-1">
                    Ação permanente. Sua conta será desativada e o acesso removido.
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
                        Esta ação não pode ser desfeita. Isso desativará permanentemente sua conta e removerá seu acesso.
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
                        disabled={deleteConfirmation !== 'EXCLUIR' || deleteLoading}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        {deleteLoading ? 'Excluindo...' : 'Excluir Permanentemente'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
