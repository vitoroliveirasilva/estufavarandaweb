import { apiClient } from "@/core/api/apiClient";
import { unwrapEnvelope, type ApiEnvelope } from "@/core/api/responseEnvelope";
import type {
  CreatePlantEventPayload,
  CreatePlantEventResponse,
  PaginatedPlantEventsResult,
  PlantEvent,
  PlantEventsParams
} from "@/features/events/types/eventTypes";

function cleanParams(
  params: PlantEventsParams
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

export async function listPlantEvents(
  plantId: number,
  params: PlantEventsParams = {}
): Promise<PaginatedPlantEventsResult> {
  const response = await apiClient.get<ApiEnvelope<PlantEvent[]>>(
    `/plants/${plantId}/events`,
    {
      params: cleanParams(params)
    }
  );

  return {
    items: unwrapEnvelope(response.data),
    meta: response.data.meta
  };
}

export async function createPlantEvent(
  plantId: number,
  payload: CreatePlantEventPayload
): Promise<CreatePlantEventResponse> {
  const response = await apiClient.post<ApiEnvelope<CreatePlantEventResponse>>(
    `/plants/${plantId}/events`,
    payload
  );

  return unwrapEnvelope(response.data);
}