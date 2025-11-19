'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Printer, Share2, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/design';

interface ReportModalProps {
  submission: {
    id: string;
    company_name: string;
    pdf_url?: string;
  };
  open: boolean;
  onClose: () => void;
}

export function ReportModal({ submission, open, onClose }: ReportModalProps) {
  const { toast } = useToast();
  const [markdown, setMarkdown] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetchReport();
    }
  }, [open, submission.id]);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Sessão expirada. Por favor, faça login novamente.',
        });
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/dashboard/submissions/${submission.id}/report`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Sessão expirada. Por favor, faça login novamente.',
        });
        return;
      }

      if (!response.ok) throw new Error('Erro ao carregar relatório');

      const data = await response.json();
      setMarkdown(data.markdown || '# Relatório não disponível');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao carregar relatório',
      });
      setMarkdown('# Erro ao carregar relatório\n\nTente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (submission.pdf_url) {
      window.open(submission.pdf_url, '_blank');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Relatório: {submission.company_name}
          </DialogTitle>
          <DialogDescription>
            Relatório estratégico completo gerado pela IMENSIAH
          </DialogDescription>
        </DialogHeader>

        {/* Action buttons */}
        <div className="flex gap-2 border-b pb-4">
          {submission.pdf_url && (
            <Button onClick={handleDownloadPDF} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Baixar PDF
            </Button>
          )}
          <Button onClick={handlePrint} variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button onClick={onClose} variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Compartilhar
          </Button>
        </div>

        {/* Report content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[hsl(195_100%_8%)]" />
            </div>
          ) : (
            <div className="prose prose-sm md:prose-base max-w-none p-6">
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
