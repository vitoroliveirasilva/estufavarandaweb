import { useQuery } from "@tanstack/react-query";

import { getSpecies, listSpecies } from "@/features/species/api/speciesApi";
import type { SpeciesListParams } from "@/features/species/types/speciesTypes";

export const speciesQueryKeys = {
  root: ["species"] as const,
  lists: () => [...speciesQueryKeys.root, "list"] as const,
  list: (params: SpeciesListParams) =>
    [...speciesQueryKeys.lists(), params] as const,
  details: () => [...speciesQueryKeys.root, "detail"] as const,
  detail: (speciesId: number) =>
    [...speciesQueryKeys.details(), speciesId] as const,
};

export function useSpeciesList(params: SpeciesListParams) {
  return useQuery({
    queryKey: speciesQueryKeys.list(params),
    queryFn: () => listSpecies(params),
  });
}

export function useSpeciesDetail(speciesId: number | null) {
  return useQuery({
    queryKey: speciesId
      ? speciesQueryKeys.detail(speciesId)
      : speciesQueryKeys.details(),
    queryFn: () => {
      if (!speciesId) {
        throw new Error("ID da espécie inválido.");
      }

      return getSpecies(speciesId);
    },
    enabled: Boolean(speciesId),
  });
}
