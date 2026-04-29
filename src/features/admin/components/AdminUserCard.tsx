import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    CalendarClock,
    KeyRound,
    Mail,
    Power,
    RotateCcw,
    ShieldCheck,
    User
} from "lucide-react";

import type { AdminUser } from "@/features/admin/types/adminTypes";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { Button } from "@/shared/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";

type AdminUserCardProps = {
    user: AdminUser;
    isCurrentUser?: boolean;
    isMutating?: boolean;
    onActivate: (userId: number) => void;
    onDeactivate: (userId: number) => void;
    onResetPassword: (userId: number) => void;
    onRevokeSessions: (userId: number) => void;
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

export function AdminUserCard({
    user,
    isCurrentUser = false,
    isMutating = false,
    onActivate,
    onDeactivate,
    onResetPassword,
    onRevokeSessions
}: AdminUserCardProps) {
    const displayName = displayText(user.name, "Usuário sem nome");
    const displayEmail = displayText(user.email, "E-mail não informado");
    const cannotMutateCurrentUser = isCurrentUser && user.is_active;
    const currentUserTitle = "Não é permitido executar esta ação no seu próprio usuário.";

    return (
        <Card className="overflow-hidden border-border/70 bg-card shadow-sm transition-shadow hover:shadow-md">
            <CardHeader className="border-b bg-muted/20 pb-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 gap-4">
                        <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-sm ${user.is_admin
                                    ? "border-primary/20 bg-primary/10 text-primary"
                                    : "border-border/70 bg-background text-muted-foreground"
                                }`}
                        >
                            {user.is_admin ? (
                                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                            ) : (
                                <User className="h-5 w-5" aria-hidden="true" />
                            )}
                        </div>

                        <div className="min-w-0">
                            <CardTitle className="break-words text-base">
                                {displayName}
                            </CardTitle>

                            <p className="mt-2 flex items-center gap-2 break-all text-sm text-muted-foreground">
                                <Mail className="h-4 w-4 shrink-0 text-primary" />
                                {displayEmail}
                            </p>
                        </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                        <StatusBadge tone={user.is_active ? "success" : "danger"}>
                            {user.is_active ? "Ativo" : "Inativo"}
                        </StatusBadge>

                        {user.is_admin ? <StatusBadge tone="info">Admin</StatusBadge> : null}

                        {isCurrentUser ? <StatusBadge tone="neutral">Você</StatusBadge> : null}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4 p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-border/70 bg-background px-4 py-3 shadow-sm">
                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            <CalendarClock className="h-4 w-4 text-primary" />
                            Último login
                        </div>

                        <p className="mt-2 text-sm font-semibold text-foreground">
                            {formatDateTime(user.last_login_at)}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-border/70 bg-background px-4 py-3 shadow-sm">
                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            <CalendarClock className="h-4 w-4 text-primary" />
                            Criado em
                        </div>

                        <p className="mt-2 text-sm font-semibold text-foreground">
                            {formatDateTime(user.created_at)}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    {user.is_active ? (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isMutating || cannotMutateCurrentUser}
                            title={cannotMutateCurrentUser ? currentUserTitle : undefined}
                            aria-label={`Desativar usuário ${displayName}`}
                            className="h-10 rounded-2xl hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => onDeactivate(user.id)}
                        >
                            <Power className="mr-2 h-4 w-4" aria-hidden="true" />
                            Desativar
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isMutating}
                            aria-label={`Ativar usuário ${displayName}`}
                            className="h-10 rounded-2xl hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-700"
                            onClick={() => onActivate(user.id)}
                        >
                            <Power className="mr-2 h-4 w-4" aria-hidden="true" />
                            Ativar
                        </Button>
                    )}

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isMutating}
                        aria-label={`Resetar senha do usuário ${displayName}`}
                        className="h-10 rounded-2xl"
                        onClick={() => onResetPassword(user.id)}
                    >
                        <KeyRound className="mr-2 h-4 w-4" aria-hidden="true" />
                        Resetar senha
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isMutating || cannotMutateCurrentUser}
                        title={cannotMutateCurrentUser ? currentUserTitle : undefined}
                        aria-label={`Revogar sessões do usuário ${displayName}`}
                        className="h-10 rounded-2xl"
                        onClick={() => onRevokeSessions(user.id)}
                    >
                        <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                        Revogar sessões
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
