import { apiClient } from "@/core/api/apiClient";
import { unwrapEnvelope } from "@/core/api/responseEnvelope";
import type {
  ClimateSnapshot,
  ClimateSummary,
  PlantClimateParams
} from "@/features/climate/types/climateTypes";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

type QueryParamValue = string | number | boolean;

type ListObjectPayload = {
  items?: unknown;
  results?: unknown;
  data?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertPositiveInteger(value: number, fieldName: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${fieldName} inválido.`);
  }
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

function normalizeNullableNumber(value: unknown): number | null {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

function normalizeNullableString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function cleanParams(
  params: PlantClimateParams = {}
): Record<string, QueryParamValue> {
  return {
    limit: normalizePositiveInteger(params.limit, DEFAULT_LIMIT, MAX_LIMIT)
  };
}

function extractList(payload: unknown): unknown[] {
  const unwrapped = unwrapEnvelope<unknown>(payload);

  if (Array.isArray(unwrapped)) {
    return unwrapped;
  }

  if (isRecord(unwrapped)) {
    const objectPayload = unwrapped as ListObjectPayload;

    if (Array.isArray(objectPayload.items)) {
      return objectPayload.items;
    }

    if (Array.isArray(objectPayload.results)) {
      return objectPayload.results;
    }

    if (Array.isArray(objectPayload.data)) {
      return objectPayload.data;
    }
  }

  return [];
}

function normalizeSnapshot(value: unknown): ClimateSnapshot | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = Number(value.id);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  const recordedAt =
    typeof value.recorded_at === "string" && value.recorded_at.trim().length > 0
      ? value.recorded_at.trim()
      : "";

  return {
    id,
    recorded_at: recordedAt,
    temperature_c: normalizeNullableNumber(value.temperature_c),
    humidity_percent: normalizeNullableNumber(value.humidity_percent),
    rain_mm: normalizeNullableNumber(value.rain_mm),
    feels_like_c: normalizeNullableNumber(value.feels_like_c),
    uv_index: normalizeNullableNumber(value.uv_index),
    city_name: normalizeNullableString(value.city_name)
  };
}

function normalizeSummary(payload: unknown): ClimateSummary {
  const unwrapped = unwrapEnvelope<unknown>(payload);

  if (isRecord(unwrapped)) {
    return unwrapped;
  }

  if (Array.isArray(unwrapped)) {
    return {
      total_registros: unwrapped.length
    };
  }

  if (unwrapped === null || unwrapped === undefined || unwrapped === "") {
    return {};
  }

  return {
    valor: unwrapped
  };
}

export async function listPlantClimate(
  plantId: number,
  params: PlantClimateParams = {}
): Promise<ClimateSnapshot[]> {
  assertPositiveInteger(plantId, "Planta");

  const response = await apiClient.get<unknown>(`/plants/${plantId}/climate`, {
    params: cleanParams(params)
  });

  return extractList(response.data)
    .map(normalizeSnapshot)
    .filter((snapshot): snapshot is ClimateSnapshot => snapshot !== null);
}

export async function getClimateSummary(): Promise<ClimateSummary> {
  const response = await apiClient.get<unknown>("/climate/summary");
  return normalizeSummary(response.data);
}
