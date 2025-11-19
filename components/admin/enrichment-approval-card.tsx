'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import { cn } from '@/lib/design';

interface EnrichmentField {
  name: string;
  label: string;
  value: string | number | boolean | null;
  confidence: number;
  source: string;
  category: 'website' | 'linkedin' | 'social' | 'brazil_db' | 'other';
}

interface EnrichmentData {
  fields: EnrichmentField[];
  overall_confidence: number;
  total_fields: number;
  filled_fields: number;
  high_confidence_fields: number;
  missing_fields: EnrichmentField[];
}

interface EnrichmentApprovalCardProps {
  submissionId: string;
  onApprove: () => void;
  isApproving: boolean;
}

export function EnrichmentApprovalCard({
  submissionId,
  onApprove,
  isApproving,
}: EnrichmentApprovalCardProps) {
  const [data, setData] = useState<EnrichmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEnrichmentData() {
      try {
        setLoading(true);
        setError(null);

        // Get JWT token from localStorage or auth context
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token de autenticação não encontrado');
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/submissions/${submissionId}/enrichment`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Erro ao buscar dados: ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }

    fetchEnrichmentData();
  }, [submissionId]);

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 90) {
      return {
        variant: 'default' as const,
        className: 'bg-green-100 text-green-800 border-green-300',
        label: 'Alta',
      };
    }
    if (confidence >= 70) {
      return {
        variant: 'secondary' as const,
        className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        label: 'Média',
      };
    }
    return {
      variant: 'destructive' as const,
      className: 'bg-red-100 text-red-800 border-red-300',
      label: 'Baixa',
    };
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'website':
        return '🌐';
      case 'linkedin':
        return '💼';
      case 'social':
        return '📱';
      case 'brazil_db':
        return '🇧🇷';
      default:
        return '📊';
    }
  };

  const renderValue = (value: string | number | boolean | null) => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-gray-400 italic">Não disponível</span>;
    }
    if (typeof value === 'boolean') {
      return value ? 'Sim' : 'Não';
    }
    return String(value);
  };

  // Loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            Erro ao Carregar Dados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // No data state
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dados de Enriquecimento</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Sem Dados</AlertTitle>
            <AlertDescription>
              Nenhum dado de enriquecimento disponível para esta submissão.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const qualityPercentage = (data.filled_fields / data.total_fields) * 100;
  const highConfidencePercentage = (data.high_confidence_fields / data.filled_fields) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Dados de Enriquecimento</span>
          <Badge
            className={getConfidenceBadge(data.overall_confidence).className}
            variant={getConfidenceBadge(data.overall_confidence).variant}
          >
            {data.overall_confidence.toFixed(0)}% Confiança Geral
          </Badge>
        </CardTitle>
        <CardDescription>
          {data.filled_fields}/{data.total_fields} campos preenchidos ({qualityPercentage.toFixed(0)}%)
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Quality Assessment */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Qualidade Geral</span>
            <span className="text-sm text-gray-600">
              {data.high_confidence_fields} campos com alta confiança (≥90%)
            </span>
          </div>
          <Progress value={data.overall_confidence} className="h-3" />
          <div className="flex items-center gap-2 text-sm">
            {data.overall_confidence >= 90 ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : data.overall_confidence >= 70 ? (
              <Info className="w-4 h-4 text-yellow-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600" />
            )}
            <span className="text-gray-600">
              {data.overall_confidence >= 90
                ? 'Excelente qualidade de dados'
                : data.overall_confidence >= 70
                ? 'Boa qualidade, pode requerer verificação'
                : 'Qualidade limitada, verificação manual recomendada'}
            </span>
          </div>
        </div>

        {/* High Confidence Fields Table */}
        {data.fields.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Campos Coletados
            </h3>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Campo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead className="w-[120px]">Confiança</TableHead>
                    <TableHead className="w-[150px]">Fonte</TableHead>
                    <TableHead className="w-[100px]">Categoria</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.fields.map((field, index) => {
                    const badge = getConfidenceBadge(field.confidence);
                    return (
                      <TableRow
                        key={index}
                        className={cn(
                          'hover:bg-gray-50',
                          field.confidence >= 90 && 'bg-green-50/30'
                        )}
                      >
                        <TableCell className="font-medium">{field.label}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {renderValue(field.value)}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge className={badge.className} variant={badge.variant}>
                              {field.confidence.toFixed(0)}%
                            </Badge>
                            <Progress value={field.confidence} className="h-1.5 w-20" />
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-gray-600">
                          {field.source}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {getCategoryIcon(field.category)} {field.category}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Missing Fields Warning */}
        {data.missing_fields.length > 0 && (
          <Alert variant="destructive" className="bg-orange-50 border-orange-300">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertTitle className="text-orange-800">
              Campos com Baixa Confiança ou Faltando ({data.missing_fields.length})
            </AlertTitle>
            <AlertDescription className="text-orange-700">
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                {data.missing_fields.map((field, index) => (
                  <li key={index}>
                    <strong>{field.label}</strong>:{' '}
                    {field.confidence < 90
                      ? `Confiança baixa (${field.confidence.toFixed(0)}%)`
                      : 'Não disponível'}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Quality Summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-sm">Resumo da Qualidade</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-600">Campos Preenchidos</div>
              <div className="text-xl font-bold text-[hsl(195_100%_8%)]">
                {data.filled_fields}/{data.total_fields}
              </div>
            </div>
            <div>
              <div className="text-gray-600">Alta Confiança</div>
              <div className="text-xl font-bold text-green-600">
                {data.high_confidence_fields}
              </div>
            </div>
            <div>
              <div className="text-gray-600">Confiança Média</div>
              <div className="text-xl font-bold text-[hsl(45_100%_55%)]">
                {data.overall_confidence.toFixed(0)}%
              </div>
            </div>
          </div>
        </div>

        {/* Approve Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button
            onClick={onApprove}
            disabled={isApproving || data.overall_confidence < 50}
            className="bg-[hsl(195_100%_8%)] hover:bg-[hsl(195_100%_8%)]/90 text-white"
          >
            {isApproving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Aprovando...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Aprovar Enriquecimento
              </>
            )}
          </Button>
        </div>

        {data.overall_confidence < 50 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Confiança Insuficiente</AlertTitle>
            <AlertDescription>
              A confiança geral está abaixo de 50%. Recomenda-se coletar mais dados ou
              realizar verificação manual antes de aprovar.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
