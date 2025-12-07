'use client'

import { useState } from 'react'
import { useMe, useUpdateProfile, useUpdatePassword } from '@/lib/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { User, Lock, AlertTriangle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import api from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const { data, isLoading } = useMe()
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateProfile()
  const { mutate: updatePassword, isPending: isUpdatingPassword } = useUpdatePassword()
  const [isDeleting, setIsDeleting] = useState(false)

  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors } } = useForm({
    defaultValues: {
      fullName: data?.user?.fullName || '',
    },
    values: {
      fullName: data?.user?.fullName || '',
    }
  })

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword, formState: { errors: passwordErrors } } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  })

  const onProfileSubmit = (formData: { fullName: string }) => {
    updateProfile({ fullName: formData.fullName })
  }

  const onPasswordSubmit = (formData: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('As senhas não coincidem')
      return
    }

    if (formData.newPassword.length < 8) {
      toast.error('A senha deve ter no mínimo 8 caracteres')
      return
    }

    updatePassword(
      {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      },
      {
        onSuccess: () => {
          resetPassword()
        }
      }
    )
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      await api.delete('/user')
      toast.success('Conta desativada com sucesso')
      localStorage.removeItem('auth_token')
      router.push('/')
    } catch (error) {
      toast.error('Erro ao desativar conta')
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-navy-900">
          Configurações
        </h1>
        <p className="text-text-secondary mt-1">
          Gerencie suas informações pessoais e preferências
        </p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-navy-900" />
            <div>
              <CardTitle>Perfil</CardTitle>
              <CardDescription>Atualize suas informações pessoais</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input
                id="fullName"
                {...registerProfile('fullName', { required: 'Nome é obrigatório' })}
                placeholder="Seu nome completo"
              />
              {profileErrors.fullName && (
                <p className="text-sm text-red-600 mt-1">{profileErrors.fullName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={data?.user?.email || ''}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-text-secondary mt-1">
                O email não pode ser alterado
              </p>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isUpdatingProfile}>
                {isUpdatingProfile ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Password Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-navy-900" />
            <div>
              <CardTitle>Senha</CardTitle>
              <CardDescription>Altere sua senha de acesso</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Senha Atual</Label>
              <Input
                id="currentPassword"
                type="password"
                {...registerPassword('currentPassword', { required: 'Senha atual é obrigatória' })}
                placeholder="Digite sua senha atual"
              />
              {passwordErrors.currentPassword && (
                <p className="text-sm text-red-600 mt-1">{passwordErrors.currentPassword.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input
                id="newPassword"
                type="password"
                {...registerPassword('newPassword', {
                  required: 'Nova senha é obrigatória',
                  minLength: { value: 8, message: 'A senha deve ter no mínimo 8 caracteres' }
                })}
                placeholder="Digite sua nova senha"
              />
              {passwordErrors.newPassword && (
                <p className="text-sm text-red-600 mt-1">{passwordErrors.newPassword.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...registerPassword('confirmPassword', { required: 'Confirmação de senha é obrigatória' })}
                placeholder="Confirme sua nova senha"
              />
              {passwordErrors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">{passwordErrors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isUpdatingPassword}>
                {isUpdatingPassword ? 'Alterando...' : 'Alterar Senha'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div>
              <CardTitle className="text-red-600">Zona de Perigo</CardTitle>
              <CardDescription>Ações irreversíveis</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="font-medium text-navy-900 mb-1">Desativar Conta</h4>
              <p className="text-sm text-text-secondary">
                Desative sua conta permanentemente. Esta ação não pode ser desfeita.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Desativar Conta
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso irá desativar permanentemente sua
                    conta e remover seu acesso aos dados.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isDeleting ? 'Desativando...' : 'Sim, desativar minha conta'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
