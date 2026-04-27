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

function parsePositiveInt(value: string | null, fallback: number): number {
    if (!value) {
        return fallback;
    }

    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function parseBoolean(value: string | null): boolean {
    return value === "true" || value === "1";
}

function getFilters(searchParams: URLSearchParams): PlantFiltersValue {
    return {
        search: searchParams.get("search") ?? "",
        healthStatus: searchParams.get("health_status") ?? "",
        includeArchived: parseBoolean(searchParams.get("include_archived"))
    };
}

export function PlantsListPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parsePositiveInt(searchParams.get("page"), 1);
    const pageSize = parsePositiveInt(searchParams.get("page_size"), 20);
    const filters = getFilters(searchParams);

    const queryParams: PlantListParams = {
        page,
        page_size: pageSize,
        search: filters.search || undefined,
        health_status: filters.healthStatus || undefined,
        include_archived: filters.includeArchived
    };

    const plantsQuery = usePlantsList(queryParams);

    const total = plantsQuery.data?.meta?.total ?? plantsQuery.data?.items.length ?? 0;
    const totalPages = plantsQuery.data?.meta?.total_pages ?? Math.max(1, Math.ceil(total / pageSize));
    const hasItems = Boolean(plantsQuery.data?.items.length);

    function updateParams(nextFilters: PlantFiltersValue, nextPage = 1) {
        const next = new URLSearchParams();

        next.set("page", String(nextPage));
        next.set("page_size", String(pageSize));

        if (nextFilters.search.trim()) {
            next.set("search", nextFilters.search.trim());
        }

        if (nextFilters.healthStatus) {
            next.set("health_status", nextFilters.healthStatus);
        }

        if (nextFilters.includeArchived) {
            next.set("include_archived", "true");
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
                eyebrow="Plantas"
                title="Minhas plantas"
                description="Listagem integrada à API com paginação, filtros e busca."
                actions={
                    <Button asChild>
                        <Link to="/app/plants/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Cadastrar planta
                        </Link>
                    </Button>
                }
            />

            <div className="space-y-5">
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
                        description="Cadastre sua primeira planta ou ajuste os filtros para encontrar registros arquivados ou com outro status."
                        actionLabel="Cadastrar planta"
                        onAction={() => navigate("/app/plants/new")}
                    />
                ) : null}

                {hasItems ? (
                    <>
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {plantsQuery.data?.items.map((plant) => (
                                <PlantCard key={plant.id} plant={plant} />
                            ))}
                        </div>

                        <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border bg-card px-4 py-3 sm:flex-row">
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