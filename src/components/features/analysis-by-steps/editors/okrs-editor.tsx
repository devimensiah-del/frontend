'use client'

import { useState, useEffect } from 'react'
import { OKRsAnalysis, MonthlyOKR } from '@/lib/types/domain'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'

interface OKRsEditorProps {
  data: OKRsAnalysis | null
  onChange: (data: OKRsAnalysis) => void
  disabled?: boolean
}

const DEFAULT_OKR: MonthlyOKR = {
  month: '',
  focus: '',
  objective: '',
  key_results: [],
  investment: '',
  aligned_recommendation: '',
}

const DEFAULT_DATA: OKRsAnalysis = {
  plan_90_days: [],
  total_investment: '',
  success_metrics: [],
  summary: '',
}

export function OKRsEditor({ data, onChange, disabled = false }: OKRsEditorProps) {
  const [formData, setFormData] = useState<OKRsAnalysis>(data || DEFAULT_DATA)

  useEffect(() => {
    if (data) {
      setFormData(data)
    }
  }, [data])

  const handleChange = (newData: OKRsAnalysis) => {
    setFormData(newData)
    onChange(newData)
  }

  // OKRs
  const addOKR = () => {
    const plan = formData.plan_90_days || []
    handleChange({
      ...formData,
      plan_90_days: [...plan, DEFAULT_OKR],
    })
  }

  const removeOKR = (index: number) => {
    const plan = formData.plan_90_days || []
    handleChange({
      ...formData,
      plan_90_days: plan.filter((_, i) => i !== index),
    })
  }

  const updateOKR = (index: number, field: keyof MonthlyOKR, value: string | string[]) => {
    const plan = formData.plan_90_days || []
    handleChange({
      ...formData,
      plan_90_days: plan.map((okr, i) => (i === index ? { ...okr, [field]: value } : okr)),
    })
  }

  // Key Results for a specific OKR
  const addKeyResult = (okrIndex: number) => {
    const plan = formData.plan_90_days || []
    const okr = plan[okrIndex]
    updateOKR(okrIndex, 'key_results', [...okr.key_results, ''])
  }

  const removeKeyResult = (okrIndex: number, krIndex: number) => {
    const plan = formData.plan_90_days || []
    const okr = plan[okrIndex]
    updateOKR(
      okrIndex,
      'key_results',
      okr.key_results.filter((_, i) => i !== krIndex)
    )
  }

  const updateKeyResult = (okrIndex: number, krIndex: number, value: string) => {
    const plan = formData.plan_90_days || []
    const okr = plan[okrIndex]
    updateOKR(
      okrIndex,
      'key_results',
      okr.key_results.map((kr, i) => (i === krIndex ? value : kr))
    )
  }

  // Success Metrics
  const addSuccessMetric = () => {
    const metrics = formData.success_metrics || []
    handleChange({
      ...formData,
      success_metrics: [...metrics, ''],
    })
  }

  const removeSuccessMetric = (index: number) => {
    const metrics = formData.success_metrics || []
    handleChange({
      ...formData,
      success_metrics: metrics.filter((_, i) => i !== index),
    })
  }

  const updateSuccessMetric = (index: number, value: string) => {
    const metrics = formData.success_metrics || []
    handleChange({
      ...formData,
      success_metrics: metrics.map((metric, i) => (i === index ? value : metric)),
    })
  }

  const plan = formData.plan_90_days || []
  const metrics = formData.success_metrics || []

  return (
    <div className="space-y-6">
      {/* Monthly OKRs */}
      <div className="bg-surface-paper border border-line p-6">
        <div className="flex items-center justify-between mb-4">
          <label className="block font-heading text-sm font-bold uppercase tracking-widest">
            Plano de 90 Dias (OKRs Mensais)
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addOKR}
            disabled={disabled}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Mês
          </Button>
        </div>

        <div className="space-y-6">
          {plan.map((okr, okrIndex) => (
            <div key={okrIndex} className="border border-line p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-lg">Mês {okrIndex + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOKR(okrIndex)}
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Month and Focus */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Mês</label>
                  <Input
                    value={okr.month}
                    onChange={(e) => updateOKR(okrIndex, 'month', e.target.value)}
                    placeholder="Edite o mês..."
                    disabled={disabled}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Foco</label>
                  <Input
                    value={okr.focus}
                    onChange={(e) => updateOKR(okrIndex, 'focus', e.target.value)}
                    placeholder="Edite o foco..."
                    disabled={disabled}
                  />
                </div>
              </div>

              {/* Objective */}
              <div>
                <label className="block text-sm font-medium mb-2">Objetivo</label>
                <Input
                  value={okr.objective}
                  onChange={(e) => updateOKR(okrIndex, 'objective', e.target.value)}
                  placeholder="Edite o objetivo deste mês..."
                  disabled={disabled}
                />
              </div>

              {/* Key Results */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium">Resultados-Chave</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addKeyResult(okrIndex)}
                    disabled={disabled}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar RC
                  </Button>
                </div>
                <div className="space-y-3">
                  {okr.key_results.map((kr, krIndex) => (
                    <div key={krIndex} className="flex gap-2">
                      <Input
                        value={kr}
                        onChange={(e) => updateKeyResult(okrIndex, krIndex, e.target.value)}
                        placeholder={`Resultado-Chave ${krIndex + 1}...`}
                        disabled={disabled}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeKeyResult(okrIndex, krIndex)}
                        disabled={disabled}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {okr.key_results.length === 0 && (
                    <p className="text-sm text-text-tertiary italic">Nenhum resultado-chave adicionado ainda</p>
                  )}
                </div>
              </div>

              {/* Investment */}
              <div>
                <label className="block text-sm font-medium mb-2">Investimento</label>
                <Input
                  value={okr.investment}
                  onChange={(e) => updateOKR(okrIndex, 'investment', e.target.value)}
                  placeholder="Edite o investimento..."
                  disabled={disabled}
                />
              </div>

              {/* Aligned Recommendation */}
              <div>
                <label className="block text-sm font-medium mb-2">Recomendação Alinhada</label>
                <Textarea
                  value={okr.aligned_recommendation}
                  onChange={(e) => updateOKR(okrIndex, 'aligned_recommendation', e.target.value)}
                  placeholder="Edite como isso se alinha com a estratégia geral..."
                  disabled={disabled}
                  className="min-h-[80px]"
                />
              </div>
            </div>
          ))}
          {plan.length === 0 && (
            <p className="text-sm text-text-tertiary italic">Nenhum OKR mensal adicionado ainda</p>
          )}
        </div>
      </div>

      {/* Total Investment */}
      <div className="bg-surface-paper border border-line p-6">
        <label className="block font-heading text-sm font-bold uppercase tracking-widest mb-4">
          Investimento Total
        </label>
        <Input
          value={formData.total_investment || ''}
          onChange={(e) => handleChange({ ...formData, total_investment: e.target.value })}
          placeholder="Edite o investimento total..."
          disabled={disabled}
        />
      </div>

      {/* Success Metrics */}
      <div className="bg-surface-paper border border-line p-6">
        <div className="flex items-center justify-between mb-4">
          <label className="block font-heading text-sm font-bold uppercase tracking-widest">
            Métricas de Sucesso
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addSuccessMetric}
            disabled={disabled}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Métrica
          </Button>
        </div>
        <div className="space-y-3">
          {metrics.map((metric, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={metric}
                onChange={(e) => updateSuccessMetric(index, e.target.value)}
                placeholder={`Métrica de sucesso ${index + 1}...`}
                disabled={disabled}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeSuccessMetric(index)}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {metrics.length === 0 && (
            <p className="text-sm text-text-tertiary italic">Nenhuma métrica de sucesso adicionada ainda</p>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-surface-paper border border-line p-6">
        <label className="block font-heading text-sm font-bold uppercase tracking-widest mb-4">
          Resumo
        </label>
        <Textarea
          value={formData.summary}
          onChange={(e) => handleChange({ ...formData, summary: e.target.value })}
          placeholder="Edite o resumo da análise de OKRs..."
          disabled={disabled}
          className="min-h-[160px]"
        />
      </div>
    </div>
  )
}
