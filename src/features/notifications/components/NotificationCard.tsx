import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    Bell,
    CheckCheck,
    Clock3,
    ExternalLink,
    Leaf,
    Trash2
} from "lucide-react";
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

function formatDateTime(value?: string | null): string {
    const normalized = value?.trim();

    if (!normalized) {
        return "Não informado";
    }

    const date = new Date(normalized);

    if (Number.isNaN(date.getTime())) {
        return normalized;
    }

    return format(date, "dd/MM/yyyy 'às' HH:mm", {
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

function humanizeType(value: string): string {
    const normalized = value.trim();

    if (!normalized) {
        return "Tipo não informado";
    }

    return normalized
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .replace(/^./, (char) => char.toUpperCase());
}

function getCardClassName(status: string): string {
    if (status === "pending") {
        return "border-primary/20 bg-primary/[0.025]";
    }

    if (status === "discarded") {
        return "border-border/70 bg-muted/20 opacity-90";
    }

    return "border-border/70 bg-card";
}

function getIconClassName(status: string): string {
    if (status === "pending") {
        return "border-primary/15 bg-primary/10 text-primary";
    }

    if (status === "discarded") {
        return "border-border bg-muted text-muted-foreground";
    }

    return "border-border bg-background text-primary";
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
    const typeLabel = humanizeType(notification.type);

    const canMarkRead =
        isValidNotificationId &&
        notification.status !== "read" &&
        notification.status !== "discarded";

    const canDiscard =
        isValidNotificationId && notification.status !== "discarded";

    const timelineItems = [
        notification.read_at
            ? {
                label: "Lida em",
                value: formatDateTime(notification.read_at),
                icon: CheckCheck
            }
            : null,
        notification.discarded_at
            ? {
                label: "Descartada em",
                value: formatDateTime(notification.discarded_at),
                icon: Trash2
            }
            : null
    ].filter(Boolean);

    return (
        <Card
            aria-busy={isMutating}
            className={`overflow-hidden shadow-sm transition-shadow duration-200 hover:shadow-[0_12px_32px_rgba(15,23,42,0.16)] ${getCardClassName(
                notification.status
            )}`}
        >
            <CardHeader className="pb-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 gap-4">
                        <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${getIconClassName(
                                notification.status
                            )}`}
                        >
                            <Bell className="h-5 w-5" aria-hidden="true" />
                        </div>

                        <div className="min-w-0 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <CardTitle className="break-words text-base font-semibold leading-6">
                                    {title}
                                </CardTitle>
                                <NotificationStatusBadge status={notification.status} />
                            </div>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                                <span className="inline-flex items-center gap-1.5">
                                    <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                                    {formatDateTime(notification.created_at)}
                                </span>

                                <span className="inline-flex items-center gap-1.5">
                                    <Bell className="h-3.5 w-3.5" aria-hidden="true" />
                                    {typeLabel}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="rounded-2xl border border-border/70 bg-background px-4 py-3">
                    <p className="whitespace-pre-wrap break-words text-sm leading-7 text-muted-foreground">
                        {body}
                    </p>
                </div>

                {timelineItems.length > 0 ? (
                    <div className="grid gap-2 sm:grid-cols-2">
                        {timelineItems.map((item) => {
                            if (!item) {
                                return null;
                            }

                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.label}
                                    className="flex items-center gap-2 rounded-2xl border border-border/70 bg-background px-3 py-2 text-xs text-muted-foreground"
                                >
                                    <Icon
                                        className="h-3.5 w-3.5 shrink-0 text-primary"
                                        aria-hidden="true"
                                    />
                                    <span className="font-medium text-foreground">
                                        {item.label}:
                                    </span>
                                    <span className="min-w-0 break-words">
                                        {item.value}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                ) : null}

                <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:flex-wrap">
                    {plantId ? (
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="rounded-2xl"
                        >
                            <Link to={`/app/plants/${plantId}`}>
                                <Leaf className="mr-2 h-4 w-4" aria-hidden="true" />
                                Abrir planta
                                <ExternalLink
                                    className="ml-2 h-3.5 w-3.5"
                                    aria-hidden="true"
                                />
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
                        className="rounded-2xl"
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
                        className="rounded-2xl text-muted-foreground hover:bg-destructive/5 hover:border-destructive/30 hover:text-destructive"
                    >
                        <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
                        Descartar
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}