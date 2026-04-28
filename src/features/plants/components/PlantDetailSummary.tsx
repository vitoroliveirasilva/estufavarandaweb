import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    CalendarDays,
    Clock3,
    FileText,
    Home,
    MapPin,
    Sprout,
    SunMedium,
    Tag,
    Trash2,
    Wind
} from "lucide-react";

import { PlantStatus } from "@/features/plants/components/PlantStatus";
import type { PlantDetail } from "@/features/plants/types/plantTypes";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";

const FALLBACK_TEXT = "Não informado";

const environmentLabels: Record<string, string> = {
    indoor: "Interno",
    indoors: "Interno",
    outdoor: "Externo",
    outdoors: "Externo",
    balcony: "Varanda",
    greenhouse: "Estufa",
    garden: "Jardim"
};

const lightExposureLabels: Record<string, string> = {
    full_sun: "Sol pleno",
    direct_sun: "Sol direto",
    morning_sun: "Sol da manhã",
    afternoon_sun: "Sol da tarde",
    indirect_light: "Luz indireta",
    partial_shade: "Meia-sombra",
    shade: "Sombra",
    low_light: "Pouca luz"
};

const ventilationLabels: Record<string, string> = {
    airy: "Bem ventilado",
    moderate: "Ventilação moderada",
    sheltered: "Protegido do vento",
    windy: "Muito vento",
    low: "Pouca ventilação"
};

function formatDateTime(value?: string | null): string {
    if (!value) {
        return FALLBACK_TEXT;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return format(date, "dd/MM/yyyy 'às' HH:mm", {
        locale: ptBR
    });
}

function valueOrFallback(value: unknown): string {
    if (typeof value === "string") {
        const normalized = value.trim();
        return normalized || FALLBACK_TEXT;
    }

    if (typeof value === "number" && Number.isFinite(value)) {
        return String(value);
    }

    return FALLBACK_TEXT;
}

function humanize(value?: string | null, labels: Record<string, string> = {}): string {
    const normalized = value?.trim();

    if (!normalized) {
        return FALLBACK_TEXT;
    }

    const key = normalized.toLowerCase();

    if (labels[key]) {
        return labels[key];
    }

    return normalized
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .replace(/^./, (char) => char.toUpperCase());
}

function buildLocation(plant: PlantDetail): string {
    return (
        [plant.location_label, plant.city_name]
            .map((value) => value?.trim())
            .filter(Boolean)
            .join(" · ") || "Local não informado"
    );
}

type PlantDetailSummaryProps = {
    plant: PlantDetail;
};

export function PlantDetailSummary({ plant }: PlantDetailSummaryProps) {
    const isDeleted = Boolean(plant.archived_at);
    const location = buildLocation(plant);
    const nickname = plant.nickname?.trim();

    const highlights = [
        {
            label: "Ambiente",
            value: humanize(plant.environment, environmentLabels),
            icon: Home
        },
        {
            label: "Luz",
            value: humanize(plant.light_exposure, lightExposureLabels),
            icon: SunMedium
        },
        {
            label: "Ventilação",
            value: humanize(plant.ventilation, ventilationLabels),
            icon: Wind
        }
    ];

    const details = [
        {
            label: "Apelido",
            value: valueOrFallback(plant.nickname),
            icon: Tag
        },
        {
            label: "Local",
            value: location,
            icon: MapPin
        },
        {
            label: "Criada em",
            value: formatDateTime(plant.created_at),
            icon: CalendarDays
        },
        {
            label: "Atualizada em",
            value: formatDateTime(plant.updated_at),
            icon: Clock3
        }
    ];

    return (
        <section className="space-y-5">
            <Card className="overflow-hidden border-border/70 bg-card shadow-sm">
                <CardHeader className="border-b bg-muted/20 pb-4">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <PlantStatus status={plant.health_status} />

                                {isDeleted ? (
                                    <span className="inline-flex shrink-0 items-center rounded-full border border-destructive/20 bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
                                        <Trash2 className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                                        <span className="whitespace-nowrap">Planta excluída</span>
                                    </span>
                                ) : null}
                            </div>

                            <div className="flex min-w-0 items-center gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.4rem] border bg-background text-primary shadow-sm">
                                    <Sprout className="h-7 w-7" />
                                </div>

                                <div className="min-w-0">
                                    <CardTitle className="truncate whitespace-nowrap text-3xl font-semibold tracking-tight md:text-4xl">
                                        {plant.name}
                                    </CardTitle>

                                    {nickname ? (
                                        <p className="mt-1 truncate whitespace-nowrap text-sm font-medium text-muted-foreground md:text-base">
                                            {nickname}
                                        </p>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        <div className="flex min-w-0 items-center gap-2 rounded-2xl border bg-background px-4 py-3 text-sm font-medium text-muted-foreground shadow-sm lg:max-w-sm">
                            <MapPin className="h-4 w-4 shrink-0 text-primary" />
                            <span className="break-words">{location}</span>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="grid gap-3 pt-5 md:grid-cols-3">
                    {highlights.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.label}
                                className="rounded-2xl border bg-background p-4 shadow-sm transition-colors hover:bg-muted/20"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                                        <Icon className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                            {item.label}
                                        </p>
                                        <p className="mt-0.5 break-words text-sm font-semibold text-foreground">
                                            {item.value}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            <Card className="shadow-sm">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                            <FileText className="h-5 w-5" />
                        </div>

                        <CardTitle>Detalhes e observações</CardTitle>
                    </div>
                </CardHeader>

                <CardContent className="space-y-5">
                    <dl className="grid gap-3 lg:grid-cols-2">
                        {details.map((detail) => {
                            const Icon = detail.icon;

                            return (
                                <div
                                    key={detail.label}
                                    className="rounded-2xl border bg-background p-4"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <dt className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
                                            <Icon className="h-4 w-4 shrink-0 text-primary" />
                                            <span>{detail.label}</span>
                                        </dt>

                                        <dd className="min-w-0 break-words text-right text-sm font-medium text-foreground">
                                            {detail.value}
                                        </dd>
                                    </div>
                                </div>
                            );
                        })}
                    </dl>

                    <div className="rounded-2xl border bg-muted/20 p-4">
                        <div className="mb-3 flex items-center gap-2">
                            <FileText className="h-4 w-4 shrink-0 text-primary" />
                            <p className="text-sm font-semibold text-foreground">
                                Observações
                            </p>
                        </div>

                        <p className="whitespace-pre-wrap break-words rounded-xl bg-background px-4 py-3 text-sm leading-7 text-muted-foreground">
                            {valueOrFallback(plant.notes)}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}