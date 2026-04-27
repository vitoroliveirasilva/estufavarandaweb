import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { KeyRound, Power, RotateCcw, ShieldCheck, User } from "lucide-react";

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

    return format(date, "dd/MM/yyyy HH:mm", {
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
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                            {user.is_admin ? (
                                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                            ) : (
                                <User className="h-5 w-5" aria-hidden="true" />
                            )}
                        </div>

                        <div className="min-w-0">
                            <CardTitle className="break-words text-base">{displayName}</CardTitle>
                            <p className="mt-1 break-all text-sm text-muted-foreground">
                                {displayEmail}
                            </p>
                        </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                        <StatusBadge tone={user.is_active ? "success" : "danger"}>
                            {user.is_active ? "Ativo" : "Inativo"}
                        </StatusBadge>
                        {user.is_admin ? <StatusBadge tone="info">Admin</StatusBadge> : null}
                        {isCurrentUser ? <StatusBadge tone="info">Você</StatusBadge> : null}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                    <div className="rounded-xl border bg-background px-3 py-2">
                        Último login: {formatDateTime(user.last_login_at)}
                    </div>
                    <div className="rounded-xl border bg-background px-3 py-2">
                        Criado em: {formatDateTime(user.created_at)}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {user.is_active ? (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isMutating || cannotMutateCurrentUser}
                            title={cannotMutateCurrentUser ? currentUserTitle : undefined}
                            aria-label={`Desativar usuário ${displayName}`}
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
