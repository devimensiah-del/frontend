'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { X, Save, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface WizardHeaderProps {
  isSaving?: boolean
  lastSaved?: Date
}

export function WizardHeader({ isSaving, lastSaved }: WizardHeaderProps) {
  const router = useRouter()
  const [showExitDialog, setShowExitDialog] = useState(false)

  const handleExit = () => {
    router.push('/dashboard')
  }

  return (
    <>
      <header className="h-16 bg-navy-900 flex items-center justify-between px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-bold text-gold-500">IMENSIAH</span>
          <span className="text-sm text-white/50">Wizard</span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Save status */}
          <div className="flex items-center gap-2 text-sm">
            {isSaving ? (
              <>
                <Save className="w-4 h-4 text-gold-500 animate-pulse" />
                <span className="text-white/70">Salvando...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-white/70">
                  {lastSaved
                    ? `Salvo às ${lastSaved.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
                    : 'Auto-save ativo'}
                </span>
              </>
            )}
          </div>

          {/* Exit button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-white hover:bg-white/10"
            onClick={() => setShowExitDialog(true)}
          >
            <X className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      {/* Exit confirmation dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sair do Wizard?</AlertDialogTitle>
            <AlertDialogDescription>
              Seu progresso foi salvo automaticamente. Você pode continuar de onde
              parou a qualquer momento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleExit}>
              Sair do Wizard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
