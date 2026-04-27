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

export function getEventTypeLabel(type: string): string {
    return eventTypeLabels[type] ?? type;
}

export function EventTypeBadge({ type }: EventTypeBadgeProps) {
    return (
        <StatusBadge tone={eventTypeTones[type] ?? "neutral"}>
            {getEventTypeLabel(type)}
        </StatusBadge>
    );
}