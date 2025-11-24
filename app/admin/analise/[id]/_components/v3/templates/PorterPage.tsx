import type { PorterAnalysis } from "@/types";

interface PorterPageProps {
    data: PorterAnalysis;
    companyName: string;
    date: string;
}

export function PorterPage({ data, companyName, date }: PorterPageProps) {
    const getIntensityClass = (intensity: string) => {
        const lower = intensity?.toLowerCase();
        if (lower === 'alta') return 'bg-[#FEE2E2] text-[#991B1B]';
        if (lower === 'média') return 'bg-[#FEF3C7] text-[#92400E]';
        return 'bg-[#D1FAE5] text-[#065F46]';
    };

    return (
        <div className="w-[842px] h-[595px] max-w-[842px] max-h-[595px] overflow-hidden p-8 flex flex-col bg-white">
            <div className="flex justify-between mb-4 pb-2 border-b border-[#E5E0D6]">
                <div className="text-[10px] font-semibold text-[#B89E68]">07</div>
                <div className="text-[10px] text-[#71717A]">{companyName}</div>
            </div>

            <h1 className="text-[22px] font-light text-[#0A101D] mb-1">7 Forças de Porter (2025+)</h1>
            <div className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#B89E68] mb-4">
                Dinâmica Competitiva + Forças Modernas
            </div>

            <div className="grid grid-cols-[1fr_240px] gap-4 flex-1 overflow-hidden">
                <div className="flex flex-col gap-2 overflow-hidden">
                    {/* Traditional 5 Forces */}
                    <div className="p-2 px-3 border-l-[3px] border-[#B89E68] bg-[#FAFAF9]">
                        <div className="flex justify-between items-center mb-1">
                            <div className="text-[9px] font-bold text-[#0A101D]">Rivalidade Competitiva</div>
                            <span className={`inline-block px-2 py-0.5 text-[7px] font-bold uppercase tracking-wider rounded ${getIntensityClass('Média')}`}>
                                Média
                            </span>
                        </div>
                        <div className="text-[7.5px] leading-snug text-[#374151] line-clamp-2">
                            {data.competitiveRivalry || data.summary}
                        </div>
                    </div>

                    <div className="p-2 px-3 border-l-[3px] border-[#B89E68] bg-[#FAFAF9]">
                        <div className="flex justify-between items-center mb-1">
                            <div className="text-[9px] font-bold text-[#0A101D]">Poder dos Fornecedores</div>
                            <span className={`inline-block px-2 py-0.5 text-[7px] font-bold uppercase tracking-wider rounded ${getIntensityClass('Média')}`}>
                                Média
                            </span>
                        </div>
                        <div className="text-[7.5px] leading-snug text-[#374151] line-clamp-2">
                            {data.supplierPower || 'Análise do poder de negociação dos fornecedores'}
                        </div>
                    </div>

                    <div className="p-2 px-3 border-l-[3px] border-[#B89E68] bg-[#FAFAF9]">
                        <div className="flex justify-between items-center mb-1">
                            <div className="text-[9px] font-bold text-[#0A101D]">Poder dos Compradores</div>
                            <span className={`inline-block px-2 py-0.5 text-[7px] font-bold uppercase tracking-wider rounded ${getIntensityClass('Média')}`}>
                                Média
                            </span>
                        </div>
                        <div className="text-[7.5px] leading-snug text-[#374151] line-clamp-2">
                            {data.buyerPower || 'Análise do poder de negociação dos compradores'}
                        </div>
                    </div>

                    <div className="p-2 px-3 border-l-[3px] border-[#B89E68] bg-[#FAFAF9]">
                        <div className="flex justify-between items-center mb-1">
                            <div className="text-[9px] font-bold text-[#0A101D]">Ameaça de Novos Entrantes</div>
                            <span className={`inline-block px-2 py-0.5 text-[7px] font-bold uppercase tracking-wider rounded ${getIntensityClass('Média')}`}>
                                Média
                            </span>
                        </div>
                        <div className="text-[7.5px] leading-snug text-[#374151] line-clamp-2">
                            {data.threatNewEntrants || 'Análise de barreiras de entrada no mercado'}
                        </div>
                    </div>

                    <div className="p-2 px-3 border-l-[3px] border-[#B89E68] bg-[#FAFAF9]">
                        <div className="flex justify-between items-center mb-1">
                            <div className="text-[9px] font-bold text-[#0A101D]">Ameaça de Substitutos</div>
                            <span className={`inline-block px-2 py-0.5 text-[7px] font-bold uppercase tracking-wider rounded ${getIntensityClass('Média')}`}>
                                Média
                            </span>
                        </div>
                        <div className="text-[7.5px] leading-snug text-[#374151] line-clamp-2">
                            {data.threatSubstitutes || 'Análise de produtos ou serviços substitutos'}
                        </div>
                    </div>

                    {/* Modern Forces */}
                    <div className="text-[7px] font-bold uppercase text-[#8B5CF6] mt-1.5 mb-1">
                        + 2 Forças Modernas (2025+)
                    </div>

                    <div className="p-2 px-3 border-l-[3px] border-[#8B5CF6] bg-[#FAF5FF]">
                        <div className="flex justify-between items-center mb-1">
                            <div className="text-[9px] font-bold text-[#8B5CF6]">Poder de Parcerias/Ecossistemas</div>
                            <span className={`inline-block px-2 py-0.5 text-[7px] font-bold uppercase tracking-wider rounded ${getIntensityClass('Média')}`}>
                                Média
                            </span>
                        </div>
                        <div className="text-[7.5px] leading-snug text-[#374151] line-clamp-2">
                            {data.powerOfPartnerships || 'Análise do impacto de parcerias estratégicas e ecossistemas'}
                        </div>
                    </div>

                    <div className="p-2 px-3 border-l-[3px] border-[#8B5CF6] bg-[#FAF5FF]">
                        <div className="flex justify-between items-center mb-1">
                            <div className="text-[9px] font-bold text-[#8B5CF6]">Disrupção por IA/Dados</div>
                            <span className={`inline-block px-2 py-0.5 text-[7px] font-bold uppercase tracking-wider rounded ${getIntensityClass('Média')}`}>
                                Média
                            </span>
                        </div>
                        <div className="text-[7.5px] leading-snug text-[#374151] line-clamp-2">
                            {data.aiDataDisruption || 'Análise do impacto de IA e dados na indústria'}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="bg-[#F7F6F4] p-3 border-l-4 border-[#B89E68] flex-1 overflow-hidden">
                        <div className="text-[8px] font-bold uppercase tracking-wider text-[#71717A] mb-2">
                            Implicações Estratégicas
                        </div>
                        <div className="text-[7.5px] leading-snug text-[#111827] mb-1.5 pl-2.5 relative">
                            <span className="absolute left-0 text-[#B89E68] font-bold">→</span>
                            Foco em diferenciação competitiva
                        </div>
                        <div className="text-[7.5px] leading-snug text-[#111827] mb-1.5 pl-2.5 relative">
                            <span className="absolute left-0 text-[#B89E68] font-bold">→</span>
                            Construir parcerias estratégicas
                        </div>
                        <div className="text-[7.5px] leading-snug text-[#111827] mb-1.5 pl-2.5 relative">
                            <span className="absolute left-0 text-[#B89E68] font-bold">→</span>
                            Investir em tecnologia e dados
                        </div>
                    </div>

                    <div className="bg-[#F7F6F4] p-2.5 border-l-4 border-[#B89E68] text-center">
                        <div className="text-[7px] font-bold uppercase tracking-wider text-[#71717A] mb-1">
                            Atratividade Geral
                        </div>
                        <div className="text-[14px] font-bold text-[#B89E68]">
                            {data.overallAttractiveness || 'Moderada'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-3 border-t border-[#E5E0D6] text-[8px] text-[#71717A] mt-auto">
                <div>IMENSIAH — Relatório de Inteligência Estratégica</div>
                <div>{date}</div>
            </div>
        </div>
    );
}
