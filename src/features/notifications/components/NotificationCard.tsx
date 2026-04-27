import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Bell, CheckCheck, ExternalLink, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { NotificationStatusBadge } from "@/features/notifications/components/NotificationStatusBadge";
import type { NotificationItem } from "@/features/notifications/types/notificationTypes";
import { Button } from "@/shared/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";

type NotificationCardProps = {
    notification: NotificationItem;
    isMutating?: boolean;
    onMarkRead: (notificationId: number) => void;
    onDiscard: (notificationId: number) => void;
};

function formatDateTime(value: string | null): string {
    const normalized = value?.trim();

    if (!normalized) {
        return "Não informado";
    }

    const date = new Date(normalized);

    if (Number.isNaN(date.getTime())) {
        return normalized;
    }

    return format(date, "dd/MM/yyyy HH:mm", {
        locale: ptBR
    });
}

function isPositiveInteger(value: number | null): value is number {
    return Number.isInteger(value) && Number(value) > 0;
}

function safeText(value: string, fallback: string): string {
    const normalized = value.trim();
    return normalized || fallback;
}

export function NotificationCard({
    notification,
    isMutating = false,
    onMarkRead,
    onDiscard
}: NotificationCardProps) {
    const isValidNotificationId = isPositiveInteger(notification.id);
    const plantId = isPositiveInteger(notification.plant_id)
        ? notification.plant_id
        : null;

    const title = safeText(notification.title, "Notificação sem título");
    const body = safeText(notification.body, "Sem detalhes adicionais.");
    const typeLabel = safeText(notification.type, "Tipo não informado");

    const canMarkRead =
        isValidNotificationId &&
        notification.status !== "read" &&
        notification.status !== "discarded";
    const canDiscard = isValidNotificationId && notification.status !== "discarded";

    return (
        <Card aria-busy={isMutating}>
            <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                            <Bell className="h-5 w-5" aria-hidden="true" />
                        </div>

                        <div className="min-w-0">
                            <CardTitle className="break-words text-base">{title}</CardTitle>
                            <p className="mt-1 break-words text-sm text-muted-foreground">
                                {formatDateTime(notification.created_at)} · {typeLabel}
                            </p>
                        </div>
                    </div>

                    <NotificationStatusBadge status={notification.status} />
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <p className="whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
                    {body}
                </p>

                <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                    <div className="rounded-xl border bg-background px-3 py-2">
                        Lida em: {formatDateTime(notification.read_at)}
                    </div>
                    <div className="rounded-xl border bg-background px-3 py-2">
                        Descartada em: {formatDateTime(notification.discarded_at)}
                    </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    {plantId ? (
                        <Button asChild variant="outline" size="sm">
                            <Link to={`/app/plants/${plantId}`}>
                                <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
                                Abrir planta
                            </Link>
                        </Button>
                    ) : null}

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={!canMarkRead || isMutating}
                        aria-label={`Marcar notificação ${title} como lida`}
                        onClick={() => onMarkRead(notification.id)}
                    >
                        <CheckCheck className="mr-2 h-4 w-4" aria-hidden="true" />
                        Marcar como lida
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={!canDiscard || isMutating}
                        aria-label={`Descartar notificação ${title}`}
                        onClick={() => onDiscard(notification.id)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
                        Descartar
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
