import { z } from "zod";

export const wateringLogSchema = z.object({
  watered_at: z.string().trim().min(1, "Informe a data e hora da rega."),
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
        return Number.isFinite(parsed) && parsed > 0;
      },
      {
        message: "Informe uma quantidade maior que zero."
      }
    ),
  notes: z.string().trim().optional()
});

export type WateringLogFormValues = z.infer<typeof wateringLogSchema>;

export const defaultWateringLogFormValues: WateringLogFormValues = {
  watered_at: "",
  quantity_ml: "",
  notes: ""
};