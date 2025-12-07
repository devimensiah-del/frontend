'use client'

import { useState } from 'react'
import { Loader2, Search, Filter, Eye, RotateCcw } from 'lucide-react'
import { useAdminAnalyses, useRetryAnalysis } from '@/lib/hooks/use-admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { VisibilityControls } from '@/components/features/admin'
import type { SubmissionListItem } from '@/lib/types'

const statusColors: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-700',
  processing: 'bg-amber-100 text-amber-700',
  completed: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
}

export default function AdminAnalysesPage() {
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [emailFilter, setEmailFilter] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useAdminAnalyses({
    page,
    pageSize: 20,
    email: emailFilter || undefined,
    status: statusFilter || undefined,
  })

  const retryAnalysis = useRetryAnalysis()

  const analyses = (data as any)?.data || (data as any)?.submissions || []
  const totalPages = (data as any)?.total_pages || 1

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-navy-900">
          Gerenciamento de Análises
        </h1>
        <p className="text-muted-foreground">
          Visualize e gerencie todas as análises do sistema
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Filtrar por email do usuário..."
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="processing">Processando</SelectItem>
            <SelectItem value="completed">Completo</SelectItem>
            <SelectItem value="failed">Falhou</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-line overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Visibilidade</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analyses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Nenhuma análise encontrada
                  </TableCell>
                </TableRow>
              ) : (
                analyses.map((item: SubmissionListItem & { analysisStatus?: string; isVisibleToUser?: boolean; isPublic?: boolean; accessCode?: string }) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs">
                      {item.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>{item.companyName}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          statusColors[item.analysisStatus || 'pending']
                        }
                      >
                        {item.analysisStatus || 'pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <VisibilityControls
                        analysisId={item.id}
                        isVisibleToUser={item.isVisibleToUser}
                        isPublic={item.isPublic}
                        accessCode={item.accessCode}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`/admin/analyses/${item.id}`}>
                            <Eye className="w-4 h-4" />
                          </a>
                        </Button>
                        {item.analysisStatus === 'failed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={retryAnalysis.isPending}
                            onClick={() => retryAnalysis.mutate(item.id)}
                          >
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Próximo
          </Button>
        </div>
      )}
    </div>
  )
}
