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
    if (!value) {
        return "Não informado";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return format(date, "dd/MM/yyyy HH:mm", {
        locale: ptBR
    });
}

export function NotificationCard({
    notification,
    isMutating = false,
    onMarkRead,
    onDiscard
}: NotificationCardProps) {
    const canMarkRead = notification.status !== "read";
    const canDiscard = notification.status !== "discarded";

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                            <Bell className="h-5 w-5" />
                        </div>

                        <div>
                            <CardTitle className="text-base">{notification.title}</CardTitle>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {formatDateTime(notification.created_at)} · {notification.type}
                            </p>
                        </div>
                    </div>

                    <NotificationStatusBadge status={notification.status} />
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                    {notification.body}
                </p>

                <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                    <div className="rounded-xl border bg-background px-3 py-2">
                        Lida em: {formatDateTime(notification.read_at)}
                    </div>
                    <div className="rounded-xl border bg-background px-3 py-2">
                        Descartada em: {formatDateTime(notification.discarded_at)}
                    </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                    {notification.plant_id ? (
                        <Button asChild variant="outline" size="sm">
                            <Link to={`/app/plants/${notification.plant_id}`}>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Abrir planta
                            </Link>
                        </Button>
                    ) : null}

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={!canMarkRead || isMutating}
                        onClick={() => onMarkRead(notification.id)}
                    >
                        <CheckCheck className="mr-2 h-4 w-4" />
                        Marcar como lida
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={!canDiscard || isMutating}
                        onClick={() => onDiscard(notification.id)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Descartar
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}