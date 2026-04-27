import { BookOpen, Droplets, Leaf, Thermometer, Wind } from "lucide-react";

import type { SpeciesProfile } from "@/features/species/types/speciesTypes";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { LoadingState } from "@/shared/components/LoadingState";
import { StatusBadge } from "@/shared/components/StatusBadge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";

type SpeciesDetailPanelProps = {
    species?: SpeciesProfile;
    isLoading?: boolean;
    errorMessage?: string | null;
    onRetry?: () => void;
};

function valueOrFallback(value?: string | number | null): string {
    if (value === null || value === undefined || value === "") {
        return "Não informado";
    }

    return String(value);
}

function rangeValue(
    min?: number | null,
    max?: number | null,
    suffix = ""
): string {
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

export function SpeciesDetailPanel({
    species,
    isLoading = false,
    errorMessage,
    onRetry
}: SpeciesDetailPanelProps) {
    if (isLoading) {
        return (
            <LoadingState
                title="Carregando espécie"
                description="Buscando detalhes da espécie selecionada."
            />
        );
    }

    if (errorMessage) {
        return (
            <ErrorState
                title="Não foi possível carregar a espécie"
                description={errorMessage}
                actionLabel={onRetry ? "Tentar novamente" : undefined}
                onAction={onRetry}
            />
        );
    }

    if (!species) {
        return (
            <EmptyState
                icon={<Leaf className="h-6 w-6" />}
                title="Selecione uma espécie"
                description="Clique em uma espécie da lista para visualizar os detalhes aqui."
            />
        );
    }

    const metrics = [
        {
            label: "Frequência de rega",
            value: species.watering_frequency_days
                ? `A cada ${species.watering_frequency_days} dia(s)`
                : "Não informado",
            icon: Droplets
        },
        {
            label: "Temperatura ideal",
            value: rangeValue(species.ideal_temp_min, species.ideal_temp_max, "°C"),
            icon: Thermometer
        },
        {
            label: "Umidade ideal",
            value: rangeValue(
                species.ideal_humidity_min,
                species.ideal_humidity_max,
                "%"
            ),
            icon: Wind
        },
        {
            label: "Preferência de luz",
            value: valueOrFallback(species.light_preference),
            icon: Leaf
        }
    ];

    return (
        <Card>
            <CardHeader>
                <div className="mb-3 flex items-center justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                        <BookOpen className="h-6 w-6" />
                    </div>

                    <StatusBadge tone={species.is_active ? "success" : "neutral"}>
                        {species.is_active ? "Ativa" : "Inativa"}
                    </StatusBadge>
                </div>

                <CardTitle>{species.common_name}</CardTitle>
                <CardDescription className="italic">
                    {species.scientific_name || "Nome científico não informado"}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
                <div className="grid gap-3 sm:grid-cols-2">
                    {metrics.map((metric) => {
                        const Icon = metric.icon;

                        return (
                            <div key={metric.label} className="rounded-2xl border bg-background p-4">
                                <Icon className="mb-3 h-5 w-5 text-primary" />
                                <p className="text-xs font-medium text-muted-foreground">
                                    {metric.label}
                                </p>
                                <p className="mt-1 text-sm font-semibold">{metric.value}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="grid gap-3">
                    <div className="rounded-2xl border bg-background p-4">
                        <p className="text-sm font-medium">Substrato</p>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                            {valueOrFallback(species.substrate_notes)}
                        </p>
                    </div>

                    <div className="rounded-2xl border bg-background p-4">
                        <p className="text-sm font-medium">Notas gerais</p>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                            {valueOrFallback(species.general_notes)}
                        </p>
                    </div>

                    <div className="rounded-2xl border bg-background p-4">
                        <p className="text-sm font-medium">Sintomas comuns</p>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                            {valueOrFallback(species.common_symptoms)}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}