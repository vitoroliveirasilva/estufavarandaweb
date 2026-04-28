import { Bot, Camera, CloudSun, ListChecks, Pencil, Waves } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/shared/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";

type PlantQuickLinksProps = {
    plantId: number;
};

const links = [
    {
        label: "Editar",
        description: "Alterar dados cadastrais.",
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
        description: "Cuidados e observações.",
        icon: ListChecks,
        getPath: (plantId: number) => `/app/plants/${plantId}/events`
    },
    {
        label: "Fotos",
        description: "Galeria e upload.",
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
        <Card>
            <CardHeader>
                <CardTitle>Atalhos da planta</CardTitle>
                <CardDescription>Acesse os módulos vinculados a esta planta.</CardDescription>
            </CardHeader>

            <CardContent>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {links.map((link) => {
                        const Icon = link.icon;

                        return (
                            <Button
                                key={link.label}
                                asChild={isValidPlantId}
                                variant="outline"
                                disabled={!isValidPlantId}
                                className="h-auto justify-start rounded-2xl p-4"
                            >
                                {isValidPlantId ? (
                                    <Link to={link.getPath(plantId)}>
                                        <span className="mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                                            <Icon className="h-5 w-5" />
                                        </span>
                                        <span className="text-left">
                                            <span className="block font-medium">{link.label}</span>
                                            <span className="block text-xs text-muted-foreground">
                                                {link.description}
                                            </span>
                                        </span>
                                    </Link>
                                ) : (
                                    <span className="flex items-center">
                                        <span className="mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                                            <Icon className="h-5 w-5" />
                                        </span>
                                        <span className="text-left">
                                            <span className="block font-medium">{link.label}</span>
                                            <span className="block text-xs text-muted-foreground">
                                                {link.description}
                                            </span>
                                        </span>
                                    </span>
                                )}
                            </Button>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
