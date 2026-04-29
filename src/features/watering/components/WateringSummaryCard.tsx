import type { LucideIcon } from "lucide-react";
import {
    AlertTriangle,
    BarChart3,
    CalendarClock,
    CheckCircle2,
    Droplets,
    Info,
    Sparkles,
    ThermometerSun,
    TimerReset
} from "lucide-react";

import type {
    WateringLog,
    WateringSummary
} from "@/features/watering/types/wateringTypes";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { LoadingState } from "@/shared/components/LoadingState";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";

type WateringSummaryCardProps = {
    summary?: WateringSummary;
    latestWateringLog?: WateringLog | null;
    isLoading?: boolean;
    errorMessage?: string | null;
    onRetry?: () => void;
};

type SummaryMetric = {
    key: string;
    label: string;
    value: string;
    icon: LucideIcon;
};

type RiskMeta = {
    label: string;
    description: string;
    icon: LucideIcon;
    className: string;
    iconClassName: string;
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
});

const numberFormatter = new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 1
});

const riskMetaByLevel: Record<string, RiskMeta> = {
    low: {
        label: "Tudo certo",
        description: "Nenhum sinal importante de atenção apareceu no resumo.",
        icon: CheckCircle2,
        className:
            "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        iconClassName: "text-emerald-700 dark:text-emerald-300"
    },
    normal: {
        label: "Tudo certo",
        description: "O histórico de rega não indica urgência no momento.",
        icon: CheckCircle2,
        className:
            "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        iconClassName: "text-emerald-700 dark:text-emerald-300"
    },
    attention: {
        label: "Atenção",
        description:
            "Vale revisar a planta e comparar com clima, fotos e eventos recentes.",
        icon: AlertTriangle,
        className:
            "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
        iconClassName: "text-amber-700 dark:text-amber-300"
    },
    warning: {
        label: "Atenção",
        description:
            "Vale revisar a planta e comparar com clima, fotos e eventos recentes.",
        icon: AlertTriangle,
        className:
            "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
        iconClassName: "text-amber-700 dark:text-amber-300"
    },
    high: {
        label: "Crítico",
        description: "Há sinais relevantes. Confira a planta com prioridade.",
        icon: AlertTriangle,
        className:
            "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
        iconClassName: "text-red-700 dark:text-red-300"
    },
    critical: {
        label: "Crítico",
        description: "Há sinais relevantes. Confira a planta com prioridade.",
        icon: AlertTriangle,
        className:
            "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
        iconClassName: "text-red-700 dark:text-red-300"
    }
};

const defaultRiskMeta: RiskMeta = {
    label: "Resumo disponível",
    description: "Use essas informações junto com fotos, clima e eventos da planta.",
    icon: Info,
    className: "border-border bg-muted/40 text-muted-foreground",
    iconClassName: "text-primary"
};

function getValue(summary: WateringSummary | undefined, keys: string[]): unknown {
    if (!summary) {
        return undefined;
    }

    for (const key of keys) {
        const value = summary[key];

        if (value !== undefined && value !== null && value !== "") {
            return value;
        }
    }

    return undefined;
}

function toFiniteNumber(value: unknown): number | undefined {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === "string") {
        const normalized = value.trim().replace(",", ".");
        const parsed = Number(normalized);

        if (Number.isFinite(parsed)) {
            return parsed;
        }
    }

    return undefined;
}

function isValidDateValue(value: unknown): value is string {
    if (typeof value !== "string") {
        return false;
    }

    const normalized = value.trim();

    if (!normalized) {
        return false;
    }

    return !Number.isNaN(new Date(normalized).getTime());
}

function formatDateValue(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Ainda não registrado";
    }

    return dateFormatter.format(date);
}

function formatDaysValue(value: unknown): string {
    const parsed = toFiniteNumber(value);

    if (parsed === undefined) {
        return "Ainda não calculado";
    }

    if (parsed <= 0) {
        return "Hoje";
    }

    return parsed === 1 ? "1 dia" : `${numberFormatter.format(parsed)} dias`;
}

