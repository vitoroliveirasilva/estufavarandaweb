import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    KeyRound,
    Power,
    RotateCcw,
    ShieldCheck,
    User,
    UserCog
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
        return value;
    }

    return format(date, "dd/MM/yyyy HH:mm", {
        locale: ptBR
    });
}

export function AdminUserCard({
    user,
    isMutating = false,
    onActivate,
    onDeactivate,
    onResetPassword,
    onRevokeSessions
}: AdminUserCardProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                            {user.is_admin ? (
                                <ShieldCheck className="h-5 w-5" />
                            ) : (
                                <User className="h-5 w-5" />
                            )}
                        </div>

                        <div>
                            <CardTitle className="text-base">{user.name}</CardTitle>
                            <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <StatusBadge tone={user.is_active ? "success" : "danger"}>
                            {user.is_active ? "Ativo" : "Inativo"}
                        </StatusBadge>
                        {user.is_admin ? <StatusBadge tone="info">Admin</StatusBadge> : null}
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
                            disabled={isMutating}
                            onClick={() => onDeactivate(user.id)}
                        >
                            <Power className="mr-2 h-4 w-4" />
                            Desativar
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isMutating}
                            onClick={() => onActivate(user.id)}
                        >
                            <Power className="mr-2 h-4 w-4" />
                            Ativar
                        </Button>
                    )}

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isMutating}
                        onClick={() => onResetPassword(user.id)}
                    >
                        <KeyRound className="mr-2 h-4 w-4" />
                        Resetar senha
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isMutating}
                        onClick={() => onRevokeSessions(user.id)}
                    >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Revogar sessões
                    </Button>

                    <Button type="button" variant="ghost" size="sm" disabled>
                        <UserCog className="mr-2 h-4 w-4" />
                        Editar no próximo refinamento
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}