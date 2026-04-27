import { z } from "zod";

const EMAIL_MAX_LENGTH = 254;
const PASSWORD_MAX_LENGTH = 128;
const RESET_TOKEN_MAX_LENGTH = 4096;

const emailSchema = z
  .string()
  .trim()
  .min(1, "Informe seu e-mail.")
  .max(EMAIL_MAX_LENGTH, "Informe um e-mail com até 254 caracteres.")
  .email("Informe um e-mail válido.");

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, "Informe sua senha.")
    .max(PASSWORD_MAX_LENGTH, "Informe uma senha com até 128 caracteres."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z
      .string()
      .trim()
      .min(1, "Informe o token de redefinição.")
      .max(RESET_TOKEN_MAX_LENGTH, "Informe um token válido."),
    new_password: z
      .string()
      .min(1, "Informe a nova senha.")
      .min(8, "A senha deve ter pelo menos 8 caracteres.")
      .max(PASSWORD_MAX_LENGTH, "Informe uma senha com até 128 caracteres."),
    confirm_password: z.string().min(1, "Confirme a nova senha."),
  })
  .refine((value) => value.new_password === value.confirm_password, {
    path: ["confirm_password"],
    message: "As senhas precisam ser iguais.",
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
