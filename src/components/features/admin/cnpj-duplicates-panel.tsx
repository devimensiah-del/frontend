'use client'

import { useState } from 'react'
import { useCNPJDuplicates, useMergeCompanies } from '@/lib/hooks/use-admin'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
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
import { Building2, ArrowRight, Merge, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'
import type { CNPJDuplicateReview } from '@/lib/services/admin-service'

function formatCNPJ(cnpj: string): string {
  // Format: XX.XXX.XXX/XXXX-XX
  if (cnpj.length !== 14) return cnpj
  return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12)}`
}

interface DuplicateCardProps {
  duplicate: CNPJDuplicateReview
  onMerge: (targetId: string, sourceId: string) => void
  isPending: boolean
}

function DuplicateCard({ duplicate, onMerge, isPending }: DuplicateCardProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  const olderCompany = duplicate.older_company
  const newerCompany = duplicate.newer_company

  const handleMerge = () => {
    onMerge(duplicate.older_company_id, duplicate.newer_company_id)
    setShowConfirm(false)
  }

  return (
    <>
      <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <CardTitle className="text-base">CNPJ Duplicado</CardTitle>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              {formatCNPJ(duplicate.cnpj_normalized)}
            </Badge>
          </div>
          <CardDescription>
            Detectado {formatDistanceToNow(new Date(duplicate.created_at), { addSuffix: true, locale: ptBR })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {/* Older Company (Target) */}
            <div className="flex-1 p-3 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950/30 dark:border-green-800">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-700 dark:text-green-400">Manter (mais antiga)</span>
              </div>
              <Link
                href={`/admin/companies/${duplicate.older_company_id}`}
                className="font-medium hover:underline text-sm"
              >
                {olderCompany?.name || 'Carregando...'}
              </Link>
              {olderCompany && (
                <p className="text-xs text-muted-foreground mt-1">
                  Criada em {new Date(olderCompany.created_at).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>

            <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />

            {/* Newer Company (Source - will be deleted) */}
            <div className="flex-1 p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-950/30 dark:border-red-800">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-4 h-4 text-red-600" />
                <span className="text-xs font-medium text-red-700 dark:text-red-400">Remover (mais recente)</span>
              </div>
              <Link
                href={`/admin/companies/${duplicate.newer_company_id}`}
                className="font-medium hover:underline text-sm"
              >
                {newerCompany?.name || 'Carregando...'}
              </Link>
              {newerCompany && (
                <p className="text-xs text-muted-foreground mt-1">
                  Criada em {new Date(newerCompany.created_at).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              size="sm"
              onClick={() => setShowConfirm(true)}
              disabled={isPending}
              className="gap-2"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Merge className="w-4 h-4" />
              )}
              Mesclar Empresas
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Mesclagem</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>Esta acao ira:</p>
              <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                <li>Mover todas as submissoes e desafios para a empresa mais antiga</li>
                <li>Excluir a empresa mais recente ({newerCompany?.name})</li>
                <li>Esta acao nao pode ser desfeita</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleMerge} className="bg-red-600 hover:bg-red-700">
              Confirmar Mesclagem
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export function CNPJDuplicatesPanel() {
  const { data, isLoading, error } = useCNPJDuplicates()
  const mergeCompanies = useMergeCompanies()

  const handleMerge = (targetId: string, sourceId: string) => {
    mergeCompanies.mutate({ targetId, sourceId })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="py-6">
          <p className="text-red-600">Erro ao carregar duplicatas: {error.message}</p>
        </CardContent>
      </Card>
    )
  }

  const duplicates = data?.duplicates || []
  const pendingDuplicates = duplicates.filter(d => !d.reviewed_at)

  if (pendingDuplicates.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
        <CardContent className="py-6">
          <div className="flex items-center gap-3 text-green-700 dark:text-green-400">
            <CheckCircle2 className="w-5 h-5" />
            <p>Nenhuma duplicata de CNPJ pendente de revisao.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Duplicatas de CNPJ</h3>
        <Badge variant="warning">{pendingDuplicates.length} pendente(s)</Badge>
      </div>

      <div className="space-y-4">
        {pendingDuplicates.map((duplicate) => (
          <DuplicateCard
            key={duplicate.id}
            duplicate={duplicate}
            onMerge={handleMerge}
            isPending={mergeCompanies.isPending}
          />
        ))}
      </div>
    </div>
  )
}
