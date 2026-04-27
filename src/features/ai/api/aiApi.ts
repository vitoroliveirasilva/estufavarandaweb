import { apiClient } from "@/core/api/apiClient";
import {
  isApiEnvelope,
  unwrapEnvelope,
  type PaginationMeta
} from "@/core/api/responseEnvelope";
import type {
  AiConversation,
  AiConversationsParams,
  AskAiPayload,
  AskAiResponse,
  JsonValue,
  PaginatedAiConversationsResult
} from "@/features/ai/types/aiTypes";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
const MAX_QUESTION_LENGTH = 2_000;

type QueryParamValue = string | number | boolean;

type PaginatedObject = {
  items?: unknown;
  meta?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertPositiveInteger(value: number, fieldName: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${fieldName} inválido.`);
  }
}

function normalizePositiveInteger(
  value: unknown,
  fallback: number,
  max?: number
): number {
  const numberValue = Number(value);

  if (!Number.isInteger(numberValue) || numberValue <= 0) {
    return fallback;
  }

  return typeof max === "number" ? Math.min(numberValue, max) : numberValue;
}

function normalizeTotal(value: unknown): number {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue >= 0 ? numberValue : 0;
}

function cleanParams(
  params: AiConversationsParams = {}
): Record<string, QueryParamValue> {
  return {
    page: normalizePositiveInteger(params.page, DEFAULT_PAGE),
    page_size: normalizePositiveInteger(
      params.page_size,
      DEFAULT_PAGE_SIZE,
      MAX_PAGE_SIZE
    )
  };
}

function normalizePayload(payload: AskAiPayload): AskAiPayload {
  const question = typeof payload.question === "string" ? payload.question.trim() : "";

  if (question.length < 5) {
    throw new Error("Informe uma pergunta com pelo menos 5 caracteres.");
  }

  if (question.length > MAX_QUESTION_LENGTH) {
    throw new Error(
      `A pergunta deve ter no máximo ${MAX_QUESTION_LENGTH} caracteres.`
    );
  }

  return { question };
}

function isJsonValue(value: unknown): value is JsonValue {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every(isJsonValue);
  }

  if (isRecord(value)) {
    return Object.values(value).every(isJsonValue);
  }

  return false;
}

function normalizeAskResponse(payload: unknown): AskAiResponse {
  const unwrapped = unwrapEnvelope<unknown>(payload);

  if (isRecord(unwrapped)) {
    return Object.entries(unwrapped).reduce<AskAiResponse>((acc, [key, value]) => {
      acc[key] = isJsonValue(value) ? value : String(value);
      return acc;
    }, {});
  }

  if (typeof unwrapped === "string") {
    return { resposta: unwrapped };
  }

  return {
    resposta:
      unwrapped === null || unwrapped === undefined ? "" : String(unwrapped)
  };
}

function extractItems(payload: unknown): unknown[] {
  const unwrapped = unwrapEnvelope<unknown>(payload);

  if (Array.isArray(unwrapped)) {
    return unwrapped;
  }

  if (isRecord(unwrapped) && Array.isArray((unwrapped as PaginatedObject).items)) {
    return (unwrapped as { items: unknown[] }).items;
  }

  return [];
}

function normalizeMeta(meta: unknown): PaginationMeta | undefined {
  if (!isRecord(meta)) {
    return undefined;
  }

  const page = normalizePositiveInteger(meta.page, DEFAULT_PAGE);
  const pageSize = normalizePositiveInteger(
    meta.page_size,
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE
  );
  const total = normalizeTotal(meta.total);
  const totalPages = normalizePositiveInteger(
    meta.total_pages,
    Math.max(1, Math.ceil(total / pageSize))
  );

  return {
    page,
    page_size: pageSize,
    total,
    total_pages: totalPages
  };
}

function extractMeta(payload: unknown): PaginationMeta | undefined {
  if (isApiEnvelope(payload)) {
    const envelopeMeta = normalizeMeta(payload.meta);

    if (envelopeMeta) {
      return envelopeMeta;
    }
  }

  const unwrapped = unwrapEnvelope<unknown>(payload);

  if (isRecord(unwrapped)) {
    return normalizeMeta((unwrapped as PaginatedObject).meta);
  }

  return undefined;
}

function normalizeConversation(value: unknown): AiConversation | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = Number(value.id);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  const title =
    typeof value.title === "string" && value.title.trim().length > 0
      ? value.title.trim()
      : `Conversa #${id}`;

  const createdAt =
    typeof value.created_at === "string" ? value.created_at : "";
  const updatedAt =
    typeof value.updated_at === "string" ? value.updated_at : createdAt;

  return {
    id,
    title,
    created_at: createdAt,
    updated_at: updatedAt
  };
}

export async function askPlantAi(
  plantId: number,
  payload: AskAiPayload
): Promise<AskAiResponse> {
  assertPositiveInteger(plantId, "Planta");

  const response = await apiClient.post<unknown>(
    `/plants/${plantId}/ai/ask`,
    normalizePayload(payload)
  );

  return normalizeAskResponse(response.data);
}

export async function listAiConversations(
  plantId: number,
  params: AiConversationsParams = {}
): Promise<PaginatedAiConversationsResult> {
  assertPositiveInteger(plantId, "Planta");

  const response = await apiClient.get<unknown>(
    `/plants/${plantId}/ai/conversations`,
    {
      params: cleanParams(params)
    }
  );

  return {
    items: extractItems(response.data)
      .map(normalizeConversation)
      .filter((item): item is AiConversation => item !== null),
    meta: extractMeta(response.data)
  };
}
