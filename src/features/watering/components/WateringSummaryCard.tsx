import { Droplets } from "lucide-react";

import type { WateringSummary } from "@/features/watering/types/wateringTypes";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { LoadingState } from "@/shared/components/LoadingState";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";

type WateringSummaryCardProps = {
    summary?: WateringSummary;
    isLoading?: boolean;
    errorMessage?: string | null;
    onRetry?: () => void;
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
});

function formatKey(key: string): string {
    return key
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function safeJsonStringify(value: unknown): string {
    try {
        return JSON.stringify(value);
    } catch {
        return "Objeto não exibível";
    }
}

function formatValue(value: unknown): string {
    if (value === null || value === undefined || value === "") {
        return "Não informado";
    }

    if (typeof value === "boolean") {
        return value ? "Sim" : "Não";
    }

    if (typeof value === "number") {
        return Number.isFinite(value) ? value.toLocaleString("pt-BR") : "Não informado";
    }

    if (typeof value === "string") {
        const date = new Date(value);

        if (!Number.isNaN(date.getTime()) && value.includes("T")) {
            return dateFormatter.format(date);
        }

        return value.trim() || "Não informado";
    }

    if (Array.isArray(value)) {
        return `${value.length} item(ns)`;
    }

    if (typeof value === "object") {
        return safeJsonStringify(value);
    }

    return String(value);
}

export function WateringSummaryCard({
    summary,
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

    const entries = Object.entries(summary ?? {}).filter(
        ([, value]) => value !== undefined
    );

    if (entries.length === 0) {
        return (
            <EmptyState
                icon={<Droplets className="h-6 w-6" />}
                title="Resumo ainda indisponível"
                description="A API não retornou dados de resumo para esta planta."
            />
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Resumo de rega</CardTitle>
                <CardDescription>
                    A API pode retornar campos variáveis, então o front renderiza o objeto
                    com tolerância.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <dl className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {entries.map(([key, value]) => (
                        <div key={key} className="rounded-2xl border bg-background p-4">
                            <dt className="text-sm text-muted-foreground">{formatKey(key)}</dt>
                            <dd className="mt-2 break-words text-sm font-semibold">
                                {formatValue(value)}
                            </dd>
                        </div>
                    ))}
                </dl>
            </CardContent>
        </Card>
    );
}
