import { Shield } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { getAppErrorMessage } from "@/core/api/apiError";
import { useAuthUser } from "@/core/auth/authStore";
import { LoginAttemptsList } from "@/features/admin/components/LoginAttemptsList";
import { useLoginAttempts } from "@/features/admin/hooks/useAdmin";
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

export function LoginAttemptsPage() {
    const currentUser = useAuthUser();
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parsePositiveInt(searchParams.get("page"), 1);
    const pageSize = parsePositiveInt(searchParams.get("page_size"), 20);

    const attemptsQuery = useLoginAttempts({
        page,
        page_size: pageSize
    });

    if (!currentUser?.is_admin) {
        return (
            <ErrorState
                title="Acesso administrativo necessário"
                description="Você não tem permissão para acessar esta área."
            />
        );
    }

    const total =
        attemptsQuery.data?.meta?.total ?? attemptsQuery.data?.items.length ?? 0;
    const totalPages =
        attemptsQuery.data?.meta?.total_pages ??
        Math.max(1, Math.ceil(total / pageSize));
    const hasAttempts = Boolean(attemptsQuery.data?.items.length);

    function goToPage(nextPage: number) {
        const next = new URLSearchParams();

        next.set("page", String(nextPage));
        next.set("page_size", String(pageSize));

        setSearchParams(next);
    }

    return (
        <>
            <PageHeader
                eyebrow="Admin"
                title="Tentativas de login"
                description="Auditoria de autenticação com paginação."
            />

            <div className="space-y-5">
                {attemptsQuery.isLoading ? (
                    <LoadingState
                        title="Carregando tentativas"
                        description="Buscando auditoria de login na API."
                    />
                ) : null}

                {attemptsQuery.isError ? (
                    <ErrorState
                        title="Não foi possível carregar as tentativas"
                        description={getAppErrorMessage(attemptsQuery.error)}
                        actionLabel="Tentar novamente"
                        onAction={() => void attemptsQuery.refetch()}
                    />
                ) : null}

                {!attemptsQuery.isLoading && !attemptsQuery.isError && !hasAttempts ? (
                    <EmptyState
                        icon={<Shield className="h-6 w-6" />}
                        title="Nenhuma tentativa encontrada"
                        description="Quando houver tentativas de login, elas aparecerão aqui."
                    />
                ) : null}

                {hasAttempts ? (
                    <>
                        <LoginAttemptsList attempts={attemptsQuery.data?.items ?? []} />

                        <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border bg-card px-4 py-3 sm:flex-row">
                            <p className="text-sm text-muted-foreground">
                                Página {page} de {totalPages} · {total} registro(s)
                            </p>

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={page <= 1 || attemptsQuery.isFetching}
                                    onClick={() => goToPage(page - 1)}
                                >
                                    Anterior
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={page >= totalPages || attemptsQuery.isFetching}
                                    onClick={() => goToPage(page + 1)}
                                >
                                    Próxima
                                </Button>
                            </div>
                        </div>
                    </>
                ) : null}
            </div>
        </>
    );
}