import { z } from "zod";

export const EVENT_TYPE_OPTIONS = [
    { value: "observation", label: "Observação" },
    { value: "watering", label: "Rega" },
    { value: "fertilization", label: "Adubação" },
    { value: "repotting", label: "Replantio" },
    { value: "pruning", label: "Poda" },
    { value: "location_change", label: "Mudança de local" },
    { value: "bloom", label: "Floração" },
    { value: "new_growth", label: "Novo crescimento" },
    { value: "wilt", label: "Murcha" },
    { value: "yellow_leaves", label: "Folhas amarelas" },
    { value: "pest", label: "Praga" }
] as const;

const MAX_TITLE_LENGTH = 140;
const MAX_DESCRIPTION_LENGTH = 2_000;
const MAX_METADATA_FIELD_LENGTH = 180;

function isValidDatetimeLocal(value: string): boolean {
    const normalized = value.trim();

    if (!normalized) {
        return false;
    }

    const parsed = new Date(normalized);
    return !Number.isNaN(parsed.getTime());
}

function isKnownEventType(value: string): boolean {
    return EVENT_TYPE_OPTIONS.some((option) => option.value === value);
}

const optionalText = (maxLength: number, message: string) =>
    z.string().trim().max(maxLength, message).optional();

export const plantEventSchema = z.object({
    event_type: z
        .string()
        .trim()
        .min(1, "Informe o tipo do evento.")
        .refine(isKnownEventType, {
            message: "Selecione um tipo de evento válido."
        }),
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
    metadata_detail: optionalText(
        MAX_METADATA_FIELD_LENGTH,
        "O detalhe deve ter no máximo 180 caracteres."
    ),
    metadata_result: optionalText(
        MAX_METADATA_FIELD_LENGTH,
        "O resultado deve ter no máximo 180 caracteres."
    ),
    metadata_amount: optionalText(
        MAX_METADATA_FIELD_LENGTH,
        "A quantidade deve ter no máximo 180 caracteres."
    ),
    metadata_unit: optionalText(
        MAX_METADATA_FIELD_LENGTH,
        "A unidade deve ter no máximo 180 caracteres."
    )
});

export type PlantEventFormValues = z.infer<typeof plantEventSchema>;

export const defaultPlantEventFormValues: PlantEventFormValues = {
    event_type: "observation",
    occurred_at: "",
    title: "",
    description: "",
    metadata_detail: "",
    metadata_result: "",
    metadata_amount: "",
    metadata_unit: ""
};
