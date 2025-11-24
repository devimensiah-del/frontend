// All remaining template page components in one file for efficiency
import type {
    TamSamSomAnalysis, BlueOceanAnalysis, OKRsAnalysis,
    ScenariosAnalysis, BenchmarkingAnalysis, GrowthHackingAnalysis,
    BSCAnalysis, DecisionMatrixAnalysis, Synthesis
} from "@/types";

// TAM SAM SOM Page
export function TamSamSomPage({ data, companyName, date }: { data: TamSamSomAnalysis; companyName: string; date: string }) {
    return (
        <div className="w-[842px] h-[595px] max-w-[842px] max-h-[595px] overflow-hidden p-8 flex flex-col bg-white">
            <div className="flex justify-between mb-4 pb-2 border-b border-[#E5E0D6]">
                <div className="text-[10px] font-semibold text-[#B89E68]">09</div>
                <div className="text-[10px] text-[#71717A]">{companyName}</div>
            </div>
            <h1 className="text-[22px] font-light text-[#0A101D] mb-1">TAM SAM SOM</h1>
            <div className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#B89E68] mb-6">Dimensionamento de Mercado</div>

            <div className="flex-1 flex flex-col justify-center space-y-6">
                <div className="border-l-4 border-[#B89E68] pl-6">
                    <div className="text-[10px] font-bold text-[#71717A] mb-2">TAM - Total Addressable Market</div>
                    <div className="text-[32px] font-light text-[#0A101D]">{data.tam}</div>
                </div>
                <div className="border-l-4 border-[#B89E68] pl-6">
                    <div className="text-[10px] font-bold text-[#71717A] mb-2">SAM - Serviceable Available Market</div>
                    <div className="text-[32px] font-light text-[#0A101D]">{data.sam}</div>
                </div>
                <div className="border-l-4 border-[#B89E68] pl-6">
                    <div className="text-[10px] font-bold text-[#71717A] mb-2">SOM - Serviceable Obtainable Market</div>
                    <div className="text-[32px] font-light text-[#0A101D]">{data.som}</div>
                </div>
            </div>

            <div className="flex justify-between pt-3 border-t border-[#E5E0D6] text-[8px] text-[#71717A]">
                <div>IMENSIAH — Relatório de Inteligência Estratégica</div>
                <div>{date}</div>
            </div>
        </div>
    );
}

