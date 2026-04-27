import { ArrowLeft, ListChecks } from "lucide-react";
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

function parsePositiveInt(value: string | null | undefined, fallback: number): number {
    if (!value) {
        return fallback;
    }

    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function PlantEventsPage() {
    const { plantId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const parsedPlantId = parsePositiveInt(plantId, 0);
    const page = parsePositiveInt(searchParams.get("page"), 1);
    const pageSize = parsePositiveInt(searchParams.get("page_size"), 20);
    const eventType = searchParams.get("event_type") ?? "";

    const plantQuery = usePlantDetail(parsedPlantId, parsedPlantId > 0);
    const eventsQuery = usePlantEvents(parsedPlantId, {
        page,
        page_size: pageSize,
        event_type: eventType || undefined
    });
    const createMutation = useCreatePlantEventMutation(parsedPlantId);

    if (!parsedPlantId) {
        return (
            <ErrorState
                title="Planta inválida"
                description="O identificador informado na URL não é válido."
            />
        );
    }

    const total = eventsQuery.data?.meta?.total ?? eventsQuery.data?.items.length ?? 0;
    const totalPages =
        eventsQuery.data?.meta?.total_pages ?? Math.max(1, Math.ceil(total / pageSize));
    const hasEvents = Boolean(eventsQuery.data?.items.length);

    function updateParams(next: {
        page?: number;
        pageSize?: number;
        eventType?: string;
    }) {
        const params = new URLSearchParams();

        params.set("page", String(next.page ?? page));
        params.set("page_size", String(next.pageSize ?? pageSize));

        const normalizedEventType = next.eventType ?? eventType;

        if (normalizedEventType.trim()) {
            params.set("event_type", normalizedEventType.trim());
        }

        setSearchParams(params);
    }

    async function handleCreateEvent(values: PlantEventFormValues) {
        await createMutation.mutateAsync(normalizePlantEventFormValues(values));
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
                            <ArrowLeft className="mr-2 h-4 w-4" />
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
                                    page: 1,
                                    eventType
                                });
                            }}
                        >
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="event-filter">Filtrar por tipo</Label>
                                <Input
                                    id="event-filter"
                                    value={eventType}
                                    placeholder="observation"
                                    onChange={(event) => {
                                        const params = new URLSearchParams(searchParams);
                                        const value = event.target.value;

                                        params.set("page", "1");
                                        params.set("page_size", String(pageSize));

                                        if (value.trim()) {
                                            params.set("event_type", value);
                                        } else {
                                            params.delete("event_type");
                                        }

                                        setSearchParams(params);
                                    }}
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={!eventType || eventsQuery.isFetching}
                                    onClick={() =>
                                        updateParams({
                                            page: 1,
                                            eventType: ""
                                        })
                                    }
                                >
                                    Limpar
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

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
                        icon={<ListChecks className="h-6 w-6" />}
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