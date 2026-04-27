import { ShieldAlert, Users } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { getAppErrorMessage } from "@/core/api/apiError";
import { useAuthUser } from "@/core/auth/authStore";
import { AdminUserCard } from "@/features/admin/components/AdminUserCard";
import { AdminUserCreateForm } from "@/features/admin/components/AdminUserCreateForm";
import { AdminUsersFilters } from "@/features/admin/components/AdminUsersFilters";
import {
    normalizeAdminCreateUserFormValues,
    useActivateAdminUserMutation,
    useAdminUsers,
    useCreateAdminUserMutation,
    useDeactivateAdminUserMutation,
    useResetAdminUserPasswordMutation,
    useRevokeAdminUserSessionsMutation
} from "@/features/admin/hooks/useAdmin";
import type { AdminCreateUserFormValues } from "@/features/admin/schemas/adminSchemas";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { LoadingState } from "@/shared/components/LoadingState";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/components/ui/button";

function parsePositiveInt(value: string | null, fallback: number): number {
    if (!value) {
        return fallback;
    }

    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function AdminUsersPage() {
    const currentUser = useAuthUser();
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parsePositiveInt(searchParams.get("page"), 1);
    const pageSize = parsePositiveInt(searchParams.get("page_size"), 20);
    const search = searchParams.get("search") ?? "";

    const usersQuery = useAdminUsers({
        page,
        page_size: pageSize,
        search: search || undefined
    });

    const createMutation = useCreateAdminUserMutation();
    const activateMutation = useActivateAdminUserMutation();
    const deactivateMutation = useDeactivateAdminUserMutation();
    const resetPasswordMutation = useResetAdminUserPasswordMutation();
    const revokeSessionsMutation = useRevokeAdminUserSessionsMutation();

    if (!currentUser?.is_admin) {
        return (
            <ErrorState
                title="Acesso administrativo necessário"
                description="Você não tem permissão para acessar esta área."
            />
        );
    }

    const total = usersQuery.data?.meta?.total ?? usersQuery.data?.items.length ?? 0;
    const totalPages =
        usersQuery.data?.meta?.total_pages ?? Math.max(1, Math.ceil(total / pageSize));
    const hasUsers = Boolean(usersQuery.data?.items.length);

    const mutationError =
        createMutation.error ??
        activateMutation.error ??
        deactivateMutation.error ??
        resetPasswordMutation.error ??
        revokeSessionsMutation.error;

    const isMutating =
        createMutation.isPending ||
        activateMutation.isPending ||
        deactivateMutation.isPending ||
        resetPasswordMutation.isPending ||
        revokeSessionsMutation.isPending;

    function updateParams(nextSearch: string, nextPage = 1) {
        const next = new URLSearchParams();

        next.set("page", String(nextPage));
        next.set("page_size", String(pageSize));

        if (nextSearch.trim()) {
            next.set("search", nextSearch.trim());
        }

        setSearchParams(next);
    }

    function clearFilters() {
        const next = new URLSearchParams();
        next.set("page", "1");
        next.set("page_size", String(pageSize));
        setSearchParams(next);
    }

    function goToPage(nextPage: number) {
        updateParams(search, nextPage);
    }

    async function handleCreate(values: AdminCreateUserFormValues) {
        await createMutation.mutateAsync(normalizeAdminCreateUserFormValues(values));
    }

    function handleActivate(userId: number) {
        activateMutation.mutate(userId);
    }

    function handleDeactivate(userId: number) {
        const confirmed = window.confirm("Desativar este usuário?");

        if (!confirmed) {
            return;
        }

        deactivateMutation.mutate(userId);
    }

    function handleResetPassword(userId: number) {
        const newPassword = window.prompt("Informe a nova senha, mínimo 8 caracteres:");

        if (!newPassword) {
            return;
        }

        if (newPassword.length < 8) {
            window.alert("A senha deve ter pelo menos 8 caracteres.");
            return;
        }

        resetPasswordMutation.mutate({
            userId,
            payload: {
                new_password: newPassword
            }
        });
    }

    function handleRevokeSessions(userId: number) {
        const confirmed = window.confirm("Revogar todas as sessões deste usuário?");

        if (!confirmed) {
            return;
        }

        revokeSessionsMutation.mutate(userId);
    }

    return (
        <>
            <PageHeader
                eyebrow="Admin"
                title="Usuários"
                description="Administração de usuários, status, senha e sessões."
            />

            <div className="space-y-5">
                <AdminUserCreateForm
                    isSubmitting={createMutation.isPending}
                    apiErrorMessage={
                        createMutation.error ? getAppErrorMessage(createMutation.error) : null
                    }
                    onSubmit={handleCreate}
                />

                <AdminUsersFilters
                    value={search}
                    isFetching={usersQuery.isFetching}
                    onChange={(nextSearch) => updateParams(nextSearch)}
                    onClear={clearFilters}
                />

                {mutationError ? (
                    <ErrorState
                        title="Não foi possível concluir a ação"
                        description={getAppErrorMessage(mutationError)}
                    />
                ) : null}

                {usersQuery.isLoading ? (
                    <LoadingState
                        title="Carregando usuários"
                        description="Buscando usuários administrativos na API."
                    />
                ) : null}

                {usersQuery.isError ? (
                    <ErrorState
                        title="Não foi possível carregar os usuários"
                        description={getAppErrorMessage(usersQuery.error)}
                        actionLabel="Tentar novamente"
                        onAction={() => void usersQuery.refetch()}
                    />
                ) : null}

                {!usersQuery.isLoading && !usersQuery.isError && !hasUsers ? (
                    <EmptyState
                        icon={<Users className="h-6 w-6" />}
                        title="Nenhum usuário encontrado"
                        description="Crie um usuário ou ajuste a busca."
                    />
                ) : null}

                {hasUsers ? (
                    <>
                        <div className="space-y-4">
                            {usersQuery.data?.items.map((user) => (
                                <AdminUserCard
                                    key={user.id}
                                    user={user}
                                    isMutating={isMutating}
                                    onActivate={handleActivate}
                                    onDeactivate={handleDeactivate}
                                    onResetPassword={handleResetPassword}
                                    onRevokeSessions={handleRevokeSessions}
                                />
                            ))}
                        </div>

                        <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border bg-card px-4 py-3 sm:flex-row">
                            <p className="text-sm text-muted-foreground">
                                Página {page} de {totalPages} · {total} registro(s)
                            </p>

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={page <= 1 || usersQuery.isFetching}
                                    onClick={() => goToPage(page - 1)}
                                >
                                    Anterior
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={page >= totalPages || usersQuery.isFetching}
                                    onClick={() => goToPage(page + 1)}
                                >
                                    Próxima
                                </Button>
                            </div>
                        </div>
                    </>
                ) : null}

                <div className="rounded-2xl border bg-card p-4 text-sm text-muted-foreground">
                    <div className="flex gap-3">
                        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <p>
                            Por segurança visual, edição completa de usuário fica para refinamento.
                            Este bloco já cobre criação, ativar/desativar, reset de senha e
                            revogação de sessões.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}