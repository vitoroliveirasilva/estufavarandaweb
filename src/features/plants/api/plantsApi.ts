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

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
const MAX_SEARCH_LENGTH = 120;
const MAX_TEXT_LENGTH = 500;
const MAX_NOTES_LENGTH = 2_000;

type RequestParam = string | number | boolean;

function assertPositiveInteger(value: number, fieldName: string): number {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${fieldName} inválido.`);
  }

  return value;
}

function normalizePositiveInteger(
  value: number | undefined,
  fieldName: string,
  max?: number
): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  const parsed = assertPositiveInteger(value, fieldName);
  return max ? Math.min(parsed, max) : parsed;
}

function cleanString(value: string | undefined, maxLength: number): string | undefined {
  const normalized = value?.trim();

  if (!normalized) {
    return undefined;
  }

  return normalized.slice(0, maxLength);
}

function cleanParams(params: PlantListParams): Record<string, RequestParam> {
  const cleaned: Record<string, RequestParam> = {};

  const page = normalizePositiveInteger(params.page, "Página");
  const pageSize = normalizePositiveInteger(
    params.page_size ?? DEFAULT_PAGE_SIZE,
    "Tamanho da página",
    MAX_PAGE_SIZE
  );
  const search = cleanString(params.search, MAX_SEARCH_LENGTH);
  const healthStatus = cleanString(params.health_status, MAX_TEXT_LENGTH);
  const speciesProfileId = normalizePositiveInteger(
    params.species_profile_id,
    "Espécie"
  );

  if (page !== undefined) {
    cleaned.page = page;
  }

  if (pageSize !== undefined) {
    cleaned.page_size = pageSize;
  }

  if (params.include_archived !== undefined) {
    cleaned.include_archived = params.include_archived;
  }

  if (params.archived !== undefined) {
    cleaned.archived = params.archived;
  }

  if (healthStatus) {
    cleaned.health_status = healthStatus;
  }

  if (speciesProfileId !== undefined) {
    cleaned.species_profile_id = speciesProfileId;
  }

  if (search) {
    cleaned.search = search;
  }

  return cleaned;
}

function cleanPayload<T extends PlantCreatePayload | PlantUpdatePayload>(
  payload: T,
  options: { requireName: boolean }
): T {
  const cleaned: PlantUpdatePayload = {};
  const name = cleanString(payload.name, MAX_TEXT_LENGTH);

  if (options.requireName && !name) {
    throw new Error("Informe o nome da planta.");
  }

  if (name) {
    cleaned.name = name;
  }

  const nickname = cleanString(payload.nickname, MAX_TEXT_LENGTH);
  const environment = cleanString(payload.environment, MAX_TEXT_LENGTH);
  const lightExposure = cleanString(payload.light_exposure, MAX_TEXT_LENGTH);
  const ventilation = cleanString(payload.ventilation, MAX_TEXT_LENGTH);
  const locationLabel = cleanString(payload.location_label, MAX_TEXT_LENGTH);
  const cityName = cleanString(payload.city_name, MAX_TEXT_LENGTH);
  const notes = cleanString(payload.notes, MAX_NOTES_LENGTH);
  const healthStatus = cleanString(payload.health_status, MAX_TEXT_LENGTH);
  const speciesProfileId = normalizePositiveInteger(
    payload.species_profile_id,
    "Espécie"
  );

  if (nickname) {
    cleaned.nickname = nickname;
  }

  if (environment) {
    cleaned.environment = environment;
  }

  if (lightExposure) {
    cleaned.light_exposure = lightExposure;
  }

  if (ventilation) {
    cleaned.ventilation = ventilation;
  }

  if (locationLabel) {
    cleaned.location_label = locationLabel;
  }

  if (cityName) {
    cleaned.city_name = cityName;
  }

  if (notes) {
    cleaned.notes = notes;
  }

  if (healthStatus) {
    cleaned.health_status = healthStatus;
  }

  if (speciesProfileId !== undefined) {
    cleaned.species_profile_id = speciesProfileId;
  }

  return cleaned as T;
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
    cleanPayload(payload, { requireName: true })
  );

  return unwrapEnvelope(response.data);
}

export async function getPlant(plantId: number): Promise<PlantDetail> {
  assertPositiveInteger(plantId, "Planta");

  const response = await apiClient.get<ApiEnvelope<PlantDetail>>(
    `/plants/${plantId}`
  );

  return unwrapEnvelope(response.data);
}

export async function updatePlant(
  plantId: number,
  payload: PlantUpdatePayload
): Promise<PlantUpdateResponse> {
  assertPositiveInteger(plantId, "Planta");

  const response = await apiClient.patch<ApiEnvelope<PlantUpdateResponse>>(
    `/plants/${plantId}`,
    cleanPayload(payload, { requireName: false })
  );

  return unwrapEnvelope(response.data);
}

export async function archivePlant(plantId: number): Promise<void> {
  assertPositiveInteger(plantId, "Planta");

  await apiClient.delete(`/plants/${plantId}`);
}
