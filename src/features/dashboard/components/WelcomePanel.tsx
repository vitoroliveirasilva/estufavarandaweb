import { Leaf, Plus } from "lucide-react";
import { Link } from "react-router-dom";

import type { AuthUser } from "@/core/auth/authStore";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { Button } from "@/shared/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";

type WelcomePanelProps = {
    readonly user: AuthUser | null;
};

function getUserDisplayName(user: AuthUser | null): string {
    const name = user?.name.trim();

    if (name) {
        return name;
    }

    const emailPrefix = user?.email.split("@").at(0)?.trim();

    return emailPrefix || "usuário";
}

export function WelcomePanel({ user }: WelcomePanelProps) {
    const displayName = getUserDisplayName(user);

    return (
        <Card className="overflow-hidden">
            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                <div>
                    <CardHeader>
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                            <StatusBadge tone="success">Sessão ativa</StatusBadge>
                            {user?.is_admin ? <StatusBadge tone="info">Admin</StatusBadge> : null}
                        </div>

                        <CardTitle className="text-2xl sm:text-3xl">
                            Olá, {displayName}
                        </CardTitle>
                        <CardDescription className="mt-2 max-w-2xl text-base leading-7">
                            Sua estufa web está autenticada e pronta para gerenciar plantas,
                            regas, eventos, notificações, clima, fotos e consultas com IA.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="flex flex-col gap-3 sm:flex-row">
                        <Button asChild>
                            <Link to="/app/plants/new" aria-label="Cadastrar nova planta">
                                <Plus aria-hidden="true" className="mr-2 h-4 w-4" />
                                Cadastrar planta
                            </Link>
                        </Button>

                        <Button asChild variant="outline">
                            <Link to="/app/plants">Ver minhas plantas</Link>
                        </Button>
                    </CardContent>
                </div>

                <aside className="hidden border-l bg-secondary/60 p-6 lg:flex lg:flex-col lg:justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-sm">
                        <Leaf aria-hidden="true" className="h-7 w-7" />
                    </div>

                    <div>
                        <p className="text-sm font-medium">Estufa da Varanda</p>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            Estrutura web com menu, topbar, área de conteúdo, controle de
                            sessão e rotas principais do MVP.
                        </p>
                    </div>
                </aside>
            </div>
        </Card>
    );
}
