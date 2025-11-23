"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/Textarea";

/* ============================================
   ENRICHMENT ACTIONS - Action Buttons Bar
   ============================================ */

interface EnrichmentActionsProps {
  onSaveDraft: () => Promise<void>;
  onApprove: () => Promise<void>;
  isSaving?: boolean;
  isApproving?: boolean;
  disabled?: boolean;
}

export function EnrichmentActions({
  onSaveDraft,
  onApprove,
  isSaving = false,
  isApproving = false,
  disabled = false,
}: EnrichmentActionsProps) {
  const [showApproveDialog, setShowApproveDialog] = useState(false);

  const handleApprove = async () => {
    await onApprove();
    setShowApproveDialog(false);
  };

  return (
    <>
      <div className="bg-white border-t border-line px-6 py-4 sticky bottom-0 z-10">
        <div className="flex items-center justify-between gap-4">
          {/* Save Indicator */}
          <div className="flex items-center gap-2">
            {isSaving && (
              <span className="text-sm text-text-secondary">Salvando...</span>
            )}
            {!isSaving && !disabled && (
              <span className="text-sm text-green-600">Salvo</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Save Draft */}
            <Button
              onClick={onSaveDraft}
              disabled={disabled || isSaving}
              variant="outline"
              className="bg-white text-navy-900 border-navy-900 hover:bg-surface-paper"
            >
              {isSaving ? "Salvando..." : "Salvar Rascunho"}
            </Button>

            {/* Approve - Automatically triggers analysis creation */}
            <Button
              onClick={() => setShowApproveDialog(true)}
              disabled={disabled || isApproving}
              variant="default"
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {isApproving ? "Aprovando..." : "Aprovar Enriquecimento"}
            </Button>
          </div>
        </div>
      </div>

      {/* Approve Confirmation Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprovar Enriquecimento</DialogTitle>
            <DialogDescription>
              Ao aprovar este enriquecimento, a análise estratégica será criada
              automaticamente e iniciará o processamento. Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowApproveDialog(false)}
              disabled={isApproving}
            >
              Cancelar
            </Button>
            <Button
              variant="default"
              onClick={handleApprove}
              disabled={isApproving}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {isApproving ? "Aprovando..." : "Confirmar Aprovação"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
