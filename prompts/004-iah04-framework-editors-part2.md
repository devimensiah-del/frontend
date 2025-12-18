<objective>
Create the remaining framework editors for IAH-04: Blue Ocean, Growth Hacking, Scenarios, Decision Matrix, OKRs, BSC, Synthesis, Challenge Refinement, and SWOT Cross.

This completes all 14 framework-specific structured editors.
</objective>

<context>
Project: IMENSIAH frontend_v2 - Next.js 15, React 18, TypeScript
Dependencies: Phase 1, 2, and 3 (first batch of editors) must be complete

Read these files for types and patterns:
- @src/lib/types/domain.ts - Framework type definitions
- @src/components/features/analysis-by-steps/editors/pestel-editor.tsx - Editor pattern established
</context>

<requirements>
Continue creating editors in `src/components/features/analysis-by-steps/editors/`

## 1. blue-ocean-editor.tsx

```typescript
'use client'

import { useState, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import type { BlueOceanAnalysis } from '@/lib/types'

interface BlueOceanEditorProps {
  data: BlueOceanAnalysis | null
  onChange: (data: BlueOceanAnalysis) => void
  disabled?: boolean
}

const QUADRANTS = [
  { key: 'eliminate' as const, label: 'Eliminar', color: 'border-red-200 bg-red-50', desc: 'O que eliminar?' },
  { key: 'reduce' as const, label: 'Reduzir', color: 'border-orange-200 bg-orange-50', desc: 'O que reduzir?' },
  { key: 'raise' as const, label: 'Elevar', color: 'border-green-200 bg-green-50', desc: 'O que elevar?' },
  { key: 'create' as const, label: 'Criar', color: 'border-blue-200 bg-blue-50', desc: 'O que criar?' },
]

const DEFAULT_DATA: BlueOceanAnalysis = {
  eliminate: [],
  reduce: [],
  raise: [],
  create: [],
  newValueCurve: '',
  summary: '',
}

export function BlueOceanEditor({ data, onChange, disabled }: BlueOceanEditorProps) {
  const [formData, setFormData] = useState<BlueOceanAnalysis>(data || DEFAULT_DATA)

  useEffect(() => {
    if (data) setFormData(data)
  }, [data])

  const updateField = <K extends keyof BlueOceanAnalysis>(key: K, value: BlueOceanAnalysis[K]) => {
    const newData = { ...formData, [key]: value }
    setFormData(newData)
    onChange(newData)
  }

  const addItem = (key: 'eliminate' | 'reduce' | 'raise' | 'create') => {
    updateField(key, [...(formData[key] || []), ''])
  }

  const updateItem = (key: 'eliminate' | 'reduce' | 'raise' | 'create', index: number, value: string) => {
    const items = [...(formData[key] || [])]
    items[index] = value
    updateField(key, items)
  }

  const removeItem = (key: 'eliminate' | 'reduce' | 'raise' | 'create', index: number) => {
    updateField(key, (formData[key] || []).filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {QUADRANTS.map(({ key, label, color, desc }) => (
          <div key={key} className={`rounded-lg border p-4 ${color}`}>
            <h4 className="font-medium">{label}</h4>
            <p className="text-sm text-gray-600 mb-3">{desc}</p>
            <div className="space-y-2">
              {(formData[key] || []).map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => updateItem(key, index, e.target.value)}
                    disabled={disabled}
                    className="bg-white"
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(key, index)} disabled={disabled}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => addItem(key)} disabled={disabled} className="w-full">
                <Plus className="h-4 w-4 mr-1" /> Adicionar
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Nova Curva de Valor</label>
        <Textarea
          value={formData.newValueCurve || ''}
          onChange={(e) => updateField('newValueCurve', e.target.value)}
          disabled={disabled}
          rows={3}
          placeholder="Descrição da nova curva de valor..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Resumo</label>
        <Textarea
          value={formData.summary || ''}
          onChange={(e) => updateField('summary', e.target.value)}
          disabled={disabled}
          rows={4}
        />
      </div>
    </div>
  )
}
```

