import type { PaginationMeta } from "@/core/api/responseEnvelope";

export type JsonPrimitive = string | number | boolean | null;

export type JsonObject = {
    [key: string]: JsonValue;
};

export type JsonValue = JsonPrimitive | JsonValue[] | JsonObject;

export type AskAiPayload = {
    question: string;
};

export type AiConsideredContext = JsonObject;

export type AiAnswerPayload = {
    answer: string;
    confidence?: "low" | "medium" | "high" | string;
    considered_context?: AiConsideredContext;
};

export type AskAiResponse = {
    [key: string]: JsonValue | undefined;
    answer?: string;
    resposta?: string;
    message?: string;
    recommendation?: string;
    summary?: string;
    diagnosis?: string;
    confidence?: "low" | "medium" | "high" | string;
    considered_context?: AiConsideredContext;
    conversation_id?: number;
};

export type AiMessageRole = "system" | "user" | "assistant" | string;

export type AiConversationMessage = {
    id?: number;
    role: AiMessageRole;
    content: string;
    created_at?: string;
    metadata_json?: JsonObject | null;
};

export type AiConversation = {
    id: number;
    title?: string | null;
    question?: string | null;
    answer?: AiAnswerPayload | JsonValue | null;
    response?: AiAnswerPayload | AskAiResponse | null;
    messages: AiConversationMessage[];
    created_at: string;
    updated_at: string;
};

export type AiConversationsParams = {
    page?: number;
    page_size?: number;
};

export type PaginatedAiConversationsResult = {
    items: AiConversation[];
    meta?: PaginationMeta;
};
