'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { Loader2 } from 'lucide-react'
import { useCreateChallenge } from '@/lib/hooks'
import type { ChallengeCategory, ChallengeType } from '@/lib/types'

const categories: { value: ChallengeCategory; label: string; types: { value: ChallengeType; label: string }[] }[] = [
  {
    value: 'growth',
    label: 'Crescimento',
    types: [
      { value: 'growth_organic', label: 'Organico' },
      { value: 'growth_geographic', label: 'Geografico' },
      { value: 'growth_segment', label: 'Segmento' },
      { value: 'growth_product', label: 'Produto' },
      { value: 'growth_channel', label: 'Canal' },
    ],
  },
  {
    value: 'transform',
    label: 'Transformacao',
    types: [
      { value: 'transform_digital', label: 'Digital' },
      { value: 'transform_model', label: 'Modelo de Negocio' },
    ],
  },
  {
    value: 'compete',
    label: 'Competicao',
    types: [
      { value: 'compete_differentiate', label: 'Diferenciacao' },
      { value: 'compete_defend', label: 'Defesa' },
      { value: 'compete_reposition', label: 'Reposicionamento' },
    ],
  },
]

interface NewChallengeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  companyId: string
}

export function NewChallengeModal({ open, onOpenChange, companyId }: NewChallengeModalProps) {
  const [category, setCategory] = useState<ChallengeCategory | ''>('')
  const [type, setType] = useState<ChallengeType | ''>('')
  const [businessChallenge, setBusinessChallenge] = useState('')

  const createChallenge = useCreateChallenge()

  const selectedCategory = categories.find((c) => c.value === category)
  const availableTypes = selectedCategory?.types || []

  const handleCategoryChange = (value: ChallengeCategory) => {
    setCategory(value)
    setType('')
  }

  const handleSubmit = async () => {
    if (!category || !type || !businessChallenge.trim()) return

    try {
      await createChallenge.mutateAsync({
        companyId,
        category,
        type,
        businessChallenge: businessChallenge.trim(),
      })
      // Reset form and close
      setCategory('')
      setType('')
      setBusinessChallenge('')
      onOpenChange(false)
    } catch {
      // Error handled by mutation
    }
  }

  const isValid = category && type && businessChallenge.trim().length >= 10

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Desafio</DialogTitle>
          <DialogDescription>
            Defina o desafio de negocio que deseja analisar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as ChallengeType)}
              disabled={!category}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder={category ? 'Selecione um tipo' : 'Selecione a categoria primeiro'} />
              </SelectTrigger>
              <SelectContent>
                {availableTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Business Challenge */}
          <div className="space-y-2">
            <Label htmlFor="businessChallenge">Desafio de Negocio</Label>
            <Textarea
              id="businessChallenge"
              value={businessChallenge}
              onChange={(e) => setBusinessChallenge(e.target.value)}
              placeholder="Descreva o desafio que sua empresa enfrenta..."
              className="min-h-[100px]"
            />
            <p className="text-xs text-text-secondary">
              Minimo de 10 caracteres. Seja especifico sobre o problema que deseja resolver.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || createChallenge.isPending}
          >
            {createChallenge.isPending && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            Criar Desafio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