function formatMlValue(value: unknown): string {
    const parsed = toFiniteNumber(value);

    if (parsed === undefined || parsed <= 0) {
        return "Não informado";
    }

    return `${numberFormatter.format(parsed)} ml`;
}

function formatTextValue(value: unknown): string {
    if (typeof value !== "string") {
        return "Sem recomendação no momento.";
    }

    const normalized = value.trim();

    if (!normalized) {
        return "Sem recomendação no momento.";
    }

    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function getRiskMeta(summary?: WateringSummary): RiskMeta {
    const rawRiskLevel = getValue(summary, ["risk_level", "risk", "level"]);

    if (typeof rawRiskLevel !== "string") {
        return defaultRiskMeta;
    }

    const normalizedRiskLevel = rawRiskLevel.trim().toLowerCase();

    return riskMetaByLevel[normalizedRiskLevel] ?? defaultRiskMeta;
}

function getLatestWateringValue(
    summary: WateringSummary | undefined,
    latestWateringLog?: WateringLog | null
): string | undefined {
    const summaryValue = getValue(summary, [
        "last_watered_at",
        "latest_watered_at",
        "last_watering_at",
        "latest_watering_at",
        "most_recent_watered_at",
        "watered_at"
    ]);

    if (isValidDateValue(summaryValue)) {
        return summaryValue;
    }

    if (isValidDateValue(latestWateringLog?.watered_at)) {
        return latestWateringLog.watered_at;
    }

    return undefined;
}

function calculateDaysSince(value: string): number | undefined {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return undefined;
    }

    const today = new Date();
    const startOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    const startOfWateringDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );

    const diffMs = startOfToday.getTime() - startOfWateringDate.getTime();
    const diffDays = Math.floor(diffMs / 86_400_000);

    return Math.max(0, diffDays);
}

function getMetricsGridClassName(count: number): string {
    if (count <= 1) {
        return "grid gap-3";
    }

    if (count === 2) {
        return "grid gap-3 sm:grid-cols-2";
    }

    if (count === 3) {
        return "grid gap-3 md:grid-cols-3";
    }

    return "grid gap-3 sm:grid-cols-2 xl:grid-cols-4";
}

function getMainMetrics(
    summary?: WateringSummary,
    latestWateringLog?: WateringLog | null
): SummaryMetric[] {
    const lastWatering = getLatestWateringValue(summary, latestWateringLog);

    const summaryDaysSinceLastWatering = getValue(summary, [
        "days_since_last_watering",
        "days_since_last_watered",
        "last_watering_days_ago"
    ]);

    const daysSinceLastWatering =
        toFiniteNumber(summaryDaysSinceLastWatering) ??
        (lastWatering ? calculateDaysSince(lastWatering) : undefined);

    const totalQuantity = getValue(summary, [
        "total_quantity_ml",
        "total_ml",
        "water_total_ml",
        "quantity_total_ml"
    ]);

    const averageQuantity = getValue(summary, [
        "average_quantity_ml",
        "avg_quantity_ml",
        "average_ml",
        "avg_ml"
    ]);

    const metrics: SummaryMetric[] = [];

    if (lastWatering) {
        metrics.push({
            key: "last_watered_at",
            label: "Última rega",
            value: formatDateValue(lastWatering),
            icon: CalendarClock
        });

        if (typeof daysSinceLastWatering === "number") {
            metrics.push({
                key: "days_since_last_watering",
                label: "Tempo desde a última rega",
                value: formatDaysValue(daysSinceLastWatering),
                icon: TimerReset
            });
        }
    }

    const totalQuantityValue = formatMlValue(totalQuantity);

    if (totalQuantityValue !== "Não informado") {
        metrics.push({
            key: "total_quantity_ml",
            label: "Água registrada",
            value: totalQuantityValue,
            icon: Droplets
        });
    }

    const averageQuantityValue = formatMlValue(averageQuantity);

    if (averageQuantityValue !== "Não informado") {
        metrics.push({
            key: "average_quantity_ml",
            label: "Média por rega",
            value: averageQuantityValue,
            icon: BarChart3
        });
    }

    return metrics;
}

