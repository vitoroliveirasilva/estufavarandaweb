import type { LucideIcon } from "lucide-react";
import { Bot, Camera, CloudSun, ListChecks, Waves } from "lucide-react";
import { Link } from "react-router-dom";

import { SectionHeader } from "@/shared/components/SectionHeader";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { Button } from "@/shared/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";

type PreparedModule = {
    readonly title: string;
    readonly description: string;
    readonly icon: LucideIcon;
    readonly to: string;
    readonly status: string;
    readonly actionLabel: string;
};

const PREPARED_MODULES = [
    {
        title: "Regas",
        description: "Histórico, resumo e criação de registros de rega por planta.",
        icon: Waves,
        to: "/app/plants",
        status: "Preparado",
        actionLabel: "Escolher planta",
    },
    {
        title: "Eventos",
        description: "Observações, cuidados, podas, adubações e histórico geral.",
        icon: ListChecks,
        to: "/app/plants",
        status: "Preparado",
        actionLabel: "Escolher planta",
    },
    {
        title: "Fotos",
        description: "Galeria protegida, upload multipart e download autenticado.",
        icon: Camera,
        to: "/app/plants",
        status: "Preparado",
        actionLabel: "Escolher planta",
    },
    {
        title: "Clima",
        description: "Resumo climático e snapshots de temperatura, umidade e índice UV.",
        icon: CloudSun,
        to: "/app/plants",
        status: "Preparado",
        actionLabel: "Escolher planta",
    },
    {
        title: "IA",
        description: "Perguntas sobre a planta e histórico de conversas.",
        icon: Bot,
        to: "/app/plants",
        status: "Preparado",
        actionLabel: "Escolher planta",
    },
] satisfies readonly PreparedModule[];

export function DashboardPreparedModules() {
    return (
        <section aria-label="Módulos preparados">
            <SectionHeader
                title="Módulos preparados"
                description="As áreas abaixo já fazem parte da navegação e ficam disponíveis a partir da planta selecionada."
            />

            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {PREPARED_MODULES.map((module) => {
                    const Icon = module.icon;

                    return (
                        <Card key={module.title} className="flex flex-col">
                            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                                <div className="flex min-w-0 gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                                        <Icon aria-hidden="true" className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0">
                                        <CardTitle className="text-base">{module.title}</CardTitle>
                                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                            {module.description}
                                        </p>
                                    </div>
                                </div>

                                <StatusBadge tone="neutral">{module.status}</StatusBadge>
                            </CardHeader>

                            <CardContent className="mt-auto">
                                <Button asChild variant="outline" size="sm">
                                    <Link
                                        to={module.to}
                                        aria-label={`${module.actionLabel} para acessar ${module.title.toLowerCase()}`}
                                    >
                                        {module.actionLabel}
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </section>
    );
}
