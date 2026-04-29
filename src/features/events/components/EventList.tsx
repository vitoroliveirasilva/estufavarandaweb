import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { LucideIcon } from "lucide-react";
import {
    AlertTriangle,
    Bug,
    CalendarClock,
    Camera,
    CheckCircle2,
    Droplets,
    FileText,
    Flower2,
    Info,
    Leaf,
    ListChecks,
    MapPin,
    Ruler,
    Scissors,
    Sparkles,
    Sprout,
    Tag
} from "lucide-react";

import type { PlantEvent } from "@/features/events/types/eventTypes";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";

type EventListProps = {
    events: PlantEvent[];
};

type MetadataItem = {
    key: string;
    label: string;
    value: string;
    icon: LucideIcon;
};

type EventTypeMeta = {
    label: string;
    icon: LucideIcon;
    className: string;
};

type EventSeverityMeta = {
    label: string;
    icon: LucideIcon;
    className: string;
};

const metadataLabels: Record<string, string> = {
    detail: "Detalhe",
    result: "Resultado",
    amount: "Quantidade",
    unit: "Unidade",
    source: "Origem",
    note: "Nota"
};

const metadataIcons: Record<string, LucideIcon> = {
    detail: FileText,
    result: Sparkles,
    amount: Ruler,
    unit: Tag,
    source: Info,
    note: FileText
};

const eventTypeMeta: Record<string, EventTypeMeta> = {
    observation: {
        label: "Observação",
        icon: Info,
        className:
            "border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300"
    },
    watering: {
        label: "Rega",
        icon: Droplets,
        className:
            "border-blue-500/25 bg-blue-500/10 text-blue-700 dark:text-blue-300"
    },
    fertilization: {
        label: "Adubação",
        icon: Leaf,
        className:
            "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
    },
    repotting: {
        label: "Replantio",
        icon: Sprout,
        className:
            "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300"
    },
    pruning: {
        label: "Poda",
        icon: Scissors,
        className:
            "border-slate-500/25 bg-slate-500/10 text-slate-700 dark:text-slate-300"
    },
    location_change: {
        label: "Mudança de local",
        icon: MapPin,
        className:
            "border-violet-500/25 bg-violet-500/10 text-violet-700 dark:text-violet-300"
    },
    bloom: {
        label: "Floração",
        icon: Flower2,
        className:
            "border-pink-500/25 bg-pink-500/10 text-pink-700 dark:text-pink-300"
    },
    new_growth: {
        label: "Novo crescimento",
        icon: Sprout,
        className:
            "border-lime-500/25 bg-lime-500/10 text-lime-700 dark:text-lime-300"
    },
    wilt: {
        label: "Murcha",
        icon: AlertTriangle,
        className:
            "border-orange-500/25 bg-orange-500/10 text-orange-700 dark:text-orange-300"
    },
    yellow_leaves: {
        label: "Folhas amarelas",
        icon: Leaf,
        className:
            "border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300"
    },
    pest: {
        label: "Praga",
        icon: Bug,
        className:
            "border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-300"
    },
    photo_added: {
        label: "Foto adicionada",
        icon: Camera,
        className:
            "border-cyan-500/25 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300"
    }
};

const eventSeverityMeta: Record<string, EventSeverityMeta> = {
    pest: {
        label: "Crítico",
        icon: AlertTriangle,
        className:
            "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300"
    },
    wilt: {
        label: "Atenção",
        icon: AlertTriangle,
        className:
            "border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-300"
    },
    yellow_leaves: {
        label: "Atenção",
        icon: AlertTriangle,
        className:
            "border-yellow-500/35 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300"
    },
    bloom: {
        label: "Positivo",
        icon: CheckCircle2,
        className:
            "border-pink-500/25 bg-pink-500/10 text-pink-700 dark:text-pink-300"
    },
    new_growth: {
        label: "Positivo",
        icon: CheckCircle2,
        className:
            "border-lime-500/25 bg-lime-500/10 text-lime-700 dark:text-lime-300"
    }
};

const fallbackEventTypeMeta: EventTypeMeta = {
    label: "Evento",
    icon: ListChecks,
    className: "border-border bg-muted/50 text-muted-foreground"
};

