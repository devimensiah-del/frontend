'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/design';

interface StatusBadgeProps {
  status: string;
  type?: 'submission' | 'payment';
}

const submissionStatusConfig = {
  queued: { label: 'Na Fila', color: 'bg-gray-200 text-gray-800' },
  collecting_data: { label: 'Coletando Dados', color: 'bg-[hsl(195_100%_8%)]/20 text-[hsl(195_100%_8%)]' },
  analyzing: { label: 'Analisando', color: 'bg-[hsl(195_100%_8%)]/30 text-[hsl(195_100%_8%)]' },
  analysis_complete: { label: 'Análise Concluída', color: 'bg-[hsl(195_100%_8%)]/20 text-[hsl(195_100%_8%)]' },
  in_review: { label: 'Em Revisão', color: 'bg-yellow-200 text-yellow-800' },
  approved: { label: 'Aprovado', color: 'bg-green-200 text-green-800' },
  delivered: { label: 'Entregue', color: 'bg-green-600 text-white' },
  failed: { label: 'Falhou', color: 'bg-red-200 text-red-800' },
};

const paymentStatusConfig = {
  unpaid: { label: 'Não Pago', color: 'bg-gray-200 text-gray-800' },
  pending: { label: 'Pendente', color: 'bg-yellow-200 text-yellow-800' },
  paid: { label: 'Pago', color: 'bg-green-200 text-green-800' },
  refunded: { label: 'Reembolsado', color: 'bg-orange-200 text-orange-800' },
  failed: { label: 'Falhou', color: 'bg-red-200 text-red-800' },
};

export function StatusBadge({ status, type = 'submission' }: StatusBadgeProps) {
  const config = type === 'submission' ? submissionStatusConfig : paymentStatusConfig;
  const statusInfo = config[status as keyof typeof config] || {
    label: status,
    color: 'bg-gray-200 text-gray-800'
  };

  return (
    <Badge className={`${statusInfo.color} hover:opacity-80 transition-opacity`}>
      {statusInfo.label}
    </Badge>
  );
}
