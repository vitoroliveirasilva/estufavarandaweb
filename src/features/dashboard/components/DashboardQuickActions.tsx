import { Bell, Leaf, Plus, Sprout } from "lucide-react";

import { QuickActionCard } from "@/shared/components/QuickActionCard";

const actions = [
    {
        title: "Cadastrar planta",
        description: "Abra o formulário base de criação. A integração real entra no Bloco 5.",
        icon: Plus,
        to: "/app/plants/new",
        actionLabel: "Nova planta"
    },
    {
        title: "Minhas plantas",
        description: "Acesse a listagem preparada para busca, filtros e paginação.",
        icon: Sprout,
        to: "/app/plants",
        actionLabel: "Abrir lista"
    },
    {
        title: "Espécies",
        description: "Consulte o catálogo de espécies preparado para o Bloco 7.",
        icon: Leaf,
        to: "/app/species",
        actionLabel: "Ver catálogo"
    },
    {
        title: "Notificações",
        description: "Abra a central que receberá leitura e descarte de alertas.",
        icon: Bell,
        to: "/app/notifications",
        actionLabel: "Abrir central"
    }
];

export function DashboardQuickActions() {
    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {actions.map((action) => (
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