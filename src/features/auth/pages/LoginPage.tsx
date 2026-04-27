import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { getAppErrorMessage } from "@/core/api/apiError";
import { useLoginMutation } from "@/features/auth/hooks/useAuthActions";
import {
    loginSchema,
    type LoginFormValues
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

function getRedirectPath(state: unknown): string {
    if (typeof state !== "object" || state === null) {
        return "/app";
    }

    const from = (state as {
        from?: {
            pathname?: string;
            search?: string;
            hash?: string;
        };
    }).from;

    if (!from?.pathname || from.pathname.startsWith("/login")) {
        return "/app";
    }

    return `${from.pathname}${from.search ?? ""}${from.hash ?? ""}`;
}

export function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const loginMutation = useLoginMutation();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const isSubmitting = form.formState.isSubmitting || loginMutation.isPending;
    const apiErrorMessage = loginMutation.error
        ? getAppErrorMessage(loginMutation.error)
        : null;

    const onSubmit = form.handleSubmit(async (values) => {
        try {
            await loginMutation.mutateAsync({
                email: values.email,
                password: values.password,
                device_name: "Web"
            });

            navigate(getRedirectPath(location.state), { replace: true });
        } catch {
            // O erro é exibido pela mutation, sem logar dados sensíveis.
        }
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Entrar</CardTitle>
                <CardDescription>
                    Acesse sua Estufa da Varanda para acompanhar plantas, regas e cuidados.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form className="space-y-5" onSubmit={onSubmit} noValidate>
                    {apiErrorMessage ? (
                        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                            {apiErrorMessage}
                        </div>
                    ) : null}

                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="usuario@email.com"
                            disabled={isSubmitting}
                            {...form.register("email")}
                        />
                        <FormErrorMessage message={form.formState.errors.email?.message} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <AppPasswordInput
                            id="password"
                            autoComplete="current-password"
                            placeholder="Sua senha"
                            disabled={isSubmitting}
                            {...form.register("password")}
                        />
                        <FormErrorMessage message={form.formState.errors.password?.message} />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Entrando
                            </>
                        ) : (
                            "Entrar"
                        )}
                    </Button>

                    <div className="flex flex-col gap-2 text-center text-sm text-muted-foreground">
                        <Link className="text-primary hover:underline" to="/forgot-password">
                            Esqueci minha senha
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}