## 2. growth-hacking-editor.tsx

```typescript
'use client'

import { useState, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import type { GrowthHackingAnalysis, GrowthLoop } from '@/lib/types'

interface GrowthHackingEditorProps {
  data: GrowthHackingAnalysis | null
  onChange: (data: GrowthHackingAnalysis) => void
  disabled?: boolean
}

const DEFAULT_LOOP: GrowthLoop = { name: '', type: '', steps: [], metrics: [], bottleneck: '' }

const DEFAULT_DATA: GrowthHackingAnalysis = {
  leap_loop: { ...DEFAULT_LOOP, name: 'LEAP Loop' },
  scale_loop: { ...DEFAULT_LOOP, name: 'SCALE Loop' },
  summary: '',
}

function LoopEditor({ loop, onChange, disabled, label }: { loop: GrowthLoop; onChange: (loop: GrowthLoop) => void; disabled?: boolean; label: string }) {
  const updateField = (field: keyof GrowthLoop, value: string | string[]) => {
    onChange({ ...loop, [field]: value })
  }

  const addItem = (field: 'steps' | 'metrics') => {
    updateField(field, [...(loop[field] || []), ''])
  }

  const updateItem = (field: 'steps' | 'metrics', index: number, value: string) => {
    const items = [...(loop[field] || [])]
    items[index] = value
    updateField(field, items)
  }

  const removeItem = (field: 'steps' | 'metrics', index: number) => {
    updateField(field, (loop[field] || []).filter((_, i) => i !== index))
  }

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h4 className="font-medium text-lg">{label}</h4>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1">Nome</label>
          <Input value={loop.name || ''} onChange={(e) => updateField('name', e.target.value)} disabled={disabled} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tipo</label>
          <Input value={loop.type || ''} onChange={(e) => updateField('type', e.target.value)} disabled={disabled} placeholder="Ex: Viral, Pago..." />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Etapas</label>
          <Button type="button" variant="outline" size="sm" onClick={() => addItem('steps')} disabled={disabled}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {(loop.steps || []).map((item, index) => (
            <div key={index} className="flex gap-2">
              <Input value={item} onChange={(e) => updateItem('steps', index, e.target.value)} disabled={disabled} placeholder={`Etapa ${index + 1}`} />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeItem('steps', index)} disabled={disabled}><X className="h-4 w-4" /></Button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Métricas</label>
          <Button type="button" variant="outline" size="sm" onClick={() => addItem('metrics')} disabled={disabled}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {(loop.metrics || []).map((item, index) => (
            <div key={index} className="flex gap-2">
              <Input value={item} onChange={(e) => updateItem('metrics', index, e.target.value)} disabled={disabled} placeholder={`Métrica ${index + 1}`} />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeItem('metrics', index)} disabled={disabled}><X className="h-4 w-4" /></Button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Gargalo</label>
        <Input value={loop.bottleneck || ''} onChange={(e) => updateField('bottleneck', e.target.value)} disabled={disabled} placeholder="Principal gargalo..." />
      </div>
    </div>
  )
}

export function GrowthHackingEditor({ data, onChange, disabled }: GrowthHackingEditorProps) {
  const [formData, setFormData] = useState<GrowthHackingAnalysis>(data || DEFAULT_DATA)

  useEffect(() => {
    if (data) setFormData(data)
  }, [data])

  const updateField = <K extends keyof GrowthHackingAnalysis>(key: K, value: GrowthHackingAnalysis[K]) => {
    const newData = { ...formData, [key]: value }
    setFormData(newData)
    onChange(newData)
  }

  return (
    <div className="space-y-6">
      <LoopEditor loop={formData.leap_loop} onChange={(l) => updateField('leap_loop', l)} disabled={disabled} label="LEAP Loop (Aquisição)" />
      <LoopEditor loop={formData.scale_loop} onChange={(l) => updateField('scale_loop', l)} disabled={disabled} label="SCALE Loop (Escala)" />
      <div>
        <label className="block text-sm font-medium mb-2">Resumo</label>
        <Textarea value={formData.summary || ''} onChange={(e) => updateField('summary', e.target.value)} disabled={disabled} rows={4} />
      </div>
    </div>
  )
}
```

