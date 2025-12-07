'use client'

import { Eye, EyeOff, Globe, Lock } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  useToggleVisibility,
  useTogglePublic,
} from '@/lib/hooks/use-admin'

interface VisibilityControlsProps {
  analysisId: string
  isVisibleToUser?: boolean
  isPublic?: boolean
  accessCode?: string
}

export function VisibilityControls({
  analysisId,
  isVisibleToUser = true,
  isPublic = false,
}: VisibilityControlsProps) {
  const toggleVisibility = useToggleVisibility()
  const togglePublic = useTogglePublic()

  return (
    <div className="space-y-4">
      {/* Visibility Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isVisibleToUser ? (
            <Eye className="w-4 h-4 text-muted-foreground" />
          ) : (
            <EyeOff className="w-4 h-4 text-muted-foreground" />
          )}
          <div>
            <Label htmlFor="visible">Visivel para o Usuario</Label>
            <p className="text-xs text-muted-foreground">
              Permite que o usuario veja a analise
            </p>
          </div>
        </div>
        <Switch
          id="visible"
          checked={isVisibleToUser}
          onCheckedChange={() => toggleVisibility.mutate(analysisId)}
          disabled={toggleVisibility.isPending}
        />
      </div>

      {/* Public Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isPublic ? (
            <Globe className="w-4 h-4 text-green-500" />
          ) : (
            <Lock className="w-4 h-4 text-muted-foreground" />
          )}
          <div>
            <Label htmlFor="public">Acesso Publico</Label>
            <p className="text-xs text-muted-foreground">
              Permite acesso via codigo sem login
            </p>
          </div>
        </div>
        <Switch
          id="public"
          checked={isPublic}
          onCheckedChange={() => togglePublic.mutate(analysisId)}
          disabled={togglePublic.isPending}
        />
      </div>
    </div>
  )
}
