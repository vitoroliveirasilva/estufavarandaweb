import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deletePlantPhoto,
  downloadPlantPhoto,
  listPlantPhotos,
  uploadPlantPhoto,
} from "@/features/photos/api/photosApi";
import {
  PHOTO_ALLOWED_EXTENSIONS,
  PHOTO_ALLOWED_MIME_TYPES,
  PHOTO_MAX_FILE_SIZE_BYTES,
  type PhotoUploadFormValues,
} from "@/features/photos/schemas/photoSchemas";
import type {
  PhotoListParams,
  UploadPhotoPayload,
} from "@/features/photos/types/photoTypes";

export const photoQueryKeys = {
  root: ["photos"] as const,
  lists: (plantId: number) =>
    [...photoQueryKeys.root, "list", plantId] as const,
  list: (plantId: number, params: PhotoListParams) =>
    [...photoQueryKeys.lists(plantId), params] as const,
};

function cleanString(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function assertAllowedFile(file: File): void {
  if (file.size <= 0) {
    throw new Error("Arquivo vazio não pode ser enviado.");
  }

  if (file.size > PHOTO_MAX_FILE_SIZE_BYTES) {
    throw new Error("A imagem selecionada excede o tamanho permitido.");
  }

  if (
    PHOTO_ALLOWED_MIME_TYPES.includes(
      file.type as (typeof PHOTO_ALLOWED_MIME_TYPES)[number],
    )
  ) {
    return;
  }

  const fileName = file.name.trim().toLowerCase();
  const hasAllowedExtension = PHOTO_ALLOWED_EXTENSIONS.some((extension) =>
    fileName.endsWith(extension),
  );

  if (!hasAllowedExtension) {
    throw new Error("Formato de imagem não permitido.");
  }
}

function toIsoWithLocalOffsetFromDateInput(value?: string): string {
  const normalized = value?.trim();
  const now = new Date();

  let date: Date;

  if (normalized) {
    const [year, month, day] = normalized.split("-").map(Number);

    if (!year || !month || !day) {
      throw new Error("Data da foto inválida.");
    }

    date = new Date(
      year,
      month - 1,
      day,
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
    );
  } else {
    date = now;
  }

  if (Number.isNaN(date.getTime())) {
    throw new Error("Data da foto inválida.");
  }

  const pad = (input: number) => String(input).padStart(2, "0");
  const timezoneOffsetMinutes = -date.getTimezoneOffset();
  const sign = timezoneOffsetMinutes >= 0 ? "+" : "-";
  const absoluteOffset = Math.abs(timezoneOffsetMinutes);
  const offsetHours = Math.floor(absoluteOffset / 60);
  const offsetMinutes = absoluteOffset % 60;

  return [
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`,
    `${sign}${pad(offsetHours)}:${pad(offsetMinutes)}`,
  ].join("");
}

export function normalizePhotoUploadFormValues(
  values: PhotoUploadFormValues,
): UploadPhotoPayload {
  const file = values.file.item(0);

  if (!file) {
    throw new Error("Arquivo não selecionado.");
  }

  assertAllowedFile(file);

  return {
    file,
    photo_type: "routine",
    caption: cleanString(values.caption),
    notes: cleanString(values.notes),
    taken_at: toIsoWithLocalOffsetFromDateInput(values.taken_at),
  };
}

export function toDateInputValue(value?: string | null): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (input: number) => String(input).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`;
}

export function usePlantPhotos(plantId: number, params: PhotoListParams) {
  return useQuery({
    queryKey: photoQueryKeys.list(plantId, params),
    queryFn: () => listPlantPhotos(plantId, params),
    enabled: plantId > 0,
    placeholderData: (previousData) => previousData,
  });
}

export function useUploadPlantPhotoMutation(plantId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UploadPhotoPayload) =>
      uploadPlantPhoto(plantId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: photoQueryKeys.lists(plantId),
      });
    },
  });
}

export function useDeletePlantPhotoMutation(plantId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (photoId: number) => deletePlantPhoto(plantId, photoId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: photoQueryKeys.lists(plantId),
      });
    },
  });
}

export function useDownloadPlantPhotoMutation(plantId: number) {
  return useMutation({
    mutationFn: (photoId: number) => downloadPlantPhoto(plantId, photoId),
  });
}
