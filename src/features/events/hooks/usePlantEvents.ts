import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createPlantEvent,
  listPlantEvents
} from "@/features/events/api/eventsApi";
import type { PlantEventFormValues } from "@/features/events/schemas/eventSchemas";
import type {
  CreatePlantEventPayload,
  PlantEventsParams
} from "@/features/events/types/eventTypes";

export const plantEventQueryKeys = {
  root: ["plant-events"] as const,
  lists: (plantId: number) =>
    [...plantEventQueryKeys.root, "list", plantId] as const,
  list: (plantId: number, params: PlantEventsParams) =>
    [...plantEventQueryKeys.lists(plantId), params] as const
};

function cleanString(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function parseMetadata(value: string | undefined): Record<string, unknown> | undefined {
  const normalized = value?.trim();

  if (!normalized) {
    return undefined;
  }

  const parsed = JSON.parse(normalized) as Record<string, unknown>;
  return parsed;
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

export function normalizePlantEventFormValues(
  values: PlantEventFormValues
): CreatePlantEventPayload {
  return {
    event_type: values.event_type.trim(),
    occurred_at: toIsoWithLocalOffset(values.occurred_at),
    title: values.title.trim(),
    description: cleanString(values.description),
    metadata_json: parseMetadata(values.metadata_json)
  };
}

export function usePlantEvents(plantId: number, params: PlantEventsParams) {
  return useQuery({
    queryKey: plantEventQueryKeys.list(plantId, params),
    queryFn: () => listPlantEvents(plantId, params),
    enabled: plantId > 0
  });
}

export function useCreatePlantEventMutation(plantId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePlantEventPayload) =>
      createPlantEvent(plantId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: plantEventQueryKeys.lists(plantId)
      });
    }
  });
}