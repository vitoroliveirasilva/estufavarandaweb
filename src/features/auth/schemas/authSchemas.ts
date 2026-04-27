import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Informe seu e-mail.")
    .email("Informe um e-mail válido."),
  password: z.string().min(1, "Informe sua senha."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Informe seu e-mail.")
    .email("Informe um e-mail válido."),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().trim().min(1, "Informe o token de redefinição."),
    new_password: z
      .string()
      .min(1, "Informe a nova senha.")
      .min(8, "A senha deve ter pelo menos 8 caracteres."),
    confirm_password: z.string().min(1, "Confirme a nova senha."),
  })
  .refine((value) => value.new_password === value.confirm_password, {
    path: ["confirm_password"],
    message: "As senhas precisam ser iguais.",
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