// Blue Ocean Page
export function BlueOceanPage({ data, companyName, date }: { data: BlueOceanAnalysis; companyName: string; date: string }) {
    return (
        <div className="w-[842px] h-[595px] max-w-[842px] max-h-[595px] overflow-hidden p-8 flex flex-col bg-white">
            <div className="flex justify-between mb-4 pb-2 border-b border-[#E5E0D6]">
                <div className="text-[10px] font-semibold text-[#B89E68]">11</div>
                <div className="text-[10px] text-[#71717A]">{companyName}</div>
            </div>
            <h1 className="text-[22px] font-light text-[#0A101D] mb-1">Blue Ocean Strategy</h1>
            <div className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#B89E68] mb-4">Framework ERRC</div>

            <div className="grid grid-cols-2 gap-4 flex-1">
                <div className="border border-[#E5E0D6] p-4">
                    <div className="text-[10px] font-bold text-[#DC2626] mb-3">Eliminar</div>
                    <ul className="space-y-1">
                        {data.eliminate?.map((item, idx) => (
                            <li key={idx} className="text-[8.5px] text-[#111827] pl-2.5 relative">
                                <span className="absolute left-0">•</span>{item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="border border-[#E5E0D6] p-4">
                    <div className="text-[10px] font-bold text-[#EA580C] mb-3">Reduzir</div>
                    <ul className="space-y-1">
                        {data.reduce?.map((item, idx) => (
                            <li key={idx} className="text-[8.5px] text-[#111827] pl-2.5 relative">
                                <span className="absolute left-0">•</span>{item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="border border-[#E5E0D6] p-4">
                    <div className="text-[10px] font-bold text-[#0891B2] mb-3">Elevar</div>
                    <ul className="space-y-1">
                        {data.raise?.map((item, idx) => (
                            <li key={idx} className="text-[8.5px] text-[#111827] pl-2.5 relative">
                                <span className="absolute left-0">•</span>{item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="border border-[#E5E0D6] p-4">
                    <div className="text-[10px] font-bold text-[#10B981] mb-3">Criar</div>
                    <ul className="space-y-1">
                        {data.create?.map((item, idx) => (
                            <li key={idx} className="text-[8.5px] text-[#111827] pl-2.5 relative">
                                <span className="absolute left-0">•</span>{item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="flex justify-between pt-3 border-t border-[#E5E0D6] text-[8px] text-[#71717A]">
                <div>IMENSIAH — Relatório de Inteligência Estratégica</div>
                <div>{date}</div>
            </div>
        </div>
    );
}

// OKRs Page
export function OkrsPage({ data, companyName, date }: { data: OKRsAnalysis; companyName: string; date: string }) {
    return (
        <div className="w-[842px] h-[595px] max-w-[842px] max-h-[595px] overflow-hidden p-8 flex flex-col bg-white">
            <div className="flex justify-between mb-4 pb-2 border-b border-[#E5E0D6]">
                <div className="text-[10px] font-semibold text-[#B89E68]">15</div>
                <div className="text-[10px] text-[#71717A]">{companyName}</div>
            </div>
            <h1 className="text-[22px] font-light text-[#0A101D] mb-1">OKRs Estratégicos</h1>
            <div className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#B89E68] mb-4">Objetivos e Resultados-Chave</div>

            <div className="grid grid-cols-3 gap-4 flex-1">
                {data.quarters?.slice(0, 3).map((quarter, idx) => (
                    <div key={idx} className="border border-[#E5E0D6] p-3">
                        <div className="text-[10px] font-bold text-[#B89E68] mb-2">{quarter.quarter}</div>
                        <div className="text-[9px] font-semibold text-[#0A101D] mb-2">{quarter.objective}</div>
                        <div className="space-y-1">
                            {quarter.key_results?.map((kr, krIdx) => (
                                <div key={krIdx} className="text-[7.5px] text-[#374151] pl-2 relative">
                                    <span className="absolute left-0">→</span>
                                    {kr.description}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between pt-3 border-t border-[#E5E0D6] text-[8px] text-[#71717A]">
                <div>IMENSIAH — Relatório de Inteligência Estratégica</div>
                <div>{date}</div>
            </div>
        </div>
    );
}

// Scenarios Page
export function ScenariosPage({ data, companyName, date }: { data: ScenariosAnalysis; companyName: string; date: string }) {
    return (
        <div className="w-[842px] h-[595px] max-w-[842px] max-h-[595px] overflow-hidden p-8 flex flex-col bg-white">
            <div className="flex justify-between mb-4 pb-2 border-b border-[#E5E0D6]">
                <div className="text-[10px] font-semibold text-[#B89E68]">21</div>
                <div className="text-[10px] text-[#71717A]">{companyName}</div>
            </div>
            <h1 className="text-[22px] font-light text-[#0A101D] mb-1">Cenários Futuros</h1>
            <div className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#B89E68] mb-4">Análise de Cenários</div>

            <div className="space-y-4 flex-1">
                <div className="border-l-4 border-[#10B981] bg-[#F0FDF4] p-4">
                    <div className="text-[10px] font-bold text-[#10B981] mb-2">Cenário Otimista</div>
                    <div className="text-[9px] text-[#111827] leading-relaxed">{data.optimistic}</div>
                </div>
                <div className="border-l-4 border-[#F59E0B] bg-[#FFFBEB] p-4">
                    <div className="text-[10px] font-bold text-[#F59E0B] mb-2">Cenário Realista</div>
                    <div className="text-[9px] text-[#111827] leading-relaxed">{data.realist}</div>
                </div>
                <div className="border-l-4 border-[#DC2626] bg-[#FEF2F2] p-4">
                    <div className="text-[10px] font-bold text-[#DC2626] mb-2">Cenário Pessimista</div>
                    <div className="text-[9px] text-[#111827] leading-relaxed">{data.pessimistic}</div>
                </div>
            </div>

            <div className="flex justify-between pt-3 border-t border-[#E5E0D6] text-[8px] text-[#71717A]">
                <div>IMENSIAH — Relatório de Inteligência Estratégica</div>
                <div>{date}</div>
            </div>
        </div>
    );
}

// Benchmarking Page
export function BenchmarkingPage({ data, companyName, date }: { data: BenchmarkingAnalysis; companyName: string; date: string }) {
    return (
        <div className="w-[842px] h-[595px] max-w-[842px] max-h-[595px] overflow-hidden p-8 flex flex-col bg-white">
            <div className="flex justify-between mb-4 pb-2 border-b border-[#E5E0D6]">
                <div className="text-[10px] font-semibold text-[#B89E68]">13</div>
                <div className="text-[10px] text-[#71717A]">{companyName}</div>
            </div>
            <h1 className="text-[22px] font-light text-[#0A101D] mb-1">Benchmarking Competitivo</h1>
            <div className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#B89E68] mb-4">Análise Comparativa</div>

            <div className="grid grid-cols-2 gap-4 flex-1">
                <div>
                    <div className="text-[10px] font-bold text-[#71717A] mb-3">Competidores Analisados</div>
                    <ul className="space-y-2">
                        {data.competitorsAnalyzed?.map((comp, idx) => (
                            <li key={idx} className="text-[9px] text-[#111827] pl-2.5 relative">
                                <span className="absolute left-0">•</span>{comp}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <div className="text-[10px] font-bold text-[#71717A] mb-3">Melhores Práticas</div>
                    <ul className="space-y-2">
                        {data.bestPractices?.map((practice, idx) => (
                            <li key={idx} className="text-[9px] text-[#111827] pl-2.5 relative">
                                <span className="absolute left-0">→</span>{practice}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="flex justify-between pt-3 border-t border-[#E5E0D6] text-[8px] text-[#71717A]">
                <div>IMENSIAH — Relatório de Inteligência Estratégica</div>
                <div>{date}</div>
            </div>
        </div>
    );
}

// Generic Placeholder Page
export function PlaceholderPage({ pageNumber, title, companyName, date }: { pageNumber: string; title: string; companyName: string; date: string }) {
    return (
        <div className="w-[842px] h-[595px] max-w-[842px] max-h-[595px] overflow-hidden p-8 flex flex-col bg-white">
            <div className="flex justify-between mb-4 pb-2 border-b border-[#E5E0D6]">
                <div className="text-[10px] font-semibold text-[#B89E68]">{pageNumber}</div>
                <div className="text-[10px] text-[#71717A]">{companyName}</div>
            </div>
            <h1 className="text-[22px] font-light text-[#0A101D] mb-1">{title}</h1>
            <div className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#B89E68] mb-4">Em Desenvolvimento</div>

            <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-[#71717A]">
                    <div className="text-[48px] mb-4">📊</div>
                    <div className="text-[12px]">Conteúdo em desenvolvimento</div>
                </div>
            </div>

            <div className="flex justify-between pt-3 border-t border-[#E5E0D6] text-[8px] text-[#71717A]">
                <div>IMENSIAH — Relatório de Inteligência Estratégica</div>
                <div>{date}</div>
            </div>
        </div>
    );
}
