'use client'

import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useRetryAnalysis } from '@/lib/hooks/use-admin'

interface RetryAnalysisButtonProps {
  submissionId: string
  companyName: string
}

export function RetryAnalysisButton({
  submissionId,
  companyName,
}: RetryAnalysisButtonProps) {
  const retryAnalysis = useRetryAnalysis()

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={retryAnalysis.isPending}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Retentar Análise
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Retentar Análise</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja retentar a análise para <strong>{companyName}</strong>?
            <br />
            <br />
            Isso criará um novo job de análise para esta submissão.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => retryAnalysis.mutate(submissionId)}
            disabled={retryAnalysis.isPending}
          >
            {retryAnalysis.isPending ? 'Retentando...' : 'Retentar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
