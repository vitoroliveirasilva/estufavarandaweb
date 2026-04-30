import { zodResolver } from "@hookform/resolvers/zod";
import {
    ArrowLeft,
    CheckCircle2,
    KeyRound,
    Loader2,
    LockKeyhole,
    RotateCcw,
    ShieldCheck,
    TriangleAlert
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";

import { getAppErrorMessage } from "@/core/api/apiError";
import { useResetPasswordMutation } from "@/features/auth/hooks/useAuthActions";
import {
    resetPasswordSchema,
    type ResetPasswordFormValues
} from "@/features/auth/schemas/authSchemas";
import { AppPasswordInput } from "@/shared/components/AppPasswordInput";
import { FormErrorMessage } from "@/shared/components/FormErrorMessage";
import { Button } from "@/shared/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";

function removeResetTokenFromCurrentUrl(): void {
    if (typeof window === "undefined") {
        return;
    }

    const url = new URL(window.location.href);

    if (!url.searchParams.has("token")) {
        return;
    }

    url.searchParams.delete("token");
    window.history.replaceState(
        window.history.state,
        "",
        `${url.pathname}${url.search}${url.hash}`
    );
}

export function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const [initialToken] = useState(() => searchParams.get("token") ?? "");
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const resetPasswordMutation = useResetPasswordMutation();

    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            token: initialToken,
            new_password: "",
            confirm_password: ""
        },
        mode: "onTouched"
    });

    useEffect(() => {
        if (initialToken) {
            removeResetTokenFromCurrentUrl();
        }
    }, [initialToken]);

    const isSubmitting =
        form.formState.isSubmitting || resetPasswordMutation.isPending;

    const hasToken = Boolean(initialToken.trim());

    const apiErrorMessage =
        !successMessage && resetPasswordMutation.error
            ? getAppErrorMessage(resetPasswordMutation.error)
            : null;

    const onSubmit = form.handleSubmit(async (values) => {
        setSuccessMessage(null);

        try {
            const response = await resetPasswordMutation.mutateAsync({
                token: values.token,
                new_password: values.new_password
            });

            setSuccessMessage(response.message);
            form.reset({
                token: "",
                new_password: "",
                confirm_password: ""
            });
        } catch {
            // O erro amigável aparece na tela pelo parser central.
        }
    });

    return (
        <Card className="mx-auto w-full max-w-md overflow-hidden border-border/70 bg-background shadow-sm">
            <CardHeader className="px-5 pb-0 pt-5 sm:px-6">
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                        <KeyRound className="h-5 w-5" aria-hidden="true" />
                    </span>

                    <div className="min-w-0">
                        <CardTitle className="text-xl font-semibold tracking-tight text-foreground">
                            Redefinir senha
                        </CardTitle>

                        <p className="text-sm leading-5 text-muted-foreground">
                            Crie uma nova senha para recuperar seu acesso
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-5 pb-5 pt-3 sm:px-6 sm:pb-6 sm:pt-3">
                <form className="space-y-4" onSubmit={onSubmit} noValidate>
                    <input type="hidden" {...form.register("token")} />

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

                    {!hasToken && !successMessage ? (
                        <div
                            aria-live="polite"
                            className="flex gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm leading-6 text-amber-700 dark:text-amber-300"
                            role="alert"
                        >
                            <TriangleAlert
                                className="mt-1 h-4 w-4 shrink-0"
                                aria-hidden="true"
                            />
                            <span>
                                O link de redefinição está inválido ou incompleto. Solicite
                                uma nova recuperação de senha.
                            </span>
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
                            <Label htmlFor="new_password">Nova senha</Label>

                            <div className="relative">
                                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                <AppPasswordInput
                                    id="new_password"
                                    autoComplete="new-password"
                                    placeholder="Mínimo de 8 caracteres"
                                    disabled={isSubmitting || !hasToken || Boolean(successMessage)}
                                    aria-invalid={Boolean(
                                        form.formState.errors.new_password
                                    )}
                                    className="pl-11"
                                    {...form.register("new_password")}
                                />
                            </div>

                            <FormErrorMessage
                                message={form.formState.errors.new_password?.message}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirm_password">
                                Confirmar nova senha
                            </Label>

                            <div className="relative">
                                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                <AppPasswordInput
                                    id="confirm_password"
                                    autoComplete="new-password"
                                    placeholder="Repita a nova senha"
                                    disabled={isSubmitting || !hasToken || Boolean(successMessage)}
                                    aria-invalid={Boolean(
                                        form.formState.errors.confirm_password
                                    )}
                                    className="pl-11"
                                    {...form.register("confirm_password")}
                                />
                            </div>

                            <FormErrorMessage
                                message={
                                    form.formState.errors.confirm_password?.message
                                }
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 rounded-2xl border border-border/70 bg-muted/20 px-4 py-3 text-center">
                        <ShieldCheck
                            className="h-4 w-4 shrink-0 text-primary"
                            aria-hidden="true"
                        />

                        <p className="text-sm leading-6 text-muted-foreground">
                            Use uma senha segura e diferente da anterior.
                        </p>
                    </div>

                    <Button
                        type="submit"
                        className="h-12 w-full rounded-2xl px-6 text-base font-semibold shadow-sm transition hover:shadow-md disabled:shadow-none"
                        disabled={isSubmitting || !hasToken || Boolean(successMessage)}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2
                                    className="mr-2 h-4 w-4 animate-spin"
                                    aria-hidden="true"
                                />
                                Redefinindo
                            </>
                        ) : (
                            <>
                                <RotateCcw
                                    className="mr-2 h-4 w-4"
                                    aria-hidden="true"
                                />
                                Redefinir senha
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
