import type { PaginationMeta } from "@/core/api/responseEnvelope";

export type AskAiPayload = {
  question: string;
};

export type AskAiResponse = Record<string, unknown>;

export type AiConversation = {
  id: number;
  title: string;
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