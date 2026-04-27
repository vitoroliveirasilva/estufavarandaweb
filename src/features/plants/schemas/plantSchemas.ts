import { z } from "zod";

export const plantFormSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome da planta."),
  nickname: z.string().trim().optional(),
  environment: z.string().trim().optional(),
  light_exposure: z.string().trim().optional(),
  ventilation: z.string().trim().optional(),
  location_label: z.string().trim().optional(),
  city_name: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  health_status: z.string().trim().optional(),
  species_profile_id: z.string().trim().optional()
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