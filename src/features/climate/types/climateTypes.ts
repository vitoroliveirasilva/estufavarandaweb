export type ClimateSnapshot = {
  id: number;
  recorded_at: string;
  temperature_c: number | null;
  humidity_percent: number | null;
  rain_mm: number | null;
  feels_like_c: number | null;
  uv_index: number | null;
  city_name: string | null;
};

export type ClimateSummary = Record<string, unknown>;

export type PlantClimateParams = {
  limit?: number;
};