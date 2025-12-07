'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMe, useUpdateProfile } from '@/lib/hooks'

const schema = z.object({
  fullName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
})

type FormData = z.infer<typeof schema>

export function ProfileForm() {
  const { data } = useMe()
  const updateProfile = useUpdateProfile()
  const user = data?.user

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: user?.fullName || '',
    },
  })

  const onSubmit = async (data: FormData) => {
    updateProfile.mutate({ fullName: data.fullName })
  }

  return (
    <div className="bg-white border border-line rounded-lg p-6">
      <h2 className="text-lg font-semibold text-navy-900 mb-4">
        Informações do Perfil
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={user?.email || ''}
            disabled
            className="bg-navy-900/5"
          />
          <p className="text-xs text-muted-foreground mt-1">
            O email não pode ser alterado.
          </p>
        </div>

        <div>
          <Label htmlFor="fullName">Nome Completo</Label>
          <Input
            id="fullName"
            placeholder="Seu nome"
            {...register('fullName')}
          />
          {errors.fullName && (
            <p className="text-sm text-destructive mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={updateProfile.isPending}>
            {updateProfile.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Alterações'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
