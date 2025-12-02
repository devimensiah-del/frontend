'use client';

import { useState, useMemo } from 'react';
import { CheckCircle2, Sparkles, Minus, ChevronDown, ChevronUp, ExternalLink, Pencil, X, Save, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { companiesApi } from '@/lib/api/client';
import { toast } from 'sonner';
import type { Company, FieldVerification, FieldConfig, DeprecationCategory } from '@/types';
import { COMPANY_FIELDS, CATEGORY_INFO } from '@/types';

interface CompanyDataViewProps {
  company: Company;
  verifications: FieldVerification[];
  isAdmin?: boolean;
  isOwner?: boolean;
  onVerificationChange?: () => void;
  onFieldEdit?: (fieldKey: string, value: string) => void;
}

// Group fields by category
function groupFieldsByCategory(fields: FieldConfig[]): Record<DeprecationCategory, FieldConfig[]> {
  return fields.reduce((acc, field) => {
    if (!acc[field.category]) {
      acc[field.category] = [];
    }
    acc[field.category].push(field);
    return acc;
  }, {} as Record<DeprecationCategory, FieldConfig[]>);
}

// Get field value from company object
function getFieldValue(company: Company, fieldKey: string): string | undefined {
  const value = (company as unknown as Record<string, unknown>)[fieldKey];
  if (value === null || value === undefined) return undefined;
  if (Array.isArray(value)) return value.join(', ');
  return String(value);
}

// Determine field source (AI-discovered vs user-submitted)
function getFieldSource(fieldKey: string, company: Company): 'ai' | 'user' | 'empty' {
  const value = getFieldValue(company, fieldKey);
  if (!value) return 'empty';

  // Fields that are typically AI-discovered (enrichment fills these)
  const aiDiscoveredFields = [
    'foundation_year', 'legal_name', 'headquarters', 'sector',
    'target_audience', 'value_proposition', 'employees_range',
    'revenue_estimate', 'business_model', 'competitors',
    'market_share_status', 'digital_maturity', 'strengths', 'weaknesses'
  ];

  // Fields from submission form
  const userSubmittedFields = [
    'name', 'cnpj', 'website', 'industry', 'company_size',
    'location', 'target_market', 'funding_stage', 'linkedin_url',
    'twitter_handle', 'annual_revenue_min', 'annual_revenue_max'
  ];

  if (aiDiscoveredFields.includes(fieldKey)) return 'ai';
  if (userSubmittedFields.includes(fieldKey)) return 'user';
  return 'user';
}

interface FieldRowProps {
  field: FieldConfig;
  company: Company;
  verification?: FieldVerification;
  isAdmin?: boolean;
  isOwner?: boolean;
  onVerify: (fieldKey: string) => void;
  onEdit: (fieldKey: string, value: string) => void;
  isVerifying: boolean;
  isEditing: boolean;
}

function FieldRow({ field, company, verification, isAdmin, isOwner, onVerify, onEdit, isVerifying, isEditing }: FieldRowProps) {
  const value = getFieldValue(company, field.key);
  const source = getFieldSource(field.key, company);
  const isVerified = verification?.verified ?? false;
  const canVerify = (isAdmin || isOwner) && !isVerified && source !== 'empty';
  const canEdit = isOwner;

  const [isFieldEditing, setIsFieldEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');
  const [isSaving, setIsSaving] = useState(false);

  // Determine visual state
  let borderClass = '';
  let bgClass = '';
  let icon = null;

  if (source === 'empty') {
    borderClass = 'border border-dashed border-gray-300';
    bgClass = '';
    icon = <Minus className="w-4 h-4 text-gray-400" />;
  } else if (isVerified) {
    borderClass = 'border-l-[3px] border-l-green-500';
    bgClass = 'bg-green-50';
    icon = <CheckCircle2 className="w-4 h-4 text-green-600" />;
  } else if (source === 'ai') {
    borderClass = 'border-l-[3px] border-l-amber-500';
    bgClass = 'bg-amber-50';
    icon = <Sparkles className="w-4 h-4 text-amber-600" />;
  } else {
    borderClass = 'border-l-[3px] border-l-transparent';
    bgClass = '';
    icon = null;
  }

  // Format value for display
  const displayValue = value || '—';
  const isLink = field.key === 'website' || field.key === 'linkedin_url';

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onEdit(field.key, editValue);
      setIsFieldEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value || '');
    setIsFieldEditing(false);
  };

  const startEditing = () => {
    setEditValue(value || '');
    setIsFieldEditing(true);
  };

  if (isFieldEditing) {
    return (
      <div className={cn('p-3 rounded-r-md transition-colors border-l-[3px] border-l-blue-500 bg-blue-50')}>
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-700">{field.label}</span>
          </div>
          {field.multiline ? (
            <Textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="text-sm"
              rows={3}
              autoFocus
            />
          ) : (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="text-sm"
              autoFocus
            />
          )}
          <div className="flex gap-2 justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={isSaving}
              className="text-xs"
            >
              <X className="w-3 h-3 mr-1" />
              Cancelar
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="text-xs"
            >
              {isSaving ? (
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              ) : (
                <Save className="w-3 h-3 mr-1" />
              )}
              Salvar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('p-3 rounded-r-md transition-colors group', borderClass, bgClass)}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-700">{field.label}</span>
            {icon}
          </div>
          {isLink && value ? (
            <a
              href={value.startsWith('http') ? value : `https://${value}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gold-600 hover:text-gold-700 hover:underline flex items-center gap-1"
            >
              {displayValue}
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <p className={cn(
              'text-sm',
              source === 'empty' ? 'text-gray-400 italic' : 'text-gray-900',
              field.multiline && 'whitespace-pre-wrap'
            )}>
              {displayValue}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {canEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={startEditing}
              disabled={isEditing}
              className="text-xs text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Editar"
            >
              <Pencil className="w-3 h-3" />
            </Button>
          )}
          {canVerify && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onVerify(field.key)}
              disabled={isVerifying}
              className="text-xs text-gray-500 hover:text-green-600"
            >
              Validar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

interface CategorySectionProps {
  category: DeprecationCategory;
  fields: FieldConfig[];
  company: Company;
  verifications: FieldVerification[];
  isAdmin?: boolean;
  isOwner?: boolean;
  onVerify: (fieldKey: string) => void;
  onEdit: (fieldKey: string, value: string) => void;
  isVerifying: boolean;
  isEditing: boolean;
}

function CategorySection({
  category,
  fields,
  company,
  verifications,
  isAdmin,
  isOwner,
  onVerify,
  onEdit,
  isVerifying,
  isEditing
}: CategorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const info = CATEGORY_INFO[category];

  // Count verified fields in this category
  const verifiedCount = fields.filter(f =>
    verifications.find(v => v.field_name === f.key && v.verified)
  ).length;

  // Count fields with values
  const filledCount = fields.filter(f => getFieldValue(company, f.key)).length;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className={cn('px-2 py-0.5 rounded text-xs font-medium', info.color)}>
            {info.label}
          </span>
          <span className="text-sm text-gray-600">{info.description}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">
            {verifiedCount}/{filledCount} verificados
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="p-4 grid gap-3 sm:grid-cols-2">
          {fields.map(field => (
            <FieldRow
              key={field.key}
              field={field}
              company={company}
              verification={verifications.find(v => v.field_name === field.key)}
              isAdmin={isAdmin}
              isOwner={isOwner}
              onVerify={onVerify}
              onEdit={onEdit}
              isVerifying={isVerifying}
              isEditing={isEditing}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CompanyDataView({
  company,
  verifications,
  isAdmin = false,
  isOwner = false,
  onVerificationChange,
}: CompanyDataViewProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyingAll, setVerifyingAll] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const groupedFields = useMemo(() => groupFieldsByCategory(COMPANY_FIELDS), []);

  // Stats
  const totalFields = COMPANY_FIELDS.length;
  const verifiedFields = verifications.filter(v => v.verified).length;
  const filledFields = COMPANY_FIELDS.filter(f => getFieldValue(company, f.key)).length;

  const handleVerifyField = async (fieldKey: string) => {
    setIsVerifying(true);
    try {
      await companiesApi.verifyField(company.id, fieldKey);
      toast.success('Campo verificado');
      onVerificationChange?.();
    } catch (error) {
      toast.error('Erro ao verificar campo');
      console.error('Verification error:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleEditField = async (fieldKey: string, value: string) => {
    setIsEditing(true);
    try {
      await companiesApi.updateCompany(company.id, { [fieldKey]: value });
      toast.success('Campo atualizado');
      onVerificationChange?.(); // Refresh data
    } catch (error) {
      toast.error('Erro ao atualizar campo');
      console.error('Edit error:', error);
      throw error; // Re-throw to let FieldRow handle the error state
    } finally {
      setIsEditing(false);
    }
  };

  const handleVerifyAll = async () => {
    setVerifyingAll(true);
    try {
      await companiesApi.verifyAllFields(company.id);
      toast.success('Todos os campos verificados');
      onVerificationChange?.();
    } catch (error) {
      toast.error('Erro ao verificar campos');
      console.error('Verification error:', error);
    } finally {
      setVerifyingAll(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>{verifiedFields}/{filledFields} verificados</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>{filledFields - verifiedFields} pendentes</span>
          </div>
        </div>

        {(isAdmin || isOwner) && verifiedFields < filledFields && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleVerifyAll}
            disabled={verifyingAll}
          >
            {verifyingAll ? 'Verificando...' : 'Verificar Todos'}
          </Button>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 border-l-[3px] border-l-green-500 bg-green-50 rounded-r" />
          <span>Verificado</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 border-l-[3px] border-l-amber-500 bg-amber-50 rounded-r" />
          <span>IA (pendente)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 border border-dashed border-gray-300 rounded" />
          <span>Sem dados</span>
        </div>
      </div>

      {/* Field categories */}
      <div className="space-y-4">
        {(['static', 'core', 'strategic', 'financial'] as DeprecationCategory[]).map(category => (
          <CategorySection
            key={category}
            category={category}
            fields={groupedFields[category] || []}
            company={company}
            verifications={verifications}
            isAdmin={isAdmin}
            isOwner={isOwner}
            onVerify={handleVerifyField}
            onEdit={handleEditField}
            isVerifying={isVerifying}
            isEditing={isEditing}
          />
        ))}
      </div>
    </div>
  );
}

export default CompanyDataView;
