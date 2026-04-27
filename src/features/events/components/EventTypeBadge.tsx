import {
    StatusBadge,
    type StatusBadgeTone
} from "@/shared/components/StatusBadge";

type EventTypeBadgeProps = {
    type: string;
};

const eventTypeLabels: Record<string, string> = {
    observation: "Observação",
    pruning: "Poda",
    fertilizing: "Adubação",
    repotting: "Replantio",
    pest_control: "Pragas",
    treatment: "Tratamento",
    watering: "Rega",
    other: "Outro"
};

const eventTypeTones: Record<string, StatusBadgeTone> = {
    observation: "info",
    pruning: "neutral",
    fertilizing: "success",
    repotting: "warning",
    pest_control: "danger",
    treatment: "warning",
    watering: "info",
    other: "neutral"
};

function normalizeEventType(type: string): string {
    return type.trim().toLowerCase();
}

export function getEventTypeLabel(type: string): string {
    const normalized = normalizeEventType(type);

    if (!normalized) {
        return eventTypeLabels.other;
    }

    return eventTypeLabels[normalized] ?? normalized.replaceAll("_", " ");
}

export function EventTypeBadge({ type }: EventTypeBadgeProps) {
    const normalizedType = normalizeEventType(type);

    return (
        <StatusBadge tone={eventTypeTones[normalizedType] ?? "neutral"}>
            {getEventTypeLabel(type)}
        </StatusBadge>
    );
}
