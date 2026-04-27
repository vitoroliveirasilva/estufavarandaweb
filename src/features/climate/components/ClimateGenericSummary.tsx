import { CloudSun } from "lucide-react";

import type { ClimateSummary } from "@/features/climate/types/climateTypes";
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

type ClimateGenericSummaryProps = {
    summary?: ClimateSummary;
    isLoading?: boolean;
    errorMessage?: string | null;
    onRetry?: () => void;
};

const MAX_DISPLAY_LENGTH = 500;

const numberFormatter = new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 2
});

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
});

function truncate(value: string): string {
    const normalized = value.replace(/\s+/g, " ").trim();

    if (normalized.length <= MAX_DISPLAY_LENGTH) {
        return normalized;
    }

    return `${normalized.slice(0, MAX_DISPLAY_LENGTH - 1).trim()}…`;
}

function isIsoDateLike(value: string): boolean {
    return /^\d{4}-\d{2}-\d{2}(?:[T\s].*)?$/.test(value);
}

function formatKey(key: string): string {
    return key
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatObject(value: object): string {
    try {
        return truncate(JSON.stringify(value));
    } catch {
        return "Objeto não serializável";
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
        return Number.isFinite(value) ? numberFormatter.format(value) : "Não informado";
    }

    if (typeof value === "string") {
        if (isIsoDateLike(value)) {
            const date = new Date(value);

            if (!Number.isNaN(date.getTime())) {
                return dateTimeFormatter.format(date);
            }
        }

        return truncate(value);
    }

    if (Array.isArray(value)) {
        return `${value.length} item(ns)`;
    }

    if (typeof value === "object") {
        return formatObject(value);
    }

    return truncate(String(value));
}

export function ClimateGenericSummary({
    summary,
    isLoading = false,
    errorMessage,
    onRetry
}: ClimateGenericSummaryProps) {
    if (isLoading) {
        return (
            <LoadingState
                title="Carregando resumo climático"
                description="Buscando o resumo climático geral da sua estufa."
            />
        );
    }

    if (errorMessage) {
        return (
            <ErrorState
                title="Não foi possível carregar o resumo climático"
                description={errorMessage}
                actionLabel={onRetry ? "Tentar novamente" : undefined}
                onAction={onRetry}
            />
        );
    }

    const entries = Object.entries(summary ?? {}).filter(
        ([, value]) => value !== undefined && typeof value !== "function"
    );

    if (entries.length === 0) {
        return (
            <EmptyState
                icon={<CloudSun className="h-6 w-6" />}
                title="Resumo climático indisponível"
                description="A API ainda não retornou dados de resumo climático."
            />
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Resumo climático</CardTitle>
                <CardDescription>
                    Dados consolidados retornados pela API para a estufa.
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
