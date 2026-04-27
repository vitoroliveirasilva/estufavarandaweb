import { apiClient } from "@/core/api/apiClient";
import { unwrapEnvelope, type ApiEnvelope } from "@/core/api/responseEnvelope";
import type {
  PaginatedPhotosResult,
  PhotoListParams,
  PlantPhoto,
  UploadPhotoPayload,
  UploadPhotoResponse,
} from "@/features/photos/types/photoTypes";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

type QueryParamValue = string | number | boolean;

function assertPositiveInteger(value: number, fieldName: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${fieldName} inválido.`);
  }
}

function normalizePositiveInteger(
  value: unknown,
  fallback: number,
  max?: number,
): number {
  const numberValue = Number(value);

  if (!Number.isInteger(numberValue) || numberValue <= 0) {
    return fallback;
  }

  return typeof max === "number" ? Math.min(numberValue, max) : numberValue;
}

function cleanParams(
  params: PhotoListParams = {},
): Record<string, QueryParamValue> {
  return {
    page: normalizePositiveInteger(params.page, DEFAULT_PAGE),
    page_size: normalizePositiveInteger(
      params.page_size,
      DEFAULT_PAGE_SIZE,
      MAX_PAGE_SIZE,
    ),
  };
}

function appendOptional(formData: FormData, key: string, value?: string): void {
  const normalized = value?.trim();

  if (normalized) {
    formData.append(key, normalized);
  }
}

function buildPhotoFormData(payload: UploadPhotoPayload): FormData {
  if (!payload.file) {
    throw new Error("Arquivo não selecionado.");
  }

  const formData = new FormData();

  formData.append("file", payload.file);
  appendOptional(formData, "photo_type", payload.photo_type ?? "routine");
  appendOptional(formData, "caption", payload.caption);
  appendOptional(formData, "notes", payload.notes);
  appendOptional(formData, "taken_at", payload.taken_at);

  return formData;
}

export async function listPlantPhotos(
  plantId: number,
  params: PhotoListParams = {},
): Promise<PaginatedPhotosResult> {
  assertPositiveInteger(plantId, "Planta");

  const response = await apiClient.get<ApiEnvelope<PlantPhoto[]>>(
    `/plants/${plantId}/photos`,
    {
      params: cleanParams(params),
    },
  );

  return {
    items: unwrapEnvelope(response.data),
    meta: response.data.meta,
  };
}

export async function uploadPlantPhoto(
  plantId: number,
  payload: UploadPhotoPayload,
): Promise<UploadPhotoResponse> {
  assertPositiveInteger(plantId, "Planta");

  const response = await apiClient.post<ApiEnvelope<UploadPhotoResponse>>(
    `/plants/${plantId}/photos`,
    buildPhotoFormData(payload),
  );

  return unwrapEnvelope(response.data);
}

export async function deletePlantPhoto(
  plantId: number,
  photoId: number,
): Promise<void> {
  assertPositiveInteger(plantId, "Planta");
  assertPositiveInteger(photoId, "Foto");

  await apiClient.delete(`/plants/${plantId}/photos/${photoId}`);
}

export async function downloadPlantPhoto(
  plantId: number,
  photoId: number,
): Promise<Blob> {
  assertPositiveInteger(plantId, "Planta");
  assertPositiveInteger(photoId, "Foto");

  const response = await apiClient.get<Blob>(
    `/plants/${plantId}/photos/${photoId}/download`,
    {
      responseType: "blob",
    },
  );

  return response.data;
}
