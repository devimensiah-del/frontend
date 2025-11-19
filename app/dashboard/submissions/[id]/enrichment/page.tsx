'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowLeft,
  TrendingUp,
  Database,
  Edit,
  Info,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface HighConfidenceField {
  name: string;
  value: string;
  confidence: number;
  source: string;
  category: string;
}

interface MissingField {
  name: string;
  confidence: number;
  can_override: boolean;
  category: string;
  reason: string;
}

interface EnrichmentData {
  submission_id: string;
  status: string;
  high_confidence_fields: HighConfidenceField[];
  missing_fields: MissingField[];
  overall_confidence: number;
  can_fill_missing: boolean;
}

export default function EnrichmentPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.id as string;

  const [data, setData] = useState<EnrichmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string>('');

  useEffect(() => {
    fetchEnrichmentData();
  }, [submissionId]);

  const fetchEnrichmentData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/dashboard/submissions/${submissionId}/enrichment`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Falha ao carregar dados de enriquecimento');
      }

      const enrichmentData = await response.json();
      setData(enrichmentData);

      // Extract company name from high confidence fields
      const companyField = enrichmentData.high_confidence_fields.find(
        (f: HighConfidenceField) =>
          f.name === 'company_name' || f.name === 'razao_social'
      );
      setCompanyName(companyField?.value || 'Empresa');
    } catch (err) {
      console.error('Error fetching enrichment data:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Erro ao carregar dados de enriquecimento'
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      { label: string; variant: 'default' | 'destructive' | 'outline' | 'secondary'; icon: any }
    > = {
      approved: {
        label: 'Aprovado',
        variant: 'default',
        icon: CheckCircle2,
      },
      pending: {
        label: 'Pendente',
        variant: 'outline',
        icon: Clock,
      },
      rejected: {
        label: 'Rejeitado',
        variant: 'destructive',
        icon: XCircle,
      },
      needs_review: {
        label: 'Requer Revisão',
        variant: 'secondary',
        icon: AlertTriangle,
      },
    };

    const config = statusMap[status] || statusMap.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 95) {
      return <Badge className="bg-green-600">Muito Alta ({confidence}%)</Badge>;
    } else if (confidence >= 90) {
      return <Badge className="bg-blue-600">Alta ({confidence}%)</Badge>;
    } else if (confidence >= 70) {
      return <Badge variant="secondary">Média ({confidence}%)</Badge>;
    } else {
      return <Badge variant="outline">Baixa ({confidence}%)</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, any> = {
      financial: TrendingUp,
      legal: Database,
      contact: Info,
      general: Database,
    };
    return iconMap[category.toLowerCase()] || Database;
  };

  const formatFieldName = (name: string): string => {
    const fieldMap: Record<string, string> = {
      company_name: 'Nome da Empresa',
      razao_social: 'Razão Social',
      cnpj: 'CNPJ',
      revenue: 'Faturamento',
      employees: 'Número de Funcionários',
      industry: 'Setor',
      address: 'Endereço',
      phone: 'Telefone',
      email: 'E-mail',
      website: 'Website',
      legal_nature: 'Natureza Jurídica',
      opening_date: 'Data de Abertura',
      capital_social: 'Capital Social',
      main_activity: 'Atividade Principal',
    };

    return fieldMap[name] || name.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const handleFillMissing = (fieldName: string) => {
    // Navigate to edit page with field pre-selected
    router.push(`/dashboard/submissions/${submissionId}/edit?field=${fieldName}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            {error || 'Não foi possível carregar os dados de enriquecimento.'}
          </AlertDescription>
        </Alert>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push('/dashboard')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push('/dashboard')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Dashboard
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {companyName}
            </h1>
            <p className="text-gray-600">Dados de Enriquecimento</p>
          </div>
          <div>{getStatusBadge(data.status)}</div>
        </div>
      </div>

      {/* Overall Confidence Card */}
      <Card className="mb-6 border-l-4 border-l-blue-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Confiança Geral dos Dados
          </CardTitle>
          <CardDescription>
            Baseado em {data.high_confidence_fields.length} campos de alta
            confiança
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-gray-900">
                {data.overall_confidence.toFixed(1)}%
              </span>
              {getConfidenceBadge(data.overall_confidence)}
            </div>
            <Progress value={data.overall_confidence} className="h-3" />
            <p className="text-sm text-gray-600">
              {data.high_confidence_fields.length} campos com confiança ≥90% •{' '}
              {data.missing_fields.length} campos faltando ou com baixa confiança
            </p>
          </div>
        </CardContent>
      </Card>

      {/* High Confidence Fields Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Dados de Alta Confiança (≥90%)
          </CardTitle>
          <CardDescription>
            Informações verificadas e validadas de múltiplas fontes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.high_confidence_fields.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Database className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>Nenhum dado de alta confiança disponível ainda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Confiança</TableHead>
                    <TableHead>Fonte</TableHead>
                    <TableHead>Categoria</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.high_confidence_fields.map((field, index) => {
                    const CategoryIcon = getCategoryIcon(field.category);
                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {formatFieldName(field.name)}
                        </TableCell>
                        <TableCell className="max-w-md truncate">
                          {field.value}
                        </TableCell>
                        <TableCell>
                          {getConfidenceBadge(field.confidence)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{field.source}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CategoryIcon className="h-4 w-4 text-gray-600" />
                            <span className="capitalize">{field.category}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Missing/Low Confidence Fields */}
      {data.missing_fields.length > 0 && (
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Dados Faltando ou com Baixa Confiança (&lt;90%)
            </CardTitle>
            <CardDescription>
              {data.can_fill_missing
                ? 'Você pode preencher estes campos para melhorar a qualidade dos dados'
                : 'Campos que requerem mais informações'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.missing_fields.map((field, index) => {
                const CategoryIcon = getCategoryIcon(field.category);
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CategoryIcon className="h-4 w-4 text-gray-600" />
                        <span className="font-medium">
                          {formatFieldName(field.name)}
                        </span>
                        {field.confidence > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {field.confidence}% confiança
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{field.reason}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {field.category}
                        </Badge>
                        {field.can_override && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            Editável
                          </Badge>
                        )}
                      </div>
                    </div>
                    {data.can_fill_missing && field.can_override && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFillMissing(field.name)}
                        className="ml-4"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Preencher
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approval Status Banner */}
      {data.status === 'approved' && (
        <Alert className="mt-6 border-green-600 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-900">Aprovado</AlertTitle>
          <AlertDescription className="text-green-800">
            Seus dados foram aprovados pela administração. Você pode acessar
            todos os recursos disponíveis.
          </AlertDescription>
        </Alert>
      )}

      {data.status === 'pending' && (
        <Alert className="mt-6 border-blue-600 bg-blue-50">
          <Clock className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-900">Em Análise</AlertTitle>
          <AlertDescription className="text-blue-800">
            Seus dados estão sendo analisados pela administração. Você receberá
            uma notificação quando a análise for concluída.
          </AlertDescription>
        </Alert>
      )}

      {data.status === 'needs_review' && (
        <Alert className="mt-6 border-orange-600 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-900">Requer Revisão</AlertTitle>
          <AlertDescription className="text-orange-800">
            Alguns dados precisam ser revisados. Por favor, verifique os campos
            marcados e forneça informações adicionais se necessário.
          </AlertDescription>
        </Alert>
      )}

      {data.status === 'rejected' && (
        <Alert className="mt-6 border-red-600 bg-red-50">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-900">Rejeitado</AlertTitle>
          <AlertDescription className="text-red-800">
            Seus dados foram rejeitados. Entre em contato com a administração
            para mais informações.
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => router.push(`/dashboard/submissions/${submissionId}`)}
        >
          Ver Detalhes Completos
        </Button>
        {data.can_fill_missing && (
          <Button
            onClick={() =>
              router.push(`/dashboard/submissions/${submissionId}/edit`)
            }
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar Informações
          </Button>
        )}
      </div>
    </div>
  );
}
