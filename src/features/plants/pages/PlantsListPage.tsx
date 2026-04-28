import { Plus, Sprout } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { getAppErrorMessage } from "@/core/api/apiError";
import { PlantCard } from "@/features/plants/components/PlantCard";
import {
    PlantFilters,
    type PlantFiltersValue
} from "@/features/plants/components/PlantFilters";
import { usePlantsList } from "@/features/plants/hooks/usePlants";
import type { PlantListParams } from "@/features/plants/types/plantTypes";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { LoadingState } from "@/shared/components/LoadingState";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/components/ui/button";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

function parsePositiveInt(
    value: string | null,
    fallback: number,
    max?: number
): number {
    if (!value) {
        return fallback;
    }

    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed <= 0) {
        return fallback;
    }

    return max ? Math.min(parsed, max) : parsed;
}

function getFilters(searchParams: URLSearchParams): PlantFiltersValue {
    return {
        search: searchParams.get("search")?.trim() ?? "",
        healthStatus: searchParams.get("health_status")?.trim() ?? ""
    };
}

export function PlantsListPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parsePositiveInt(searchParams.get("page"), 1);
    const pageSize = parsePositiveInt(
        searchParams.get("page_size"),
        DEFAULT_PAGE_SIZE,
        MAX_PAGE_SIZE
    );
    const filters = getFilters(searchParams);

    const queryParams: PlantListParams = {
        page,
        page_size: pageSize,
        search: filters.search || undefined,
        health_status: filters.healthStatus || undefined,
        include_archived: false
    };

    const plantsQuery = usePlantsList(queryParams);

    const plants = plantsQuery.data?.items ?? [];
    const total = plantsQuery.data?.meta?.total ?? plants.length;
    const totalPages =
        plantsQuery.data?.meta?.total_pages ?? Math.max(1, Math.ceil(total / pageSize));
    const hasItems = plants.length > 0;

    function updateParams(nextFilters: PlantFiltersValue, nextPage = 1) {
        const next = new URLSearchParams();
        const search = nextFilters.search.trim();
        const healthStatus = nextFilters.healthStatus.trim();

        next.set("page", String(nextPage));
        next.set("page_size", String(pageSize));

        if (search) {
            next.set("search", search);
        }

        if (healthStatus) {
            next.set("health_status", healthStatus);
        }

        setSearchParams(next);
    }

    function clearFilters() {
        const next = new URLSearchParams();
        next.set("page", "1");
        next.set("page_size", String(pageSize));
        setSearchParams(next);
    }

    function goToPage(nextPage: number) {
        updateParams(filters, nextPage);
    }

    return (
        <>
            <PageHeader
                title="Minhas plantas"
                actions={
                    <Button asChild>
                        <Link to="/app/plants/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Cadastrar planta
                        </Link>
                    </Button>
                }
            />

            <div className="flex min-h-[calc(100vh-12rem)] flex-col gap-5">
                <PlantFilters
                    value={filters}
                    isFetching={plantsQuery.isFetching}
                    onChange={(nextFilters) => updateParams(nextFilters)}
                    onClear={clearFilters}
                />

                {plantsQuery.isLoading ? (
                    <LoadingState
                        title="Carregando plantas"
                        description="Buscando sua coleção na API."
                    />
                ) : null}

                {plantsQuery.isError ? (
                    <ErrorState
                        title="Não foi possível carregar as plantas"
                        description={getAppErrorMessage(plantsQuery.error)}
                        actionLabel="Tentar novamente"
                        onAction={() => void plantsQuery.refetch()}
                    />
                ) : null}

                {!plantsQuery.isLoading && !plantsQuery.isError && !hasItems ? (
                    <EmptyState
                        icon={<Sprout className="h-6 w-6" />}
                        title="Nenhuma planta encontrada"
                        description="Cadastre sua primeira planta ou ajuste os filtros para encontrar outro cadastro."
                        actionLabel="Cadastrar planta"
                        onAction={() => navigate("/app/plants/new")}
                    />
                ) : null}

                {hasItems ? (
                    <>
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {plants.map((plant) => (
                                <PlantCard key={plant.id} plant={plant} />
                            ))}
                        </div>

                        <div className="mt-auto flex flex-col items-center justify-between gap-3 rounded-2xl border bg-card px-4 py-3 shadow-sm sm:flex-row">
                            <p className="text-sm text-muted-foreground">
                                Página {page} de {totalPages} · {total} registro(s)
                            </p>

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={page <= 1 || plantsQuery.isFetching}
                                    onClick={() => goToPage(page - 1)}
                                >
                                    Anterior
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={page >= totalPages || plantsQuery.isFetching}
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
