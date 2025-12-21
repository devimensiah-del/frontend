'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCreateCompany } from '@/lib/hooks/use-companies'
import { Loader2 } from 'lucide-react'

interface CreateCompanyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const COMPANY_SIZES = [
  { value: 'MEI', label: 'MEI (1 pessoa)' },
  { value: 'Micro', label: 'Micro (até 9)' },
  { value: 'Pequena', label: 'Pequena (10-49)' },
  { value: 'Média', label: 'Média (50-99)' },
  { value: 'Grande', label: 'Grande (100+)' },
]

const FUNDING_STAGES = [
  { value: 'Bootstrapped', label: 'Bootstrapped' },
  { value: 'Pre-seed', label: 'Pre-seed' },
  { value: 'Seed', label: 'Seed' },
  { value: 'Series A', label: 'Series A' },
  { value: 'Series B', label: 'Series B' },
  { value: 'Series C+', label: 'Series C+' },
  { value: 'IPO', label: 'IPO' },
]

const TARGET_MARKETS = [
  { value: 'B2B', label: 'B2B' },
  { value: 'B2C', label: 'B2C' },
  { value: 'B2B2C', label: 'B2B2C' },
  { value: 'B2G', label: 'B2G' },
]

export function CreateCompanyDialog({ open, onOpenChange }: CreateCompanyDialogProps) {
  const router = useRouter()
  const createCompany = useCreateCompany()

  const [name, setName] = useState('')
  const [website, setWebsite] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [industry, setIndustry] = useState('')
  const [companySize, setCompanySize] = useState('')
  const [location, setLocation] = useState('')
  const [targetMarket, setTargetMarket] = useState('')
  const [fundingStage, setFundingStage] = useState('')

  const resetForm = () => {
    setName('')
    setWebsite('')
    setCnpj('')
    setIndustry('')
    setCompanySize('')
    setLocation('')
    setTargetMarket('')
    setFundingStage('')
  }

  const handleSubmit = () => {
    if (!name.trim()) return

    createCompany.mutate(
      {
        name: name.trim(),
        website: website.trim() || undefined,
        cnpj: cnpj.trim() || undefined,
        industry: industry.trim() || undefined,
        company_size: companySize || undefined,
        location: location.trim() || undefined,
        target_market: targetMarket || undefined,
        funding_stage: fundingStage || undefined,
      },
      {
        onSuccess: (company) => {
          onOpenChange(false)
          resetForm()
          // Navigate to the new company page
          router.push(`/admin/companies/${company.id}`)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Empresa</DialogTitle>
          <DialogDescription>
            Crie uma nova empresa. O enriquecimento iniciará automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Name - Required */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Nome da Empresa <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Natura Cosméticos"
            />
          </div>

          {/* CNPJ and Website - Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                placeholder="00.000.000/0001-00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://exemplo.com.br"
              />
            </div>
          </div>

          {/* Industry and Location - Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Setor</Label>
              <Input
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Ex: Cosméticos"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Localização</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: São Paulo, SP"
              />
            </div>
          </div>

          {/* Company Size and Target Market - Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Porte</Label>
              <Select value={companySize} onValueChange={setCompanySize}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {COMPANY_SIZES.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Mercado Alvo</Label>
              <Select value={targetMarket} onValueChange={setTargetMarket}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {TARGET_MARKETS.map((market) => (
                    <SelectItem key={market.value} value={market.value}>
                      {market.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Funding Stage */}
          <div className="space-y-2">
            <Label>Estágio de Funding</Label>
            <Select value={fundingStage} onValueChange={setFundingStage}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {FUNDING_STAGES.map((stage) => (
                  <SelectItem key={stage.value} value={stage.value}>
                    {stage.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || createCompany.isPending}
          >
            {createCompany.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Criar Empresa
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
