import { ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Enrichment } from '@/types';

interface EnrichmentDisplayProps {
  enrichment: Enrichment;
}

export function EnrichmentDisplay({ enrichment }: EnrichmentDisplayProps) {
  const { data } = enrichment;

  // Helper to format arrays nicely
  const formatArray = (arr?: string[]) => {
    if (!arr || arr.length === 0) return 'N/A';
    return arr.join(', ');
  };

  // Helper to format confidence score
  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) return { variant: 'success' as const, label: 'Alta Confiança' };
    if (confidence >= 0.5) return { variant: 'warning' as const, label: 'Confiança Média' };
    return { variant: 'error' as const, label: 'Baixa Confiança' };
  };

  const confidenceBadge = getConfidenceBadge(enrichment.confidence);

  return (
    <div className="space-y-6">
      {/* Confidence Score */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Dados de Enriquecimento
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Informações coletadas de {enrichment.sources.length} fonte(s)
          </p>
        </div>
        <Badge variant={confidenceBadge.variant}>
          {confidenceBadge.label}: {Math.round(enrichment.confidence * 100)}%
        </Badge>
      </div>

      {/* Personal Information */}
      {(data.fullName || data.cpf || data.birthDate || data.motherName) && (
        <Card className="p-5 bg-gray-50">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
            Informações Pessoais
          </h4>
          <dl className="grid md:grid-cols-2 gap-4 text-sm">
            {data.fullName && (
              <div>
                <dt className="font-medium text-gray-700">Nome Completo:</dt>
                <dd className="text-gray-900 mt-1">{data.fullName}</dd>
              </div>
            )}
            {data.cpf && (
              <div>
                <dt className="font-medium text-gray-700">CPF:</dt>
                <dd className="text-gray-900 mt-1">{data.cpf}</dd>
              </div>
            )}
            {data.birthDate && (
              <div>
                <dt className="font-medium text-gray-700">Data de Nascimento:</dt>
                <dd className="text-gray-900 mt-1">
                  {new Date(data.birthDate).toLocaleDateString('pt-BR')}
                </dd>
              </div>
            )}
            {data.motherName && (
              <div>
                <dt className="font-medium text-gray-700">Nome da Mãe:</dt>
                <dd className="text-gray-900 mt-1">{data.motherName}</dd>
              </div>
            )}
          </dl>
        </Card>
      )}

      {/* Addresses */}
      {data.addresses && data.addresses.length > 0 && (
        <Card className="p-5 bg-gray-50">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
            Endereços ({data.addresses.length})
          </h4>
          <div className="space-y-4">
            {data.addresses.map((address, index) => (
              <div key={index} className="pb-4 border-b last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Endereço {index + 1}
                  </span>
                  <Badge variant={address.type === 'residential' ? 'default' : 'primary'}>
                    {address.type === 'residential' ? 'Residencial' : 'Comercial'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-900">
                  {address.street}
                  <br />
                  {address.city} - {address.state}
                  <br />
                  CEP: {address.zipCode}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Contact Information */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Phones */}
        {data.phones && data.phones.length > 0 && (
          <Card className="p-5 bg-gray-50">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
              Telefones
            </h4>
            <div className="space-y-3">
              {data.phones.map((phone, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-900">{phone.number}</span>
                  <Badge variant="default" className="text-xs">
                    {phone.type === 'mobile' ? 'Celular' : 'Fixo'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Emails */}
        {data.emails && data.emails.length > 0 && (
          <Card className="p-5 bg-gray-50">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
              Emails
            </h4>
            <div className="space-y-3">
              {data.emails.map((email, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-900 break-all">{email.email}</span>
                  {email.verified && (
                    <Badge variant="success" className="text-xs ml-2">
                      Verificado
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Financial Information */}
      {data.financialInfo && (
        <Card className="p-5 bg-gray-50">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-2 h-2 bg-amber-600 rounded-full mr-2"></span>
            Informações Financeiras
          </h4>
          <dl className="grid md:grid-cols-3 gap-4 text-sm">
            {data.financialInfo.creditScore !== undefined && (
              <div>
                <dt className="font-medium text-gray-700">Score de Crédito:</dt>
                <dd className="text-gray-900 mt-1 text-lg font-semibold">
                  {data.financialInfo.creditScore}
                </dd>
              </div>
            )}
            {data.financialInfo.monthlyIncome !== undefined && (
              <div>
                <dt className="font-medium text-gray-700">Renda Mensal:</dt>
                <dd className="text-gray-900 mt-1">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(data.financialInfo.monthlyIncome)}
                </dd>
              </div>
            )}
            {data.financialInfo.employmentStatus && (
              <div>
                <dt className="font-medium text-gray-700">Status de Emprego:</dt>
                <dd className="text-gray-900 mt-1">{data.financialInfo.employmentStatus}</dd>
              </div>
            )}
          </dl>
        </Card>
      )}

      {/* Sources */}
      <Card className="p-5 bg-indigo-50 border-indigo-200">
        <h4 className="font-semibold text-indigo-900 mb-3 flex items-center">
          <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
          Fontes de Dados
        </h4>
        <div className="flex flex-wrap gap-2">
          {enrichment.sources.map((source, index) => (
            <Badge key={index} variant="default" className="bg-indigo-100 text-indigo-800">
              {source}
            </Badge>
          ))}
        </div>
        {enrichment.verifiedAt && (
          <p className="text-xs text-indigo-700 mt-3">
            Verificado em: {new Date(enrichment.verifiedAt).toLocaleString('pt-BR')}
          </p>
        )}
      </Card>
    </div>
  );
}
