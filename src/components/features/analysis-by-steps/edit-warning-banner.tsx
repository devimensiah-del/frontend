'use client'

import { Info, X } from 'lucide-react'
import { useState } from 'react'

interface EditWarningBannerProps {
  stepNumber: number
  frameworkName: string
}

export function EditWarningBanner({ stepNumber, frameworkName }: EditWarningBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="bg-blue-50 border border-blue-200 p-4 rounded flex items-start gap-3">
      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-blue-900">
          Você está visualizando uma etapa anterior
        </p>
        <p className="text-sm text-blue-700 mt-1">
          Esta é a Etapa {stepNumber} ({frameworkName}). Você pode editar e salvar alterações.
          Etapas posteriores não serão afetadas.
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-blue-600 hover:text-blue-800 transition-colors"
        aria-label="Fechar aviso"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
