import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CloudRain, CloudSun, Droplets, Thermometer, Wind } from "lucide-react";
import { useMemo } from "react";

import type { ClimateSnapshot } from "@/features/climate/types/climateTypes";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";

type PlantClimateHistoryProps = {
    snapshots: ClimateSnapshot[];
};

const decimalFormatter = new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 1
});

const integerFormatter = new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 0
});

function parseDateTime(value: string): Date | null {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

function getSnapshotTime(value: string): number {
    return parseDateTime(value)?.getTime() ?? 0;
}

function formatDateTime(value: string): string {
    const date = parseDateTime(value);

    if (!date) {
        return value || "Data não informada";
    }

    return format(date, "dd/MM/yyyy HH:mm", {
        locale: ptBR
    });
}

function formatClimateNumber(
    value: number | null,
    suffix = "",
    maximumFractionDigits = 1
): string {
    if (typeof value !== "number" || !Number.isFinite(value)) {
        return "Não informado";
    }

    const formatter = maximumFractionDigits === 0 ? integerFormatter : decimalFormatter;
    return `${formatter.format(value)}${suffix}`;
}

function getCityName(cityName: string | null): string {
    const trimmed = cityName?.trim();
    return trimmed ? trimmed : "Cidade não informada";
}

export function PlantClimateHistory({ snapshots }: PlantClimateHistoryProps) {
    const orderedSnapshots = useMemo(
        () =>
            [...snapshots].sort(
                (current, next) =>
                    getSnapshotTime(next.recorded_at) - getSnapshotTime(current.recorded_at)
            ),
        [snapshots]
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Histórico climático</CardTitle>
                <CardDescription>
                    Snapshots climáticos mais recentes vinculados à planta.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="space-y-3">
                    {orderedSnapshots.map((snapshot) => (
                        <article
                            key={`${snapshot.id}-${snapshot.recorded_at}`}
                            className="rounded-2xl border bg-background p-4"
                        >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                                        <CloudSun className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <h3 className="font-medium">
                                            <time dateTime={snapshot.recorded_at || undefined}>
                                                {formatDateTime(snapshot.recorded_at)}
                                            </time>
                                        </h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {getCityName(snapshot.city_name)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                                <div className="rounded-xl border bg-card p-3">
                                    <Thermometer className="mb-2 h-4 w-4 text-primary" />
                                    <p className="text-xs text-muted-foreground">Temperatura</p>
                                    <p className="mt-1 text-sm font-semibold">
                                        {formatClimateNumber(snapshot.temperature_c, "°C")}
                                    </p>
                                </div>

                                <div className="rounded-xl border bg-card p-3">
                                    <Wind className="mb-2 h-4 w-4 text-primary" />
                                    <p className="text-xs text-muted-foreground">Sensação</p>
                                    <p className="mt-1 text-sm font-semibold">
                                        {formatClimateNumber(snapshot.feels_like_c, "°C")}
                                    </p>
                                </div>

                                <div className="rounded-xl border bg-card p-3">
                                    <Droplets className="mb-2 h-4 w-4 text-primary" />
                                    <p className="text-xs text-muted-foreground">Umidade</p>
                                    <p className="mt-1 text-sm font-semibold">
                                        {formatClimateNumber(snapshot.humidity_percent, "%", 0)}
                                    </p>
                                </div>

                                <div className="rounded-xl border bg-card p-3">
                                    <CloudRain className="mb-2 h-4 w-4 text-primary" />
                                    <p className="text-xs text-muted-foreground">Chuva</p>
                                    <p className="mt-1 text-sm font-semibold">
                                        {formatClimateNumber(snapshot.rain_mm, " mm")}
                                    </p>
                                </div>

                                <div className="rounded-xl border bg-card p-3">
                                    <CloudSun className="mb-2 h-4 w-4 text-primary" />
                                    <p className="text-xs text-muted-foreground">UV</p>
                                    <p className="mt-1 text-sm font-semibold">
                                        {formatClimateNumber(snapshot.uv_index)}
                                    </p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
