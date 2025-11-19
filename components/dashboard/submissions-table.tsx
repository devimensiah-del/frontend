'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, FileText, Download, Share2, ExternalLink } from 'lucide-react';
import { StatusBadge } from './status-badge';
import { ReportModal } from './report-modal';
import { ShareModal } from './share-modal';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Submission {
  id: string;
  company_name: string;
  created_at: string;
  status: string;
  payment_status: string;
  report_url?: string;
  pdf_url?: string;
}

interface SubmissionsTableProps {
  submissions: Submission[];
}

export function SubmissionsTable({ submissions }: SubmissionsTableProps) {
  const [selectedReport, setSelectedReport] = useState<Submission | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const openReport = (submission: Submission) => {
    setSelectedReport(submission);
  };

  const downloadPDF = async (submission: Submission) => {
    if (submission.pdf_url) {
      window.open(submission.pdf_url, '_blank');
    }
  };

  const shareReport = (submission: Submission) => {
    setSelectedSubmission(submission);
    setShareModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: ptBR
    });
  };

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Nenhum relatório ainda
        </h3>
        <p className="text-gray-600">
          Solicite seu primeiro diagnóstico para começar
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{submission.company_name}</TableCell>
                <TableCell>{formatDate(submission.created_at)}</TableCell>
                <TableCell>
                  <StatusBadge status={submission.status} type="submission" />
                </TableCell>
                <TableCell>
                  <StatusBadge status={submission.payment_status} type="payment" />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {submission.status === 'delivered' && (
                        <>
                          <DropdownMenuItem onClick={() => openReport(submission)}>
                            <FileText className="mr-2 h-4 w-4" />
                            Ver Relatório
                          </DropdownMenuItem>
                          {submission.pdf_url && (
                            <DropdownMenuItem onClick={() => downloadPDF(submission)}>
                              <Download className="mr-2 h-4 w-4" />
                              Baixar PDF
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => shareReport(submission)}>
                            <Share2 className="mr-2 h-4 w-4" />
                            Compartilhar
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem onClick={() => window.location.href = `/dashboard/submissions/${submission.id}`}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Ver Detalhes
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {submissions.map((submission) => (
          <div key={submission.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{submission.company_name}</h3>
                <p className="text-sm text-gray-600">{formatDate(submission.created_at)}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {submission.status === 'delivered' && (
                    <>
                      <DropdownMenuItem onClick={() => openReport(submission)}>
                        <FileText className="mr-2 h-4 w-4" />
                        Ver Relatório
                      </DropdownMenuItem>
                      {submission.pdf_url && (
                        <DropdownMenuItem onClick={() => downloadPDF(submission)}>
                          <Download className="mr-2 h-4 w-4" />
                          Baixar PDF
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => shareReport(submission)}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Compartilhar
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem onClick={() => window.location.href = `/dashboard/submissions/${submission.id}`}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Ver Detalhes
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex gap-2">
              <StatusBadge status={submission.status} type="submission" />
              <StatusBadge status={submission.payment_status} type="payment" />
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {selectedReport && (
        <ReportModal
          submission={selectedReport}
          open={!!selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
      {selectedSubmission && (
        <ShareModal
          submission={selectedSubmission}
          open={shareModalOpen}
          onClose={() => {
            setShareModalOpen(false);
            setSelectedSubmission(null);
          }}
        />
      )}
    </>
  );
}
