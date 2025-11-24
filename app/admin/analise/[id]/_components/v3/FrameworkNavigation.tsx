import {
    BarChart3, Target, ShieldAlert, TrendingUp,
    Globe, Users, GitMerge, Flag, Award,
    LayoutDashboard, BrainCircuit
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { FrameworkKey } from "./WarRoomEditor";

interface NavProps {
    activeFramework: FrameworkKey;
    onSelect: (key: FrameworkKey) => void;
    validationStatus: any;
}

export function FrameworkNavigation({ activeFramework, onSelect, validationStatus }: NavProps) {

    const menuItems = [
        { id: 'synthesis', label: 'Synthesis & Executive', icon: LayoutDashboard },
        { type: 'separator', label: 'Layer 1: Environment' },
        { id: 'pestel', label: 'PESTEL Analysis', icon: Globe },
        { id: 'porter', label: 'Porter 7 Forces', icon: ShieldAlert },
        { id: 'tamSamSom', label: 'TAM SAM SOM', icon: BarChart3 },
        { type: 'separator', label: 'Layer 2: Positioning' },
        { id: 'swot', label: 'SWOT (LIFT Model)', icon: Target },
        { id: 'benchmarking', label: 'Benchmarking', icon: Users },
        { type: 'separator', label: 'Layer 3: Strategy' },
        { id: 'blueOcean', label: 'Blue Ocean', icon: TrendingUp },
        { id: 'growthHacking', label: 'Growth Hacking', icon: BrainCircuit },
        { id: 'scenarios', label: 'Future Scenarios', icon: GitMerge },
        { type: 'separator', label: 'Layer 4: Execution' },
        { id: 'okrs', label: 'Strategic OKRs', icon: Flag },
        { id: 'bsc', label: 'Balanced Scorecard', icon: Award },
        { id: 'decisionMatrix', label: 'Decision Matrix', icon: GitMerge },
    ];

    return (
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {menuItems.map((item, idx) => {
                if (item.type === 'separator') {
                    return (
                        <div key={idx} className="mt-6 mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            {item.label}
                        </div>
                    );
                }

                const Icon = item.icon as any;
                const isActive = activeFramework === item.id;
                // Simple check if data exists to show completion dot
                const hasData = validationStatus && validationStatus[item.id!] && Object.keys(validationStatus[item.id!]).length > 0;

                return (
                    <button
                        key={item.id}
                        onClick={() => onSelect(item.id as FrameworkKey)}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors relative group",
                            isActive
                                ? "bg-blue-600 text-white shadow-md"
                                : "text-gray-400 hover:bg-white/5 hover:text-white"
                        )}
                    >
                        <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-gray-500 group-hover:text-white")} />
                        <span className="flex-1 text-left">{item.label}</span>
                        {hasData && (
                            <span className={cn("w-1.5 h-1.5 rounded-full", isActive ? "bg-white" : "bg-green-500")} />
                        )}
                    </button>
                );
            })}
        </nav>
    );
}
