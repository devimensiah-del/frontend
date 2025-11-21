'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, FileText, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSubmissions } from '@/lib/hooks/use-submissions';

// Status badge variant mapping
const getStatusVariant = (status: string): 'default' | 'primary' | 'success' | 'warning' | 'error' => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'processing':
      return 'primary';
    case 'pending':
      return 'warning';
    case 'failed':
      return 'error';
    default:
      return 'default';
  }
};

// Status label mapping
const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'Concluído';
    case 'processing':
      return 'Processando';
    case 'pending':
      return 'Pendente';
    case 'failed':
      return 'Falhou';
    default:
      return status;
  }
};

// Format date to Brazilian format
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export default function EnviosPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { submissions, isLoading, error } = useSubmissions();

  // Filter submissions based on search query
  const filteredSubmissions = submissions.filter((submission) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      submission.id.toLowerCase().includes(searchLower) ||
      submission.personalInfo.fullName.toLowerCase().includes(searchLower) ||
      submission.personalInfo.email.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Link href="/painel" className="hover:text-[#00a859]">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Envios</span>
      </div>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meus Envios</h1>
          <p className="text-gray-600 mt-2">
            Acompanhe todas as suas análises solicitadas.
          </p>
        </div>
        <Link href="/nova-analise">
          <Button className="bg-[#00a859] hover:bg-[#008a47] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nova Análise
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar por ID, nome ou email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Error State */}
      {error && (
        <Alert variant="error">
          <AlertDescription>
            Erro ao carregar envios: {error.message}. Tente novamente mais tarde.
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card className="p-6">
          <div className="space-y-4">
            <Skeleton height={40} />
            <Skeleton height={40} />
            <Skeleton height={40} />
          </div>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredSubmissions.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchQuery ? 'Nenhum resultado encontrado' : 'Nenhum envio ainda'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? 'Tente ajustar sua busca ou limpar os filtros.'
              : 'Você ainda não solicitou nenhuma análise. Comece agora!'}
          </p>
          {!searchQuery && (
            <Link href="/nova-analise">
              <Button className="bg-[#00a859] hover:bg-[#008a47] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Solicitar Primeira Análise
              </Button>
            </Link>
          )}
        </Card>
      )}

      {/* Submissions Table */}
      {!isLoading && !error && filteredSubmissions.length > 0 && (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome da Empresa</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Envio</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.map((submission) => {
                // Extract company name from notes JSON
                let companyName = 'N/A';
                try {
                  const notes = JSON.parse(submission.notes || '{}');
                  companyName = notes.companyName || submission.personalInfo.fullName;
                } catch {
                  companyName = submission.personalInfo.fullName;
                }

                return (
                  <TableRow
                    key={submission.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => router.push(`/envios/${submission.id}`)}
                  >
                    <TableCell className="font-mono text-sm">
                      {submission.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell className="font-medium">{companyName}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(submission.status)} size="sm">
                        {getStatusLabel(submission.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {formatDate(submission.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/envios/${submission.id}`);
                        }}
                      >
                        Ver Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Results Count */}
      {!isLoading && !error && filteredSubmissions.length > 0 && (
        <p className="text-sm text-gray-600 text-center">
          Mostrando {filteredSubmissions.length} de {submissions.length} envio(s)
        </p>
      )}
    </div>
  );
}
