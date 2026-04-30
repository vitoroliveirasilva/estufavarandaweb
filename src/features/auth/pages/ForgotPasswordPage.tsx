import { zodResolver } from "@hookform/resolvers/zod";
import {
    ArrowLeft,
    CheckCircle2,
    KeyRound,
    Loader2,
    LockKeyhole,
    Mail,
    Send,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { getAppErrorMessage } from "@/core/api/apiError";
import { useForgotPasswordMutation } from "@/features/auth/hooks/useAuthActions";
import {
    forgotPasswordSchema,
    type ForgotPasswordFormValues
} from "@/features/auth/schemas/authSchemas";
import { FormErrorMessage } from "@/shared/components/FormErrorMessage";
import { Button } from "@/shared/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

const GENERIC_SUCCESS_MESSAGE =
    "Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.";

export function ForgotPasswordPage() {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const forgotPasswordMutation = useForgotPasswordMutation();

    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: ""
        },
        mode: "onTouched"
    });

    const isSubmitting =
        form.formState.isSubmitting || forgotPasswordMutation.isPending;

    const apiErrorMessage =
        !successMessage && forgotPasswordMutation.error
            ? getAppErrorMessage(forgotPasswordMutation.error)
            : null;

    const onSubmit = form.handleSubmit(async (values) => {
        setSuccessMessage(null);

        try {
            await forgotPasswordMutation.mutateAsync({
                email: values.email
            });

            setSuccessMessage(GENERIC_SUCCESS_MESSAGE);
            form.reset({
                email: ""
            });
        } catch {
            // O erro amigável aparece na tela pelo parser central.
        }
    });

    return (
        <Card className="mx-auto w-full max-w-md overflow-hidden border-border/70 bg-background shadow-sm">
            <CardHeader className="px-5 pb-1 pt-5 sm:px-6">
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                        <KeyRound className="h-5 w-5" aria-hidden="true" />
                    </span>

                    <div className="min-w-0">
                        <CardTitle className="text-xl font-semibold tracking-tight text-foreground">
                            Recuperar senha
                        </CardTitle>

                        <p className="text-sm leading-5 text-muted-foreground">
                            Receba instruções para voltar ao acesso
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-5 sm:p-6">
                <form className="space-y-5" onSubmit={onSubmit} noValidate>
                    {successMessage ? (
                        <div
                            aria-live="polite"
                            className="flex gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm leading-6 text-emerald-700 dark:text-emerald-300"
                            role="status"
                        >
                            <CheckCircle2
                                className="mt-1 h-4 w-4 shrink-0"
                                aria-hidden="true"
                            />
                            <span>{successMessage}</span>
                        </div>
                    ) : null}

                    {apiErrorMessage ? (
                        <div
                            aria-live="polite"
                            className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm leading-6 text-destructive"
                            role="alert"
                        >
                            {apiErrorMessage}
                        </div>
                    ) : null}

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>

                            <div className="relative">
                                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                <Input
                                    id="email"
                                    type="email"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    inputMode="email"
                                    placeholder="usuario@email.com"
                                    spellCheck={false}
                                    disabled={isSubmitting}
                                    aria-invalid={Boolean(form.formState.errors.email)}
                                    className="pl-11"
                                    {...form.register("email")}
                                />
                            </div>

                            <FormErrorMessage
                                message={form.formState.errors.email?.message}
                            />
                        </div>
                    </div>

                    <div className="flex items-start justify-start gap-2 rounded-2xl border border-border/70 bg-muted/20 px-4 py-3 text-start">
                        <p className="text-sm leading-6 text-muted-foreground">
                            Para sua segurança, a mensagem exibida será a mesma, mesmo que o e-mail não esteja cadastrado.
                        </p>
                    </div>

                    <Button
                        type="submit"
                        className="h-12 w-full rounded-2xl px-6 text-base font-semibold shadow-sm transition hover:shadow-md disabled:shadow-none"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2
                                    className="mr-2 h-4 w-4 animate-spin"
                                    aria-hidden="true"
                                />
                                Enviando
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                                Enviar instruções
                            </>
                        )}
                    </Button>

                    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-2xl border border-border/70 bg-muted/20 px-4 py-3 text-center text-sm text-muted-foreground">
                        <LockKeyhole
                            className="h-4 w-4 shrink-0 text-primary"
                            aria-hidden="true"
                        />

                        <span>Lembrou a senha?</span>

                        <Link
                            className="inline-flex items-center font-medium text-primary hover:underline"
                            to="/login"
                        >
                            <ArrowLeft className="mr-1.5 h-4 w-4" />
                            Voltar para login
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
