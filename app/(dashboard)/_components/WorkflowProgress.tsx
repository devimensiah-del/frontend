import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertCircle, Clock, Zap, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnrichmentStatus, AnalysisStatus } from '@/lib/types';

interface WorkflowProgressProps {
    enrichmentStatus?: EnrichmentStatus;
    analysisStatus?: AnalysisStatus;
    enrichmentError?: string;
    analysisError?: string;
    isAdmin?: boolean;
    onRetryEnrichment?: () => void;
    onRetryAnalysis?: () => void;
}

export function WorkflowProgress({
    enrichmentStatus,
    analysisStatus,
    enrichmentError,
    analysisError,
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
            errorMessage: enrichmentError,
            description: 'IA analisando e enriquecendo informações da empresa'
        },
        {
            id: 'analysis',
            label: 'Análise Estratégica',
            icon: FileCheck,
            status: analysisStatus,
            errorMessage: analysisError,
            description: 'Aplicando frameworks estratégicos (SWOT, PESTEL, Porter, etc.)'
        },
        {
            id: 'delivery',
            label: 'Entrega',
            icon: CheckCircle,
            // Only show as active/complete when analysis is actually approved/sent
            // Otherwise show as waiting (undefined status = gray)
            status: analysisStatus === 'sent' ? 'completed' : analysisStatus === 'approved' ? 'processing' : undefined,
            errorMessage: undefined,
            description: 'Relatório final pronto para visualização'
        }
    ];

    const getStepState = (step: typeof steps[0]) => {
        const status = step.status;
        const hasError = !!step.errorMessage;

        // Error state takes priority (when errorMessage exists)
        if (hasError) {
            return { color: 'red', icon: AlertCircle, text: 'Erro' };
        }

        // Status-based states (valid API statuses only)
        if (status === 'completed' || status === 'approved' || status === 'sent') {
            return { color: 'green', icon: CheckCircle, text: 'Concluído' };
        }
        if (status === 'pending') {
            return { color: 'blue', icon: Loader2, text: 'Processando', animate: true };
        }

        // Default: waiting (no status yet)
        return { color: 'gray', icon: Clock, text: 'Aguardando' };
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {steps.map((step, index) => {
                const state = getStepState(step);
                const Icon = state.icon;
                const StepIcon = step.icon;
                const isActive = state.text === 'Processando';
                const isComplete = state.text === 'Concluído';
                const isFailed = state.text === 'Erro';

                return (
                    <div key={step.id} className="relative">
                        {/* Connector Line - Responsive positioning */}
                        {index < steps.length - 1 && (
                            <div
                                className={`absolute left-5 sm:left-6 top-12 sm:top-14 w-0.5 h-16 sm:h-12 transition-colors ${
                                    isComplete ? 'bg-green-500' : 'bg-gray-200'
                                }`}
                            />
                        )}

                        <div className="flex items-start gap-3 sm:gap-4">
                            {/* Status Icon */}
                            <div
                                className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                                    isComplete ? 'bg-green-50 border-green-500' :
                                    isActive ? 'bg-blue-50 border-blue-500' :
                                    isFailed ? 'bg-red-50 border-red-500' :
                                    'bg-gray-50 border-gray-300'
                                }`}
                            >
                                <Icon
                                    className={`w-5 h-5 sm:w-6 sm:h-6 ${
                                        isComplete ? 'text-green-600' :
                                        isActive ? 'text-blue-600' :
                                        isFailed ? 'text-red-600' :
                                        'text-gray-400'
                                    }`}
                                />
                            </div>

                            {/* Step Content */}
                            <div className="flex-1 pt-0 sm:pt-1 min-w-0">
                                {/* Step Header */}
                                <div className="flex items-start gap-2 mb-1.5">
                                    <StepIcon className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-sm sm:text-base text-navy-900 leading-tight">
                                            <span className="hidden sm:inline">Etapa {index + 1}: </span>
                                            {step.label}
                                        </h4>
                                        <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                                            {step.description}
                                        </p>
                                        {/* Error Message Display */}
                                        {isFailed && step.errorMessage && (
                                            <p className="text-xs text-red-600 mt-2 bg-red-50 p-2 rounded border border-red-200">
                                                {step.errorMessage}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Status Badge & Actions */}
                                <div className="flex flex-wrap items-center gap-2 mt-3">
                                    <span
                                        className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${
                                            isComplete ? 'bg-green-100 text-green-700' :
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
                                            className="h-8 text-xs font-medium min-h-[36px] sm:min-h-[32px]"
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
    );
}
