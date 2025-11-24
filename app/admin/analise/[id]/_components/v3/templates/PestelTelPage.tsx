import type { PESTELAnalysis } from "@/types";

interface PestelTelPageProps {
    data: PESTELAnalysis;
    companyName: string;
    date: string;
}

export function PestelTelPage({ data, companyName, date }: PestelTelPageProps) {
    return (
        <div className="w-[842px] h-[595px] max-w-[842px] max-h-[595px] overflow-hidden p-8 flex flex-col bg-white">
            <div className="flex justify-between mb-4 pb-2 border-b border-[#E5E0D6]">
                <div className="text-[10px] font-semibold text-[#B89E68]">06</div>
                <div className="text-[10px] text-[#71717A]">{companyName}</div>
            </div>

            <h1 className="text-[22px] font-light text-[#0A101D] mb-1">Análise PESTEL</h1>
            <div className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#B89E68] mb-4">
                Fatores Ambientais - TEL
            </div>

            <div className="grid grid-cols-3 gap-3.5 mb-3.5 flex-1 overflow-hidden">
                <div className="border border-[#E5E0D6] p-3.5 flex flex-col overflow-hidden">
                    <div className="text-[10px] font-bold text-[#0A101D] mb-2.5 pb-1.5 border-b-2 border-[#B89E68]">
                        Tecnológico
                    </div>
                    <ul className="list-none flex-1 overflow-hidden">
                        {data.technological?.map((item, idx) => (
                            <li key={idx} className="text-[8.5px] leading-tight text-[#111827] mb-1 pl-2.5 relative line-clamp-2">
                                <span className="absolute left-0 text-[#B89E68] font-bold">•</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="border border-[#E5E0D6] p-3.5 flex flex-col overflow-hidden">
                    <div className="text-[10px] font-bold text-[#0A101D] mb-2.5 pb-1.5 border-b-2 border-[#B89E68]">
                        Ambiental
                    </div>
                    <ul className="list-none flex-1 overflow-hidden">
                        {data.environmental?.map((item, idx) => (
                            <li key={idx} className="text-[8.5px] leading-tight text-[#111827] mb-1 pl-2.5 relative line-clamp-2">
                                <span className="absolute left-0 text-[#B89E68] font-bold">•</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="border border-[#E5E0D6] p-3.5 flex flex-col overflow-hidden">
                    <div className="text-[10px] font-bold text-[#0A101D] mb-2.5 pb-1.5 border-b-2 border-[#B89E68]">
                        Legal
                    </div>
                    <ul className="list-none flex-1 overflow-hidden">
                        {data.legal?.map((item, idx) => (
                            <li key={idx} className="text-[8.5px] leading-tight text-[#111827] mb-1 pl-2.5 relative line-clamp-2">
                                <span className="absolute left-0 text-[#B89E68] font-bold">•</span>
                                {item}
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