## 3. scenarios-editor.tsx

```typescript
'use client'

import { useState, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import type { ScenariosAnalysis, Scenario } from '@/lib/types'

interface ScenariosEditorProps {
  data: ScenariosAnalysis | null
  onChange: (data: ScenariosAnalysis) => void
  disabled?: boolean
}

const DEFAULT_SCENARIO: Scenario = { name: '', probability: 0, description: '', required_actions: [] }

const DEFAULT_DATA: ScenariosAnalysis = {
  optimistic: { ...DEFAULT_SCENARIO, name: 'Otimista' },
  realist: { ...DEFAULT_SCENARIO, name: 'Realista' },
  pessimistic: { ...DEFAULT_SCENARIO, name: 'Pessimista' },
  mitigation_tactics: [],
  early_warning_signals: [],
  summary: '',
}

function ScenarioEditor({ scenario, onChange, disabled, color }: { scenario: Scenario; onChange: (s: Scenario) => void; disabled?: boolean; color: string }) {
  const updateField = (field: keyof Scenario, value: string | number | string[]) => {
    onChange({ ...scenario, [field]: value })
  }

  const addAction = () => updateField('required_actions', [...(scenario.required_actions || []), ''])
  const updateAction = (index: number, value: string) => {
    const items = [...(scenario.required_actions || [])]
    items[index] = value
    updateField('required_actions', items)
  }
  const removeAction = (index: number) => updateField('required_actions', (scenario.required_actions || []).filter((_, i) => i !== index))

  return (
    <div className={`p-4 border rounded-lg ${color}`}>
      <h4 className="font-medium mb-3">{scenario.name}</h4>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Probabilidade (%)</label>
          <Input type="number" min={0} max={100} value={scenario.probability || 0} onChange={(e) => updateField('probability', parseInt(e.target.value) || 0)} disabled={disabled} className="w-24 bg-white" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Descrição</label>
          <Textarea value={scenario.description || ''} onChange={(e) => updateField('description', e.target.value)} disabled={disabled} rows={2} className="bg-white" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">Ações Necessárias</label>
            <Button type="button" variant="outline" size="sm" onClick={addAction} disabled={disabled}><Plus className="h-4 w-4" /></Button>
          </div>
          <div className="space-y-2">
            {(scenario.required_actions || []).map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input value={item} onChange={(e) => updateAction(index, e.target.value)} disabled={disabled} className="bg-white" />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeAction(index)} disabled={disabled}><X className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ScenariosEditor({ data, onChange, disabled }: ScenariosEditorProps) {
  const [formData, setFormData] = useState<ScenariosAnalysis>(data || DEFAULT_DATA)

  useEffect(() => {
    if (data) setFormData(data)
  }, [data])

  const updateField = <K extends keyof ScenariosAnalysis>(key: K, value: ScenariosAnalysis[K]) => {
    const newData = { ...formData, [key]: value }
    setFormData(newData)
    onChange(newData)
  }

  const addListItem = (key: 'mitigation_tactics' | 'early_warning_signals') => updateField(key, [...(formData[key] || []), ''])
  const updateListItem = (key: 'mitigation_tactics' | 'early_warning_signals', index: number, value: string) => {
    const items = [...(formData[key] || [])]
    items[index] = value
    updateField(key, items)
  }
  const removeListItem = (key: 'mitigation_tactics' | 'early_warning_signals', index: number) => updateField(key, (formData[key] || []).filter((_, i) => i !== index))

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <ScenarioEditor scenario={formData.optimistic} onChange={(s) => updateField('optimistic', s)} disabled={disabled} color="bg-green-50 border-green-200" />
        <ScenarioEditor scenario={formData.realist} onChange={(s) => updateField('realist', s)} disabled={disabled} color="bg-blue-50 border-blue-200" />
        <ScenarioEditor scenario={formData.pessimistic} onChange={(s) => updateField('pessimistic', s)} disabled={disabled} color="bg-red-50 border-red-200" />
      </div>

      {['mitigation_tactics', 'early_warning_signals'].map((key) => (
        <div key={key}>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">{key === 'mitigation_tactics' ? 'Táticas de Mitigação' : 'Sinais de Alerta'}</label>
            <Button type="button" variant="outline" size="sm" onClick={() => addListItem(key as 'mitigation_tactics' | 'early_warning_signals')} disabled={disabled}><Plus className="h-4 w-4 mr-1" /> Adicionar</Button>
          </div>
          <div className="space-y-2">
            {(formData[key as 'mitigation_tactics' | 'early_warning_signals'] || []).map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input value={item} onChange={(e) => updateListItem(key as 'mitigation_tactics' | 'early_warning_signals', index, e.target.value)} disabled={disabled} />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeListItem(key as 'mitigation_tactics' | 'early_warning_signals', index)} disabled={disabled}><X className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div>
        <label className="block text-sm font-medium mb-2">Resumo</label>
        <Textarea value={formData.summary || ''} onChange={(e) => updateField('summary', e.target.value)} disabled={disabled} rows={4} />
      </div>
    </div>
  )
}
```

