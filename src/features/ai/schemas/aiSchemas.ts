import { z } from "zod";

export const ASK_AI_QUESTION_MIN_LENGTH = 5;
export const ASK_AI_QUESTION_MAX_LENGTH = 2_000;

export const askAiSchema = z.object({
  question: z
    .string({ required_error: "Informe sua pergunta." })
    .trim()
    .min(1, "Informe sua pergunta.")
    .min(
      ASK_AI_QUESTION_MIN_LENGTH,
      "Descreva um pouco melhor sua dúvida."
    )
    .max(
      ASK_AI_QUESTION_MAX_LENGTH,
      `A pergunta deve ter no máximo ${ASK_AI_QUESTION_MAX_LENGTH} caracteres.`
    )
});

export type AskAiFormValues = z.infer<typeof askAiSchema>;

export const defaultAskAiFormValues: AskAiFormValues = {
  question: ""
};