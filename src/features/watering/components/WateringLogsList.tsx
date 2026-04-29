import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    CalendarClock,
    Droplets,
    FileText,
    History,
    Ruler
} from "lucide-react";

import type { WateringLog } from "@/features/watering/types/wateringTypes";
import { EmptyState } from "@/shared/components/EmptyState";
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

function parseDate(value: string): Date | null {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value: string): string {
    const date = parseDate(value);

    if (!date) {
        return value || "Data não informada";
    }

    return format(date, "dd/MM/yyyy", {
        locale: ptBR
    });
}

function formatTime(value: string): string {
    const date = parseDate(value);

    if (!date) {
        return "Horário não informado";
    }

    return format(date, "HH:mm", {
        locale: ptBR
    });
}

function formatQuantity(value: number | null): string {
    if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
        return "Quantidade não informada";
    }

    return `${Math.round(value).toLocaleString("pt-BR")} ml`;
}

function getLogTitle(index: number): string {
    return index === 0 ? "Rega mais recente" : ``;
}

export function WateringLogsList({ logs }: WateringLogsListProps) {
    return (
        <Card className="overflow-hidden border-border/70 bg-card shadow-sm">
            <CardHeader className="border-b bg-muted/20 pb-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-background text-primary shadow-sm">
                        <History className="h-5 w-5" aria-hidden="true" />
                    </div>

                    <div className="min-w-0 space-y-1">
                        <CardTitle className="text-lg">Histórico de regas</CardTitle>
                        <CardDescription className="leading-6">
                            Registros salvos como histórico da planta, exibidos em ordem
                            cronológica mais recente.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-4">
                {logs.length === 0 ? (
                    <EmptyState
                        icon={<Droplets className="h-6 w-6" />}
                        title="Nenhuma rega registrada"
                        description="Registre a primeira rega para criar o histórico desta planta."
                    />
                ) : (
                    <div className="space-y-4">
                        {logs.map((log, index) => (
                            <article
                                key={log.id}
                                className="overflow-hidden rounded-3xl border border-border/70 bg-background shadow-sm"
                            >
                                <div className="border-b border-border/70 bg-muted/20 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-background text-primary shadow-sm">
                                            <Droplets className="h-5 w-5" aria-hidden="true" />
                                        </div>

                                        <div className="min-w-0 space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="break-words font-semibold text-foreground">
                                                    {getLogTitle(index)}
                                                </h3>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                                <span className="inline-flex items-center">
                                                    <CalendarClock className="mr-1.5 h-4 w-4 text-primary" />
                                                    {formatDate(log.watered_at)} às{" "}
                                                    {formatTime(log.watered_at)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-3 p-4 md:grid-cols-[16rem_minmax(0,1fr)]">
                                    <div className="rounded-2xl border border-border/70 bg-card px-4 py-3">
                                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                            <Ruler className="h-4 w-4 text-primary" />
                                            Quantidade
                                        </div>

                                        <p className="mt-2 text-sm font-semibold text-foreground">
                                            {formatQuantity(log.quantity_ml)}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-border/70 bg-card px-4 py-3">
                                        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                                            <FileText className="h-4 w-4 text-primary" />
                                            Observações
                                        </div>

                                        <p className="whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
                                            {log.notes?.trim() || "Sem observações registradas."}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
