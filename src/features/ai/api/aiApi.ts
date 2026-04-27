import { apiClient } from "@/core/api/apiClient";
import { unwrapEnvelope, type ApiEnvelope } from "@/core/api/responseEnvelope";
import type {
  AiConversation,
  AiConversationsParams,
  AskAiPayload,
  AskAiResponse,
  PaginatedAiConversationsResult,
} from "@/features/ai/types/aiTypes";

function cleanParams(
  params: AiConversationsParams,
): Record<string, string | number | boolean> {
  const cleaned: Record<string, string | number | boolean> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    cleaned[key] = value;
  });

  return cleaned;
}

export async function askPlantAi(
  plantId: number,
  payload: AskAiPayload,
): Promise<AskAiResponse> {
  const response = await apiClient.post<ApiEnvelope<AskAiResponse>>(
    `/plants/${plantId}/ai/ask`,
    payload,
  );

  return unwrapEnvelope(response.data);
}

export async function listAiConversations(
  plantId: number,
  params: AiConversationsParams = {},
): Promise<PaginatedAiConversationsResult> {
  const response = await apiClient.get<ApiEnvelope<AiConversation[]>>(
    `/plants/${plantId}/ai/conversations`,
    {
      params: cleanParams(params),
    },
  );

  return {
    items: unwrapEnvelope(response.data),
    meta: response.data.meta,
  };
}
