import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { askPlantAi, listAiConversations } from "@/features/ai/api/aiApi";
import type { AskAiFormValues } from "@/features/ai/schemas/aiSchemas";
import type {
  AiConversationsParams,
  AskAiPayload,
} from "@/features/ai/types/aiTypes";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0;
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

export const plantAiQueryKeys = {
  root: ["plant-ai"] as const,
  conversations: (plantId: number) =>
    [...plantAiQueryKeys.root, "conversations", plantId] as const,
  conversationList: (
    plantId: number,
    params: Required<AiConversationsParams>,
  ) => [...plantAiQueryKeys.conversations(plantId), params] as const,
};

export function normalizeAiConversationsParams(
  params: AiConversationsParams = {},
): Required<AiConversationsParams> {
  return {
    page: normalizePositiveInteger(params.page, DEFAULT_PAGE),
    page_size: normalizePositiveInteger(
      params.page_size,
      DEFAULT_PAGE_SIZE,
      MAX_PAGE_SIZE,
    ),
  };
}

export function normalizeAskAiFormValues(
  values: AskAiFormValues,
): AskAiPayload {
  return {
    question: values.question.trim(),
  };
}

export function useAiConversations(
  plantId: number,
  params: AiConversationsParams = {},
  enabled = true,
) {
  const normalizedParams = normalizeAiConversationsParams(params);

  return useQuery({
    queryKey: plantAiQueryKeys.conversationList(plantId, normalizedParams),
    queryFn: () => listAiConversations(plantId, normalizedParams),
    enabled: enabled && isPositiveInteger(plantId),
    placeholderData: keepPreviousData,
  });
}

export function useAskPlantAiMutation(plantId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AskAiPayload) => {
      if (!isPositiveInteger(plantId)) {
        throw new Error("Planta inválida.");
      }

      return askPlantAi(plantId, payload);
    },
    onSuccess: async () => {
      if (!isPositiveInteger(plantId)) {
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: plantAiQueryKeys.conversations(plantId),
      });
    },
  });
}
