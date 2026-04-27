import {
    StatusBadge,
    type StatusBadgeTone
} from "@/shared/components/StatusBadge";

import type { NotificationStatus } from "@/features/notifications/types/notificationTypes";

const labels: Record<string, string> = {
    pending: "Pendente",
    read: "Lida",
    discarded: "Descartada"
};

const tones: Record<string, StatusBadgeTone> = {
    pending: "warning",
    read: "success",
    discarded: "neutral"
};

type NotificationStatusBadgeProps = {
    status: NotificationStatus;
};

function formatFallbackStatus(status: string): string {
    const normalized = status.trim();

    if (!normalized) {
        return "Não informado";
    }

    return normalized.length > 32 ? `${normalized.slice(0, 29)}...` : normalized;
}

export function NotificationStatusBadge({
    status
}: NotificationStatusBadgeProps) {
    return (
        <StatusBadge tone={tones[status] ?? "neutral"}>
            {labels[status] ?? formatFallbackStatus(status)}
        </StatusBadge>
    );
}
