import type { Synthesis } from "@/types";

interface ExecSummaryPageProps {
    data: Synthesis;
    companyName: string;
    date: string;
}

export function ExecSummaryPage({ data, companyName, date }: ExecSummaryPageProps) {
    return (
        <div className="w-[842px] h-[595px] max-w-[842px] max-h-[595px] overflow-hidden p-8 flex flex-col bg-white">
            {/* Header */}
            <div className="flex justify-between items-center mb-5 pb-2 border-b border-[#E5E0D6] flex-shrink-0">
                <div className="text-[10px] font-semibold text-[#B89E68] tracking-wider">02</div>
                <div className="text-[10px] font-medium text-[#71717A] tracking-wide">{companyName}</div>
            </div>

            {/* Title */}
            <h1 className="text-[24px] font-light text-[#0A101D] mb-1 tracking-tight">Sumário Executivo</h1>
            <div className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#B89E68] mb-5">
                Visão Estratégica
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden min-h-0">
                {/* Central Challenge */}
                {data.executiveSummary && (
                    <div className="mb-4">
                        <div className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#71717A] mb-2">
                            Desafio Central
                        </div>
                        <div className="text-[10px] leading-relaxed text-[#111827] p-4 bg-[#F7F6F4] border-l-4 border-[#B89E68] mb-4">
                            {data.executiveSummary.substring(0, 200)}...
                        </div>
                    </div>
                )}

                {/* Executive Summary */}
                <div className="mb-4">
                    <div className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#71717A] mb-2">
                        Sumário Executivo
                    </div>
                    <div className="text-[10px] leading-relaxed text-[#111827] mb-3">
                        {data.executiveSummary}
                    </div>
                </div>

                {/* Main Findings */}
                {data.keyFindings && data.keyFindings.length > 0 && (
                    <div className="mb-4">
                        <div className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#71717A] mb-2">
                            Principais Achados
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                            {data.keyFindings.slice(0, 4).map((finding, idx) => (
                                <div key={idx} className="border border-[#E5E0D6] bg-white p-2">
                                    <div className="text-[8.5px] leading-relaxed text-[#52525B]">{finding}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Strategic Priorities */}
                {data.strategicPriorities && data.strategicPriorities.length > 0 && (
                    <div className="mt-3">
                        <div className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#71717A] mb-2">
                            Recomendações Prioritárias
                        </div>
                        <ul className="list-none p-0">
                            {data.strategicPriorities.slice(0, 5).map((priority, idx) => (
                                <li key={idx} className="text-[9px] leading-relaxed text-[#111827] mb-1.5 pl-3.5 relative">
                                    <span className="absolute left-0 text-[#B89E68] font-bold">→</span>
                                    {priority}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-2 border-t border-[#E5E0D6] text-[8px] text-[#71717A] flex-shrink-0 mt-3">
                <div>IMENSIAH — Relatório de Inteligência Estratégica</div>
                <div>{date}</div>
            </div>
        </div>
    );
}
