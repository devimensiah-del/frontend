'use client';

import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const statusConfig: Record<
  string,
  {
    label: string;
    variant: string;
    icon: any;
    className: string;
  }
> = {
  pending: {
    label: 'Pendente',
    variant: 'outline',
    icon: Clock,
    className: 'bg-gray-50 text-gray-700 border-gray-300',
  },
  processing: {
    label: 'Processando',
    variant: 'default',
    icon: Clock,
    className: 'bg-blue-50 text-blue-700 border-blue-300',
  },
  completed: {
    label: 'Concluído',
    variant: 'default',
    icon: CheckCircle,
    className: 'bg-green-50 text-green-700 border-green-300',
  },
  approved: {
    label: 'Aprovado',
    variant: 'default',
    icon: CheckCircle,
    className: 'bg-gold-50 text-gold-700 border-gold-300',
  },
  sent: {
    label: 'Enviado',
    variant: 'default',
    icon: Send,
    className: 'bg-blue-50 text-blue-700 border-blue-300',
  },
  failed: {
    label: 'Erro',
    variant: 'destructive',
    icon: AlertCircle,
    className: 'bg-red-50 text-red-700 border-red-300',
  },
  received: {
    label: 'Recebido',
    variant: 'default',
    icon: CheckCircle,
    className: 'bg-green-50 text-green-700 border-green-300',
  },
};

export function StatusBadge({
  status,
  size = 'md',
  showIcon = true,
  className,
}: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <Badge
      className={cn(
        'border font-medium gap-1.5',
        config.className,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon className={cn(
        size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'
      )} />}
      {config.label}
    </Badge>
  );
}
