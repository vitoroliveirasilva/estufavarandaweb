import { useEffect } from "react";
import { ArrowLeft, Droplets } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { getAppErrorMessage } from "@/core/api/apiError";
import { usePlantDetail } from "@/features/plants/hooks/usePlants";
import { WateringLogForm } from "@/features/watering/components/WateringLogForm";
import { WateringLogsList } from "@/features/watering/components/WateringLogsList";
import { WateringSummaryCard } from "@/features/watering/components/WateringSummaryCard";
import {
    normalizeWateringLogFormValues,
    normalizeWateringLogsParams,
    useCreateWateringLogMutation,
    useWateringLogs,
    useWateringSummary
} from "@/features/watering/hooks/useWatering";
import type { WateringLogFormValues } from "@/features/watering/schemas/wateringSchemas";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { LoadingState } from "@/shared/components/LoadingState";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/components/ui/button";

function parsePositiveInt(value: string | null | undefined, fallback: number): number {
    if (!value) {
        return fallback;
    }

    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function WateringLogsPage() {
    const { plantId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const parsedPlantId = parsePositiveInt(plantId, 0);
    const { page, page_size: pageSize } = normalizeWateringLogsParams({
        page: parsePositiveInt(searchParams.get("page"), 1),
        page_size: parsePositiveInt(searchParams.get("page_size"), 20)
    });

    const plantQuery = usePlantDetail(parsedPlantId, parsedPlantId > 0);
    const logsQuery = useWateringLogs(parsedPlantId, {
        page,
        page_size: pageSize
    });
    const summaryQuery = useWateringSummary(parsedPlantId);
    const createMutation = useCreateWateringLogMutation(parsedPlantId);

    const total = logsQuery.data?.meta?.total ?? logsQuery.data?.items.length ?? 0;
    const totalPages = Math.max(
        1,
        logsQuery.data?.meta?.total_pages ?? Math.ceil(total / pageSize)
    );
    const hasLogs = Boolean(logsQuery.data?.items.length);

    useEffect(() => {
        if (!logsQuery.data || page <= totalPages) {
            return;
        }

        const next = new URLSearchParams(searchParams);
        next.set("page", String(totalPages));
        next.set("page_size", String(pageSize));
        setSearchParams(next, { replace: true });
    }, [logsQuery.data, page, pageSize, searchParams, setSearchParams, totalPages]);

    if (!parsedPlantId) {
        return (
            <ErrorState
                title="Planta inválida"
                description="O identificador informado na URL não é válido."
            />
        );
    }

    function goToPage(nextPage: number) {
        const boundedPage = Math.min(Math.max(nextPage, 1), totalPages);
        const next = new URLSearchParams(searchParams);
        next.set("page", String(boundedPage));
        next.set("page_size", String(pageSize));
        setSearchParams(next);
    }

    async function handleCreateWateringLog(values: WateringLogFormValues) {
        await createMutation.mutateAsync(normalizeWateringLogFormValues(values));
    }

    return (
        <>
            <PageHeader
                eyebrow="Regas"
                title={`Regas${plantQuery.data?.name ? ` · ${plantQuery.data.name}` : ""}`}
                description="Histórico, resumo e criação de registros de rega da planta."
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
                {plantQuery.isError ? (
                    <ErrorState
                        title="Não foi possível carregar os dados da planta"
                        description={getAppErrorMessage(plantQuery.error)}
                        actionLabel="Tentar novamente"
                        onAction={() => void plantQuery.refetch()}
                    />
                ) : null}

                <WateringSummaryCard
                    summary={summaryQuery.data}
                    isLoading={summaryQuery.isLoading}
                    errorMessage={
                        summaryQuery.error ? getAppErrorMessage(summaryQuery.error) : null
                    }
                    onRetry={() => void summaryQuery.refetch()}
                />

                <WateringLogForm
                    isSubmitting={createMutation.isPending}
                    apiErrorMessage={
                        createMutation.error ? getAppErrorMessage(createMutation.error) : null
                    }
                    onSubmit={handleCreateWateringLog}
                />

                {logsQuery.isLoading ? (
                    <LoadingState
                        title="Carregando regas"
                        description="Buscando histórico de regas na API."
                    />
                ) : null}

                {logsQuery.isError ? (
                    <ErrorState
                        title="Não foi possível carregar o histórico"
                        description={getAppErrorMessage(logsQuery.error)}
                        actionLabel="Tentar novamente"
                        onAction={() => void logsQuery.refetch()}
                    />
                ) : null}

                {!logsQuery.isLoading && !logsQuery.isError && !hasLogs ? (
                    <EmptyState
                        icon={<Droplets className="h-6 w-6" />}
                        title="Nenhuma rega registrada"
                        description="Registre a primeira rega para criar o histórico desta planta."
                    />
                ) : null}

                {hasLogs ? (
                    <>
                        <WateringLogsList logs={logsQuery.data?.items ?? []} />

                        <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border bg-card px-4 py-3 sm:flex-row">
                            <p className="text-sm text-muted-foreground">
                                Página {page} de {totalPages} · {total} registro(s)
                            </p>

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={page <= 1 || logsQuery.isFetching}
                                    onClick={() => goToPage(page - 1)}
                                >
                                    Anterior
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={page >= totalPages || logsQuery.isFetching}
                                    onClick={() => goToPage(page + 1)}
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
