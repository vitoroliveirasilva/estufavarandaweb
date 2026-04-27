import type { PaginationMeta } from "@/core/api/responseEnvelope";

export type PlantEvent = {
  id: number;
  event_type: string;
  occurred_at: string;
  title: string;
  description: string | null;
  metadata_json: Record<string, unknown> | null;
};

export type PlantEventsParams = {
  page?: number;
  page_size?: number;
  event_type?: string;
};

export type PaginatedPlantEventsResult = {
  items: PlantEvent[];
  meta?: PaginationMeta;
};

export type CreatePlantEventPayload = {
  event_type: string;
  occurred_at: string;
  title: string;
  description?: string;
  metadata_json?: Record<string, unknown>;
};

export type CreatePlantEventResponse = {
  id: number;
};