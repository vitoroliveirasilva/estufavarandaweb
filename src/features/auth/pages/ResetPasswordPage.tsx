import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";

import { getAppErrorMessage } from "@/core/api/apiError";
import { useResetPasswordMutation } from "@/features/auth/hooks/useAuthActions";
import {
    resetPasswordSchema,
    type ResetPasswordFormValues,
} from "@/features/auth/schemas/authSchemas";
import { AppPasswordInput } from "@/shared/components/AppPasswordInput";
import { FormErrorMessage } from "@/shared/components/FormErrorMessage";
import { Button } from "@/shared/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
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
        `${url.pathname}${url.search}${url.hash}`,
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
            confirm_password: "",
        },
    });

    useEffect(() => {
        if (initialToken) {
            removeResetTokenFromCurrentUrl();
        }
    }, [initialToken]);

    const isSubmitting =
        form.formState.isSubmitting || resetPasswordMutation.isPending;

    const apiErrorMessage =
        !successMessage && resetPasswordMutation.error
            ? getAppErrorMessage(resetPasswordMutation.error)
            : null;

    const onSubmit = form.handleSubmit(async (values) => {
        setSuccessMessage(null);

        try {
            const response = await resetPasswordMutation.mutateAsync({
                token: values.token,
                new_password: values.new_password,
            });

            setSuccessMessage(response.message);
            form.reset({
                token: "",
                new_password: "",
                confirm_password: "",
            });
        } catch {
            // O erro amigável aparece na tela pelo parser central.
        }
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Redefinir senha</CardTitle>
                <CardDescription>
                    Informe o token recebido e crie uma nova senha com pelo menos 8
                    caracteres.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form className="space-y-5" onSubmit={onSubmit} noValidate>
                    {successMessage ? (
                        <div
                            aria-live="polite"
                            className="flex gap-3 rounded-xl border border-primary/25 bg-primary/10 px-4 py-3 text-sm text-primary"
                            role="status"
                        >
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>{successMessage}</span>
                        </div>
                    ) : null}

                    {apiErrorMessage ? (
                        <div
                            aria-live="polite"
                            className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                            role="alert"
                        >
                            {apiErrorMessage}
                        </div>
                    ) : null}

                    <div className="space-y-2">
                        <Label htmlFor="token">Token</Label>
                        <Input
                            id="token"
                            autoCapitalize="none"
                            autoComplete="off"
                            placeholder="TOKEN_AQUI"
                            spellCheck={false}
                            disabled={isSubmitting}
                            {...form.register("token")}
                        />
                        <FormErrorMessage message={form.formState.errors.token?.message} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="new_password">Nova senha</Label>
                        <AppPasswordInput
                            id="new_password"
                            autoComplete="new-password"
                            placeholder="Mínimo de 8 caracteres"
                            disabled={isSubmitting}
                            {...form.register("new_password")}
                        />
                        <FormErrorMessage
                            message={form.formState.errors.new_password?.message}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirm_password">Confirmar nova senha</Label>
                        <AppPasswordInput
                            id="confirm_password"
                            autoComplete="new-password"
                            placeholder="Repita a senha"
                            disabled={isSubmitting}
                            {...form.register("confirm_password")}
                        />
                        <FormErrorMessage
                            message={form.formState.errors.confirm_password?.message}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Redefinindo
                            </>
                        ) : (
                            "Redefinir senha"
                        )}
                    </Button>

                    <div className="text-center text-sm">
                        <Link className="text-primary hover:underline" to="/login">
                            Voltar para login
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}