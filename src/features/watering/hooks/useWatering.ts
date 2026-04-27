import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createWateringLog,
  getWateringSummary,
  listWateringLogs
} from "@/features/watering/api/wateringApi";
import type { WateringLogFormValues } from "@/features/watering/schemas/wateringSchemas";
import type {
  CreateWateringLogPayload,
  WateringLogsParams
} from "@/features/watering/types/wateringTypes";

export const wateringQueryKeys = {
  root: ["watering"] as const,
  lists: (plantId: number) =>
    [...wateringQueryKeys.root, "logs", plantId] as const,
  list: (plantId: number, params: WateringLogsParams) =>
    [...wateringQueryKeys.lists(plantId), params] as const,
  summary: (plantId: number) =>
    [...wateringQueryKeys.root, "summary", plantId] as const
};

function cleanString(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function parseQuantity(value: string | undefined): number | undefined {
  const normalized = value?.trim();

  if (!normalized) {
    return undefined;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function toIsoWithLocalOffset(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const pad = (input: number) => String(input).padStart(2, "0");
  const timezoneOffsetMinutes = -date.getTimezoneOffset();
  const sign = timezoneOffsetMinutes >= 0 ? "+" : "-";
  const absoluteOffset = Math.abs(timezoneOffsetMinutes);
  const offsetHours = Math.floor(absoluteOffset / 60);
  const offsetMinutes = absoluteOffset % 60;

  return [
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`,
    `${sign}${pad(offsetHours)}:${pad(offsetMinutes)}`
  ].join("");
}

export function normalizeWateringLogFormValues(
  values: WateringLogFormValues
): CreateWateringLogPayload {
  return {
    watered_at: toIsoWithLocalOffset(values.watered_at),
    quantity_ml: parseQuantity(values.quantity_ml),
    notes: cleanString(values.notes)
  };
}

export function toDatetimeLocalValue(value?: string | null): string {
  const date = value ? new Date(value) : new Date();

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (input: number) => String(input).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function useWateringLogs(plantId: number, params: WateringLogsParams) {
  return useQuery({
    queryKey: wateringQueryKeys.list(plantId, params),
    queryFn: () => listWateringLogs(plantId, params),
    enabled: plantId > 0
  });
}

export function useWateringSummary(plantId: number) {
  return useQuery({
    queryKey: wateringQueryKeys.summary(plantId),
    queryFn: () => getWateringSummary(plantId),
    enabled: plantId > 0
  });
}

export function useCreateWateringLogMutation(plantId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateWateringLogPayload) =>
      createWateringLog(plantId, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: wateringQueryKeys.lists(plantId)
        }),
        queryClient.invalidateQueries({
          queryKey: wateringQueryKeys.summary(plantId)
        })
      ]);
    }
  });
}