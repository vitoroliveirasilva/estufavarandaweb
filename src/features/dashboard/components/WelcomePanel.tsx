import type { AuthUser } from "@/core/auth/authStore";
import { StatusBadge } from "@/shared/components/StatusBadge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Leaf, Plus } from "lucide-react";
import { Link } from "react-router-dom";

type WelcomePanelProps = {
    user: AuthUser | null;
};

export function WelcomePanel({ user }: WelcomePanelProps) {
    return (
        <Card className="overflow-hidden">
            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                <div>
                    <CardHeader>
                        <div className="mb-3 flex items-center gap-2">
                            <StatusBadge tone="success">Sessão ativa</StatusBadge>
                            {user?.is_admin ? (
                                <StatusBadge tone="info">Admin</StatusBadge>
                            ) : null}
                        </div>

                        <CardTitle className="text-2xl sm:text-3xl">
                            {user ? `Olá, ${user.name}` : "Olá"}
                        </CardTitle>
                        <CardDescription className="mt-2 max-w-2xl text-base leading-7">
                            Sua estufa web já está autenticada e pronta para receber os
                            módulos de plantas, regas, eventos, notificações, clima, fotos e
                            IA nos próximos blocos.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="flex flex-col gap-3 sm:flex-row">
                        <Button asChild>
                            <Link to="/app/plants/new">
                                <Plus className="mr-2 h-4 w-4" />
                                Cadastrar planta
                            </Link>
                        </Button>

                        <Button asChild variant="outline">
                            <Link to="/app/plants">Ver minhas plantas</Link>
                        </Button>
                    </CardContent>
                </div>

                <div className="hidden border-l bg-secondary/60 p-6 lg:flex lg:flex-col lg:justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-sm">
                        <Leaf className="h-7 w-7" />
                    </div>

                    <div>
                        <p className="text-sm font-medium">Estufa da Varanda</p>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            O front agora tem estrutura de sistema: menu, topbar, área de
                            conteúdo, sessão e rotas principais.
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
}