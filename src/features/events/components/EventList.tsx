import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ListChecks } from "lucide-react";

import { EventTypeBadge } from "@/features/events/components/EventTypeBadge";
import type { PlantEvent } from "@/features/events/types/eventTypes";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";

type EventListProps = {
    events: PlantEvent[];
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

function hasMetadata(metadata: Record<string, unknown> | null): boolean {
    return Boolean(metadata && Object.keys(metadata).length > 0);
}

export function EventList({ events }: EventListProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Histórico de eventos</CardTitle>
                <CardDescription>
                    Cuidados e observações registrados para esta planta.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="space-y-3">
                    {events.map((event) => (
                        <article
                            key={event.id}
                            className="flex gap-4 rounded-2xl border bg-background p-4"
                        >
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                                <ListChecks className="h-5 w-5" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <h3 className="font-medium">{event.title}</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {formatDateTime(event.occurred_at)}
                                        </p>
                                    </div>

                                    <EventTypeBadge type={event.event_type} />
                                </div>

                                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                                    {event.description?.trim() || "Sem descrição."}
                                </p>

                                {hasMetadata(event.metadata_json) ? (
                                    <pre className="mt-3 overflow-x-auto rounded-xl border bg-muted/50 p-3 text-xs text-muted-foreground">
                                        {JSON.stringify(event.metadata_json, null, 2)}
                                    </pre>
                                ) : null}
                            </div>
                        </article>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}