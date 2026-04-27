import { z } from "zod";

function parseMetadataJson(value: string | undefined): boolean {
  const normalized = value?.trim();

  if (!normalized) {
    return true;
  }

  try {
    const parsed = JSON.parse(normalized);
    return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed);
  } catch {
    return false;
  }
}

export const plantEventSchema = z.object({
  event_type: z.string().trim().min(1, "Informe o tipo do evento."),
  occurred_at: z.string().trim().min(1, "Informe a data e hora do evento."),
  title: z.string().trim().min(1, "Informe o título do evento."),
  description: z.string().trim().optional(),
  metadata_json: z
    .string()
    .trim()
    .optional()
    .refine(parseMetadataJson, {
      message: "Informe um JSON válido em formato de objeto."
    })
});

export type PlantEventFormValues = z.infer<typeof plantEventSchema>;

export const defaultPlantEventFormValues: PlantEventFormValues = {
  event_type: "observation",
  occurred_at: "",
  title: "",
  description: "",
  metadata_json: ""
};