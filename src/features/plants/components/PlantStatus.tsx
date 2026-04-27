import {
    StatusBadge,
    type StatusBadgeTone
} from "@/shared/components/StatusBadge";

type PlantStatusProps = {
    status?: string | null;
};

const statusLabels: Record<string, string> = {
    healthy: "Saudável",
    attention: "Atenção",
    recovering: "Em recuperação",
    critical: "Crítica"
};

const statusTones: Record<string, StatusBadgeTone> = {
    healthy: "success",
    attention: "warning",
    recovering: "info",
    critical: "danger"
};

export function getPlantStatusLabel(status?: string | null): string {
    if (!status) {
        return "Sem status";
    }

    return statusLabels[status] ?? status;
}

export function PlantStatus({ status }: PlantStatusProps) {
    const tone = status ? statusTones[status] ?? "neutral" : "neutral";

    return <StatusBadge tone={tone}>{getPlantStatusLabel(status)}</StatusBadge>;
}