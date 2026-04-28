import type { LucideIcon } from "lucide-react";
import { Bell, Plus, Sprout } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/shared/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";

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
        description: "Adicione uma nova planta e registre suas condições principais.",
        icon: Plus,
        to: "/app/plants/new",
        actionLabel: "Nova planta"
    },
    {
        title: "Minhas plantas",
        description: "Veja sua coleção, pesquise plantas e acesse os detalhes de cuidado.",
        icon: Sprout,
        to: "/app/plants",
        actionLabel: "Abrir lista"
    },
    {
        title: "Notificações",
        description: "Acompanhe lembretes, alertas e avisos relacionados às suas plantas.",
        icon: Bell,
        to: "/app/notifications",
        actionLabel: "Abrir central"
    }
] satisfies readonly QuickAction[];

export function DashboardQuickActions() {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;

                return (
                    <Card
                        key={action.title}
                        className="group flex flex-col border-border/70 bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-start gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-background text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                    <Icon aria-hidden="true" className="h-5 w-5" />
                                </div>

                                <div className="min-w-0">
                                    <CardTitle className="text-base">
                                        {action.title}
                                    </CardTitle>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        {action.description}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="mt-auto px-6 pb-6 pt-0">
                            <Button
                                asChild
                                variant="outline"
                                className="h-10 w-full justify-center rounded-2xl border-primary/20 px-4 text-center transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground"
                            >
                                <Link to={action.to}>{action.actionLabel}</Link>
                            </Button>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
