import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  getClimateSummary,
  listPlantClimate
} from "@/features/climate/api/climateApi";
import type { PlantClimateParams } from "@/features/climate/types/climateTypes";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;
const CLIMATE_STALE_TIME_MS = 60_000;

function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

function normalizePositiveInteger(
  value: unknown,
  fallback: number,
  max?: number
): number {
  const numberValue = Number(value);

  if (!Number.isInteger(numberValue) || numberValue <= 0) {
    return fallback;
  }

  return typeof max === "number" ? Math.min(numberValue, max) : numberValue;
}

export const climateQueryKeys = {
  root: ["climate"] as const,
  summary: () => [...climateQueryKeys.root, "summary"] as const,
  plant: (plantId: number) => [...climateQueryKeys.root, "plant", plantId] as const,
  plantList: (plantId: number, params: Required<PlantClimateParams>) =>
    [...climateQueryKeys.plant(plantId), params] as const
};

export function normalizePlantClimateParams(
  params: PlantClimateParams = {}
): Required<PlantClimateParams> {
  return {
    limit: normalizePositiveInteger(params.limit, DEFAULT_LIMIT, MAX_LIMIT)
  };
}

export function useClimateSummary(enabled = true) {
  return useQuery({
    queryKey: climateQueryKeys.summary(),
    queryFn: getClimateSummary,
    enabled,
    staleTime: CLIMATE_STALE_TIME_MS
  });
}

export function usePlantClimate(
  plantId: number,
  params: PlantClimateParams = {},
  enabled = true
) {
  const normalizedParams = normalizePlantClimateParams(params);

  return useQuery({
    queryKey: climateQueryKeys.plantList(plantId, normalizedParams),
    queryFn: () => listPlantClimate(plantId, normalizedParams),
    enabled: enabled && isPositiveInteger(plantId),
    placeholderData: keepPreviousData,
    staleTime: CLIMATE_STALE_TIME_MS
  });
}
