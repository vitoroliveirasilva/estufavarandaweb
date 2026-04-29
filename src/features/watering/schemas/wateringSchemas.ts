import { z } from "zod";

const MAX_NOTES_LENGTH = 500;
const MAX_QUANTITY_ML = 100_000;
const ALLOWED_FUTURE_DRIFT_MS = 5 * 60 * 1000;

function isValidDateInput(value: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(value.trim());
}

function isValidTimeInput(value: string): boolean {
    return /^\d{2}:\d{2}$/.test(value.trim());
}

function buildDateTime(dateValue: string, timeValue: string): Date | null {
    const date = dateValue.trim();
    const time = timeValue.trim();

    if (!isValidDateInput(date) || !isValidTimeInput(time)) {
        return null;
    }

    const parsed = new Date(`${date}T${time}:00`);

    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export const wateringLogSchema = z
    .object({
        watered_date: z
            .string()
            .trim()
            .min(1, "Informe a data da rega.")
            .refine(isValidDateInput, {
                message: "Informe uma data válida."
            }),
        watered_time: z
            .string()
            .trim()
            .min(1, "Informe o horário da rega.")
            .refine(isValidTimeInput, {
                message: "Informe um horário válido."
            }),
        quantity_ml: z
            .string()
            .trim()
            .optional()
            .refine(
                (value) => {
                    if (!value) {
                        return true;
                    }

                    const parsed = Number(value);
                    return (
                        Number.isInteger(parsed) &&
                        parsed > 0 &&
                        parsed <= MAX_QUANTITY_ML
                    );
                },
                {
                    message: `Informe uma quantidade inteira entre 1 e ${MAX_QUANTITY_ML.toLocaleString(
                        "pt-BR"
                    )} ml.`
                }
            ),
        notes: z
            .string()
            .trim()
            .max(MAX_NOTES_LENGTH, `Use no máximo ${MAX_NOTES_LENGTH} caracteres.`)
            .optional()
    })
    .superRefine((values, context) => {
        const date = buildDateTime(values.watered_date, values.watered_time);

        if (!date) {
            return;
        }

        if (date.getTime() > Date.now() + ALLOWED_FUTURE_DRIFT_MS) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["watered_time"],
                message: "A data e hora da rega não podem estar no futuro."
            });
        }
    });

export type WateringLogFormValues = z.infer<typeof wateringLogSchema>;

export const defaultWateringLogFormValues: WateringLogFormValues = {
    watered_date: "",
    watered_time: "",
    quantity_ml: "",
    notes: ""
};
