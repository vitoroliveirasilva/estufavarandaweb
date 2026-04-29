import {
    ArrowLeft,
    ChevronDown,
    CloudSun,
    History,
    Info,
    Lightbulb,
    RefreshCw
} from "lucide-react";
import { useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { getAppErrorMessage } from "@/core/api/apiError";
import { PlantClimateHistory } from "@/features/climate/components/PlantClimateHistory";
import { usePlantClimate } from "@/features/climate/hooks/useClimate";
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
                title={`${plantName ? `${plantName}` : ""}`}
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
                <Card className="overflow-hidden border-border/70 bg-muted/20 shadow-sm">
                    <CardContent className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-center">
                        <div className="flex min-w-0 gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-background text-primary shadow-sm">
                                <Lightbulb className="h-6 w-6" />
                            </div>

                            <div className="min-w-0">
                                <h2 className="text-base font-semibold text-foreground">
                                    Como usar esses registros
                                </h2>

                                <div className="mt-1 text-sm leading-6 text-muted-foreground space-y-2">
                                    <p>
                                        Os snapshots são salvos automaticamente para você comparar clima, regas, fotos e eventos.
                                        Assim fica mais fácil perceber padrões, como folhas murchando em dias muito quentes ou melhoras depois de períodos mais úmidos.
                                    </p>
                                    <p>
                                        Você pode ajustar a rega e o local de acordo com as necessidades da planta e observar como ela reage a diferentes condições climáticas. Além disso, é possível usar os dados para entender melhor o que sua planta gosta e precisa para ficar saudável e feliz, como o calor, chuva e umidade!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/70 bg-card shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/5 text-primary">
                                    <History className="h-5 w-5" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-base font-semibold leading-none text-foreground">
                                        Histórico da planta
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-[13rem_auto] sm:items-center">
                                <div className="relative">
                                    <select
                                        id="climate-limit"
                                        value={limit}
                                        aria-label="Quantidade de registros do histórico"
                                        className="h-11 w-full appearance-none rounded-2xl border border-input bg-background px-4 py-2 pr-10 text-sm shadow-sm outline-none transition-colors hover:border-primary/40 focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
                                        onChange={(event) => updateLimit(event.target.value)}
                                    >
                                        {LIMIT_OPTIONS.map((option) => (
                                            <option key={option} value={option}>
                                                {option} registros
                                            </option>
                                        ))}
                                    </select>

                                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={plantClimateQuery.isFetching}
                                    className="h-11 rounded-2xl px-5"
                                    onClick={() => void plantClimateQuery.refetch()}
                                >
                                    <RefreshCw
                                        className={
                                            plantClimateQuery.isFetching && !isInitialLoading
                                                ? "mr-2 h-4 w-4 animate-spin"
                                                : "mr-2 h-4 w-4"
                                        }
                                    />
                                    {plantClimateQuery.isFetching && !isInitialLoading
                                        ? "Atualizando"
                                        : "Atualizar"}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {isInitialLoading ? (
                    <LoadingState
                        title="Carregando clima"
                        description="Buscando snapshots climáticos registrados automaticamente para esta planta."
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
                        description="Quando o sistema registrar snapshots para esta planta, eles aparecerão aqui para você comparar com regas, fotos e eventos."
                    />
                ) : null}

                {hasSnapshots ? <PlantClimateHistory snapshots={snapshots} /> : null}

                {hasSnapshots ? (
                    <Card className="border-border/70 bg-card shadow-sm">
                        <CardContent className="flex gap-3 p-4">
                            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <p className="text-sm leading-6 text-muted-foreground">
                                Dica: use esses dados junto com o histórico de fotos e eventos.
                                Por exemplo, compare dias de calor, baixa umidade ou muita chuva
                                com mudanças visíveis nas folhas.
                            </p>
                        </CardContent>
                    </Card>
                ) : null}
            </div>
        </>
    );
}
