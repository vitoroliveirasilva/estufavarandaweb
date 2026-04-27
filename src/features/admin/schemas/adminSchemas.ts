import { z } from "zod";

export const adminCreateUserSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome."),
  email: z
    .string()
    .trim()
    .min(1, "Informe o e-mail.")
    .email("Informe um e-mail válido."),
  password: z
    .string()
    .min(1, "Informe a senha.")
    .min(8, "A senha deve ter pelo menos 8 caracteres."),
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
