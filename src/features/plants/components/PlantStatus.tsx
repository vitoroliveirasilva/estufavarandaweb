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

function normalizeStatus(status?: string | null): string | null {
    const normalized = status?.trim().toLowerCase();
    return normalized || null;
}

export function getPlantStatusLabel(status?: string | null): string {
    const normalized = normalizeStatus(status);

    if (!normalized) {
        return "Sem status";
    }

    return statusLabels[normalized] ?? status?.trim() ?? normalized;
}

export function PlantStatus({ status }: PlantStatusProps) {
    const normalized = normalizeStatus(status);
    const tone = normalized ? statusTones[normalized] ?? "neutral" : "neutral";

    return <StatusBadge tone={tone}>{getPlantStatusLabel(status)}</StatusBadge>;
}
