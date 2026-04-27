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

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
const MIN_PASSWORD_LENGTH = 8;

function parsePositiveInt(value: string | null, fallback: number, max?: number): number {
    if (!value) {
        return fallback;
    }

    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed <= 0) {
        return fallback;
    }

    return typeof max === "number" ? Math.min(parsed, max) : parsed;
}

function getTotalPages(total: number, pageSize: number, apiTotalPages?: number): number {
    if (apiTotalPages && Number.isInteger(apiTotalPages) && apiTotalPages > 0) {
        return apiTotalPages;
    }

    return Math.max(1, Math.ceil(total / pageSize));
}

export function AdminUsersPage() {
    const currentUser = useAuthUser();
    const isAdmin = Boolean(currentUser?.is_admin);
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parsePositiveInt(searchParams.get("page"), DEFAULT_PAGE);
    const pageSize = parsePositiveInt(
        searchParams.get("page_size"),
        DEFAULT_PAGE_SIZE,
        MAX_PAGE_SIZE
    );
    const search = searchParams.get("search")?.trim() ?? "";

    const usersQuery = useAdminUsers(
        {
            page,
            page_size: pageSize,
            search: search || undefined
        },
        { enabled: isAdmin }
    );

    const createMutation = useCreateAdminUserMutation();
    const activateMutation = useActivateAdminUserMutation();
    const deactivateMutation = useDeactivateAdminUserMutation();
    const resetPasswordMutation = useResetAdminUserPasswordMutation();
    const revokeSessionsMutation = useRevokeAdminUserSessionsMutation();

    if (!isAdmin) {
        return (
            <ErrorState
                title="Acesso administrativo necessário"
                description="Você não tem permissão para acessar esta área."
            />
        );
    }

    const items = usersQuery.data?.items ?? [];
    const total = usersQuery.data?.meta?.total ?? items.length;
    const totalPages = getTotalPages(total, pageSize, usersQuery.data?.meta?.total_pages);
    const hasUsers = items.length > 0;

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

    function updateParams(nextSearch: string, nextPage = DEFAULT_PAGE) {
        const normalizedSearch = nextSearch.trim().replace(/\s+/g, " ");
        const next = new URLSearchParams();

        next.set("page", String(Math.max(DEFAULT_PAGE, nextPage)));
        next.set("page_size", String(pageSize));

        if (normalizedSearch) {
            next.set("search", normalizedSearch);
        }

        setSearchParams(next);
    }

    function clearFilters() {
        const next = new URLSearchParams();
        next.set("page", String(DEFAULT_PAGE));
        next.set("page_size", String(pageSize));
        setSearchParams(next);
    }

    function goToPage(nextPage: number) {
        updateParams(search, Math.min(Math.max(DEFAULT_PAGE, nextPage), totalPages));
    }

    async function handleCreate(values: AdminCreateUserFormValues) {
        createMutation.reset();
        await createMutation.mutateAsync(normalizeAdminCreateUserFormValues(values));
    }

    function handleActivate(userId: number) {
        activateMutation.reset();
        activateMutation.mutate(userId);
    }

    function handleDeactivate(userId: number) {
        if (userId === currentUser?.id) {
            window.alert("Não é permitido desativar o próprio usuário.");
            return;
        }

        const confirmed = window.confirm("Desativar este usuário?");

        if (!confirmed) {
            return;
        }

        deactivateMutation.reset();
        deactivateMutation.mutate(userId);
    }

    function handleResetPassword(userId: number) {
        const newPassword = window.prompt(
            `Informe a nova senha, mínimo ${MIN_PASSWORD_LENGTH} caracteres:`
        );

        if (newPassword === null || newPassword.trim().length === 0) {
            return;
        }

        if (newPassword.length < MIN_PASSWORD_LENGTH) {
            window.alert(`A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`);
            return;
        }

        resetPasswordMutation.reset();
        resetPasswordMutation.mutate({
            userId,
            payload: {
                new_password: newPassword
            }
        });
    }

    function handleRevokeSessions(userId: number) {
        if (userId === currentUser?.id) {
            window.alert("Não é permitido revogar as próprias sessões por esta tela.");
            return;
        }

        const confirmed = window.confirm("Revogar todas as sessões deste usuário?");

        if (!confirmed) {
            return;
        }

        revokeSessionsMutation.reset();
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
                            {items.map((user) => (
                                <AdminUserCard
                                    key={user.id}
                                    user={user}
                                    isCurrentUser={user.id === currentUser?.id}
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
                                    disabled={page <= DEFAULT_PAGE || usersQuery.isFetching}
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
                            Use as ações administrativas somente quando necessário. Alterações de
                            status, senha e sessões podem afetar imediatamente o acesso do usuário.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
