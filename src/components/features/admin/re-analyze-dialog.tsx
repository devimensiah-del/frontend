'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useReAnalyze } from '@/lib/hooks/use-admin'
import { Loader2 } from 'lucide-react'

const challengeCategories = [
  { value: 'growth', label: 'Crescimento' },
  { value: 'transform', label: 'Transformação' },
  { value: 'transition', label: 'Transição' },
  { value: 'compete', label: 'Competição' },
  { value: 'funding', label: 'Captação' },
]

const challengeTypes: Record<string, { value: string; label: string }[]> = {
  growth: [
    { value: 'scale_operations', label: 'Escalar Operações' },
    { value: 'market_expansion', label: 'Expansão de Mercado' },
    { value: 'revenue_growth', label: 'Crescimento de Receita' },
  ],
  transform: [
    { value: 'digital_transformation', label: 'Transformação Digital' },
    { value: 'business_model', label: 'Mudança de Modelo de Negócio' },
    { value: 'culture_change', label: 'Mudança Cultural' },
  ],
  transition: [
    { value: 'succession', label: 'Sucessão' },
    { value: 'pivot', label: 'Pivô de Produto' },
    { value: 'restructuring', label: 'Reestruturação' },
  ],
  compete: [
    { value: 'differentiation', label: 'Diferenciação' },
    { value: 'cost_leadership', label: 'Liderança em Custo' },
    { value: 'market_share', label: 'Ganho de Market Share' },
  ],
  funding: [
    { value: 'seed', label: 'Seed/Anjo' },
    { value: 'series_a', label: 'Série A' },
    { value: 'series_b_plus', label: 'Série B+' },
  ],
}

interface ReAnalyzeDialogProps {
  companyId: string
  companyName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReAnalyzeDialog({
  companyId,
  companyName,
  open,
  onOpenChange,
}: ReAnalyzeDialogProps) {
  const [category, setCategory] = useState('')
  const [type, setType] = useState('')
  const [challenge, setChallenge] = useState('')
  const reAnalyze = useReAnalyze()

  const handleSubmit = () => {
    if (!category || !type || !challenge) return

    reAnalyze.mutate(
      {
        companyId,
        challenge: {
          challenge_category: category as 'growth' | 'transform' | 'transition' | 'compete' | 'funding',
          challenge_type: type,
          business_challenge: challenge,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          setCategory('')
          setType('')
          setChallenge('')
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Re-analisar Empresa</DialogTitle>
          <DialogDescription>
            Iniciar nova análise para <strong>{companyName}</strong> com um novo desafio.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Categoria do Desafio</Label>
            <Select value={category} onValueChange={(v) => { setCategory(v); setType(''); }}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {challengeCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {category && (
            <div className="space-y-2">
              <Label>Tipo de Desafio</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {challengeTypes[category]?.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Descrição do Desafio</Label>
            <Textarea
              value={challenge}
              onChange={(e) => setChallenge(e.target.value)}
              placeholder="Descreva o desafio de negócio específico..."
              rows={4}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!category || !type || !challenge || reAnalyze.isPending}
          >
            {reAnalyze.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Iniciar Análise
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
