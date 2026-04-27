import { apiClient } from "@/core/api/apiClient";
import { unwrapEnvelope, type ApiEnvelope } from "@/core/api/responseEnvelope";
import type {
  PaginatedSpeciesResult,
  SpeciesListParams,
  SpeciesProfile
} from "@/features/species/types/speciesTypes";

function cleanParams(params: SpeciesListParams): Record<string, string | number | boolean> {
  const cleaned: Record<string, string | number | boolean> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    cleaned[key] = value;
  });

  return cleaned;
}

export async function listSpecies(
  params: SpeciesListParams = {}
): Promise<PaginatedSpeciesResult> {
  const response = await apiClient.get<ApiEnvelope<SpeciesProfile[]>>("/species", {
    params: cleanParams(params)
  });

  return {
    items: unwrapEnvelope(response.data),
    meta: response.data.meta
  };
}

export async function getSpecies(speciesId: number): Promise<SpeciesProfile> {
  const response = await apiClient.get<ApiEnvelope<SpeciesProfile>>(
    `/species/${speciesId}`
  );

  return unwrapEnvelope(response.data);
}