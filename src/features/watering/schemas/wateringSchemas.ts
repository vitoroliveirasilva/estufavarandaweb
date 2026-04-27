import { z } from "zod";

const MAX_NOTES_LENGTH = 500;
const MAX_QUANTITY_ML = 100_000;
const ALLOWED_FUTURE_DRIFT_MS = 5 * 60 * 1000;

function isValidDatetimeLocal(value: string): boolean {
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

function isNotTooFarInFuture(value: string): boolean {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return true;
  }

  return date.getTime() <= Date.now() + ALLOWED_FUTURE_DRIFT_MS;
}

export const wateringLogSchema = z.object({
  watered_at: z
    .string()
    .trim()
    .min(1, "Informe a data e hora da rega.")
    .refine(isValidDatetimeLocal, {
      message: "Informe uma data e hora válidas."
    })
    .refine(isNotTooFarInFuture, {
      message: "A data da rega não pode estar no futuro."
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
        return Number.isInteger(parsed) && parsed > 0 && parsed <= MAX_QUANTITY_ML;
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
});

export type WateringLogFormValues = z.infer<typeof wateringLogSchema>;

export const defaultWateringLogFormValues: WateringLogFormValues = {
  watered_at: "",
  quantity_ml: "",
  notes: ""
};
