import React, { useState } from 'react';
import { Submission } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/components/ui/use-toast';
import { Edit2, Save, X } from 'lucide-react';

interface SubmissionDetailsProps {
  submission: Submission;
  isAdmin: boolean;
  onUpdate: (data: Partial<Submission>) => void;
}

export function SubmissionDetails({ submission, isAdmin, onUpdate }: SubmissionDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(submission);
  const { toast } = useToast();

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
    toast({
      title: "Alterações salvas",
      description: "As informações do envio foram atualizadas."
    });
  };

  const handleCancel = () => {
    setFormData(submission);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-navy-900">Informações da Empresa</h3>
        {isAdmin && !isEditing && (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            <Edit2 className="w-4 h-4 mr-2" />
            Editar
          </Button>
        )}
        {isEditing && (
          <div className="flex gap-2">
             <Button variant="ghost" size="sm" onClick={handleCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Field label="Nome da Empresa" value={formData.companyName} isEditing={isEditing} 
               onChange={(v) => setFormData({...formData, companyName: v})} />
        <Field label="CNPJ" value={formData.cnpj} isEditing={isEditing} 
               onChange={(v) => setFormData({...formData, cnpj: v})} />
        <Field label="Website" value={formData.website || ''} isEditing={isEditing} 
               onChange={(v) => setFormData({...formData, website: v})} />
        <Field label="Indústria" value={formData.industry || ''} isEditing={isEditing} 
               onChange={(v) => setFormData({...formData, industry: v})} />
        <Field label="Tamanho da Empresa" value={formData.companySize || ''} isEditing={isEditing} 
               onChange={(v) => setFormData({...formData, companySize: v})} />
        <Field label="Email de Contato" value={formData.contactEmail || ''} isEditing={isEditing} 
               onChange={(v) => setFormData({...formData, contactEmail: v})} />
      </div>

      <div className="pt-6 border-t border-gray-100">
         <h3 className="text-lg font-medium text-navy-900 mb-4">Contexto Estratégico</h3>
         <div className="space-y-4">
            <Field label="Objetivo Estratégico" value={formData.strategicGoal || ''} isEditing={isEditing} 
               onChange={(v) => setFormData({...formData, strategicGoal: v})} multiline />
            <Field label="Desafios Atuais" value={formData.currentChallenges || ''} isEditing={isEditing} 
               onChange={(v) => setFormData({...formData, currentChallenges: v})} multiline />
            <Field label="Posição Competitiva" value={formData.competitivePosition || ''} isEditing={isEditing} 
               onChange={(v) => setFormData({...formData, competitivePosition: v})} multiline />
         </div>
      </div>
    </div>
  );
}

function Field({ label, value, isEditing, onChange, multiline }: any) {
    return (
        <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">{label}</label>
            {isEditing ? (
                multiline ? 
                <Textarea value={value} onChange={(e) => onChange(e.target.value)} className="min-h-[100px]" /> :
                <Input value={value} onChange={(e) => onChange(e.target.value)} />
            ) : (
                <p className="text-sm text-navy-900">{value || '-'}</p>
            )}
        </div>
    )
}
