'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

interface Submission {
  id: string;
  company_name: string;
  email: string;
  created_at: string;
  status: string;
  payment_status: string;
  enrichment_status?: string;
}

interface AdminSubmissionsTableProps {
  submissions: Submission[];
  onSelectionChange?: (selectedIds: string[]) => void;
}

type SortField = 'company_name' | 'created_at' | 'status' | 'payment_status';
type SortDirection = 'asc' | 'desc';

export function AdminSubmissionsTable({ submissions, onSelectionChange }: AdminSubmissionsTableProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedSubmissions = [...submissions].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const direction = sortDirection === 'asc' ? 1 : -1;

    if (sortField === 'created_at') {
      return (new Date(aValue).getTime() - new Date(bValue).getTime()) * direction;
    }

    return (aValue > bValue ? 1 : -1) * direction;
  });

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
    onSelectionChange?.(Array.from(newSelected));
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === submissions.length) {
      setSelectedIds(new Set());
      onSelectionChange?.([]);
    } else {
      const allIds = new Set(submissions.map(s => s.id));
      setSelectedIds(allIds);
      onSelectionChange?.(Array.from(allIds));
    }
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: ptBR
    });
  };

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Nenhuma submissão encontrada
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk actions bar */}
      {selectedIds.size > 0 && (
        <div className="bg-[hsl(195_100%_8%)]/10 border border-[hsl(195_100%_8%)]/20 rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm font-medium">
            {selectedIds.size} {selectedIds.size === 1 ? 'item selecionado' : 'itens selecionados'}
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">Exportar</Button>
            <Button size="sm" variant="outline">Atualizar Status</Button>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedIds.size === submissions.length}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSort('company_name')}
                  className="flex items-center gap-1 hover:bg-gray-100"
                >
                  Empresa
                  <SortIcon field="company_name" />
                </Button>
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSort('created_at')}
                  className="flex items-center gap-1 hover:bg-gray-100"
                >
                  Data
                  <SortIcon field="created_at" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSort('status')}
                  className="flex items-center gap-1 hover:bg-gray-100"
                >
                  Status
                  <SortIcon field="status" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSort('payment_status')}
                  className="flex items-center gap-1 hover:bg-gray-100"
                >
                  Pagamento
                  <SortIcon field="payment_status" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSubmissions.map((submission) => (
              <>
                <TableRow
                  key={submission.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleExpand(submission.id)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.has(submission.id)}
                      onCheckedChange={() => toggleSelect(submission.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{submission.company_name}</TableCell>
                  <TableCell className="text-sm text-gray-600">{submission.email}</TableCell>
                  <TableCell className="text-sm">{formatDate(submission.created_at)}</TableCell>
                  <TableCell>
                    <StatusBadge status={submission.status} type="submission" />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={submission.payment_status} type="payment" />
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/admin/submissions/${submission.id}`)}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedRows.has(submission.id) && (
                  <TableRow>
                    <TableCell colSpan={7} className="bg-gray-50">
                      <div className="p-4 space-y-2 text-sm">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <span className="font-semibold">ID:</span> {submission.id}
                          </div>
                          <div>
                            <span className="font-semibold">Email:</span> {submission.email}
                          </div>
                          <div>
                            <span className="font-semibold">Enriquecimento:</span>{' '}
                            {submission.enrichment_status || 'N/A'}
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/admin/submissions/${submission.id}`)}
                          >
                            Ver Detalhes Completos
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {sortedSubmissions.map((submission) => (
          <div
            key={submission.id}
            className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <Checkbox
                  checked={selectedIds.has(submission.id)}
                  onCheckedChange={() => toggleSelect(submission.id)}
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{submission.company_name}</h3>
                  <p className="text-sm text-gray-600">{submission.email}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(submission.created_at)}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <StatusBadge status={submission.status} type="submission" />
              <StatusBadge status={submission.payment_status} type="payment" />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => router.push(`/admin/submissions/${submission.id}`)}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Ver Detalhes
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
