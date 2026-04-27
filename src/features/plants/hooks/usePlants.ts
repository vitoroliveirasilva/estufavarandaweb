import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  archivePlant,
  createPlant,
  getPlant,
  listPlants,
  updatePlant,
} from "@/features/plants/api/plantsApi";
import type { PlantFormValues } from "@/features/plants/schemas/plantSchemas";
import type {
  PlantCreatePayload,
  PlantListParams,
  PlantUpdatePayload,
} from "@/features/plants/types/plantTypes";

export const plantQueryKeys = {
  root: ["plants"] as const,
  lists: () => [...plantQueryKeys.root, "list"] as const,
  list: (params: PlantListParams) =>
    [...plantQueryKeys.lists(), params] as const,
  details: () => [...plantQueryKeys.root, "detail"] as const,
  detail: (plantId: number) => [...plantQueryKeys.details(), plantId] as const,
};

function cleanString(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function cleanSpeciesProfileId(value: string | undefined): number | undefined {
  const normalized = value?.trim();

  if (!normalized) {
    return undefined;
  }

  const parsed = Number(normalized);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return undefined;
  }

  return parsed;
}

export function normalizePlantFormValues(
  values: PlantFormValues,
): PlantCreatePayload {
  return {
    name: values.name.trim(),
    nickname: cleanString(values.nickname),
    environment: cleanString(values.environment),
    light_exposure: cleanString(values.light_exposure),
    ventilation: cleanString(values.ventilation),
    location_label: cleanString(values.location_label),
    city_name: cleanString(values.city_name),
    notes: cleanString(values.notes),
    health_status: cleanString(values.health_status),
    species_profile_id: cleanSpeciesProfileId(values.species_profile_id),
  };
}

export function usePlantsList(params: PlantListParams) {
  return useQuery({
    queryKey: plantQueryKeys.list(params),
    queryFn: () => listPlants(params),
  });
}

export function usePlantDetail(plantId: number | null, enabled = true) {
  return useQuery({
    queryKey: plantId
      ? plantQueryKeys.detail(plantId)
      : plantQueryKeys.details(),
    queryFn: () => {
      if (!plantId) {
        throw new Error("ID da planta inválido.");
      }

      return getPlant(plantId);
    },
    enabled: enabled && Boolean(plantId),
  });
}

export function useCreatePlantMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PlantCreatePayload) => createPlant(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: plantQueryKeys.lists(),
      });
    },
  });
}

export function useUpdatePlantMutation(plantId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PlantUpdatePayload) => updatePlant(plantId, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: plantQueryKeys.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: plantQueryKeys.detail(plantId),
        }),
      ]);
    },
  });
}

export function useArchivePlantMutation(plantId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => archivePlant(plantId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: plantQueryKeys.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: plantQueryKeys.detail(plantId),
        }),
      ]);
    },
  });
}
