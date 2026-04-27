import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";

import {
    adminCreateUserSchema,
    defaultAdminCreateUserFormValues,
    type AdminCreateUserFormValues
} from "@/features/admin/schemas/adminSchemas";
import { FormErrorMessage } from "@/shared/components/FormErrorMessage";
import { AppPasswordInput } from "@/shared/components/AppPasswordInput";
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

export function AdminUserCreateForm({
    isSubmitting = false,
    apiErrorMessage,
    onSubmit
}: AdminUserCreateFormProps) {
    const form = useForm<AdminCreateUserFormValues>({
        resolver: zodResolver(adminCreateUserSchema),
        defaultValues: defaultAdminCreateUserFormValues
    });

    const disabled = isSubmitting || form.formState.isSubmitting;

    const handleSubmit = form.handleSubmit(async (values) => {
        await onSubmit(values);
        form.reset(defaultAdminCreateUserFormValues);
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Criar usuário</CardTitle>
                <CardDescription>
                    Cria um usuário administrativo ou comum pela rota de admin.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit} noValidate>
                    {apiErrorMessage ? (
                        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive md:col-span-2">
                            {apiErrorMessage}
                        </div>
                    ) : null}

                    <div className="space-y-2">
                        <Label htmlFor="admin-name">Nome *</Label>
                        <Input
                            id="admin-name"
                            placeholder="Usuário Novo"
                            disabled={disabled}
                            {...form.register("name")}
                        />
                        <FormErrorMessage message={form.formState.errors.name?.message} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="admin-email">E-mail *</Label>
                        <Input
                            id="admin-email"
                            type="email"
                            placeholder="novo@example.com"
                            disabled={disabled}
                            {...form.register("email")}
                        />
                        <FormErrorMessage message={form.formState.errors.email?.message} />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="admin-password">Senha *</Label>
                        <AppPasswordInput
                            id="admin-password"
                            placeholder="Senha1234"
                            disabled={disabled}
                            {...form.register("password")}
                        />
                        <FormErrorMessage message={form.formState.errors.password?.message} />
                    </div>

                    <div className="flex flex-wrap gap-4 md:col-span-2">
                        <label className="flex h-10 items-center gap-2 rounded-xl border px-3 text-sm">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-input accent-primary"
                                disabled={disabled}
                                {...form.register("is_admin")}
                            />
                            Administrador
                        </label>

                        <label className="flex h-10 items-center gap-2 rounded-xl border px-3 text-sm">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-input accent-primary"
                                disabled={disabled}
                                {...form.register("is_active")}
                            />
                            Ativo
                        </label>
                    </div>

                    <div className="flex justify-end md:col-span-2">
                        <Button type="submit" disabled={disabled}>
                            {disabled ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Criando
                                </>
                            ) : (
                                <>
                                    <UserPlus className="mr-2 h-4 w-4" />
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