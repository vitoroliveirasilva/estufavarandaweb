import {
    StatusBadge,
    type StatusBadgeTone
} from "@/shared/components/StatusBadge";

type NotificationStatusBadgeProps = {
    status: string;
};

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

export function NotificationStatusBadge({
    status
}: NotificationStatusBadgeProps) {
    return (
        <StatusBadge tone={tones[status] ?? "neutral"}>
            {labels[status] ?? status}
        </StatusBadge>
    );
}