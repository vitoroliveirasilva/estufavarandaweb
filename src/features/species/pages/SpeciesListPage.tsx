import { Leaf } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getAppErrorMessage } from "@/core/api/apiError";
import { SpeciesCard } from "@/features/species/components/SpeciesCard";
import { SpeciesDetailPanel } from "@/features/species/components/SpeciesDetailPanel";
import {
  SpeciesFilters,
  type SpeciesFiltersValue
} from "@/features/species/components/SpeciesFilters";
import {
  useSpeciesDetail,
  useSpeciesList
} from "@/features/species/hooks/useSpecies";
import type { SpeciesListParams } from "@/features/species/types/speciesTypes";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { LoadingState } from "@/shared/components/LoadingState";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/components/ui/button";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
const MAX_SEARCH_LENGTH = 120;

function parsePositiveInt(
  value: string | null | undefined,
  fallback: number,
  max?: number
): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  const normalized = Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;

  return max ? Math.min(normalized, max) : normalized;
}

function parseBoolean(value: string | null, fallback: boolean): boolean {
  if (value === null) {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();

  if (["1", "true", "sim", "yes"].includes(normalized)) {
    return true;
  }

  if (["0", "false", "nao", "não", "no"].includes(normalized)) {
    return false;
  }

  return fallback;
}

function normalizeSearch(value: string | null): string {
  return (value ?? "").trim().replace(/\s+/g, " ").slice(0, MAX_SEARCH_LENGTH);
}

function getFilters(searchParams: URLSearchParams): SpeciesFiltersValue {
  return {
    search: normalizeSearch(searchParams.get("search")),
    activeOnly: parseBoolean(searchParams.get("active_only"), true)
  };
}

export function SpeciesListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<number | null>(null);

  const page = parsePositiveInt(searchParams.get("page"), DEFAULT_PAGE);
  const pageSize = parsePositiveInt(
    searchParams.get("page_size"),
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE
  );

  const filters = useMemo(() => getFilters(searchParams), [searchParams]);

  const queryParams: SpeciesListParams = useMemo(
    () => ({
      page,
      page_size: pageSize,
      search: filters.search || undefined,
      active_only: filters.activeOnly
    }),
    [filters.activeOnly, filters.search, page, pageSize]
  );

  const speciesQuery = useSpeciesList(queryParams);
  const detailQuery = useSpeciesDetail(selectedSpeciesId);

  const total = speciesQuery.data?.meta?.total ?? speciesQuery.data?.items.length ?? 0;
  const totalPages =
    speciesQuery.data?.meta?.total_pages ?? Math.max(1, Math.ceil(total / pageSize));
  const hasItems = Boolean(speciesQuery.data?.items.length);

  useEffect(() => {
    setSelectedSpeciesId(null);
  }, [filters.activeOnly, filters.search]);

  useEffect(() => {
    if (!speciesQuery.data?.meta || speciesQuery.isFetching) {
      return;
    }

    if (page > totalPages) {
      const next = new URLSearchParams(searchParams);
      next.set("page", String(totalPages));
      next.set("page_size", String(pageSize));
      setSearchParams(next, { replace: true });
    }
  }, [
    page,
    pageSize,
    searchParams,
    setSearchParams,
    speciesQuery.data?.meta,
    speciesQuery.isFetching,
    totalPages
  ]);

  function updateParams(nextFilters: SpeciesFiltersValue, nextPage = DEFAULT_PAGE) {
    const normalizedSearch = normalizeSearch(nextFilters.search);
    const next = new URLSearchParams();

    next.set("page", String(nextPage));
    next.set("page_size", String(pageSize));
    next.set("active_only", String(nextFilters.activeOnly));

    if (normalizedSearch) {
      next.set("search", normalizedSearch);
    }

    setSearchParams(next);
  }

  function clearFilters() {
    const next = new URLSearchParams();
    next.set("page", String(DEFAULT_PAGE));
    next.set("page_size", String(pageSize));
    next.set("active_only", "true");
    setSearchParams(next);
  }

  function goToPage(nextPage: number) {
    updateParams(filters, nextPage);
  }

  return (
    <>
      <PageHeader
        eyebrow="Espécies"
        title="Catálogo de espécies"
        description="Consulta integrada à API de espécies, com busca, paginação e painel de detalhe."
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <div className="space-y-5">
          <SpeciesFilters
            value={filters}
            isFetching={speciesQuery.isFetching}
            onChange={(nextFilters) => updateParams(nextFilters)}
            onClear={clearFilters}
          />

          {speciesQuery.isLoading ? (
            <LoadingState
              title="Carregando espécies"
              description="Buscando catálogo na API."
            />
          ) : null}

          {speciesQuery.isError ? (
            <ErrorState
              title="Não foi possível carregar as espécies"
              description={getAppErrorMessage(speciesQuery.error)}
              actionLabel="Tentar novamente"
              onAction={() => void speciesQuery.refetch()}
            />
          ) : null}

          {!speciesQuery.isLoading && !speciesQuery.isError && !hasItems ? (
            <EmptyState
              icon={<Leaf className="h-6 w-6" />}
              title="Nenhuma espécie encontrada"
              description="Ajuste os filtros ou pesquise por outro nome."
            />
          ) : null}

          {hasItems ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                {speciesQuery.data?.items.map((species) => (
                  <SpeciesCard
                    key={species.id}
                    species={species}
                    selected={selectedSpeciesId === species.id}
                    onSelect={setSelectedSpeciesId}
                  />
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
                    disabled={page <= 1 || speciesQuery.isFetching}
                    onClick={() => goToPage(page - 1)}
                  >
                    Anterior
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={page >= totalPages || speciesQuery.isFetching}
                    onClick={() => goToPage(page + 1)}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </div>

        <div className="xl:sticky xl:top-24 xl:self-start">
          <SpeciesDetailPanel
            species={detailQuery.data}
            isLoading={detailQuery.isLoading}
            errorMessage={
              detailQuery.error ? getAppErrorMessage(detailQuery.error) : null
            }
            onRetry={() => void detailQuery.refetch()}
          />
        </div>
      </div>
    </>
  );
}
