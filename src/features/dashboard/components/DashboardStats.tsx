import { Bell, Leaf, ShieldCheck, Sprout } from "lucide-react";

import { StatCard } from "@/shared/components/StatCard";

const stats = [
    {
        title: "Módulo de plantas",
        value: "Pronto",
        description: "Estrutura preparada para listar, criar, editar e arquivar.",
        icon: Sprout
    },
    {
        title: "Autenticação",
        value: "JWT",
        description: "Login, refresh token, guards e logout já conectados.",
        icon: ShieldCheck
    },
    {
        title: "Cuidados",
        value: "2 rotas",
        description: "Regas e eventos entram com integração no próximo bloco.",
        icon: Leaf
    },
    {
        title: "Notificações",
        value: "Fila",
        description: "Central pronta para listar, marcar como lida e descartar.",
        icon: Bell
    }
];

export function DashboardStats() {
    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
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