import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  getSpecies,
  listSpecies,
  normalizeSpeciesListParams
} from "@/features/species/api/speciesApi";
import type { SpeciesListParams } from "@/features/species/types/speciesTypes";

export const speciesQueryKeys = {
  root: ["species"] as const,
  lists: () => [...speciesQueryKeys.root, "list"] as const,
  list: (params: SpeciesListParams) =>
    [...speciesQueryKeys.lists(), normalizeSpeciesListParams(params)] as const,
  details: () => [...speciesQueryKeys.root, "detail"] as const,
  detail: (speciesId: number) =>
    [...speciesQueryKeys.details(), speciesId] as const
};

function normalizeSpeciesId(speciesId: number | null | undefined): number | null {
  return Number.isInteger(speciesId) && Number(speciesId) > 0
    ? Number(speciesId)
    : null;
}

export function useSpeciesList(params: SpeciesListParams) {
  const normalizedParams = normalizeSpeciesListParams(params);

  return useQuery({
    queryKey: speciesQueryKeys.list(normalizedParams),
    queryFn: () => listSpecies(normalizedParams),
    placeholderData: keepPreviousData
  });
}

export function useSpeciesDetail(speciesId: number | null | undefined) {
  const normalizedSpeciesId = normalizeSpeciesId(speciesId);

  return useQuery({
    queryKey: normalizedSpeciesId
      ? speciesQueryKeys.detail(normalizedSpeciesId)
      : speciesQueryKeys.details(),
    queryFn: () => getSpecies(normalizedSpeciesId as number),
    enabled: normalizedSpeciesId !== null
  });
}
