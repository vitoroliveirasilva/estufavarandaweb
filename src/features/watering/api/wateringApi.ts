import { apiClient } from "@/core/api/apiClient";
import { unwrapEnvelope, type ApiEnvelope } from "@/core/api/responseEnvelope";
import type {
  CreateWateringLogPayload,
  CreateWateringLogResponse,
  PaginatedWateringLogsResult,
  WateringLog,
  WateringLogsParams,
  WateringSummary
} from "@/features/watering/types/wateringTypes";

function cleanParams(
  params: WateringLogsParams
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

export async function listWateringLogs(
  plantId: number,
  params: WateringLogsParams = {}
): Promise<PaginatedWateringLogsResult> {
  const response = await apiClient.get<ApiEnvelope<WateringLog[]>>(
    `/plants/${plantId}/watering-logs`,
    {
      params: cleanParams(params)
    }
  );

  return {
    items: unwrapEnvelope(response.data),
    meta: response.data.meta
  };
}

export async function createWateringLog(
  plantId: number,
  payload: CreateWateringLogPayload
): Promise<CreateWateringLogResponse> {
  const response = await apiClient.post<ApiEnvelope<CreateWateringLogResponse>>(
    `/plants/${plantId}/watering-logs`,
    payload
  );

  return unwrapEnvelope(response.data);
}

export async function getWateringSummary(
  plantId: number
): Promise<WateringSummary> {
  const response = await apiClient.get<ApiEnvelope<WateringSummary>>(
    `/plants/${plantId}/watering-summary`
  );

  return unwrapEnvelope(response.data);
}