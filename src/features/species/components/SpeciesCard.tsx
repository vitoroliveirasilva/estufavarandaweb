import { Droplets, Leaf, Thermometer, Wind } from "lucide-react";

import type { SpeciesProfile } from "@/features/species/types/speciesTypes";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { Button } from "@/shared/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";

type SpeciesCardProps = {
    species: SpeciesProfile;
    selected?: boolean;
    onSelect: (speciesId: number) => void;
};

function formatRange(min?: number | null, max?: number | null, suffix = ""): string {
    if (min == null && max == null) {
        return "Não informado";
    }

    if (min != null && max != null) {
        return `${min} a ${max}${suffix}`;
    }

    if (min != null) {
        return `mín. ${min}${suffix}`;
    }

    return `máx. ${max}${suffix}`;
}

function valueOrFallback(value?: string | number | null): string {
    if (value === null || value === undefined || value === "") {
        return "Não informado";
    }

    return String(value);
}

export function SpeciesCard({ species, selected = false, onSelect }: SpeciesCardProps) {
    return (
        <Card className={selected ? "ring-2 ring-primary" : undefined}>
            <CardHeader>
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                        <Leaf className="h-5 w-5" />
                    </div>

                    <StatusBadge tone={species.is_active ? "success" : "neutral"}>
                        {species.is_active ? "Ativa" : "Inativa"}
                    </StatusBadge>
                </div>

                <CardTitle className="line-clamp-1">{species.common_name}</CardTitle>
                <CardDescription className="line-clamp-1 italic">
                    {species.scientific_name || "Nome científico não informado"}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
                <div className="grid gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 shrink-0" />
                        <span>
                            Rega:{" "}
                            {species.watering_frequency_days
                                ? `a cada ${species.watering_frequency_days} dia(s)`
                                : "não informada"}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 shrink-0" />
                        <span>
                            Temperatura:{" "}
                            {formatRange(species.ideal_temp_min, species.ideal_temp_max, "°C")}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Wind className="h-4 w-4 shrink-0" />
                        <span>
                            Umidade:{" "}
                            {formatRange(
                                species.ideal_humidity_min,
                                species.ideal_humidity_max,
                                "%"
                            )}
                        </span>
                    </div>
                </div>

                <div className="rounded-xl border bg-background p-3">
                    <p className="text-xs font-medium text-muted-foreground">Luz preferida</p>
                    <p className="mt-1 text-sm">{valueOrFallback(species.light_preference)}</p>
                </div>

                <Button
                    type="button"
                    variant={selected ? "default" : "outline"}
                    className="w-full"
                    onClick={() => onSelect(species.id)}
                >
                    {selected ? "Selecionada" : "Ver detalhes"}
                </Button>
            </CardContent>
        </Card>
    );
}