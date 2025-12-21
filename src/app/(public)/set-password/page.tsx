'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMe, useSetPassword } from '@/lib/hooks'

const setPasswordSchema = z.object({
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas nao conferem',
  path: ['confirmPassword'],
})

type SetPasswordFormData = z.infer<typeof setPasswordSchema>

export default function SetPasswordPage() {
  const router = useRouter()
  const { data: userData, isLoading: isLoadingUser } = useMe()
  const setPassword = useSetPassword()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [email, setEmail] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SetPasswordFormData>({
    resolver: zodResolver(setPasswordSchema),
  })

  // Get email from session storage (set when login fails with PASSWORD_NOT_SET)
  // or from the authenticated user
  useEffect(() => {
    const storedEmail = sessionStorage.getItem('set_password_email')
    if (storedEmail) {
      setEmail(storedEmail)
    } else if (userData?.user?.email) {
      setEmail(userData.user.email)
    }
  }, [userData])

  // If user is fully authenticated (has password), redirect appropriately
  useEffect(() => {
    if (userData?.user?.passwordSet === true) {
      const role = userData.user.role
      if (role === 'admin' || role === 'super_admin') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    }
  }, [userData, router])

  const onSubmit = async (data: SetPasswordFormData) => {
    await setPassword.mutateAsync(data.password)
  }

  if (isLoadingUser) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gold-100 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-gold-600" />
          </div>
          <h1 className="text-2xl font-semibold text-navy-900 mb-2">
            Configure sua Senha
          </h1>
          <p className="text-muted-foreground">
            {email ? (
              <>
                Configure uma senha para acessar sua conta
                <br />
                <span className="text-navy-900 font-medium">{email}</span>
              </>
            ) : (
              'Configure uma senha para acessar sua conta'
            )}
          </p>
        </div>

        <div className="bg-white p-8 border border-line shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="password">Nova Senha</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimo 8 caracteres"
                  autoComplete="new-password"
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-navy-900"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Digite a senha novamente"
                  autoComplete="new-password"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-navy-900"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full"
                disabled={setPassword.isPending}
              >
                {setPassword.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Configurando...
                  </>
                ) : (
                  'Configurar Senha e Entrar'
                )}
              </Button>
            </div>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Sua senha sera usada para acessar a plataforma no futuro.
          </p>
        </div>
      </div>
    </div>
  )
}
