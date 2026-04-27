import { useQuery } from "@tanstack/react-query";

import {
  getClimateSummary,
  listPlantClimate
} from "@/features/climate/api/climateApi";
import type { PlantClimateParams } from "@/features/climate/types/climateTypes";

export const climateQueryKeys = {
  root: ["climate"] as const,
  summary: () => [...climateQueryKeys.root, "summary"] as const,
  plant: (plantId: number, params: PlantClimateParams) =>
    [...climateQueryKeys.root, "plant", plantId, params] as const
};

export function useClimateSummary() {
  return useQuery({
    queryKey: climateQueryKeys.summary(),
    queryFn: getClimateSummary
  });
}

export function usePlantClimate(plantId: number, params: PlantClimateParams) {
  return useQuery({
    queryKey: climateQueryKeys.plant(plantId, params),
    queryFn: () => listPlantClimate(plantId, params),
    enabled: plantId > 0
  });
}