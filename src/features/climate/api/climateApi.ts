import { apiClient } from "@/core/api/apiClient";
import { unwrapEnvelope, type ApiEnvelope } from "@/core/api/responseEnvelope";
import type {
  ClimateSnapshot,
  ClimateSummary,
  PlantClimateParams
} from "@/features/climate/types/climateTypes";

function cleanParams(
  params: PlantClimateParams
): Record<string, string | number | boolean> {
  const cleaned: Record<string, string | number | boolean> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    cleaned[key] = value;
  });

  return cleaned;
}

export async function listPlantClimate(
  plantId: number,
  params: PlantClimateParams = {}
): Promise<ClimateSnapshot[]> {
  const response = await apiClient.get<ApiEnvelope<ClimateSnapshot[]>>(
    `/plants/${plantId}/climate`,
    {
      params: cleanParams(params)
    }
  );

  return unwrapEnvelope(response.data);
}

export async function getClimateSummary(): Promise<ClimateSummary> {
  const response = await apiClient.get<ApiEnvelope<ClimateSummary>>(
    "/climate/summary"
  );

  return unwrapEnvelope(response.data);
}