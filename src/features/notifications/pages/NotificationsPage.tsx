import { useMemo } from "react";
import { Bell } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { getAppErrorMessage } from "@/core/api/apiError";
import { NotificationCard } from "@/features/notifications/components/NotificationCard";
import {
    NotificationFilters,
    type NotificationFiltersValue
} from "@/features/notifications/components/NotificationFilters";
import {
    useDiscardNotificationMutation,
    useMarkNotificationReadMutation,
    useNotificationsList
} from "@/features/notifications/hooks/useNotifications";
import type { NotificationListParams } from "@/features/notifications/types/notificationTypes";
import { isKnownNotificationStatus } from "@/features/notifications/types/notificationTypes";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { LoadingState } from "@/shared/components/LoadingState";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/components/ui/button";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

function parsePositiveInt(
    value: string | null | undefined,
    fallback: number
): number {
    if (!value) {
        return fallback;
    }

    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function parsePageSize(value: string | null): number {
    const parsed = parsePositiveInt(value, DEFAULT_PAGE_SIZE);
    return PAGE_SIZE_OPTIONS.includes(parsed as (typeof PAGE_SIZE_OPTIONS)[number])
        ? parsed
        : DEFAULT_PAGE_SIZE;
}

function parseStatusFilter(
    value: string | null | undefined
): NotificationFiltersValue["status"] {
    const normalized = value?.trim();
    return normalized && isKnownNotificationStatus(normalized) ? normalized : "";
}

function getFilters(searchParams: URLSearchParams): NotificationFiltersValue {
    return {
        status: parseStatusFilter(searchParams.get("status"))
    };
}

function isPositiveInteger(value: number): boolean {
    return Number.isInteger(value) && value > 0;
}

export function NotificationsPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parsePositiveInt(searchParams.get("page"), DEFAULT_PAGE);
    const pageSize = parsePageSize(searchParams.get("page_size"));
    const filters = getFilters(searchParams);

    const queryParams = useMemo<NotificationListParams>(
        () => ({
            page,
            page_size: pageSize,
            status: filters.status || undefined
        }),
        [filters.status, page, pageSize]
    );

    const notificationsQuery = useNotificationsList(queryParams);
    const markReadMutation = useMarkNotificationReadMutation();
    const discardMutation = useDiscardNotificationMutation();

    const total =
        notificationsQuery.data?.meta?.total ??
        notificationsQuery.data?.items.length ??
        0;
    const totalPages = Math.max(
        1,
        notificationsQuery.data?.meta?.total_pages ?? Math.ceil(total / pageSize)
    );
    const hasItems = Boolean(notificationsQuery.data?.items.length);
    const mutationError = markReadMutation.error ?? discardMutation.error;

    const mutatingNotificationIds = useMemo(() => {
        const ids = new Set<number>();

        if (markReadMutation.isPending && markReadMutation.variables) {
            ids.add(markReadMutation.variables);
        }

        if (discardMutation.isPending && discardMutation.variables) {
            ids.add(discardMutation.variables);
        }

        return ids;
    }, [discardMutation.isPending, discardMutation.variables, markReadMutation.isPending, markReadMutation.variables]);

    function updateParams(nextFilters: NotificationFiltersValue, nextPage = 1) {
        const next = new URLSearchParams();

        next.set("page", String(nextPage));
        next.set("page_size", String(pageSize));

        if (nextFilters.status) {
            next.set("status", nextFilters.status);
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
        const safeNextPage = Math.min(Math.max(nextPage, 1), totalPages);
        updateParams(filters, safeNextPage);
    }

    function handleMarkRead(notificationId: number) {
        if (!isPositiveInteger(notificationId)) {
            return;
        }

        markReadMutation.mutate(notificationId);
    }

    function handleDiscard(notificationId: number) {
        if (!isPositiveInteger(notificationId)) {
            return;
        }

        const confirmed = window.confirm("Descartar esta notificação?");

        if (!confirmed) {
            return;
        }

        discardMutation.mutate(notificationId);
    }

    return (
        <>
            <PageHeader
                eyebrow="Notificações"
                title="Central de notificações"
                description="Listagem integrada à API, com filtros, leitura e descarte."
            />

            <div className="space-y-5">
                <NotificationFilters
                    value={filters}
                    isFetching={notificationsQuery.isFetching}
                    onChange={(nextFilters) => updateParams(nextFilters)}
                    onClear={clearFilters}
                />

                <div aria-live="polite" className="sr-only">
                    {notificationsQuery.isFetching ? "Atualizando notificações" : ""}
                </div>

                {mutationError ? (
                    <ErrorState
                        title="Não foi possível atualizar a notificação"
                        description={getAppErrorMessage(mutationError)}
                    />
                ) : null}

                {notificationsQuery.isLoading ? (
                    <LoadingState
                        title="Carregando notificações"
                        description="Buscando notificações na API."
                    />
                ) : null}

                {notificationsQuery.isError ? (
                    <ErrorState
                        title="Não foi possível carregar as notificações"
                        description={getAppErrorMessage(notificationsQuery.error)}
                        actionLabel="Tentar novamente"
                        onAction={() => void notificationsQuery.refetch()}
                    />
                ) : null}

                {!notificationsQuery.isLoading && !notificationsQuery.isError && !hasItems ? (
                    <EmptyState
                        icon={<Bell className="h-6 w-6" aria-hidden="true" />}
                        title="Nenhuma notificação encontrada"
                        description="Quando houver alertas de rega, cuidados ou avisos, eles aparecerão aqui."
                    />
                ) : null}

                {hasItems ? (
                    <>
                        <div className="space-y-4">
                            {notificationsQuery.data?.items.map((notification) => (
                                <NotificationCard
                                    key={notification.id}
                                    notification={notification}
                                    isMutating={mutatingNotificationIds.has(notification.id)}
                                    onMarkRead={handleMarkRead}
                                    onDiscard={handleDiscard}
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
                                    disabled={page <= 1 || notificationsQuery.isFetching}
                                    onClick={() => goToPage(page - 1)}
                                >
                                    Anterior
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={page >= totalPages || notificationsQuery.isFetching}
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
