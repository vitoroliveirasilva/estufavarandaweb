import type { LucideIcon } from "lucide-react";
import { Bell, Leaf, Sprout } from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";

type DashboardStat = {
    readonly title: string;
    readonly value: string;
    readonly description: string;
    readonly icon: LucideIcon;
};

const DASHBOARD_STATS = [
    {
        title: "Plantas",
        value: "Cadastro",
        description: "Organize suas plantas com dados de ambiente, luz, ventilação e observações.",
        icon: Sprout
    },
    {
        title: "Cuidados",
        value: "Rotinas",
        description: "Acompanhe regas, eventos e histórico de manutenção por planta.",
        icon: Leaf
    },
    {
        title: "Notificações",
        value: "Alertas",
        description: "Veja lembretes e avisos importantes para não deixar nenhum cuidado passar.",
        icon: Bell
    }
] satisfies readonly DashboardStat[];

export function DashboardStats() {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            {DASHBOARD_STATS.map((stat) => {
                const Icon = stat.icon;

                return (
                    <Card
                        key={stat.title}
                        className="group border-border/70 bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <CardDescription className="text-sm font-medium">
                                        {stat.title}
                                    </CardDescription>
                                    <CardTitle className="mt-1 text-2xl font-semibold tracking-tight">
                                        {stat.value}
                                    </CardTitle>
                                </div>

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                    <Icon aria-hidden="true" className="h-5 w-5" />
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm leading-6 text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
