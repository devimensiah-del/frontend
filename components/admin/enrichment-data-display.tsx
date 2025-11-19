'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle } from 'lucide-react';

interface EnrichmentField {
  key: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  confidence?: number;
  source?: string;
  verified?: boolean;
  conflict?: boolean;
}

interface EnrichmentDataDisplayProps {
  source: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
  fields: EnrichmentField[];
}

export function EnrichmentDataDisplay({ source, fields }: EnrichmentDataDisplayProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderValue = (value: any) => {
    if (typeof value === 'boolean') {
      return value ? 'Sim' : 'Não';
    }
    if (Array.isArray(value)) {
      return (
        <ul className="list-disc list-inside">
          {value.map((item, i) => (
            <li key={i}>{typeof item === 'object' ? JSON.stringify(item) : item}</li>
          ))}
        </ul>
      );
    }
    if (typeof value === 'object' && value !== null) {
      return <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">{JSON.stringify(value, null, 2)}</pre>;
    }
    return String(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{source}</CardTitle>
        <CardDescription>
          {fields.length} campos coletados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {fields.map((field) => (
            <div
              key={field.key}
              className={`p-4 rounded-lg border ${
                field.conflict ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{field.label}</span>
                  {field.verified && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                  {field.conflict && (
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  )}
                </div>
                {field.confidence !== undefined && (
                  <Badge className={getConfidenceBadge(field.confidence)}>
                    {(field.confidence * 100).toFixed(0)}% confiança
                  </Badge>
                )}
              </div>

              {/* Value */}
              <div className="text-sm text-gray-700 mb-2">
                {field.value ? renderValue(field.value) : <span className="text-gray-400">Não disponível</span>}
              </div>

              {/* Confidence bar */}
              {field.confidence !== undefined && (
                <div className="space-y-1">
                  <Progress
                    value={field.confidence * 100}
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Confiança</span>
                    <span className={getConfidenceColor(field.confidence)}>
                      {field.confidence >= 0.8 ? 'Alta' : field.confidence >= 0.6 ? 'Média' : 'Baixa'}
                    </span>
                  </div>
                </div>
              )}

              {/* Source */}
              {field.source && (
                <div className="text-xs text-gray-500 mt-2">
                  Fonte: {field.source}
                </div>
              )}

              {/* Conflict warning */}
              {field.conflict && (
                <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-xs text-red-800">
                  <strong>Conflito detectado:</strong> Este valor difere de outras fontes.
                  Verificação manual recomendada.
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
