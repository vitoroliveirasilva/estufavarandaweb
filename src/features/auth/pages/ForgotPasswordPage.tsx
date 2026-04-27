import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { getAppErrorMessage } from "@/core/api/apiError";
import { useForgotPasswordMutation } from "@/features/auth/hooks/useAuthActions";
import {
    forgotPasswordSchema,
    type ForgotPasswordFormValues,
} from "@/features/auth/schemas/authSchemas";
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

const GENERIC_SUCCESS_MESSAGE =
    "Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.";

export function ForgotPasswordPage() {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const forgotPasswordMutation = useForgotPasswordMutation();

    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
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
                email: values.email,
            });

            setSuccessMessage(GENERIC_SUCCESS_MESSAGE);
            form.reset({
                email: "",
            });
        } catch {
            // O erro amigável aparece na tela pelo parser central.
        }
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recuperar senha</CardTitle>
                <CardDescription>
                    Informe seu e-mail e enviaremos as instruções, caso exista uma conta
                    cadastrada.
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
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                            id="email"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            inputMode="email"
                            placeholder="usuario@email.com"
                            spellCheck={false}
                            disabled={isSubmitting}
                            {...form.register("email")}
                        />
                        <FormErrorMessage message={form.formState.errors.email?.message} />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Enviando
                            </>
                        ) : (
                            "Enviar instruções"
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