import { ArrowLeft, ChevronDown, Filter, ListChecks } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { getAppErrorMessage } from "@/core/api/apiError";
import { EventForm } from "@/features/events/components/EventForm";
import { EventList } from "@/features/events/components/EventList";
import {
    normalizePlantEventFormValues,
    useCreatePlantEventMutation,
    usePlantEvents
} from "@/features/events/hooks/usePlantEvents";
import {
    EVENT_TYPE_OPTIONS,
    type PlantEventFormValues
} from "@/features/events/schemas/eventSchemas";
import { usePlantDetail } from "@/features/plants/hooks/usePlants";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { LoadingState } from "@/shared/components/LoadingState";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

const EVENT_FILTER_OPTIONS = [
    { value: "", label: "Todos os tipos" },
    ...EVENT_TYPE_OPTIONS
] as const;

type EventFilterOption = {
    readonly value: string;
    readonly label: string;
};

type EventFilterSelectProps = {
    readonly id: string;
    readonly value: string;
    readonly options: readonly EventFilterOption[];
    readonly disabled?: boolean;
    readonly onChange: (value: string) => void;
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function stringifyApiDetail(value: unknown): string | null {
    if (!value) {
        return null;
    }

    if (typeof value === "string") {
        return value;
    }

    if (Array.isArray(value)) {
        const messages = value
            .map((item) => {
                if (typeof item === "string") {
                    return item;
                }

                if (isRecord(item)) {
                    const field = Array.isArray(item.loc)
                        ? item.loc.map(String).join(".")
                        : undefined;

                    const message =
                        typeof item.msg === "string"
                            ? item.msg
                            : typeof item.message === "string"
                                ? item.message
                                : undefined;

                    return field && message ? `${field}: ${message}` : message;
                }

                return null;
            })
            .filter(Boolean);

        return messages.length ? messages.join(" ") : null;
    }

    if (isRecord(value)) {
        const messages = Object.entries(value)
            .map(([key, item]) => {
                if (typeof item === "string") {
                    return `${key}: ${item}`;
                }

                if (Array.isArray(item)) {
                    return `${key}: ${item.join(", ")}`;
                }

                return null;
            })
            .filter(Boolean);

        return messages.length ? messages.join(" ") : null;
    }

    return null;
}

function getDetailedAppErrorMessage(error: unknown): string {
    if (isRecord(error) && isRecord(error.response)) {
        const data = error.response.data;

        if (isRecord(data)) {
            const detailMessage =
                stringifyApiDetail(data.details) ??
                stringifyApiDetail(data.detail) ??
                stringifyApiDetail(data.errors);

            const baseMessage =
                typeof data.message === "string"
                    ? data.message
                    : typeof data.error === "string"
                        ? data.error
                        : null;

            if (baseMessage && detailMessage) {
                return `${baseMessage} ${detailMessage}`;
            }

            if (detailMessage) {
                return detailMessage;
            }

            if (baseMessage) {
                return baseMessage;
            }
        }
    }

    return getAppErrorMessage(error);
}

function EventFilterSelect({
    id,
    value,
    options,
    disabled = false,
    onChange
}: EventFilterSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const selectedOption =
        options.find((option) => option.value === value) ?? options[0];

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        function handleClickOutside(event: MouseEvent) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    function handleToggle() {
        if (disabled) {
            return;
        }

        setIsOpen((current) => !current);
    }

    function handleSelect(nextValue: string) {
        onChange(nextValue);
        setIsOpen(false);
    }

    return (
        <div ref={wrapperRef} className="relative">
            <div className="group relative flex h-11 w-full items-center rounded-2xl border border-input bg-background px-3 shadow-sm transition-colors hover:border-primary/40 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/15">
                <button
                    id={id}
                    type="button"
                    disabled={disabled}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    className="flex h-full min-w-0 flex-1 items-center justify-between gap-3 border-0 bg-transparent py-0 pl-1 pr-8 text-left text-sm text-foreground outline-none disabled:cursor-not-allowed disabled:opacity-70"
                    onClick={handleToggle}
                    onKeyDown={(event) => {
                        if (event.key === "Escape") {
                            setIsOpen(false);
                        }

                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            handleToggle();
                        }
                    }}
                >
                    <span className="min-w-0 truncate">
                        {selectedOption?.label ?? "Todos os tipos"}
                    </span>
                </button>

                <ChevronDown
                    className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition ${isOpen ? "rotate-180 text-primary" : ""
                        }`}
                />
            </div>

            {isOpen ? (
                <div
                    role="listbox"
                    aria-labelledby={id}
                    className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-2xl border border-border/80 bg-popover p-1 text-popover-foreground shadow-xl"
                >
                    {options.map((option) => {
                        const isSelected = option.value === value;

                        return (
                            <button
                                key={option.value || "all"}
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                className={`flex w-full items-center rounded-md px-4 py-2.5 text-left text-sm transition-colors ${isSelected
                                    ? "bg-muted/60 font-medium text-primary"
                                    : "text-foreground hover:bg-muted/40 hover:text-primary"
                                    }`}
                                onClick={() => handleSelect(option.value)}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
}

function parsePositiveInt(
    value: string | null | undefined,
    fallback: number,
    options?: readonly number[]
): number {
    if (!value) {
        return fallback;
    }

    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed <= 0) {
        return fallback;
    }

    if (options?.length && !options.includes(parsed)) {
        return fallback;
    }

    return parsed;
}

function normalizeEventType(value: string | null | undefined): string {
    const normalized = value?.trim() ?? "";

    return EVENT_FILTER_OPTIONS.some((option) => option.value === normalized)
        ? normalized
        : "";
}

function buildSearchParams(params: {
    page: number;
    pageSize: number;
    eventType: string;
}): URLSearchParams {
    const searchParams = new URLSearchParams();

    searchParams.set("page", String(params.page));
    searchParams.set("page_size", String(params.pageSize));

    const normalizedEventType = normalizeEventType(params.eventType);

    if (normalizedEventType) {
        searchParams.set("event_type", normalizedEventType);
    }

    return searchParams;
}

export function PlantEventsPage() {
    const { plantId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const parsedPlantId = parsePositiveInt(plantId, 0);
    const page = parsePositiveInt(searchParams.get("page"), DEFAULT_PAGE);
    const pageSize = parsePositiveInt(
        searchParams.get("page_size"),
        DEFAULT_PAGE_SIZE,
        PAGE_SIZE_OPTIONS
    );
    const eventType = normalizeEventType(searchParams.get("event_type"));
    const [eventTypeFilter, setEventTypeFilter] = useState(eventType);

    const eventQueryParams = useMemo(
        () => ({
            page,
            page_size: pageSize,
            event_type: eventType || undefined
        }),
        [eventType, page, pageSize]
    );

    const plantQuery = usePlantDetail(parsedPlantId, parsedPlantId > 0);
    const eventsQuery = usePlantEvents(parsedPlantId, eventQueryParams);
    const createMutation = useCreatePlantEventMutation(parsedPlantId);

    const total = eventsQuery.data?.meta?.total ?? eventsQuery.data?.items.length ?? 0;
    const totalPages = Math.max(
        1,
        eventsQuery.data?.meta?.total_pages ?? Math.ceil(total / pageSize)
    );
    const hasEvents = Boolean(eventsQuery.data?.items.length);

    useEffect(() => {
        setEventTypeFilter(eventType);
    }, [eventType]);

    useEffect(() => {
        const normalizedParams = buildSearchParams({
            page,
            pageSize,
            eventType
        });

        if (normalizedParams.toString() !== searchParams.toString()) {
            setSearchParams(normalizedParams, {
                replace: true
            });
        }
    }, [eventType, page, pageSize, searchParams, setSearchParams]);

    useEffect(() => {
        if (!eventsQuery.data || page <= totalPages) {
            return;
        }

        setSearchParams(
            buildSearchParams({
                page: totalPages,
                pageSize,
                eventType
            }),
            {
                replace: true
            }
        );
    }, [eventType, eventsQuery.data, page, pageSize, setSearchParams, totalPages]);

    function updateParams(next: {
        page?: number;
        pageSize?: number;
        eventType?: string;
        replace?: boolean;
    }) {
        setSearchParams(
            buildSearchParams({
                page: next.page ?? page,
                pageSize: next.pageSize ?? pageSize,
                eventType: next.eventType ?? eventType
            }),
            {
                replace: next.replace ?? false
            }
        );
    }

    async function handleCreateEvent(values: PlantEventFormValues) {
        await createMutation.mutateAsync(normalizePlantEventFormValues(values));

        updateParams({
            page: DEFAULT_PAGE
        });
    }

    if (!parsedPlantId) {
        return (
            <ErrorState
                title="Planta inválida"
                description="O identificador informado na URL não é válido."
            />
        );
    }

    return (
        <>
            <PageHeader
                eyebrow="Eventos"
                title={`${plantQuery.data?.name ? `${plantQuery.data.name}` : ""}`}
                actions={
                    <Button asChild variant="outline">
                        <Link to={`/app/plants/${parsedPlantId}`}>
                            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                            Voltar para planta
                        </Link>
                    </Button>
                }
            />

            <div className="space-y-5">
                <EventForm
                    isSubmitting={createMutation.isPending}
                    apiErrorMessage={
                        createMutation.error
                            ? getDetailedAppErrorMessage(createMutation.error)
                            : null
                    }
                    onSubmit={handleCreateEvent}
                />

                <Card className="overflow-visible border-border/70 bg-card shadow-sm">
                    <CardContent className="p-4">
                        <form
                            className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_auto] lg:items-center"
                            onSubmit={(event) => {
                                event.preventDefault();
                                updateParams({
                                    page: DEFAULT_PAGE,
                                    eventType: eventTypeFilter
                                });
                            }}
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/5 text-primary">
                                    <Filter className="h-5 w-5" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm font-semibold leading-none text-foreground">
                                        Filtrar histórico
                                    </p>
                                </div>
                            </div>

                            <EventFilterSelect
                                id="event-filter"
                                value={eventTypeFilter}
                                options={EVENT_FILTER_OPTIONS}
                                disabled={eventsQuery.isFetching}
                                onChange={setEventTypeFilter}
                            />

                            <div className="flex gap-2">
                                <Button
                                    type="submit"
                                    disabled={eventsQuery.isFetching}
                                    className="h-11 rounded-2xl px-5"
                                >
                                    Aplicar
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={
                                        (!eventType && !eventTypeFilter.trim()) ||
                                        eventsQuery.isFetching
                                    }
                                    className="h-11 rounded-2xl px-5"
                                    onClick={() => {
                                        setEventTypeFilter("");
                                        updateParams({
                                            page: DEFAULT_PAGE,
                                            eventType: ""
                                        });
                                    }}
                                >
                                    Limpar
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {plantQuery.isError ? (
                    <ErrorState
                        title="Não foi possível carregar os dados da planta"
                        description={getAppErrorMessage(plantQuery.error)}
                        actionLabel="Tentar novamente"
                        onAction={() => void plantQuery.refetch()}
                    />
                ) : null}

                {eventsQuery.isLoading ? (
                    <LoadingState
                        title="Carregando eventos"
                        description="Buscando histórico de eventos da planta."
                    />
                ) : null}

                {eventsQuery.isError ? (
                    <ErrorState
                        title="Não foi possível carregar os eventos"
                        description={getDetailedAppErrorMessage(eventsQuery.error)}
                        actionLabel="Tentar novamente"
                        onAction={() => void eventsQuery.refetch()}
                    />
                ) : null}

                {!eventsQuery.isLoading && !eventsQuery.isError && !hasEvents ? (
                    <EmptyState
                        icon={<ListChecks className="h-6 w-6" aria-hidden="true" />}
                        title="Nenhum evento registrado"
                        description="Crie o primeiro evento para acompanhar cuidados, mudanças e observações desta planta."
                    />
                ) : null}

                {hasEvents ? (
                    <>
                        <EventList events={eventsQuery.data?.items ?? []} />

                        <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-sm sm:flex-row">
                            <p className="text-sm text-muted-foreground">
                                Página {page} de {totalPages} · {total} registro(s)
                            </p>

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={page <= 1 || eventsQuery.isFetching}
                                    onClick={() =>
                                        updateParams({
                                            page: page - 1
                                        })
                                    }
                                >
                                    Anterior
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={page >= totalPages || eventsQuery.isFetching}
                                    onClick={() =>
                                        updateParams({
                                            page: page + 1
                                        })
                                    }
                                >
                                    Próxima
                                </Button>
                            </div>
                        </div>
                    </>
                ) : null}
            </div>
        </>
    );
}
