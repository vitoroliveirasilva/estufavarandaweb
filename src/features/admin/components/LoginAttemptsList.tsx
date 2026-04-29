import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    CalendarClock,
    Globe2,
    MonitorSmartphone,
    ShieldAlert,
    ShieldCheck
} from "lucide-react";

import type { LoginAttempt } from "@/features/admin/types/adminTypes";
import { StatusBadge } from "@/shared/components/StatusBadge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";

type LoginAttemptsListProps = {
    attempts: LoginAttempt[];
};

function formatDateTime(value?: string | null): string {
    if (!value) {
        return "Não informado";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Data inválida";
    }

    return format(date, "dd/MM/yyyy 'às' HH:mm", {
        locale: ptBR
    });
}

function displayText(value: string | null | undefined, fallback: string): string {
    const trimmed = value?.trim();
    return trimmed ? trimmed : fallback;
}

export function LoginAttemptsList({ attempts }: LoginAttemptsListProps) {
    return (
        <Card className="overflow-hidden border-border/70 bg-card shadow-sm">
            <CardHeader className="border-b bg-muted/20 pb-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-background text-primary shadow-sm">
                        <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                    </div>

                    <div className="min-w-0 space-y-1">
                        <CardTitle className="text-lg">Tentativas de login</CardTitle>
                        <CardDescription className="leading-6">
                            Auditoria de acessos recentes, com status, IP e dispositivo.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-3 p-4">
                {attempts.map((attempt) => {
                    const email = displayText(attempt.email, "E-mail não informado");
                    const ip = displayText(attempt.ip, "Não informado");
                    const userAgent = displayText(attempt.user_agent, "Não informado");

                    return (
                        <article
                            key={attempt.id}
                            className="overflow-hidden rounded-3xl border border-border/70 bg-background shadow-sm"
                        >
                            <div className="flex flex-col gap-3 border-b border-border/70 bg-muted/20 p-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex min-w-0 gap-3">
                                    <div
                                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border shadow-sm ${attempt.success
                                                ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                                : "border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-300"
                                            }`}
                                    >
                                        {attempt.success ? (
                                            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                                        ) : (
                                            <ShieldAlert className="h-5 w-5" aria-hidden="true" />
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="break-all font-semibold text-foreground">
                                            {email}
                                        </h3>

                                        <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                                            <CalendarClock className="h-4 w-4 shrink-0 text-primary" />
                                            {formatDateTime(attempt.created_at)}
                                        </p>
                                    </div>
                                </div>

                                <StatusBadge tone={attempt.success ? "success" : "danger"}>
                                    {attempt.success ? "Sucesso" : "Falha"}
                                </StatusBadge>
                            </div>

                            <div className="grid gap-3 p-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
                                <div className="rounded-2xl border border-border/70 bg-card px-4 py-3">
                                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                        <Globe2 className="h-4 w-4 text-primary" />
                                        IP
                                    </div>

                                    <p className="mt-2 break-words text-sm font-semibold text-foreground">
                                        {ip}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-border/70 bg-card px-4 py-3">
                                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                        <MonitorSmartphone className="h-4 w-4 text-primary" />
                                        Dispositivo
                                    </div>

                                    <p className="mt-2 break-words text-sm leading-6 text-foreground">
                                        {userAgent}
                                    </p>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </CardContent>
        </Card>
    );
}
