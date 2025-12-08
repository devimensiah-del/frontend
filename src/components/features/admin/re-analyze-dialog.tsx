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
import {
  CHALLENGE_CATEGORIES,
  CHALLENGE_TYPES,
  type ChallengeCategory,
} from '@/lib/config/challenges'

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
  const [category, setCategory] = useState<ChallengeCategory | ''>('')
  const [type, setType] = useState('')
  const [challenge, setChallenge] = useState('')
  const reAnalyze = useReAnalyze()

  const handleSubmit = () => {
    if (!category || !type || !challenge) return

    reAnalyze.mutate(
      {
        companyId,
        challenge: {
          challenge_category: category as ChallengeCategory,
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

  const handleCategoryChange = (value: string) => {
    setCategory(value as ChallengeCategory)
    setType('')
  }

  const availableTypes = category ? CHALLENGE_TYPES[category] : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Desafio</DialogTitle>
          <DialogDescription>
            Criar novo desafio e iniciar análise para <strong>{companyName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Categoria do Desafio</Label>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {CHALLENGE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.code} value={cat.code}>
                    <span className="flex items-center gap-2">
                      <span>{cat.emoji}</span>
                      <span>{cat.label}</span>
                    </span>
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
                  {availableTypes.map((t) => (
                    <SelectItem key={t.code} value={t.code}>
                      <span className="flex items-center gap-2">
                        <span>{t.emoji}</span>
                        <span>{t.label}</span>
                      </span>
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
            Criar e Analisar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
