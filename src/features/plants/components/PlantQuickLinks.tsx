import { Bot, Camera, CloudSun, ListChecks, Pencil, Waves } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/shared/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";

type PlantQuickLinksProps = {
    plantId: number;
};

const links = [
    {
        label: "Editar",
        description: "Alterar cadastro e preferências.",
        icon: Pencil,
        getPath: (plantId: number) => `/app/plants/${plantId}/edit`
    },
    {
        label: "Regas",
        description: "Histórico e novo registro.",
        icon: Waves,
        getPath: (plantId: number) => `/app/plants/${plantId}/watering`
    },
    {
        label: "Eventos",
        description: "Cuidados, podas e observações.",
        icon: ListChecks,
        getPath: (plantId: number) => `/app/plants/${plantId}/events`
    },
    {
        label: "Fotos",
        description: "Galeria e evolução visual.",
        icon: Camera,
        getPath: (plantId: number) => `/app/plants/${plantId}/photos`
    },
    {
        label: "Clima",
        description: "Snapshots climáticos.",
        icon: CloudSun,
        getPath: (plantId: number) => `/app/plants/${plantId}/climate`
    },
    {
        label: "IA",
        description: "Perguntar ao assistente.",
        icon: Bot,
        getPath: (plantId: number) => `/app/plants/${plantId}/ai`
    }
] as const;

export function PlantQuickLinks({ plantId }: PlantQuickLinksProps) {
    const isValidPlantId = Number.isInteger(plantId) && plantId > 0;

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <CardTitle>Atalhos da planta</CardTitle>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const content = (
                            <>
                                <span className="mr-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                    <Icon className="h-5 w-5" />
                                </span>
                                <span className="min-w-0 text-left">
                                    <span className="block truncate font-semibold">{link.label}</span>
                                    <span className="mt-0.5 block break-words text-xs leading-5 text-muted-foreground">
                                        {link.description}
                                    </span>
                                </span>
                            </>
                        );

                        return (
                            <Button
                                key={link.label}
                                asChild={isValidPlantId}
                                variant="outline"
                                disabled={!isValidPlantId}
                                className="group h-auto justify-start rounded-2xl border-border/70 bg-background p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-background hover:shadow-md"
                            >
                                {isValidPlantId ? (
                                    <Link to={link.getPath(plantId)}>{content}</Link>
                                ) : (
                                    <span className="flex items-center">{content}</span>
                                )}
                            </Button>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
