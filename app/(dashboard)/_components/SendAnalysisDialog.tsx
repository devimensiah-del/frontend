import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Send, User, Building2 } from 'lucide-react';

interface SendAnalysisDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    userEmail: string;
    companyName: string;
    isLoading?: boolean;
}

export function SendAnalysisDialog({
    open,
    onOpenChange,
    onConfirm,
    userEmail,
    companyName,
    isLoading
}: SendAnalysisDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Send className="w-5 h-5 text-navy-900" />
                        Liberar Análise para Cliente
                    </DialogTitle>
                    <DialogDescription>
                        O relatório ficará disponível no painel do cliente
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Cliente
                        </label>
                        <Input
                            value={userEmail}
                            disabled
                            className="bg-gray-50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            Empresa
                        </label>
                        <Input
                            value={companyName}
                            disabled
                            className="bg-gray-50"
                        />
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-900">
                            <strong>Atenção:</strong> Ao confirmar, o cliente poderá visualizar e baixar o relatório completo em PDF quando acessar o painel.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="bg-navy-900 text-white hover:bg-navy-800"
                    >
                        {isLoading ? (
                            <>Liberando...</>
                        ) : (
                            <>
                                <Send className="w-4 h-4 mr-2" />
                                Confirmar e Liberar
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
