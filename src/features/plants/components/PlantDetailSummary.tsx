import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays, MapPin, Sprout } from "lucide-react";

import { PlantStatus } from "@/features/plants/components/PlantStatus";
import type { PlantDetail } from "@/features/plants/types/plantTypes";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";

type PlantDetailSummaryProps = {
    plant: PlantDetail;
};

function formatDateTime(value?: string | null): string {
    if (!value) {
        return "Não informado";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return format(date, "dd/MM/yyyy HH:mm", {
        locale: ptBR
    });
}

function valueOrFallback(value: unknown): string {
    if (typeof value === "string" && value.trim()) {
        return value;
    }

    if (typeof value === "number" && Number.isFinite(value)) {
        return String(value);
    }

    return "Não informado";
}

export function PlantDetailSummary({ plant }: PlantDetailSummaryProps) {
    const location = [plant.location_label, plant.city_name].filter(Boolean).join(" · ");

    const details = [
        {
            label: "Apelido",
            value: valueOrFallback(plant.nickname)
        },
        {
            label: "Espécie",
            value: plant.species_profile?.common_name ?? "Não vinculada"
        },
        {
            label: "Ambiente",
            value: valueOrFallback(plant.environment)
        },
        {
            label: "Luz",
            value: valueOrFallback(plant.light_exposure)
        },
        {
            label: "Ventilação",
            value: valueOrFallback(plant.ventilation)
        },
        {
            label: "Criada em",
            value: formatDateTime(plant.created_at)
        },
        {
            label: "Atualizada em",
            value: formatDateTime(plant.updated_at)
        },
        {
            label: "Arquivada em",
            value: plant.archived_at ? formatDateTime(plant.archived_at) : "Não"
        }
    ];

    return (
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <Card>
                <CardHeader>
                    <div className="mb-4 flex items-start justify-between gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                            <Sprout className="h-6 w-6" />
                        </div>

                        <PlantStatus status={plant.health_status} />
                    </div>

                    <CardTitle className="text-2xl">{plant.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 pt-1">
                        <MapPin className="h-4 w-4" />
                        {location || "Local não informado"}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="rounded-2xl border bg-background p-4">
                        <p className="text-sm font-medium">Observações</p>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                            {valueOrFallback(plant.notes)}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Resumo</CardTitle>
                    <CardDescription>
                        Dados retornados pelo detalhe da API, com campos opcionais tratados.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <dl className="space-y-3">
                        {details.map((detail) => (
                            <div
                                key={detail.label}
                                className="flex items-start justify-between gap-4 rounded-xl border bg-background px-4 py-3"
                            >
                                <dt className="text-sm text-muted-foreground">{detail.label}</dt>
                                <dd className="max-w-[55%] text-right text-sm font-medium">
                                    {detail.value}
                                </dd>
                            </div>
                        ))}
                    </dl>

                    {plant.archived_at ? (
                        <div className="mt-4 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0" />
                            Esta planta está arquivada.
                        </div>
                    ) : null}
                </CardContent>
            </Card>
        </div>
    );
}