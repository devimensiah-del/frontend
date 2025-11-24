'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import {
  Calendar,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  Clock
} from 'lucide-react';
import type { Enrichment } from '@/types';
import { formatDateMobile } from '@/lib/utils/mobile';

interface MobileEnrichmentCardProps {
  enrichment: Enrichment;
  showActions?: boolean;
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  draft: 'Rascunho',
  approved: 'Aprovado',
  finished: 'Concluído',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  draft: 'bg-gray-100 text-gray-700 border-gray-200',
  approved: 'bg-green-100 text-green-700 border-green-200',
  finished: 'bg-gold-100 text-gold-700 border-gold-200',
};

export function MobileEnrichmentCard({
  enrichment,
  showActions = true
}: MobileEnrichmentCardProps) {
  const qualityScore = enrichment.progress
    ? enrichment.progress.toFixed(0)
    : '0';

  return (
    <Link href={`/admin/enriquecimento/${enrichment.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        {/* Header: Status + Quality Score */}
        <div className="flex items-start justify-between p-4 border-b border-line">
          <div className="flex-1 min-w-0 mr-3">
            <h3 className="font-medium text-navy-900 text-base sm:text-lg">
              Enriquecimento
            </h3>
            <p className="text-xs text-text-secondary truncate mt-0.5">
              ID: {enrichment.id.substring(0, 8)}...
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge
              className={cn(
                "text-[10px] px-2 py-0.5 border flex-shrink-0",
                STATUS_COLORS[enrichment.status] || STATUS_COLORS.pending
              )}
            >
              {STATUS_LABELS[enrichment.status] || enrichment.status}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-text-secondary">
              <TrendingUp className="w-3 h-3" />
              <span className="font-medium">{qualityScore}%</span>
            </div>
          </div>
        </div>

        {/* Body: Key Info */}
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-text-secondary flex-shrink-0" />
            <span className="text-text-secondary">
              Atualizado {formatDateMobile(enrichment.updatedAt)}
            </span>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-surface-paper p-2 rounded">
              <div className="flex items-center gap-1 text-xs text-text-secondary mb-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Overview</span>
              </div>
              <p className="text-sm font-medium text-navy-900">
                {enrichment.data?.overview ? 'Completo' : 'Pendente'}
              </p>
            </div>
            <div className="bg-surface-paper p-2 rounded">
              <div className="flex items-center gap-1 text-xs text-text-secondary mb-1">
                <Clock className="w-3 h-3" />
                <span>Digital</span>
              </div>
              <p className="text-sm font-medium text-navy-900">
                {enrichment.data?.digitalPresence ? 'Completo' : 'Pendente'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer: CTA */}
        {showActions && (
          <div className="p-4 pt-0">
            <Button
              variant="outline"
              size="sm"
              className="w-full min-h-[44px]"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <span>Editar Enriquecimento</span>
              <ChevronRight className="w-4 h-4 ml-auto" />
            </Button>
          </div>
        )}
      </Card>
    </Link>
  );
}
