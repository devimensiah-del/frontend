'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Copy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareableUrl: string | null;
  isGenerating?: boolean;
}

export function ShareDialog({
  open,
  onOpenChange,
  shareableUrl,
  isGenerating = false,
}: ShareDialogProps) {
  const { toast } = useToast();

  const handleCopyLink = async () => {
    if (!shareableUrl) return;
    try {
      await navigator.clipboard.writeText(shareableUrl);
      toast({ title: "Copiado!", description: "Link copiado para a área de transferência." });
    } catch {
      toast({ title: "Erro", description: "Não foi possível copiar o link.", variant: "destructive" });
    }
  };

  const handleOpenLink = () => {
    if (shareableUrl) {
      window.open(shareableUrl, '_blank');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Link de Compartilhamento</DialogTitle>
        </DialogHeader>

        {isGenerating ? (
          <div className="py-4 text-center">
            <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto mb-2" />
            <p className="text-sm text-gray-500">Gerando link...</p>
          </div>
        ) : shareableUrl ? (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={shareableUrl}
                readOnly
                className="font-mono text-sm flex-1"
              />
              <Button onClick={handleCopyLink} size="icon" variant="outline">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleOpenLink}
              >
                Abrir
              </Button>
              <Button
                className="flex-1"
                onClick={handleCopyLink}
              >
                Copiar Link
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center">
            <p className="text-sm text-gray-500">Nenhum link disponível.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
