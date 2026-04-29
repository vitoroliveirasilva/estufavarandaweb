import { zodResolver } from "@hookform/resolvers/zod";
import {
    Clock3,
    Loader2,
    LockKeyhole,
    MessageSquareText,
    Send,
    Sparkles
} from "lucide-react";
import { useForm } from "react-hook-form";

import {
    ASK_AI_QUESTION_MAX_LENGTH,
    askAiSchema,
    defaultAskAiFormValues,
    type AskAiFormValues
} from "@/features/ai/schemas/aiSchemas";
import { FormErrorMessage } from "@/shared/components/FormErrorMessage";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";

type AiQuestionFormProps = {
    isSubmitting?: boolean;
    apiErrorMessage?: string | null;
    onSubmit: (values: AskAiFormValues) => Promise<void> | void;
};

const questionSuggestions = [
    "Minha planta está com folhas amareladas. O que pode ser?",
    "Com base no histórico, devo mudar a frequência de rega?",
    "Quais sinais devo observar nos próximos dias?"
] as const;

function formatNow(): string {
    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short"
    }).format(new Date());
}

export function AiQuestionForm({
    isSubmitting = false,
    apiErrorMessage,
    onSubmit
}: AiQuestionFormProps) {
    const form = useForm<AskAiFormValues>({
        resolver: zodResolver(askAiSchema),
        defaultValues: defaultAskAiFormValues,
        mode: "onTouched"
    });

    const watchedQuestion = form.watch("question") ?? "";
    const hasQuestion = watchedQuestion.trim().length > 0;
    const questionLength = watchedQuestion.length;
    const disabled = isSubmitting || form.formState.isSubmitting;
    const questionError = form.formState.errors.question?.message;

    const handleSubmit = form.handleSubmit(async (values) => {
        try {
            await onSubmit(values);

            form.reset(defaultAskAiFormValues, {
                keepDefaultValues: true
            });
        } catch {
            // A mensagem é exibida pelo apiErrorMessage.
        }
    });

    function applySuggestion(question: string) {
        form.setValue("question", question, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true
        });
    }

    return (
        <form
            className="border-t border-border/70 bg-background/95 p-4 backdrop-blur"
            onSubmit={handleSubmit}
            noValidate
        >
            {apiErrorMessage ? (
                <div
                    className="mb-3 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                    role="alert"
                >
                    {apiErrorMessage}
                </div>
            ) : null}

            <div className="mb-3 flex flex-wrap gap-2">
                {questionSuggestions.map((suggestion) => (
                    <button
                        key={suggestion}
                        type="button"
                        disabled={disabled}
                        className="rounded-full border border-border/70 bg-card px-3 py-1.5 text-left text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-70"
                        onClick={() => applySuggestion(suggestion)}
                    >
                        {suggestion}
                    </button>
                ))}
            </div>

            <div className="rounded-3xl border border-border/70 bg-card p-3 shadow-sm">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-1">
                    <Label
                        htmlFor="ai-question"
                        className="flex items-center gap-2 text-sm font-medium text-foreground"
                    >
                        <MessageSquareText className="h-4 w-4 text-primary" />
                        Sua mensagem
                    </Label>

                    <span className="text-xs text-muted-foreground" aria-live="polite">
                        {questionLength}/{ASK_AI_QUESTION_MAX_LENGTH}
                    </span>
                </div>

                <textarea
                    id="ai-question"
                    rows={3}
                    maxLength={ASK_AI_QUESTION_MAX_LENGTH}
                    placeholder="Digite sua pergunta sobre a planta..."
                    disabled={disabled}
                    aria-invalid={Boolean(questionError)}
                    className="min-h-24 w-full resize-y rounded-2xl border border-input bg-background px-4 py-3 text-sm leading-7 text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:border-primary/40 focus:border-primary/60 focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-70"
                    {...form.register("question")}
                />

                <FormErrorMessage message={questionError} />

                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span className="inline-flex items-center rounded-full border border-border/70 bg-background px-2.5 py-1">
                            <LockKeyhole className="mr-1.5 h-3.5 w-3.5 text-primary" />
                            Conversa privada
                        </span>

                        <span className="inline-flex items-center rounded-full border border-border/70 bg-background px-2.5 py-1">
                            <Clock3 className="mr-1.5 h-3.5 w-3.5 text-primary" />
                            {formatNow()}
                        </span>

                        <span className="inline-flex items-center rounded-full border border-border/70 bg-background px-2.5 py-1">
                            <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" />
                            Use sintomas e contexto
                        </span>
                    </div>

                    <Button
                        type="submit"
                        disabled={disabled || !hasQuestion}
                        className="h-11 w-full rounded-2xl px-6 text-sm font-semibold shadow-sm transition hover:shadow-md disabled:shadow-none sm:w-auto"
                    >
                        {disabled ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Enviando
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                Enviar
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </form>
    );
}