function getSignals(summary?: WateringSummary): string[] {
    const signals: string[] = [];

    if (getValue(summary, ["recent_heat"]) === true) {
        signals.push("Calor recente");
    }

    if (getValue(summary, ["recent_wilt"]) === true) {
        signals.push("Murcha recente");
    }

    if (getValue(summary, ["recent_yellow_leaves"]) === true) {
        signals.push("Folhas amarelas recentes");
    }

    if (getValue(summary, ["recent_pest"]) === true) {
        signals.push("Praga recente");
    }

    return signals;
}

function hasUsefulSummary(
    summary?: WateringSummary,
    latestWateringLog?: WateringLog | null
): boolean {
    return Boolean(
        latestWateringLog ||
        (summary && Object.values(summary).some((value) => value !== undefined))
    );
}

export function WateringSummaryCard({
    summary,
    latestWateringLog = null,
    isLoading = false,
    errorMessage,
    onRetry
}: WateringSummaryCardProps) {
    if (isLoading) {
        return (
            <LoadingState
                title="Carregando resumo"
                description="Buscando informações de rega da planta."
            />
        );
    }

    if (errorMessage) {
        return (
            <ErrorState
                title="Não foi possível carregar o resumo"
                description={errorMessage}
                actionLabel={onRetry ? "Tentar novamente" : undefined}
                onAction={onRetry}
            />
        );
    }

    if (!hasUsefulSummary(summary, latestWateringLog)) {
        return (
            <EmptyState
                icon={<Droplets className="h-6 w-6" />}
                title="Resumo ainda indisponível"
                description="Quando houver registros suficientes, o resumo de rega aparecerá aqui."
            />
        );
    }

    const riskMeta = getRiskMeta(summary);
    const RiskIcon = riskMeta.icon;
    const suggestion = getValue(summary, [
        "suggestion_window",
        "suggestion",
        "recommendation",
        "next_action"
    ]);
    const metrics = getMainMetrics(summary, latestWateringLog);
    const signals = getSignals(summary);

    return (
        <Card className="overflow-hidden border-border/70 bg-card shadow-sm">
            <CardHeader className="border-b bg-muted/20 pb-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-background text-primary shadow-sm">
                        <Droplets className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                        <CardTitle className="text-lg">Resumo de rega</CardTitle>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4 p-4">
                <div className={`rounded-3xl border px-4 py-4 ${riskMeta.className}`}>
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-background/70">
                            <RiskIcon className={`h-5 w-5 ${riskMeta.iconClassName}`} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-sm font-semibold">{riskMeta.label}</p>
                            <p className="mt-1 text-sm leading-6 opacity-90">
                                {riskMeta.description}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-border/70 bg-background px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Recomendação
                    </div>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {formatTextValue(suggestion)}
                    </p>
                </div>

                {metrics.length ? (
                    <dl className={getMetricsGridClassName(metrics.length)}>
                        {metrics.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.key}
                                    className="flex min-h-24 w-full flex-col justify-center rounded-2xl border border-border/70 bg-background px-4 py-3 shadow-sm"
                                >
                                    <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Icon className="h-4 w-4 shrink-0 text-primary" />
                                        {item.label}
                                    </dt>

                                    <dd className="mt-2 break-words text-sm font-semibold text-foreground">
                                        {item.value}
                                    </dd>
                                </div>
                            );
                        })}
                    </dl>
                ) : null}

                {signals.length ? (
                    <div className="rounded-2xl border border-border/70 bg-muted/20 px-4 py-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                            <ThermometerSun className="h-4 w-4 text-primary" />
                            Sinais considerados
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                            {signals.map((signal) => (
                                <span
                                    key={signal}
                                    className="inline-flex items-center rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-300"
                                >
                                    {signal}
                                </span>
                            ))}
                        </div>
                    </div>
                ) : null}
            </CardContent>
        </Card>
    );
}
