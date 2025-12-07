'use client'

import { useState } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function DangerZone() {
  const [isOpen, setIsOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirmText !== 'excluir minha conta') return

    setIsDeleting(true)
    // API call would go here
    setTimeout(() => {
      setIsDeleting(false)
      setIsOpen(false)
    }, 2000)
  }

  return (
    <div className="bg-white border border-destructive/50 rounded-lg p-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-destructive" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-destructive mb-2">
            Zona de Perigo
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Uma vez que você exclua sua conta, não há como voltar atrás. Por favor,
            tenha certeza.
          </p>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">Excluir Conta</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tem certeza absoluta?</DialogTitle>
                <DialogDescription>
                  Esta ação não pode ser desfeita. Isso irá excluir permanentemente
                  sua conta e remover todos os seus dados de nossos servidores.
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <Label htmlFor="confirm">
                  Digite <strong>excluir minha conta</strong> para confirmar:
                </Label>
                <Input
                  id="confirm"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="excluir minha conta"
                  className="mt-2"
                />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={confirmText !== 'excluir minha conta' || isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Excluindo...
                    </>
                  ) : (
                    'Excluir Conta'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
