import type { PaginationMeta } from "@/core/api/responseEnvelope";

export type WateringLog = {
  id: number;
  watered_at: string;
  quantity_ml: number | null;
  notes: string | null;
};

export type WateringLogsParams = {
  page?: number;
  page_size?: number;
};

export type PaginatedWateringLogsResult = {
  items: WateringLog[];
  meta?: PaginationMeta;
};

export type CreateWateringLogPayload = {
  watered_at: string;
  quantity_ml?: number;
  notes?: string;
};

export type CreateWateringLogResponse = {
  id: number;
};

export type WateringSummary = Record<string, unknown>;