function formatUnknownEventType(type: string): string {
    const normalized = type.trim();

    if (!normalized) {
        return fallbackEventTypeMeta.label;
    }

    return normalized
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getEventTypeMeta(type: string): EventTypeMeta {
    const normalized = type.trim().toLowerCase();

    if (!normalized) {
        return fallbackEventTypeMeta;
    }

    return (
        eventTypeMeta[normalized] ?? {
            ...fallbackEventTypeMeta,
            label: formatUnknownEventType(type)
        }
    );
}

function getEventSeverityMeta(type: string): EventSeverityMeta | null {
    const normalized = type.trim().toLowerCase();
    return eventSeverityMeta[normalized] ?? null;
}

function formatDateTime(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return format(date, "dd/MM/yyyy 'às' HH:mm", {
        locale: ptBR
    });
}

function hasMetadata(
    metadata: Record<string, unknown> | null
): metadata is Record<string, unknown> {
    return Boolean(metadata && Object.keys(metadata).length > 0);
}

function getEventTitle(event: PlantEvent): string {
    return event.title?.trim() || "Evento sem título";
}

function getEventDescription(event: PlantEvent): string {
    return event.description?.trim() || "Sem descrição registrada.";
}

function formatMetadataKey(key: string): string {
    return (
        metadataLabels[key] ??
        key
            .replace(/[_-]+/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .replace(/\b\w/g, (char) => char.toUpperCase())
    );
}

function formatMetadataValue(value: unknown): string {
    if (value === null || value === undefined || value === "") {
        return "Não informado";
    }

    if (typeof value === "boolean") {
        return value ? "Sim" : "Não";
    }

    if (typeof value === "number") {
        return Number.isFinite(value) ? String(value) : "Não informado";
    }

    if (typeof value === "string") {
        return value.trim() || "Não informado";
    }

    if (Array.isArray(value)) {
        const simpleValues = value.filter(
            (item) =>
                typeof item === "string" ||
                typeof item === "number" ||
                typeof item === "boolean"
        );

        return simpleValues.length
            ? simpleValues.map(String).join(", ")
            : `${value.length} item(ns)`;
    }

    if (typeof value === "object") {
        const entries = Object.entries(value as Record<string, unknown>)
            .filter(([, entryValue]) => entryValue !== undefined && entryValue !== null)
            .slice(0, 3)
            .map(([entryKey, entryValue]) => {
                const formattedValue =
                    typeof entryValue === "string" ||
                        typeof entryValue === "number" ||
                        typeof entryValue === "boolean"
                        ? String(entryValue)
                        : "registrado";

                return `${formatMetadataKey(entryKey)}: ${formattedValue}`;
            });

        return entries.length ? entries.join(" · ") : "Informação registrada";
    }

    return String(value);
}

function getMetadataItems(metadata: Record<string, unknown> | null): MetadataItem[] {
    if (!hasMetadata(metadata)) {
        return [];
    }

    return Object.entries(metadata)
        .filter(([, value]) => value !== undefined && value !== null && value !== "")
        .map(([key, value]) => ({
            key,
            label: formatMetadataKey(key),
            value: formatMetadataValue(value),
            icon: metadataIcons[key] ?? Info
        }));
}

export function EventList({ events }: EventListProps) {
    return (
        <Card className="overflow-hidden border-border/70 bg-card shadow-sm">
            <CardHeader className="border-b bg-muted/20 pb-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-background text-primary shadow-sm">
                        <ListChecks className="h-5 w-5" aria-hidden="true" />
                    </div>

                    <div className="min-w-0 space-y-1">
                        <CardTitle className="text-lg">
                            Histórico de eventos
                        </CardTitle>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-4">
                <div className="space-y-4">
                    {events.map((event) => {
                        const metadataItems = getMetadataItems(event.metadata_json);
                        const typeMeta = getEventTypeMeta(event.event_type);
                        const severityMeta = getEventSeverityMeta(event.event_type);
                        const TypeIcon = typeMeta.icon;
                        const SeverityIcon = severityMeta?.icon;

                        return (
                            <article
                                key={event.id}
                                className="overflow-hidden rounded-3xl border border-border/70 bg-background shadow-sm"
                            >
                                <div className="border-b border-border/70 bg-muted/20 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-background text-primary shadow-sm">
                                            <ListChecks
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                            />
                                        </div>

                                        <div className="min-w-0 space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="break-words font-semibold text-foreground">
                                                    {getEventTitle(event)}
                                                </h3>

                                                <span
                                                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${typeMeta.className}`}
                                                >
                                                    <TypeIcon
                                                        className="mr-1.5 h-3.5 w-3.5"
                                                        aria-hidden="true"
                                                    />
                                                    {typeMeta.label}
                                                </span>

                                                {severityMeta && SeverityIcon ? (
                                                    <span
                                                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${severityMeta.className}`}
                                                    >
                                                        <SeverityIcon
                                                            className="mr-1.5 h-3.5 w-3.5"
                                                            aria-hidden="true"
                                                        />
                                                        {severityMeta.label}
                                                    </span>
                                                ) : null}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                                <span className="inline-flex items-center">
                                                    <CalendarClock className="mr-1.5 h-4 w-4 text-primary" />
                                                    {formatDateTime(event.occurred_at)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 p-4">
                                    <div className="rounded-2xl border border-border/70 bg-card px-4 py-3">
                                        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                                            <FileText className="h-4 w-4 text-primary" />
                                            Descrição
                                        </div>

                                        <p className="whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
                                            {getEventDescription(event)}
                                        </p>
                                    </div>

                                    {metadataItems.length ? (
                                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                                            {metadataItems.map((item) => {
                                                const Icon = item.icon;

                                                return (
                                                    <div
                                                        key={item.key}
                                                        className="rounded-2xl border border-border/70 bg-card px-4 py-3"
                                                    >
                                                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                            <Icon className="h-4 w-4 text-primary" />
                                                            {item.label}
                                                        </div>

                                                        <p className="mt-2 break-words text-sm font-semibold text-foreground">
                                                            {item.value}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : null}
                                </div>
                            </article>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
