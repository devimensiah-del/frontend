/**
 * Conflict Detector Component
 *
 * Visualizes data conflicts and inconsistencies detected during enrichment.
 * Helps admin reviewers identify and resolve data quality issues.
 *
 * @module components/admin/conflict-detector
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import { cn } from '@/lib/design';
import type { DataConflict } from '@/types';

/**
 * Conflict Detector Props
 */
interface ConflictDetectorProps {
  /** Array of detected conflicts */
  conflicts: DataConflict[];
  /** Callback when conflict is resolved */
  onResolveConflict?: (conflictField: string, chosenValue: string) => void;
  /** Whether component is in read-only mode */
  readOnly?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Conflict Detector Component
 *
 * Displays data conflicts with:
 * - Visual severity indicators
 * - Side-by-side value comparison
 * - Source attribution
 * - Resolution actions (if not read-only)
 *
 * @example
 * ```tsx
 * <ConflictDetector
 *   conflicts={submission.conflicts}
 *   onResolveConflict={(field, value) => {
 *     // Update submission with chosen value
 *   }}
 * />
 * ```
 */
export function ConflictDetector({
  conflicts,
  onResolveConflict,
  readOnly = false,
  className,
}: ConflictDetectorProps) {
  // No conflicts - show success message
  if (!conflicts || conflicts.length === 0) {
    return (
      <Card className={cn('border-green-200 bg-green-50', className)}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-900">Nenhum conflito detectado</p>
              <p className="text-sm text-green-700">
                Todos os dados coletados são consistentes entre as fontes
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  /**
   * Get severity badge styling
   */
  const getSeverityBadge = (severity: DataConflict['severity']) => {
    const styles = {
      low: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      medium: 'bg-orange-100 text-orange-800 border-orange-300',
      high: 'bg-red-100 text-red-800 border-red-300',
    };
    return styles[severity];
  };

  /**
   * Get severity icon
   */
  const getSeverityIcon = (severity: DataConflict['severity']) => {
    switch (severity) {
      case 'high':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'low':
        return <Info className="w-5 h-5 text-yellow-600" />;
    }
  };

  // Count by severity
  const severityCounts = conflicts.reduce(
    (acc, conflict) => {
      acc[conflict.severity]++;
      return acc;
    },
    { low: 0, medium: 0, high: 0 }
  );

  return (
    <div className={cn('space-y-4', className)}>
      {/* Summary Alert */}
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <div className="font-semibold mb-1">
            {conflicts.length} {conflicts.length === 1 ? 'conflito detectado' : 'conflitos detectados'}
          </div>
          <div className="text-sm flex gap-4">
            {severityCounts.high > 0 && (
              <span>Alta: {severityCounts.high}</span>
            )}
            {severityCounts.medium > 0 && (
              <span>Média: {severityCounts.medium}</span>
            )}
            {severityCounts.low > 0 && (
              <span>Baixa: {severityCounts.low}</span>
            )}
          </div>
        </AlertDescription>
      </Alert>

      {/* Conflict List */}
      <div className="space-y-3">
        {conflicts.map((conflict, index) => (
          <Card key={index} className="border-2 border-red-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getSeverityIcon(conflict.severity)}
                  <div>
                    <CardTitle className="text-base">{conflict.field}</CardTitle>
                    <CardDescription>{conflict.description}</CardDescription>
                  </div>
                </div>
                <Badge className={cn('border', getSeverityBadge(conflict.severity))}>
                  {conflict.severity === 'high'
                    ? 'Alta Prioridade'
                    : conflict.severity === 'medium'
                    ? 'Média Prioridade'
                    : 'Baixa Prioridade'}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Value Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Submitted Value */}
                <div className="p-4 rounded-lg border-2 border-gray-300 bg-gray-50">
                  <div className="text-xs font-semibold text-gray-600 mb-2">
                    VALOR SUBMETIDO
                  </div>
                  <div className="text-sm font-mono break-all">
                    {conflict.submitted_value || (
                      <span className="text-gray-400">Não fornecido</span>
                    )}
                  </div>
                </div>

                {/* Enriched Value */}
                <div className="p-4 rounded-lg border-2 border-blue-300 bg-blue-50">
                  <div className="text-xs font-semibold text-blue-600 mb-2">
                    VALOR ENCONTRADO
                  </div>
                  <div className="text-sm font-mono break-all">
                    {conflict.enriched_value}
                  </div>
                  <div className="text-xs text-blue-600 mt-2">
                    Fonte: {conflict.source}
                  </div>
                </div>
              </div>

              {/* Resolution Actions */}
              {!readOnly && onResolveConflict && (
                <div className="flex items-center justify-end gap-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onResolveConflict(conflict.field, conflict.submitted_value)
                    }
                  >
                    Usar Submetido
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onResolveConflict(conflict.field, conflict.enriched_value)
                    }
                  >
                    Usar Encontrado
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onResolveConflict(conflict.field, '')}
                  >
                    Revisar Manualmente
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Help Text */}
      <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
        <p className="font-semibold mb-2">Como resolver conflitos:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Alta prioridade:</strong> Conflitos críticos que afetam a qualidade do relatório
          </li>
          <li>
            <strong>Média prioridade:</strong> Inconsistências que podem ser importantes
          </li>
          <li>
            <strong>Baixa prioridade:</strong> Diferenças menores, geralmente de formatação
          </li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Conflict Summary Badge
 *
 * Compact badge showing total conflicts with severity breakdown.
 * Used in tables and lists.
 *
 * @example
 * ```tsx
 * <ConflictSummaryBadge conflicts={submission.conflicts} />
 * ```
 */
interface ConflictSummaryBadgeProps {
  conflicts?: DataConflict[];
  className?: string;
}

export function ConflictSummaryBadge({
  conflicts,
  className,
}: ConflictSummaryBadgeProps) {
  if (!conflicts || conflicts.length === 0) {
    return (
      <Badge variant="outline" className={cn('bg-green-50 text-green-700 border-green-300', className)}>
        <CheckCircle className="w-3 h-3 mr-1" />
        Sem conflitos
      </Badge>
    );
  }

  const highPriority = conflicts.filter((c) => c.severity === 'high').length;

  return (
    <Badge
      variant="outline"
      className={cn(
        'border-red-300',
        highPriority > 0 ? 'bg-red-50 text-red-700' : 'bg-orange-50 text-orange-700',
        className
      )}
    >
      <AlertTriangle className="w-3 h-3 mr-1" />
      {conflicts.length} {conflicts.length === 1 ? 'conflito' : 'conflitos'}
      {highPriority > 0 && ` (${highPriority} alta prioridade)`}
    </Badge>
  );
}
