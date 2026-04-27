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

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

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

export function LoginAttemptsPage() {
    const currentUser = useAuthUser();
    const isAdmin = Boolean(currentUser?.is_admin);
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parsePositiveInt(searchParams.get("page"), DEFAULT_PAGE);
    const pageSize = parsePositiveInt(
        searchParams.get("page_size"),
        DEFAULT_PAGE_SIZE,
        MAX_PAGE_SIZE
    );

    const attemptsQuery = useLoginAttempts(
        {
            page,
            page_size: pageSize
        },
        { enabled: isAdmin }
    );

    if (!isAdmin) {
        return (
            <ErrorState
                title="Acesso administrativo necessário"
                description="Você não tem permissão para acessar esta área."
            />
        );
    }

    const items = attemptsQuery.data?.items ?? [];
    const total = attemptsQuery.data?.meta?.total ?? items.length;
    const totalPages = getTotalPages(
        total,
        pageSize,
        attemptsQuery.data?.meta?.total_pages
    );
    const hasAttempts = items.length > 0;

    function goToPage(nextPage: number) {
        const next = new URLSearchParams();

        next.set("page", String(Math.min(Math.max(DEFAULT_PAGE, nextPage), totalPages)));
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
                        <LoginAttemptsList attempts={items} />

                        <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border bg-card px-4 py-3 sm:flex-row">
                            <p className="text-sm text-muted-foreground">
                                Página {page} de {totalPages} · {total} registro(s)
                            </p>

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={page <= DEFAULT_PAGE || attemptsQuery.isFetching}
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
