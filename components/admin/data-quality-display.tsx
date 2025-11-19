'use client';

import { EnrichmentData, DataConflict } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Globe,
  Linkedin,
  Instagram,
  FileText,
  Database
} from 'lucide-react';

interface FieldQuality {
  name: string;
  value: string | number | null | undefined;
  source: string;
  confidence: number;
  icon: React.ReactNode;
  category: string;
}

interface DataQualityDisplayProps {
  enrichmentData?: EnrichmentData;
  submittedData: {
    company_name: string;
    email: string;
    website_url: string;
    phone?: string;
    whatsapp?: string;
    instagram?: string;
    tiktok?: string;
    company_linkedin?: string;
    founder_linkedin?: string;
    employee_count?: string;
    founded_year?: number;
  };
  conflicts?: DataConflict[];
}

export function DataQualityDisplay({
  enrichmentData,
  submittedData,
  conflicts = []
}: DataQualityDisplayProps) {
  const buildFieldsList = (): FieldQuality[] => {
    const fields: FieldQuality[] = [];

    // Form submitted fields
    fields.push(
      { name: 'Nome da Empresa', value: submittedData.company_name, source: 'Formulário', confidence: 100, icon: <FileText className="w-4 h-4" />, category: 'Dados Básicos' },
      { name: 'Email', value: submittedData.email, source: 'Formulário', confidence: 100, icon: <FileText className="w-4 h-4" />, category: 'Dados Básicos' },
      { name: 'Website', value: submittedData.website_url, source: 'Formulário', confidence: 100, icon: <Globe className="w-4 h-4" />, category: 'Dados Básicos' },
    );

    if (submittedData.phone) {
      fields.push({ name: 'Telefone', value: submittedData.phone, source: 'Formulário', confidence: 100, icon: <FileText className="w-4 h-4" />, category: 'Contato' });
    }

    if (submittedData.whatsapp) {
      fields.push({ name: 'WhatsApp', value: submittedData.whatsapp, source: 'Formulário', confidence: 100, icon: <FileText className="w-4 h-4" />, category: 'Contato' });
    }

    // Social media
    if (submittedData.instagram) {
      const instagramData = enrichmentData?.social_media?.instagram;
      fields.push({
        name: 'Instagram',
        value: `@${submittedData.instagram}`,
        source: instagramData ? `Raspagem (${instagramData.followers || 0} seguidores)` : 'Formulário',
        confidence: instagramData?.confidence || 100,
        icon: <Instagram className="w-4 h-4" />,
        category: 'Redes Sociais'
      });
    }

    if (submittedData.tiktok) {
      const tiktokData = enrichmentData?.social_media?.tiktok;
      fields.push({
        name: 'TikTok',
        value: `@${submittedData.tiktok}`,
        source: tiktokData ? `Raspagem (${tiktokData.followers || 0} seguidores)` : 'Formulário',
        confidence: tiktokData?.confidence || 100,
        icon: <Instagram className="w-4 h-4" />,
        category: 'Redes Sociais'
      });
    }

    // LinkedIn
    if (enrichmentData?.linkedin_company) {
      const linkedin = enrichmentData.linkedin_company;
      if (linkedin.name) {
        fields.push({ name: 'Nome (LinkedIn)', value: linkedin.name, source: 'LinkedIn API', confidence: linkedin.confidence, icon: <Linkedin className="w-4 h-4" />, category: 'LinkedIn' });
      }
      if (linkedin.company_size) {
        fields.push({ name: 'Funcionários (LinkedIn)', value: linkedin.company_size, source: 'LinkedIn API', confidence: linkedin.confidence, icon: <Linkedin className="w-4 h-4" />, category: 'LinkedIn' });
      }
      if (linkedin.industry) {
        fields.push({ name: 'Setor (LinkedIn)', value: linkedin.industry, source: 'LinkedIn API', confidence: linkedin.confidence, icon: <Linkedin className="w-4 h-4" />, category: 'LinkedIn' });
      }
    }

    // Brazil DBs
    if (enrichmentData?.brazil_dbs) {
      const brazil = enrichmentData.brazil_dbs;
      if (brazil.cnpj) {
        fields.push({ name: 'CNPJ', value: brazil.cnpj, source: 'ReceitaWS', confidence: brazil.confidence, icon: <Database className="w-4 h-4" />, category: 'Dados Brasil' });
      }
      if (brazil.razao_social) {
        fields.push({ name: 'Razão Social', value: brazil.razao_social, source: 'ReceitaWS', confidence: brazil.confidence, icon: <Database className="w-4 h-4" />, category: 'Dados Brasil' });
      }
    }

    // Website scraped data
    if (enrichmentData?.website) {
      const website = enrichmentData.website;
      if (website.title) {
        fields.push({ name: 'Título do Site', value: website.title, source: 'Raspagem Website', confidence: website.confidence, icon: <Globe className="w-4 h-4" />, category: 'Website' });
      }
      if (website.description) {
        fields.push({ name: 'Descrição do Site', value: website.description, source: 'Raspagem Website', confidence: website.confidence, icon: <Globe className="w-4 h-4" />, category: 'Website' });
      }
    }

    return fields;
  };

  const fields = buildFieldsList();
  const totalPossibleFields = 20;
  const filledFields = fields.filter(f => f.value).length;
  const completenessPercent = Math.round((filledFields / totalPossibleFields) * 100);

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 80) {
      return { className: 'bg-green-100 text-green-800', label: 'Alta confiança', icon: <CheckCircle2 className="w-3 h-3" /> };
    } else if (confidence >= 50) {
      return { className: 'bg-yellow-100 text-yellow-800', label: 'Média confiança', icon: <AlertTriangle className="w-3 h-3" /> };
    } else if (confidence > 0) {
      return { className: 'bg-orange-100 text-orange-800', label: 'Baixa confiança', icon: <AlertTriangle className="w-3 h-3" /> };
    } else {
      return { className: 'bg-gray-100 text-gray-800', label: 'Sem dados', icon: <HelpCircle className="w-3 h-3" /> };
    }
  };

  const getFieldIcon = (confidence: number) => {
    if (confidence >= 80) return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (confidence >= 50) return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    if (confidence > 0) return <AlertTriangle className="w-5 h-5 text-orange-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  const groupedFields = fields.reduce((acc, field) => {
    if (!acc[field.category]) acc[field.category] = [];
    acc[field.category].push(field);
    return acc;
  }, {} as Record<string, FieldQuality[]>);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Qualidade dos Dados</CardTitle>
        <CardDescription>
          Completude e confiabilidade das informações coletadas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Completeness Score */}
        <div className="p-4 bg-[hsl(195_100%_8%)]/10 rounded-lg border-2 border-[hsl(195_100%_8%)]/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-[hsl(195_100%_8%)]">Score de Completude</span>
            <span className="text-2xl font-bold text-[hsl(195_100%_8%)]">{completenessPercent}%</span>
          </div>
          <Progress value={completenessPercent} className="h-3 mb-2" />
          <p className="text-sm text-[hsl(195_100%_8%)]/80">
            {filledFields} de {totalPossibleFields} campos preenchidos
          </p>
        </div>

        {/* Conflicts Alert */}
        {conflicts.length > 0 && (
          <div className="p-4 bg-red-50 rounded-lg border-2 border-red-300">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-red-900 mb-2">Conflitos Detectados</h4>
                <ul className="space-y-2">
                  {conflicts.map((conflict, idx) => (
                    <li key={idx} className="text-sm text-red-800">
                      <span className="font-medium">{conflict.field}:</span> {conflict.description}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Fields by Category */}
        <Accordion type="multiple" defaultValue={Object.keys(groupedFields)} className="w-full">
          {Object.entries(groupedFields).map(([category, categoryFields]) => (
            <AccordionItem key={category} value={category}>
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  {categoryFields[0].icon}
                  <span className="font-semibold">{category}</span>
                  <Badge variant="outline" className="ml-2">
                    {categoryFields.length} campos
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  {categoryFields.map((field, idx) => {
                    const badge = getConfidenceBadge(field.confidence);
                    return (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        {getFieldIcon(field.confidence)}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900">{field.name}</div>
                          {field.value ? (
                            <div className="text-sm text-gray-700 break-words">{field.value}</div>
                          ) : (
                            <div className="text-sm text-gray-500 italic">Não encontrado</div>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-600">{field.source}</span>
                            <Badge className={`${badge.className} text-xs flex items-center gap-1`}>
                              {badge.icon}
                              {field.confidence}% {badge.label}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {fields.filter(f => f.confidence >= 80).length}
            </div>
            <div className="text-xs text-gray-600">Alta confiança</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {fields.filter(f => f.confidence >= 50 && f.confidence < 80).length}
            </div>
            <div className="text-xs text-gray-600">Média confiança</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {fields.filter(f => !f.value || f.confidence < 50).length}
            </div>
            <div className="text-xs text-gray-600">Baixa/Ausente</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
