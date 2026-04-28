import { z } from "zod";

const MAX_SHORT_TEXT_LENGTH = 120;
const MAX_LOCATION_TEXT_LENGTH = 160;
const MAX_NOTES_LENGTH = 2_000;

const optionalText = (maxLength: number) =>
  z.string().trim().max(maxLength, `Use no máximo ${maxLength} caracteres.`).optional();

export const plantFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Informe o nome da planta.")
    .max(MAX_SHORT_TEXT_LENGTH, "Use no máximo 120 caracteres."),
  nickname: optionalText(MAX_SHORT_TEXT_LENGTH),
  environment: optionalText(MAX_SHORT_TEXT_LENGTH),
  light_exposure: optionalText(MAX_SHORT_TEXT_LENGTH),
  ventilation: optionalText(MAX_SHORT_TEXT_LENGTH),
  location_label: optionalText(MAX_LOCATION_TEXT_LENGTH),
  city_name: optionalText(MAX_LOCATION_TEXT_LENGTH),
  notes: optionalText(MAX_NOTES_LENGTH),
  health_status: optionalText(MAX_SHORT_TEXT_LENGTH),
  species_profile_id: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => {
        if (!value) {
          return true;
        }

        const parsed = Number(value);
        return Number.isInteger(parsed) && parsed > 0;
      },
      {
        message: "Informe um ID de espécie válido."
      }
    )
});

export type PlantFormValues = z.infer<typeof plantFormSchema>;

export const defaultPlantFormValues: PlantFormValues = {
  name: "",
  nickname: "",
  environment: "",
  light_exposure: "",
  ventilation: "",
  location_label: "",
  city_name: "",
  notes: "",
  health_status: "",
  species_profile_id: ""
};
