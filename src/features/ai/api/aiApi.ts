import { apiClient } from "@/core/api/apiClient";
import {
  isApiEnvelope,
  unwrapEnvelope,
  type PaginationMeta,
} from "@/core/api/responseEnvelope";
import type {
  AiAnswerPayload,
  AiConversation,
  AiConversationMessage,
  AiConversationsParams,
  AskAiPayload,
  AskAiResponse,
  JsonObject,
  JsonValue,
  PaginatedAiConversationsResult,
} from "@/features/ai/types/aiTypes";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
const MIN_QUESTION_LENGTH = 5;
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
  max?: number,
): number {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }

  return typeof max === "number" ? Math.min(parsed, max) : parsed;
}

function normalizeTotal(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function cleanParams(
  params: AiConversationsParams = {},
): Record<string, QueryParamValue> {
  return {
    page: normalizePositiveInteger(params.page, DEFAULT_PAGE),
    page_size: normalizePositiveInteger(
      params.page_size,
      DEFAULT_PAGE_SIZE,
      MAX_PAGE_SIZE,
    ),
  };
}

function normalizePayload(payload: AskAiPayload): AskAiPayload {
  const question =
    typeof payload.question === "string" ? payload.question.trim() : "";

  if (question.length < MIN_QUESTION_LENGTH) {
    throw new Error(
      `Informe uma pergunta com pelo menos ${MIN_QUESTION_LENGTH} caracteres.`,
    );
  }

  if (question.length > MAX_QUESTION_LENGTH) {
    throw new Error(
      `A pergunta deve ter no máximo ${MAX_QUESTION_LENGTH} caracteres.`,
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

function asJsonValue(value: unknown): JsonValue | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (isJsonValue(value)) {
    return value;
  }

  return String(value);
}

function asJsonObject(value: unknown): JsonObject | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const result: JsonObject = {};

  for (const [key, item] of Object.entries(value)) {
    const normalized = asJsonValue(item);

    if (normalized !== undefined) {
      result[key] = normalized;
    }
  }

  return result;
}

function getStringValue(
  record: Record<string, unknown>,
  keys: readonly string[],
): string | undefined {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

function getRawValue(
  record: Record<string, unknown>,
  keys: readonly string[],
): unknown {
  for (const key of keys) {
    const value = record[key];

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return undefined;
}

function asAskResponse(value: unknown): AskAiResponse | null {
  if (!isRecord(value)) {
    return null;
  }

  return Object.entries(value).reduce<AskAiResponse>((acc, [key, item]) => {
    const normalized = asJsonValue(item);
    acc[key] = normalized ?? null;
    return acc;
  }, {});
}

function asAnswerPayload(value: unknown): AiAnswerPayload | null {
  if (!isRecord(value)) {
    return null;
  }

  const answer = getStringValue(value, [
    "answer",
    "resposta",
    "message",
    "mensagem",
    "recommendation",
    "recomendacao",
    "summary",
    "resumo",
    "diagnosis",
    "diagnostico",
  ]);

  if (!answer) {
    return null;
  }

  const confidenceValue = value.confidence ?? value.confianca;
  const consideredContext =
    asJsonObject(value.considered_context) ??
    asJsonObject(value.consideredContext) ??
    asJsonObject(value.contexto_considerado);

  return {
    answer,
    confidence:
      typeof confidenceValue === "string" ? confidenceValue : undefined,
    considered_context: consideredContext,
  };
}

function extractTextFromValue(value: unknown): string | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value === "string") {
    return value.trim() || null;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    const parts = value
      .map(extractTextFromValue)
      .filter((item): item is string => Boolean(item));

    return parts.length ? parts.join("\n") : null;
  }

  if (isRecord(value)) {
    const preferredKeys = [
      "answer",
      "resposta",
      "message",
      "mensagem",
      "recommendation",
      "recomendacao",
      "summary",
      "resumo",
      "diagnosis",
      "diagnostico",
    ];

    for (const key of preferredKeys) {
      const text = extractTextFromValue(value[key]);

      if (text) {
        return text;
      }
    }
  }

  return null;
}

function normalizeAskResponse(payload: unknown): AskAiResponse {
  const unwrapped = unwrapEnvelope<unknown>(payload);

  if (isRecord(unwrapped)) {
    return Object.entries(unwrapped).reduce<AskAiResponse>(
      (acc, [key, value]) => {
        const normalized = asJsonValue(value);
        acc[key] = normalized ?? null;
        return acc;
      },
      {},
    );
  }

  if (typeof unwrapped === "string") {
    return { answer: unwrapped };
  }

  return {
    answer:
      unwrapped === null || unwrapped === undefined ? "" : String(unwrapped),
  };
}

function extractItems(payload: unknown): unknown[] {
  const unwrapped = unwrapEnvelope<unknown>(payload);

  if (Array.isArray(unwrapped)) {
    return unwrapped;
  }

  if (
    isRecord(unwrapped) &&
    Array.isArray((unwrapped as PaginatedObject).items)
  ) {
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
    MAX_PAGE_SIZE,
  );
  const total = normalizeTotal(meta.total);
  const totalPages = normalizePositiveInteger(
    meta.total_pages,
    Math.max(1, Math.ceil(total / pageSize)),
  );

  return {
    page,
    page_size: pageSize,
    total,
    total_pages: totalPages,
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

function normalizeMessage(value: unknown): AiConversationMessage | null {
  if (!isRecord(value)) {
    return null;
  }

  const role =
    typeof value.role === "string" && value.role.trim()
      ? value.role.trim()
      : "assistant";

  const content = getStringValue(value, [
    "content",
    "message",
    "text",
    "body",
    "answer",
    "question",
  ]);

  if (!content) {
    return null;
  }

  const id = Number(value.id);
  const createdAt =
    typeof value.created_at === "string"
      ? value.created_at
      : typeof value.createdAt === "string"
        ? value.createdAt
        : undefined;

  return {
    id: Number.isInteger(id) && id > 0 ? id : undefined,
    role,
    content,
    created_at: createdAt,
    metadata_json:
      asJsonObject(value.metadata_json) ?? asJsonObject(value.metadata) ?? null,
  };
}

function sortMessages(
  messages: AiConversationMessage[],
): AiConversationMessage[] {
  return [...messages].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;

    if (dateA !== dateB) {
      return dateA - dateB;
    }

    return (a.id ?? 0) - (b.id ?? 0);
  });
}

function normalizeMessages(value: unknown): AiConversationMessage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return sortMessages(
    value
      .map(normalizeMessage)
      .filter((item): item is AiConversationMessage => item !== null),
  );
}

function buildFallbackMessages({
  question,
  answerText,
  answerPayload,
  createdAt,
  updatedAt,
}: {
  question?: string;
  answerText?: string | null;
  answerPayload?: AiAnswerPayload | null;
  createdAt: string;
  updatedAt: string;
}): AiConversationMessage[] {
  const messages: AiConversationMessage[] = [];

  if (question) {
    messages.push({
      role: "user",
      content: question,
      created_at: createdAt,
      metadata_json: null,
    });
  }

  if (answerText) {
    messages.push({
      role: "assistant",
      content: answerText,
      created_at: updatedAt || createdAt,
      metadata_json: {
        confidence: answerPayload?.confidence ?? "low",
        considered_context: answerPayload?.considered_context ?? {},
      },
    });
  }

  return messages;
}

function normalizeConversation(value: unknown): AiConversation | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = Number(value.id);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  const question = getStringValue(value, [
    "question",
    "prompt",
    "user_message",
    "userMessage",
    "last_question",
    "lastQuestion",
  ]);

  const title =
    getStringValue(value, ["title", "name"]) ?? question ?? `Conversa #${id}`;

  const createdAt =
    typeof value.created_at === "string"
      ? value.created_at
      : typeof value.createdAt === "string"
        ? value.createdAt
        : "";

  const updatedAt =
    typeof value.updated_at === "string"
      ? value.updated_at
      : typeof value.updatedAt === "string"
        ? value.updatedAt
        : createdAt;

  const rawAnswer = getRawValue(value, [
    "answer",
    "resposta",
    "assistant_message",
    "assistantMessage",
    "last_answer",
    "lastAnswer",
  ]);

  const rawResponse = getRawValue(value, [
    "response",
    "ai_response",
    "aiResponse",
    "result",
  ]);

  const answerPayload =
    asAnswerPayload(rawAnswer) ?? asAnswerPayload(rawResponse);

  const response =
    asAnswerPayload(rawResponse) ??
    asAskResponse(rawResponse) ??
    asAnswerPayload(rawAnswer) ??
    null;

  const answer = answerPayload ?? asJsonValue(rawAnswer) ?? null;

  const normalizedMessages = normalizeMessages(
    getRawValue(value, ["messages", "items", "entries"]),
  );

  const answerText =
    extractTextFromValue(rawResponse) ?? extractTextFromValue(rawAnswer);

  const messages = normalizedMessages.length
    ? normalizedMessages
    : buildFallbackMessages({
        question,
        answerText,
        answerPayload,
        createdAt,
        updatedAt,
      });

  return {
    id,
    title,
    question: question ?? null,
    answer,
    response,
    messages,
    created_at: createdAt,
    updated_at: updatedAt,
  };
}

export async function askPlantAi(
  plantId: number,
  payload: AskAiPayload,
): Promise<AskAiResponse> {
  assertPositiveInteger(plantId, "Planta");

  const response = await apiClient.post<unknown>(
    `/plants/${plantId}/ai/ask`,
    normalizePayload(payload),
  );

  return normalizeAskResponse(response.data);
}

export async function listAiConversations(
  plantId: number,
  params: AiConversationsParams = {},
): Promise<PaginatedAiConversationsResult> {
  assertPositiveInteger(plantId, "Planta");

  const response = await apiClient.get<unknown>(
    `/plants/${plantId}/ai/conversations`,
    {
      params: cleanParams(params),
    },
  );

  return {
    items: extractItems(response.data)
      .map(normalizeConversation)
      .filter((item): item is AiConversation => item !== null),
    meta: extractMeta(response.data),
  };
}
