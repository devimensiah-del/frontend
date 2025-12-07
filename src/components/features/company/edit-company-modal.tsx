'use client'

import { Company } from '@/lib/types/domain'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useUpdateCompany } from '@/lib/hooks/use-companies'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'

interface EditCompanyModalProps {
  company: Company
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface FormData {
  name: string
  website?: string
  industry?: string
  location?: string
  company_size?: string
  target_market?: string
  value_proposition?: string
}

export function EditCompanyModal({ company, open, onOpenChange }: EditCompanyModalProps) {
  const updateCompany = useUpdateCompany()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: company.name,
      website: company.website || '',
      industry: company.industry || '',
      location: company.location || '',
      company_size: company.company_size || '',
      target_market: company.target_market || '',
      value_proposition: company.value_proposition || '',
    },
  })

  const onSubmit = (data: FormData) => {
    updateCompany.mutate(
      { id: company.id, data },
      { onSuccess: () => onOpenChange(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Empresa</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Empresa *</Label>
            <Input
              id="name"
              {...register('name', { required: 'Nome é obrigatório' })}
              className="input-editorial"
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                {...register('website')}
                placeholder="https://..."
                className="input-editorial"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Indústria</Label>
              <Input
                id="industry"
                {...register('industry')}
                className="input-editorial"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Localização</Label>
              <Input
                id="location"
                {...register('location')}
                className="input-editorial"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_size">Tamanho</Label>
              <Input
                id="company_size"
                {...register('company_size')}
                placeholder="ex: 10-50 funcionários"
                className="input-editorial"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target_market">Mercado Alvo</Label>
            <Input
              id="target_market"
              {...register('target_market')}
              className="input-editorial"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="value_proposition">Proposta de Valor</Label>
            <Textarea
              id="value_proposition"
              {...register('value_proposition')}
              className="input-editorial min-h-[100px]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={updateCompany.isPending}>
              {updateCompany.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
