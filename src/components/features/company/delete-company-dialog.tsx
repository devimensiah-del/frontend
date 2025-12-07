'use client'

import { Company } from '@/lib/types/domain'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDeleteCompany } from '@/lib/hooks/use-companies'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface DeleteCompanyDialogProps {
  company: Company
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteCompanyDialog({ company, open, onOpenChange }: DeleteCompanyDialogProps) {
  const router = useRouter()
  const deleteCompany = useDeleteCompany()

  const handleDelete = () => {
    deleteCompany.mutate(company.id, {
      onSuccess: () => {
        onOpenChange(false)
        router.push('/dashboard')
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Empresa</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir <strong>{company.name}</strong>?
            <br /><br />
            Esta ação irá excluir permanentemente:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Todos os desafios associados</li>
              <li>Todas as análises associadas</li>
              <li>Todos os dados enriquecidos</li>
            </ul>
            <br />
            <strong className="text-red-600">Esta ação não pode ser desfeita.</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
            disabled={deleteCompany.isPending}
          >
            {deleteCompany.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              'Excluir Empresa'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
