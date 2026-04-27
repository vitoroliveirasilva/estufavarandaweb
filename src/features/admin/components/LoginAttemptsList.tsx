import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ShieldAlert, ShieldCheck } from "lucide-react";

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

function formatDateTime(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return format(date, "dd/MM/yyyy HH:mm", {
        locale: ptBR
    });
}

export function LoginAttemptsList({ attempts }: LoginAttemptsListProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Tentativas de login</CardTitle>
                <CardDescription>
                    Auditoria administrativa retornada pela API.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
                {attempts.map((attempt) => (
                    <article
                        key={attempt.id}
                        className="flex gap-4 rounded-2xl border bg-background p-4"
                    >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                            {attempt.success ? (
                                <ShieldCheck className="h-5 w-5" />
                            ) : (
                                <ShieldAlert className="h-5 w-5" />
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <h3 className="font-medium">{attempt.email}</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {formatDateTime(attempt.created_at)}
                                    </p>
                                </div>

                                <StatusBadge tone={attempt.success ? "success" : "danger"}>
                                    {attempt.success ? "Sucesso" : "Falha"}
                                </StatusBadge>
                            </div>

                            <div className="mt-3 grid gap-2 text-xs text-muted-foreground lg:grid-cols-2">
                                <div className="rounded-xl border bg-card px-3 py-2">
                                    IP: {attempt.ip || "Não informado"}
                                </div>
                                <div className="rounded-xl border bg-card px-3 py-2">
                                    User agent: {attempt.user_agent || "Não informado"}
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </CardContent>
        </Card>
    );
}