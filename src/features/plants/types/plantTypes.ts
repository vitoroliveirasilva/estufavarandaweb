import type { PaginationMeta } from "@/core/api/responseEnvelope";

export type SpeciesProfileSummary = {
  id: number;
  common_name: string;
};

export type KnownPlantHealthStatus =
  | "healthy"
  | "attention"
  | "recovering"
  | "critical";

export type PlantHealthStatus = KnownPlantHealthStatus | (string & {});

export type PlantListItem = {
  id: number;
  name: string;
  nickname: string | null;
  health_status: PlantHealthStatus | null;
  location_label: string | null;
  city_name: string | null;
  archived_at: string | null;
  species_profile: SpeciesProfileSummary | null;
};

export type PlantDetail = PlantListItem & {
  species_profile_id?: number | null;
  environment?: string | null;
  light_exposure?: string | null;
  ventilation?: string | null;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  [key: string]: unknown;
};

export type PlantListParams = {
  page?: number;
  page_size?: number;
  include_archived?: boolean;
  archived?: boolean;
  health_status?: string;
  species_profile_id?: number;
  search?: string;
};

export type PaginatedPlantsResult = {
  items: PlantListItem[];
  meta?: PaginationMeta;
};

export type PlantCreatePayload = {
  name: string;
  nickname?: string;
  environment?: string;
  light_exposure?: string;
  ventilation?: string;
  location_label?: string;
  city_name?: string;
  notes?: string;
  health_status?: string;
  species_profile_id?: number;
};

export type PlantUpdatePayload = Partial<PlantCreatePayload>;

export type PlantCreateResponse = {
  id: number;
  name: string;
};

export type PlantUpdateResponse = {
  id: number;
  name: string;
  health_status: string | null;
  archived_at: string | null;
};
