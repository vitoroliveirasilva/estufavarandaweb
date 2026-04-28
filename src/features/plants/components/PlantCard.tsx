import { CalendarDays, MapPin, Pencil, Sprout } from "lucide-react";
import { Link } from "react-router-dom";

import { PlantStatus } from "@/features/plants/components/PlantStatus";
import type { PlantListItem } from "@/features/plants/types/plantTypes";
import { Button } from "@/shared/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";

const FALLBACK_SPECIES = "Sem espécie vinculada";

function buildSubtitle(plant: PlantListItem): string {
    const speciesName = plant.species_profile?.common_name?.trim() || FALLBACK_SPECIES;
    const nickname = plant.nickname?.trim();

    return nickname ? `${nickname} · ${speciesName}` : speciesName;
}

function buildLocation(plant: PlantListItem): string {
    return [plant.location_label, plant.city_name]
        .map((value) => value?.trim())
        .filter(Boolean)
        .join(" · ") || "Local não informado";
}

type PlantCardProps = {
    plant: PlantListItem;
};

export function PlantCard({ plant }: PlantCardProps) {
    const isArchived = Boolean(plant.archived_at);

    return (
        <Card className="flex h-full flex-col">
            <CardHeader>
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                        <Sprout className="h-5 w-5" />
                    </div>

                    <PlantStatus status={plant.health_status} />
                </div>

                <CardTitle className="line-clamp-1">{plant.name}</CardTitle>
                <CardDescription className="line-clamp-2">{buildSubtitle(plant)}</CardDescription>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col justify-between gap-5">
                <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span className="truncate">{buildLocation(plant)}</span>
                    </div>

                    {isArchived ? (
                        <div className="flex items-center gap-2 text-amber-700">
                            <CalendarDays className="h-4 w-4 shrink-0" />
                            <span>Arquivada</span>
                        </div>
                    ) : null}
                </div>

                <div className="flex gap-2">
                    <Button asChild className="flex-1">
                        <Link to={`/app/plants/${plant.id}`}>Abrir</Link>
                    </Button>

                    <Button asChild variant="outline" size="icon">
                        <Link to={`/app/plants/${plant.id}/edit`} aria-label={`Editar ${plant.name}`}>
                            <Pencil className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
