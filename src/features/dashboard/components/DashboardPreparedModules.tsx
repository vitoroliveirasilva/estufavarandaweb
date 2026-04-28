import type { LucideIcon } from "lucide-react";
import { Bot, Camera, CloudSun, ListChecks, Waves } from "lucide-react";
import { Link } from "react-router-dom";

import { SectionHeader } from "@/shared/components/SectionHeader";
import { Button } from "@/shared/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";

type PreparedModule = {
    readonly title: string;
    readonly description: string;
    readonly icon: LucideIcon;
    readonly to: string;
    readonly actionLabel: string;
};

const PREPARED_MODULES = [
    {
        title: "Regas",
        description: "Registre e acompanhe o histórico de regas de cada planta.",
        icon: Waves,
        to: "/app/plants",
        actionLabel: "Escolher planta"
    },
    {
        title: "Eventos",
        description: "Anote podas, adubações, sintomas, mudanças e cuidados importantes.",
        icon: ListChecks,
        to: "/app/plants",
        actionLabel: "Escolher planta"
    },
    {
        title: "Fotos",
        description: "Acompanhe a evolução visual das plantas com uma galeria organizada.",
        icon: Camera,
        to: "/app/plants",
        actionLabel: "Escolher planta"
    },
    {
        title: "Clima",
        description: "Consulte informações climáticas relacionadas ao ambiente das plantas.",
        icon: CloudSun,
        to: "/app/plants",
        actionLabel: "Escolher planta"
    },
    {
        title: "IA",
        description: "Faça perguntas sobre cuidados e receba apoio para acompanhar sua planta.",
        icon: Bot,
        to: "/app/plants",
        actionLabel: "Escolher planta"
    }
] satisfies readonly PreparedModule[];

export function DashboardPreparedModules() {
    return (
        <section aria-label="Cuidados por planta" className="space-y-4">
            <SectionHeader
                title="Cuidados por planta"
                description="Escolha uma planta para acessar registros, fotos, clima e apoio com IA."
            />

            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {PREPARED_MODULES.map((module) => {
                    const Icon = module.icon;

                    return (
                        <Card
                            key={module.title}
                            className="group flex flex-col border-border/70 bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <CardHeader className="pb-3">
                                <div className="flex min-w-0 gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-background text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                        <Icon aria-hidden="true" className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0">
                                        <CardTitle className="text-base">
                                            {module.title}
                                        </CardTitle>
                                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                            {module.description}
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="mt-auto px-6 pb-6 pt-0">
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="h-10 w-full justify-center rounded-2xl border-primary/20 px-4 text-center transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground"
                                >
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
