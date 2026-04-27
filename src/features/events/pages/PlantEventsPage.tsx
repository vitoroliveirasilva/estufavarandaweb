import { ArrowLeft, ListChecks } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { getAppErrorMessage } from "@/core/api/apiError";
import { EventForm } from "@/features/events/components/EventForm";
import { EventList } from "@/features/events/components/EventList";
import {
    normalizePlantEventFormValues,
    useCreatePlantEventMutation,
    usePlantEvents
} from "@/features/events/hooks/usePlantEvents";
import type { PlantEventFormValues } from "@/features/events/schemas/eventSchemas";
import { usePlantDetail } from "@/features/plants/hooks/usePlants";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { LoadingState } from "@/shared/components/LoadingState";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/components/ui/button";
import {
    Card,
    CardContent
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_EVENT_TYPE_LENGTH = 64;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

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
    return value?.trim().slice(0, MAX_EVENT_TYPE_LENGTH) ?? "";
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
                title={`Eventos${plantQuery.data?.name ? ` · ${plantQuery.data.name}` : ""}`}
                description="Histórico e criação de cuidados, observações e eventos gerais da planta."
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
                        createMutation.error ? getAppErrorMessage(createMutation.error) : null
                    }
                    onSubmit={handleCreateEvent}
                />

                <Card>
                    <CardContent className="p-4">
                        <form
                            className="flex flex-col gap-4 sm:flex-row sm:items-end"
                            onSubmit={(event) => {
                                event.preventDefault();
                                updateParams({
                                    page: DEFAULT_PAGE,
                                    eventType: eventTypeFilter
                                });
                            }}
                        >
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="event-filter">Filtrar por tipo</Label>
                                <Input
                                    id="event-filter"
                                    value={eventTypeFilter}
                                    placeholder="observation"
                                    autoComplete="off"
                                    maxLength={MAX_EVENT_TYPE_LENGTH}
                                    onChange={(event) => setEventTypeFilter(event.target.value)}
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" disabled={eventsQuery.isFetching}>
                                    Aplicar
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={
                                        (!eventType && !eventTypeFilter.trim()) ||
                                        eventsQuery.isFetching
                                    }
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
                        description="Buscando histórico de eventos na API."
                    />
                ) : null}

                {eventsQuery.isError ? (
                    <ErrorState
                        title="Não foi possível carregar os eventos"
                        description={getAppErrorMessage(eventsQuery.error)}
                        actionLabel="Tentar novamente"
                        onAction={() => void eventsQuery.refetch()}
                    />
                ) : null}

                {!eventsQuery.isLoading && !eventsQuery.isError && !hasEvents ? (
                    <EmptyState
                        icon={<ListChecks className="h-6 w-6" aria-hidden="true" />}
                        title="Nenhum evento registrado"
                        description="Crie o primeiro evento para acompanhar a evolução desta planta."
                    />
                ) : null}

                {hasEvents ? (
                    <>
                        <EventList events={eventsQuery.data?.items ?? []} />

                        <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border bg-card px-4 py-3 sm:flex-row">
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
