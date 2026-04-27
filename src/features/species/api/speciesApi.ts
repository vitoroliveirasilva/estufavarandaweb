import { apiClient } from "@/core/api/apiClient";
import { unwrapEnvelope, type ApiEnvelope } from "@/core/api/responseEnvelope";
import type {
  PaginatedSpeciesResult,
  SpeciesListParams,
  SpeciesProfile
} from "@/features/species/types/speciesTypes";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
const MAX_SEARCH_LENGTH = 120;

type RequestParams = Record<string, string | number | boolean>;

function isPositiveInteger(value: unknown): value is number {
  return Number.isInteger(value) && Number(value) > 0;
}

function toPositiveInteger(value: unknown, fallback: number): number {
  if (typeof value === "number" && isPositiveInteger(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return isPositiveInteger(parsed) ? parsed : fallback;
  }

  return fallback;
}

function normalizeSearch(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim().replace(/\s+/g, " ");

  if (!normalized) {
    return undefined;
  }

  return normalized.slice(0, MAX_SEARCH_LENGTH);
}

export function normalizeSpeciesListParams(
  params: SpeciesListParams = {}
): Required<Pick<SpeciesListParams, "page" | "page_size">> &
  Pick<SpeciesListParams, "search" | "active_only"> {
  const page = toPositiveInteger(params.page, DEFAULT_PAGE);
  const requestedPageSize = toPositiveInteger(
    params.page_size,
    DEFAULT_PAGE_SIZE
  );

  return {
    page,
    page_size: Math.min(requestedPageSize, MAX_PAGE_SIZE),
    search: normalizeSearch(params.search),
    active_only:
      typeof params.active_only === "boolean" ? params.active_only : undefined
  };
}

function cleanParams(params: SpeciesListParams): RequestParams {
  const normalized = normalizeSpeciesListParams(params);
  const cleaned: RequestParams = {
    page: normalized.page,
    page_size: normalized.page_size
  };

  if (normalized.search) {
    cleaned.search = normalized.search;
  }

  if (typeof normalized.active_only === "boolean") {
    cleaned.active_only = normalized.active_only;
  }

  return cleaned;
}

function assertValidSpeciesId(speciesId: number): void {
  if (!isPositiveInteger(speciesId)) {
    throw new Error("ID da espécie inválido.");
  }
}

export async function listSpecies(
  params: SpeciesListParams = {}
): Promise<PaginatedSpeciesResult> {
  const response = await apiClient.get<ApiEnvelope<SpeciesProfile[]>>(
    "/species",
    {
      params: cleanParams(params)
    }
  );

  return {
    items: unwrapEnvelope(response.data),
    meta: response.data.meta
  };
}

export async function getSpecies(speciesId: number): Promise<SpeciesProfile> {
  assertValidSpeciesId(speciesId);

  const response = await apiClient.get<ApiEnvelope<SpeciesProfile>>(
    `/species/${speciesId}`
  );

  return unwrapEnvelope(response.data);
}
