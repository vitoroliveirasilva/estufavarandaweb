import { z } from "zod";

const MAX_EVENT_TYPE_LENGTH = 64;
const MAX_TITLE_LENGTH = 140;
const MAX_DESCRIPTION_LENGTH = 2_000;
const MAX_METADATA_LENGTH = 5_000;

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

function isValidDatetimeLocal(value: string): boolean {
  const normalized = value.trim();

  if (!normalized) {
    return false;
  }

  const parsed = new Date(normalized);
  return !Number.isNaN(parsed.getTime());
}

export const plantEventSchema = z.object({
  event_type: z
    .string()
    .trim()
    .min(1, "Informe o tipo do evento.")
    .max(MAX_EVENT_TYPE_LENGTH, "O tipo deve ter no máximo 64 caracteres.")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Use apenas letras, números, hífen ou underline no tipo."
    ),
  occurred_at: z
    .string()
    .trim()
    .min(1, "Informe a data e hora do evento.")
    .refine(isValidDatetimeLocal, {
      message: "Informe uma data e hora válida."
    }),
  title: z
    .string()
    .trim()
    .min(1, "Informe o título do evento.")
    .max(MAX_TITLE_LENGTH, "O título deve ter no máximo 140 caracteres."),
  description: z
    .string()
    .trim()
    .max(MAX_DESCRIPTION_LENGTH, "A descrição deve ter no máximo 2.000 caracteres.")
    .optional(),
  metadata_json: z
    .string()
    .trim()
    .max(MAX_METADATA_LENGTH, "Os metadados devem ter no máximo 5.000 caracteres.")
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
