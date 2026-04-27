import { z } from "zod";

const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

export const adminCreateUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Informe o nome.")
    .max(
      MAX_NAME_LENGTH,
      `O nome deve ter no máximo ${MAX_NAME_LENGTH} caracteres.`,
    ),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Informe o e-mail.")
    .max(
      MAX_EMAIL_LENGTH,
      `O e-mail deve ter no máximo ${MAX_EMAIL_LENGTH} caracteres.`,
    )
    .email("Informe um e-mail válido."),
  password: z
    .string()
    .min(1, "Informe a senha.")
    .min(
      MIN_PASSWORD_LENGTH,
      `A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`,
    )
    .max(
      MAX_PASSWORD_LENGTH,
      `A senha deve ter no máximo ${MAX_PASSWORD_LENGTH} caracteres.`,
    ),
  is_admin: z.boolean(),
  is_active: z.boolean(),
});

export type AdminCreateUserFormValues = z.infer<typeof adminCreateUserSchema>;

export const defaultAdminCreateUserFormValues: AdminCreateUserFormValues = {
  name: "",
  email: "",
  password: "",
  is_admin: false,
  is_active: true,
};
