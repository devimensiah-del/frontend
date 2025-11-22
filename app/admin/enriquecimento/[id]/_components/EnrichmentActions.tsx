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
  onReject: (reason: string) => Promise<void>;
  onGenerateAnalysis: () => Promise<void>;
  isSaving?: boolean;
  isApproving?: boolean;
  isRejecting?: boolean;
  isGenerating?: boolean;
  disabled?: boolean;
}

export function EnrichmentActions({
  onSaveDraft,
  onApprove,
  onReject,
  onGenerateAnalysis,
  isSaving = false,
  isApproving = false,
  isRejecting = false,
  isGenerating = false,
  disabled = false,
}: EnrichmentActionsProps) {
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleApprove = async () => {
    await onApprove();
    setShowApproveDialog(false);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      return;
    }
    await onReject(rejectionReason);
    setShowRejectDialog(false);
    setRejectionReason("");
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

            {/* Reject */}
            <Button
              onClick={() => setShowRejectDialog(true)}
              disabled={disabled || isRejecting}
              variant="outline"
              className="bg-white text-red-600 border-red-600 hover:bg-red-50"
            >
              {isRejecting ? "Rejeitando..." : "Rejeitar"}
            </Button>

            {/* Approve */}
            <Button
              onClick={() => setShowApproveDialog(true)}
              disabled={disabled || isApproving}
              variant="default"
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {isApproving ? "Aprovando..." : "Aprovar Enriquecimento"}
            </Button>

            {/* Generate Analysis */}
            <Button
              onClick={onGenerateAnalysis}
              disabled={disabled || isGenerating}
              variant="default"
              className="bg-gold-500 text-white hover:bg-gold-600"
            >
              {isGenerating ? "Gerando..." : "Gerar Análise"}
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
              Tem certeza que deseja aprovar este enriquecimento? Esta ação não
              pode ser desfeita.
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

      {/* Reject Confirmation Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar Enriquecimento</DialogTitle>
            <DialogDescription>
              Por favor, forneça um motivo para a rejeição deste enriquecimento.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Descreva o motivo da rejeição..."
              rows={4}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectionReason("");
              }}
              disabled={isRejecting}
            >
              Cancelar
            </Button>
            <Button
              variant="default"
              onClick={handleReject}
              disabled={isRejecting || !rejectionReason.trim()}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isRejecting ? "Rejeitando..." : "Confirmar Rejeição"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
