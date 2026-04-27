import { z } from "zod";

function hasFile(value: FileList | undefined): boolean {
  return Boolean(value && value.length > 0 && value.item(0));
}

export const photoUploadSchema = z.object({
  file: z
    .custom<FileList>()
    .refine(hasFile, "Selecione uma imagem para enviar."),
  photo_type: z.string().trim().optional(),
  caption: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  taken_at: z.string().trim().optional(),
});

export type PhotoUploadFormValues = z.infer<typeof photoUploadSchema>;

export const defaultPhotoUploadFormValues: Omit<PhotoUploadFormValues, "file"> =
  {
    photo_type: "routine",
    caption: "",
    notes: "",
    taken_at: "",
  };
