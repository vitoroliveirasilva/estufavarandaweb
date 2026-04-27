import type { PaginationMeta } from "@/core/api/responseEnvelope";

export type PlantPhoto = {
  id: number;
  photo_type: string;
  caption: string | null;
  notes: string | null;
  taken_at: string | null;
  uploaded_at: string;
  download_url: string;
};

export type PhotoListParams = {
  page?: number;
  page_size?: number;
};

export type PaginatedPhotosResult = {
  items: PlantPhoto[];
  meta?: PaginationMeta;
};

export type UploadPhotoPayload = {
  file: File;
  photo_type?: string;
  caption?: string;
  notes?: string;
  taken_at?: string;
};

export type UploadPhotoResponse = {
  id: number;
  download_url: string;
};
