import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Droplets } from "lucide-react";

import type { WateringLog } from "@/features/watering/types/wateringTypes";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";

type WateringLogsListProps = {
    logs: WateringLog[];
};

function formatDateTime(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return format(date, "dd/MM/yyyy HH:mm", {
        locale: ptBR
    });
}

function formatQuantity(value: number | null): string {
    if (typeof value !== "number" || !Number.isFinite(value)) {
        return "Não informada";
    }

    return `${value} ml`;
}

export function WateringLogsList({ logs }: WateringLogsListProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Histórico de regas</CardTitle>
                <CardDescription>
                    Registros mais recentes retornados pela API.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="space-y-3">
                    {logs.map((log) => (
                        <article
                            key={log.id}
                            className="flex gap-4 rounded-2xl border bg-background p-4"
                        >
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                                <Droplets className="h-5 w-5" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                    <h3 className="font-medium">{formatDateTime(log.watered_at)}</h3>
                                    <span className="text-sm font-semibold text-primary">
                                        {formatQuantity(log.quantity_ml)}
                                    </span>
                                </div>

                                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                                    {log.notes?.trim() || "Sem observações."}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}