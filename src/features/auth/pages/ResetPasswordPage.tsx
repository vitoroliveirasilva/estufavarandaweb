import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
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
    CardDescription,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

export function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const resetPasswordMutation = useResetPasswordMutation();

    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            token: searchParams.get("token") ?? "",
            new_password: "",
            confirm_password: ""
        }
    });

    const isSubmitting =
        form.formState.isSubmitting || resetPasswordMutation.isPending;

    const apiErrorMessage = resetPasswordMutation.error
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
                token: values.token,
                new_password: "",
                confirm_password: ""
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
                        <div className="flex gap-3 rounded-xl border border-primary/25 bg-primary/10 px-4 py-3 text-sm text-primary">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>{successMessage}</span>
                        </div>
                    ) : null}

                    {apiErrorMessage ? (
                        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                            {apiErrorMessage}
                        </div>
                    ) : null}

                    <div className="space-y-2">
                        <Label htmlFor="token">Token</Label>
                        <Input
                            id="token"
                            autoComplete="off"
                            placeholder="TOKEN_AQUI"
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