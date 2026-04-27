import { zodResolver } from "@hookform/resolvers/zod";
import { Bot, Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";

import {
    askAiSchema,
    defaultAskAiFormValues,
    type AskAiFormValues
} from "@/features/ai/schemas/aiSchemas";
import { FormErrorMessage } from "@/shared/components/FormErrorMessage";
import { Button } from "@/shared/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";

type AiQuestionFormProps = {
    isSubmitting?: boolean;
    apiErrorMessage?: string | null;
    onSubmit: (values: AskAiFormValues) => Promise<void> | void;
};

export function AiQuestionForm({
    isSubmitting = false,
    apiErrorMessage,
    onSubmit
}: AiQuestionFormProps) {
    const form = useForm<AskAiFormValues>({
        resolver: zodResolver(askAiSchema),
        defaultValues: defaultAskAiFormValues
    });

    const disabled = isSubmitting || form.formState.isSubmitting;

    const handleSubmit = form.handleSubmit(async (values) => {
        await onSubmit(values);
        form.reset(defaultAskAiFormValues);
    });

    return (
        <Card>
            <CardHeader>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                    <Bot className="h-6 w-6" />
                </div>
                <CardTitle>Perguntar para IA</CardTitle>
                <CardDescription>
                    Faça uma pergunta sobre a planta usando o contexto que a API já conhece.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                    {apiErrorMessage ? (
                        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                            {apiErrorMessage}
                        </div>
                    ) : null}

                    <div className="space-y-2">
                        <Label htmlFor="ai-question">Pergunta *</Label>
                        <textarea
                            id="ai-question"
                            rows={5}
                            placeholder="Minha planta está com folhas amareladas. O que pode ser?"
                            disabled={disabled}
                            className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background transition placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...form.register("question")}
                        />
                        <FormErrorMessage message={form.formState.errors.question?.message} />
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={disabled}>
                            {disabled ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Perguntando
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Enviar pergunta
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}