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

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

function assertPositiveInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${label} inválido.`);
  }
}

function normalizePositiveInteger(
  value: unknown,
  fallback: number,
  max?: number
): number {
  const parsed = typeof value === "number" ? value : Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }

  return typeof max === "number" ? Math.min(parsed, max) : parsed;
}

function cleanParams(
  params: WateringLogsParams = {}
): Record<string, string | number | boolean> {
  return {
    page: normalizePositiveInteger(params.page, DEFAULT_PAGE),
    page_size: normalizePositiveInteger(
      params.page_size,
      DEFAULT_PAGE_SIZE,
      MAX_PAGE_SIZE
    )
  };
}

function cleanCreatePayload(
  payload: CreateWateringLogPayload
): CreateWateringLogPayload {
  const wateredAt = payload.watered_at?.trim();

  if (!wateredAt) {
    throw new Error("Informe a data e hora da rega.");
  }

  const cleaned: CreateWateringLogPayload = {
    watered_at: wateredAt
  };

  if (payload.quantity_ml !== undefined) {
    if (!Number.isFinite(payload.quantity_ml) || payload.quantity_ml <= 0) {
      throw new Error("Informe uma quantidade de água válida.");
    }

    cleaned.quantity_ml = payload.quantity_ml;
  }

  const notes = payload.notes?.trim();

  if (notes) {
    cleaned.notes = notes;
  }

  return cleaned;
}

function plantWateringPath(plantId: number, suffix: string): string {
  assertPositiveInteger(plantId, "Planta");
  return `/plants/${encodeURIComponent(String(plantId))}/${suffix}`;
}

export async function listWateringLogs(
  plantId: number,
  params: WateringLogsParams = {}
): Promise<PaginatedWateringLogsResult> {
  const response = await apiClient.get<ApiEnvelope<WateringLog[]>>(
    plantWateringPath(plantId, "watering-logs"),
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
    plantWateringPath(plantId, "watering-logs"),
    cleanCreatePayload(payload)
  );

  return unwrapEnvelope(response.data);
}

export async function getWateringSummary(
  plantId: number
): Promise<WateringSummary> {
  const response = await apiClient.get<ApiEnvelope<WateringSummary>>(
    plantWateringPath(plantId, "watering-summary")
  );

  return unwrapEnvelope(response.data);
}