## 4. decision-matrix-editor.tsx, okrs-editor.tsx, bsc-editor.tsx, synthesis-editor.tsx, challenge-refinement-editor.tsx, swotcross-editor.tsx

Create these editors following the same patterns:

**decision-matrix-editor.tsx**: Edit alternatives[], criteria[], final_recommendation, recommended_option, priority_recommendations[], monitoring_metrics[], summary

**okrs-editor.tsx**: Edit plan_90_days[] (monthly OKRs with month, focus, objective, key_results[], investment, aligned_recommendation), total_investment, success_metrics[], summary

**bsc-editor.tsx**: Edit financial[], customer[], internal_processes[], learning_growth[], summary (4 perspective lists)

**synthesis-editor.tsx**: Edit executiveSummary (textarea), keyFindings[], strategicPriorities[], roadmap[], overallRecommendation (textarea)

**challenge-refinement-editor.tsx**: Simple textarea for refined challenge context

**swotcross-editor.tsx**: Cross-quadrant strategies - SO (strengths+opportunities), WO (weaknesses+opportunities), ST (strengths+threats), WT (weaknesses+threats) - each as string arrays

## 5. Update editors/index.ts barrel export

```typescript
export { PESTELEditor } from './pestel-editor'
export { SWOTEditor } from './swot-editor'
export { PorterEditor } from './porter-editor'
export { BenchmarkingEditor } from './benchmarking-editor'
export { TamSamSomEditor } from './tam-sam-som-editor'
export { BlueOceanEditor } from './blue-ocean-editor'
export { GrowthHackingEditor } from './growth-hacking-editor'
export { ScenariosEditor } from './scenarios-editor'
export { DecisionMatrixEditor } from './decision-matrix-editor'
export { OKRsEditor } from './okrs-editor'
export { BSCEditor } from './bsc-editor'
export { SynthesisEditor } from './synthesis-editor'
export { ChallengeRefinementEditor } from './challenge-refinement-editor'
export { SWOTCrossEditor } from './swotcross-editor'
```
</requirements>

<verification>
1. No TypeScript errors: `npm run type-check`
2. All 14 editors created and exported
3. Each editor handles null data
4. Consistent styling across all editors
</verification>

<success_criteria>
- All 9 remaining editors created
- editors/index.ts exports all 14 editors
- No TypeScript compilation errors
</success_criteria>
