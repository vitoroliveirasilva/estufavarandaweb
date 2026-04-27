import { Bell, Leaf, LogOut, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

import type { AuthUser } from "@/core/auth/authStore";
import { Button } from "@/shared/components/ui/button";

type TopbarProps = {
    user: AuthUser | null;
    canSeeAdmin: boolean;
    isLoggingOut: boolean;
    onLogout: () => void;
};

export function Topbar({ user, canSeeAdmin, isLoggingOut, onLogout }: TopbarProps) {
    const userName = user?.name?.trim() || "Usuário";

    return (
        <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
            <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <Link
                    to="/app"
                    className="flex items-center gap-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:hidden"
                    aria-label="Ir para o dashboard"
                >
                    <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                        <Leaf className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="font-semibold">Estufa</span>
                </Link>

                <div className="hidden lg:block">
                    <p className="text-sm font-medium">Painel web</p>
                    <p className="text-xs text-muted-foreground">
                        Acompanhe plantas, cuidados e histórico em um só lugar.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {user ? (
                        <div className="hidden text-right sm:block">
                            <div className="flex items-center justify-end gap-2">
                                <p className="max-w-56 truncate text-sm font-medium" title={userName}>
                                    {userName}
                                </p>
                                {canSeeAdmin ? (
                                    <ShieldCheck className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                                ) : null}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {canSeeAdmin ? "Administrador" : "Usuário"}
                            </p>
                        </div>
                    ) : null}

                    <Button asChild variant="ghost" size="sm">
                        <Link to="/app/notifications" aria-label="Abrir notificações">
                            <Bell className="mr-2 h-4 w-4" aria-hidden="true" />
                            <span className="hidden sm:inline">Notificações</span>
                        </Link>
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isLoggingOut}
                        aria-busy={isLoggingOut}
                        className="lg:hidden"
                        onClick={onLogout}
                    >
                        <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                        {isLoggingOut ? "Saindo..." : "Sair"}
                    </Button>
                </div>
            </div>
        </header>
    );
}
