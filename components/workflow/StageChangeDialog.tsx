'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react';
import type { AdminStageConfig, UserStageConfig } from '@/lib/utils/workflow-stages';

interface StageChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fromStage: number;
  toStage: number;
  description: string;
  isBackward: boolean;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  stages: (AdminStageConfig | UserStageConfig)[];
}

export function StageChangeDialog({
  open,
  onOpenChange,
  fromStage,
  toStage,
  description,
  isBackward,
  isLoading,
  onConfirm,
  onCancel,
  stages,
}: StageChangeDialogProps) {
  const fromStageConfig = stages.find((s) => s.stage === fromStage);
  const toStageConfig = stages.find((s) => s.stage === toStage);

  const getConsequences = () => {
    if (isBackward) {
      const consequences: string[] = [];

      if (toStage === 2) {
        consequences.push('O enriquecimento será desbloqueado para edição');
        consequences.push('Ao aprovar novamente, a análise será reexecutada');
      }

      if (toStage === 4) {
        consequences.push('A análise será desbloqueada para edição');
        consequences.push('O relatório precisará ser re-aprovado');
      }

      if (toStage === 5) {
        consequences.push('O relatório será ocultado do cliente');
      }

      return consequences;
    }

    // Forward moves
    const consequences: string[] = [];

    if (toStage === 3) {
      consequences.push('O enriquecimento será bloqueado');
      consequences.push('A análise começará automaticamente');
    }

    if (toStage === 5) {
      consequences.push('A análise será bloqueada');
    }

    if (toStage === 6) {
      consequences.push('O cliente poderá visualizar o relatório');
    }

    return consequences;
  };

  const consequences = getConsequences();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isBackward && <AlertTriangle className="w-5 h-5 text-amber-500" />}
            Confirmar Mudança de Estágio
          </DialogTitle>
          <DialogDescription>
            <div className="space-y-4 mt-4">
              {/* Stage transition visualization */}
              <div className="flex items-center justify-center gap-3 py-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1',
                      isBackward ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    )}
                  >
                    {fromStage}
                  </div>
                  <span className="text-xs text-gray-500">{fromStageConfig?.label}</span>
                </div>

                {isBackward ? (
                  <ArrowLeft className="w-6 h-6 text-amber-500" />
                ) : (
                  <ArrowRight className="w-6 h-6 text-green-500" />
                )}

                <div className="text-center">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1',
                      isBackward ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'
                    )}
                  >
                    {toStage}
                  </div>
                  <span className="text-xs text-gray-500">{toStageConfig?.label}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600">{description}</p>

              {/* Consequences */}
              {consequences.length > 0 && (
                <div
                  className={cn(
                    'p-3 rounded-lg text-sm',
                    isBackward ? 'bg-amber-50 border border-amber-200' : 'bg-blue-50 border border-blue-200'
                  )}
                >
                  <p className="font-medium mb-2">
                    {isBackward ? 'Atenção:' : 'O que vai acontecer:'}
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {consequences.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              isBackward && 'bg-amber-500 hover:bg-amber-600'
            )}
          >
            {isLoading ? 'Aplicando...' : 'Confirmar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
