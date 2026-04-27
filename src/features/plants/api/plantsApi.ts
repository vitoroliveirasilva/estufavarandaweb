import { apiClient } from "@/core/api/apiClient";
import { unwrapEnvelope, type ApiEnvelope } from "@/core/api/responseEnvelope";
import type {
  PaginatedPlantsResult,
  PlantCreatePayload,
  PlantCreateResponse,
  PlantDetail,
  PlantListItem,
  PlantListParams,
  PlantUpdatePayload,
  PlantUpdateResponse
} from "@/features/plants/types/plantTypes";

function cleanParams(params: PlantListParams): Record<string, string | number | boolean> {
  const cleaned: Record<string, string | number | boolean> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    cleaned[key] = value;
  });

  return cleaned;
}

export async function listPlants(
  params: PlantListParams = {}
): Promise<PaginatedPlantsResult> {
  const response = await apiClient.get<ApiEnvelope<PlantListItem[]>>("/plants", {
    params: cleanParams(params)
  });

  return {
    items: unwrapEnvelope(response.data),
    meta: response.data.meta
  };
}

export async function createPlant(
  payload: PlantCreatePayload
): Promise<PlantCreateResponse> {
  const response = await apiClient.post<ApiEnvelope<PlantCreateResponse>>(
    "/plants",
    payload
  );

  return unwrapEnvelope(response.data);
}

export async function getPlant(plantId: number): Promise<PlantDetail> {
  const response = await apiClient.get<ApiEnvelope<PlantDetail>>(
    `/plants/${plantId}`
  );

  return unwrapEnvelope(response.data);
}

export async function updatePlant(
  plantId: number,
  payload: PlantUpdatePayload
): Promise<PlantUpdateResponse> {
  const response = await apiClient.patch<ApiEnvelope<PlantUpdateResponse>>(
    `/plants/${plantId}`,
    payload
  );

  return unwrapEnvelope(response.data);
}

export async function archivePlant(plantId: number): Promise<void> {
  await apiClient.delete(`/plants/${plantId}`);
}