import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    CalendarClock,
    CloudRain,
    CloudSun,
    Droplets,
    MapPin,
    Sparkles,
    SunMedium,
    Thermometer,
    Wind
} from "lucide-react";
import { useMemo } from "react";

import type { ClimateSnapshot } from "@/features/climate/types/climateTypes";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";

type PlantClimateHistoryProps = {
    snapshots: ClimateSnapshot[];
};

type MetricCardProps = {
    label: string;
    value: string;
    icon: React.ElementType;
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

    return format(date, "dd/MM/yyyy 'às' HH:mm", {
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

function MetricCard({ label, value, icon: Icon }: MetricCardProps) {
    return (
        <div className="rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <Icon className="h-4 w-4 text-primary" />
                {label}
            </div>

            <p className="mt-2 text-sm font-semibold text-foreground">{value}</p>
        </div>
    );
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
        <Card className="overflow-hidden border-border/70 bg-card shadow-sm">
            <CardHeader className="border-b bg-muted/20 pb-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-background text-primary shadow-sm">
                        <CloudSun className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                        <CardTitle className="text-lg">Registros automáticos</CardTitle>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-4">
                <div className="space-y-4">
                    {orderedSnapshots.map((snapshot, index) => (
                        <article
                            key={`${snapshot.id}-${snapshot.recorded_at}`}
                            className="overflow-hidden rounded-3xl border border-border/70 bg-background shadow-sm"
                        >
                            <div className="flex flex-col gap-4 border-b border-border/70 bg-muted/20 p-4 lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex min-w-0 gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-background text-primary shadow-sm">
                                        {index === 0 ? (
                                            <Sparkles className="h-5 w-5" />
                                        ) : (
                                            <CloudSun className="h-5 w-5" />
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-semibold text-foreground">
                                                {index === 0
                                                    ? "Registro mais recente"
                                                    : `Registro #${orderedSnapshots.length - index}`}
                                            </h3>

                                            {index === 0 ? (
                                                <span className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary">
                                                    Atual
                                                </span>
                                            ) : null}
                                        </div>

                                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                            <span className="inline-flex items-center">
                                                <CalendarClock className="mr-1.5 h-4 w-4 text-primary" />
                                                <time dateTime={snapshot.recorded_at || undefined}>
                                                    {formatDateTime(snapshot.recorded_at)}
                                                </time>
                                            </span>

                                            <span className="inline-flex items-center">
                                                <MapPin className="mr-1.5 h-4 w-4 text-primary" />
                                                {getCityName(snapshot.city_name)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-5">
                                <MetricCard
                                    icon={Thermometer}
                                    label="Temperatura"
                                    value={formatClimateNumber(snapshot.temperature_c, "°C")}
                                />

                                <MetricCard
                                    icon={Wind}
                                    label="Sensação"
                                    value={formatClimateNumber(snapshot.feels_like_c, "°C")}
                                />

                                <MetricCard
                                    icon={Droplets}
                                    label="Umidade"
                                    value={formatClimateNumber(
                                        snapshot.humidity_percent,
                                        "%",
                                        0
                                    )}
                                />

                                <MetricCard
                                    icon={CloudRain}
                                    label="Chuva"
                                    value={formatClimateNumber(snapshot.rain_mm, " mm")}
                                />

                                <MetricCard
                                    icon={SunMedium}
                                    label="UV"
                                    value={formatClimateNumber(snapshot.uv_index)}
                                />
                            </div>
                        </article>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
