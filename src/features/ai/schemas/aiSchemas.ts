import { z } from "zod";

export const askAiSchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, "Informe sua pergunta.")
    .min(5, "Descreva um pouco melhor sua dúvida.")
});

export type AskAiFormValues = z.infer<typeof askAiSchema>;

export const defaultAskAiFormValues: AskAiFormValues = {
  question: ""
};