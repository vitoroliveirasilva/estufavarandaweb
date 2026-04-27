import { ArrowLeft, CloudSun } from "lucide-react";
import { useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { getAppErrorMessage } from "@/core/api/apiError";
import { ClimateGenericSummary } from "@/features/climate/components/ClimateGenericSummary";
import { PlantClimateHistory } from "@/features/climate/components/PlantClimateHistory";
import {
    useClimateSummary,
    usePlantClimate
} from "@/features/climate/hooks/useClimate";
import { usePlantDetail } from "@/features/plants/hooks/usePlants";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { LoadingState } from "@/shared/components/LoadingState";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";

const DEFAULT_LIMIT = 10;
const LIMIT_OPTIONS = [5, 10, 20, 50] as const;

type ClimateLimit = (typeof LIMIT_OPTIONS)[number];

function parsePositiveInt(value: string | null | undefined, fallback: number): number {
    if (!value) {
        return fallback;
    }

    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizeLimit(value: string | number | null | undefined): ClimateLimit {
    const parsed = typeof value === "number" ? value : parsePositiveInt(value, DEFAULT_LIMIT);

    return LIMIT_OPTIONS.includes(parsed as ClimateLimit)
        ? (parsed as ClimateLimit)
        : DEFAULT_LIMIT;
}

export function PlantClimatePage() {
    const { plantId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const parsedPlantId = parsePositiveInt(plantId, 0);
    const limit = normalizeLimit(searchParams.get("limit"));
    const climateParams = useMemo(() => ({ limit }), [limit]);

    const plantQuery = usePlantDetail(parsedPlantId, parsedPlantId > 0);
    const plantClimateQuery = usePlantClimate(
        parsedPlantId,
        climateParams,
        parsedPlantId > 0
    );
    const summaryQuery = useClimateSummary(parsedPlantId > 0);

    if (!parsedPlantId) {
        return (
            <ErrorState
                title="Planta inválida"
                description="O identificador informado na URL não é válido."
            />
        );
    }

    const snapshots = plantClimateQuery.data ?? [];
    const hasSnapshots = snapshots.length > 0;
    const plantName = plantQuery.data?.name;
    const isInitialLoading = plantClimateQuery.isPending;

    function updateLimit(nextLimit: string) {
        const normalizedLimit = normalizeLimit(nextLimit);
        const next = new URLSearchParams(searchParams);

        next.set("limit", String(normalizedLimit));
        setSearchParams(next, { replace: true });
    }

    return (
        <>
            <PageHeader
                eyebrow="Clima"
                title={`Clima${plantName ? ` · ${plantName}` : ""}`}
                description="Histórico climático da planta e resumo climático geral da estufa."
                actions={
                    <Button asChild variant="outline">
                        <Link to={`/app/plants/${parsedPlantId}`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar para planta
                        </Link>
                    </Button>
                }
            />

            {plantQuery.isError ? (
                <div className="mb-5">
                    <ErrorState
                        title="Não foi possível carregar os dados da planta"
                        description={getAppErrorMessage(plantQuery.error)}
                        actionLabel="Tentar novamente"
                        onAction={() => void plantQuery.refetch()}
                    />
                </div>
            ) : null}

            <div className="space-y-5">
                <ClimateGenericSummary
                    summary={summaryQuery.data}
                    isLoading={summaryQuery.isPending}
                    errorMessage={summaryQuery.error ? getAppErrorMessage(summaryQuery.error) : null}
                    onRetry={() => void summaryQuery.refetch()}
                />

                <Card>
                    <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="space-y-2">
                            <Label htmlFor="climate-limit">Quantidade de registros</Label>
                            <select
                                id="climate-limit"
                                value={limit}
                                className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-48"
                                onChange={(event) => updateLimit(event.target.value)}
                            >
                                {LIMIT_OPTIONS.map((option) => (
                                    <option key={option} value={option}>
                                        {option} registros
                                    </option>
                                ))}
                            </select>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            disabled={plantClimateQuery.isFetching}
                            onClick={() => void plantClimateQuery.refetch()}
                        >
                            {plantClimateQuery.isFetching && !isInitialLoading
                                ? "Atualizando..."
                                : "Atualizar"}
                        </Button>
                    </CardContent>
                </Card>

                {isInitialLoading ? (
                    <LoadingState
                        title="Carregando clima"
                        description="Buscando snapshots climáticos da planta."
                    />
                ) : null}

                {plantClimateQuery.isError ? (
                    <ErrorState
                        title="Não foi possível carregar o clima da planta"
                        description={getAppErrorMessage(plantClimateQuery.error)}
                        actionLabel="Tentar novamente"
                        onAction={() => void plantClimateQuery.refetch()}
                    />
                ) : null}

                {!isInitialLoading && !plantClimateQuery.isError && !hasSnapshots ? (
                    <EmptyState
                        icon={<CloudSun className="h-6 w-6" />}
                        title="Nenhum registro climático"
                        description="Ainda não há snapshots climáticos registrados para esta planta."
                    />
                ) : null}

                {hasSnapshots ? <PlantClimateHistory snapshots={snapshots} /> : null}
            </div>
        </>
    );
}
