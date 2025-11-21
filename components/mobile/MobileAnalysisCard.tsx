/**
 * Mobile Analysis Card Component
 * Responsive card view for analysis lists on mobile devices
 */

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text, Heading } from "@/components/ui/Typography";

interface MobileAnalysisCardProps {
  id: string;
  submissionId: string;
  companyName: string;
  status: string;
  frameworks?: string[];
  createdAt: string;
  href: string;
  showActions?: boolean;
}

export function MobileAnalysisCard({
  id,
  submissionId,
  companyName,
  status,
  frameworks = [],
  createdAt,
  href,
  showActions = true,
}: MobileAnalysisCardProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // Status badge color mapping
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'concluído':
      case 'concluido':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'em_analise':
      case 'em_andamento':
      case 'processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'erro':
      case 'error':
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className="p-4 border border-line hover:border-gold-500/30 transition-colors">
      {/* Header: Company Name + Status */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <Heading as="h3" className="text-base font-semibold text-navy-900 line-clamp-2 flex-1">
          {companyName}
        </Heading>
        <Badge className={`${getStatusColor(status)} border flex-shrink-0`}>
          {status}
        </Badge>
      </div>

      {/* Metadata Row */}
      <div className="flex items-center gap-4 mb-3 text-sm text-text-secondary">
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <Text variant="small">{formattedDate}</Text>
        </div>
        <div className="flex items-center gap-1.5 text-text-tertiary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
          <Text variant="small" className="font-mono">
            {submissionId.substring(0, 8)}
          </Text>
        </div>
      </div>

      {/* Frameworks Used */}
      {frameworks && frameworks.length > 0 && (
        <div className="mb-4">
          <Text variant="small" className="text-text-tertiary mb-2">
            Frameworks:
          </Text>
          <div className="flex flex-wrap gap-2">
            {frameworks.map((framework, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs bg-navy-50 text-navy-700 border-navy-200"
              >
                {framework}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <Link href={href} className="block">
          <Button
            variant="outline"
            className="w-full justify-center border-gold-500 text-gold-700 hover:bg-gold-50"
          >
            Editar Análise
          </Button>
        </Link>
      )}
    </Card>
  );
}
