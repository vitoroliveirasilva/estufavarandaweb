import { Bot, Camera, CloudSun, ListChecks, Waves } from "lucide-react";
import { Link } from "react-router-dom";

import { StatusBadge } from "@/shared/components/StatusBadge";
import { SectionHeader } from "@/shared/components/SectionHeader";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";

const modules = [
    {
        title: "Regas",
        description: "Histórico, resumo e criação de registros de rega.",
        icon: Waves,
        to: "/app/plants/1/watering",
        status: "Bloco 6"
    },
    {
        title: "Eventos",
        description: "Observações, cuidados, podas, adubações e histórico geral.",
        icon: ListChecks,
        to: "/app/plants/1/events",
        status: "Bloco 6"
    },
    {
        title: "Fotos",
        description: "Galeria protegida, upload multipart e download autenticado.",
        icon: Camera,
        to: "/app/plants/1/photos",
        status: "Bloco 8"
    },
    {
        title: "Clima",
        description: "Resumo climático e snapshots de temperatura, umidade e UV.",
        icon: CloudSun,
        to: "/app/plants/1/climate",
        status: "Bloco 7"
    },
    {
        title: "IA",
        description: "Perguntas sobre a planta e histórico de conversas.",
        icon: Bot,
        to: "/app/plants/1/ai",
        status: "Bloco 8"
    }
];

export function DashboardPreparedModules() {
    return (
        <section>
            <SectionHeader
                title="Módulos preparados"
                description="As rotas já existem para manter o projeto inteiro visível desde o começo."
            />

            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {modules.map((module) => {
                    const Icon = module.icon;

                    return (
                        <Card key={module.title}>
                            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                                <div className="flex gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                                        <Icon className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <CardTitle className="text-base">{module.title}</CardTitle>
                                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                            {module.description}
                                        </p>
                                    </div>
                                </div>

                                <StatusBadge tone="neutral">{module.status}</StatusBadge>
                            </CardHeader>

                            <CardContent>
                                <Button asChild variant="outline" size="sm">
                                    <Link to={module.to}>Abrir rota</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </section>
    );
}