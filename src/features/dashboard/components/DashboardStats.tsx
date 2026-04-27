import type { LucideIcon } from "lucide-react";
import { Bell, Leaf, ShieldCheck, Sprout } from "lucide-react";

import { StatCard } from "@/shared/components/StatCard";

type DashboardStat = {
    readonly title: string;
    readonly value: string;
    readonly description: string;
    readonly icon: LucideIcon;
};

const DASHBOARD_STATS = [
    {
        title: "Plantas",
        value: "MVP",
        description: "Listagem, cadastro, edição e arquivamento preparados para uso.",
        icon: Sprout,
    },
    {
        title: "Autenticação",
        value: "JWT",
        description: "Login, renovação de sessão, rotas protegidas e logout conectados.",
        icon: ShieldCheck,
    },
    {
        title: "Cuidados",
        value: "Ativo",
        description: "Regas, eventos e histórico por planta organizados em rotas próprias.",
        icon: Leaf,
    },
    {
        title: "Notificações",
        value: "Central",
        description: "Fila preparada para leitura, descarte e acompanhamento de alertas.",
        icon: Bell,
    },
] satisfies readonly DashboardStat[];

export function DashboardStats() {
    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {DASHBOARD_STATS.map((stat) => (
                <StatCard
                    key={stat.title}
                    title={stat.title}
                    value={stat.value}
                    description={stat.description}
                    icon={stat.icon}
                />
            ))}
        </div>
    );
}
