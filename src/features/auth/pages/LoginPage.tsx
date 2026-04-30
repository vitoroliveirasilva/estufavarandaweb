import { zodResolver } from "@hookform/resolvers/zod";
import {
    KeyRound,
    Loader2,
    LockKeyhole,
    LogIn,
    Mail,
    Sprout
} from "lucide-react";
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
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

const DEFAULT_AUTHENTICATED_PATH = "/app";
const BLOCKED_PUBLIC_REDIRECT_PREFIXES = [
    "/login",
    "/forgot-password",
    "/reset-password"
] as const;

type RedirectState = {
    from?: {
        pathname?: unknown;
        search?: unknown;
        hash?: unknown;
    };
};

function isSafeInternalPath(pathname: string): boolean {
    return (
        pathname.startsWith("/") &&
        !pathname.startsWith("//") &&
        !pathname.includes("\\") &&
        !BLOCKED_PUBLIC_REDIRECT_PREFIXES.some((prefix) =>
            pathname.startsWith(prefix)
        )
    );
}

function normalizeUrlPart(value: unknown, prefix: "?" | "#"): string {
    return typeof value === "string" && value.startsWith(prefix) ? value : "";
}

function getRedirectPath(state: unknown): string {
    if (typeof state !== "object" || state === null) {
        return DEFAULT_AUTHENTICATED_PATH;
    }

    const from = (state as RedirectState).from;

    if (typeof from?.pathname !== "string") {
        return DEFAULT_AUTHENTICATED_PATH;
    }

    if (!isSafeInternalPath(from.pathname)) {
        return DEFAULT_AUTHENTICATED_PATH;
    }

    return `${from.pathname}${normalizeUrlPart(from.search, "?")}${normalizeUrlPart(
        from.hash,
        "#"
    )}`;
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
        },
        mode: "onTouched"
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
        <Card className="mx-auto w-full max-w-md overflow-hidden border-border/70 bg-background shadow-sm">
            <CardHeader className="px-5 pb-1 pt-5 sm:px-6">
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                        <Sprout className="h-5 w-5" aria-hidden="true" />
                    </span>

                    <div className="min-w-0">
                        <CardTitle className="text-xl font-semibold tracking-tight text-foreground">
                            Entrar
                        </CardTitle>

                        <p className="text-sm leading-5 text-muted-foreground">
                            Acesse sua estufa
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-5 sm:p-6">
                <form className="space-y-5" onSubmit={onSubmit} noValidate>
                    {apiErrorMessage ? (
                        <div
                            aria-live="polite"
                            className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
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

                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>

                            <div className="relative">
                                <KeyRound className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                <AppPasswordInput
                                    id="password"
                                    autoComplete="current-password"
                                    placeholder="Sua senha"
                                    disabled={isSubmitting}
                                    aria-invalid={Boolean(form.formState.errors.password)}
                                    className="pl-11"
                                    {...form.register("password")}
                                />
                            </div>

                            <FormErrorMessage
                                message={form.formState.errors.password?.message}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="h-12 w-full rounded-2xl px-6 text-base font-semibold shadow-sm transition hover:shadow-md disabled:shadow-none"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Entrando
                            </>
                        ) : (
                            <>
                                <LogIn className="mr-2 h-4 w-4" />
                                Entrar
                            </>
                        )}
                    </Button>

                    <div className="rounded-2xl border border-border/70 bg-muted/20 px-4 py-3 text-center text-sm text-muted-foreground">
                        <LockKeyhole className="mr-1.5 inline h-4 w-4 text-primary" />
                        Esqueceu a senha?{" "}
                        <Link
                            className="font-medium text-primary hover:underline"
                            to="/forgot-password"
                        >
                            Recuperar acesso
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
