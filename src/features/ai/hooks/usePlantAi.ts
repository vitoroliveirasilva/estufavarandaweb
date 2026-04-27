import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  askPlantAi,
  listAiConversations
} from "@/features/ai/api/aiApi";
import type { AskAiFormValues } from "@/features/ai/schemas/aiSchemas";
import type {
  AiConversationsParams,
  AskAiPayload
} from "@/features/ai/types/aiTypes";

export const plantAiQueryKeys = {
  root: ["plant-ai"] as const,
  conversations: (plantId: number) =>
    [...plantAiQueryKeys.root, "conversations", plantId] as const,
  conversationList: (plantId: number, params: AiConversationsParams) =>
    [...plantAiQueryKeys.conversations(plantId), params] as const
};

export function normalizeAskAiFormValues(values: AskAiFormValues): AskAiPayload {
  return {
    question: values.question.trim()
  };
}

export function useAiConversations(
  plantId: number,
  params: AiConversationsParams
) {
  return useQuery({
    queryKey: plantAiQueryKeys.conversationList(plantId, params),
    queryFn: () => listAiConversations(plantId, params),
    enabled: plantId > 0
  });
}

export function useAskPlantAiMutation(plantId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AskAiPayload) => askPlantAi(plantId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: plantAiQueryKeys.conversations(plantId)
      });
    }
  });
}