import { zodResolver } from "@hookform/resolvers/zod";
import {
    KeyRound,
    Loader2,
    Mail,
    Power,
    ShieldCheck,
    UserPlus,
    UserRound
} from "lucide-react";
import { useForm } from "react-hook-form";

import {
    adminCreateUserSchema,
    defaultAdminCreateUserFormValues,
    type AdminCreateUserFormValues
} from "@/features/admin/schemas/adminSchemas";
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

type AdminUserCreateFormProps = {
    isSubmitting?: boolean;
    apiErrorMessage?: string | null;
    onSubmit: (values: AdminCreateUserFormValues) => Promise<void> | void;
};

function FieldIcon({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/5 text-primary">
            {children}
        </div>
    );
}

export function AdminUserCreateForm({
    isSubmitting = false,
    apiErrorMessage,
    onSubmit
}: AdminUserCreateFormProps) {
    const form = useForm<AdminCreateUserFormValues>({
        resolver: zodResolver(adminCreateUserSchema),
        defaultValues: defaultAdminCreateUserFormValues,
        mode: "onTouched"
    });

    const disabled = isSubmitting || form.formState.isSubmitting;
    const isAdminSelected = form.watch("is_admin");
    const isActiveSelected = form.watch("is_active");

    const handleSubmit = form.handleSubmit(async (values) => {
        try {
            await onSubmit(values);
            form.reset(defaultAdminCreateUserFormValues);
        } catch {
            // O erro é exibido pelo apiErrorMessage.
        }
    });

    return (
        <Card className="overflow-hidden border-border/70 bg-card shadow-sm">
            <CardHeader className="border-b bg-muted/20 pb-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-background text-primary shadow-sm">
                        <UserPlus className="h-5 w-5" aria-hidden="true" />
                    </div>

                    <div className="min-w-0 space-y-1">
                        <CardTitle className="text-lg">Criar usuário</CardTitle>
                        <CardDescription className="leading-6">
                            Cadastre um usuário comum ou administrativo para acessar o sistema.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-4">
                <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit} noValidate>
                    {apiErrorMessage ? (
                        <div
                            className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive md:col-span-2"
                            role="alert"
                            aria-live="polite"
                        >
                            {apiErrorMessage}
                        </div>
                    ) : null}

                    <div className="space-y-2">
                        <Label htmlFor="admin-name">Nome *</Label>

                        <div className="flex items-center gap-3">
                            <FieldIcon>
                                <UserRound className="h-4 w-4" />
                            </FieldIcon>

                            <div className="min-w-0 flex-1">
                                <Input
                                    id="admin-name"
                                    placeholder="Nome do usuário"
                                    autoComplete="name"
                                    maxLength={120}
                                    disabled={disabled}
                                    aria-invalid={Boolean(form.formState.errors.name)}
                                    {...form.register("name")}
                                />
                            </div>
                        </div>

                        <FormErrorMessage message={form.formState.errors.name?.message} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="admin-email">E-mail *</Label>

                        <div className="flex items-center gap-3">
                            <FieldIcon>
                                <Mail className="h-4 w-4" />
                            </FieldIcon>

                            <div className="min-w-0 flex-1">
                                <Input
                                    id="admin-email"
                                    type="email"
                                    placeholder="usuario@example.com"
                                    autoComplete="email"
                                    inputMode="email"
                                    maxLength={254}
                                    disabled={disabled}
                                    aria-invalid={Boolean(form.formState.errors.email)}
                                    {...form.register("email")}
                                />
                            </div>
                        </div>

                        <FormErrorMessage message={form.formState.errors.email?.message} />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="admin-password">Senha *</Label>

                        <div className="flex items-center gap-3">
                            <FieldIcon>
                                <KeyRound className="h-4 w-4" />
                            </FieldIcon>

                            <div className="min-w-0 flex-1">
                                <AppPasswordInput
                                    id="admin-password"
                                    placeholder="Mínimo de 8 caracteres"
                                    autoComplete="new-password"
                                    maxLength={128}
                                    disabled={disabled}
                                    aria-invalid={Boolean(form.formState.errors.password)}
                                    {...form.register("password")}
                                />
                            </div>
                        </div>

                        <FormErrorMessage message={form.formState.errors.password?.message} />
                    </div>

                    <fieldset
                        className="grid gap-3 md:col-span-2 sm:grid-cols-2"
                        disabled={disabled}
                    >
                        <legend className="sr-only">Permissões e status do usuário</legend>

                        <label
                            className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition-colors ${isAdminSelected
                                    ? "border-primary/25 bg-primary/5 text-primary"
                                    : "border-border/70 bg-background text-muted-foreground hover:border-primary/25 hover:bg-primary/5 hover:text-primary"
                                }`}
                        >
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-input accent-primary"
                                {...form.register("is_admin")}
                            />

                            <ShieldCheck className="h-4 w-4 shrink-0" />

                            <span>
                                <strong className="block font-medium">Administrador</strong>
                                <span className="text-xs opacity-80">
                                    Permite acesso às telas administrativas.
                                </span>
                            </span>
                        </label>

                        <label
                            className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition-colors ${isActiveSelected
                                    ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                    : "border-border/70 bg-background text-muted-foreground hover:border-primary/25 hover:bg-primary/5 hover:text-primary"
                                }`}
                        >
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-input accent-primary"
                                {...form.register("is_active")}
                            />

                            <Power className="h-4 w-4 shrink-0" />

                            <span>
                                <strong className="block font-medium">Ativo</strong>
                                <span className="text-xs opacity-80">
                                    Usuário já pode acessar após a criação.
                                </span>
                            </span>
                        </label>
                    </fieldset>

                    <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-background p-4 shadow-sm md:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm leading-6 text-muted-foreground">
                            Revise nome, e-mail, senha e permissões antes de criar o acesso.
                        </p>

                        <Button
                            type="submit"
                            disabled={disabled}
                            className="h-11 w-full rounded-2xl px-6 sm:w-auto"
                        >
                            {disabled ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                                    Criando
                                </>
                            ) : (
                                <>
                                    <UserPlus className="mr-2 h-4 w-4" aria-hidden="true" />
                                    Criar usuário
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
