import { apiClient } from "@/core/api/apiClient";
import { unwrapEnvelope, type ApiEnvelope } from "@/core/api/responseEnvelope";
import type {
  CreatePlantEventPayload,
  CreatePlantEventResponse,
  PaginatedPlantEventsResult,
  PlantEvent,
  PlantEventsParams
} from "@/features/events/types/eventTypes";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
const MAX_EVENT_TYPE_LENGTH = 64;

function assertValidPlantId(plantId: number): void {
  if (!Number.isInteger(plantId) || plantId <= 0) {
    throw new Error("Identificador da planta inválido.");
  }
}

function normalizePositiveInteger(
  value: number | undefined,
  fallback: number,
  max?: number
): number {
  if (!Number.isInteger(value) || value <= 0) {
    return fallback;
  }

  return typeof max === "number" ? Math.min(value, max) : value;
}

function normalizeEventType(value: string | undefined): string | undefined {
  const normalized = value?.trim();

  if (!normalized) {
    return undefined;
  }

  return normalized.slice(0, MAX_EVENT_TYPE_LENGTH);
}

function cleanParams(
  params: PlantEventsParams
): Record<string, string | number | boolean> {
  return {
    page: normalizePositiveInteger(params.page, DEFAULT_PAGE),
    page_size: normalizePositiveInteger(
      params.page_size,
      DEFAULT_PAGE_SIZE,
      MAX_PAGE_SIZE
    ),
    ...(normalizeEventType(params.event_type)
      ? { event_type: normalizeEventType(params.event_type) }
      : {})
  };
}

export async function listPlantEvents(
  plantId: number,
  params: PlantEventsParams = {}
): Promise<PaginatedPlantEventsResult> {
  assertValidPlantId(plantId);

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
  assertValidPlantId(plantId);

  const response = await apiClient.post<ApiEnvelope<CreatePlantEventResponse>>(
    `/plants/${plantId}/events`,
    payload
  );

  return unwrapEnvelope(response.data);
}
