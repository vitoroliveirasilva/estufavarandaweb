import type { PaginationMeta } from "@/core/api/responseEnvelope";

export type SpeciesProfile = {
  id: number;
  common_name: string;
  scientific_name: string | null;
  light_preference: string | null;
  watering_frequency_days: number | null;
  ideal_humidity_min: number | null;
  ideal_humidity_max: number | null;
  ideal_temp_min: number | null;
  ideal_temp_max: number | null;
  substrate_notes: string | null;
  general_notes: string | null;
  common_symptoms: string | null;
  is_active: boolean;
};

export type SpeciesListParams = {
  page?: number;
  page_size?: number;
  search?: string;
  active_only?: boolean;
};

export type PaginatedSpeciesResult = {
  items: SpeciesProfile[];
  meta?: PaginationMeta;
};
