/**
 * Mobile Submission Card Component
 * Responsive card view for submission lists on mobile devices
 */

import Link from "next/link";
import { getStatusConfig } from "@/lib/config/site";
import { SubmissionStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text, Heading } from "@/components/ui/Typography";

interface MobileSubmissionCardProps {
  id: string;
  companyName: string;
  status: SubmissionStatus;
  createdAt: string;
  href: string;
  showActions?: boolean;
  actionLabel?: string;
}

export function MobileSubmissionCard({
  id,
  companyName,
  status,
  createdAt,
  href,
  showActions = true,
  actionLabel = "Ver Detalhes",
}: MobileSubmissionCardProps) {
  const statusConfig = getStatusConfig(status);
  const formattedDate = new Date(createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Card className="p-4 border border-line hover:border-gold-500/30 transition-colors">
      {/* Header: Company Name + Status Badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <Heading as="h3" className="text-base font-semibold text-navy-900 line-clamp-2 flex-1">
          {companyName}
        </Heading>
        <Badge
          variant={statusConfig.color}
          className={`${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor} border flex-shrink-0`}
        >
          {statusConfig.label}
        </Badge>
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <Text variant="small">{formattedDate}</Text>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-tertiary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
          <Text variant="small" className="font-mono">
            {id.substring(0, 8)}
          </Text>
        </div>
      </div>

      {/* Status Description */}
      <Text variant="small" className="text-text-secondary mb-4">
        {statusConfig.description}
      </Text>

      {/* Actions */}
      {showActions && (
        <Link href={href} className="block">
          <Button
            variant="outline"
            className="w-full justify-center border-gold-500 text-gold-700 hover:bg-gold-50"
          >
            {actionLabel}
          </Button>
        </Link>
      )}
    </Card>
  );
}
