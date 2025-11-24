import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertCircle, Clock, Zap, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnrichmentStatus, AnalysisStatus } from '@/lib/types';

interface WorkflowProgressProps {
    enrichmentStatus?: EnrichmentStatus;
    analysisStatus?: AnalysisStatus;
    isAdmin?: boolean;
    onRetryEnrichment?: () => void;
    onRetryAnalysis?: () => void;
}

export function WorkflowProgress({
    enrichmentStatus,
    analysisStatus,
    isAdmin,
    onRetryEnrichment,
    onRetryAnalysis
}: WorkflowProgressProps) {
    const steps = [
        {
            id: 'enrichment',
            label: 'Enriquecimento de Dados',
            icon: Zap,
            status: enrichmentStatus,
            description: 'IA analisando e enriquecendo informações da empresa'
        },
        {
            id: 'analysis',
            label: 'Análise Estratégica',
            icon: FileCheck,
            status: analysisStatus,
            description: 'Aplicando frameworks estratégicos (SWOT, PESTEL, Porter, etc.)'
        },
        {
            id: 'delivery',
            label: 'Entrega',
            icon: CheckCircle,
            status: analysisStatus === 'sent' ? 'completed' : analysisStatus === 'approved' ? 'processing' : 'pending',
            description: 'Relatório final pronto para visualização'
        }
    ];

    const getStepState = (step: typeof steps[0]) => {
        const status = step.status;

        if (status === 'failed') {
            return { color: 'red', icon: AlertCircle, text: 'Erro' };
        }
        if (status === 'completed' || status === 'approved' || status === 'sent') {
            return { color: 'green', icon: CheckCircle, text: 'Concluído' };
        }
        if (status === 'pending' || status === 'processing') {
            return { color: 'blue', icon: Loader2, text: 'Processando', animate: true };
        }
        return { color: 'gray', icon: Clock, text: 'Aguardando' };
    };

    return (
        <Card className="border-gold-200 bg-gradient-to-br from-gold-50/30 to-white">
            <CardContent className="py-8">
                <div className="space-y-6">
                    {steps.map((step, index) => {
                        const state = getStepState(step);
                        const Icon = state.icon;
                        const StepIcon = step.icon;
                        const isActive = state.text === 'Processando';
                        const isComplete = state.text === 'Concluído';
                        const isFailed = state.text === 'Erro';

                        return (
                            <div key={step.id} className="relative">
                                {index < steps.length - 1 && (
                                    <div
                                        className={`absolute left-6 top-12 w-0.5 h-12 ${isComplete ? 'bg-green-500' : 'bg-gray-200'
                                            }`}
                                    />
                                )}

                                <div className="flex items-start gap-4">
                                    <div
                                        className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center ${isComplete ? 'bg-green-50 border-green-500' :
                                                isActive ? 'bg-blue-50 border-blue-500' :
                                                    isFailed ? 'bg-red-50 border-red-500' :
                                                        'bg-gray-50 border-gray-300'
                                            }`}
                                    >
                                        <Icon
                                            className={`w-6 h-6 ${isComplete ? 'text-green-600' :
                                                    isActive ? 'text-blue-600' :
                                                        isFailed ? 'text-red-600' :
                                                            'text-gray-400'
                                                } ${state.animate ? 'animate-spin' : ''}`}
                                        />
                                    </div>

                                    <div className="flex-1 pt-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <StepIcon className="w-4 h-4 text-gray-500" />
                                            <h4 className="font-semibold text-navy-900">
                                                Etapa {index + 1}: {step.label}
                                            </h4>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">
                                            {step.description}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`text-xs font-medium px-2 py-1 rounded-full ${isComplete ? 'bg-green-100 text-green-700' :
                                                        isActive ? 'bg-blue-100 text-blue-700' :
                                                            isFailed ? 'bg-red-100 text-red-700' :
                                                                'bg-gray-100 text-gray-600'
                                                    }`}
                                            >
                                                {state.text}
                                            </span>

                                            {isFailed && isAdmin && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={step.id === 'enrichment' ? onRetryEnrichment : onRetryAnalysis}
                                                    className="h-7 text-xs"
                                                >
                                                    Tentar Novamente
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
