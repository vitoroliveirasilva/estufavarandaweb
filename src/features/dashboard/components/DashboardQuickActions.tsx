import type { LucideIcon } from "lucide-react";
import { Bell, Leaf, Plus, Sprout } from "lucide-react";

import { QuickActionCard } from "@/shared/components/QuickActionCard";

type QuickAction = {
    readonly title: string;
    readonly description: string;
    readonly icon: LucideIcon;
    readonly to: string;
    readonly actionLabel: string;
};

const QUICK_ACTIONS = [
    {
        title: "Cadastrar planta",
        description: "Crie uma nova planta com os dados básicos de identificação e cuidado.",
        icon: Plus,
        to: "/app/plants/new",
        actionLabel: "Nova planta",
    },
    {
        title: "Minhas plantas",
        description: "Acesse a listagem com busca, filtros, paginação e ações por planta.",
        icon: Sprout,
        to: "/app/plants",
        actionLabel: "Abrir lista",
    },
    {
        title: "Espécies",
        description: "Consulte o catálogo de espécies usado como referência para cuidados.",
        icon: Leaf,
        to: "/app/species",
        actionLabel: "Ver catálogo",
    },
    {
        title: "Notificações",
        description: "Acompanhe alertas de rega, cuidados pendentes e avisos do sistema.",
        icon: Bell,
        to: "/app/notifications",
        actionLabel: "Abrir central",
    },
] satisfies readonly QuickAction[];

export function DashboardQuickActions() {
    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {QUICK_ACTIONS.map((action) => (
                <QuickActionCard
                    key={action.title}
                    title={action.title}
                    description={action.description}
                    icon={action.icon}
                    to={action.to}
                    actionLabel={action.actionLabel}
                />
            ))}
        </div>
    );
}
