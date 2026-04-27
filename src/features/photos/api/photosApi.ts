import { apiClient } from "@/core/api/apiClient";
import { unwrapEnvelope, type ApiEnvelope } from "@/core/api/responseEnvelope";
import type {
  PaginatedPhotosResult,
  PhotoListParams,
  PlantPhoto,
  UploadPhotoPayload,
  UploadPhotoResponse
} from "@/features/photos/types/photoTypes";

function cleanParams(params: PhotoListParams): Record<string, string | number | boolean> {
  const cleaned: Record<string, string | number | boolean> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    cleaned[key] = value;
  });

  return cleaned;
}

function appendOptional(formData: FormData, key: string, value?: string): void {
  const normalized = value?.trim();

  if (normalized) {
    formData.append(key, normalized);
  }
}

export async function listPlantPhotos(
  plantId: number,
  params: PhotoListParams = {}
): Promise<PaginatedPhotosResult> {
  const response = await apiClient.get<ApiEnvelope<PlantPhoto[]>>(
    `/plants/${plantId}/photos`,
    {
      params: cleanParams(params)
    }
  );

  return {
    items: unwrapEnvelope(response.data),
    meta: response.data.meta
  };
}

export async function uploadPlantPhoto(
  plantId: number,
  payload: UploadPhotoPayload
): Promise<UploadPhotoResponse> {
  const formData = new FormData();

  formData.append("file", payload.file);
  appendOptional(formData, "photo_type", payload.photo_type ?? "routine");
  appendOptional(formData, "caption", payload.caption);
  appendOptional(formData, "notes", payload.notes);
  appendOptional(formData, "taken_at", payload.taken_at);

  const response = await apiClient.post<ApiEnvelope<UploadPhotoResponse>>(
    `/plants/${plantId}/photos`,
    formData
  );

  return unwrapEnvelope(response.data);
}

export async function deletePlantPhoto(
  plantId: number,
  photoId: number
): Promise<void> {
  await apiClient.delete(`/plants/${plantId}/photos/${photoId}`);
}

export async function downloadPlantPhoto(
  plantId: number,
  photoId: number
): Promise<Blob> {
  const response = await apiClient.get<Blob>(
    `/plants/${plantId}/photos/${photoId}/download`,
    {
      responseType: "blob"
    }
  );

  return response.data;
}