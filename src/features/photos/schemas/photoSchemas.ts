import { z } from "zod";

export const PHOTO_ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const PHOTO_ACCEPT_ATTRIBUTE = PHOTO_ALLOWED_MIME_TYPES.join(",");
export const PHOTO_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
export const PHOTO_MAX_FILE_SIZE_LABEL = "10 MB";

export const PHOTO_ALLOWED_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
] as const;
const MAX_PHOTO_TYPE_LENGTH = 64;
const MAX_CAPTION_LENGTH = 160;
const MAX_NOTES_LENGTH = 2_000;

function getFirstFile(value: FileList | undefined): File | null {
  return value && value.length > 0 ? value.item(0) : null;
}

function hasFile(value: FileList | undefined): boolean {
  return getFirstFile(value) !== null;
}

function hasAllowedFileType(value: FileList | undefined): boolean {
  const file = getFirstFile(value);

  if (!file) {
    return false;
  }

  if (
    PHOTO_ALLOWED_MIME_TYPES.includes(
      file.type as (typeof PHOTO_ALLOWED_MIME_TYPES)[number],
    )
  ) {
    return true;
  }

  const fileName = file.name.trim().toLowerCase();
  return PHOTO_ALLOWED_EXTENSIONS.some((extension) =>
    fileName.endsWith(extension),
  );
}

function hasAllowedFileSize(value: FileList | undefined): boolean {
  const file = getFirstFile(value);
  return Boolean(
    file && file.size > 0 && file.size <= PHOTO_MAX_FILE_SIZE_BYTES,
  );
}

function isValidDatetimeLocal(value: string | undefined): boolean {
  const normalized = value?.trim();

  if (!normalized) {
    return true;
  }

  const date = new Date(normalized);
  return !Number.isNaN(date.getTime());
}

export const photoUploadSchema = z.object({
  file: z
    .custom<FileList>()
    .refine(hasFile, "Selecione uma imagem para enviar.")
    .refine(hasAllowedFileType, "Envie uma imagem JPG, PNG, WEBP ou GIF.")
    .refine(
      hasAllowedFileSize,
      `A imagem deve ter até ${PHOTO_MAX_FILE_SIZE_LABEL}.`,
    ),
  photo_type: z
    .string()
    .trim()
    .max(
      MAX_PHOTO_TYPE_LENGTH,
      `O tipo deve ter no máximo ${MAX_PHOTO_TYPE_LENGTH} caracteres.`,
    )
    .optional(),
  caption: z
    .string()
    .trim()
    .max(
      MAX_CAPTION_LENGTH,
      `A legenda deve ter no máximo ${MAX_CAPTION_LENGTH} caracteres.`,
    )
    .optional(),
  notes: z
    .string()
    .trim()
    .max(
      MAX_NOTES_LENGTH,
      `As notas devem ter no máximo ${MAX_NOTES_LENGTH} caracteres.`,
    )
    .optional(),
  taken_at: z
    .string()
    .trim()
    .refine(isValidDatetimeLocal, "Informe uma data válida.")
    .optional(),
});

export type PhotoUploadFormValues = z.infer<typeof photoUploadSchema>;

export const defaultPhotoUploadFormValues: Omit<PhotoUploadFormValues, "file"> =
  {
    photo_type: "routine",
    caption: "",
    notes: "",
    taken_at: "",
  };
